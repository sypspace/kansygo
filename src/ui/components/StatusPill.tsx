import { StyleSheet, Text, View } from "react-native";

import { colors, radius, spacing, typography } from "../theme";

export interface StatusPillProps {
  active: boolean;
}

/**
 * Status ditampilkan dengan label teks, bukan hanya warna, agar tetap terbaca
 * oleh pengguna dengan keterbatasan penglihatan warna (AGENTS.md §42).
 */
export function StatusPill({ active }: StatusPillProps) {
  const label = active ? "Aktif" : "Nonaktif";

  return (
    <View style={[styles.pill, active ? styles.pillActive : styles.pillInactive]}>
      <Text style={[styles.label, active ? styles.labelActive : styles.labelInactive]}>
        {label}
      </Text>
    </View>
  );
}

const styles = StyleSheet.create({
  pill: {
    borderRadius: radius.pill,
    paddingHorizontal: spacing.md,
    paddingVertical: spacing.xs,
  },
  pillActive: {
    backgroundColor: "#E4F5EC",
  },
  pillInactive: {
    backgroundColor: "#EDEFF2",
  },
  label: {
    fontSize: typography.label,
    fontWeight: "600",
  },
  labelActive: {
    color: colors.success,
  },
  labelInactive: {
    color: colors.textMuted,
  },
});
