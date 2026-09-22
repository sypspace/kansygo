import type { ReactNode } from "react";
import { ScrollView, StyleSheet, View } from "react-native";

import { colors, spacing } from "../theme";

export interface ScreenProps {
  children: ReactNode;
  /** Gunakan ScrollView (default) untuk layar form/daftar panjang. */
  scroll?: boolean;
}

export function Screen({ children, scroll = true }: ScreenProps) {
  if (!scroll) {
    return <View style={styles.container}>{children}</View>;
  }

  return (
    <ScrollView
      style={styles.root}
      contentContainerStyle={styles.container}
      keyboardShouldPersistTaps="handled"
    >
      {children}
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  root: {
    backgroundColor: colors.background,
  },
  container: {
    flexGrow: 1,
    padding: spacing.lg,
    gap: spacing.md,
    backgroundColor: colors.background,
  },
});
