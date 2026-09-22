# BACKLOG.md

**Version:** 1.0
**Last reconciled:** 2026-09-22
**Status:** Living document
**Purpose:** jembatan antara requirement yang disetujui dan pekerjaan implementasi
**Related:** `AGENTS.md`, `docs/01-PRD.md` s.d. `docs/06-Acceptance-Criteria.md`, `docs/08-Technical-Architecture.md`, `docs/09-Decision-Log.md`, `TASK.md`, `task/[task-id].txt`

---

# 1. Cara Membaca Dokumen Ini

`AGENTS.md` §5 menetapkan alur kerja:

```text
Requirements → Backlog Item → Tasks → Implementation → Testing
    → Expo Preview → Verification → Task Done → Backlog Update
```

- Dokumen ini memuat **backlog item** (outcome), bukan riwayat implementasi.
- `TASK.md` adalah registry task; `task/[task-id].txt` memuat log dan bukti.
- Requirement (`docs/01` s.d. `docs/06` + `docs/09-Decision-Log.md`) tetap **sumber kebenaran**. Backlog tidak boleh menimpa requirement yang disetujui (`AGENTS.md` §2, §14).

# 2. Konvensi

## 2.1 Status backlog item

| Status | Arti |
| ------ | ---- |
| `NOT_STARTED` | belum ada implementasi |
| `IN_PROGRESS` | sebagian task berjalan; fungsi belum lengkap |
| `IMPLEMENTED` | kode tersedia dan berjalan, tetapi verifikasi acceptance (preview/verifikasi) belum lengkap |
| `COMPLETE` | seluruh task selesai dan acceptance criteria terverifikasi |
| `BLOCKED` | menunggu keputusan requirement atau task lain |
| `DEFERRED` | sengaja ditunda (di luar MVP atau menunggu sesi desain) |
| `OBSOLETE` | tidak lagi relevan (harus disertai alasan) |

## 2.2 Status task

`TODO` → `IN_PROGRESS` → `IMPLEMENTED` → `TESTED` → `PREVIEWED` → `VERIFIED` → `DONE`, ditambah `UNKNOWN` bila bukti tidak tersedia (`AGENTS.md` §10, §12).

## 2.3 Tipe & prioritas

- Tipe: `FEATURE`, `BUG`, `TECHNICAL`, `TECHNICAL_DEBT`, `MIGRATION`, `IMPROVEMENT`, `DOCUMENTATION`, `REQUIREMENT_REVIEW`.
- Prioritas: `P0` blocking, `P1` inti MVP, `P2` pelengkap MVP, `P3` peningkatan.

# 3. Ringkasan Backlog

| ID | Backlog Item | Tipe | Status | Prioritas | Task |
| -- | ------------ | ---- | ------ | --------- | ---- |
| BL-001 | Fondasi proyek & tooling | TECHNICAL | IN_PROGRESS | P0 | 11 |
| BL-002 | Product Variant (master data) | FEATURE | IMPLEMENTED | P1 | 8 |
| BL-003 | Agent (master data) | FEATURE | IMPLEMENTED | P1 | 8 |
| BL-004 | Business Profile & User Profile | FEATURE | IMPLEMENTED | P1 | 9 |
| BL-005 | Production (Fase 2) | FEATURE | IN_PROGRESS | P0 | 13 |
| BL-006 | Inventory | FEATURE | NOT_STARTED | P1 | 6 |
| BL-007 | Delivery Planning | FEATURE | NOT_STARTED | P1 | 5 |
| BL-008 | Delivery Confirmation | FEATURE | NOT_STARTED | P1 | 6 |
| BL-009 | Sales Confirmation & Reconciliation | FEATURE | NOT_STARTED | P1 | 6 |
| BL-010 | Settlement & Invoice | FEATURE | NOT_STARTED | P1 | 8 |
| BL-011 | Payment & Outstanding | FEATURE | NOT_STARTED | P1 | 4 |
| BL-012 | Operational Task & Dashboard | FEATURE | NOT_STARTED | P2 | 3 |
| BL-013 | Reports, Search & History | FEATURE | NOT_STARTED | P2 | 3 |
| BL-014 | Backup, Restore & Hardening | FEATURE | NOT_STARTED | P2 | 5 |
| BL-015 | Architecture & data-model alignment | MIGRATION | IN_PROGRESS | P0 | 4 |
| BL-016 | Sinkronisasi dokumentasi | DOCUMENTATION | IN_PROGRESS | P1 | 6 |
| BL-017 | Requirement review item terbuka | REQUIREMENT_REVIEW | NOT_STARTED | P0 | 4 |
| BL-018 | Verifikasi end-to-end | FEATURE | NOT_STARTED | P1 | 3 |

