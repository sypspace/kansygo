# KansyGo

Aplikasi Android internal untuk operasional bisnis distribusi frozen food dengan model **konsinyasi**.

Siklus operasional yang didukung:

```text
Production → Owner Stock → Delivery → Agent Stock → Sales Confirmation
   → (Reconciliation bila TIDAK HABIS) → Settlement → Invoice → Payment
```

MVP bersifat **Android-first, local-first, offline-first**: seluruh operasi inti berjalan tanpa koneksi internet.

---

## Requirement & Dokumentasi

Dokumen sumber kebenaran berada di `docs/`:

| Dokumen | Isi |
| ------- | --- |
| `docs/00-Baseline.md` | Baseline keputusan produk & platform |
| `docs/01-PRD.md` | Product requirements |
| `docs/02-Business-Rules.md` | Business rules |
| `docs/03-Functional-Requirements.md` | Functional requirements |
| `docs/04-UX-Flows.md` | UX flows |
| `docs/05-Data-Model.md` | Data model |
| `docs/06-Acceptance-Criteria.md` | Acceptance criteria |
| `docs/08-Technical-Architecture.md` | Arsitektur teknis |
| `docs/09-Decision-Log.md` | Keputusan final atas item OPEN/konflik |

Aturan kerja wajib: `AGENTS.md`. Jangan mengubah requirement yang sudah disetujui tanpa pembaruan dokumen.

---

## Technology Stack

- Expo SDK 57 + React Native (TypeScript, strict)
- `expo-router` untuk navigasi
- `expo-sqlite` untuk local database
- `jest-expo` + React Native Testing Library untuk pengujian
- Tanpa state library global, tanpa ORM, tanpa backend cloud

---

## Menjalankan

```bash
npm install
npm run android      # menjalankan di emulator/device Android
npm start            # Expo dev server
```

Verifikasi:

```bash
npm run typecheck    # tsc --noEmit
npm test             # jest
npm run lint         # expo lint
```

---

## Struktur Folder

```text
src/
├── app/            # routes (expo-router) — hanya UI & navigasi
├── ui/             # komponen, tema, formatter
├── application/    # use case / orkestrasi transaksi
├── domain/         # business rules, perhitungan, validasi (tanpa React/SQLite)
├── data/           # schema, migrasi, repository
└── platform/       # adapter (SQLite executor, clock, id generator, backup)
```

Arah dependensi: `app/ui → application → domain → data → SQLite`. Business logic tidak boleh bergantung pada UI atau implementasi database.

---

## Konvensi Penting

- **Uang**: integer rupiah (`150000` = Rp150.000). Formatting hanya di lapisan presentasi (`src/domain/money.ts`).
- **ID**: UUID v4 stabil; nomor dokumen human-readable terpisah (`INV-YYYYMMDD-NNN`, `BATCH-YYYYMMDD-NNN`).
- **Inventory**: berbasis stock movement, bukan saldo yang dapat diedit langsung.
- **Historical**: nilai transaksi disimpan sebagai snapshot (harga jual, fee Agent, identitas bisnis).
- **Delete**: histori tidak dihapus; master data dinonaktifkan (`is_active`).

---

## Status Pengembangan

| Fase | Cakupan | Status |
| ---- | ------- | ------ |
| 0 | Fondasi project (Expo, TS, testing, struktur) | Selesai |
| 1 | Data layer + master data (product, agent, business, user) | Belum |
| 2 | Production & inventory | Belum |
| 3 | Delivery planning & confirmation | Belum |
| 4 | Sales confirmation & reconciliation | Belum |
| 5 | Settlement & invoice | Belum |
| 6 | Payment & outstanding | Belum |
| 6B | Kredit Agent (perlu sesi desain) | Belum |
| 7 | Dashboard, task, report, search | Belum |
| 8 | Backup, restore & hardening | Belum |
| 9 | Verifikasi end-to-end | Belum |
