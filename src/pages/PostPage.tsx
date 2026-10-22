import type { ReactNode } from "react";
import { Link, useParams } from "react-router-dom";
import { Footer } from "../components/Footer";
import { Header } from "../components/Header";
import { MarkdownContent } from "../components/MarkdownContent";
import { formatPostDate, getInitials } from "../lib/format";
import { usePost } from "../lib/posts";

export default function PostPage() {
  const { postId } = useParams<{ postId: string }>();
  const { post, loading, error } = usePost(postId);

  let body: ReactNode;

  if (loading) {
    body = (
      <div className="mx-auto max-w-3xl px-4 py-16 sm:px-6">
        <div className="h-4 w-28 animate-pulse rounded-full bg-slate-200" />
        <div className="mt-5 h-12 w-full animate-pulse rounded-2xl bg-slate-200" />
        <div className="mt-3 h-12 w-2/3 animate-pulse rounded-2xl bg-slate-200" />
        <div className="mt-8 h-72 w-full animate-pulse rounded-3xl bg-slate-200" />
      </div>
    );
  } else if (error) {
    body = (
      <section className="mx-auto max-w-lg px-4 py-20 text-center sm:px-6">
        <h1 className="text-3xl font-black tracking-tight text-slate-950">
          Could not load this story
        </h1>
        <p
          role="alert"
          className="mt-4 rounded-2xl border border-rose-200 bg-rose-50 px-4 py-3 text-sm font-medium text-rose-700"
        >
          {error}
        </p>
        <Link
          to="/"
          className="mt-8 inline-flex rounded-full bg-slate-950 px-6 py-3 text-sm font-semibold text-white transition hover:bg-indigo-600"
        >
          Back to home
        </Link>
      </section>
    );
  } else if (!post) {
    body = (
      <section className="mx-auto max-w-lg px-4 py-20 text-center sm:px-6">
        <p className="text-xs font-bold uppercase tracking-[0.18em] text-indigo-600">
          404
        </p>
        <h1 className="mt-2 text-3xl font-black tracking-tight text-slate-950">
          Story not found
        </h1>
        <p className="mt-4 text-base leading-7 text-slate-600">
          This story may have been removed, or the link is incorrect.
        </p>
        <Link
          to="/"
          className="mt-8 inline-flex rounded-full bg-slate-950 px-6 py-3 text-sm font-semibold text-white transition hover:bg-indigo-600"
        >
          Back to home
        </Link>
      </section>
    );
  } else {
    body = (
      <article className="mx-auto max-w-3xl px-4 py-12 sm:px-6 sm:py-16">
        <Link
          to="/"
          className="text-sm font-semibold text-slate-500 transition hover:text-indigo-700"
        >
          ← Back to stories
        </Link>
        <p className="mt-8 text-xs font-bold uppercase tracking-[0.18em] text-indigo-600">
          {post.category}
        </p>
        <h1 className="mt-3 text-4xl font-black leading-tight tracking-tight text-slate-950 sm:text-5xl">
          {post.title}
        </h1>
        <div className="mt-6 flex flex-wrap items-center gap-3 border-b border-slate-200 pb-6">
          {post.authorPhotoUrl ? (
            <img
              src={post.authorPhotoUrl}
              alt=""
              referrerPolicy="no-referrer"
              className="h-10 w-10 rounded-full border border-slate-200 object-cover"
            />
          ) : (
            <span className="grid h-10 w-10 place-items-center rounded-full bg-slate-950 text-xs font-bold text-white">
              {getInitials(post.authorName)}
            </span>
          )}
          <div>
            <p className="text-sm font-bold text-slate-800">
              {post.authorName}
            </p>
            <p className="text-xs font-medium text-slate-500">
              {formatPostDate(post.createdAt)} · {post.readTime} read
            </p>
          </div>
        </div>
        {post.coverImageUrl ? (
          <img
            src={post.coverImageUrl}
            alt=""
            className="mt-8 aspect-[16/9] w-full rounded-3xl border border-slate-200 object-cover"
          />
        ) : null}
        <MarkdownContent content={post.content} className="markdown-body mt-8" />
      </article>
    );
  }

  return (
    <div className="min-h-screen bg-slate-50 text-slate-900">
      <Header />
      <main className="min-h-[60vh]">{body}</main>
      <Footer />
    </div>
  );
}
