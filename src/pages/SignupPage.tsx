import { Link } from "react-router-dom";
import { Footer } from "../components/Footer";
import { Header } from "../components/Header";

export default function SignupPage() {
  return (
    <div className="flex min-h-screen flex-col bg-slate-50 text-slate-900">
      <Header />
      <main className="flex flex-1 items-center justify-center px-4 py-16 sm:px-6">
        <section className="w-full max-w-lg rounded-3xl border border-slate-200 bg-white p-8 text-center shadow-sm sm:p-12">
          <span className="mx-auto grid h-14 w-14 place-items-center rounded-2xl bg-linear-to-br from-indigo-600 to-sky-500 text-2xl font-black text-white">
            B
          </span>
          <p className="mt-6 text-xs font-bold uppercase tracking-[0.18em] text-indigo-600">
            BlogX account
          </p>
          <h1 className="mt-3 text-3xl font-black tracking-tight text-slate-950 sm:text-4xl">
            Sign up is coming soon
          </h1>
          <p className="mt-4 text-base leading-7 text-slate-600">
            We are putting the finishing touches on BlogX accounts. Until then,
            pull up a chair and enjoy the latest stories.
          </p>
          <Link
            to="/"
            className="mt-8 inline-flex items-center justify-center rounded-full bg-slate-950 px-6 py-3 text-sm font-semibold text-white transition hover:bg-indigo-600 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-600"
          >
            Back to home
          </Link>
        </section>
      </main>
      <Footer />
    </div>
  );
}
