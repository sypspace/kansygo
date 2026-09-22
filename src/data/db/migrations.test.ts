/** @jest-environment node */

import { CURRENT_SCHEMA_VERSION, getSchemaVersion, runMigrations } from "./migrations";
import { createMigratedTestDatabase } from "./testing/createMigratedTestDatabase";
import { createInMemoryDatabase, createNodeSqliteExecutor } from "./testing/nodeSqliteExecutor";

async function listTableNames(): Promise<string[]> {
  const db = await createMigratedTestDatabase();
  const rows = await db.getAllAsync<{ name: string }>(
    "SELECT name FROM sqlite_master WHERE type = 'table' ORDER BY name",
  );

  return rows.map((row) => row.name);
}

describe("migrasi skema lokal", () => {
  it("menerapkan versi skema terbaru dari database kosong", async () => {
    const db = createNodeSqliteExecutor(createInMemoryDatabase());

    expect(await getSchemaVersion(db)).toBe(0);

    const version = await runMigrations(db);

    expect(version).toBe(CURRENT_SCHEMA_VERSION);
    expect(await getSchemaVersion(db)).toBe(CURRENT_SCHEMA_VERSION);
  });

  it("idempoten: menjalankan migrasi dua kali tidak mengubah skema", async () => {
    const db = createNodeSqliteExecutor(createInMemoryDatabase());

    await runMigrations(db);
    const firstRunTables = await db.getAllAsync<{ name: string }>(
      "SELECT name FROM sqlite_master WHERE type = 'table' ORDER BY name",
    );

    await runMigrations(db);
    const secondRunTables = await db.getAllAsync<{ name: string }>(
      "SELECT name FROM sqlite_master WHERE type = 'table' ORDER BY name",
    );

    expect(secondRunTables).toEqual(firstRunTables);
    expect(await getSchemaVersion(db)).toBe(CURRENT_SCHEMA_VERSION);
  });

  it("membuat seluruh tabel master dan index pendukung", async () => {
    const tables = await listTableNames();

    expect(tables).toEqual(
      expect.arrayContaining([
        "agents",
        "business",
        "product_variants",
        "users",
      ]),
    );

    const db = await createMigratedTestDatabase();
    const indexes = await db.getAllAsync<{ name: string }>(
      "SELECT name FROM sqlite_master WHERE type = 'index' AND name LIKE 'idx_%' ORDER BY name",
    );

    expect(indexes.map((row) => row.name)).toEqual([
      "idx_agents_active_name",
      "idx_product_variants_active_name",
    ]);
  });

  it("tidak lagi membuat tabel app_settings (BL-017-04: REMOVE)", async () => {
    const tables = await listTableNames();

    expect(tables).not.toContain("app_settings");
  });

  it("menolak data yang melanggar constraint (AC-DI-001)", async () => {
    const db = await createMigratedTestDatabase();
    const createdAt = "2026-09-20T01:00:00.000Z";

    // Harga jual negatif ditolak oleh CHECK.
    await expect(
      db.runAsync(
        `INSERT INTO product_variants
           (id, name, selling_price, description, low_stock_threshold, is_active, created_at, updated_at)
         VALUES (?, ?, ?, ?, ?, ?, ?, ?)`,
        ["product-1", "Coklat", -1, null, 0, 1, createdAt, createdAt],
      ),
    ).rejects.toThrow();

    // Business hanya boleh satu baris (BR-BP-001).
    await expect(
      db.runAsync(
        `INSERT INTO business
           (id, name, invoice_prefix, created_at, updated_at)
         VALUES (?, ?, ?, ?, ?)`,
        [2, "Business lain", "INV", createdAt, createdAt],
      ),
    ).rejects.toThrow();
  });
});
