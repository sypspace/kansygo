/**
 * Domain constants terpusat (AGENTS.md §11).
 *
 * Jangan membuat penamaan alternatif untuk state bisnis yang sudah disetujui.
 */

/** Hasil penjualan harian Agent (BR-SC-001). */
export const SALES_RESULTS = ["HABIS", "TIDAK_HABIS"] as const;
export type SalesResult = (typeof SALES_RESULTS)[number];

/** Sumber pergerakan inventory (05-Data-Model.md §26). */
export const STOCK_MOVEMENT_TYPES = [
  "PRODUCTION",
  "DELIVERY",
  "RETURN",
  "SOLD",
  "WASTE",
  "ADJUSTMENT",
] as const;
export type StockMovementType = (typeof STOCK_MOVEMENT_TYPES)[number];

/** Lokasi inventory pada MVP (05-Data-Model.md §27). */
export const INVENTORY_LOCATIONS = ["OWNER", "AGENT"] as const;
export type InventoryLocation = (typeof INVENTORY_LOCATIONS)[number];

/** Jenis transaksi sumber stock movement (§29). */
export const STOCK_SOURCE_TYPES = [
  "PRODUCTION",
  "DELIVERY",
  "SALES_CONFIRMATION",
  "RECONCILIATION",
  "ADJUSTMENT",
  "CORRECTION",
] as const;
export type StockSourceType = (typeof STOCK_SOURCE_TYPES)[number];

/** Alasan stock adjustment (FR-IV-008). */
export const ADJUSTMENT_REASONS = [
  "DAMAGED_GOODS",
  "MELTED_UNUSABLE",
  "PRODUCTION_ERROR",
  "TESTER_SAMPLE",
  "LOSS",
  "STOCK_OPNAME_CORRECTION",
] as const;
export type AdjustmentReason = (typeof ADJUSTMENT_REASONS)[number];

/** Status Delivery Plan (D-10). */
export const DELIVERY_PLAN_STATUSES = ["ACTIVE", "COMPLETED"] as const;
export type DeliveryPlanStatus = (typeof DELIVERY_PLAN_STATUSES)[number];

/** Status Delivery (D-10). */
export const DELIVERY_STATUSES = ["CONFIRMED"] as const;
export type DeliveryStatus = (typeof DELIVERY_STATUSES)[number];

/** Metode pembayaran (D-05). */
export const PAYMENT_METHODS = ["CASH", "TRANSFER", "QRIS", "OTHER"] as const;
export type PaymentMethod = (typeof PAYMENT_METHODS)[number];

/** Jenis operational task; task dihitung dari transaksi, bukan disimpan (D-06). */
export const TASK_TYPES = [
  "DELIVERY",
  "RECONCILIATION",
  "PAYMENT_COLLECTION",
] as const;
export type TaskType = (typeof TASK_TYPES)[number];
