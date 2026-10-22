import { Timestamp } from "firebase/firestore";

const dateFormatter = new Intl.DateTimeFormat("en-US", {
  month: "short",
  day: "numeric",
  year: "numeric",
  timeZone: "UTC",
});

type DateValue = Timestamp | Date | string | null | undefined;

export function formatPostDate(value: DateValue): string {
  const date =
    value instanceof Timestamp
      ? value.toDate()
      : value instanceof Date
        ? value
        : typeof value === "string"
          ? new Date(value)
          : null;

  if (!date || Number.isNaN(date.getTime())) {
    return "Just now";
  }

  return dateFormatter.format(date);
}

export function getInitials(name: string): string {
  return name
    .split(" ")
    .map((part) => part[0] ?? "")
    .join("")
    .slice(0, 2)
    .toUpperCase();
}
