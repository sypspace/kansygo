import { Stack } from "expo-router";
import { StatusBar } from "expo-status-bar";

import { AppProvider } from "@/ui/providers/AppProvider";
import { colors } from "@/ui/theme";

export default function RootLayout() {
  return (
    <AppProvider>
      <StatusBar style="dark" />
      <Stack
        screenOptions={{
          headerStyle: { backgroundColor: colors.surface },
          headerTintColor: colors.text,
          contentStyle: { backgroundColor: colors.background },
        }}
      >
        <Stack.Screen name="index" options={{ title: "KansyGo" }} />
        <Stack.Screen name="products/index" options={{ title: "Produk" }} />
        <Stack.Screen name="products/new" options={{ title: "Produk Baru" }} />
        <Stack.Screen name="products/[id]" options={{ title: "Detail Produk" }} />
        <Stack.Screen name="agents/index" options={{ title: "Agent" }} />
        <Stack.Screen name="agents/new" options={{ title: "Agent Baru" }} />
        <Stack.Screen name="agents/[id]" options={{ title: "Detail Agent" }} />
        <Stack.Screen name="settings/index" options={{ title: "Pengaturan" }} />
        <Stack.Screen name="settings/business" options={{ title: "Business Profile" }} />
        <Stack.Screen name="settings/user" options={{ title: "User Profile" }} />
      </Stack>
    </AppProvider>
  );
}
