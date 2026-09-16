import { formatDistanceToNow, format, isValid, parseISO } from "date-fns";

/**
 * Formats a notification creation date into a clean, human-readable relative time string.
 * Examples: "Just now", "5m ago", "2h ago", "4d ago", or "Sep 12".
 */
export function formatNotificationTime(
  createdAt?: string | Date | null,
  fallbackTime?: string
): string {
  if (!createdAt) {
    return fallbackTime || "Just now";
  }

  const date =
    typeof createdAt === "string" ? parseISO(createdAt) : createdAt;

  if (!isValid(date)) {
    return fallbackTime || "Just now";
  }

  const diffInSeconds = Math.floor((Date.now() - date.getTime()) / 1000);

  // If created in the future or within the last 45 seconds
  if (diffInSeconds < 45) {
    return "Just now";
  }

  // Under 60 minutes: e.g. "5m ago"
  if (diffInSeconds < 3600) {
    const mins = Math.max(1, Math.floor(diffInSeconds / 60));
    return `${mins}m ago`;
  }

  // Under 24 hours: e.g. "3h ago"
  if (diffInSeconds < 86400) {
    const hours = Math.floor(diffInSeconds / 3600);
    return `${hours}h ago`;
  }

  // Under 7 days: e.g. "4d ago"
  if (diffInSeconds < 7 * 86400) {
    const days = Math.floor(diffInSeconds / 86400);
    return `${days}d ago`;
  }

  // 7 days or older: localized calendar date e.g. "Sep 12"
  try {
    return format(date, "MMM d");
  } catch {
    return formatDistanceToNow(date, { addSuffix: true });
  }
}

/**
 * Formats full timestamp for tooltips and hover state.
 */
export function formatFullTimestamp(createdAt?: string | Date | null): string {
  if (!createdAt) return "";
  const date =
    typeof createdAt === "string" ? parseISO(createdAt) : createdAt;
  if (!isValid(date)) return "";
  try {
    return format(date, "PPpp"); // e.g. "Sep 16, 2026, 12:45 PM"
  } catch {
    return date.toLocaleString();
  }
}
