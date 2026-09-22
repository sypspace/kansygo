import { useLocalSearchParams, useRouter } from "expo-router";
import { useCallback, useEffect, useState } from "react";
import { ActivityIndicator, Alert, StyleSheet, Text } from "react-native";

import { toUserMessage } from "@/domain/errors";
import { formatRupiah } from "@/domain/money";
import { AppButton } from "@/ui/components/AppButton";
import { Card } from "@/ui/components/Card";
import { Screen } from "@/ui/components/Screen";
import { StatusPill } from "@/ui/components/StatusPill";
import { TextField } from "@/ui/components/TextField";
import { formatDateTime } from "@/ui/format";
import { colors, typography } from "@/ui/theme";
import {
  EMPTY_PRODUCT_FORM,
  type ProductFormValues,
  type ProductVariant,
} from "@/domain/master/types";
import { validateProductForm } from "@/domain/master/validation";
import { useEntityForm } from "@/ui/hooks/useEntityForm";
import { useAppServices } from "@/ui/providers/AppProvider";

/**
 * FR-PR-003 / FR-PR-004 — mengubah dan menonaktifkan Product/Variant.
 *
 * Nonaktif tidak menghapus histori; peringatan stok bersifat informatif dan
 * tidak memblokir (D-13).
 */
export default function ProductDetailScreen() {
  const { id } = useLocalSearchParams<{ id: string }>();
  const router = useRouter();
  const { products } = useAppServices();
  const form = useEntityForm<ProductFormValues>(EMPTY_PRODUCT_FORM);
  const { replaceValues } = form;

  const [product, setProduct] = useState<ProductVariant | null>(null);
  const [loading, setLoading] = useState(true);
  const [toggling, setToggling] = useState(false);
  const [loadError, setLoadError] = useState<string | null>(null);

  const load = useCallback(async () => {
    setLoadError(null);
    setLoading(true);

    try {
      const found = await products.getById(id);
      setProduct(found);

      if (found !== null) {
        replaceValues({
          name: found.name,
          sellingPrice: String(found.sellingPrice),
          description: found.description ?? "",
          lowStockThreshold: String(found.lowStockThreshold),
        });
      }
    } catch (caught) {
      setLoadError(toUserMessage(caught));
    } finally {
      setLoading(false);
    }
  }, [id, products, replaceValues]);

  useEffect(() => {
    // NOTE: Disable lint rule untuk pemanggilan load() berikut.
    // load() memanggil setLoading(true) secara synchronous di awal untuk mereset
    // loading state sebelum melakukan fetch. Ini adalah pola async data loading yang
    // valid; tanpa reset ini, re-fetch tidak akan menampilkan loading indicator.
    // eslint-disable-next-line react-hooks/set-state-in-effect
    void load();
  }, [load]);

  async function handleSave() {
    const saved = await form.save({
      validate: (values) => validateProductForm(values),
      run: async (values) => {
        await products.update(id, values);
        await load();
      },
    });

    if (saved) {
      Alert.alert("Tersimpan", "Perubahan produk sudah disimpan.");
    }
  }

  async function applyToggle(isActive: boolean) {
    setToggling(true);

    try {
      await products.setActive(id, isActive);
      await load();
    } catch (caught) {
      Alert.alert("Gagal", toUserMessage(caught));
    } finally {
      setToggling(false);
    }
  }

  async function handleToggle() {
    if (product === null) {
      return;
    }

    if (product.isActive) {
      const warnings = await products.getDeactivationWarnings(id);
      const impact = warnings.length > 0 ? `${warnings.join("\n")}\n\n` : "";

      Alert.alert(
        "Nonaktifkan produk?",
        `${impact}Produk nonaktif tidak dapat dipakai pada transaksi baru, tetapi histori tetap tersedia.`,
        [
          { text: "Batal", style: "cancel" },
          { text: "Nonaktifkan", style: "destructive", onPress: () => void applyToggle(false) },
        ],
      );

      return;
    }

    Alert.alert("Aktifkan produk?", "Produk dapat dipakai kembali pada transaksi baru.", [
      { text: "Batal", style: "cancel" },
      { text: "Aktifkan", onPress: () => void applyToggle(true) },
    ]);
  }

  if (loading) {
    return (
      <Screen scroll={false}>
        <ActivityIndicator color={colors.primary} />
      </Screen>
    );
  }

  if (loadError !== null) {
    return (
      <Screen>
        <Text style={styles.error}>{loadError}</Text>
        <AppButton label="Coba lagi" variant="secondary" onPress={() => void load()} />
      </Screen>
    );
  }

  if (product === null) {
    return (
      <Screen>
        <Text style={styles.error}>Produk tidak ditemukan.</Text>
        <AppButton label="Kembali" variant="secondary" onPress={() => router.back()} />
      </Screen>
    );
  }

  return (
    <Screen>
      <Card>
        <Text style={styles.summaryTitle}>{product.name}</Text>
        <Text style={styles.summaryValue}>{formatRupiah(product.sellingPrice)}</Text>
        <StatusPill active={product.isActive} />
        <Text style={styles.meta}>Dibuat {formatDateTime(product.createdAt)}</Text>
        <Text style={styles.meta}>Diperbarui {formatDateTime(product.updatedAt)}</Text>
      </Card>

      <TextField
        label="Nama produk"
        value={form.values.name}
        onChangeText={(text) => form.setField("name", text)}
        error={form.errors.name}
      />
      <TextField
        label="Harga jual (Rp)"
        value={form.values.sellingPrice}
        onChangeText={(text) => form.setField("sellingPrice", text)}
        error={form.errors.sellingPrice}
        keyboardType="number-pad"
      />
      <TextField
        label="Batas low stock"
        value={form.values.lowStockThreshold}
        onChangeText={(text) => form.setField("lowStockThreshold", text)}
        error={form.errors.lowStockThreshold}
        keyboardType="number-pad"
      />
      <TextField
        label="Deskripsi (opsional)"
        value={form.values.description}
        onChangeText={(text) => form.setField("description", text)}
        error={form.errors.description}
        multiline
      />

      {form.message !== null ? <Text style={styles.error}>{form.message}</Text> : null}

      <AppButton label="Simpan Perubahan" onPress={() => void handleSave()} loading={form.saving} />
      <AppButton
        label={product.isActive ? "Nonaktifkan Produk" : "Aktifkan Produk"}
        variant={product.isActive ? "danger" : "secondary"}
        onPress={() => void handleToggle()}
        loading={toggling}
      />
    </Screen>
  );
}

const styles = StyleSheet.create({
  summaryTitle: {
    fontSize: typography.heading,
    fontWeight: "700",
    color: colors.text,
  },
  summaryValue: {
    fontSize: typography.body,
    fontWeight: "600",
    color: colors.text,
  },
  meta: {
    fontSize: typography.label,
    color: colors.textMuted,
  },
  error: {
    fontSize: typography.body,
    color: colors.danger,
  },
});
