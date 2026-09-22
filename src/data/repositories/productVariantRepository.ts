import type { ProductVariant } from "@/domain/master/types";

import type { SqlExecutor, SqlParam } from "../db/types";

interface ProductVariantRow {
  id: string;
  name: string;
  selling_price: number;
  description: string | null;
  low_stock_threshold: number;
  is_active: number;
  created_at: string;
  updated_at: string;
}

function toProductVariant(row: ProductVariantRow): ProductVariant {
  return {
    id: row.id,
    name: row.name,
    sellingPrice: row.selling_price,
    description: row.description,
    lowStockThreshold: row.low_stock_threshold,
    isActive: row.is_active === 1,
    createdAt: row.created_at,
    updatedAt: row.updated_at,
  };
}

export interface NewProductVariantRecord {
  id: string;
  name: string;
  sellingPrice: number;
  description: string | null;
  lowStockThreshold: number;
  createdAt: string;
}

export interface ProductVariantChanges {
  name: string;
  sellingPrice: number;
  description: string | null;
  lowStockThreshold: number;
  updatedAt: string;
}

export interface ListProductVariantsParams {
  /** Termasuk produk nonaktif (untuk histori dan pengelolaan master). */
  includeInactive?: boolean;
  search?: string;
}

export interface ProductVariantRepository {
  list(params?: ListProductVariantsParams): Promise<ProductVariant[]>;
  findById(id: string): Promise<ProductVariant | null>;
  insert(record: NewProductVariantRecord): Promise<void>;
  update(id: string, changes: ProductVariantChanges): Promise<void>;
  setActive(id: string, isActive: boolean, updatedAt: string): Promise<void>;
}

const SELECT_COLUMNS = `
  id, name, selling_price, description, low_stock_threshold, is_active, created_at, updated_at
`;

export function createProductVariantRepository(db: SqlExecutor): ProductVariantRepository {
  return {
    async list(params = {}): Promise<ProductVariant[]> {
      const conditions: string[] = [];
      const values: SqlParam[] = [];

      if (params.includeInactive !== true) {
        conditions.push("is_active = 1");
      }

      const search = params.search?.trim();
      if (search !== undefined && search.length > 0) {
        conditions.push("name LIKE ?");
        values.push(`%${search}%`);
      }

      const where = conditions.length > 0 ? `WHERE ${conditions.join(" AND ")}` : "";
      const rows = await db.getAllAsync<ProductVariantRow>(
        `SELECT ${SELECT_COLUMNS} FROM product_variants ${where} ORDER BY name COLLATE NOCASE ASC`,
        values,
      );

      return rows.map(toProductVariant);
    },

    async findById(id: string): Promise<ProductVariant | null> {
      const row = await db.getFirstAsync<ProductVariantRow>(
        `SELECT ${SELECT_COLUMNS} FROM product_variants WHERE id = ?`,
        [id],
      );

      return row === null ? null : toProductVariant(row);
    },

    async insert(record: NewProductVariantRecord): Promise<void> {
      await db.runAsync(
        `INSERT INTO product_variants
           (id, name, selling_price, description, low_stock_threshold, is_active, created_at, updated_at)
         VALUES (?, ?, ?, ?, ?, 1, ?, ?)`,
        [
          record.id,
          record.name,
          record.sellingPrice,
          record.description,
          record.lowStockThreshold,
          record.createdAt,
          record.createdAt,
        ],
      );
    },

    async update(id: string, changes: ProductVariantChanges): Promise<void> {
      await db.runAsync(
        `UPDATE product_variants
            SET name = ?, selling_price = ?, description = ?, low_stock_threshold = ?, updated_at = ?
          WHERE id = ?`,
        [
          changes.name,
          changes.sellingPrice,
          changes.description,
          changes.lowStockThreshold,
          changes.updatedAt,
          id,
        ],
      );
    },

    async setActive(id: string, isActive: boolean, updatedAt: string): Promise<void> {
      await db.runAsync(
        "UPDATE product_variants SET is_active = ?, updated_at = ? WHERE id = ?",
        [isActive ? 1 : 0, updatedAt, id],
      );
    },
  };
}
