# RFP: blog-home-page

Status: Approved
Date: 2026-10-22
Branch: feature/blog-home-page

## Goal

Build the first user-facing page of BlogX: a home page with a `BlogX` header, a `Sign up` entry point, a short hero, and exactly 10 blog cards backed by dummy data. The page must be a client-only React app that can later read the same data shape from Firestore.

## Users

- Visitors landing on the BlogX home page.
- Visitors who want to reach sign-up (placeholder for now).
- The repository owner, who needs a clean base for later Firestore and auth work.

## Scope

- Vite + React + TypeScript client-only SPA styled with Tailwind CSS.
- Header with `BlogX` brand and a `Sign up` link to `/signup`.
- Home page with a hero/intro section and a responsive grid of exactly 10 blog cards.
- Dummy blog data in a typed module, shaped for a future Firestore collection.
- Each card: local gradient/SVG cover, category, title, excerpt, author, date, read time.
- `/signup` placeholder route with "Sign up is coming soon" and a link back to home.
- Firebase initialized once from `VITE_FIREBASE_*` env vars; app must render when env vars are absent.
- Firebase Hosting config for project `blog-65f42` (`.firebaserc`, `firebase.json`).
- `.env.example` documenting the Firebase env vars; no secrets.
- `blog-stack` skill updated with the runtime-headed `playwright-cli` e2e convention.
- E2E verification executed live with `playwright-cli` in headed mode; no test scripts committed.

## Non-goals

- Real sign-up, authentication, or authorization.
- Firestore reads/writes or any persistence beyond dummy data.
- Blog post detail pages, editor/admin, comments, likes, search, filtering, or pagination.
- Server-side rendering, SEO work, or analytics.
- Deployment execution (`firebase deploy`) as part of this feature.
- Automated Playwright test files, test runners, or CI test jobs.
- Additional backends, databases, storage providers, or hosting providers.

## Constraints

- Follow the `blog-stack` skill: React client only, Firebase Hosting, Firestore for data, Firebase Storage for uploads, Firebase Web JS SDK, project `blog-65f42`.
- Approved dependencies: `react`, `react-dom`, `react-router-dom`, `firebase`, `tailwindcss`, `@tailwindcss/vite`, `vite`, `typescript`, `@vitejs/plugin-react`.
- TypeScript strict mode; type-only imports; typed props and data.
- Conventional Vite layout: `src/components`, `src/pages`, `src/data`, `src/lib`.
- Function components; PascalCase files; named component exports; default `App`.
- Tailwind utility classes; avoid unnecessary comments.
- Dummy covers must be local gradients or local SVG; no external image hosts and no network image requests.
- Firebase web config must come from env vars, never hardcoded secrets or service-account credentials.
- Home page must be usable at mobile and desktop widths with no horizontal overflow.
- Use semantic elements (`header`, `main`, `article`, headings) and accessible link names.
- No commits or pushes unless explicitly requested.

## Acceptance criteria

- R1. The app is a client-only Vite + React + TypeScript SPA styled with Tailwind, with Firebase Hosting config for project `blog-65f42`.
- R2. The home header shows the `BlogX` brand and a `Sign up` link pointing to `/signup`.
- R3. The home page shows an intro/hero section and exactly 10 blog cards rendered from dummy data.
- R4. Each card shows a local gradient/SVG cover (no external image requests), category, title, excerpt, author, date, and read time.
- R5. Blog data lives in `src/data/posts.ts` as 10 unique typed posts, shaped for an eventual Firestore swap.
- R6. `/signup` is a routed placeholder page showing "Sign up is coming soon" and a link back to home; direct navigation to it works.
- R7. Firebase initializes once in `src/lib/firebase.ts` from `VITE_FIREBASE_*` env vars and exports `app`, `db`, `storage`, and `auth`; the app still renders with no env vars configured. `.env.example`, `.firebaserc`, and `firebase.json` are included with no secrets.
- R8. No automated test scripts are added. E2E cases are executed live with `playwright-cli` in headed mode against the dev server.
- R9. The `blog-stack` skill records the runtime-headed `playwright-cli` e2e convention, explicitly prohibiting committed Playwright test scripts.

## Risks

- Tailwind v4 setup depends on the `@tailwindcss/vite` plugin; an incorrect setup can leave utility classes ungenerated.
- Firebase initialization must not throw when env vars are missing, or the home page will fail before it renders.
- The dummy data shape may need adjustment once the real Firestore schema and security rules are designed.
- Runtime `playwright-cli` checks are manual and less repeatable than committed tests; they must be recorded precisely in `test-cases.md`.
- Exact dependency versions may differ at install time; lockfile state should be verified with typecheck and build.
