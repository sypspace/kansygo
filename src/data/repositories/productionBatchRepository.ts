import type { ProductionBatch, ProductionBatchStatus } from "../../domain/types";
import type { SqlExecutor, SqlParam } from "../db/types";

export interface NewProductionBatchRecord {
  id: string;
  batchNumber: string;
  productionDate: string;
  status: ProductionBatchStatus;
  notes: string | null;
  createdAt: string;
}

export interface ProductionBatchChanges {
  productionDate: string;
  notes: string | null;
  updatedAt: string;
}

export interface ListProductionBatchesParams {
  status?: ProductionBatchStatus;
  productionDate?: string;
  search?: string;
}

export interface ProductionBatchRepository {
  list(params?: ListProductionBatchesParams): Promise<ProductionBatch[]>;
  findById(id: string): Promise<ProductionBatch | null>;
  insert(record: NewProductionBatchRecord): Promise<void>;
  update(id: string, changes: ProductionBatchChanges): Promise<void>;
  setStatus(id: string, status: ProductionBatchStatus, updatedAt: string): Promise<void>;
  delete(id: string): Promise<void>;
  countByProductionDate(productionDate: string): Promise<number>;
}

const SELECT_COLUMNS = `
  id, batch_number, production_date, status, notes, created_at, updated_at
`;

export function createProductionBatchRepository(db: SqlExecutor): ProductionBatchRepository {
  return {
    async list(params = {}): Promise<ProductionBatch[]> {
      const conditions: string[] = [];
      const values: SqlParam[] = [];

      if (params.status !== undefined) {
        conditions.push("status = ?");
        values.push(params.status);
      }

      if (params.productionDate !== undefined) {
        conditions.push("production_date = ?");
        values.push(params.productionDate);
      }

      const search = params.search?.trim();
      if (search !== undefined && search.length > 0) {
        conditions.push("(batch_number LIKE ? OR notes LIKE ?)");
        values.push(`%${search}%`, `%${search}%`);
      }

      const where = conditions.length > 0 ? `WHERE ${conditions.join(" AND ")}` : "";
      const rows = await db.getAllAsync<ProductionBatchRow>(
        `SELECT ${SELECT_COLUMNS} FROM production_batches ${where} ORDER BY production_date DESC, batch_number ASC`,
        values,
      );

      return rows.map(toProductionBatch);
    },

    async findById(id: string): Promise<ProductionBatch | null> {
      const row = await db.getFirstAsync<ProductionBatchRow>(
        `SELECT ${SELECT_COLUMNS} FROM production_batches WHERE id = ?`,
        [id],
      );

      return row === null ? null : toProductionBatch(row);
    },

    async insert(record: NewProductionBatchRecord): Promise<void> {
      await db.runAsync(
        `INSERT INTO production_batches
           (id, batch_number, production_date, status, notes, created_at, updated_at)
         VALUES (?, ?, ?, ?, ?, ?, ?)`,
        [
          record.id,
          record.batchNumber,
          record.productionDate,
          record.status,
          record.notes,
          record.createdAt,
          record.createdAt,
        ],
      );
    },

    async update(id: string, changes: ProductionBatchChanges): Promise<void> {
      await db.runAsync(
        `UPDATE production_batches
           SET production_date = ?, notes = ?, updated_at = ?
         WHERE id = ?`,
        [changes.productionDate, changes.notes, changes.updatedAt, id],
      );
    },

    async setStatus(id: string, status: ProductionBatchStatus, updatedAt: string): Promise<void> {
      await db.runAsync(
        "UPDATE production_batches SET status = ?, updated_at = ? WHERE id = ?",
        [status, updatedAt, id],
      );
    },

    async delete(id: string): Promise<void> {
      await db.runAsync("DELETE FROM production_batches WHERE id = ?", [id]);
    },

    async countByProductionDate(productionDate: string): Promise<number> {
      const row = await db.getFirstAsync<{ count: number }>(
        "SELECT COUNT(*) as count FROM production_batches WHERE production_date = ?",
        [productionDate],
      );

      return row?.count ?? 0;
    },
  };
}

interface ProductionBatchRow {
  id: string;
  batch_number: string;
  production_date: string;
  status: string;
  notes: string | null;
  created_at: string;
  updated_at: string;
}

function toProductionBatch(row: ProductionBatchRow): ProductionBatch {
  return {
    id: row.id,
    batchNumber: row.batch_number,
    productionDate: row.production_date,
    status: row.status as ProductionBatchStatus,
    notes: row.notes,
    createdAt: row.created_at,
    updatedAt: row.updated_at,
  };
}
