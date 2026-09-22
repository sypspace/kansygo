import { useEffect, useState } from "react";
import { ActivityIndicator, Alert, StyleSheet, Text } from "react-native";

import { toUserMessage } from "@/domain/errors";
import {
  EMPTY_BUSINESS_FORM,
  type BusinessProfileFormValues,
} from "@/domain/master/types";
import { validateBusinessProfileForm } from "@/domain/master/validation";
import { AppButton } from "@/ui/components/AppButton";
import { Card } from "@/ui/components/Card";
import { Screen } from "@/ui/components/Screen";
import { TextField } from "@/ui/components/TextField";
import { useEntityForm } from "@/ui/hooks/useEntityForm";
import { useAppServices } from "@/ui/providers/AppProvider";
import { colors, typography } from "@/ui/theme";

/**
 * FR-BP-001 / FR-BP-002 — melihat dan mengubah Business Profile.
 *
 * Informasi yang dipakai pada invoice disimpan sebagai snapshot saat invoice
 * dibuat, sehingga perubahan di sini tidak mengubah dokumen historis (FR-BP-003).
 */
export default function BusinessProfileScreen() {
  const { businessProfile } = useAppServices();
  const form = useEntityForm<BusinessProfileFormValues>(EMPTY_BUSINESS_FORM);
  const { replaceValues } = form;

  const [loading, setLoading] = useState(true);
  const [loadError, setLoadError] = useState<string | null>(null);
  const [isFirstSetup, setIsFirstSetup] = useState(true);

  useEffect(() => {
    let cancelled = false;

    void (async () => {
      try {
        const profile = await businessProfile.get();

        if (cancelled) {
          return;
        }

        setIsFirstSetup(profile === null);

        if (profile !== null) {
          replaceValues({
            name: profile.name,
            legalName: profile.legalName ?? "",
            taxId: profile.taxId ?? "",
            address: profile.address ?? "",
            phone: profile.phone ?? "",
            email: profile.email ?? "",
            logoUri: profile.logoUri ?? "",
            invoicePrefix: profile.invoicePrefix,
          });
        }
      } catch (caught) {
        if (!cancelled) {
          setLoadError(toUserMessage(caught));
        }
      } finally {
        if (!cancelled) {
          setLoading(false);
        }
      }
    })();

    return () => {
      cancelled = true;
    };
  }, [businessProfile, replaceValues]);

  async function handleSave() {
    const saved = await form.save({
      validate: (values) => validateBusinessProfileForm(values),
      run: async (values) => {
        await businessProfile.save(values);
        setIsFirstSetup(false);
      },
    });

    if (saved) {
      Alert.alert("Tersimpan", "Business Profile sudah disimpan.");
    }
  }

  if (loading) {
    return (
      <Screen scroll={false}>
        <ActivityIndicator color={colors.primary} />
      </Screen>
    );
  }

  return (
    <Screen>
      {isFirstSetup ? (
        <Card
          title="Lengkapi identitas bisnis"
          subtitle="Data ini dipakai pada dokumen invoice dan dapat diubah kapan saja."
        />
      ) : null}

      {loadError !== null ? <Text style={styles.error}>{loadError}</Text> : null}

      <TextField
        label="Nama bisnis"
        value={form.values.name}
        onChangeText={(text) => form.setField("name", text)}
        error={form.errors.name}
        testID="business-name"
      />
      <TextField
        label="Nama legal (opsional)"
        value={form.values.legalName}
        onChangeText={(text) => form.setField("legalName", text)}
        error={form.errors.legalName}
      />
      <TextField
        label="NPWP (opsional)"
        value={form.values.taxId}
        onChangeText={(text) => form.setField("taxId", text)}
        error={form.errors.taxId}
        hint="Bila diisi, nilainya ikut disimpan sebagai snapshot pada invoice."
      />
      <TextField
        label="Alamat"
        value={form.values.address}
        onChangeText={(text) => form.setField("address", text)}
        error={form.errors.address}
        multiline
      />
      <TextField
        label="Telepon"
        value={form.values.phone}
        onChangeText={(text) => form.setField("phone", text)}
        error={form.errors.phone}
        keyboardType="phone-pad"
      />
      <TextField
        label="Email"
        value={form.values.email}
        onChangeText={(text) => form.setField("email", text)}
        error={form.errors.email}
        autoCapitalize="none"
        keyboardType="email-address"
      />
      <TextField
        label="Logo (opsional)"
        value={form.values.logoUri}
        onChangeText={(text) => form.setField("logoUri", text)}
        error={form.errors.logoUri}
        autoCapitalize="none"
        hint="Lokasi file/URL logo yang dipakai pada dokumen."
      />
      <TextField
        label="Prefix invoice"
        value={form.values.invoicePrefix}
        onChangeText={(text) => form.setField("invoicePrefix", text)}
        error={form.errors.invoicePrefix}
        autoCapitalize="characters"
        hint="Dipakai pada penomoran invoice, misalnya INV-20260920-001."
        testID="business-invoice-prefix"
      />

      {form.message !== null ? <Text style={styles.error}>{form.message}</Text> : null}

      <AppButton label="Simpan" onPress={() => void handleSave()} loading={form.saving} />
    </Screen>
  );
}

const styles = StyleSheet.create({
  error: {
    fontSize: typography.body,
    color: colors.danger,
  },
});
