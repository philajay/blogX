import { Link } from "react-router-dom";
import type { Post } from "../lib/posts";
import { formatPostDate, getInitials } from "../lib/format";

type BlogCardProps = {
  post: Post;
};

export function BlogCard({ post }: BlogCardProps) {
  return (
    <article className="group h-full overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-sm transition duration-200 hover:-translate-y-1 hover:border-indigo-200 hover:shadow-xl">
      <Link to={`/post/${post.id}`} className="flex h-full flex-col">
        <div className="relative h-44 overflow-hidden bg-slate-100">
          {post.coverImageUrl ? (
            <img
              src={post.coverImageUrl}
              alt=""
              loading="lazy"
              className="h-full w-full object-cover transition duration-300 group-hover:scale-105"
            />
          ) : (
            <div className="h-full bg-linear-to-br from-indigo-500 via-violet-500 to-fuchsia-500">
              <div
                aria-hidden="true"
                className="absolute -right-10 -top-10 h-36 w-36 rounded-full border-[18px] border-white/20"
              />
              <div
                aria-hidden="true"
                className="absolute -bottom-8 left-1/3 h-28 w-28 rounded-full bg-white/10"
              />
            </div>
          )}
          <span className="absolute left-4 top-4 rounded-full bg-white/90 px-3 py-1 text-[11px] font-bold uppercase tracking-[0.16em] text-slate-800 backdrop-blur">
            {post.category}
          </span>
        </div>
        <div className="flex flex-1 flex-col p-5">
          <h3 className="line-clamp-2 text-lg font-bold leading-snug tracking-tight text-slate-950">
            {post.title}
          </h3>
          <p className="mt-2 line-clamp-3 text-sm leading-6 text-slate-600">
            {post.excerpt}
          </p>
          <div className="mt-auto flex items-center justify-between gap-3 border-t border-slate-100 pt-4">
            <div className="flex min-w-0 items-center gap-2">
              {post.authorPhotoUrl ? (
                <img
                  src={post.authorPhotoUrl}
                  alt=""
                  referrerPolicy="no-referrer"
                  className="h-8 w-8 shrink-0 rounded-full border border-slate-200 object-cover"
                />
              ) : (
                <span className="grid h-8 w-8 shrink-0 place-items-center rounded-full bg-slate-950 text-[10px] font-bold text-white">
                  {getInitials(post.authorName)}
                </span>
              )}
              <span className="truncate text-sm font-semibold text-slate-700">
                {post.authorName}
              </span>
            </div>
            <div className="shrink-0 text-right text-xs leading-5 text-slate-500">
              <p>{formatPostDate(post.createdAt)}</p>
              <p>{post.readTime} read</p>
            </div>
          </div>
        </div>
      </Link>
    </article>
  );
}
