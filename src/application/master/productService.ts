import type { ProductVariantRepository } from "@/data/repositories/productVariantRepository";
import { DomainError, NotFoundError, ValidationError } from "@/domain/errors";
import type { ProductFormValues, ProductVariant } from "@/domain/master/types";
import { validateProductForm } from "@/domain/master/validation";

import type { Clock, IdGenerator } from "../ports";

export interface ProductServiceDeps {
  repository: ProductVariantRepository;
  clock: Clock;
  ids: IdGenerator;
}

export interface ListProductsParams {
  includeInactive?: boolean;
  search?: string;
}

export interface ProductService {
  list(params?: ListProductsParams): Promise<ProductVariant[]>;
  getById(id: string): Promise<ProductVariant | null>;
  create(values: ProductFormValues): Promise<ProductVariant>;
  update(id: string, values: ProductFormValues): Promise<ProductVariant>;
  setActive(id: string, isActive: boolean): Promise<void>;
  /**
   * Peringatan informatif sebelum menonaktifkan produk (D-13).
   * Fase 1 belum memiliki inventory, sehingga daftar masih kosong; peringatan
   * stok akan diisi pada Fase 2.
   */
  getDeactivationWarnings(id: string): Promise<string[]>;
}

export function createProductService({
  repository,
  clock,
  ids,
}: ProductServiceDeps): ProductService {
  async function requireById(id: string): Promise<ProductVariant> {
    const product = await repository.findById(id);

    if (product === null) {
      throw new NotFoundError("Produk tidak ditemukan.");
    }

    return product;
  }

  return {
    list(params?: ListProductsParams): Promise<ProductVariant[]> {
      return repository.list(params);
    },

    getById(id: string): Promise<ProductVariant | null> {
      return repository.findById(id);
    },

    async create(values: ProductFormValues): Promise<ProductVariant> {
      const validated = validateProductForm(values);

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
        throw new DomainError("Produk gagal disimpan.");
      }

      return created;
    },

    async update(id: string, values: ProductFormValues): Promise<ProductVariant> {
      await requireById(id);

      const validated = validateProductForm(values);

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

    async getDeactivationWarnings(): Promise<string[]> {
      return [];
    },
  };
}
