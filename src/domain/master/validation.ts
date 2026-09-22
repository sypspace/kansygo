import type { FieldErrors } from "../errors";
import {
  collect,
  nonNegativeInteger,
  optionalEmail,
  optionalText,
  requiredText,
  type ValidationResult,
} from "../validation";

import type {
  AgentFormValues,
  AgentValidatedValues,
  BusinessProfileFormValues,
  BusinessProfileValidatedValues,
  ProductFormValues,
  ProductValidatedValues,
  UserProfileFormValues,
  UserProfileValidatedValues,
} from "./types";

const NAME_MAX = 120;
const TEXT_MAX = 240;
const INVOICE_PREFIX_PATTERN = /^[A-Z0-9-]{1,10}$/;

export function validateProductForm(
  values: ProductFormValues,
): ValidationResult<ProductValidatedValues> {
  const errors: FieldErrors = {};

  const name = requiredText(values.name, "name", "Nama produk", { maxLength: NAME_MAX });
  const price = nonNegativeInteger(values.sellingPrice, "sellingPrice", "Harga jual");
  const threshold = nonNegativeInteger(
    values.lowStockThreshold,
    "lowStockThreshold",
    "Batas low stock",
  );
  const description = optionalText(values.description, { maxLength: TEXT_MAX });

  Object.assign(errors, name.errors, price.errors, threshold.errors);

  return collect(errors, {
    name: name.value,
    sellingPrice: price.value,
    lowStockThreshold: threshold.value,
    description: description.value,
  });
}

export function validateAgentForm(
  values: AgentFormValues,
): ValidationResult<AgentValidatedValues> {
  const errors: FieldErrors = {};

  const name = requiredText(values.name, "name", "Nama agent", { maxLength: NAME_MAX });
  const fee = nonNegativeInteger(values.feePerUnit, "feePerUnit", "Fee per unit");

  Object.assign(errors, name.errors, fee.errors);

  return collect(errors, {
    name: name.value,
    feePerUnit: fee.value,
    contact: optionalText(values.contact, { maxLength: TEXT_MAX }).value,
    address: optionalText(values.address, { maxLength: TEXT_MAX }).value,
    location: optionalText(values.location, { maxLength: TEXT_MAX }).value,
  });
}

export function validateBusinessProfileForm(
  values: BusinessProfileFormValues,
): ValidationResult<BusinessProfileValidatedValues> {
  const errors: FieldErrors = {};

  const name = requiredText(values.name, "name", "Nama bisnis", { maxLength: NAME_MAX });
  Object.assign(errors, name.errors);

  const email = optionalEmail(values.email, "email", "Email");
  Object.assign(errors, email.errors);

  const prefix = values.invoicePrefix.trim().toUpperCase() || "INV";
  if (!INVOICE_PREFIX_PATTERN.test(prefix)) {
    errors.invoicePrefix =
      "Prefix invoice hanya boleh huruf, angka, atau tanda hubung (maksimal 10 karakter).";
  }

  return collect(errors, {
    name: name.value,
    invoicePrefix: prefix,
    legalName: optionalText(values.legalName, { maxLength: NAME_MAX }).value,
    taxId: optionalText(values.taxId, { maxLength: NAME_MAX }).value,
    address: optionalText(values.address, { maxLength: TEXT_MAX }).value,
    phone: optionalText(values.phone, { maxLength: NAME_MAX }).value,
    email: email.value,
    logoUri: optionalText(values.logoUri, { maxLength: TEXT_MAX }).value,
  });
}

export function validateUserProfileForm(
  values: UserProfileFormValues,
): ValidationResult<UserProfileValidatedValues> {
  const errors: FieldErrors = {};

  const name = requiredText(values.name, "name", "Nama pengguna", { maxLength: NAME_MAX });
  Object.assign(errors, name.errors);

  const email = optionalEmail(values.email, "email", "Email");
  Object.assign(errors, email.errors);

  return collect(errors, {
    name: name.value,
    email: email.value,
    profileInfo: optionalText(values.profileInfo, { maxLength: TEXT_MAX }).value,
  });
}
