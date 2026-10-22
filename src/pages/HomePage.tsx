import { BlogCard } from "../components/BlogCard";
import { Footer } from "../components/Footer";
import { Header } from "../components/Header";
import { Hero } from "../components/Hero";
import { posts } from "../data/posts";

export default function HomePage() {
  return (
    <div className="min-h-screen bg-slate-50 text-slate-900">
      <Header />
      <main>
        <Hero />
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
              {posts.length} reads · updated weekly
            </p>
          </div>
          <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {posts.map((post) => (
              <BlogCard key={post.id} post={post} />
            ))}
          </div>
        </section>
      </main>
      <Footer />
    </div>
  );
}
