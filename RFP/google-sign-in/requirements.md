# RFP: google-sign-in

Status: Approved
Date: 2026-10-22
Branch: feature/google-sign-in

## Goal

Replace the `/signup` placeholder with real Google sign-in using Firebase Authentication, and show the signed-in user in the BlogX header.

## Users

- Visitors who want to create or access a BlogX account with their Google account.
- Returning signed-in visitors who need to see their current account and sign out.

## Scope

- Firebase Web App `blogx` registered in project `blog-65f42`; public web config supplied through `VITE_FIREBASE_*` env vars in a gitignored `.env`.
- `GoogleAuthProvider` sign-in with `signInWithPopup` from the existing Firebase Auth instance.
- `/signup` becomes the Google sign-in page with a `Continue with Google` action.
- Signed-in `/signup` state shows the Google avatar, display name, email, a sign-out action, and a link home.
- Header shows a `Sign up` link to `/signup` when signed out.
- Header shows the Google avatar, display name, and a `Sign out` action when signed in.
- Auth state comes from `onAuthStateChanged` so it survives reloads.
- Loading, empty (signed out), and error states for auth actions.
- Clear message when Firebase env config is missing or Auth is unavailable.
- Reuse the existing Tailwind, component, and lib conventions; no new dependencies.

## Non-goals

- Email/password, phone, anonymous, or non-Google providers.
- Firestore user profile documents, custom claims, roles, or admin access.
- Protected routes, comments, posting, or any authorization rules.
- Account deletion, profile editing, or linking multiple providers.
- Automated test files, test runners, or CI test jobs.
- Changes to Firestore or Storage rules and indexes.

## Constraints

- Follow the `blog-stack` skill: client-only React, Firebase only, Web JS SDK, project `blog-65f42`.
- No secrets in the client bundle or repository; only public Firebase web config values.
- Popup sign-in must handle cancellation, blocked popups, unauthorized domains, disabled provider, and network errors with readable messages.
- No external image hosts for app assets; the Google profile photo is loaded from the user's Google account only after sign-in.
- Accessible controls with explicit button labels, `role="alert"` errors, and visible focus styles.
- Mobile and desktop layout with no horizontal overflow.
- No commits or pushes unless explicitly requested.
- Deploy to Firebase Hosting after checks pass, then verify the live home and `/signup` routes.

## Acceptance criteria

- R1. A Firebase Web App exists for project `blog-65f42`, and the app initializes Firebase Auth from the `VITE_FIREBASE_*` values in a local `.env` that is not committed.
- R2. The signed-out header still shows the `BlogX` brand and a `Sign up` link to `/signup`, with no Firebase errors in the console.
- R3. `/signup` displays a Google sign-in card with a `Continue with Google` button when Firebase is configured and no user is signed in.
- R4. Clicking `Continue with Google` starts Firebase `signInWithPopup` with `GoogleAuthProvider`; the popup shows Google's account chooser.
- R5. Cancelling or closing the popup returns to the signed-out page with a readable cancellation message and no uncaught error.
- R6. A successful Google sign-in shows the user's avatar and display name in the header plus a `Sign out` action, and `/signup` shows the signed-in account summary.
- R7. Auth state persists across a page reload while the Google session is active.
- R8. `Sign out` clears the session and returns both the header and `/signup` to the signed-out state.
- R9. If Firebase env config is missing, the app still renders and `/signup` shows a clear unavailable message instead of crashing.
- R10. Typecheck and build pass; the live Hosting home page and direct `/signup` route render without console errors.

## Risks

- Google OAuth may reject automated browsers or require manual account selection during runtime testing; successful sign-in may need one manual step in the headed browser.
- Popup sign-in can be blocked by browser settings or third-party cookie restrictions.
- Google may rate-limit or challenge repeated sign-in attempts.
- The Google profile photo is a remote image request after sign-in; it is not a bundled asset.
- Firebase Auth state depends on correct Authorized Domains; `localhost`, `blog-65f42.firebaseapp.com`, and `blog-65f42.web.app` are already authorized.
- The registered web app public config must be present at build time; a deploy without `.env` would ship an unconfigured build.
