/** Date calendaire YYYY-MM-DD dans un fuseau (ex. Europe/Paris). */
export function calendarDateInTimeZone(
  timeZone: string,
  date: Date = new Date()
): string {
  return new Intl.DateTimeFormat("en-CA", {
    timeZone,
    year: "numeric",
    month: "2-digit",
    day: "2-digit",
  }).format(date);
}

/** Midi UTC pour ce jour calendaire — évite les décalages avec @db.Date. */
export function calendarIsoToPrismaDate(iso: string): Date {
  const [y, m, d] = iso.split("-").map(Number);
  if (!y || !m || !d) throw new Error("Date invalide");
  return new Date(Date.UTC(y, m - 1, d, 12, 0, 0, 0));
}

export const CLIENT_TIMEZONE = "Europe/Paris";
