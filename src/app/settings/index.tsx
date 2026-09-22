import { useRouter } from "expo-router";

import { Card } from "@/ui/components/Card";
import { ListRow } from "@/ui/components/ListRow";
import { Screen } from "@/ui/components/Screen";

/** Pengaturan master data dan (Fase 8) backup database. */
export default function SettingsScreen() {
  const router = useRouter();

  return (
    <Screen>
      <ListRow
        title="Business Profile"
        subtitle="Identitas bisnis yang dipakai pada invoice"
        onPress={() => router.push("/settings/business")}
      />
      <ListRow
        title="User Profile"
        subtitle="Pengguna operasional aplikasi"
        onPress={() => router.push("/settings/user")}
      />

      <Card
        title="Backup"
        subtitle="Backup dan restore database lokal dijadwalkan pada Fase 8; operasi harian tidak bergantung pada fitur ini."
      />
    </Screen>
  );
}
