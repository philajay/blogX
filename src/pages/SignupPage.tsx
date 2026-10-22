import { useState, type ReactNode } from "react";
import { Link } from "react-router-dom";
import { Footer } from "../components/Footer";
import { GoogleIcon } from "../components/GoogleIcon";
import { Header } from "../components/Header";
import {
  getAuthErrorMessage,
  signInWithGoogle,
  signOutFromGoogle,
  useAuthUser,
} from "../lib/auth";
import { isFirebaseConfigured } from "../lib/firebase";

function BackToHome() {
  return (
    <Link
      to="/"
      className="inline-flex items-center justify-center rounded-full border border-slate-300 bg-white px-6 py-3 text-sm font-semibold text-slate-800 transition hover:border-indigo-300 hover:text-indigo-700 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-600"
    >
      Back to home
    </Link>
  );
}

export default function SignupPage() {
  const { user, loading, error: authError } = useAuthUser();
  const [pending, setPending] = useState(false);
  const [actionError, setActionError] = useState<string | null>(null);

  const error = actionError ?? authError;

  async function handleSignIn() {
    setPending(true);
    setActionError(null);

    try {
      await signInWithGoogle();
    } catch (cause) {
      setActionError(getAuthErrorMessage(cause));
    } finally {
      setPending(false);
    }
  }

  async function handleSignOut() {
    setPending(true);
    setActionError(null);

    try {
      await signOutFromGoogle();
    } catch (cause) {
      setActionError(getAuthErrorMessage(cause));
    } finally {
      setPending(false);
    }
  }

  let card: ReactNode;

  if (!isFirebaseConfigured) {
    card = (
      <>
        <span className="mx-auto grid h-14 w-14 place-items-center rounded-2xl bg-linear-to-br from-indigo-600 to-sky-500 text-2xl font-black text-white">
          B
        </span>
        <p className="mt-6 text-xs font-bold uppercase tracking-[0.18em] text-indigo-600">
          BlogX account
        </p>
        <h1 className="mt-3 text-3xl font-black tracking-tight text-slate-950 sm:text-4xl">
          Sign-in is unavailable
        </h1>
        <p className="mt-4 text-base leading-7 text-slate-600">
          Google sign-in is unavailable because Firebase is not configured for
          this build. Add the VITE_FIREBASE_* values and reload.
        </p>
        <div className="mt-8">
          <BackToHome />
        </div>
      </>
    );
  } else if (loading) {
    card = (
      <>
        <span
          aria-hidden="true"
          className="mx-auto block h-14 w-14 animate-pulse rounded-2xl bg-slate-200"
        />
        <p
          role="status"
          className="mt-6 text-sm font-semibold text-slate-500"
        >
          Checking your session...
        </p>
      </>
    );
  } else if (user) {
    card = (
      <>
        {user.photoURL ? (
          <img
            src={user.photoURL}
            alt=""
            referrerPolicy="no-referrer"
            className="mx-auto h-16 w-16 rounded-full border border-slate-200 object-cover"
          />
        ) : (
          <span
            aria-hidden="true"
            className="mx-auto grid h-16 w-16 place-items-center rounded-full bg-indigo-600 text-xl font-black text-white"
          >
            {(user.displayName ?? user.email ?? "U").charAt(0).toUpperCase()}
          </span>
        )}
        <p className="mt-6 text-xs font-bold uppercase tracking-[0.18em] text-indigo-600">
          BlogX account
        </p>
        <h1 className="mt-3 text-3xl font-black tracking-tight text-slate-950 sm:text-4xl">
          You&apos;re signed in
        </h1>
        <p className="mt-4 text-lg font-bold text-slate-900">
          {user.displayName ?? "BlogX member"}
        </p>
        {user.email ? (
          <p className="mt-1 text-sm font-medium text-slate-500">
            {user.email}
          </p>
        ) : null}
        <p className="mt-4 text-base leading-7 text-slate-600">
          You are signed in with Google. The latest stories are waiting for you
          on the home page.
        </p>
        {error ? (
          <p
            role="alert"
            className="mt-4 rounded-2xl border border-rose-200 bg-rose-50 px-4 py-3 text-sm font-medium text-rose-700"
          >
            {error}
          </p>
        ) : null}
        <div className="mt-8 flex flex-wrap items-center justify-center gap-3">
          <button
            type="button"
            onClick={handleSignOut}
            disabled={pending}
            className="inline-flex items-center justify-center rounded-full bg-slate-950 px-6 py-3 text-sm font-semibold text-white transition hover:bg-indigo-600 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-600 disabled:cursor-not-allowed disabled:opacity-60"
          >
            {pending ? "Signing out..." : "Sign out"}
          </button>
          <BackToHome />
        </div>
      </>
    );
  } else {
    card = (
      <>
        <span className="mx-auto grid h-14 w-14 place-items-center rounded-2xl bg-linear-to-br from-indigo-600 to-sky-500 text-2xl font-black text-white">
          B
        </span>
        <p className="mt-6 text-xs font-bold uppercase tracking-[0.18em] text-indigo-600">
          BlogX account
        </p>
        <h1 className="mt-3 text-3xl font-black tracking-tight text-slate-950 sm:text-4xl">
          Join BlogX with Google
        </h1>
        <p className="mt-4 text-base leading-7 text-slate-600">
          Sign in with your Google account to follow the writers and stories you
          care about. We only use your name, email, and profile photo.
        </p>
        {error ? (
          <p
            role="alert"
            className="mt-5 rounded-2xl border border-rose-200 bg-rose-50 px-4 py-3 text-sm font-medium text-rose-700"
          >
            {error}
          </p>
        ) : null}
        <button
          type="button"
          onClick={handleSignIn}
          disabled={pending}
          className="mt-8 inline-flex w-full items-center justify-center gap-3 rounded-full bg-slate-950 px-6 py-3 text-sm font-semibold text-white shadow-sm transition hover:bg-indigo-600 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-600 disabled:cursor-not-allowed disabled:opacity-60"
        >
          {pending ? (
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
        <p className="mt-4 text-xs font-medium text-slate-500">
          New here? The same button creates your BlogX account.
        </p>
        <div className="mt-8">
          <BackToHome />
        </div>
      </>
    );
  }

  return (
    <div className="flex min-h-screen flex-col bg-slate-50 text-slate-900">
      <Header />
      <main className="flex flex-1 items-center justify-center px-4 py-16 sm:px-6">
        <section className="w-full max-w-lg rounded-3xl border border-slate-200 bg-white p-8 text-center shadow-sm sm:p-12">
          {card}
        </section>
      </main>
      <Footer />
    </div>
  );
}
