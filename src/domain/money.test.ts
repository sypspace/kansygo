/** @jest-environment node */

import {
  formatRupiah,
  isFullyPaid,
  isRupiahAmount,
  toOutstanding,
  toPayable,
} from "./money";

describe("formatRupiah", () => {
  it("memformat integer rupiah dengan pemisah ribuan", () => {
    expect(formatRupiah(0)).toBe("Rp0");
    expect(formatRupiah(500)).toBe("Rp500");
    expect(formatRupiah(150000)).toBe("Rp150.000");
    expect(formatRupiah(1250000)).toBe("Rp1.250.000");
  });

  it("menolak nilai non-integer", () => {
    expect(() => formatRupiah(1500.5)).toThrow();
  });

  it("mendukung nilai negatif (outstanding negatif)", () => {
    expect(formatRupiah(-25000)).toBe("-Rp25.000");
  });

  it("isRupiahAmount hanya menerima integer", () => {
    expect(isRupiahAmount(3000)).toBe(true);
    expect(isRupiahAmount(3000.01)).toBe(false);
  });
});

describe("kewajiban Agent (BR-PY-011 / D-04b)", () => {
  it("diskon mengurangi tagihan", () => {
    expect(toPayable(56300, 300)).toBe(56000);
  });

  it("tanpa diskon tagihan sama dengan net settlement", () => {
    expect(toPayable(125000, 0)).toBe(125000);
  });

  it("outstanding berkurang sesuai pembayaran", () => {
    expect(toOutstanding(125000, 0)).toBe(125000);
    expect(toOutstanding(125000, 50000)).toBe(75000);
  });

  it("pembayaran kurang dari tagihan tetap outstanding (D-03)", () => {
    const outstanding = toOutstanding(toPayable(56300, 300), 50000);
    expect(outstanding).toBe(6000);
    expect(isFullyPaid(outstanding)).toBe(false);
  });

  it("pembayaran penuh menandai settlement lunas", () => {
    expect(isFullyPaid(toOutstanding(125000, 125000))).toBe(true);
  });

  it("kelebihan pembayaran menghasilkan outstanding negatif (D-04)", () => {
    const outstanding = toOutstanding(125000, 130000);
    expect(outstanding).toBe(-5000);
    expect(isFullyPaid(outstanding)).toBe(true);
  });
});
