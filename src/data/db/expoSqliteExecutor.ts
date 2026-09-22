import type { SQLiteDatabase } from "expo-sqlite";

import type { SqlExecutor, SqlParam, SqlRunResult } from "./types";

/**
 * Adapter `expo-sqlite` untuk `SqlExecutor`.
 *
 * Catatan transaksi: `withTransactionAsync` bersifat non-exclusive. Pada MVP
 * aplikasi berjalan single-user pada satu device dengan operasi yang berurutan,
 * sehingga pendekatan ini memadai dan tetap menjaga atomicity satu operasi bisnis
 * (BR-DI-001).
 */
export function createExpoSqliteExecutor(db: SQLiteDatabase): SqlExecutor {
  return {
    async execAsync(sql: string): Promise<void> {
      await db.execAsync(sql);
    },

    async runAsync(sql: string, params: readonly SqlParam[] = []): Promise<SqlRunResult> {
      const result = await db.runAsync(sql, params as SqlParam[]);
      return { changes: result.changes, lastInsertRowId: result.lastInsertRowId };
    },

    async getAllAsync<T>(sql: string, params: readonly SqlParam[] = []): Promise<T[]> {
      return db.getAllAsync<T>(sql, params as SqlParam[]);
    },

    async getFirstAsync<T>(sql: string, params: readonly SqlParam[] = []): Promise<T | null> {
      const row = await db.getFirstAsync<T>(sql, params as SqlParam[]);
      return row ?? null;
    },

    async transactionAsync<T>(task: () => Promise<T>): Promise<T> {
      let result: T | undefined;

      await db.withTransactionAsync(async () => {
        result = await task();
      });

      return result as T;
    },
  };
}

/** Pengaturan koneksi yang dibutuhkan aplikasi sebelum migrasi dijalankan. */
export async function prepareExpoSqliteDatabase(db: SQLiteDatabase): Promise<void> {
  await db.execAsync("PRAGMA journal_mode = WAL; PRAGMA foreign_keys = ON;");
}
