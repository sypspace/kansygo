/**
 * Tipe produksi dan stock movement (Fase 2).
 *
 * Ditambahkan sesuai rencana Fase 2 — Production & inventory.
 */

/**
 * Status batch produksi (D-10).
 * - DRAFT: batch baru, belum ada item final, boleh diedit/dihapus.
 * - FINAL: sudah disimpan ke stock movement, tidak boleh diedit/dihapus via alur biasa.
 */
export const PRODUCTION_BATCH_STATUSES = ["DRAFT", "FINAL"] as const;
export type ProductionBatchStatus = (typeof PRODUCTION_BATCH_STATUSES)[number];

/**
 * Arah movement inventory (IN/OUT).
 */
export const STOCK_DIRECTIONS = ["IN", "OUT"] as const;
export type StockDirection = (typeof STOCK_DIRECTIONS)[number];

/**
 * Record produksi batch.
 */
export interface ProductionBatch {
  id: string;
  batchNumber: string;
  productionDate: string;
  status: ProductionBatchStatus;
  notes: string | null;
  createdAt: string;
  updatedAt: string;
}

/**
 * Item dalam satu batch produksi.
 * Satu varian hanya boleh satu entry per batch.
 */
export interface ProductionItem {
  id: string;
  productionBatchId: string;
  productVariantId: string;
  quantity: number;
  createdAt: string;
  updatedAt: string;
}

/**
 * Movement inventory umum (bukan khusus PRODUCTION).
 *
 * Struktur ini dirancang agar bisa dipakai juga untuk DELIVERY, RETURN,
 * SOLD, WASTE, ADJUSTMENT, dan CORRECTION di fase selanjutnya tanpa
 * mengubah bentuk tabel dasar.
 */
export interface StockMovement {
  id: string;
  productVariantId: string;
  quantity: number;
  movementType: StockMovementType;
  location: InventoryLocation;
  direction: StockDirection;
  sourceBatchId: string | null;
  sourceType: StockSourceType | null;
  referenceId: string | null;
  note: string | null;
  createdAt: string;
  updatedAt: string;
}

/**
 * Format nomor batch tampilan: BT-YYYYMMDD-NNN.
 *
 * NNN adalah urutan per hari sesuai production_date.
 * Nomor batch ditentukan saat batch dibuat dan tidak berubah meskipun
 * production_date di-edit (evaluasi petugas input).
 */
export type BatchNumber = string;

/**
 * Input form untuk membuat/memperbarui batch produksi.
 */
export interface ProductionBatchFormValues {
  productionDate: string;
  notes: string;
}

/**
 * Input form untuk satu item produksi.
 */
export interface ProductionItemFormValues {
  productVariantId: string;
  quantity: string;
  note: string;
}

/**
 * Input form koleksi item produksi untuk satu batch.
 */
export interface ProductionItemsFormValues {
  items: ProductionItemFormValues[];
}

