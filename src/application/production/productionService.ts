import type { ProductVariantRepository } from "../../data/repositories/productVariantRepository";
import type { ProductionBatchRepository } from "../../data/repositories/productionBatchRepository";
import type { ProductionItemRepository } from "../../data/repositories/productionItemRepository";
import type { StockMovementRepository } from "../../data/repositories/stockMovementRepository";
import { BusinessRuleError, NotFoundError, ValidationError } from "../../domain/errors";
import type { ProductVariant } from "../../domain/master/types";
import type {
  ProductionBatch,
  ProductionBatchFormValues,
  ProductionBatchStatus,
  ProductionItem,
  ProductionItemFormValues,
  ProductionItemsFormValues,
} from "../../domain/types";
import { validateProductionBatchForm, validateProductionItemsForm, validateProductionItemForm } from "../../domain/production/validation";
import { generateBatchNumber } from "../../data/db/schema/v2";
import type { Clock, IdGenerator } from "../ports";

export interface ProductionServiceDeps {
  batchRepository: ProductionBatchRepository;
  itemRepository: ProductionItemRepository;
  stockMovementRepository: StockMovementRepository;
  productVariantRepository: ProductVariantRepository;
  clock: Clock;
  ids: IdGenerator;
}

export interface ProductionService {
  listBatches(params?: ListBatchesParams): Promise<ProductionBatch[]>;
  getBatchById(id: string): Promise<ProductionBatch | null>;
  createBatch(values: ProductionBatchFormValues): Promise<ProductionBatch>;
  updateBatch(id: string, values: ProductionBatchFormValues): Promise<ProductionBatch>;
  deleteBatch(id: string): Promise<void>;
  addItem(batchId: string, values: ProductionItemFormValues, productVariants: ProductVariant[]): Promise<ProductionItem>;
  removeItem(batchId: string, itemId: string): Promise<void>;
  saveToStock(batchId: string, items: ProductionItemsFormValues): Promise<{ batch: ProductionBatch; movements: ProductionItem[] }>;
}

export interface ListBatchesParams {
  status?: ProductionBatchStatus;
  productionDate?: string;
  search?: string;
}

export function createProductionService({ batchRepository, itemRepository, stockMovementRepository, productVariantRepository, clock, ids }: ProductionServiceDeps): ProductionService {
  async function requireBatch(id: string): Promise<ProductionBatch> {
    const batch = await batchRepository.findById(id);
    if (batch === null) throw new NotFoundError("Batch produksi tidak ditemukan.");
    return batch;
  }

  async function listAllProductVariants(): Promise<ProductVariant[]> {
    return productVariantRepository.list({ includeInactive: true });
  }

  async function getItemVariantIdsInBatch(batchId: string): Promise<string[]> {
    const items = await itemRepository.list({ productionBatchId: batchId });
    return items.map((item) => item.productVariantId);
  }

  return {
    listBatches(params?: ListBatchesParams): Promise<ProductionBatch[]> {
      return batchRepository.list(params);
    },
    getBatchById(id: string): Promise<ProductionBatch | null> {
      return batchRepository.findById(id);
    },
    async createBatch(values: ProductionBatchFormValues): Promise<ProductionBatch> {
      const batchValidation = validateProductionBatchForm(values);
      if (!batchValidation.ok) throw new ValidationError(batchValidation.errors);
      const productionDate = batchValidation.value.productionDate;
      const sequence = await batchRepository.countByProductionDate(productionDate) + 1;
      const batchNumber = generateBatchNumber(productionDate, sequence);
      const now = clock.nowIso();
      const id = ids.newId();
      await batchRepository.insert({ id, batchNumber, productionDate, status: "DRAFT" as ProductionBatchStatus, notes: batchValidation.value.notes, createdAt: now });
      const created = await batchRepository.findById(id);
      if (created === null) throw new BusinessRuleError("Gagal membuat batch produksi.");
      return created;
    },
  }
}