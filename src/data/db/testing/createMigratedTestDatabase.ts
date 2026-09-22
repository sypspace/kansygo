/// <reference types="node" />
import { runMigrations } from "../migrations";
import type { SqlExecutor } from "../types";
import { createInMemoryDatabase, createNodeSqliteExecutor } from "./nodeSqliteExecutor";

/**
 * Database in-memory yang sudah dimigrasi, untuk integration test repository.
 * Skema yang diuji identik dengan skema aplikasi karena memakai migrasi yang sama.
 */
export async function createMigratedTestDatabase(): Promise<SqlExecutor> {
  const db = createNodeSqliteExecutor(createInMemoryDatabase());
  await runMigrations(db);
  return db;
}
