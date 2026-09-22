/**
 * Error domain.
 *
 * Pesan harus dapat dipahami pengguna dan tidak boleh membocorkan detail
 * teknis seperti stack trace atau error SQL (AGENTS.md §31).
 */

export type FieldErrors = Record<string, string>;

export class DomainError extends Error {
  readonly code: string;

  constructor(message: string, code = "DOMAIN_ERROR") {
    super(message);
    this.name = "DomainError";
    this.code = code;
  }
}

/** Validasi gagal; membawa pesan per field agar dapat ditampilkan di form. */
export class ValidationError extends DomainError {
  readonly errors: FieldErrors;

  constructor(errors: FieldErrors, message = "Data yang dimasukkan belum valid.") {
    super(message, "VALIDATION_ERROR");
    this.name = "ValidationError";
    this.errors = errors;
  }
}

/** Data yang diminta tidak ditemukan. */
export class NotFoundError extends DomainError {
  constructor(message = "Data tidak ditemukan.") {
    super(message, "NOT_FOUND");
    this.name = "NotFoundError";
  }
}

/** Operasi bisnis tidak diizinkan pada kondisi saat ini. */
export class BusinessRuleError extends DomainError {
  constructor(message: string, code = "BUSINESS_RULE_ERROR") {
    super(message, code);
    this.name = "BusinessRuleError";
  }
}

/** Mengubah error tak terduga menjadi pesan yang aman untuk ditampilkan. */
export function toUserMessage(error: unknown): string {
  if (error instanceof ValidationError || error instanceof DomainError) {
    return error.message;
  }

  return "Terjadi kesalahan. Data belum tersimpan, silakan coba lagi.";
}