**Total task terdaftar:** 112 — `TODO` 76, `IN_PROGRESS` 2, `IMPLEMENTED` 24, `TESTED` 8, `DONE` 2 (rinciannya di `TASK.md`).

Bacaan status saat reconciliation (2026-09-22):
item `NOT_STARTED` 11, `IMPLEMENTED` 3, `IN_PROGRESS` 4.
Tidak ada backlog lama yang perlu ditandai `OBSOLETE` (belum pernah ada `BACKLOG.md`).

# 4. Detail Backlog Item

## BL-001 — Fondasi proyek & tooling

- **Tipe:** TECHNICAL
- **Status:** IN_PROGRESS
- **Prioritas:** P0
- **Requirements:** `00-Baseline.md` §3, §5; `08-Technical-Architecture.md` §2, §3, §12; `AGENTS.md` §15, §16, §17, §18, §28
- **Acceptance Criteria:** AC-APP-001 (prasyarat), AC-DI-001
- **Dependensi:** —
- **Ringkasan:** Kerangka aplikasi Expo + TypeScript strict, struktur layer, domain murni, akses SQLite melalui `SqlExecutor`, skema master data v1, komponen UI dasar, dan composition root layanan. Fondasi ini menjadi prasyarat seluruh modul berikutnya.
- **Tasks:** BL-001-01 .. BL-001-11
- **Catatan / gap:**
  - Akses SQL sudah terkurung di `src/data/**` (audit BL-015-01), tetapi pembukaan database masih dari `src/ui/providers/AppProvider.tsx` (composition root). Dinilai `NO_ACTION` untuk saat ini.
  - Belum ada component test UI; lint masih memiliki 3 error (BL-001-11).

## BL-002 — Product Variant (master data)

- **Tipe:** FEATURE
- **Status:** IMPLEMENTED
- **Prioritas:** P1
- **Requirements:** FR-PR-001..FR-PR-007; BR-PR-001..BR-PR-006; `05-Data-Model.md` §6; `04-UX-Flows.md` §28; D-13
- **Acceptance Criteria:** AC-PR-001, AC-PR-002, AC-PR-003, AC-PR-004; AC-SR-002 (parsial)
- **Dependensi:** BL-001
- **Ringkasan:** Master sellable item (Product Variant) pada MVP: daftar + pencarian, tambah, edit, deaktivasi (tanpa menghapus histori), harga jual integer rupiah, batas low stock.
- **Tasks:** BL-002-01 .. BL-002-08
- **Catatan / gap:**
  - Belum ada verifikasi terhadap AC-PR-001..AC-PR-004 (`BL-002-08`), termasuk AC-PR-004 (harga historis) yang hanya dapat diverifikasi setelah modul settlement ada.
  - Repositori belum memiliki integration test (`BL-002-07`).
  - Peringatan nonaktif produk (`getDeactivationWarnings`) masih mengembalikan daftar kosong sampai inventory tersedia (D-13).

## BL-003 — Agent (master data)

- **Tipe:** FEATURE
- **Status:** IMPLEMENTED
- **Prioritas:** P1
- **Requirements:** FR-AG-001..FR-AG-007; BR-AG-001..BR-AG-005; `05-Data-Model.md` §7; `04-UX-Flows.md` §29, §30; D-13
- **Acceptance Criteria:** AC-AG-001, AC-AG-002, AC-AG-003, AC-AG-004
- **Dependensi:** BL-001
- **Ringkasan:** Master agent: daftar + pencarian, tambah, edit, deaktivasi, fee per unit sebagai dasar settlement.
- **Tasks:** BL-003-01 .. BL-003-08
- **Catatan / gap:**
  - Verifikasi AC-AG-001..AC-AG-004 belum dilakukan (`BL-003-08`).
  - Repositori belum memiliki integration test (`BL-003-07`).
  - Snapshot fee pada settlement adalah tanggung jawab BL-010 (AC-AG-004).

