/**
 * Abstraksi eksekusi SQL.
 *
 * Domain dan repository hanya bergantung pada interface ini sehingga:
 * - implementasi SQLite dapat diuji tanpa device (test adapter `node:sqlite`);
 * - business logic tidak bergantung langsung pada `expo-sqlite` (AC-FU-002).
 */

export type SqlParam = string | number | null;

export interface SqlRunResult {
  changes: number;
  lastInsertRowId: number;
}

export interface SqlExecutor {
  /** Menjalankan satu atau beberapa statement tanpa parameter. */
  execAsync(sql: string): Promise<void>;
  /** Menjalankan statement dengan parameter bind. */
  runAsync(sql: string, params?: readonly SqlParam[]): Promise<SqlRunResult>;
  getAllAsync<T>(sql: string, params?: readonly SqlParam[]): Promise<T[]>;
  getFirstAsync<T>(sql: string, params?: readonly SqlParam[]): Promise<T | null>;
  /**
   * Menjalankan seluruh perubahan sebagai satu transaksi atomik
   * (BR-DI-001, AC-DI-001).
   */
  transactionAsync<T>(task: () => Promise<T>): Promise<T>;
}
