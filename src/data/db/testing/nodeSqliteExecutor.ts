/// <reference types="node" />
import { DatabaseSync } from "node:sqlite";

import type { SqlExecutor, SqlParam, SqlRunResult } from "../types";

/**
 * Adapter test berbasis `node:sqlite` (built-in Node 22+).
 *
 * Dipakai HANYA oleh test agar repository dan skema SQL dapat diuji tanpa device
 * maupun emulator, dan tanpa menambah dependency native. File ini tidak boleh
 * diimpor oleh kode aplikasi.
 */
export function createNodeSqliteExecutor(db: DatabaseSync): SqlExecutor {
  let inTransaction = false;

  return {
    async execAsync(sql: string): Promise<void> {
      db.exec(sql);
    },

    async runAsync(sql: string, params: readonly SqlParam[] = []): Promise<SqlRunResult> {
      const statement = db.prepare(sql);
      const info = statement.run(...(params as SqlParam[]));

      return {
        changes: Number(info.changes),
        lastInsertRowId: Number(info.lastInsertRowid),
      };
    },

    async getAllAsync<T>(sql: string, params: readonly SqlParam[] = []): Promise<T[]> {
      return db.prepare(sql).all(...(params as SqlParam[])) as T[];
    },

    async getFirstAsync<T>(sql: string, params: readonly SqlParam[] = []): Promise<T | null> {
      const row = db.prepare(sql).get(...(params as SqlParam[]));
      return (row ?? null) as T | null;
    },

    async transactionAsync<T>(task: () => Promise<T>): Promise<T> {
      // SQLite tidak mendukung nested transaction; gunakan savepoint sederhana
      // dengan cara menjalankan task langsung bila sudah berada dalam transaksi.
      if (inTransaction) {
        return task();
      }

      inTransaction = true;
      db.exec("BEGIN IMMEDIATE");

      try {
        const result = await task();
        db.exec("COMMIT");
        return result;
      } catch (error) {
        db.exec("ROLLBACK");
        throw error;
      } finally {
        inTransaction = false;
      }
    },
  };
}

/** Database in-memory untuk pengujian. */
export function createInMemoryDatabase(): DatabaseSync {
  return new DatabaseSync(":memory:");
}
