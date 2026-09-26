# TASK.md

**Version:** 1.0
**Last reconciled:** 2026-09-22
**Purpose:** central task registry (`AGENTS.md` §6)
**Related:** `BACKLOG.md`, `task/[task-id].txt`, `AGENTS.md`

Riwayat eksekusi dan bukti tidak disimpan di dokumen ini, melainkan di `task/[task-id].txt`.

---

# 1. Status Legend

`TODO` → `IN_PROGRESS` → `IMPLEMENTED` → `TESTED` → `PREVIEWED` → `VERIFIED` → `DONE`, ditambah `UNKNOWN` bila bukti tidak tersedia.

| Status | Syarat minimum |
| ------ | -------------- |
| `TODO` | belum dikerjakan |
| `IN_PROGRESS` | pekerjaan berjalan, belum lengkap |
| `IMPLEMENTED` | kode ada dan dipakai, test relevan belum ada/lengkap |
| `TESTED` | test otomatis relevan lulus |
| `PREVIEWED` | aplikasi dijalankan lewat Expo preview untuk alur terkait |
| `VERIFIED` | perilaku diperiksa terhadap requirement + acceptance criteria |
| `DONE` | seluruh syarat penyelesaian terpenuhi |
| `UNKNOWN` | tidak ada bukti untuk menentukan status yang lebih kuat |

**Ringkasan:** 112 task — `TODO` 75, `IN_PROGRESS` 2, `IMPLEMENTED` 25, `TESTED` 8, `DONE` 2.


Kolom **Log** berisi `task/[task-id].txt`. Task berstatus `TODO` belum memiliki log.

---

# 2. BL-001 — Fondasi proyek & tooling

| Task ID | Task | Status | Log |
| ------- | ---- | ------ | --- |
| BL-001-01 | Bootstrap proyek Expo SDK 57 + TypeScript strict | IMPLEMENTED | `task/BL-001-01.txt` |
| BL-001-02 | Toolchain verifikasi (jest-expo, RNTL, node:sqlite, eslint) | TESTED | `task/BL-001-02.txt` |
| BL-001-03 | Struktur layer & arah dependensi | IMPLEMENTED | `task/BL-001-03.txt` |
| BL-001-04 | Domain murni bersama (money, errors, validation, konstanta) | TESTED | `task/BL-001-04.txt` |
| BL-001-05 | Skema master data v1 + kerangka migrasi SQLite | TESTED | `task/BL-001-05.txt` |
| BL-001-06 | SQLite executor (adapter expo-sqlite & node:sqlite) | TESTED | `task/BL-001-06.txt` |
| BL-001-07 | Komponen UI dasar & theme | IMPLEMENTED | `task/BL-001-07.txt` |
| BL-001-08 | AppProvider & composition root layanan | IMPLEMENTED | `task/BL-001-08.txt` |
| BL-001-09 | Dashboard placeholder (Fase 1) | TESTED | `task/BL-001-09.txt` |
| BL-001-10 | Unit test primitif validasi (`positiveInteger`, `isoDate`, `optionalEmail`) | TODO | — |
| BL-001-11 | Perbaiki temuan lint & kontrak komponen UI (`Card`, setState dalam effect) | DONE | `task/BL-001-11.txt` |

# 3. BL-002 — Product Variant (master data)

| Task ID | Task | Status | Log |
| ------- | ---- | ------ | --- |
| BL-002-01 | Repository Product Variant | IMPLEMENTED | `task/BL-002-01.txt` |
| BL-002-02 | Validasi form produk | TESTED | `task/BL-002-02.txt` |
| BL-002-03 | Use case ProductService | IMPLEMENTED | `task/BL-002-03.txt` |
| BL-002-04 | Layar daftar produk + pencarian/filter (FR-PR-001) | IMPLEMENTED | `task/BL-002-04.txt` |
| BL-002-05 | Layar tambah produk (FR-PR-002) | IMPLEMENTED | `task/BL-002-05.txt` |
| BL-002-06 | Layar detail/edit/deaktivasi produk (FR-PR-003/004) | IMPLEMENTED | `task/BL-002-06.txt` |
| BL-002-07 | Integration test repository produk | TODO | — |
| BL-002-08 | Expo preview & verifikasi alur produk (AC-PR-001..004) | TODO | — |

# 4. BL-003 — Agent (master data)

