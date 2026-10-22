# Test cases: ai-summary

Run command: runtime `playwright-cli` sequence below (no test script files)

```sh
npm run typecheck
npm --prefix functions run build
npm run dev -- --host 127.0.0.1 --port 5173
playwright-cli open --headed --persistent --profile .playwright-cli/tanituts http://localhost:5173
# execute the per-case CLI checks in the table
playwright-cli close
npm run build
firebase deploy --only functions,firestore:rules,hosting
```

Baseline: `main` has Google sign-in, Firestore posts, Storage covers, and one published test post `WmBhqvri4L84C1AaPRd1` authored by `tanituts`. No functions package or OpenRouter secret exists.

Runtime rule: do not create `*.spec.*`, `*.test.*`, `playwright.config.*`, or a `tests/` directory. Every e2e case is executed live through `playwright-cli` in a headed browser.

| ID | Requirement | Type | Case | Expected |
|---|---|---|---|---|
| TC1 | R1, R2 | structural | Inspect `functions/`, `firebase.json`, and the deployed function list. | TypeScript package with Node 22; `summarizePost` deployed in `us-central1`. |
| TC2 | R4 | structural | Inspect Secret Manager and search `dist` for `sk-or-v1` / the key. | Secret exists; no key material in the client bundle or repo. |
| TC3 | R6 | happy | Signed-in creator opens `/post/WmBhqvri4L84C1AaPRd1`. | `Summarize with AI` visible; non-creator and signed-out views do not show it. |
| TC4 | R3, R5 | happy | Creator clicks `Summarize with AI`. | Generating state appears; 2-3 sentence summary saved with model + `summarizedAt`; summary card appears. |
| TC5 | R6 | happy | Open the same post signed out. | Public AI summary is visible; no summarize action. |
| TC6 | R5 | happy | Creator clicks `Regenerate summary`. | Summary updates and `summarizedAt` is newer. |
| TC7 | R2 | error | Seed a temp post owned by another uid; call `summarizePost` with the tanituts token. | Callable returns `permission-denied`; no summary written; temp post removed. |
| TC8 | R2 | error | Call `summarizePost` with no Auth token. | Callable returns `unauthenticated`; no summary written. |
| TC9 | R7 | error | Seed a temp post with empty content owned by tanituts; call the function. | Readable `failed-precondition`; no summary write; temp post removed. |
| TC10 | R8 | error | Authenticated owner tries to write `summary` directly via the Firestore REST API. | Rules deny the write; public reads still work. |
| TC11 | R6 | edge | View the post page at 390x844. | Summary card/action fit; `scrollWidth <= innerWidth`. |
| TC12 | R11 | structural | Root/functions typecheck + build, deploy, verify live. | All pass; live creator and public-reader flows work; no app console errors. |
| TC13 | R1 | structural | Inspect `.opencode/skills/blog-stack/SKILL.md`. | Records Firebase Functions as allowed with explicit per-function approval. |

## Results

Date: 2026-10-22
Runtime: `playwright-cli` 0.1.22, headed Chrome, dev server `http://localhost:5173`, deployed function `us-central1`
Profiles: `.playwright-cli/tanituts` (creator), `.playwright-cli/signedout`
Viewports: 1440x1000 and 390x844
Checks: root `npm run typecheck` passed, root `npm run build` passed, `npm --prefix functions run build` passed

| ID | Result | Evidence |
|---|---|---|
| TC1 | PASS | `firebase functions:list` shows `summarizePost` callable, v2, `us-central1`, 256 MB, `nodejs22`. |
| TC2 | PASS | Secret `OPENROUTER_API_KEY` exists; `sk-or-v1` absent from `dist` and `git grep`; `.env` ignored. |
| TC3 | PASS | Creator saw `Summarize with AI`; a temp post owned by `someone-else` showed no action while signed in as tanituts; signed-out view showed no action. |
| TC4 | PASS | First attempt exposed a 300-token truncation; the prompt/max tokens were corrected to 600 with an incomplete-output guard. Final summary was 2 complete sentences, saved with `summaryModel` `deepseek/deepseek-v4.1-flash` and `summarizedAt`. |
| TC5 | PASS | Signed-out live page showed the saved summary and no summarize/regenerate action. |
| TC6 | PASS | Live regeneration moved `summarizedAt` from `08:58:05.222Z` to `09:03:59.871Z` and kept a complete summary. |
| TC7 | PASS | Temp post owned by `someone-else`: authenticated call returned `functions/permission-denied` (403); no `summary` field; temp doc deleted. |
| TC8 | PASS | Signed-out call returned `functions/unauthenticated` (401). |
| TC9 | PASS | Temp empty-content post owned by tanituts returned `functions/failed-precondition` (400); no `summary` field; temp doc deleted. |
| TC10 | PASS | Authenticated owner PATCH of `summary` through Firestore REST returned 403; public reads still worked. |
| TC11 | PASS | At 390x844, `scrollWidth` 375 <= 390; summary card and `Regenerate summary` visible. |
| TC12 | PASS | Deploy completed; live creator page showed the summary and regenerate action; live signed-out page showed the summary and no action; 0 app console errors. |
| TC13 | PASS | `.opencode/skills/blog-stack/SKILL.md` allows TypeScript Firebase Functions with explicit per-function approval and records the secret/deploy rules. |

## Deployment

Date: 2026-10-22
Project: `blog-65f42`
Live URL: <https://blog-65f42.web.app/post/WmBhqvri4L84C1AaPRd1>
Commands: `firebase functions:secrets:set OPENROUTER_API_KEY --data-file <file>`, `npm --prefix functions run build`, `firebase deploy --only functions,firestore:rules`, `npm run typecheck && npm run build && firebase deploy --only hosting`

| Check | Result | Evidence |
|---|---|---|
| Secret Manager | PASS | `OPENROUTER_API_KEY` version created; compute service account granted `secretmanager.secretAccessor`. |
| Function deploy | PASS | `summarizePost` created/updated as a Node 22 v2 callable in `us-central1`; artifact cleanup policy set to 7 days. |
| Firestore rules | PASS | Rules with the summary-field write guard compiled and released. |
| Hosting deploy | PASS | Root build and Hosting release completed. |
| Live creator flow | PASS | Creator sees the saved summary and regenerate action; live regeneration updated the summary timestamp. |
| Live public flow | PASS | Signed-out reader sees the summary with no action. |
| Client secret scan | PASS | No OpenRouter key material in `dist` or git. |

## Merge and push

Date: 2026-10-22
- Feature commit: `230be91` (`feat: add AI post summaries with Firebase Functions`)
- Merge commit on `main`: `ac726df` (`Merge branch 'feature/ai-summary'`)
- `main` pushed to `origin/main`
- `feature/ai-summary` pushed to `origin/feature/ai-summary` and kept alive
- The test post and its saved AI summary remain in production.
- Restart opencode so the updated `blog-stack` skill is loaded.

## Out of scope

- Automated test scripts, test runners, and CI test jobs.
- Home-card summaries, manual editing, summary history, App Check, quotas, streaming, and background jobs.
