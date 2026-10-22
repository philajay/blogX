import { FirebaseError } from "firebase/app";
import {
  GoogleAuthProvider,
  onAuthStateChanged,
  signInWithPopup,
  signOut,
  type User,
} from "firebase/auth";
import { useEffect, useState } from "react";
import { auth } from "./firebase";

const authErrorMessages: Record<string, string> = {
  "auth/cancelled-popup-request": "Another sign-in is already in progress.",
  "auth/network-request-failed":
    "Network error. Check your connection and try again.",
  "auth/operation-not-allowed":
    "Google sign-in is not enabled for this project.",
  "auth/popup-blocked":
    "Your browser blocked the sign-in window. Allow pop-ups and try again.",
  "auth/popup-closed-by-user": "Sign-in was cancelled.",
  "auth/unauthorized-domain":
    "This domain is not authorized for Google sign-in.",
  "auth/user-disabled": "This account has been disabled.",
};

export type AuthState = {
  user: User | null;
  loading: boolean;
  error: string | null;
};

export function getAuthErrorMessage(cause: unknown): string {
  if (cause instanceof FirebaseError) {
    return (
      authErrorMessages[cause.code] ??
      "Google sign-in failed. Please try again."
    );
  }

  if (cause instanceof Error && cause.message) {
    return cause.message;
  }

  return "Google sign-in failed. Please try again.";
}

export function useAuthUser(): AuthState {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(auth !== null);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!auth) {
      return;
    }

    return onAuthStateChanged(
      auth,
      (nextUser) => {
        setUser(nextUser);
        setError(null);
        setLoading(false);
      },
      (cause) => {
        setUser(null);
        setError(getAuthErrorMessage(cause));
        setLoading(false);
      },
    );
  }, []);

  return { user, loading, error };
}

export async function signInWithGoogle(): Promise<void> {
  if (!auth) {
    throw new Error(
      "Google sign-in is unavailable because Firebase is not configured.",
    );
  }

  const provider = new GoogleAuthProvider();
  provider.setCustomParameters({ prompt: "select_account" });
  await signInWithPopup(auth, provider);
}

export async function signOutFromGoogle(): Promise<void> {
  if (!auth) {
    throw new Error(
      "Google sign-in is unavailable because Firebase is not configured.",
    );
  }

  await signOut(auth);
}
