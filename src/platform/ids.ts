import * as Crypto from "expo-crypto";

import type { IdGenerator } from "@/application/ports";

/**
 * ID internal berupa UUID v4 (D-09): stabil, tidak bergantung urutan record,
 * dan ramah untuk proses migrasi/sinkronisasi di masa depan (AC-FU-001).
 */
export const expoCryptoIdGenerator: IdGenerator = {
  newId(): string {
    return Crypto.randomUUID();
  },
};