## BL-004 — Business Profile & User Profile

- **Tipe:** FEATURE
- **Status:** IMPLEMENTED
- **Prioritas:** P1
- **Requirements:** FR-BP-001..FR-BP-003, FR-US-001..FR-US-003; BR-BP-001..BR-BP-004, BR-US-001..BR-US-006; `05-Data-Model.md` §4, §5; D-01, D-11, D-15
- **Acceptance Criteria:** AC-BP-001, AC-BP-002, AC-BP-003, AC-US-001, AC-US-002
- **Dependensi:** BL-001
- **Ringkasan:** Identitas bisnis (termasuk `invoice_prefix` dan NPWP) dan profil pengguna operasional tunggal, tanpa authentication dan tanpa gating role pada MVP.
- **Tasks:** BL-004-01 .. BL-004-09
- **Catatan / gap:**
  - AC-BP-003 (snapshot bisnis pada invoice) baru dapat diverifikasi setelah BL-010.
  - Verifikasi AC-BP-001/002 dan AC-US-001/002 belum dilakukan (`BL-004-09`).
  - Repositori business & user belum memiliki integration test (`BL-004-08`).

## BL-005 — Production (Fase 2)

- **Tipe:** FEATURE
- **Status:** IN_PROGRESS
- **Prioritas:** P0
- **Requirements:** FR-PD-001..FR-PD-007; BR-PD-001..BR-PD-007; `05-Data-Model.md` §8, §9; D-07, D-08, D-10, D-18; FR-IV-004 (movement PRODUCTION)
- **Acceptance Criteria:** AC-PD-001, AC-PD-002, AC-PD-003, AC-PD-004, AC-IV-001
- **Dependensi:** BL-001, BL-002 (variasi produk aktif)
- **Ringkasan:** Pencatatan hasil produksi aktual per batch dan per varian, nomor batch human-readable, serta konversi batch final menjadi stock movement masuk ke Owner Stock.
- **Tasks:** BL-005-01 .. BL-005-13
- **Catatan / gap:**
  - **Blocker:** proyek tidak lolos `tsc --noEmit` (13 error) dan 1 suite test gagal; lihat BL-005-01 dan BL-005-03.
  - Konflik requirement terbuka: prefix nomor batch implementasi `BT-` vs keputusan `BATCH-` (D-08) → BL-017-01.
  - `production_batches.status` (DRAFT/FINAL) tidak ada pada `05-Data-Model.md` §8 dan D-10 hanya menyebut status tersimpan pada `delivery_plans` dan `deliveries` → BL-017-02.
  - Bentuk tabel `stock_movements` menyimpang dari `05-Data-Model.md` §25 (lihat BL-017-03 dan BL-015-03).

## BL-006 — Inventory

- **Tipe:** FEATURE
- **Status:** NOT_STARTED
- **Prioritas:** P1
- **Requirements:** FR-IV-001..FR-IV-011; BR-IV-001..BR-IV-009; BR-LS-001..BR-LS-003; `05-Data-Model.md` §25 s.d. §30; D-14a, D-17; FR-CR-003
- **Acceptance Criteria:** AC-IV-002..AC-IV-006, AC-AD-001, AC-AD-002, AC-AD-003, AC-CR-001, AC-CR-002
- **Dependensi:** BL-005 (movement PRODUCTION tersedia)
- **Ringkasan:** Saldo stok Owner & Agent yang **diturunkan** dari stock movement (bukan saldo yang dapat diedit), histori movement, stock adjustment dengan alasan wajib, indikator low stock, dan pencegahan stok negatif.
- **Tasks:** BL-006-01 .. BL-006-06
- **Catatan / gap:** Bentuk final tabel `stock_movements` menunggu keputusan BL-017-03.

