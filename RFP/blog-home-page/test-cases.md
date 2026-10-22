# Test cases: blog-home-page

Run command: runtime `playwright-cli` sequence below (no test script files)

```sh
npm install
npm run dev -- --host 127.0.0.1 --port 5173
playwright-cli open --headed http://127.0.0.1:5173
# execute the per-case CLI checks in the table
playwright-cli close
npm run typecheck
npm run build
```

Baseline: repository has no app, dependencies, or tests; nothing runs yet. `playwright-cli` 0.1.22 is installed and supports `--headed`.

Runtime rule: do not create `*.spec.*`, `*.test.*`, `playwright.config.*`, or a `tests/` directory. Every e2e case is executed live through `playwright-cli` in a headed browser.

| ID | Requirement | Type | Case | Expected |
|---|---|---|---|---|
| TC1 | R1, R2 | happy | Run `playwright-cli snapshot` on `/` and `playwright-cli eval "document.title"`. | The page renders without a build error; the header shows `BlogX` and a `Sign up` link; a hero heading and the card grid are visible. |
| TC2 | R2, R6 | happy | Click `getByRole('link', { name: 'Sign up' })`, then `playwright-cli eval "location.pathname"`. | Path becomes `/signup` and the page shows "Sign up is coming soon". |
| TC3 | R3, R4 | happy | `playwright-cli --raw eval "JSON.stringify([...document.querySelectorAll('article')].map(a => a.innerText))"`. | Exactly 10 cards; each card text includes category, title, excerpt, author, date, and read time; each card has a visible cover element. |
| TC4 | R5 | edge | `playwright-cli --raw eval "JSON.stringify([...document.querySelectorAll('article h2, article h3')].map(h => h.textContent))"`. | 10 unique post titles; no duplicate posts. |
| TC5 | R4 | edge | Run `playwright-cli requests` and `playwright-cli --raw eval "JSON.stringify([...document.images].map(i => i.src))"`. | No external image requests and no remote image URLs; covers are local gradient/SVG. |
| TC6 | R6 | edge | `playwright-cli goto http://127.0.0.1:5173/signup`, find "coming soon", then click the back-to-home link. | Direct URL loads the stub; back link returns to `/` with 10 cards. |
| TC7 | R7 | error | With no `VITE_FIREBASE_*` vars set, load `/`, then run `playwright-cli console` and `playwright-cli requests`. | Page still renders; console has no errors; no Firestore/Storage calls are attempted. |
| TC8 | R3 | edge | `playwright-cli resize 390 844`, then count articles and evaluate scroll width. | Header, hero, and all 10 cards still render; `document.documentElement.scrollWidth <= window.innerWidth`. |
| TC9 | R8 | structural | Inspect the repository for test scripts/config. | No `*.spec.*`, `*.test.*`, `playwright.config.*`, or `tests/` files; TC1-TC8 were executed live via `playwright-cli`. |
| TC10 | R9 | structural | Inspect `.opencode/skills/blog-stack/SKILL.md`. | It records the headed runtime `playwright-cli` e2e convention and the prohibition on committed Playwright test scripts. |

## Results

Date: 2026-10-22
Runtime: `playwright-cli` 0.1.22, headed Chromium, dev server `http://127.0.0.1:5173`
Viewports: 1440x1000 and 390x844
Checks: `npm run typecheck` passed, `npm run build` passed

| ID | Result | Evidence |
|---|---|---|
| TC1 | PASS | Page title `BlogX — Stories worth your time`; header, hero, `Sign up` link, and 10 articles present. |
| TC2 | PASS | Header `Sign up` navigated to `/signup`; heading "Sign up is coming soon" found. |
| TC3 | PASS | 10 articles; every card exposed category, title, excerpt, author, date, and read time; all covers rendered gradients. |
| TC4 | PASS | 10 titles, 10 unique, no duplicates. |
| TC5 | PASS | 0 `<img>` elements; all 22 static requests were local to `127.0.0.1:5173`; no remote image hosts. |
| TC6 | PASS | Direct `goto /signup` loaded the stub; back link returned to `/` with 10 articles. |
| TC7 | PASS | No Firebase env vars; 0 console errors and 0 warnings; no Firestore/Storage/Firebase network requests. |
| TC8 | PASS | At 390x844: 10 articles, `scrollWidth` 375 <= `innerWidth` 390, `Sign up` visible. |
| TC9 | PASS | No `*.spec.*`, `*.test.*`, `playwright.config.*`, or `tests/` files found. |
| TC10 | PASS | `.opencode/skills/blog-stack/SKILL.md` lines 35-40 record the headed runtime convention and no-script rule. |

Note: the skill file changed after opencode started, so restart opencode for the updated skill text to load.

## Deployment

Date: 2026-10-22
Project: `blog-65f42`
Live URL: <https://blog-65f42.web.app>
Command: `firebase use blog-65f42 && npm run typecheck && npm run build && firebase deploy --only hosting`

| Check | Result | Evidence |
|---|---|---|
| Hosting deploy | PASS | Deploy completed; 4 files uploaded and released. |
| Live home page | PASS | Title `BlogX — Stories worth your time`; 10 articles, header `Sign up`, hero present, 0 images, 0 console errors. |
| Live SPA route | PASS | Direct `https://blog-65f42.web.app/signup` returned the sign-up stub heading; no console errors or warnings. |

## Out of scope

- Automated test scripts, test runners, and CI test jobs.
- Real sign-up/auth flows, Firestore reads/writes, and post detail pages.
- Deployment execution and Firebase rules/index changes.
