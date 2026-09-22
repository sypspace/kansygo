import type { ReactNode } from "react";
import { StyleSheet, Text, View } from "react-native";

import { colors, radius, spacing, typography } from "../theme";

export interface CardProps {
  children?: ReactNode;
  title?: string;
  subtitle?: string;
}

export function Card({ children, title, subtitle }: CardProps) {
  return (
    <View style={styles.card}>
      {title !== undefined ? <Text style={styles.title}>{title}</Text> : null}
      {subtitle !== undefined ? <Text style={styles.subtitle}>{subtitle}</Text> : null}
      {children ?? null}
    </View>
  );
}

const styles = StyleSheet.create({
  card: {
    backgroundColor: colors.surface,
    borderRadius: radius.md,
    borderWidth: StyleSheet.hairlineWidth,
    borderColor: colors.border,
    padding: spacing.lg,
    gap: spacing.sm,
  },
  title: {
    fontSize: typography.heading,
    fontWeight: "600",
    color: colors.text,
  },
  subtitle: {
    fontSize: typography.body,
    color: colors.textMuted,
  },
});
