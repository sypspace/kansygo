import type { Clock } from "@/application/ports";

function pad(value: number): string {
  return String(value).padStart(2, "0");
}

/**
 * Implementasi Clock berdasarkan waktu perangkat.
 *
 * created_at/updated_at disimpan sebagai timestamp UTC, sedangkan tanggal
 * transaksi memakai tanggal lokal perangkat agar sesuai hari kerja pengguna.
 */
export const systemClock: Clock = {
  nowIso(): string {
    return new Date().toISOString();
  },

  todayIso(): string {
    const now = new Date();
    return `${now.getFullYear()}-${pad(now.getMonth() + 1)}-${pad(now.getDate())}`;
  },
};
