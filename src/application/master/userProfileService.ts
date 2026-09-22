import type { UserRepository } from "@/data/repositories/userRepository";
import { DomainError, ValidationError } from "@/domain/errors";
import type { UserProfile, UserProfileFormValues } from "@/domain/master/types";
import { validateUserProfileForm } from "@/domain/master/validation";

import type { Clock, IdGenerator } from "../ports";

export interface UserProfileServiceDeps {
  repository: UserRepository;
  clock: Clock;
  ids: IdGenerator;
}

export interface UserProfileService {
  get(): Promise<UserProfile | null>;
  save(values: UserProfileFormValues): Promise<UserProfile>;
}

export function createUserProfileService({
  repository,
  clock,
  ids,
}: UserProfileServiceDeps): UserProfileService {
  return {
    get(): Promise<UserProfile | null> {
      return repository.getFirst();
    },

    async save(values: UserProfileFormValues): Promise<UserProfile> {
      const validated = validateUserProfileForm(values);

      if (!validated.ok) {
        throw new ValidationError(validated.errors);
      }

      const existing = await repository.getFirst();
      const now = clock.nowIso();

      if (existing === null) {
        await repository.insert({
          id: ids.newId(),
          // Role disiapkan untuk future multi-user; MVP tidak membatasi akses (D-01).
          role: "OWNER_ADMIN",
          ...validated.value,
          createdAt: now,
        });
      } else {
        await repository.update(existing.id, {
          ...validated.value,
          updatedAt: now,
        });
      }

      const saved = await repository.getFirst();

      if (saved === null) {
        throw new DomainError("User Profile gagal disimpan.");
      }

      return saved;
    },
  };
}
