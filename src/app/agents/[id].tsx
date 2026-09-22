import { useLocalSearchParams, useRouter } from "expo-router";
import { useCallback, useEffect, useState } from "react";
import { ActivityIndicator, Alert, StyleSheet, Text } from "react-native";

import { toUserMessage } from "@/domain/errors";
import { formatRupiah } from "@/domain/money";
import { EMPTY_AGENT_FORM, type Agent, type AgentFormValues } from "@/domain/master/types";
import { validateAgentForm } from "@/domain/master/validation";
import { AppButton } from "@/ui/components/AppButton";
import { Card } from "@/ui/components/Card";
import { Screen } from "@/ui/components/Screen";
import { StatusPill } from "@/ui/components/StatusPill";
import { TextField } from "@/ui/components/TextField";
import { formatDateTime } from "@/ui/format";
import { useEntityForm } from "@/ui/hooks/useEntityForm";
import { useAppServices } from "@/ui/providers/AppProvider";
import { colors, typography } from "@/ui/theme";

/**
 * FR-AG-003 / FR-AG-004 / FR-AG-005 — mengubah, menonaktifkan, dan melihat
 * informasi Agent.
 *
 * Peringatan (stok/outstanding) bersifat informatif dan tidak memblokir (D-13).
 * Histori transaksi tidak boleh hilang karena agent dinonaktifkan (BR-AG-003).
 */
export default function AgentDetailScreen() {
  const { id } = useLocalSearchParams<{ id: string }>();
  const router = useRouter();
  const { agents } = useAppServices();
  const form = useEntityForm<AgentFormValues>(EMPTY_AGENT_FORM);
  const { replaceValues } = form;

  const [agent, setAgent] = useState<Agent | null>(null);
  const [loading, setLoading] = useState(true);
  const [toggling, setToggling] = useState(false);
  const [loadError, setLoadError] = useState<string | null>(null);

  const load = useCallback(async () => {
    setLoadError(null);
    setLoading(true);

    try {
      const found = await agents.getById(id);
      setAgent(found);

      if (found !== null) {
        replaceValues({
          name: found.name,
          contact: found.contact ?? "",
          address: found.address ?? "",
          location: found.location ?? "",
          feePerUnit: String(found.feePerUnit),
        });
      }
    } catch (caught) {
      setLoadError(toUserMessage(caught));
    } finally {
      setLoading(false);
    }
  }, [agents, id, replaceValues]);

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
      validate: (values) => validateAgentForm(values),
      run: async (values) => {
        await agents.update(id, values);
        await load();
      },
    });

    if (saved) {
      Alert.alert("Tersimpan", "Perubahan agent sudah disimpan.");
    }
  }

  async function applyToggle(isActive: boolean) {
    setToggling(true);

    try {
      await agents.setActive(id, isActive);
      await load();
    } catch (caught) {
      Alert.alert("Gagal", toUserMessage(caught));
    } finally {
      setToggling(false);
    }
  }

  async function handleToggle() {
    if (agent === null) {
      return;
    }

    if (agent.isActive) {
      const warnings = await agents.getDeactivationWarnings(id);
      const impact = warnings.length > 0 ? `${warnings.join("\n")}\n\n` : "";

      Alert.alert(
        "Nonaktifkan agent?",
        `${impact}Agent nonaktif tidak dapat dipakai pada delivery baru, tetapi histori tetap tersedia.`,
        [
          { text: "Batal", style: "cancel" },
          { text: "Nonaktifkan", style: "destructive", onPress: () => void applyToggle(false) },
        ],
      );

      return;
    }

    Alert.alert("Aktifkan agent?", "Agent dapat dipakai kembali pada delivery baru.", [
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

  if (agent === null) {
    return (
      <Screen>
        <Text style={styles.error}>Agent tidak ditemukan.</Text>
        <AppButton label="Kembali" variant="secondary" onPress={() => router.back()} />
      </Screen>
    );
  }

  return (
    <Screen>
      <Card>
        <Text style={styles.summaryTitle}>{agent.name}</Text>
        <Text style={styles.summaryValue}>Fee {formatRupiah(agent.feePerUnit)} / unit</Text>
        <StatusPill active={agent.isActive} />
        <Text style={styles.meta}>Dibuat {formatDateTime(agent.createdAt)}</Text>
        <Text style={styles.meta}>Diperbarui {formatDateTime(agent.updatedAt)}</Text>
      </Card>

      <Card
        title="Aktivitas"
        subtitle="Riwayat delivery, penjualan, dan outstanding akan tampil di sini pada fase berikutnya."
      >
        <Text style={styles.meta}>Delivery: belum tersedia</Text>
        <Text style={styles.meta}>Outstanding: {formatRupiah(0)}</Text>
      </Card>

      <TextField
        label="Nama agent"
        value={form.values.name}
        onChangeText={(text) => form.setField("name", text)}
        error={form.errors.name}
      />
      <TextField
        label="Nomor kontak (opsional)"
        value={form.values.contact}
        onChangeText={(text) => form.setField("contact", text)}
        error={form.errors.contact}
        keyboardType="phone-pad"
      />
      <TextField
        label="Alamat (opsional)"
        value={form.values.address}
        onChangeText={(text) => form.setField("address", text)}
        error={form.errors.address}
        multiline
      />
      <TextField
        label="Lokasi (opsional)"
        value={form.values.location}
        onChangeText={(text) => form.setField("location", text)}
        error={form.errors.location}
      />
      <TextField
        label="Fee per unit (Rp)"
        value={form.values.feePerUnit}
        onChangeText={(text) => form.setField("feePerUnit", text)}
        error={form.errors.feePerUnit}
        keyboardType="number-pad"
      />

      {form.message !== null ? <Text style={styles.error}>{form.message}</Text> : null}

      <AppButton label="Simpan Perubahan" onPress={() => void handleSave()} loading={form.saving} />
      <AppButton
        label={agent.isActive ? "Nonaktifkan Agent" : "Aktifkan Agent"}
        variant={agent.isActive ? "danger" : "secondary"}
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
