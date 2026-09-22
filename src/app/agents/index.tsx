import { useFocusEffect, useRouter } from "expo-router";
import { useCallback, useState } from "react";
import { ActivityIndicator, StyleSheet, Text, View } from "react-native";

import { toUserMessage } from "@/domain/errors";
import { formatRupiah } from "@/domain/money";
import type { Agent } from "@/domain/master/types";
import { AppButton } from "@/ui/components/AppButton";
import { EmptyState } from "@/ui/components/EmptyState";
import { ListRow } from "@/ui/components/ListRow";
import { Screen } from "@/ui/components/Screen";
import { StatusPill } from "@/ui/components/StatusPill";
import { TextField } from "@/ui/components/TextField";
import { useAppServices } from "@/ui/providers/AppProvider";
import { colors, spacing, typography } from "@/ui/theme";

type FilterMode = "ACTIVE" | "ALL";

/** FR-AG-001 — daftar Agent (UX-FLOW-AG-001). */
export default function AgentListScreen() {
  const router = useRouter();
  const { agents } = useAppServices();

  const [items, setItems] = useState<Agent[]>([]);
  const [search, setSearch] = useState("");
  const [filter, setFilter] = useState<FilterMode>("ACTIVE");
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const load = useCallback(async () => {
    setLoading(true);
    setError(null);

    try {
      const list = await agents.list({ includeInactive: filter === "ALL", search });
      setItems(list);
    } catch (caught) {
      setError(toUserMessage(caught));
    } finally {
      setLoading(false);
    }
  }, [agents, filter, search]);

  useFocusEffect(
    useCallback(() => {
      void load();
    }, [load]),
  );

  return (
    <Screen>
      <TextField
        label="Cari agent"
        value={search}
        onChangeText={setSearch}
        placeholder="Nama atau kontak"
        autoCapitalize="none"
        testID="agent-search"
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
          message="Belum ada agent"
          hint="Tambahkan agent terlebih dahulu sebelum membuat delivery plan."
        />
      ) : null}

      {items.map((item) => (
        <ListRow
          key={item.id}
          testID={`agent-row-${item.id}`}
          title={item.name}
          subtitle={`Fee ${formatRupiah(item.feePerUnit)} / unit${
            item.contact !== null ? ` · ${item.contact}` : ""
          }`}
          right={<StatusPill active={item.isActive} />}
          onPress={() => router.push(`/agents/${item.id}`)}
        />
      ))}

      <AppButton label="Tambah Agent" onPress={() => router.push("/agents/new")} />
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
