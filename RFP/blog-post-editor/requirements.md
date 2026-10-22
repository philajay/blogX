# RFP: blog-post-editor

Status: Approved
Date: 2026-10-22
Branch: feature/blog-post-editor

## Goal

Let signed-in users write and publish blog posts with a markdown editor, live preview, and a cover image, then read those posts from the home page and a post detail page. All posts come from Firestore and images from Firebase Storage.

## Users

- Signed-in BlogX users who want to publish a story.
- Visitors who want to browse published stories.
- Signed-out visitors who must sign in before writing.

## Scope

- Add `react-markdown` and `remark-gfm` for safe markdown rendering.
- Firestore `posts/{id}` document with title, category, content, excerpt, read time, cover URL/path, author fields, and server timestamps.
- Authenticated `/write` route with title, category, cover upload, markdown textarea, and live preview.
- Cover upload to Firebase Storage `posts/{uid}/...` with progress, image MIME validation, and a 5 MB limit.
- Publish flow uploads the cover, creates the Firestore document, cleans up the upload if the document write fails, and redirects to the post.
- Home page reads posts from Firestore with `onSnapshot`, ordered by `createdAt` descending; loading, empty, and error states.
- Blog cards show the uploaded cover, category, title, excerpt, author, date, and read time.
- Public post detail page at `/post/:id` with cover and safely rendered markdown.
- Header shows a `Write` link for signed-in users.
- Firestore rules: public read; authenticated create with matching `authorId`; owner update/delete.
- Storage rules: public read; authenticated create only under `posts/{uid}/`, image-only, under 5 MB.
- Remove the dummy-data home feed.
- Runtime tests create one real blog post using `assets/1.webp` as the cover.

## Non-goals

- Edit or delete UI for posts.
- Drafts, scheduling, or publishing later.
- Inline image uploads inside markdown.
- WYSIWYG or a rich code editor.
- Comments, likes, tags, search, filtering, or pagination.
- Server-side rendering, analytics, or email notifications.
- Automated test scripts, test runners, or CI test jobs.

## Constraints

- Follow `blog-stack`: client-only React, Firebase Hosting, Firestore, Storage, Firebase Web JS SDK, project `blog-65f42`.
- Dependency additions limited to `react-markdown` and `remark-gfm`.
- Markdown must not execute raw HTML.
- Author identity must come from Firebase Auth, never from form input.
- Category is a required free-text field, maximum 40 characters.
- Title is required, 3-120 characters.
- Cover image is required; accepted MIME types are `image/*`; maximum 5 MB.
- Excerpt is generated from markdown at about 180 characters; read time is word count / 200 with a 1-minute minimum.
- Publishing is immediate; there is no draft state.
- Use Tailwind utility classes and match the existing BlogX visual language.
- Handle loading, empty, upload progress, and error states explicitly.
- Mobile and desktop layouts must avoid horizontal overflow.
- No secrets or privileged credentials in the client bundle.
- No commits or pushes unless requested.

## Acceptance criteria

- R1. `react-markdown` and `remark-gfm` render safe React output with raw HTML disabled.
- R2. Firestore `posts/{id}` stores `title`, `category`, `content`, `excerpt`, `readTime`, `coverImageUrl`, `coverImagePath`, `authorId`, `authorName`, `authorPhotoUrl`, `createdAt`, `updatedAt`.
- R3. `/write` is usable only when signed in; signed-out visitors see a Google sign-in prompt; signed-in header shows `Write`.
- R4. `/write` has title, category, cover upload, markdown textarea, and live preview; title, category, cover, and content are required; mobile stacks editor and preview.
- R5. Cover upload uses Storage `posts/{uid}/...` and `uploadBytesResumable`; validates image type and 5 MB; shows progress and errors; saves URL/path in Firestore.
- R6. Publishing uploads first, writes the Firestore document with server timestamps and Auth author fields, deletes the uploaded object if the document write fails, and redirects to the post.
- R7. Home uses a Firestore `onSnapshot` query ordered by `createdAt` descending, shows loading/empty/error states, and renders Firestore cards with cover, category, title, excerpt, author, date, and read time.
- R8. Public `/post/:id` shows cover, markdown, author, and date; handles missing posts and direct navigation.
- R9. Firestore rules are public-read, authenticated-create with matching `authorId`, owner update/delete; Storage rules are public-read, authenticated-create under `posts/{uid}/`, image-only, size-limited; no permissive write rules.
- R10. Author identity is taken from Auth; markdown cannot execute raw HTML; no secrets are added.
- R11. Runtime testing creates one blog from the UI with `assets/1.webp`; the Storage object and Firestore document exist and the blog appears on home.
- R12. Typecheck and build pass; Hosting, Firestore rules, and Storage rules deploy; live home, `/write`, and `/post/:id` work without app console errors.

## Risks

- Firestore and Storage rules deploy to a live project; a wrong rule can block publishing or expose writes.
- Storage requires Blaze billing; billing is now enabled, but quota or permission errors are still possible.
- Firestore `createdAt` ordering depends on `serverTimestamp()`, which is briefly `null` in local snapshots before the server resolves it.
- Uploading before writing Firestore can leave orphaned objects; the implementation deletes the object when the write fails.
- Markdown can include remote images or links; raw HTML is disabled but remote resources are not.
- Real Auth/Storage/Firestore calls make the runtime tests dependent on the live Firebase project.
- The test blog remains in Firestore and Storage after verification, as requested.
- Google sign-in still emits benign COOP console diagnostics while a popup closes.
