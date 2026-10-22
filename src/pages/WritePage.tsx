import { FirebaseError } from "firebase/app";
import {
  useEffect,
  useState,
  type ChangeEvent,
  type FormEvent,
  type ReactNode,
} from "react";
import { Link, useNavigate } from "react-router-dom";
import { Footer } from "../components/Footer";
import { GoogleIcon } from "../components/GoogleIcon";
import { Header } from "../components/Header";
import { MarkdownContent } from "../components/MarkdownContent";
import {
  getAuthErrorMessage,
  signInWithGoogle,
  useAuthUser,
} from "../lib/auth";
import { isFirebaseConfigured } from "../lib/firebase";
import { createPost, getFirestoreErrorMessage } from "../lib/posts";
import {
  deleteStorageObject,
  getStorageErrorMessage,
  maxCoverImageBytes,
  uploadPostCover,
} from "../lib/storage";

type FormErrors = {
  title?: string;
  category?: string;
  content?: string;
  cover?: string;
  form?: string;
};

function validateCover(file: File): string | null {
  if (!file.type.startsWith("image/")) {
    return "Choose an image file (PNG, JPG, or WebP).";
  }

  if (file.size > maxCoverImageBytes) {
    return "Cover image must be 5 MB or smaller.";
  }

  return null;
}

