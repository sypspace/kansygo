/**
 * Representasi uang: integer rupiah (AGENTS.md §24).
 *
 * Semua perhitungan finansial harus memakai fungsi di modul ini agar rumus
 * hanya memiliki satu implementasi (AGENTS.md §23).
 */

export function isRupiahAmount(value: number): boolean {
  return Number.isInteger(value);
}

/** Format untuk presentasi saja. Nilai tersimpan tetap integer. */
export function formatRupiah(amount: number): string {
  if (!isRupiahAmount(amount)) {
    throw new Error("Nilai uang harus berupa integer rupiah.");
  }

  const sign = amount < 0 ? "-" : "";
  const grouped = Math.abs(amount)
    .toString()
    .replace(/\B(?=(\d{3})+(?!\d))/g, ".");

  return `${sign}Rp${grouped}`;
}

/**
 * Tagihan yang harus dibayar Agent.
 * Diskon diisi manual oleh petugas (D-04b).
 */
export function toPayable(netAmount: number, discountAmount: number): number {
  return netAmount - discountAmount;
}

/** Sisa kewajiban; nilai negatif berarti kelebihan pembayaran (kredit Agent, D-04). */
export function toOutstanding(payable: number, totalPaid: number): number {
  return payable - totalPaid;
}

export function isFullyPaid(outstanding: number): boolean {
  return outstanding <= 0;
}
