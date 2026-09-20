import { ScrollView, StyleSheet, Text, View } from "react-native";

import { formatRupiah } from "@/domain/money";
import { colors, spacing, typography } from "@/ui/theme";

/**
 * Placeholder Dashboard.
 *
 * Isi sebenarnya (task operasional, outstanding, low stock) dikerjakan pada Fase 7
 * dan hanya boleh berasal dari data transaksi (BR-DB-002, BR-DB-003).
 */
export default function DashboardScreen() {
  return (
    <ScrollView contentContainerStyle={styles.container}>
      <Text style={styles.title}>Hari ini</Text>
      <Text style={styles.subtitle}>
        Belum ada data operasional. Modul production, delivery, dan settlement
        dibangun pada fase berikutnya.
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
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    padding: spacing.lg,
    gap: spacing.md,
    backgroundColor: colors.background,
    flexGrow: 1,
  },
  title: {
    fontSize: typography.title,
    fontWeight: "700",
    color: colors.text,
  },
  subtitle: {
    fontSize: typography.body,
    color: colors.textMuted,
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
