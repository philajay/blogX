import { Link } from "react-router-dom";

export function Header() {
  return (
    <header className="sticky top-0 z-20 border-b border-slate-200/80 bg-white/90 backdrop-blur">
      <div className="mx-auto flex max-w-6xl items-center justify-between gap-4 px-4 py-4 sm:px-6 lg:px-8">
        <Link
          to="/"
          aria-label="BlogX home"
          className="flex items-center gap-2 rounded-xl focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-indigo-600"
        >
          <span className="grid h-9 w-9 place-items-center rounded-xl bg-linear-to-br from-indigo-600 to-sky-500 text-base font-black text-white shadow-sm">
            B
          </span>
          <span className="text-xl font-black tracking-tight text-slate-950">
            BlogX
          </span>
        </Link>
        <Link
          to="/signup"
          className="rounded-full bg-slate-950 px-4 py-2 text-sm font-semibold text-white shadow-sm transition hover:bg-indigo-600 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-600 sm:px-5"
        >
          Sign up
        </Link>
      </div>
    </header>
  );
}