export default function WritePage() {
  const navigate = useNavigate();
  const { user, loading } = useAuthUser();
  const [title, setTitle] = useState("");
  const [category, setCategory] = useState("");
  const [content, setContent] = useState("");
  const [coverFile, setCoverFile] = useState<File | null>(null);
  const [coverPreview, setCoverPreview] = useState<string | null>(null);
  const [errors, setErrors] = useState<FormErrors>({});
  const [submitting, setSubmitting] = useState(false);
  const [uploadProgress, setUploadProgress] = useState<number | null>(null);
  const [signingIn, setSigningIn] = useState(false);
  const [signInError, setSignInError] = useState<string | null>(null);

  useEffect(() => {
    if (!coverPreview) {
      return;
    }

    return () => URL.revokeObjectURL(coverPreview);
  }, [coverPreview]);

  function handleCoverChange(event: ChangeEvent<HTMLInputElement>) {
    const file = event.target.files?.[0];

    if (!file) {
      return;
    }

    const coverError = validateCover(file);

    if (coverError) {
      setCoverFile(null);
      setCoverPreview(null);
      setErrors((current) => ({ ...current, cover: coverError }));
      event.target.value = "";
      return;
    }

    setCoverFile(file);
    setCoverPreview(URL.createObjectURL(file));
    setErrors((current) => ({ ...current, cover: undefined, form: undefined }));
  }

  async function handleSignIn() {
    setSigningIn(true);
    setSignInError(null);

    try {
      await signInWithGoogle();
    } catch (cause) {
      setSignInError(getAuthErrorMessage(cause));
    } finally {
      setSigningIn(false);
    }
  }

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();

    if (!user) {
      return;
    }

    const nextErrors: FormErrors = {};

    if (title.trim().length < 3) {
      nextErrors.title = "Add a title with at least 3 characters.";
    }

    if (category.trim().length < 2) {
      nextErrors.category = "Add a category.";
    }

    if (!content.trim()) {
      nextErrors.content = "Write some markdown content.";
    }

    if (!coverFile) {
      nextErrors.cover = "Choose a cover image.";
    }

    if (Object.keys(nextErrors).length > 0) {
      setErrors(nextErrors);
      return;
    }

    if (!coverFile) {
      return;
    }

    setSubmitting(true);
    setUploadProgress(0);
    setErrors({});

    let uploadedPath: string | null = null;

    try {
      const cover = await uploadPostCover(user.uid, coverFile, (percent) => {
        setUploadProgress(percent);
      });
      uploadedPath = cover.path;

      const postId = await createPost(
        {
          title,
          category,
          content,
          coverImageUrl: cover.url,
          coverImagePath: cover.path,
        },
        user,
      );

      navigate(`/post/${postId}`);
    } catch (cause) {
      if (uploadedPath) {
        await deleteStorageObject(uploadedPath).catch(() => undefined);
      }

      const message =
        cause instanceof FirebaseError && cause.code.startsWith("storage/")
          ? getStorageErrorMessage(cause)
          : getFirestoreErrorMessage(cause);

      setErrors({ form: message });
    } finally {
      setSubmitting(false);
      setUploadProgress(null);
    }
  }

  let body: ReactNode;

  if (!isFirebaseConfigured) {
    body = (
      <section className="mx-auto max-w-lg rounded-3xl border border-slate-200 bg-white p-8 text-center shadow-sm sm:p-12">
        <h1 className="text-3xl font-black tracking-tight text-slate-950">
          Writing is unavailable
        </h1>
        <p className="mt-4 text-base leading-7 text-slate-600">
          The editor needs Firebase to be configured for this build.
        </p>
        <Link
          to="/"
          className="mt-8 inline-flex rounded-full bg-slate-950 px-6 py-3 text-sm font-semibold text-white transition hover:bg-indigo-600"
        >
          Back to home
        </Link>
      </section>
    );
  } else if (loading) {
    body = (
      <section className="mx-auto max-w-lg rounded-3xl border border-slate-200 bg-white p-8 text-center shadow-sm sm:p-12">
        <p role="status" className="text-sm font-semibold text-slate-500">
          Checking your session...
        </p>
      </section>
    );
  } else if (!user) {
    body = (
      <section className="mx-auto max-w-lg rounded-3xl border border-slate-200 bg-white p-8 text-center shadow-sm sm:p-12">
        <span className="mx-auto grid h-14 w-14 place-items-center rounded-2xl bg-linear-to-br from-indigo-600 to-sky-500 text-2xl font-black text-white">
          B
        </span>
        <p className="mt-6 text-xs font-bold uppercase tracking-[0.18em] text-indigo-600">
          BlogX writer
        </p>
        <h1 className="mt-3 text-3xl font-black tracking-tight text-slate-950 sm:text-4xl">
          Sign in to write
        </h1>
        <p className="mt-4 text-base leading-7 text-slate-600">
          You need a BlogX account before you can publish a story.
        </p>
        {signInError ? (
          <p
            role="alert"
            className="mt-5 rounded-2xl border border-rose-200 bg-rose-50 px-4 py-3 text-sm font-medium text-rose-700"
          >
            {signInError}
          </p>
        ) : null}
        <button
          type="button"
          onClick={handleSignIn}
          disabled={signingIn}
          className="mt-8 inline-flex w-full items-center justify-center gap-3 rounded-full bg-slate-950 px-6 py-3 text-sm font-semibold text-white shadow-sm transition hover:bg-indigo-600 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-600 disabled:cursor-not-allowed disabled:opacity-60"
        >
          {signingIn ? (
            "Connecting to Google..."
          ) : (
            <>
              <span className="grid h-7 w-7 place-items-center rounded-full bg-white">
                <GoogleIcon />
              </span>
              Continue with Google
            </>
          )}
        </button>
        <Link
          to="/"
          className="mt-6 inline-flex text-sm font-semibold text-slate-600 hover:text-indigo-700"
        >
          Back to home
        </Link>
      </section>
    );
  } else {
    body = (
      <>
        <div className="mb-8 flex flex-wrap items-end justify-between gap-4">
          <div>
            <p className="text-xs font-bold uppercase tracking-[0.18em] text-indigo-600">
              New story
            </p>
            <h1 className="mt-2 text-3xl font-black tracking-tight text-slate-950 sm:text-4xl">
              Write a blog post
            </h1>
            <p className="mt-2 text-sm font-medium text-slate-500">
              Markdown on the left, live preview on the right.
            </p>
          </div>
          <Link
            to="/"
            className="rounded-full border border-slate-300 bg-white px-4 py-2 text-sm font-semibold text-slate-700 transition hover:border-indigo-300 hover:text-indigo-700"
          >
            Cancel
          </Link>
        </div>

        <form
          onSubmit={handleSubmit}
          noValidate
          className="grid gap-6 lg:grid-cols-2 lg:items-start"
        >
          <div className="rounded-3xl border border-slate-200 bg-white p-6 shadow-sm sm:p-8">
            {errors.form ? (
              <p
                role="alert"
                className="mb-6 rounded-2xl border border-rose-200 bg-rose-50 px-4 py-3 text-sm font-medium text-rose-700"
              >
                {errors.form}
              </p>
            ) : null}

            <div>
              <label
                htmlFor="post-title"
                className="text-sm font-bold text-slate-800"
              >
                Title
              </label>
              <input
                id="post-title"
                type="text"
                value={title}
                onChange={(event) => setTitle(event.target.value)}
                maxLength={120}
                placeholder="A headline worth clicking"
                aria-invalid={Boolean(errors.title)}
                aria-describedby={errors.title ? "post-title-error" : undefined}
                className="mt-2 w-full rounded-2xl border border-slate-300 bg-white px-4 py-3 text-sm text-slate-900 outline-none transition focus:border-indigo-400 focus:ring-2 focus:ring-indigo-100"
              />
              {errors.title ? (
                <p
                  id="post-title-error"
                  className="mt-2 text-sm font-medium text-rose-600"
                >
                  {errors.title}
                </p>
              ) : null}
            </div>

            <div className="mt-5">
              <label
                htmlFor="post-category"
                className="text-sm font-bold text-slate-800"
              >
                Category
              </label>
              <input
                id="post-category"
                type="text"
                value={category}
                onChange={(event) => setCategory(event.target.value)}
                maxLength={40}
                placeholder="Engineering, Design, Culture..."
                aria-invalid={Boolean(errors.category)}
                aria-describedby={
                  errors.category ? "post-category-error" : undefined
                }
                className="mt-2 w-full rounded-2xl border border-slate-300 bg-white px-4 py-3 text-sm text-slate-900 outline-none transition focus:border-indigo-400 focus:ring-2 focus:ring-indigo-100"
              />
              {errors.category ? (
                <p
                  id="post-category-error"
                  className="mt-2 text-sm font-medium text-rose-600"
                >
                  {errors.category}
                </p>
              ) : null}
            </div>

            <div className="mt-5">
              <label
                htmlFor="post-cover"
                className="text-sm font-bold text-slate-800"
              >
                Cover image
              </label>
              <input
                id="post-cover"
                type="file"
                accept="image/*"
                onChange={handleCoverChange}
                aria-invalid={Boolean(errors.cover)}
                aria-describedby={errors.cover ? "post-cover-error" : undefined}
                className="mt-2 block w-full rounded-2xl border border-dashed border-slate-300 bg-slate-50 px-4 py-3 text-sm text-slate-600 file:mr-3 file:rounded-full file:border-0 file:bg-slate-950 file:px-4 file:py-2 file:text-sm file:font-semibold file:text-white hover:border-indigo-300"
              />
              <p className="mt-2 text-xs font-medium text-slate-500">
                PNG, JPG, or WebP up to 5 MB.
              </p>
              {errors.cover ? (
                <p
                  id="post-cover-error"
                  className="mt-2 text-sm font-medium text-rose-600"
                >
                  {errors.cover}
                </p>
              ) : null}
              {coverPreview ? (
                <img
                  src={coverPreview}
                  alt="Selected cover preview"
                  className="mt-4 h-40 w-full rounded-2xl border border-slate-200 object-cover"
                />
              ) : null}
            </div>

            <div className="mt-5">
              <label
                htmlFor="post-content"
                className="text-sm font-bold text-slate-800"
              >
                Markdown
              </label>
              <textarea
                id="post-content"
                value={content}
                onChange={(event) => setContent(event.target.value)}
                rows={18}
                placeholder={"# Start with a heading\n\nWrite your story in **markdown**."}
                aria-invalid={Boolean(errors.content)}
                aria-describedby={
                  errors.content ? "post-content-error" : undefined
                }
                className="mt-2 w-full resize-y rounded-2xl border border-slate-300 bg-slate-950 px-4 py-3 font-mono text-sm leading-6 text-slate-100 outline-none transition focus:border-indigo-400 focus:ring-2 focus:ring-indigo-100"
              />
              {errors.content ? (
                <p
                  id="post-content-error"
                  className="mt-2 text-sm font-medium text-rose-600"
                >
                  {errors.content}
                </p>
              ) : null}
            </div>

            {submitting && uploadProgress !== null ? (
              <div className="mt-6">
                <div className="flex items-center justify-between text-xs font-semibold text-slate-500">
                  <span>Uploading cover</span>
                  <span>{uploadProgress}%</span>
                </div>
                <div
                  role="progressbar"
                  aria-valuemin={0}
                  aria-valuemax={100}
                  aria-valuenow={uploadProgress}
                  className="mt-2 h-2 overflow-hidden rounded-full bg-slate-100"
                >
                  <div
                    className="h-full rounded-full bg-indigo-600 transition-all"
                    style={{ width: `${uploadProgress}%` }}
                  />
                </div>
              </div>
            ) : null}

            <button
              type="submit"
              disabled={submitting}
              className="mt-6 inline-flex w-full items-center justify-center rounded-full bg-slate-950 px-6 py-3 text-sm font-semibold text-white shadow-sm transition hover:bg-indigo-600 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-600 disabled:cursor-not-allowed disabled:opacity-60"
            >
              {submitting ? "Publishing..." : "Publish post"}
            </button>
          </div>

          <aside className="overflow-hidden rounded-3xl border border-slate-200 bg-white shadow-sm lg:sticky lg:top-24">
            <div className="flex items-center justify-between border-b border-slate-200 px-6 py-4">
              <h2 className="text-sm font-bold text-slate-800">Live preview</h2>
              <span className="text-xs font-semibold uppercase tracking-[0.14em] text-slate-400">
                Markdown
              </span>
            </div>
            <div className="p-6">
              {coverPreview ? (
                <img
                  src={coverPreview}
                  alt=""
                  className="h-48 w-full rounded-2xl object-cover"
                />
              ) : null}
              <p className="mt-5 text-xs font-bold uppercase tracking-[0.16em] text-indigo-600">
                {category.trim() || "Category"}
              </p>
              <h2 className="mt-2 text-2xl font-black tracking-tight text-slate-950">
                {title.trim() || "Your title"}
              </h2>
              {content.trim() ? (
                <MarkdownContent
                  content={content}
                  className="markdown-body mt-4"
                />
              ) : (
                <p className="mt-4 text-sm leading-6 text-slate-500">
                  Your rendered markdown appears here as you type.
                </p>
              )}
            </div>
          </aside>
        </form>
      </>
    );
  }

  return (
    <div className="min-h-screen bg-slate-50 text-slate-900">
      <Header />
      <main className="mx-auto max-w-6xl px-4 py-10 sm:px-6 sm:py-14 lg:px-8">
        {body}
      </main>
      <Footer />
    </div>
  );
}
