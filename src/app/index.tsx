import { useFocusEffect, useRouter } from "expo-router";
import { useCallback, useState } from "react";
import { StyleSheet, Text, View } from "react-native";

import { formatRupiah } from "@/domain/money";
import type { Agent, ProductVariant } from "@/domain/master/types";
import { ListRow } from "@/ui/components/ListRow";
import { Screen } from "@/ui/components/Screen";
import { useAppServices } from "@/ui/providers/AppProvider";
import { colors, spacing, typography } from "@/ui/theme";

/**
 * Dashboard sementara untuk Fase 1.
 *
 * Ringkasan operasional (delivery, reconciliation, outstanding) masih bernilai 0
 * karena modulnya belum dibangun. Isi sebenarnya dikerjakan pada Fase 7 dan harus
 * berasal dari data transaksi (BR-DB-002, BR-DB-003).
 */
export default function DashboardScreen() {
  const router = useRouter();
  const { products, agents } = useAppServices();

  const [activeProducts, setActiveProducts] = useState<ProductVariant[]>([]);
  const [activeAgents, setActiveAgents] = useState<Agent[]>([]);

  useFocusEffect(
    useCallback(() => {
      let cancelled = false;

      void (async () => {
        const [productList, agentList] = await Promise.all([products.list(), agents.list()]);

        if (!cancelled) {
          setActiveProducts(productList);
          setActiveAgents(agentList);
        }
      })();

      return () => {
        cancelled = true;
      };
    }, [products, agents]),
  );

  return (
    <Screen>
      <Text style={styles.title}>Hari ini</Text>
      <Text style={styles.subtitle}>
        Belum ada data operasional. Modul production, delivery, dan settlement dibangun pada fase
        berikutnya.
      </Text>

      <View style={styles.card}>
        <Text style={styles.cardLabel}>Outstanding</Text>
        <Text style={styles.cardValue}>{formatRupiah(0)}</Text>
      </View>

      <View style={styles.card}>
        <Text style={styles.cardLabel}>Delivery belum dikonfirmasi</Text>
        <Text style={styles.cardValue}>0</Text>
      </View>

      <View style={styles.card}>
        <Text style={styles.cardLabel}>TIDAK HABIS belum direkonsiliasi</Text>
        <Text style={styles.cardValue}>0</Text>
      </View>

      <Text style={styles.sectionTitle}>Master Data</Text>
      <ListRow
        title="Produk"
        subtitle={`${activeProducts.length} produk aktif`}
        onPress={() => router.push("/products")}
      />
      <ListRow
        title="Agent"
        subtitle={`${activeAgents.length} agent aktif`}
        onPress={() => router.push("/agents")}
      />
      <ListRow
        title="Pengaturan"
        subtitle="Business profile, user profile"
        onPress={() => router.push("/settings")}
      />
    </Screen>
  );
}

const styles = StyleSheet.create({
  title: {
    fontSize: typography.title,
    fontWeight: "700",
    color: colors.text,
  },
  subtitle: {
    fontSize: typography.body,
    color: colors.textMuted,
  },
  sectionTitle: {
    fontSize: typography.heading,
    fontWeight: "600",
    color: colors.text,
    marginTop: spacing.sm,
  },
  card: {
    backgroundColor: colors.surface,
    borderRadius: 12,
    padding: spacing.lg,
    borderWidth: StyleSheet.hairlineWidth,
    borderColor: colors.border,
    gap: spacing.xs,
  },
  cardLabel: {
    fontSize: typography.label,
    color: colors.textMuted,
  },
  cardValue: {
    fontSize: typography.heading,
    fontWeight: "600",
    color: colors.text,
  },
});
