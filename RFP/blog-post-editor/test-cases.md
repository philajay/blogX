# Test cases: blog-post-editor

Run command: runtime `playwright-cli` sequence below (no test script files)

```sh
npm run dev -- --host 127.0.0.1 --port 5173
playwright-cli open --headed --persistent --profile .playwright-cli/tanituts http://localhost:5173
# execute the per-case CLI checks in the table
playwright-cli close
npm run typecheck
npm run build
```

Baseline: `main` has Google sign-in and a dummy-data home page. Firestore is empty, Storage is empty, Blaze billing is enabled, the default Firestore database is `nam5`, and the bucket is `blog-65f42.firebasestorage.app` in `US-EAST1`.

Runtime rule: do not create `*.spec.*`, `*.test.*`, `playwright.config.*`, or a `tests/` directory. Every e2e case is executed live through `playwright-cli` in a headed browser.

| ID | Requirement | Type | Case | Expected |
|---|---|---|---|---|
| TC1 | R3 | error | Signed out, open `/write` and `/`. | No editor; Google sign-in prompt shown; header has no `Write` link. |
| TC2 | R3 | happy | Sign in with Google, open `/write`. | Editor and preview render; header shows `Write`. |
| TC3 | R4 | happy | Type a heading, bold text, list, link, and fenced code in the markdown textarea. | Preview updates live with the rendered elements and no raw HTML execution. |
| TC4 | R4 | error | Submit with missing title, category, content, and cover. | Field errors appear; no Storage or Firestore writes. |
| TC5 | R5 | error | Select a non-image file, then an image over 5 MB. | Client rejects each with a readable error; no upload begins. |
| TC6 | R5 | happy | Select `assets/1.webp`. | Upload progress appears; object exists at `posts/{uid}/...`; local cover preview appears. |
| TC7 | R6 | happy | Publish the test blog. | Redirects to `/post/{id}`; Firestore doc has Auth `authorId`, server timestamps, cover URL/path, content, excerpt, and read time. |
| TC8 | R7 | happy | Load home before creating any post, then after publishing. | Empty state before; Firestore card after; loading state clears. |
| TC9 | R7 | edge | Seed a temporary older post, then load home. | The newer test blog appears first; remove the temporary post afterward. |
| TC10 | R8 | happy | Open `/post/:id` directly. | Cover, title, author, date, and rendered markdown appear. |
| TC11 | R8 | error | Open `/post/does-not-exist`. | Friendly not-found state; no crash. |
| TC12 | R9 | error | Unauthenticated REST create in Firestore and upload to Storage. | Both are denied; public reads still work. |
| TC13 | R11 | happy | Inspect Firestore and Storage after publishing. | One test blog remains, with the sample WebP stored and linked. |
| TC14 | R4, R7 | edge | Resize to 390x844 on `/write` and home. | No horizontal overflow; editor/preview and cards remain usable. |
| TC15 | R12 | structural | Run typecheck/build, deploy, load live home, `/write`, and `/post/:id`. | All pass; direct routes work; no app console errors. |

## Results

Date: 2026-10-22
Runtime: `playwright-cli` 0.1.22, headed Chrome, dev server `http://localhost:5173`
Profiles: `.playwright-cli/tanituts` (signed in), `.playwright-cli/signedout` (signed out)
Viewports: 1440x1000 and 390x844
Checks: `npm run typecheck` passed, `npm run build` passed

