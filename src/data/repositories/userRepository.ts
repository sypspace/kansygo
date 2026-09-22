import type { UserProfile, UserRole } from "@/domain/master/types";

import type { SqlExecutor } from "../db/types";

interface UserRow {
  id: string;
  name: string;
  email: string | null;
  role: string;
  profile_info: string | null;
  created_at: string;
  updated_at: string;
}

function toUserProfile(row: UserRow): UserProfile {
  return {
    id: row.id,
    name: row.name,
    email: row.email,
    role: row.role as UserRole,
    profileInfo: row.profile_info,
    createdAt: row.created_at,
    updatedAt: row.updated_at,
  };
}

export interface NewUserRecord {
  id: string;
  name: string;
  email: string | null;
  role: UserRole;
  profileInfo: string | null;
  createdAt: string;
}

export interface UserChanges {
  name: string;
  email: string | null;
  profileInfo: string | null;
  updatedAt: string;
}

export interface UserRepository {
  /** MVP hanya memiliki satu operational user (BR-US-001). */
  getFirst(): Promise<UserProfile | null>;
  insert(record: NewUserRecord): Promise<void>;
  update(id: string, changes: UserChanges): Promise<void>;
}

const SELECT_COLUMNS = "id, name, email, role, profile_info, created_at, updated_at";

export function createUserRepository(db: SqlExecutor): UserRepository {
  return {
    async getFirst(): Promise<UserProfile | null> {
      const row = await db.getFirstAsync<UserRow>(
        `SELECT ${SELECT_COLUMNS} FROM users ORDER BY created_at ASC LIMIT 1`,
      );

      return row === null ? null : toUserProfile(row);
    },

    async insert(record: NewUserRecord): Promise<void> {
      await db.runAsync(
        `INSERT INTO users (id, name, email, role, profile_info, created_at, updated_at)
         VALUES (?, ?, ?, ?, ?, ?, ?)`,
        [
          record.id,
          record.name,
          record.email,
          record.role,
          record.profileInfo,
          record.createdAt,
          record.createdAt,
        ],
      );
    },

    async update(id: string, changes: UserChanges): Promise<void> {
      await db.runAsync(
        "UPDATE users SET name = ?, email = ?, profile_info = ?, updated_at = ? WHERE id = ?",
        [changes.name, changes.email, changes.profileInfo, changes.updatedAt, id],
      );
    },
  };
}
