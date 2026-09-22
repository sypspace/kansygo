import type { FieldErrors } from "./errors";

/**
 * Helper validasi murni (tanpa UI maupun database).
 *
 * Validasi di UI tidak cukup: aturan yang sama dipakai kembali oleh lapisan
 * application sebelum data disimpan (AGENTS.md §14).
 */

export type ValidationResult<T> =
  | { ok: true; value: T }
  | { ok: false; errors: FieldErrors };

export function ok<T>(value: T): ValidationResult<T> {
  return { ok: true, value };
}

export function fail<T>(field: string, message: string): ValidationResult<T> {
  return { ok: false, errors: { [field]: message } };
}

export function collect<T>(errors: FieldErrors, value: T): ValidationResult<T> {
  return Object.keys(errors).length > 0 ? { ok: false, errors } : ok(value);
}

export function hasErrors(errors: FieldErrors): boolean {
  return Object.keys(errors).length > 0;
}

/** Text wajib diisi. */
export function requiredText(
  raw: string,
  field: string,
  label: string,
  options: { maxLength?: number } = {},
): { errors: FieldErrors; value: string } {
  const value = raw.trim();
  const errors: FieldErrors = {};

  if (value.length === 0) {
    errors[field] = `${label} wajib diisi.`;
  } else if (options.maxLength !== undefined && value.length > options.maxLength) {
    errors[field] = `${label} maksimal ${options.maxLength} karakter.`;
  }

  return { errors, value };
}

/** Text opsional; string kosong dinormalisasi menjadi null. */
export function optionalText(raw: string, options: { maxLength?: number } = {}): {
  errors: FieldErrors;
  value: string | null;
} {
  const value = raw.trim();
  const errors: FieldErrors = {};

  if (options.maxLength !== undefined && value.length > options.maxLength) {
    return { errors: {}, value: value.slice(0, options.maxLength) };
  }

  return { errors, value: value.length === 0 ? null : value };
}

/**
 * Angka bulat non-negatif (quantity/rupiah).
 *
 * Titik dan spasi diperlakukan sebagai pemisah ribuan agar "3.000" tetap dapat
 * dimasukkan petugas; koma ditolak karena menandakan nilai desimal.
 */
export function nonNegativeInteger(
  raw: string,
  field: string,
  label: string,
): { errors: FieldErrors; value: number } {
  const cleaned = raw.trim().replace(/[.\s]/g, "");

  if (cleaned.length === 0) {
    return { errors: { [field]: `${label} wajib diisi.` }, value: 0 };
  }

  if (!/^\d+$/.test(cleaned)) {
    return {
      errors: { [field]: `${label} harus berupa angka bulat tanpa desimal.` },
      value: 0,
    };
  }

  const value = Number.parseInt(cleaned, 10);

  if (!Number.isSafeInteger(value)) {
    return { errors: { [field]: `${label} terlalu besar.` }, value: 0 };
  }

  return { errors: {}, value };
}

/**
 * Kuantitas produksi harus bilangan bulat positif (>0).
 *
 * Berbeda dengan nonNegativeInteger karena nol tidak diterima untuk item
 * yang akan disimpan ke stock movement.
 */
export function positiveInteger(
  raw: string,
  field: string,
  label: string,
): { errors: FieldErrors; value: number } {
  const cleaned = raw.trim().replace(/[.\s]/g, "");

  if (cleaned.length === 0) {
    return { errors: { [field]: `${label} wajib diisi.` }, value: 0 };
  }

  if (!/^\d+$/.test(cleaned)) {
    return {
      errors: { [field]: `${label} harus berupa angka bulat tanpa desimal.` },
      value: 0,
    };
  }

  const value = Number.parseInt(cleaned, 10);

  if (value <= 0) {
    return { errors: { [field]: `${label} harus lebih besar dari 0.` }, value };
  }

  if (!Number.isSafeInteger(value)) {
    return { errors: { [field]: `${label} terlalu besar.` }, value: 0 };
  }

  return { errors: {}, value };
}

/** Email opsional dengan format sederhana. */
export function optionalEmail(raw: string, field: string, label: string): {
  errors: FieldErrors;
  value: string | null;
} {
  const value = raw.trim();

  if (value.length === 0) {
    return { errors: {}, value: null };
  }

  if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value)) {
    return { errors: { [field]: `${label} tidak valid.` }, value: null };
  }

  return { errors: {}, value };
}

/** Tanggal ISO YYYY-MM-DD sederhana. */
export function isoDate(raw: string, field: string, label: string): {
  errors: FieldErrors;
  value: string;
} {
  const value = raw.trim();
  const errors: FieldErrors = {};

  if (value.length === 0) {
    errors[field] = `${label} wajib diisi.`;
    return { errors, value };
  }

  if (!/^\d{4}-\d{2}-\d{2}$/.test(value)) {
    errors[field] = `${label} harus dalam format YYYY-MM-DD.`;
    return { errors, value };
  }

  const [year, month, day] = value.split("-").map(Number);
  const date = new Date(year, month - 1, day);

  if (
    date.getFullYear() !== year ||
    date.getMonth() !== month - 1 ||
    date.getDate() !== day
  ) {
    errors[field] = `${label} tidak valid.`;
    return { errors, value };
  }

  return { errors, value };
}
