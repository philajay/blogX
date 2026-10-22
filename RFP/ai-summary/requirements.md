# RFP: ai-summary

Status: Approved
Date: 2026-10-22
Branch: feature/ai-summary

## Goal

Let the creator of a blog post generate a public 2-3 sentence AI summary with OpenRouter, using a Firebase Cloud Function so the OpenRouter key never reaches the browser.

## Users

- Post creators who want an AI-generated summary.
- Readers who see the saved public summary on the post page.
- Signed-in non-creators and signed-out visitors, who must not be able to summarize.

## Scope

- Add Firebase Functions (TypeScript, Node 22) to the stack with explicit per-function approval.
- Add a callable `summarizePost` function in `us-central1`.
- Verify Firebase Auth and require `post.authorId === request.auth.uid`.
- Load the post with the Admin SDK, validate content, and call OpenRouter model `deepseek/deepseek-v4.1-flash`.
- Store the OpenRouter key in Google Secret Manager and read it with `defineSecret`.
- Ask OpenRouter for a 2-3 sentence paragraph.
- Save `summary`, `summaryModel`, and `summarizedAt` on the post document.
- Show the public summary in an AI summary card on the post detail page.
- Show `Summarize with AI` to the creator when no summary exists and `Regenerate summary` afterward.
- Handle loading, error, missing post, missing content, permission, timeout, and OpenRouter failure states.
- Prevent clients from writing summary fields; the Admin SDK may write them.
- Update `blog-stack` with the Firebase Functions policy and ask-before-adding rule.
- Add `functions/` with its own package and build configuration and wire it into `firebase.json`.

## Non-goals

- Summaries on home cards, card excerpts, or other pages.
- Automatic summarization on publish.
- Editing the generated summary by hand.
- Summary history or multiple versions.
- App Check, rate limiting, or per-user quotas.
- Streaming responses or background jobs.
- Email notifications, search, tags, or analytics.
- Automated test scripts, test runners, or CI test jobs.

## Constraints

- Firebase only: Functions, Firestore, Storage, Auth, Hosting, project `blog-65f42`.
- Function runtime Node 22; region `us-central1`; 120s timeout; 256 MiB.
- Model: `deepseek/deepseek-v4.1-flash`.
- OpenRouter key only in Secret Manager; never in the client, repo, logs, or error messages.
- Content sent to OpenRouter is truncated to 24,000 characters.
- Max summary output around 300 tokens.
- The function logs only status/error metadata, never the key or full post content.
- Function must accept only an authenticated callable request with a valid `postId`.
- Summary is public once saved; only the creator can generate or regenerate it.
- Existing post creation, home feed, auth, and Storage behavior must not regress.
- Tailwind styling must match the existing BlogX design and remain usable at 390px.
- No commits or pushes unless requested.

## Acceptance criteria

- R1. `functions/` is a TypeScript package with Firebase Functions and Admin SDK, Node 22, and a build script; `firebase.json` deploys it. `blog-stack` records that functions are allowed with explicit per-function approval.
- R2. `summarizePost` is a callable function in `us-central1` that requires Auth, validates `postId`, loads the post, and rejects unless `post.authorId === request.auth.uid`.
- R3. The function calls OpenRouter `deepseek/deepseek-v4.1-flash` with the post title/content and requests a 2-3 sentence paragraph, truncating content at 24,000 characters.
- R4. `OPENROUTER_API_KEY` lives in Secret Manager and is read via `defineSecret`; it is absent from the client bundle and repository.
- R5. On success the function writes `summary`, `summaryModel`, and a server `summarizedAt` timestamp to the post; the response returns the summary text.
- R6. The post detail page shows a public AI summary card when a summary exists. The creator sees `Summarize with AI` or `Regenerate summary`; signed-out users and non-creators do not see the action.
- R7. The UI shows generating, success, and readable error states, and disables the action while a request is running.
- R8. Firestore rules keep public reads and deny client writes to `summary`, `summaryModel`, and `summarizedAt`; Admin SDK writes bypass rules.
- R9. The function never logs the API key or full post content and returns safe errors for Auth, not-found, permission, empty-content, timeout, and OpenRouter failures.
- R10. The existing test post `WmBhqvri4L84C1AaPRd1` (creator tanituts) exercises the creator flow.
- R11. Root and functions typecheck/build pass; function, Firestore rules, and Hosting deploy; live creator and public-reader flows work with no app console errors.

## Risks

- Cloud Functions are a new stack surface and require billing and deployment time.
- OpenRouter latency or outages can make summarization slow or fail; the UI must recover cleanly.
- The OpenRouter key is a real secret; incorrect deployment could expose or break it.
- The function uses the Admin SDK and can write summary fields even if client rules deny those writes.
- Summary quality and length depend on the model; responses may need trimming or rejection if empty.
- Firestore rules must be updated carefully without breaking existing post creation.
- No second real Google user is available; non-creator denial is tested with an Admin-seeded post owned by another uid and the tanituts token.
- Cloud Functions cold starts may exceed normal UI wait expectations.
- The existing test post and its saved summary remain in production after verification.
