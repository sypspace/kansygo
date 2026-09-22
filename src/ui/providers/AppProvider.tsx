import * as SQLite from "expo-sqlite";
import { createContext, useContext, useEffect, useState, type ReactNode } from "react";
import { ActivityIndicator, StyleSheet, Text, View } from "react-native";

import { createExpoSqliteExecutor, prepareExpoSqliteDatabase } from "@/data/db/expoSqliteExecutor";
import { runMigrations } from "@/data/db/migrations";
import { toUserMessage } from "@/domain/errors";
import { systemClock } from "@/platform/clock";
import { expoCryptoIdGenerator } from "@/platform/ids";
import { AppButton } from "../components/AppButton";
import { colors, spacing, typography } from "../theme";
import { buildAppServices, type AppServices } from "./buildAppServices";

export const DATABASE_NAME = "kansygo.db";

type ProviderState =
  | { status: "loading" }
  | { status: "error"; message: string }
  | { status: "ready"; services: AppServices };

const AppServicesContext = createContext<AppServices | null>(null);

/**
 * Membuka local database, menjalankan migrasi, lalu menyediakan use case
 * ke seluruh layar.
 *
 * Aplikasi harus tetap dapat dibuka tanpa internet; tidak ada operasi jaringan
 * pada tahap inisialisasi (AC-APP-001).
 */
export function AppProvider({ children }: { children: ReactNode }) {
  const [state, setState] = useState<ProviderState>({ status: "loading" });
  const [attempt, setAttempt] = useState(0);

  useEffect(() => {
    let cancelled = false;
    // NOTE: Disable lint rule untuk synchronous setState berikut.
    // Pola ini diperlukan agar retry ("Coba lagi") segera menampilkan loading state
    // sebelum async operation (openDatabase, migrate) selesai. Tanpa setState ini,
    // UI akan mempertahankan state "ready" atau "error" dari prev attempt selama
    // async operation berjalan, sehingga pengguna tidak mendapat feedback bahwa
    // operasi sedang berlangsung.
    // eslint-disable-next-line react-hooks/set-state-in-effect
    setState({ status: "loading" });

    void (async () => {
      try {
        const database = await SQLite.openDatabaseAsync(DATABASE_NAME);
        await prepareExpoSqliteDatabase(database);

        const db = createExpoSqliteExecutor(database);
        await runMigrations(db);

        const services = buildAppServices({
          db,
          clock: systemClock,
          ids: expoCryptoIdGenerator,
        });

        if (!cancelled) {
          setState({ status: "ready", services });
        }
      } catch (error) {
        if (!cancelled) {
          setState({ status: "error", message: toUserMessage(error) });
        }
      }
    })();

    return () => {
      cancelled = true;
    };
  }, [attempt]);

  if (state.status === "loading") {
    return (
      <View style={styles.centered}>
        <ActivityIndicator color={colors.primary} />
        <Text style={styles.muted}>Menyiapkan data lokal…</Text>
      </View>
    );
  }

  if (state.status === "error") {
    return (
      <View style={styles.centered}>
        <Text style={styles.errorTitle}>Database lokal tidak dapat dibuka</Text>
        <Text style={styles.muted}>{state.message}</Text>
        <AppButton label="Coba lagi" onPress={() => setAttempt((value) => value + 1)} />
      </View>
    );
  }

  return (
    <AppServicesContext.Provider value={state.services}>{children}</AppServicesContext.Provider>
  );
}

export function useAppServices(): AppServices {
  const services = useContext(AppServicesContext);

  if (services === null) {
    throw new Error("useAppServices harus dipakai di dalam AppProvider.");
  }

  return services;
}

const styles = StyleSheet.create({
  centered: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
    gap: spacing.md,
    padding: spacing.xl,
    backgroundColor: colors.background,
  },
  muted: {
    fontSize: typography.body,
    color: colors.textMuted,
    textAlign: "center",
  },
  errorTitle: {
    fontSize: typography.heading,
    fontWeight: "700",
    color: colors.text,
    textAlign: "center",
  },
});
