import { Link } from "react-router-dom";

export function Hero() {
  return (
    <section className="relative overflow-hidden border-b border-slate-200/70 bg-linear-to-br from-indigo-50 via-white to-sky-50">
      <div className="pointer-events-none absolute -right-24 -top-24 h-72 w-72 rounded-full bg-indigo-200/50 blur-3xl" />
      <div className="pointer-events-none absolute -bottom-32 left-1/4 h-72 w-72 rounded-full bg-sky-200/40 blur-3xl" />
      <div className="relative mx-auto max-w-6xl px-4 py-16 sm:px-6 sm:py-20 lg:px-8 lg:py-24">
        <p className="mb-4 inline-flex items-center gap-2 rounded-full border border-indigo-200 bg-white/80 px-3 py-1 text-xs font-bold uppercase tracking-[0.18em] text-indigo-700">
          <span className="h-1.5 w-1.5 rounded-full bg-indigo-500" />
          The BlogX journal
        </p>
        <h1
          id="hero-title"
          className="max-w-3xl text-4xl font-black tracking-tight text-slate-950 sm:text-5xl lg:text-6xl"
        >
          Stories, ideas, and lessons worth your time.
        </h1>
        <p className="mt-5 max-w-2xl text-base leading-7 text-slate-600 sm:text-lg">
          Fresh perspectives on technology, design, culture, and the craft of
          building things — written by people who care about the details.
        </p>
        <div className="mt-8 flex flex-wrap items-center gap-3">
          <a
            href="#latest"
            className="inline-flex items-center justify-center rounded-full bg-slate-950 px-5 py-2.5 text-sm font-semibold text-white shadow-sm transition hover:bg-indigo-600 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-600"
          >
            Browse the latest
          </a>
          <Link
            to="/signup"
            className="inline-flex items-center justify-center rounded-full border border-slate-300 bg-white px-5 py-2.5 text-sm font-semibold text-slate-800 transition hover:border-indigo-300 hover:text-indigo-700 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-600"
          >
            Join BlogX
          </Link>
        </div>
        <dl className="mt-10 grid max-w-lg grid-cols-3 gap-4 border-t border-slate-200/80 pt-6">
          <div>
            <dt className="text-xs font-semibold uppercase tracking-[0.14em] text-slate-500">
              Stories
            </dt>
            <dd className="mt-1 text-2xl font-black text-slate-950">10</dd>
          </div>
          <div>
            <dt className="text-xs font-semibold uppercase tracking-[0.14em] text-slate-500">
              Topics
            </dt>
            <dd className="mt-1 text-2xl font-black text-slate-950">8</dd>
          </div>
          <div>
            <dt className="text-xs font-semibold uppercase tracking-[0.14em] text-slate-500">
              Updated
            </dt>
            <dd className="mt-1 text-2xl font-black text-slate-950">Weekly</dd>
          </div>
        </dl>
      </div>
    </section>
  );
}
