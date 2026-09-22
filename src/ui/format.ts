/**
 * Helper format untuk presentasi.
 *
 * Nilai tersimpan tetap dalam bentuk aslinya (ISO-8601 / integer rupiah);
 * format hanya dipakai saat ditampilkan ke pengguna.
 */

const MONTHS = [
  "Jan",
  "Feb",
  "Mar",
  "Apr",
  "Mei",
  "Jun",
  "Jul",
  "Agu",
  "Sep",
  "Okt",
  "Nov",
  "Des",
];

function pad(value: number): string {
  return String(value).padStart(2, "0");
}

/** "2026-09-20" → "20 Sep 2026". Nilai tak dikenal dikembalikan apa adanya. */
export function formatDate(isoDate: string): string {
  const match = /^(\d{4})-(\d{2})-(\d{2})$/.exec(isoDate.trim());

  if (match === null) {
    return isoDate;
  }

  const [, year, month, day] = match;
  const monthLabel = MONTHS[Number(month) - 1];

  return monthLabel === undefined ? isoDate : `${Number(day)} ${monthLabel} ${year}`;
}

/** Timestamp ISO → "20 Sep 2026 08:15" (waktu lokal). */
export function formatDateTime(isoTimestamp: string): string {
  const date = new Date(isoTimestamp);

  if (Number.isNaN(date.getTime())) {
    return isoTimestamp;
  }

  const monthLabel = MONTHS[date.getMonth()] ?? "";

  return `${date.getDate()} ${monthLabel} ${date.getFullYear()} ${pad(date.getHours())}:${pad(
    date.getMinutes(),
  )}`;
}
