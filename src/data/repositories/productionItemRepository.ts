import type { ProductionItem } from "../../domain/types";
import type { SqlExecutor, SqlParam } from "../db/types";

export interface NewProductionItemRecord {
  id: string;
  productionBatchId: string;
  productVariantId: string;
  quantity: number;
  createdAt: string;
}

export interface ProductionItemChanges {
  productVariantId: string;
  quantity: number;
  updatedAt: string;
}

export interface ListProductionItemsParams {
  productionBatchId?: string;
}

export interface ProductionItemRepository {
  list(params?: ListProductionItemsParams): Promise<ProductionItem[]>;
  findById(id: string): Promise<ProductionItem | null>;
  findByBatchIdAndProductVariantId(
    productionBatchId: string,
    productVariantId: string,
  ): Promise<ProductionItem | null>;
  insert(record: NewProductionItemRecord): Promise<void>;
  update(id: string, changes: ProductionItemChanges): Promise<void>;
  delete(id: string): Promise<void>;
  deleteByBatchId(productionBatchId: string): Promise<void>;
}

const SELECT_COLUMNS = `
  id, production_batch_id, product_variant_id, quantity, created_at, updated_at
`;

export function createProductionItemRepository(db: SqlExecutor): ProductionItemRepository {
  return {
    async list(params = {}): Promise<ProductionItem[]> {
      const conditions: string[] = [];
      const values: SqlParam[] = [];

      if (params.productionBatchId !== undefined) {
        conditions.push("production_batch_id = ?");
        values.push(params.productionBatchId);
      }

      const where = conditions.length > 0 ? `WHERE ${conditions.join(" AND ")}` : "";
      const rows = await db.getAllAsync<ProductionItemRow>(
        `SELECT ${SELECT_COLUMNS} FROM production_items ${where} ORDER BY created_at ASC`,
        values,
      );

      return rows.map(toProductionItem);
    },

    async findById(id: string): Promise<ProductionItem | null> {
      const row = await db.getFirstAsync<ProductionItemRow>(
        `SELECT ${SELECT_COLUMNS} FROM production_items WHERE id = ?`,
        [id],
      );

      return row === null ? null : toProductionItem(row);
    },

    async findByBatchIdAndProductVariantId(
      productionBatchId: string,
      productVariantId: string,
    ): Promise<ProductionItem | null> {
      const row = await db.getFirstAsync<ProductionItemRow>(
        `SELECT ${SELECT_COLUMNS} FROM production_items
         WHERE production_batch_id = ? AND product_variant_id = ?`,
        [productionBatchId, productVariantId],
      );

      return row === null ? null : toProductionItem(row);
    },

    async insert(record: NewProductionItemRecord): Promise<void> {
      await db.runAsync(
        `INSERT INTO production_items
           (id, production_batch_id, product_variant_id, quantity, created_at, updated_at)
         VALUES (?, ?, ?, ?, ?, ?)`,
        [
          record.id,
          record.productionBatchId,
          record.productVariantId,
          record.quantity,
          record.createdAt,
          record.createdAt,
        ],
      );
    },

    async update(id: string, changes: ProductionItemChanges): Promise<void> {
      await db.runAsync(
        `UPDATE production_items
           SET product_variant_id = ?, quantity = ?, updated_at = ?
         WHERE id = ?`,
        [changes.productVariantId, changes.quantity, changes.updatedAt, id],
      );
    },

    async delete(id: string): Promise<void> {
      await db.runAsync("DELETE FROM production_items WHERE id = ?", [id]);
    },

    async deleteByBatchId(productionBatchId: string): Promise<void> {
      await db.runAsync("DELETE FROM production_items WHERE production_batch_id = ?", [
        productionBatchId,
      ]);
    },
  };
}

interface ProductionItemRow {
  id: string;
  production_batch_id: string;
  product_variant_id: string;
  quantity: number;
  created_at: string;
  updated_at: string;
}

function toProductionItem(row: ProductionItemRow): ProductionItem {
  return {
    id: row.id,
    productionBatchId: row.production_batch_id,
    productVariantId: row.product_variant_id,
    quantity: row.quantity,
    createdAt: row.created_at,
    updatedAt: row.updated_at,
  };
}
