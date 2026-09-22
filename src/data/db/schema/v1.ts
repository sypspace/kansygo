/**
 * Migrasi v1 — master data.
 *
 * Cakupan sengaja dibatasi pada tabel yang benar-benar dipakai Fase 1.
 * Tabel transaksi (production, delivery, sales, settlement, dsb.) ditambahkan
 * melalui migrasi berikutnya saat fasenya dikerjakan, sehingga setiap migrasi
 * tervalidasi oleh pemakaian nyata (AGENTS.md §17).
 *
 * Aturan skema:
 * - ID stabil berupa TEXT (UUID v4, D-09) agar siap untuk future sync;
 * - nilai uang dan quantity berupa INTEGER rupiah/pcs;
 * - histori tidak dihapus, master data dinonaktifkan melalui `is_active` (D-13).
 */
export const V1_SQL = `
CREATE TABLE IF NOT EXISTS business (
  id INTEGER PRIMARY KEY CHECK (id = 1),
  name TEXT NOT NULL,
  legal_name TEXT,
  tax_id TEXT,
  address TEXT,
  phone TEXT,
  email TEXT,
  logo_uri TEXT,
  invoice_prefix TEXT NOT NULL DEFAULT 'INV',
  created_at TEXT NOT NULL,
  updated_at TEXT NOT NULL
);

CREATE TABLE IF NOT EXISTS users (
  id TEXT PRIMARY KEY NOT NULL,
  name TEXT NOT NULL,
  email TEXT,
  role TEXT NOT NULL DEFAULT 'OWNER_ADMIN'
    CHECK (role IN ('OWNER_ADMIN', 'PRODUCTION', 'DELIVERY')),
  profile_info TEXT,
  created_at TEXT NOT NULL,
  updated_at TEXT NOT NULL
);

CREATE TABLE IF NOT EXISTS product_variants (
  id TEXT PRIMARY KEY NOT NULL,
  name TEXT NOT NULL,
  selling_price INTEGER NOT NULL CHECK (selling_price >= 0),
  description TEXT,
  low_stock_threshold INTEGER NOT NULL DEFAULT 0 CHECK (low_stock_threshold >= 0),
  is_active INTEGER NOT NULL DEFAULT 1 CHECK (is_active IN (0, 1)),
  created_at TEXT NOT NULL,
  updated_at TEXT NOT NULL
);

CREATE INDEX IF NOT EXISTS idx_product_variants_active_name
  ON product_variants (is_active, name);

CREATE TABLE IF NOT EXISTS agents (
  id TEXT PRIMARY KEY NOT NULL,
  name TEXT NOT NULL,
  contact TEXT,
  address TEXT,
  location TEXT,
  fee_per_unit INTEGER NOT NULL DEFAULT 0 CHECK (fee_per_unit >= 0),
  is_active INTEGER NOT NULL DEFAULT 1 CHECK (is_active IN (0, 1)),
  created_at TEXT NOT NULL,
  updated_at TEXT NOT NULL
);

CREATE INDEX IF NOT EXISTS idx_agents_active_name ON agents (is_active, name);
`;
