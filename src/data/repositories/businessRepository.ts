import { DomainError } from "@/domain/errors";
import type { Business } from "@/domain/master/types";

import type { SqlExecutor } from "../db/types";

interface BusinessRow {
  id: number;
  name: string;
  legal_name: string | null;
  tax_id: string | null;
  address: string | null;
  phone: string | null;
  email: string | null;
  logo_uri: string | null;
  invoice_prefix: string;
  created_at: string;
  updated_at: string;
}

function toBusiness(row: BusinessRow): Business {
  return {
    id: row.id,
    name: row.name,
    legalName: row.legal_name,
    taxId: row.tax_id,
    address: row.address,
    phone: row.phone,
    email: row.email,
    logoUri: row.logo_uri,
    invoicePrefix: row.invoice_prefix,
    createdAt: row.created_at,
    updatedAt: row.updated_at,
  };
}

export interface BusinessRecord {
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

export interface BusinessRepository {
  /** Business Profile tunggal per device (BR-BP-001). */
  get(): Promise<Business | null>;
  save(record: BusinessRecord): Promise<Business>;
}

const SELECT_COLUMNS = `
  id, name, legal_name, tax_id, address, phone, email, logo_uri, invoice_prefix, created_at, updated_at
`;

export function createBusinessRepository(db: SqlExecutor): BusinessRepository {
  async function get(): Promise<Business | null> {
    const row = await db.getFirstAsync<BusinessRow>(
      `SELECT ${SELECT_COLUMNS} FROM business WHERE id = 1`,
    );

    return row === null ? null : toBusiness(row);
  }

  return {
    get,

    async save(record: BusinessRecord): Promise<Business> {
      await db.runAsync(
        `INSERT INTO business
           (id, name, legal_name, tax_id, address, phone, email, logo_uri, invoice_prefix,
            created_at, updated_at)
         VALUES (1, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
         ON CONFLICT(id) DO UPDATE SET
           name = excluded.name,
           legal_name = excluded.legal_name,
           tax_id = excluded.tax_id,
           address = excluded.address,
           phone = excluded.phone,
           email = excluded.email,
           logo_uri = excluded.logo_uri,
           invoice_prefix = excluded.invoice_prefix,
           updated_at = excluded.updated_at`,
        [
          record.name,
          record.legalName,
          record.taxId,
          record.address,
          record.phone,
          record.email,
          record.logoUri,
          record.invoicePrefix,
          record.createdAt,
          record.updatedAt,
        ],
      );

      const saved = await get();

      if (saved === null) {
        throw new DomainError("Business Profile gagal disimpan.");
      }

      return saved;
    },
  };
}
