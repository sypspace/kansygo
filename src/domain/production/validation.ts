/**
 * Validasi untuk produksi (Fase 2).
 *
 * Aturan bisnis produksi:
 * - Satu varian hanya boleh satu entry per batch.
 * - Varian harus aktif saat produksi dibuat.
 * - Kuantitas item harus > 0 untuk yang disimpan.
 */

import type { FieldErrors } from "../errors";
import type {
  ProductionBatchFormValues,
  ProductionItemFormValues,
  ProductionItemsFormValues,
} from "../types";
import {
  collect,
  isoDate,
  positiveInteger,
  requiredText,
  type ValidationResult,
} from "../validation";
import type { ProductVariant } from "../master/types";

const NOTES_MAX = 240;
const ITEM_NOTE_MAX = 120;

export type ProductionBatchValidationResult = ReturnType<typeof validateProductionBatchForm>;
export type ProductionItemValidationResult = ReturnType<typeof validateProductionItemForm>;
export type ProductionItemsValidationResult = ReturnType<typeof validateProductionItemsForm>;

export function validateProductionBatchForm(
  values: ProductionBatchFormValues,
): ValidationResult<{ productionDate: string; notes: string }> {
  const errors: FieldErrors = {};

  const productionDate = isoDate(values.productionDate, "productionDate", "Tanggal produksi");
  const notes = requiredText(values.notes, "notes", "Keterangan", { maxLength: NOTES_MAX });

  // isoDate dan requiredText sudah mengisi errors masing-masing
  Object.assign(errors, productionDate.errors, notes.errors);

  return collect(errors, {
    productionDate: productionDate.value,
    notes: notes.value,
  });
}

export function validateProductionItemForm(
  values: ProductionItemFormValues,
  productVariants: ProductVariant[],
  existingItemVariantIdsInBatch: string[],
): { ok: true } | { ok: false; errors: FieldErrors } {
  const errors: FieldErrors = {};

  // Variabel ID wajib diisi dan merujuk ke varian yang ada.
  if (values.productVariantId.length === 0) {
    errors.productVariantId = " Produk wajib dipilih.";
  }

  const selectedVariant = productVariants.find(
    (variant) => variant.id === values.productVariantId,
  );

  if (selectedVariant === undefined) {
    errors.productVariantId = " Produk tidak ditemukan.";
  } else if (!selectedVariant.isActive) {
    errors.productVariantId = " Produk tidak aktif.";
  }

  // Variabel tidak boleh duplikat dalam batch.
  if (existingItemVariantIdsInBatch.includes(values.productVariantId)) {
    errors.productVariantId = " Produk sudah ada dalam batch ini.";
  }

  // Kuantitas harus >0
  const quantity = positiveInteger(values.quantity, "quantity", "Jumlah");
  Object.assign(errors, quantity.errors);

  const note = requiredText(values.note, "note", "Keterangan item", {
    maxLength: ITEM_NOTE_MAX,
  });
  Object.assign(errors, note.errors);

  return collect(errors, {
    productVariantId: values.productVariantId,
    quantity: quantity.value,
    note: note.value,
  }).ok
    ? { ok: true }
    : { ok: false, errors };
}

export function validateProductionItemsForm(
  values: ProductionItemsFormValues,
  productVariants: ProductVariant[],
): { ok: true } | { ok: false; errors: FieldErrors } {
  const errors: FieldErrors = {};
  const variantIdsInBatch: string[] = [];

  for (let i = 0; i < values.items.length; i++) {
    const item = values.items[i];
    const itemErrors: FieldErrors = {};
    const itemIndex = i;

    // Validasi item tunggal dengan context batch
    const productVariantId = item.productVariantId.trim();
    if (productVariantId.length === 0) {
      itemErrors[`items.${itemIndex}.productVariantId`] = " Produk wajib dipilih.";
    } else {
      const selectedVariant = productVariants.find((variant) => variant.id === productVariantId);
      if (selectedVariant === undefined) {
        itemErrors[`items.${itemIndex}.productVariantId`] = " Produk tidak ditemukan.";
      } else if (!selectedVariant.isActive) {
        itemErrors[`items.${itemIndex}.productVariantId`] = " Produk tidak aktif.";
      } else if (variantIdsInBatch.includes(productVariantId)) {
        itemErrors[`items.${itemIndex}.productVariantId`] = " Produk sudah ada dalam batch ini.";
      } else {
        variantIdsInBatch.push(productVariantId);
      }
    }

    const quantity = positiveInteger(item.quantity, `items.${itemIndex}.quantity`, `Jumlah item ${itemIndex + 1}`);
    Object.assign(itemErrors, quantity.errors);

    const note = requiredText(item.note, `items.${itemIndex}.note`, `Keterangan item ${itemIndex + 1}`, {
      maxLength: ITEM_NOTE_MAX,
    });
    Object.assign(itemErrors, note.errors);

    Object.assign(errors, itemErrors);
  }

  return Object.keys(errors).length > 0 ? { ok: false, errors } : { ok: true };
}
