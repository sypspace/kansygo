import type { BusinessRepository } from "@/data/repositories/businessRepository";
import { ValidationError } from "@/domain/errors";
import type { Business, BusinessProfileFormValues } from "@/domain/master/types";
import { validateBusinessProfileForm } from "@/domain/master/validation";

import type { Clock } from "../ports";

export interface BusinessProfileServiceDeps {
  repository: BusinessRepository;
  clock: Clock;
}

export interface BusinessProfileService {
  get(): Promise<Business | null>;
  save(values: BusinessProfileFormValues): Promise<Business>;
}

export function createBusinessProfileService({
  repository,
  clock,
}: BusinessProfileServiceDeps): BusinessProfileService {
  return {
    get(): Promise<Business | null> {
      return repository.get();
    },

    async save(values: BusinessProfileFormValues): Promise<Business> {
      const validated = validateBusinessProfileForm(values);

      if (!validated.ok) {
        throw new ValidationError(validated.errors);
      }

      const existing = await repository.get();
      const now = clock.nowIso();

      return repository.save({
        ...validated.value,
        createdAt: existing?.createdAt ?? now,
        updatedAt: now,
      });
    },
  };
}
