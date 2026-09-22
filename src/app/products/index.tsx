import { useFocusEffect, useRouter } from "expo-router";
import { useCallback, useState } from "react";
import { ActivityIndicator, StyleSheet, Text, View } from "react-native";

import { formatRupiah } from "@/domain/money";
import type { ProductVariant } from "@/domain/master/types";
import { toUserMessage } from "@/domain/errors";
import { AppButton } from "@/ui/components/AppButton";
import { EmptyState } from "@/ui/components/EmptyState";
import { ListRow } from "@/ui/components/ListRow";
import { Screen } from "@/ui/components/Screen";
import { StatusPill } from "@/ui/components/StatusPill";
import { TextField } from "@/ui/components/TextField";
import { useAppServices } from "@/ui/providers/AppProvider";
import { colors, spacing, typography } from "@/ui/theme";

type FilterMode = "ACTIVE" | "ALL";

/** FR-PR-001 — daftar Product/Variant (UX-FLOW-PR-001). */
export default function ProductListScreen() {
  const router = useRouter();
  const { products } = useAppServices();

  const [items, setItems] = useState<ProductVariant[]>([]);
  const [search, setSearch] = useState("");
  const [filter, setFilter] = useState<FilterMode>("ACTIVE");
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const load = useCallback(async () => {
    setLoading(true);
    setError(null);

    try {
      const list = await products.list({ includeInactive: filter === "ALL", search });
      setItems(list);
    } catch (caught) {
      setError(toUserMessage(caught));
    } finally {
      setLoading(false);
    }
  }, [products, filter, search]);

  useFocusEffect(
    useCallback(() => {
      void load();
    }, [load]),
  );

  return (
    <Screen>
      <TextField
        label="Cari produk"
        value={search}
        onChangeText={setSearch}
        placeholder="Nama produk"
        autoCapitalize="none"
        testID="product-search"
      />

      <View style={styles.filterRow}>
        <View style={styles.filterItem}>
          <AppButton
            label="Aktif"
            variant={filter === "ACTIVE" ? "primary" : "secondary"}
            onPress={() => setFilter("ACTIVE")}
          />
        </View>
        <View style={styles.filterItem}>
          <AppButton
            label="Semua"
            variant={filter === "ALL" ? "primary" : "secondary"}
            onPress={() => setFilter("ALL")}
          />
        </View>
      </View>

      {loading ? <ActivityIndicator color={colors.primary} /> : null}

      {error !== null ? (
        <View style={styles.errorBox}>
          <Text style={styles.errorText}>{error}</Text>
          <AppButton label="Coba lagi" variant="secondary" onPress={() => void load()} />
        </View>
      ) : null}

      {!loading && error === null && items.length === 0 ? (
        <EmptyState
          message="Belum ada produk"
          hint="Tambahkan produk/variant terlebih dahulu sebelum mencatat produksi."
        />
      ) : null}

      {items.map((item) => (
        <ListRow
          key={item.id}
          testID={`product-row-${item.id}`}
          title={item.name}
          subtitle={`${formatRupiah(item.sellingPrice)} · Low stock ≤ ${item.lowStockThreshold}`}
          right={<StatusPill active={item.isActive} />}
          onPress={() => router.push(`/products/${item.id}`)}
        />
      ))}

      <AppButton label="Tambah Produk" onPress={() => router.push("/products/new")} />
    </Screen>
  );
}

const styles = StyleSheet.create({
  filterRow: {
    flexDirection: "row",
    gap: spacing.sm,
  },
  filterItem: {
    flex: 1,
  },
  errorBox: {
    gap: spacing.sm,
    padding: spacing.lg,
    borderRadius: 12,
    backgroundColor: colors.surface,
    borderWidth: StyleSheet.hairlineWidth,
    borderColor: colors.danger,
  },
  errorText: {
    fontSize: typography.body,
    color: colors.danger,
  },
});
