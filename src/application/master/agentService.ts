import type { AgentRepository } from "@/data/repositories/agentRepository";
import { DomainError, NotFoundError, ValidationError } from "@/domain/errors";
import type { Agent, AgentFormValues } from "@/domain/master/types";
import { validateAgentForm } from "@/domain/master/validation";

import type { Clock, IdGenerator } from "../ports";

export interface AgentServiceDeps {
  repository: AgentRepository;
  clock: Clock;
  ids: IdGenerator;
}

export interface ListAgentsParams {
  includeInactive?: boolean;
  search?: string;
}

export interface AgentService {
  list(params?: ListAgentsParams): Promise<Agent[]>;
  getById(id: string): Promise<Agent | null>;
  create(values: AgentFormValues): Promise<Agent>;
  update(id: string, values: AgentFormValues): Promise<Agent>;
  setActive(id: string, isActive: boolean): Promise<void>;
  /** Peringatan informatif sebelum menonaktifkan agent (D-13). */
  getDeactivationWarnings(id: string): Promise<string[]>;
}

export function createAgentService({ repository, clock, ids }: AgentServiceDeps): AgentService {
  async function requireById(id: string): Promise<Agent> {
    const agent = await repository.findById(id);

    if (agent === null) {
      throw new NotFoundError("Agent tidak ditemukan.");
    }

    return agent;
  }

  return {
    list(params?: ListAgentsParams): Promise<Agent[]> {
      return repository.list(params);
    },

    getById(id: string): Promise<Agent | null> {
      return repository.findById(id);
    },

    async create(values: AgentFormValues): Promise<Agent> {
      const validated = validateAgentForm(values);

      if (!validated.ok) {
        throw new ValidationError(validated.errors);
      }

      const id = ids.newId();

      await repository.insert({
        id,
        ...validated.value,
        createdAt: clock.nowIso(),
      });

      const created = await repository.findById(id);

      if (created === null) {
        throw new DomainError("Agent gagal disimpan.");
      }

      return created;
    },

    async update(id: string, values: AgentFormValues): Promise<Agent> {
      await requireById(id);

      const validated = validateAgentForm(values);

      if (!validated.ok) {
        throw new ValidationError(validated.errors);
      }

      await repository.update(id, {
        ...validated.value,
        updatedAt: clock.nowIso(),
      });

      return requireById(id);
    },

    async setActive(id: string, isActive: boolean): Promise<void> {
      await requireById(id);
      await repository.setActive(id, isActive, clock.nowIso());
    },

    /**
     * Fase 1 belum memiliki inventory/settlement, sehingga peringatan stok dan
     * outstanding agent akan diisi pada Fase 2 dan Fase 6.
     */
    async getDeactivationWarnings(): Promise<string[]> {
      return [];
    },
  };
}
