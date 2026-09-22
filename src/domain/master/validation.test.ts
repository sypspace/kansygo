/** @jest-environment node */

import {
  EMPTY_AGENT_FORM,
  EMPTY_BUSINESS_FORM,
  EMPTY_PRODUCT_FORM,
  EMPTY_USER_FORM,
} from "./types";
import {
  validateAgentForm,
  validateBusinessProfileForm,
  validateProductForm,
  validateUserProfileForm,
} from "./validation";

describe("validateProductForm (AC-PR-001, AC-PR-002, FR-PR-002)", () => {
  it("menerima input valid dan mengubah rupiah menjadi integer", () => {
    const result = validateProductForm({
      ...EMPTY_PRODUCT_FORM,
      name: "  Coklat ",
      sellingPrice: "3.000",
      lowStockThreshold: "5",
    });

    expect(result.ok).toBe(true);

    if (result.ok) {
      expect(result.value.name).toBe("Coklat");
      expect(result.value.sellingPrice).toBe(3000);
      expect(result.value.lowStockThreshold).toBe(5);
      expect(result.value.description).toBeNull();
    }
  });

  it("menolak nama kosong", () => {
    const result = validateProductForm({ ...EMPTY_PRODUCT_FORM, name: "   ", sellingPrice: "3000" });

    expect(result.ok).toBe(false);

    if (!result.ok) {
      expect(result.errors.name).toContain("wajib diisi");
    }
  });

  it("menolak harga jual desimal", () => {
    const result = validateProductForm({
      ...EMPTY_PRODUCT_FORM,
      name: "Coklat",
      sellingPrice: "3000,5",
    });

    expect(result.ok).toBe(false);

    if (!result.ok) {
      expect(result.errors.sellingPrice).toContain("angka bulat");
    }
  });

  it("menolak batas low stock negatif (AC-ERR-001)", () => {
    const result = validateProductForm({
      ...EMPTY_PRODUCT_FORM,
      name: "Coklat",
      sellingPrice: "3000",
      lowStockThreshold: "-5",
    });

    expect(result.ok).toBe(false);

    if (!result.ok) {
      expect(result.errors.lowStockThreshold).toContain("angka bulat");
    }
  });
});

describe("validateAgentForm (FR-AG-002, FR-AG-006)", () => {
  it("menerima agent dengan fee per unit integer", () => {
    const result = validateAgentForm({
      ...EMPTY_AGENT_FORM,
      name: "Toko Bu Sari",
      contact: "08123",
      feePerUnit: "500",
    });

    expect(result.ok).toBe(true);

    if (result.ok) {
      expect(result.value.feePerUnit).toBe(500);
      expect(result.value.contact).toBe("08123");
      expect(result.value.address).toBeNull();
    }
  });

  it("menolak fee per unit yang bukan angka", () => {
    const result = validateAgentForm({ ...EMPTY_AGENT_FORM, name: "Agent A", feePerUnit: "abc" });

    expect(result.ok).toBe(false);

    if (!result.ok) {
      expect(result.errors.feePerUnit).toBeDefined();
    }
  });
});

describe("validateBusinessProfileForm (FR-BP-001, D-15)", () => {
  it("menormalkan prefix invoice menjadi huruf besar", () => {
    const result = validateBusinessProfileForm({
      ...EMPTY_BUSINESS_FORM,
      name: "Kansy Frozen",
      invoicePrefix: "kgo",
    });

    expect(result.ok).toBe(true);

    if (result.ok) {
      expect(result.value.invoicePrefix).toBe("KGO");
    }
  });

  it("memakai prefix default INV bila dikosongkan", () => {
    const result = validateBusinessProfileForm({
      ...EMPTY_BUSINESS_FORM,
      name: "Kansy Frozen",
      invoicePrefix: "",
    });

    expect(result.ok).toBe(true);

    if (result.ok) {
      expect(result.value.invoicePrefix).toBe("INV");
    }
  });

  it("menolak prefix invoice dengan karakter tidak sah", () => {
    const result = validateBusinessProfileForm({
      ...EMPTY_BUSINESS_FORM,
      name: "Kansy Frozen",
      invoicePrefix: "INV 2026",
    });

    expect(result.ok).toBe(false);

    if (!result.ok) {
      expect(result.errors.invoicePrefix).toBeDefined();
    }
  });

  it("menolak email yang tidak valid", () => {
    const result = validateBusinessProfileForm({
      ...EMPTY_BUSINESS_FORM,
      name: "Kansy Frozen",
      email: "bukan-email",
    });

    expect(result.ok).toBe(false);
  });
});

describe("validateUserProfileForm (FR-US-001)", () => {
  it("menerima nama tanpa email", () => {
    const result = validateUserProfileForm({ ...EMPTY_USER_FORM, name: "Admin" });

    expect(result.ok).toBe(true);

    if (result.ok) {
      expect(result.value.email).toBeNull();
    }
  });

  it("menolak nama kosong", () => {
    const result = validateUserProfileForm({ ...EMPTY_USER_FORM, name: "" });

    expect(result.ok).toBe(false);
  });
});