## BL-007 — Delivery Planning

- **Tipe:** FEATURE
- **Status:** NOT_STARTED
- **Prioritas:** P1
- **Requirements:** FR-DP-001..FR-DP-007; BR-DP-001..BR-DP-008; `05-Data-Model.md` §10, §11; `04-UX-Flows.md` §6, §8; D-02, D-10, D-16
- **Acceptance Criteria:** AC-DP-001, AC-DP-002
- **Dependensi:** BL-003, BL-006
- **Ringkasan:** Delivery Plan wajib (D-02) dengan UX "Plan Cepat" satu layar, planned quantity manual (tanpa rekomendasi otomatis), status `ACTIVE`/`COMPLETED` sebagai satu-satunya status tersimpan pada perencanaan (D-10).
- **Tasks:** BL-007-01 .. BL-007-05
- **Catatan / gap:** Delivery cancellation tetap `OPEN`/di luar MVP.

## BL-008 — Delivery Confirmation

- **Tipe:** FEATURE
- **Status:** NOT_STARTED
- **Prioritas:** P1
- **Requirements:** FR-DC-001..FR-DC-007; BR-DC-001..BR-DC-006; `05-Data-Model.md` §12, §13; D-02, D-07, D-10
- **Acceptance Criteria:** AC-DC-001, AC-DC-002, AC-DC-003, AC-IV-002, AC-IV-003
- **Dependensi:** BL-007
- **Ringkasan:** Konfirmasi delivery aktual (planned ≠ actual), movement `DELIVERY` Owner → Agent, histori delivery, penolakan bila stok Owner tidak cukup, dan konfirmasi bahwa delivery bukan penjualan.
- **Tasks:** BL-008-01 .. BL-008-06
- **Catatan / gap:** Koreksi delivery hanya melalui movement pembalik dan hanya sebelum ada Sales Confirmation (D-07, AC-CR-002).

## BL-009 — Sales Confirmation & Reconciliation

- **Tipe:** FEATURE
- **Status:** NOT_STARTED
- **Prioritas:** P1
- **Requirements:** FR-SC-001..FR-SC-004, FR-RC-001..FR-RC-008; BR-SC-001..BR-SC-005, BR-RC-001..BR-RC-008; `05-Data-Model.md` §14 s.d. §17; `04-UX-Flows.md` §9 s.d. §14; D-18
- **Acceptance Criteria:** AC-SC-001, AC-SC-002, AC-SC-003, AC-RC-001..AC-RC-006, AC-IV-004, AC-IV-005
- **Dependensi:** BL-008
- **Ringkasan:** Konfirmasi HABIS (Sold = actual delivered, tanpa input manual) dan TIDAK HABIS (reconciliation fisik: Sold = Delivered − Returned), penciptaan movement `SOLD`/`RETURN` pada waktu yang ditetapkan D-18, serta pemblokiran settlement sebelum reconciliation selesai.
- **Tasks:** BL-009-01 .. BL-009-06
- **Catatan / gap:** Semua barang return masuk owner stock; barang tidak layak dicatat terpisah sebagai `WASTE` (D-17).

## BL-010 — Settlement & Invoice

- **Tipe:** FEATURE
- **Status:** NOT_STARTED
- **Prioritas:** P1
- **Requirements:** FR-ST-001..FR-ST-009, FR-IN-001..FR-IN-009; BR-ST-001..BR-ST-0xx, BR-IN-001..BR-IN-008; `05-Data-Model.md` §18 s.d. §22; `04-UX-Flows.md` §15 s.d. §17; D-03, D-04b, D-08, D-10, D-19
- **Acceptance Criteria:** AC-ST-001..AC-ST-006, AC-IN-001..AC-IN-005, AC-IN-006, AC-AG-004 (snapshot fee), AC-BP-003 (snapshot bisnis), AC-PR-004 (harga historis), AC-PY-007
- **Dependensi:** BL-009
- **Ringkasan:** Settlement dari sold quantity dengan snapshot harga jual & fee agent, invoice dengan nomor `{invoice_prefix}-YYYYMMDD-NNN`, snapshot identitas bisnis, diskon manual (D-04b/D-19), PDF, dan share Android.
- **Tasks:** BL-010-01 .. BL-010-08
- **Catatan / gap:** Ekspor file laporan tetap `OPEN`; invoice cancellation di luar MVP.