| ID | Result | Evidence |
|---|---|---|
| TC1 | PASS | Signed-out `/write` showed "Sign in to write" and `Continue with Google`; header had no `Write` link; 0 console errors. |
| TC2 | PASS | Signed-in `/write` showed title, category, cover, markdown, `Publish post`, and `Live preview`; header showed `Write`. |
| TC3 | PASS | Preview contained 1 h1, 2 h2, 1 strong, 4 list items, 1 link, 1 fenced code block, and 1 blockquote; no `<script>` injected. |
| TC4 | PASS | Empty submit showed title, category, cover, and content errors; no Storage upload or Firestore write occurred. |
| TC5 | PASS | A `.txt` file produced "Choose an image file"; a 6 MB `.png` produced the 5 MB limit error; no upload started. |
| TC6 | PASS | `assets/1.webp` produced a local preview. A 4 MB upload showed the progressbar (`aria-valuenow` reached 100); the sample WebP object exists under `posts/{uid}/`. |
| TC7 | PASS | Publish redirected to `/post/WmBhqvri4L84C1AaPRd1`; Firestore doc has `authorId`, `createdAt`/`updatedAt` server timestamps, cover path/URL, content, excerpt, and `1 min` read time. |
| TC8 | PASS | Home showed the empty state before publishing, then 1 article and `1 story` with stats `1` story / `1` topic; loading cleared. |
| TC9 | PASS | A temporary post with `createdAt` one day earlier appeared second; the test blog stayed first; temp doc deleted and home returned to 1 article. |
| TC10 | PASS | Direct `/post/WmBhqvri4L84C1AaPRd1` rendered the title, Storage cover, 2 h2 sections, 4 list items, and 1 code block. |
| TC11 | PASS | `/post/does-not-exist` showed `Story not found` with no console errors. |
| TC12 | PASS | Public Firestore read returned 200; unauthenticated Firestore create returned 403 `PERMISSION_DENIED`; unauthenticated Storage upload returned 403. |
| TC13 | PASS | Firestore has exactly one `posts` document; Storage has exactly one `posts/{uid}/1792649946245-1.webp` object; cover URL returns 200 `image/webp`. |
| TC14 | PASS | At 390x844, `/write` and home had `scrollWidth` 375 <= 390; editor, preview, and card remained usable. |
| TC15 | PASS | `npm run typecheck` and `npm run build` passed; Firestore and Storage rules compiled and released; Hosting deployed. Live home showed 1 article with the Storage cover, live `/write` showed the editor while signed in, direct live `/post/WmBhqvri4L84C1AaPRd1` rendered the post; 0 app console errors. Live Google sign-in emitted the known benign COOP SDK diagnostics while the popup closed. |

## Deployment

Date: 2026-10-22
Project: `blog-65f42`
Live URL: <https://blog-65f42.web.app>
Commands: `firebase deploy --only firestore:rules,storage`, then `npm run typecheck && npm run build && firebase deploy --only hosting`

| Check | Result | Evidence |
|---|---|---|
| Firestore rules | PASS | `firestore.rules` compiled and released to `cloud.firestore`. |
| Storage rules | PASS | `storage.rules` compiled and released to `firebase.storage`. |
| Hosting deploy | PASS | Build and hosting release completed. |
| Live home | PASS | 1 article, `Run Claude like a tech lead`, Storage cover; 0 console errors. |
| Live `/write` | PASS | Signed-out prompt before sign-in; signed-in editor after Google sign-in; 0 app console errors. |
| Live `/post/:id` | PASS | Direct route rendered the title and rendered code block; 0 console errors. |
| Public cover URL | PASS | Storage download URL returned 200 with `image/webp`. |

## Merge and push

Date: 2026-10-22
- Feature commit: `2a5eb32` (`feat: add markdown editor and Firestore posts`)
- Merge commit on `main`: `93e4b64` (`Merge branch 'feature/blog-post-editor'`)
- `main` pushed to `origin/main`
- `feature/blog-post-editor` pushed to `origin/feature/blog-post-editor` and kept alive
- The test blog `WmBhqvri4L84C1AaPRd1` remains in Firestore and Storage.

## Out of scope

- Automated test scripts, test runners, and CI test jobs.
- Edit/delete UI, drafts, inline images, WYSIWYG, comments, likes, search, and pagination.
- Firestore composite indexes; the home query only orders by `createdAt`.
