import { FirebaseError } from "firebase/app";
import { getFunctions, httpsCallable } from "firebase/functions";
import { app } from "./firebase";

const functions = app ? getFunctions(app, "us-central1") : null;

const summarizePostCallable = functions
  ? httpsCallable<{ postId: string }, { summary: string }>(
      functions,
      "summarizePost",
    )
  : null;

export function getFunctionsErrorMessage(cause: unknown): string {
  if (cause instanceof FirebaseError) {
    switch (cause.code) {
      case "functions/unauthenticated":
        return "Sign in to summarize this post.";
      case "functions/permission-denied":
        return "Only the post creator can summarize this post.";
      case "functions/not-found":
        return "This post could not be found.";
      case "functions/failed-precondition":
        return cause.message || "This post has no content to summarize.";
      case "functions/invalid-argument":
        return "A post id is required.";
      case "functions/deadline-exceeded":
        return "The summary took too long. Please try again.";
      case "functions/unavailable":
        return "The summary service is unavailable. Please try again.";
      case "functions/internal":
        return cause.message || "The summary could not be generated. Please try again.";
      default:
        return cause.message || "Could not summarize the post. Please try again.";
    }
  }

  if (cause instanceof Error && cause.message) {
    return cause.message;
  }

  return "Could not summarize the post. Please try again.";
}

export async function requestPostSummary(postId: string): Promise<string> {
  if (!summarizePostCallable) {
    throw new Error(
      "Summaries are unavailable because Firebase is not configured.",
    );
  }

  const result = await summarizePostCallable({ postId });

  return result.data.summary;
}
