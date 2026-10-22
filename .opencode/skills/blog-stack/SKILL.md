---
name: blog-stack
description: Use when building, changing, reviewing, or deploying the blog app. Enforces the React client stack, Firebase Hosting, Firestore for all data, Firebase Storage for all uploads, approved TypeScript Firebase Functions for privileged work, and Firebase project blog-65f42.
---

# Blog Stack

The blog is a client-side React app. Firebase is the only backend. Approved Firebase Functions may back privileged integrations; no other backend is allowed.

## Fixed decisions

- **Client:** React, running entirely in the browser. No server-rendered app, API server, custom backend, or non-Firebase edge functions.
- **Functions:** Firebase Cloud Functions (TypeScript) are allowed only with explicit user approval for each new function. Ask before adding any function, even if it uses Firebase services.
- **Secrets:** Function secrets live in Google Secret Manager, never in the client bundle or repository. Use `defineSecret` and document the secret name.
- **Deployment:** Firebase Hosting. Project ID: `blog-65f42`.
- **Repository:** `https://github.com/philajay/blogX.git`; default branch `main`.
- **Branching:** Work on `feature/<name>`, merge into `main` with `--no-ff` after deploy verification, and keep the feature branch alive.
- **Data:** Cloud Firestore for every persisted record and document.
- **Files:** Firebase Storage for every uploaded file and image, including post images and user-provided media.
- **SDK:** Firebase Web JS SDK (modular `firebase/*` imports) called directly from React.
- **Nothing else:** No other database, server, hosting provider, file store, or third-party backend. Do not add Supabase, Vercel/Netlify hosting, a Node server, or an external image host without explicit approval.

## Implementation rules

- Initialize Firebase once in a single module and export the `app`, `db`, `storage`, and other services from there. Do not call `initializeApp` in components.
- Keep the Firebase project ID in one place (`.firebaserc` plus env/config). Do not scatter the literal `blog-65f42` through components.
- Use Firestore for all application state that must survive a reload. Do not persist content in `localStorage` as a substitute for Firestore.
- For lists and live views, prefer `onSnapshot` subscriptions and clean them up in `useEffect` return handlers. Use `getDocs`/`getDoc` for one-off reads.
- Store Storage download URLs or object paths in Firestore documents. Never store file blobs or base64 data in Firestore.
- Upload from the client with `uploadBytes`/`uploadBytesResumable` then `getDownloadURL`. Show upload progress and handle failures.
- Every new Firestore collection and Storage path needs matching security rules. Do not ship permissive `allow read, write: if true` rules for user content.
- Add composite Firestore indexes when a query requires them; deploy them with the rules.
- Firebase web config values are not secrets, but never place service-account keys, admin SDK credentials, or privileged tokens in the client bundle. Use env vars for config and keep `.env*` out of git.
- Handle loading, empty, and error states for every Firestore and Storage call. Do not fail silently.
- Do not invent authentication or authorization requirements. If access control is needed and no rule exists, stop and ask.
- Keep approved functions in `functions/` as TypeScript with its own package. Use Node 22, the Admin SDK, and enforce authorization inside the function rather than trusting the client.
- Never log secrets or full user content in functions. Log only status and error metadata.
- Use Secret Manager for function credentials: `defineSecret("NAME")` in code and `firebase functions:secrets:set NAME --data-file <file>`. Never commit the value.
- Do not allow client writes to fields that only a function may set; Admin SDK writes bypass Firestore rules.
- Add functions to `firebase.json` under `functions` with `source` and `runtime`.

## Testing

- All end-to-end checks run at runtime with `playwright-cli` in headed (visible) mode against the local dev server.
- Do not add Playwright test scripts, `*.spec.*`, `*.test.*`, `playwright.config.*`, or a `tests/` directory. Do not add a test runner or CI test job for e2e.
- Start the app, then launch the browser explicitly: `playwright-cli open --headed <url>`.
- Drive the agreed cases with `playwright-cli` snapshots, refs, `find`, `click`, `eval`, `console`, and `requests`. Do not generate a script to replay them.
- Record the exact runtime command sequence and outcomes in `RFP/<feature>/test-cases.md`.
- Close the browser with `playwright-cli close` when finished, then run the repository's typecheck and build commands before reporting.

## Deployment

- Deploy every completed feature to Firebase Hosting unless the user explicitly says not to.
- Firebase config lives in `firebase.json` and `.firebaserc`; Hosting serves the built React app and rewrites SPA routes to `/index.html`.
- Use this order for a hosting deploy:
  1. `firebase use blog-65f42`
  2. `npm run typecheck`
  3. `npm run build`
  4. `firebase deploy --only hosting`
- When an approved function changes, build it first with `npm --prefix functions run build`, then deploy with `firebase deploy --only functions`. Set or rotate secrets with `firebase functions:secrets:set` before deploying.
- Run the repository's lint and tests too, before deploying, when they exist. Do not deploy on a failed check.
- When rules or indexes change, deploy them too: `firebase deploy --only firestore:rules,firestore:indexes,storage`.
- After deploy, verify the live Hosting URL and at least one direct SPA route (for example `/signup`) with `playwright-cli` in headed mode. Check the browser console for errors.
- Record the live URL and live verification result in `RFP/<feature>/test-cases.md` and in the completion report.
- After a successful deploy and live verification, merge the feature branch into `main` and keep the feature branch alive. Do not delete it unless the user asks.
- Current live site: <https://blog-65f42.web.app>
- Stop and ask if the Firebase CLI is missing, the account is not authenticated, or the project is not accessible.

## When to stop

Stop and ask before:

- Introducing any non-Firebase backend, database, storage service, or hosting provider.
- Adding any new Firebase Function without explicit approval for that function.
- Changing the Firebase project ID.
- Adding auth, payments, or access rules that were not specified.
- Deploying without the required credentials or project access.
- Adding a secret without a clear owner, name, and Secret Manager plan.
