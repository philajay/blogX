import { useState } from "react";
import { Link } from "react-router-dom";
import {
  getAuthErrorMessage,
  signOutFromGoogle,
  useAuthUser,
} from "../lib/auth";

export function Header() {
  const { user, loading, error: authError } = useAuthUser();
  const [signingOut, setSigningOut] = useState(false);
  const [signOutError, setSignOutError] = useState<string | null>(null);

  const error = signOutError ?? authError;

  async function handleSignOut() {
    setSigningOut(true);
    setSignOutError(null);

    try {
      await signOutFromGoogle();
    } catch (cause) {
      setSignOutError(getAuthErrorMessage(cause));
    } finally {
      setSigningOut(false);
    }
  }

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
        {loading ? (
          <span
            aria-hidden="true"
            className="h-9 w-28 animate-pulse rounded-full bg-slate-100"
          />
        ) : user ? (
          <div className="flex flex-col items-end gap-1">
            <div className="flex items-center gap-2 sm:gap-3">
              {user.photoURL ? (
                <img
                  src={user.photoURL}
                  alt=""
                  referrerPolicy="no-referrer"
                  className="h-9 w-9 rounded-full border border-slate-200 object-cover"
                />
              ) : (
                <span
                  aria-hidden="true"
                  className="grid h-9 w-9 place-items-center rounded-full bg-indigo-600 text-sm font-bold text-white"
                >
                  {(user.displayName ?? user.email ?? "U")
                    .charAt(0)
                    .toUpperCase()}
                </span>
              )}
              <span className="hidden max-w-36 truncate text-sm font-semibold text-slate-700 md:block">
                {user.displayName ?? user.email ?? "Account"}
              </span>
              <button
                type="button"
                onClick={handleSignOut}
                disabled={signingOut}
                className="rounded-full border border-slate-300 bg-white px-3 py-2 text-sm font-semibold text-slate-700 transition hover:border-indigo-300 hover:text-indigo-700 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-600 disabled:cursor-not-allowed disabled:opacity-60 sm:px-4"
              >
                {signingOut ? "Signing out..." : "Sign out"}
              </button>
            </div>
            {error ? (
              <p
                role="alert"
                className="max-w-56 text-right text-xs font-medium text-rose-600"
              >
                {error}
              </p>
            ) : null}
          </div>
        ) : (
          <div className="flex flex-col items-end gap-1">
            <Link
              to="/signup"
              className="rounded-full bg-slate-950 px-4 py-2 text-sm font-semibold text-white shadow-sm transition hover:bg-indigo-600 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-600 sm:px-5"
            >
              Sign up
            </Link>
            {error ? (
              <p
                role="alert"
                className="max-w-56 text-right text-xs font-medium text-rose-600"
              >
                {error}
              </p>
            ) : null}
          </div>
        )}
      </div>
    </header>
  );
}
