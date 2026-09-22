/**
 * Tipe master data (05-Data-Model.md §4-§7).
 *
 * Nama field mengikuti domain (camelCase); pemetaan dari kolom database
 * dilakukan di lapisan data agar skema SQLite tidak bocor ke domain.
 */

export interface Business {
  id: number;
  name: string;
  legalName: string | null;
  taxId: string | null;
  address: string | null;
  phone: string | null;
  email: string | null;
  logoUri: string | null;
  invoicePrefix: string;
  createdAt: string;
  updatedAt: string;
}

/**
 * Role disiapkan untuk future multi-user dan TIDAK dipakai membatasi akses
 * pada MVP (D-01, 00-Baseline §7).
 */
export const USER_ROLES = ["OWNER_ADMIN", "PRODUCTION", "DELIVERY"] as const;
export type UserRole = (typeof USER_ROLES)[number];

export interface UserProfile {
  id: string;
  name: string;
  email: string | null;
  role: UserRole;
  profileInfo: string | null;
  createdAt: string;
  updatedAt: string;
}

/** Sellable item pada MVP: Product Variant (§6). */
export interface ProductVariant {
  id: string;
  name: string;
  sellingPrice: number;
  description: string | null;
  lowStockThreshold: number;
  isActive: boolean;
  createdAt: string;
  updatedAt: string;
}

export interface Agent {
  id: string;
  name: string;
  contact: string | null;
  address: string | null;
  location: string | null;
  feePerUnit: number;
  isActive: boolean;
  createdAt: string;
  updatedAt: string;
}

/* ------------------------------------------------------------------ */
/* Input form (raw dari UI) dan hasil validasinya                      */
/* ------------------------------------------------------------------ */

export interface ProductFormValues {
  name: string;
  sellingPrice: string;
  description: string;
  lowStockThreshold: string;
}

export interface ProductValidatedValues {
  name: string;
  sellingPrice: number;
  description: string | null;
  lowStockThreshold: number;
}

export interface AgentFormValues {
  name: string;
  contact: string;
  address: string;
  location: string;
  feePerUnit: string;
}

export interface AgentValidatedValues {
  name: string;
  contact: string | null;
  address: string | null;
  location: string | null;
  feePerUnit: number;
}

export interface BusinessProfileFormValues {
  name: string;
  legalName: string;
  taxId: string;
  address: string;
  phone: string;
  email: string;
  logoUri: string;
  invoicePrefix: string;
}

export interface BusinessProfileValidatedValues {
  name: string;
  legalName: string | null;
  taxId: string | null;
  address: string | null;
  phone: string | null;
  email: string | null;
  logoUri: string | null;
  invoicePrefix: string;
}

export interface UserProfileFormValues {
  name: string;
  email: string;
  profileInfo: string;
}

export interface UserProfileValidatedValues {
  name: string;
  email: string | null;
  profileInfo: string | null;
}

export const EMPTY_PRODUCT_FORM: ProductFormValues = {
  name: "",
  sellingPrice: "",
  description: "",
  lowStockThreshold: "0",
};

export const EMPTY_AGENT_FORM: AgentFormValues = {
  name: "",
  contact: "",
  address: "",
  location: "",
  feePerUnit: "0",
};

export const EMPTY_BUSINESS_FORM: BusinessProfileFormValues = {
  name: "",
  legalName: "",
  taxId: "",
  address: "",
  phone: "",
  email: "",
  logoUri: "",
  invoicePrefix: "INV",
};

export const EMPTY_USER_FORM: UserProfileFormValues = {
  name: "",
  email: "",
  profileInfo: "",
};
