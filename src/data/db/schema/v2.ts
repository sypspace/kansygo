/**
 * Migrasi v2 — produksi dan stock movement.
 *
 * Menambahkan tabel:
 * - production_batches
 * - production_items
 * - stock_movements
 *
 * Prinsip:
 * - ID stabil berupa TEXT (UUID v4, D-09).
 * - Nomor batch bertipe TEXT dan ditentukan saat pembuatan.
 * - Status batch eksplisit (DRAFT/FINAL) untuk mengontrol editabilitas.
 * - Stock movement bersifat umum agar bisa dipakai di fase lain.
 */

export const V2_SQL = `
-- Production batches
CREATE TABLE IF NOT EXISTS production_batches (
  id TEXT PRIMARY KEY NOT NULL,
  batch_number TEXT NOT NULL,
  production_date TEXT NOT NULL,
  status TEXT NOT NULL CHECK (status IN ('DRAFT', 'FINAL')),
  notes TEXT,
  created_at TEXT NOT NULL,
  updated_at TEXT NOT NULL
);

CREATE INDEX IF NOT EXISTS idx_production_batches_status
  ON production_batches (status);
CREATE INDEX IF NOT EXISTS idx_production_batches_production_date
  ON production_batches (production_date);

-- Production items
CREATE TABLE IF NOT EXISTS production_items (
  id TEXT PRIMARY KEY NOT NULL,
  production_batch_id TEXT NOT NULL REFERENCES production_batches(id) ON DELETE CASCADE,
  product_variant_id TEXT NOT NULL REFERENCES product_variants(id),
  quantity INTEGER NOT NULL CHECK (quantity >= 0),
  created_at TEXT NOT NULL,
  updated_at TEXT NOT NULL,
  UNIQUE (production_batch_id, product_variant_id)
);

CREATE INDEX IF NOT EXISTS idx_production_items_batch
  ON production_items (production_batch_id);

-- Stock movements (umum, bisa untuk fase lain)
CREATE TABLE IF NOT EXISTS stock_movements (
  id TEXT PRIMARY KEY NOT NULL,
  product_variant_id TEXT NOT NULL REFERENCES product_variants(id),
  quantity INTEGER NOT NULL CHECK (quantity > 0),
  movement_type TEXT NOT NULL CHECK (movement_type IN (
    'PRODUCTION', 'DELIVERY', 'RETURN', 'SOLD', 'WASTE', 'ADJUSTMENT'
  )),
  location TEXT NOT NULL CHECK (location IN ('OWNER', 'AGENT')),
  direction TEXT NOT NULL CHECK (direction IN ('IN', 'OUT')),
  source_batch_id TEXT REFERENCES production_batches(id),
  source_type TEXT,
  reference_id TEXT,
  note TEXT,
  created_at TEXT NOT NULL,
  updated_at TEXT NOT NULL
);

CREATE INDEX IF NOT EXISTS idx_stock_movements_product
  ON stock_movements (product_variant_id);
CREATE INDEX IF NOT EXISTS idx_stock_movements_location
  ON stock_movements (location);
CREATE INDEX IF NOT EXISTS idx_stock_movements_type
  ON stock_movements (movement_type);
CREATE INDEX IF NOT EXISTS idx_stock_movements_batch
  ON stock_movements (source_batch_id);
CREATE INDEX IF NOT EXISTS idx_stock_movements_date
  ON stock_movements (created_at);
`;

/**
 * Helper untuk menghasilkan nomor batch format BT-YYYYMMDD-NNN.
 *
 * NNN adalah urutan per hari sesuai production_date.
 */
export function generateBatchNumber(productionDate: string, sequence: number): string {
  const datePart = productionDate.replace(/-/g, "");
  const sequencePart = String(sequence).padStart(3, "0");
  return `BT-${datePart}-${sequencePart}`;
}