| Task ID | Task | Status | Log |
| ------- | ---- | ------ | --- |
| BL-003-01 | Repository Agent | IMPLEMENTED | `task/BL-003-01.txt` |
| BL-003-02 | Validasi form agent | TESTED | `task/BL-003-02.txt` |
| BL-003-03 | Use case AgentService | IMPLEMENTED | `task/BL-003-03.txt` |
| BL-003-04 | Layar daftar agent + pencarian/filter (FR-AG-001) | IMPLEMENTED | `task/BL-003-04.txt` |
| BL-003-05 | Layar tambah agent (FR-AG-002/006) | IMPLEMENTED | `task/BL-003-05.txt` |
| BL-003-06 | Layar detail/edit/deaktivasi agent (FR-AG-003/004/005) | IMPLEMENTED | `task/BL-003-06.txt` |
| BL-003-07 | Integration test repository agent | TODO | — |
| BL-003-08 | Expo preview & verifikasi alur agent (AC-AG-001..004) | TODO | — |

# 5. BL-004 — Business Profile & User Profile

| Task ID | Task | Status | Log |
| ------- | ---- | ------ | --- |
| BL-004-01 | Repository Business Profile (single row) | IMPLEMENTED | `task/BL-004-01.txt` |
| BL-004-02 | Repository User Profile | IMPLEMENTED | `task/BL-004-02.txt` |
| BL-004-03 | Validasi business & user profile | TESTED | `task/BL-004-03.txt` |
| BL-004-04 | Use case BusinessProfileService | IMPLEMENTED | `task/BL-004-04.txt` |
| BL-004-05 | Use case UserProfileService | IMPLEMENTED | `task/BL-004-05.txt` |
| BL-004-06 | Layar Business Profile (FR-BP-001/002, D-15) | IMPLEMENTED | `task/BL-004-06.txt` |
| BL-004-07 | Layar User Profile (FR-US-001..003) | IMPLEMENTED | `task/BL-004-07.txt` |
| BL-004-08 | Integration test repository business & user | TODO | — |
| BL-004-09 | Expo preview & verifikasi alur profile (AC-BP-001..003, AC-US-001/002) | TODO | — |

# 6. BL-005 — Production (Fase 2)

| Task ID | Task | Status | Log |
| ------- | ---- | ------ | --- |
| BL-005-01 | Pulihkan build produksi: tipe domain & konstanta yang hilang, `stockMovementRepository` | IMPLEMENTED | `task/BL-005-01.txt` |
| BL-005-02 | Skema v2 (`production_batches`, `production_items`, `stock_movements`) | IMPLEMENTED | `task/BL-005-02.txt` |
| BL-005-03 | Perbarui `migrations.test.ts` untuk skema v2 | TODO | — |
| BL-005-04 | Repository Production Batch | IMPLEMENTED | `task/BL-005-04.txt` |
| BL-005-05 | Repository Production Item | IMPLEMENTED | `task/BL-005-05.txt` |
| BL-005-06 | Repository Stock Movement | TODO | — |
| BL-005-07 | Validasi produksi (batch & item) | IMPLEMENTED | `task/BL-005-07.txt` |
| BL-005-08 | Use case ProductionService (batch, item, simpan ke stock) | IN_PROGRESS | `task/BL-005-08.txt` |
| BL-005-09 | Nomor batch `BATCH-YYYYMMDD-NNN` (D-08) | IN_PROGRESS | `task/BL-005-09.txt` |
| BL-005-10 | Layar produksi (daftar, form batch, detail) | TODO | — |
| BL-005-11 | Stock movement `PRODUCTION` saat batch difinalkan (FR-PD-005) | TODO | — |
| BL-005-12 | Koreksi produksi via movement pembalik (D-07, BR-PD-007) | TODO | — |
| BL-005-13 | Test + Expo preview & verifikasi produksi (AC-PD-001..004, AC-IV-001) | TODO | — |

# 7. BL-006 — Inventory

| Task ID | Task | Status | Log |
| ------- | ---- | ------ | --- |
| BL-006-01 | Perhitungan saldo stok Owner & Agent dari stock movement | TODO | — |
| BL-006-02 | Layar Owner Stock & Agent Stock (FR-IV-001..003) | TODO | — |
| BL-006-03 | Histori stock movement (FR-IV-004/005) | TODO | — |
| BL-006-04 | Stock adjustment dengan alasan wajib (FR-IV-008, AC-AD-001..003) | TODO | — |
| BL-006-05 | Low stock threshold & indikator (FR-IV-009/010, AC-IV-006) | TODO | — |
| BL-006-06 | Test + Expo preview & verifikasi inventory (AC-IV-002..006, AC-CR-001/002) | TODO | — |

