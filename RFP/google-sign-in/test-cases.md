# Test cases: google-sign-in

Run command: runtime `playwright-cli` sequence below (no test script files)

```sh
npm run dev -- --host 127.0.0.1 --port 5173
playwright-cli open --headed http://127.0.0.1:5173
# execute the per-case CLI checks in the table
playwright-cli close
npm run typecheck
npm run build
```

Baseline: `main` at `c9635a5` has no auth code; `/signup` says "Sign up is coming soon", Firebase Auth is unconfigured in the built app, and project `blog-65f42` has no registered Web App. Google provider is enabled and `localhost`, `blog-65f42.firebaseapp.com`, and `blog-65f42.web.app` are authorized.

Runtime rule: do not create `*.spec.*`, `*.test.*`, `playwright.config.*`, or a `tests/` directory. Every e2e case is executed live through `playwright-cli` in a headed browser.

| ID | Requirement | Type | Case | Expected |
|---|---|---|---|---|
| TC1 | R1, R2 | happy | Load `/`, run `playwright-cli snapshot`, `playwright-cli console`, and `playwright-cli requests`. | Header shows `BlogX` and `Sign up`; home renders 10 cards; no auth or Firebase console errors. |
| TC2 | R3 | happy | Navigate to `/signup` and snapshot. | Google sign-in card visible with heading, explanation, `Continue with Google` button, and link home. |
| TC3 | R4 | happy | Click `Continue with Google` and inspect the popup/tab and requests. | A Google OAuth popup opens (Google account chooser or sign-in page); Firebase Auth network requests occur. |
| TC4 | R5 | error | Close the Google popup without choosing an account, then snapshot. | Page returns to the signed-out card with a cancellation message; no uncaught console error. |
| TC5 | R6 | happy | Complete Google sign-in in the headed browser (manual step if Google challenges automation). | Header shows the Google avatar, display name, and `Sign out`; `/signup` shows `You're signed in`, name, and email. |
| TC6 | R7 | edge | Reload `/signup` while signed in, then snapshot. | Signed-in state remains after reload; header still shows the account and `Sign out`. |
| TC7 | R8 | happy | Click `Sign out` in the header, then snapshot. | Header returns to `Sign up`; `/signup` returns to the `Continue with Google` card; no session user remains. |
| TC8 | R9 | error | Build/serve without `VITE_FIREBASE_*` values (temporary `.env` move) and load `/signup`. | App renders; `/signup` shows a clear "sign-in unavailable" message; console has no uncaught errors. |
| TC9 | R10 | edge | `playwright-cli resize 390 844`, sign-out state, evaluate scroll width. | Header, sign-in card, and text fit; `document.documentElement.scrollWidth <= window.innerWidth`. |
| TC10 | R1, R10 | structural | Run `npm run typecheck` and `npm run build`; confirm `.env` is ignored by git. | Both commands pass; `git check-ignore .env` returns `.env`. |
| TC11 | R10 | happy | After deploy, load `https://blog-65f42.web.app/` and direct `/signup`, run console check. | Live pages render the same signed-out UI with no console errors. |

## Results

Date: 2026-10-22
Runtime: `playwright-cli` 0.1.22, headed Chrome, dev server `http://localhost:5173`, persistent profile `.playwright-cli/tanituts`
Viewports: 1440x1000 and 390x844
Checks: `npm run typecheck` passed, `npm run build` passed

| ID | Result | Evidence |
|---|---|---|
| TC1 | PASS | Title `BlogX — Stories worth your time`; 10 articles; header `BlogX` and `Sign up`; 0 console errors. |
| TC2 | PASS | `/signup` showed "Join BlogX with Google", the Google explanation, `Continue with Google`, and `Back to home`. |
| TC3 | PASS | Clicking the button opened a second tab at `accounts.google.com` in the Firebase Auth popup flow; Identity Toolkit requests returned 200. |
| TC4 | PASS | Closing the Google tab returned to the signed-out card with `role="alert"` text `Sign-in was cancelled.` The only console errors were 2 benign Firebase SDK COOP messages (`window.closed`), not uncaught app errors. |
| TC5 | PASS | Signed in as `tanituts tanituts` / `tanituts@gmail.com`; header showed the account name and `Sign out`; `/signup` showed `You're signed in`, name, and email. |
| TC6 | PASS | Reloading `/signup` kept the signed-in header and account summary. |
| TC7 | PASS | Header `Sign out` returned the header to `Sign up` and `/signup` to the `Continue with Google` card. |
| TC8 | PASS | Served without `.env` on port 5174; `/signup` rendered `Sign-in is unavailable` with a config explanation, 0 console errors. `.env` restored afterward. |
| TC9 | PASS | At 390x844, `scrollWidth` 375 <= `innerWidth` 390; sign-in card and `Continue with Google` visible. |
| TC10 | PASS | `npm run typecheck` and `npm run build` passed; `git check-ignore .env` returned `.env`. |
| TC11 | PASS | Live `https://blog-65f42.web.app/` showed 10 articles, `Sign up`, 0 console errors; direct `/signup` showed the Google card, 0 console errors; live Google popup opened and cancellation showed the expected alert. |

Note: Firebase Auth logs `Cross-Origin-Opener-Policy policy would block the window.closed call` while a Google popup is open/closed. This is a caught SDK diagnostic caused by the cross-origin Google popup, not an unhandled application error; sign-in, cancellation, and sign-out all complete correctly.

## Deployment

Date: 2026-10-22
Project: `blog-65f42`
Live URL: <https://blog-65f42.web.app>
Command: `firebase use blog-65f42 && npm run typecheck && npm run build && firebase deploy --only hosting`

| Check | Result | Evidence |
|---|---|---|
| Hosting deploy | PASS | Deploy completed; 4 files uploaded and released. |
| Live home page | PASS | Title `BlogX — Stories worth your time`; 10 articles, header `Sign up`, 0 console errors. |
| Live SPA route | PASS | Direct `https://blog-65f42.web.app/signup` served the Google sign-in card; 0 console errors. |
| Live Google popup | PASS | `Continue with Google` opened the Google account chooser; closing it produced `Sign-in was cancelled.` |
| COOP header | PASS | `cross-origin-opener-policy: same-origin-allow-popups` returned on live `/signup`. |

## Merge and push

Date: 2026-10-22
- Feature commit: `beb91d5` (`feat: add Google sign-in`)
- Merge commit on `main`: `3283b76` (`Merge branch 'feature/google-sign-in'`)
- `main` pushed to `origin/main`
- `feature/google-sign-in` pushed to `origin/feature/google-sign-in` and kept alive
- The deploy was produced from the feature-branch worktree using the local gitignored `.env`.

## Out of scope

- Automated test scripts, test runners, and CI test jobs.
- Email/password or non-Google providers.
- Firestore profile documents, roles, protected routes, and rules changes.
