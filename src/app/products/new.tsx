import { useRouter } from "expo-router";
import {
  EMPTY_PRODUCT_FORM,
  type ProductFormValues,
} from "@/domain/master/types";
import { validateProductForm } from "@/domain/master/validation";
import { AppButton } from "@/ui/components/AppButton";
import { Screen } from "@/ui/components/Screen";
import { TextField } from "@/ui/components/TextField";
import { useEntityForm } from "@/ui/hooks/useEntityForm";
import { useAppServices } from "@/ui/providers/AppProvider";
import { colors, typography } from "@/ui/theme";
import { StyleSheet, Text } from "react-native";

/**
 * FR-PR-002 — menambahkan Product/Variant baru.
 *
 * Validasi dijalankan di UI untuk umpan balik cepat, dan aturan yang sama tetap
 * diverifikasi ulang oleh lapisan application sebelum data disimpan
 * (AGENTS.md §14).
 */
export default function NewProductScreen() {
  const router = useRouter();
  const { products } = useAppServices();
  const form = useEntityForm<ProductFormValues>(EMPTY_PRODUCT_FORM);

  async function handleSave() {
    const created = await form.save({
      validate: (values) => validateProductForm(values),
      run: async (values) => {
        const product = await products.create(values);
        router.replace(`/products/${product.id}`);
      },
    });

    return created;
  }

  return (
    <Screen>
      <TextField
        label="Nama produk"
        value={form.values.name}
        onChangeText={(text) => form.setField("name", text)}
        error={form.errors.name}
        placeholder="Contoh: Coklat"
        testID="product-name"
      />
      <TextField
        label="Harga jual (Rp)"
        value={form.values.sellingPrice}
        onChangeText={(text) => form.setField("sellingPrice", text)}
        error={form.errors.sellingPrice}
        keyboardType="number-pad"
        placeholder="3000"
        testID="product-price"
      />
      <TextField
        label="Batas low stock"
        value={form.values.lowStockThreshold}
        onChangeText={(text) => form.setField("lowStockThreshold", text)}
        error={form.errors.lowStockThreshold}
        keyboardType="number-pad"
        hint="Stok dianggap low stock bila jumlahnya ≤ batas ini."
        testID="product-threshold"
      />
      <TextField
        label="Deskripsi (opsional)"
        value={form.values.description}
        onChangeText={(text) => form.setField("description", text)}
        error={form.errors.description}
        multiline
      />

      {form.message !== null ? <Text style={styles.error}>{form.message}</Text> : null}

      <AppButton
        label="Simpan Produk"
        onPress={() => void handleSave()}
        loading={form.saving}
        testID="product-save"
      />
      <AppButton
        label="Batal"
        variant="secondary"
        onPress={() => router.back()}
        disabled={form.saving}
      />
    </Screen>
  );
}

const styles = StyleSheet.create({
  error: {
    fontSize: typography.body,
    color: colors.danger,
  },
});
