import { V1_SQL } from "./schema/v1";
import { V2_SQL } from "./schema/v2";
import type { SqlExecutor } from "./types";

/** Menjalankan seluruh migrasi yang belum diterapkan. Mengembalikan versi akhir. */
export async function runMigrations(db: SqlExecutor): Promise<number> {
  // Foreign key enforcement bersifat per-koneksi dan harus diaktifkan eksplisit.
  await db.execAsync("PRAGMA foreign_keys = ON;");

  let version = await getSchemaVersion(db);

  for (const migration of MIGRATIONS) {
    if (migration.version <= version) {
      continue;
    }

    await db.transactionAsync(async () => {
      await db.execAsync(migration.sql);
      await db.execAsync(`PRAGMA user_version = ${migration.version}`);
    });

    version = migration.version;
  }

  return version;
}

export interface Migration {
  version: number;
  description: string;
  sql: string;
}

export const MIGRATIONS: readonly Migration[] = [
  { version: 1, description: "master data (business, users, products, agents)", sql: V1_SQL },
  { version: 2, description: "produksi dan stock movement", sql: V2_SQL },
];

export const CURRENT_SCHEMA_VERSION = MIGRATIONS.reduce(
  (highest, migration) => Math.max(highest, migration.version),
  0,
);

export async function getSchemaVersion(db: SqlExecutor): Promise<number> {
  const row = await db.getFirstAsync<{ user_version: number }>("PRAGMA user_version");
  return row?.user_version ?? 0;
}