## BL-011 — Payment & Outstanding

- **Tipe:** FEATURE
- **Status:** NOT_STARTED
- **Prioritas:** P1
- **Requirements:** FR-PY-001..FR-PY-013; BR-PY-001..BR-PY-012; `05-Data-Model.md` §23, §24, §24A; D-03, D-04, D-05
- **Acceptance Criteria:** AC-PY-001..AC-PY-006, AC-PY-008, AC-PY-009
- **Dependensi:** BL-010
- **Ringkasan:** Pencatatan pembayaran (banyak pembayaran per settlement, tanpa unique constraint), outstanding & status lunas **diturunkan** dari total pembayaran, metode pembayaran `CASH/TRANSFER/QRIS/OTHER`, dan outstanding tidak memblokir delivery berikutnya.
- **Tasks:** BL-011-01 .. BL-011-04
- **Catatan / gap:** **Kredit agent (D-04, `05-Data-Model.md` §24A) berstatus `DEFERRED DESIGN`** — memerlukan sesi desain sebelum BL-011 dapat dinyatakan lengkap.

## BL-012 — Operational Task & Dashboard

- **Tipe:** FEATURE
- **Status:** NOT_STARTED
- **Prioritas:** P2
- **Requirements:** FR-TK-001..FR-TK-006, FR-DB-001..FR-DB-009; BR-TK-001..BR-TK-006, BR-DB-001..BR-DB-003; `05-Data-Model.md` §31, §32; D-06
- **Acceptance Criteria:** AC-TK-001..AC-TK-004, AC-DB-001..AC-DB-003
- **Dependensi:** BL-008, BL-009, BL-011
- **Ringkasan:** Task operasional **sepenuhnya derived** dari kondisi transaksi (tanpa tabel task, D-06) dan dashboard yang hanya menampilkan ringkasan dari data transaksi.
- **Tasks:** BL-012-01 .. BL-012-03
- **Catatan / gap:** Dashboard saat ini masih placeholder bernilai 0 (`BL-001-09`) dan wajib diganti data transaksi pada item ini.

## BL-013 — Reports, Search & History

- **Tipe:** FEATURE
- **Status:** NOT_STARTED
- **Prioritas:** P2
- **Requirements:** FR-RP-001..FR-RP-007, FR-SR-001..FR-SR-004; BR-RP-001..BR-RP-005; `04-UX-Flows.md` §31 s.d. §35
- **Acceptance Criteria:** AC-RP-001..AC-RP-004, AC-SR-001..AC-SR-004
- **Dependensi:** BL-009, BL-011
- **Ringkasan:** Laporan produk/agent/inventory berbasis transaksi historis dengan filter tanggal/agent/produk, pencarian transaksi, dan navigasi dari hasil pencarian ke sumber transaksinya.
- **Tasks:** BL-013-01 .. BL-013-03
- **Catatan / gap:** Pencarian produk & agent pada daftar master sudah ada (BL-002-04, BL-003-04), tetapi belum diverifikasi dan belum mencakup data transaksi.

## BL-014 — Backup, Restore & Hardening

- **Tipe:** FEATURE
- **Status:** NOT_STARTED
- **Prioritas:** P2
- **Requirements:** FR-BK-001..FR-BK-010, FR-CR-001..FR-CR-005; BR-BK-001..BR-BK-009, BR-OF-001..BR-OF-006, BR-DI-004, BR-DI-005; D-07, D-12, D-13, D-14b
- **Acceptance Criteria:** AC-BK-005, AC-BK-006, AC-BK-007, AC-CR-001, AC-CR-002, AC-DI-005, AC-ERR-001..AC-ERR-007
- **Dependensi:** seluruh modul transaksi (BL-005 s.d. BL-011)
- **Ringkasan:** Backup lokal (selalu tersedia offline) + Google Drive opsional, auto backup bila > 7 hari saat aplikasi dibuka, restore in-app dengan validasi + safety backup, serta koreksi terkendali melalui movement pembalik.
- **Tasks:** BL-014-01 .. BL-014-05
- **Catatan / gap:** Backup bukan sinkronisasi (BR-OF-006); restore langsung dari Google Drive tetap `OPEN`.

