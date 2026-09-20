import { Stack } from "expo-router";
import { StatusBar } from "expo-status-bar";

import { colors } from "@/ui/theme";

export default function RootLayout() {
  return (
    <>
      <StatusBar style="dark" />
      <Stack
        screenOptions={{
          headerStyle: { backgroundColor: colors.surface },
          headerTintColor: colors.text,
        }}
      >
        <Stack.Screen name="index" options={{ title: "KansyGo" }} />
      </Stack>
    </>
  );
}
