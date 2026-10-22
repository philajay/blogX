import { Link } from "react-router-dom";
import { BlogCard } from "../components/BlogCard";
import { Footer } from "../components/Footer";
import { Header } from "../components/Header";
import { Hero } from "../components/Hero";
import { usePosts } from "../lib/posts";

export default function HomePage() {
  const { posts, loading, error } = usePosts();
  const topicCount = new Set(
    posts.map((post) => post.category.trim().toLowerCase()).filter(Boolean),
  ).size;

  return (
    <div className="min-h-screen bg-slate-50 text-slate-900">
      <Header />
      <main>
        <Hero storyCount={posts.length} topicCount={topicCount} />
        <section
          id="latest"
          aria-label="Latest stories"
          className="mx-auto max-w-6xl scroll-mt-24 px-4 py-14 sm:px-6 sm:py-16 lg:px-8"
        >
          <div className="mb-8 flex flex-wrap items-end justify-between gap-4">
            <div>
              <p className="text-xs font-bold uppercase tracking-[0.18em] text-indigo-600">
                Latest stories
              </p>
              <h2 className="mt-2 text-2xl font-black tracking-tight text-slate-950 sm:text-3xl">
                Fresh from the BlogX community
              </h2>
            </div>
            <p className="text-sm font-medium text-slate-500">
              {posts.length} {posts.length === 1 ? "story" : "stories"} ·
              updated weekly
            </p>
          </div>

          {loading ? (
            <div
              aria-label="Loading stories"
              className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3"
            >
              {Array.from({ length: 3 }).map((_, index) => (
                <div
                  key={index}
                  className="h-80 animate-pulse rounded-2xl border border-slate-200 bg-white"
                />
              ))}
            </div>
          ) : error ? (
            <div
              role="alert"
              className="rounded-3xl border border-rose-200 bg-rose-50 p-8 text-center"
            >
              <p className="text-base font-semibold text-rose-700">{error}</p>
              <button
                type="button"
                onClick={() => window.location.reload()}
                className="mt-4 rounded-full bg-slate-950 px-5 py-2.5 text-sm font-semibold text-white transition hover:bg-indigo-600"
              >
                Try again
              </button>
            </div>
          ) : posts.length === 0 ? (
            <div className="rounded-3xl border border-dashed border-slate-300 bg-white p-12 text-center">
              <p className="text-xs font-bold uppercase tracking-[0.18em] text-indigo-600">
                Nothing published yet
              </p>
              <h3 className="mt-3 text-2xl font-black tracking-tight text-slate-950">
                Be the first to share a story
              </h3>
              <p className="mx-auto mt-3 max-w-md text-base leading-7 text-slate-600">
                Write a post in markdown, add a cover image, and publish it to
                the BlogX home page.
              </p>
              <Link
                to="/write"
                className="mt-6 inline-flex rounded-full bg-slate-950 px-6 py-3 text-sm font-semibold text-white transition hover:bg-indigo-600"
              >
                Write the first story
              </Link>
            </div>
          ) : (
            <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
              {posts.map((post) => (
                <BlogCard key={post.id} post={post} />
              ))}
            </div>
          )}
        </section>
      </main>
      <Footer />
    </div>
  );
}