## BL-015 — Architecture & data-model alignment

- **Tipe:** MIGRATION
- **Status:** IN_PROGRESS
- **Prioritas:** P0
- **Requirements:** `AGENTS.md` §15, §18, §19, §22; `08-Technical-Architecture.md` §3, §11; `05-Data-Model.md` §25 s.d. §30, §38
- **Acceptance Criteria:** AC-DI-001, AC-DI-002 (historikal), AC-FU-001/AC-FU-002 (future-ready)
- **Dependensi:** BL-017 (keputusan requirement) untuk BL-015-03 dan BL-015-04
- **Ringkasan:** Menjaga batas layer dan bentuk skema tetap konsisten dengan data model yang disetujui, tanpa menulis ulang kode yang sudah benar.
- **Tasks:** BL-015-01 .. BL-015-04
- **Perubahan yang dinilai `NO_ACTION` (tidak dibuatkan task):**
  - `src/ui/providers/AppProvider.tsx` mengimpor `expo-sqlite` sebagai composition root. Secara layer ideal pembukaan koneksi berada di luar `src/ui`, tetapi praktik ini masih dalam batas composition root dan tidak menimbulkan masalah nyata. Cukup dicatat.
  - Komentar kode yang menyebut nomor §`AGENTS.md` lama: dampaknya hanya dokumentasi (lihat BL-016-02), bukan arsitektur.

## BL-016 — Sinkronisasi dokumentasi

- **Tipe:** DOCUMENTATION
- **Status:** IN_PROGRESS
- **Prioritas:** P1
- **Requirements:** `AGENTS.md` §9, §13, §35
- **Acceptance Criteria:** —
- **Dependensi:** —
- **Ringkasan:** Menyelaraskan artefak manajemen kerja dan referensi dokumentasi dengan `AGENTS.md` versi baru, serta membuat jejak traceability yang dapat ditelusuri.
- **Tasks:** BL-016-01 .. BL-016-06
- **Catatan / gap:** Sebelum reconciliation tidak ada `BACKLOG.md`, `TASK.md`, maupun `task/`; implementasi Fase 0-1/2 berjalan tanpa lapisan manajemen kerja (BL-016-01).

## BL-017 — Requirement review item terbuka

- **Tipe:** REQUIREMENT_REVIEW
- **Status:** NOT_STARTED
- **Prioritas:** P0
- **Requirements:** `AGENTS.md` §2, §14, §37; `docs/09-Decision-Log.md`
- **Acceptance Criteria:** —
- **Dependensi:** —
- **Ringkasan:** Item yang **tidak boleh diputuskan oleh agent** dan harus dikonfirmasi manusia sebelum implementasi lanjut, karena implementasi yang ada berbeda dari requirement/keputusan yang disetujui.
- **Tasks:** BL-017-01 .. BL-017-04
- **Catatan / gap:** Selama item ini belum diputuskan, BL-005 (Production) dan BL-006 (Inventory) tidak dapat dinyatakan `VERIFIED`.

## BL-018 — Verifikasi end-to-end

- **Tipe:** FEATURE
- **Status:** NOT_STARTED
- **Prioritas:** P1
- **Requirements:** `06-Acceptance-Criteria.md` §25 s.d. §38; `AGENTS.md` §11 (Step 6-7), §12
- **Acceptance Criteria:** AC-APP-001..AC-APP-004, §25 End-to-End Scenario, §29 End-to-End Offline Scenario, §32 Regression Acceptance
- **Dependensi:** seluruh modul
- **Ringkasan:** Menjalankan skenario operasional lengkap pada aplikasi nyata (Expo preview di Android) sebagai quality gate akhir, termasuk kondisi offline dan konsistensi historis.
- **Tasks:** BL-018-01 .. BL-018-03

