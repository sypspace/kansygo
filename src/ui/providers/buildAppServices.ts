import {
  createAgentService,
  type AgentService,
} from "@/application/master/agentService";
import {
  createBusinessProfileService,
  type BusinessProfileService,
} from "@/application/master/businessProfileService";
import {
  createProductService,
  type ProductService,
} from "@/application/master/productService";
import {
  createUserProfileService,
  type UserProfileService,
} from "@/application/master/userProfileService";
import type { Clock, IdGenerator } from "@/application/ports";
import type { SqlExecutor } from "@/data/db/types";
import { createAgentRepository } from "@/data/repositories/agentRepository";
import { createBusinessRepository } from "@/data/repositories/businessRepository";
import { createProductVariantRepository } from "@/data/repositories/productVariantRepository";
import { createUserRepository } from "@/data/repositories/userRepository";

/** Use case yang tersedia untuk UI. */
export interface AppServices {
  products: ProductService;
  agents: AgentService;
  businessProfile: BusinessProfileService;
  userProfile: UserProfileService;
}

export interface BuildAppServicesDeps {
  db: SqlExecutor;
  clock: Clock;
  ids: IdGenerator;
}

/**
 * Composition root untuk lapisan application.
 *
 * UI hanya memanggil use case di sini; UI tidak pernah menulis SQL langsung
 * (AGENTS.md §7, §15).
 */
export function buildAppServices({ db, clock, ids }: BuildAppServicesDeps): AppServices {
  return {
    products: createProductService({
      repository: createProductVariantRepository(db),
      clock,
      ids,
    }),
    agents: createAgentService({
      repository: createAgentRepository(db),
      clock,
      ids,
    }),
    businessProfile: createBusinessProfileService({
      repository: createBusinessRepository(db),
      clock,
    }),
    userProfile: createUserProfileService({
      repository: createUserRepository(db),
      clock,
      ids,
    }),
  };
}
