import { FirebaseError } from "firebase/app";
import {
  addDoc,
  collection,
  doc,
  onSnapshot,
  orderBy,
  query,
  serverTimestamp,
  Timestamp,
  type DocumentData,
  type DocumentSnapshot,
  type QueryDocumentSnapshot,
} from "firebase/firestore";
import type { User } from "firebase/auth";
import { useEffect, useState } from "react";
import { db } from "./firebase";
import { estimateReadTime, getExcerpt } from "./markdown";

export type Post = {
  id: string;
  title: string;
  category: string;
  content: string;
  excerpt: string;
  readTime: string;
  coverImageUrl: string;
  coverImagePath: string;
  authorId: string;
  authorName: string;
  authorPhotoUrl: string | null;
  summary: string;
  summaryModel: string;
  summarizedAt: Timestamp | null;
  createdAt: Timestamp | null;
  updatedAt: Timestamp | null;
};

export type PostsState = {
  posts: Post[];
  loading: boolean;
  error: string | null;
};

export type PostState = {
  post: Post | null;
  loading: boolean;
  error: string | null;
};

export type CreatePostInput = {
  title: string;
  category: string;
  content: string;
  coverImageUrl: string;
  coverImagePath: string;
};

const notConfiguredMessage =
  "Posts are unavailable because Firebase is not configured.";

export function getFirestoreErrorMessage(cause: unknown): string {
  if (cause instanceof FirebaseError) {
    switch (cause.code) {
      case "permission-denied":
        return "You do not have permission to access these posts.";
      case "failed-precondition":
        return "This query needs a Firestore index. Please contact the site owner.";
      case "unavailable":
        return "Firestore is temporarily unavailable. Check your connection and try again.";
      default:
        return "Could not complete the Firestore request. Please try again.";
    }
  }

  if (cause instanceof Error && cause.message) {
    return cause.message;
  }

  return "Could not complete the Firestore request. Please try again.";
}

function toPost(
  snapshot: QueryDocumentSnapshot<DocumentData> | DocumentSnapshot<DocumentData>,
): Post {
  const data = snapshot.data() ?? {};

  return {
    id: snapshot.id,
    title: typeof data.title === "string" ? data.title : "",
    category: typeof data.category === "string" ? data.category : "",
    content: typeof data.content === "string" ? data.content : "",
    excerpt: typeof data.excerpt === "string" ? data.excerpt : "",
    readTime: typeof data.readTime === "string" ? data.readTime : "1 min",
    coverImageUrl:
      typeof data.coverImageUrl === "string" ? data.coverImageUrl : "",
    coverImagePath:
      typeof data.coverImagePath === "string" ? data.coverImagePath : "",
    authorId: typeof data.authorId === "string" ? data.authorId : "",
    authorName:
      typeof data.authorName === "string" ? data.authorName : "BlogX member",
    authorPhotoUrl:
      typeof data.authorPhotoUrl === "string" ? data.authorPhotoUrl : null,
    summary: typeof data.summary === "string" ? data.summary : "",
    summaryModel: typeof data.summaryModel === "string" ? data.summaryModel : "",
    summarizedAt:
      data.summarizedAt instanceof Timestamp ? data.summarizedAt : null,
    createdAt: data.createdAt instanceof Timestamp ? data.createdAt : null,
    updatedAt: data.updatedAt instanceof Timestamp ? data.updatedAt : null,
  };
}

export function usePosts(): PostsState {
  const [posts, setPosts] = useState<Post[]>([]);
  const [loading, setLoading] = useState(db !== null);
  const [error, setError] = useState<string | null>(
    db ? null : notConfiguredMessage,
  );

  useEffect(() => {
    if (!db) {
      return;
    }

    const postsQuery = query(
      collection(db, "posts"),
      orderBy("createdAt", "desc"),
    );

    return onSnapshot(
      postsQuery,
      (snapshot) => {
        setPosts(snapshot.docs.map(toPost));
        setError(null);
        setLoading(false);
      },
      (cause) => {
        setError(getFirestoreErrorMessage(cause));
        setLoading(false);
      },
    );
  }, []);

  return { posts, loading, error };
}

export function usePost(postId: string | undefined): PostState {
  const [post, setPost] = useState<Post | null>(null);
  const [loading, setLoading] = useState(Boolean(db && postId));
  const [error, setError] = useState<string | null>(
    db ? null : notConfiguredMessage,
  );

  useEffect(() => {
    if (!db || !postId) {
      setLoading(false);
      return;
    }

    return onSnapshot(
      doc(db, "posts", postId),
      (snapshot) => {
        setPost(snapshot.exists() ? toPost(snapshot) : null);
        setError(null);
        setLoading(false);
      },
      (cause) => {
        setError(getFirestoreErrorMessage(cause));
        setLoading(false);
      },
    );
  }, [postId]);

  return { post, loading, error };
}

export async function createPost(
  input: CreatePostInput,
  user: User,
): Promise<string> {
  if (!db) {
    throw new Error(
      "Publishing is unavailable because Firebase is not configured.",
    );
  }

  const postRef = await addDoc(collection(db, "posts"), {
    title: input.title.trim(),
    category: input.category.trim(),
    content: input.content,
    excerpt: getExcerpt(input.content),
    readTime: estimateReadTime(input.content),
    coverImageUrl: input.coverImageUrl,
    coverImagePath: input.coverImagePath,
    authorId: user.uid,
    authorName: user.displayName ?? user.email ?? "BlogX member",
    authorPhotoUrl: user.photoURL ?? null,
    createdAt: serverTimestamp(),
    updatedAt: serverTimestamp(),
  });

  return postRef.id;
}