# 8. BL-007 — Delivery Planning

| Task ID | Task | Status | Log |
| ------- | ---- | ------ | --- |
| BL-007-01 | Skema `delivery_plans` & `delivery_plan_items` | TODO | — |
| BL-007-02 | Repository delivery plan | TODO | — |
| BL-007-03 | Use case delivery plan (Plan Cepat + status `ACTIVE`/`COMPLETED`) | TODO | — |
| BL-007-04 | Layar daftar/detail/form delivery plan (UX-FLOW-DP-001) | TODO | — |
| BL-007-05 | Test + Expo preview & verifikasi delivery planning (AC-DP-001/002) | TODO | — |

# 9. BL-008 — Delivery Confirmation

| Task ID | Task | Status | Log |
| ------- | ---- | ------ | --- |
| BL-008-01 | Skema `deliveries` & `delivery_items` (status `CONFIRMED`) | TODO | — |
| BL-008-02 | Repository delivery | TODO | — |
| BL-008-03 | Use case konfirmasi delivery + movement `DELIVERY` Out Owner → In Agent | TODO | — |
| BL-008-04 | Layar konfirmasi delivery & histori (UX-FLOW-DC-001) | TODO | — |
| BL-008-05 | Koreksi delivery via movement pembalik (D-07) | TODO | — |
| BL-008-06 | Test + Expo preview & verifikasi delivery (AC-DC-001..003, AC-IV-002/003) | TODO | — |

# 10. BL-009 — Sales Confirmation & Reconciliation

| Task ID | Task | Status | Log |
| ------- | ---- | ------ | --- |
| BL-009-01 | Skema `sales_confirmations` | TODO | — |
| BL-009-02 | Skema `reconciliations` & `reconciliation_items` | TODO | — |
| BL-009-03 | Use case Sales Confirmation (HABIS/TIDAK HABIS, D-18) | TODO | — |
| BL-009-04 | Use case Reconciliation + movement `RETURN`/`SOLD` | TODO | — |
| BL-009-05 | Layar sales confirmation & reconciliation (UX-FLOW-SC/RX) | TODO | — |
| BL-009-06 | Test + Expo preview & verifikasi (AC-SC-001..003, AC-RC-001..006) | TODO | — |

# 11. BL-010 — Settlement & Invoice

| Task ID | Task | Status | Log |
| ------- | ---- | ------ | --- |
| BL-010-01 | Skema `settlements` & `settlement_items` + snapshot harga/fee | TODO | — |
| BL-010-02 | Perhitungan gross/fee/net di domain (BR-ST-002..004) | TODO | — |
| BL-010-03 | Use case settlement | TODO | — |
| BL-010-04 | Skema `invoices` & `invoice_items` + snapshot bisnis | TODO | — |
| BL-010-05 | Use case invoice + penomoran `{prefix}-YYYYMMDD-NNN` (D-08) | TODO | — |
| BL-010-06 | PDF & share invoice (FR-IN-006/007) | TODO | — |
| BL-010-07 | Diskon invoice manual (D-04b, FR-IN-009, AC-IN-006) | TODO | — |
| BL-010-08 | Test + Expo preview & verifikasi (AC-ST-001..006, AC-IN-001..005) | TODO | — |

# 12. BL-011 — Payment & Outstanding

| Task ID | Task | Status | Log |
| ------- | ---- | ------ | --- |
| BL-011-01 | Skema `payments` (banyak pembayaran per settlement) | TODO | — |
| BL-011-02 | Use case payment + outstanding/lunas derived | TODO | — |
| BL-011-03 | Layar payment & histori pembayaran (UX-FLOW-PY-001) | TODO | — |
| BL-011-04 | Test + Expo preview & verifikasi (AC-PY-001..006, AC-PY-008/009) | TODO | — |

# 13. BL-012 — Operational Task & Dashboard

| Task ID | Task | Status | Log |
| ------- | ---- | ------ | --- |
| BL-012-01 | Task operasional derived dari transaksi (D-06, FR-TK-001..006) | TODO | — |
| BL-012-02 | Dashboard operasional dari data transaksi (FR-DB-001..009) | TODO | — |
| BL-012-03 | Test + Expo preview & verifikasi (AC-TK-001..004, AC-DB-001..003) | TODO | — |

# 14. BL-013 — Reports, Search & History

