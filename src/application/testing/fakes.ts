import type { Clock, IdGenerator } from "@/application/ports";

/**
 * Implementasi deterministik untuk pengujian (AGENTS.md §34):
 * waktu dan ID harus dapat diprediksi, tidak bergantung waktu sistem.
 */

export const FIXED_TIMESTAMP = "2026-09-20T01:00:00.000Z";
export const FIXED_DATE = "2026-09-20";

export function createFixedClock(
  timestamp: string = FIXED_TIMESTAMP,
  date: string = FIXED_DATE,
): Clock {
  return {
    nowIso: () => timestamp,
    todayIso: () => date,
  };
}

export function createSequentialIdGenerator(prefix = "test"): IdGenerator {
  let counter = 0;

  return {
    newId: () => {
      counter += 1;
      return `${prefix}-${String(counter).padStart(4, "0")}`;
    },
  };
}
