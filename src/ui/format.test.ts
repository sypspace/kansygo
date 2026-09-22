/** @jest-environment node */

import { formatDate, formatDateTime } from "./format";

describe("formatDate", () => {
  it("memformat tanggal ISO menjadi format Indonesia", () => {
    expect(formatDate("2026-09-20")).toBe("20 Sep 2026");
    expect(formatDate("2026-01-01")).toBe("1 Jan 2026");
    expect(formatDate("2026-12-31")).toBe("31 Des 2026");
  });

  it("mengembalikan input tak dikenal apa adanya", () => {
    expect(formatDate("bukan tanggal")).toBe("bukan tanggal");
    expect(formatDate("2026-13-01")).toBe("2026-13-01");
  });
});

describe("formatDateTime", () => {
  it("memformat timestamp menjadi tanggal dan jam", () => {
    expect(formatDateTime("2026-09-20T01:00:00.000Z")).toMatch(
      /^\d{1,2} Sep 2026 \d{2}:\d{2}$/,
    );
  });

  it("mengembalikan input tak dikenal apa adanya", () => {
    expect(formatDateTime("tidak-valid")).toBe("tidak-valid");
  });
});
