/**
 * Port untuk dependensi yang berasal dari luar aplikasi.
 *
 * Di-inject (bukan diimpor langsung) supaya:
 * - test dapat berjalan deterministik tanpa waktu/ID acak (AGENTS.md §34);
 * - lapisan application tetap bebas dari modul native.
 */

export interface Clock {
  /** Timestamp lengkap UTC (ISO-8601) untuk created_at/updated_at. */
  nowIso(): string;
  /** Tanggal lokal perangkat (YYYY-MM-DD) untuk transaksi harian. */
  todayIso(): string;
}

export interface IdGenerator {
  /** Identifier stabil (UUID v4, D-09). */
  newId(): string;
}