---

# 5. Technical Debt & Risiko Teridentifikasi

| ID | Temuan | Bukti | Tipe | Task |
| -- | ------ | ----- | ---- | ---- |
| TD-01 | `tsc --noEmit` gagal (13 error) pada working tree: tipe domain produksi merujuk konstanta yang dihapus, `stockMovementRepository` belum ada, `Card` mewajibkan `children` | output `npx tsc --noEmit` 2026-09-22 | BUG | BL-005-01, BL-001-11 |
| TD-02 | 1 suite test gagal (`migrations.test.ts`) karena daftar index belum diperbarui untuk skema v2 | output `npx jest` 2026-09-22 | BUG | BL-005-03 |
| TD-03 | `npx eslint .` 3 error (`react-hooks/set-state-in-effect`) + 5 warning (kode mati di `productionService.ts`) | output `npx eslint .` 2026-09-22 | TECHNICAL_DEBT | BL-001-11, BL-005-01 |
| TD-04 | Konstanta domain (`SALES_RESULTS`, `STOCK_SOURCE_TYPES`, `PAYMENT_METHODS`, `ADJUSTMENT_REASONS`, `TASK_TYPES`, `DELIVERY_PLAN_STATUSES`, `DELIVERY_STATUSES`) hilang dari `src/domain/types.ts` pada working tree, tanpa pengganti dan tanpa referensi yang tersisa | `git diff src/domain/types.ts` | MIGRATION | BL-015-02 |
| TD-05 | Tabel `app_settings` dibuat tetapi tidak dipakai kode mana pun | `grep app_settings src` | TECHNICAL_DEBT | BL-017-04, BL-015-04 |
| TD-06 | Belum ada integration test repository (product, agent, business, user) dan belum ada unit test primitif validasi (`positiveInteger`, `isoDate`, `optionalEmail`) | daftar 5 file test di `src/**` | TECHNICAL_DEBT | BL-002-07, BL-003-07, BL-004-08, BL-001-10 |
| TD-07 | Belum ada bukti Expo preview sama sekali (`.expo/` hanya cache lokal; tidak ada catatan/screenshot) | struktur repo; tidak ada berkas bukti | VERIFICATION | BL-002-08, BL-003-08, BL-004-09, BL-005-13, BL-018-01 |
| TD-08 | Komentar kode menyebut nomor §`AGENTS.md` versi lama (mis. §14, §17, §23, §24, §31, §34, §42) | `grep -rn 'AGENTS.md §' src` | DOCUMENTATION | BL-016-02 |
| TD-09 | `git status` menunjukkan pekerjaan Fase 1-2 belum di-commit (30+ berkas untracked) pada branch `feat/fase-1-data-layer` | `git status --short` | TECHNICAL_DEBT | dicatat sebagai risiko (lihat §6) |

# 6. Catatan Reconciliation

- Reconciliation dilakukan pada **2026-09-22** terhadap commit `8a8cf86` (branch `feat/fase-1-data-layer`) **beserta working tree yang belum di-commit**; status task mencerminkan kondisi working tree, bukan hanya commit terakhir.
- Tidak ada `BACKLOG.md`, `TASK.md`, atau `task/` sebelum sesi ini, sehingga tidak ada backlog lama yang perlu ditandai `OBSOLETE` atau dihapus.
- Status setiap task ditetapkan dari bukti yang dapat diperiksa di repository (berkas, output `tsc`/`jest`/`eslint`, pemeriksaan `grep`). Bila bukti test atau preview tidak tersedia, dicatat `UNKNOWN` — bukan diasumsikan berhasil.
- **Tidak ada perubahan kode aplikasi, skema database, atau dependency** yang dilakukan pada sesi reconciliation ini.

# 7. Change Log

| Version | Tanggal | Perubahan |
| ------- | ------- | --------- |
| 1.0 | 2026-09-22 | Pembuatan awal `BACKLOG.md` melalui *Project Development State Reconciliation* setelah `AGENTS.md` diperbarui (BL-001 s.d. BL-018, 112 task) |
