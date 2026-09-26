/**
 * Port repository stock movement (BL-005-01 — kontrak tipe saja).
 *
 * Implementasi SQL / factory / adapter database adalah scope BL-005-06.
 * Representasi kolom tabel stock_movements menunggu keputusan BL-017-03;
 * kontrak ini sengaja bertipe pada entity domain `StockMovement` agar
 * perubahan representasi tidak mengubah bentuk port.
 */
import type { StockMovement } from "../../domain/types";

export interface ListStockMovementsParams {
  productVariantId?: string;
  movementType?: StockMovement["movementType"];
  location?: StockMovement["location"];
  sourceBatchId?: string;
}

export interface StockMovementRepository {
  insert(movement: StockMovement): Promise<void>;
  findById(id: string): Promise<StockMovement | null>;
  list(params?: ListStockMovementsParams): Promise<StockMovement[]>;
}
