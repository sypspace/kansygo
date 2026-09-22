import type { Agent } from "@/domain/master/types";

import type { SqlExecutor, SqlParam } from "../db/types";

interface AgentRow {
  id: string;
  name: string;
  contact: string | null;
  address: string | null;
  location: string | null;
  fee_per_unit: number;
  is_active: number;
  created_at: string;
  updated_at: string;
}

function toAgent(row: AgentRow): Agent {
  return {
    id: row.id,
    name: row.name,
    contact: row.contact,
    address: row.address,
    location: row.location,
    feePerUnit: row.fee_per_unit,
    isActive: row.is_active === 1,
    createdAt: row.created_at,
    updatedAt: row.updated_at,
  };
}

export interface NewAgentRecord {
  id: string;
  name: string;
  contact: string | null;
  address: string | null;
  location: string | null;
  feePerUnit: number;
  createdAt: string;
}

export interface AgentChanges {
  name: string;
  contact: string | null;
  address: string | null;
  location: string | null;
  feePerUnit: number;
  updatedAt: string;
}

export interface ListAgentsParams {
  includeInactive?: boolean;
  search?: string;
}

export interface AgentRepository {
  list(params?: ListAgentsParams): Promise<Agent[]>;
  findById(id: string): Promise<Agent | null>;
  insert(record: NewAgentRecord): Promise<void>;
  update(id: string, changes: AgentChanges): Promise<void>;
  setActive(id: string, isActive: boolean, updatedAt: string): Promise<void>;
}

const SELECT_COLUMNS = `
  id, name, contact, address, location, fee_per_unit, is_active, created_at, updated_at
`;

export function createAgentRepository(db: SqlExecutor): AgentRepository {
  return {
    async list(params = {}): Promise<Agent[]> {
      const conditions: string[] = [];
      const values: SqlParam[] = [];

      if (params.includeInactive !== true) {
        conditions.push("is_active = 1");
      }

      const search = params.search?.trim();
      if (search !== undefined && search.length > 0) {
        conditions.push("(name LIKE ? OR contact LIKE ?)");
        values.push(`%${search}%`, `%${search}%`);
      }

      const where = conditions.length > 0 ? `WHERE ${conditions.join(" AND ")}` : "";
      const rows = await db.getAllAsync<AgentRow>(
        `SELECT ${SELECT_COLUMNS} FROM agents ${where} ORDER BY name COLLATE NOCASE ASC`,
        values,
      );

      return rows.map(toAgent);
    },

    async findById(id: string): Promise<Agent | null> {
      const row = await db.getFirstAsync<AgentRow>(
        `SELECT ${SELECT_COLUMNS} FROM agents WHERE id = ?`,
        [id],
      );

      return row === null ? null : toAgent(row);
    },

    async insert(record: NewAgentRecord): Promise<void> {
      await db.runAsync(
        `INSERT INTO agents
           (id, name, contact, address, location, fee_per_unit, is_active, created_at, updated_at)
         VALUES (?, ?, ?, ?, ?, ?, 1, ?, ?)`,
        [
          record.id,
          record.name,
          record.contact,
          record.address,
          record.location,
          record.feePerUnit,
          record.createdAt,
          record.createdAt,
        ],
      );
    },

    async update(id: string, changes: AgentChanges): Promise<void> {
      await db.runAsync(
        `UPDATE agents
            SET name = ?, contact = ?, address = ?, location = ?, fee_per_unit = ?, updated_at = ?
          WHERE id = ?`,
        [
          changes.name,
          changes.contact,
          changes.address,
          changes.location,
          changes.feePerUnit,
          changes.updatedAt,
          id,
        ],
      );
    },

    async setActive(id: string, isActive: boolean, updatedAt: string): Promise<void> {
      await db.runAsync("UPDATE agents SET is_active = ?, updated_at = ? WHERE id = ?", [
        isActive ? 1 : 0,
        updatedAt,
        id,
      ]);
    },
  };
}