| Task ID | Task | Status | Log |
| ------- | ---- | ------ | --- |
| BL-013-01 | Laporan produk/agent/inventory + filter (FR-RP-001..007) | TODO | — |
| BL-013-02 | Pencarian transaksi & navigasi ke sumber (FR-SR-003/004) | TODO | — |
| BL-013-03 | Test + Expo preview & verifikasi (AC-RP-001..004, AC-SR-003/004) | TODO | — |

# 15. BL-014 — Backup, Restore & Hardening

| Task ID | Task | Status | Log |
| ------- | ---- | ------ | --- |
| BL-014-01 | Backup lokal ke file (FR-BK-010, BR-BK-005/006) | TODO | — |
| BL-014-02 | Backup opsional ke Google Drive (FR-BK-001..007) | TODO | — |
| BL-014-03 | Auto backup > 7 hari (D-14b, AC-BK-005) | TODO | — |
| BL-014-04 | Restore via validasi + safety backup (D-12, AC-BK-006/007) | TODO | — |
| BL-014-05 | Koreksi terkendali & proteksi penghapusan (FR-CR-001..005, AC-CR-001/002, AC-DI-005) | TODO | — |

# 16. BL-015 — Architecture & data-model alignment

| Task ID | Task | Status | Log |
| ------- | ---- | ------ | --- |
| BL-015-01 | Audit akses SQL langsung & batas layer | DONE | `task/BL-015-01.txt` |
| BL-015-02 | Selaraskan konstanta & tipe domain yang hilang | TODO | — |
| BL-015-03 | Migrasi bentuk `stock_movements` sesuai keputusan BL-017-03 | TODO | — |
| BL-015-04 | Bersihkan tabel `app_settings` sesuai keputusan BL-017-04 | TODO | — |

# 17. BL-016 — Sinkronisasi dokumentasi

| Task ID | Task | Status | Log |
| ------- | ---- | ------ | --- |
| BL-016-01 | Buat `BACKLOG.md`, `TASK.md`, dan log tugas (reconciliation) | DONE | `task/BL-016-01.txt` |
| BL-016-02 | Perbarui referensi §`AGENTS.md` pada komentar kode | TODO | — |
| BL-016-03 | Perbarui README (status pengembangan & struktur) | TODO | — |
| BL-016-04 | Selaraskan `.clinerules/project-rules.md` dengan `AGENTS.md` baru | TODO | — |
| BL-016-05 | Tambahkan instruksi agent untuk tool lain (`.github/copilot-instructions.md`) | TODO | — |
| BL-016-06 | Tinjau penomoran dokumen `docs/` (tidak ada `07-*.md`) | TODO | — |

# 18. BL-017 — Requirement review item terbuka

| Task ID | Task | Status | Log |
| ------- | ---- | ------ | --- |
| BL-017-01 | Klarifikasi prefix nomor batch (`BT-` implementasi vs `BATCH-` D-08) | TODO | — |
| BL-017-02 | Klarifikasi `production_batches.status` (DRAFT/FINAL) vs D-10 & data model §8 | TODO | — |
| BL-017-03 | Klarifikasi representasi stock movement (`from_location`/`to_location`/`source_id`/`movement_date` vs `location`+`direction`+`reference_id`) | TODO | — |
| BL-017-04 | Klarifikasi tabel `app_settings` (dipertahankan atau dihapus) | TODO | — |

# 19. BL-018 — Verifikasi end-to-end

| Task ID | Task | Status | Log |
| ------- | ---- | ------ | --- |
| BL-018-01 | Skenario end-to-end produksi → payment pada Expo preview | TODO | — |
| BL-018-02 | Verifikasi operasi offline (mode pesawat, AC §29) | TODO | — |
| BL-018-03 | Verifikasi integritas histori & snapshot (AC §28, AC-DI-002) | TODO | — |

---

# 20. Catatan Reconciliation

- Task berstatus di atas `TODO` berasal dari pekerjaan **sebelum** workflow `AGENTS.md` baru berlaku; lognya bersifat **retrospektif** dan hanya memuat fakta yang dapat dibuktikan dari repository (lihat `BACKLOG.md` §6).
- Test Evidence dan Preview Evidence yang tidak tersedia dicatat `UNKNOWN`; tidak ada klaim test/preview tanpa bukti (`AGENTS.md` §9.1, §12, §14 reconciliation).
- Tidak ada task yang sengaja diturunkan statusnya agar terlihat rapi, dan tidak ada task lama yang dihapus.

# 21. Change Log

| Version | Tanggal | Perubahan |
| ------- | ------- | --------- |
| 1.0 | 2026-09-22 | Registry awal dibuat melalui *Project Development State Reconciliation*; 112 task dari 18 backlog item |
