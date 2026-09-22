import { useEffect, useState } from "react";
import { ActivityIndicator, Alert, StyleSheet, Text } from "react-native";

import { toUserMessage } from "@/domain/errors";
import { EMPTY_USER_FORM, type UserProfileFormValues } from "@/domain/master/types";
import { validateUserProfileForm } from "@/domain/master/validation";
import { AppButton } from "@/ui/components/AppButton";
import { Card } from "@/ui/components/Card";
import { Screen } from "@/ui/components/Screen";
import { TextField } from "@/ui/components/TextField";
import { useEntityForm } from "@/ui/hooks/useEntityForm";
import { useAppServices } from "@/ui/providers/AppProvider";
import { colors, typography } from "@/ui/theme";

/**
 * FR-US-001 / FR-US-002 / FR-US-003 — profil pengguna operasional.
 *
 * MVP tidak memiliki authentication dan tidak membatasi akses berdasar role
 * (D-01, D-11); role hanya disiapkan untuk future multi-user.
 */
export default function UserProfileScreen() {
  const { userProfile } = useAppServices();
  const form = useEntityForm<UserProfileFormValues>(EMPTY_USER_FORM);
  const { replaceValues } = form;

  const [loading, setLoading] = useState(true);
  const [loadError, setLoadError] = useState<string | null>(null);
  const [role, setRole] = useState("OWNER_ADMIN");

  useEffect(() => {
    let cancelled = false;

    void (async () => {
      try {
        const profile = await userProfile.get();

        if (cancelled) {
          return;
        }

        if (profile !== null) {
          setRole(profile.role);
          replaceValues({
            name: profile.name,
            email: profile.email ?? "",
            profileInfo: profile.profileInfo ?? "",
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
  }, [replaceValues, userProfile]);

  async function handleSave() {
    const saved = await form.save({
      validate: (values) => validateUserProfileForm(values),
      run: async (values) => {
        const profile = await userProfile.save(values);
        setRole(profile.role);
      },
    });

    if (saved) {
      Alert.alert("Tersimpan", "User Profile sudah disimpan.");
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
      <Card title={`Role: ${role}`} subtitle="Role disiapkan untuk future multi-user dan belum membatasi akses pada MVP." />

      {loadError !== null ? <Text style={styles.error}>{loadError}</Text> : null}

      <TextField
        label="Nama pengguna"
        value={form.values.name}
        onChangeText={(text) => form.setField("name", text)}
        error={form.errors.name}
        testID="user-name"
      />
      <TextField
        label="Email (opsional)"
        value={form.values.email}
        onChangeText={(text) => form.setField("email", text)}
        error={form.errors.email}
        autoCapitalize="none"
        keyboardType="email-address"
      />
      <TextField
        label="Informasi tambahan (opsional)"
        value={form.values.profileInfo}
        onChangeText={(text) => form.setField("profileInfo", text)}
        error={form.errors.profileInfo}
        multiline
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
