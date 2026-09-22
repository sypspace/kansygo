import { useRouter } from "expo-router";
import { StyleSheet, Text } from "react-native";

import { EMPTY_AGENT_FORM, type AgentFormValues } from "@/domain/master/types";
import { validateAgentForm } from "@/domain/master/validation";
import { AppButton } from "@/ui/components/AppButton";
import { Screen } from "@/ui/components/Screen";
import { TextField } from "@/ui/components/TextField";
import { useEntityForm } from "@/ui/hooks/useEntityForm";
import { useAppServices } from "@/ui/providers/AppProvider";
import { colors, typography } from "@/ui/theme";

/**
 * FR-AG-002 — menambahkan Agent.
 *
 * Fee per unit adalah nominal tetap per unit terjual (BR-ST-004); fee berbeda
 * antar agent diperbolehkan (BR-ST-006).
 */
export default function NewAgentScreen() {
  const router = useRouter();
  const { agents } = useAppServices();
  const form = useEntityForm<AgentFormValues>(EMPTY_AGENT_FORM);

  async function handleSave() {
    await form.save({
      validate: (values) => validateAgentForm(values),
      run: async (values) => {
        const agent = await agents.create(values);
        router.replace(`/agents/${agent.id}`);
      },
    });
  }

  return (
    <Screen>
      <TextField
        label="Nama agent"
        value={form.values.name}
        onChangeText={(text) => form.setField("name", text)}
        error={form.errors.name}
        placeholder="Contoh: Toko Bu Sari"
        testID="agent-name"
      />
      <TextField
        label="Nomor kontak (opsional)"
        value={form.values.contact}
        onChangeText={(text) => form.setField("contact", text)}
        error={form.errors.contact}
        keyboardType="phone-pad"
        testID="agent-contact"
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
        hint="Keterangan lokasi singkat, misalnya nama pasar atau patokan."
      />
      <TextField
        label="Fee per unit (Rp)"
        value={form.values.feePerUnit}
        onChangeText={(text) => form.setField("feePerUnit", text)}
        error={form.errors.feePerUnit}
        keyboardType="number-pad"
        placeholder="500"
        hint="Nominal tetap per unit terjual; dipakai sebagai snapshot pada settlement."
        testID="agent-fee"
      />

      {form.message !== null ? <Text style={styles.error}>{form.message}</Text> : null}

      <AppButton
        label="Simpan Agent"
        onPress={() => void handleSave()}
        loading={form.saving}
        testID="agent-save"
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
