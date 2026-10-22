import { FirebaseError } from "firebase/app";
import {
  deleteObject,
  getDownloadURL,
  ref,
  uploadBytesResumable,
} from "firebase/storage";
import { storage } from "./firebase";

export const maxCoverImageBytes = 5 * 1024 * 1024;

export type UploadedCover = {
  url: string;
  path: string;
};

export function getStorageErrorMessage(cause: unknown): string {
  if (cause instanceof FirebaseError) {
    switch (cause.code) {
      case "storage/unauthorized":
        return "The cover upload was denied. Please sign in and try again.";
      case "storage/canceled":
        return "The cover upload was cancelled.";
      case "storage/quota-exceeded":
        return "The cover upload failed because storage quota was exceeded.";
      case "storage/retry-limit-exceeded":
        return "The cover upload timed out. Check your connection and try again.";
      case "storage/invalid-argument":
        return "That cover image could not be uploaded.";
      default:
        return "The cover upload failed. Please try again.";
    }
  }

  if (cause instanceof Error && cause.message) {
    return cause.message;
  }

  return "The cover upload failed. Please try again.";
}

export async function uploadPostCover(
  userId: string,
  file: File,
  onProgress?: (percent: number) => void,
): Promise<UploadedCover> {
  if (!storage) {
    throw new Error(
      "Cover uploads are unavailable because Firebase is not configured.",
    );
  }

  const safeName = file.name.replace(/[^a-zA-Z0-9._-]/g, "-");
  const path = `posts/${userId}/${Date.now()}-${safeName}`;
  const objectRef = ref(storage, path);
  const uploadTask = uploadBytesResumable(objectRef, file, {
    contentType: file.type,
  });

  await new Promise<void>((resolve, reject) => {
    uploadTask.on(
      "state_changed",
      (snapshot) => {
        const percent = Math.round(
          (snapshot.bytesTransferred / snapshot.totalBytes) * 100,
        );
        onProgress?.(percent);
      },
      (cause) => reject(cause),
      () => resolve(),
    );
  });

  return { url: await getDownloadURL(objectRef), path };
}

export async function deleteStorageObject(path: string): Promise<void> {
  if (!storage) {
    return;
  }

  await deleteObject(ref(storage, path));
}
