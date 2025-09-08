export function convertTo12Hour(time24?: string | null): string {
  if (!time24) return "";
  const [hourStr, minuteStr = "00"] = time24.split(":");
  const hourNum = Number(hourStr);
  if (Number.isNaN(hourNum)) return String(time24);
  const period = hourNum >= 12 ? "PM" : "AM";
  const hour12 = hourNum % 12 || 12;
  const minute = minuteStr.slice(0, 2).padStart(2, "0");
  return `${hour12}:${minute} ${period}`;
}

export function TimeDisplay({ time24 }: { time24?: string | null }) {
  const formattedTime = convertTo12Hour(time24);
  return <span>{formattedTime}</span>;
}

export function timeAgo(input?: string | Date | null): string {
  if (!input) return "";
  const date = typeof input === "string" ? new Date(input) : input;
  if (!date || Number.isNaN(date.getTime())) return "";
  const now = new Date();
  let seconds = Math.floor((now.getTime() - date.getTime()) / 1000);
  if (seconds < 0) seconds = 0;

  const units = [
    { label: "year", secs: 31536000 },
    { label: "month", secs: 2592000 },
    { label: "day", secs: 86400 },
    { label: "hour", secs: 3600 },
    { label: "minute", secs: 60 },
    { label: "second", secs: 1 },
  ];

  for (const u of units) {
    if (seconds >= u.secs) {
      const count = Math.floor(seconds / u.secs);
      const plural = count === 1 ? "" : "s";
      return `${count} ${u.label}${plural} ago`;
    }
  }
  return "just now";
}

export function toStringArray(input: unknown): string[] {
  if (Array.isArray(input)) {
    return input.map((v) => String(v)).filter((s) => s.length > 0);
  }
  if (typeof input === "string") {
    const trimmed = input.trim();
    // Postgres array literal: {"A","B"}
    if (trimmed.startsWith("{") && trimmed.endsWith("}")) {
      const inner = trimmed.slice(1, -1);
      if (inner === "") return [];
      return inner
        .split(",")
        .map((s) => s.trim().replace(/^"|^'|"$|'$/g, ""))
        .filter((s) => s.length > 0);
    }
    // Comma-separated fallback
    if (trimmed.includes(",")) {
      return trimmed
        .split(",")
        .map((s) => s.trim())
        .filter((s) => s.length > 0);
    }
    return trimmed ? [trimmed] : [];
  }
  if (input && typeof input === "object") {
    try {
      return Object.values(input as Record<string, unknown>)
        .map((v) => String(v))
        .filter((s) => s.length > 0);
    } catch {
      return [];
    }
  }
  return [];
}
