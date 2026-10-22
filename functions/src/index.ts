import { initializeApp } from "firebase-admin/app";
import { FieldValue, getFirestore } from "firebase-admin/firestore";
import { logger } from "firebase-functions";
import { defineSecret } from "firebase-functions/params";
import { HttpsError, onCall } from "firebase-functions/v2/https";

initializeApp();

const db = getFirestore();
const openRouterKey = defineSecret("OPENROUTER_API_KEY");

const MODEL = "deepseek/deepseek-v4.1-flash";
const MAX_CONTENT_CHARS = 24000;
const MAX_SUMMARY_TOKENS = 600;

type SummarizePayload = {
  postId?: unknown;
};

type PostData = {
  authorId?: unknown;
  title?: unknown;
  content?: unknown;
};

type OpenRouterResponse = {
  choices?: Array<{
    message?: {
      content?: unknown;
    };
  }>;
};

async function requestSummary(
  apiKey: string,
  title: string,
  content: string,
): Promise<string> {
  let response: Response;

  try {
    response = await fetch("https://openrouter.ai/api/v1/chat/completions", {
      method: "POST",
      headers: {
        Authorization: `Bearer ${apiKey}`,
        "Content-Type": "application/json",
        "HTTP-Referer": "https://blog-65f42.web.app",
        "X-Title": "BlogX",
      },
      body: JSON.stringify({
        model: MODEL,
        temperature: 0.2,
        max_tokens: MAX_SUMMARY_TOKENS,
        messages: [
          {
            role: "system",
            content:
              "You are an editor for BlogX. Summarize the blog post in exactly 2 concise sentences, under 60 words total. Return only the summary text, with no heading, label, or bullet points.",
          },
          {
            role: "user",
            content: `Title: ${title}\n\n${content.slice(0, MAX_CONTENT_CHARS)}`,
          },
        ],
      }),
      signal: AbortSignal.timeout(60000),
    });
  } catch (cause) {
    logger.error("OpenRouter request failed", {
      reason: cause instanceof Error ? cause.name : "unknown",
    });
    throw new HttpsError(
      "unavailable",
      "The summary service is unavailable. Please try again.",
    );
  }

  if (!response.ok) {
    logger.error("OpenRouter returned an error", { status: response.status });
    throw new HttpsError(
      "internal",
      "The summary service could not generate a summary. Please try again.",
    );
  }

  const payload = (await response.json()) as OpenRouterResponse;
  const summary = payload.choices?.[0]?.message?.content;

  if (typeof summary !== "string" || !summary.trim()) {
    logger.error("OpenRouter returned an empty summary");
    throw new HttpsError(
      "internal",
      "The summary service returned an empty summary. Please try again.",
    );
  }

  const cleaned = summary.trim().replace(/^summary:\s*/i, "").slice(0, 2000);

  if (!/[.!?]["')\]]?$/.test(cleaned)) {
    logger.error("OpenRouter returned an incomplete summary");
    throw new HttpsError(
      "internal",
      "The summary was incomplete. Please try again.",
    );
  }

  return cleaned;
}

export const summarizePost = onCall(
  {
    region: "us-central1",
    timeoutSeconds: 120,
    memory: "256MiB",
    secrets: [openRouterKey],
  },
  async (request) => {
    if (!request.auth) {
      throw new HttpsError("unauthenticated", "Sign in to summarize this post.");
    }

    const payload = request.data as SummarizePayload | undefined;
    const postId = payload?.postId;

    if (typeof postId !== "string" || !postId) {
      throw new HttpsError("invalid-argument", "A post id is required.");
    }

    const postRef = db.collection("posts").doc(postId);
    const snapshot = await postRef.get();

    if (!snapshot.exists) {
      throw new HttpsError("not-found", "Post not found.");
    }

    const data = snapshot.data() as PostData | undefined;

    if (data?.authorId !== request.auth.uid) {
      throw new HttpsError(
        "permission-denied",
        "Only the post creator can summarize this post.",
      );
    }

    const title = typeof data.title === "string" ? data.title.trim() : "";
    const content = typeof data.content === "string" ? data.content.trim() : "";

    if (!content) {
      throw new HttpsError(
        "failed-precondition",
        "This post has no content to summarize.",
      );
    }

    const summary = await requestSummary(
      openRouterKey.value(),
      title,
      content,
    );

    await postRef.update({
      summary,
      summaryModel: MODEL,
      summarizedAt: FieldValue.serverTimestamp(),
    });

    return { summary };
  },
);
