# 09-Decision-Log.md

**Version:** 1.0
**Status:** Confirmed
**Last Updated:** 2026-09-20
**Related Documents:**

- `00-Baseline.md`
- `01-PRD.md` v1.0
- `02-Business-Rules.md` v1.0
- `03-Functional-Requirements.md` v1.0
- `04-UX-Flows.md` v1.0
- `05-Data-Model.md` v1.0
- `06-Acceptance-Criteria.md`
- `08-Technical-Architecture.md` v0.2

---

# 1. Purpose

Dokumen ini mencatat keputusan atas hal-hal yang sebelumnya berstatus `OPEN`, `PROPOSED`, atau yang saling bertentangan antar dokumen.

Tujuan:

- mencegah implementasi menebak business rule;
- menjaga rantai `Requirements → Design → Implementation → Tests`;
- menyediakan jejak keputusan (decision traceability).

Dokumen ini **tidak menggantikan** dokumen requirement. Keputusan di sini menjadi acuan untuk menyinkronkan dokumen terkait.

---

# 2. Convention

Format keputusan: `D-[NUMBER]`.

Status:

- `CONFIRMED` — telah disepakati;
- `DEFERRED DESIGN` — arah sudah disetujui, detail desain dibahas saat fitur dikerjakan;
- `OPEN` — masih membutuhkan keputusan bisnis.

Bila dokumen saling bertentangan, keputusan pada dokumen ini yang berlaku sampai dokumen terkait diperbarui (`AGENTS.md` §2).

---

# 3. Decision Summary

| ID | Topic | Keputusan | Status |
| -- | ----- | --------- | ------ |
| D-01 | Role & permission | Konflik `00-Baseline` §7 vs `02-BR-US-002`: MVP **tanpa pemisahan role/gating UI**. Kolom `users.role` tetap disiapkan (default `OWNER_ADMIN`, belum dipakai) untuk kesiapan future multi-user | CONFIRMED |
| D-02 | Delivery Plan | Delivery **wajib** memiliki Delivery Plan (satu model data, `delivery_plan_id` NOT NULL). UX menyediakan **"Plan Cepat"** (satu layar) agar langkah lapangan tetap minimal | CONFIRMED |
| D-03 | Partial payment | Pembayaran boleh **kurang** dari kewajiban (partial/underpayment). UI mencatat pembayaran ≤ payable. Skema mendukung banyak pembayaran per settlement (**tanpa unique constraint**) | CONFIRMED |
| D-04 | Overpayment | Overpayment **diizinkan** dan dicatat sebagai **kredit agen**. Entitas & aturan kredit dibahas saat fitur dikerjakan | DEFERRED DESIGN |
| D-04b | Diskon invoice | Invoice memiliki `discount_amount` (integer, default 0, **input manual petugas**) untuk kasus pembulatan ke bawah (mis. Rp56.300 dibayar Rp56.000, Rp300 = diskon). `Payable = Net Settlement − Diskon` | CONFIRMED |
| D-05 | Payment method | Metode pembayaran dicatat: `CASH`, `TRANSFER`, `QRIS`, `OTHER`. Tidak memengaruhi kalkulasi finansial | CONFIRMED |
| D-06 | Operational Task | Task **sepenuhnya derived** dari kondisi transaksi (tanpa tabel task) | CONFIRMED |
| D-07 | Koreksi transaksi | Koreksi hanya melalui **stock movement pembalik** (`source_type = CORRECTION`) dan hanya **sebelum** ada Sales Confirmation / Reconciliation / Settlement. Histori tidak pernah diedit atau dihapus | CONFIRMED |
| D-08 | Nomor dokumen | Nomor human-readable per hari: `{invoice_prefix}-YYYYMMDD-NNN` dan `BATCH-YYYYMMDD-NNN`, dihasilkan di dalam transaksi database | CONFIRMED |
| D-09 | ID internal | **UUID v4** (`expo-crypto.randomUUID`), independen dari urutan record lokal | CONFIRMED |
| D-10 | Status transaksi | Hybrid: `status` disimpan hanya pada `delivery_plans` (`ACTIVE`/`COMPLETED`) dan `deliveries` (`CONFIRMED`); status reconciliation & settlement **diturunkan** dari data | CONFIRMED |
| D-11 | Authentication | MVP **tanpa authentication**; operasi inti tidak boleh bergantung pada akun atau internet | CONFIRMED |
| D-12 | Backup & Restore | Backup lokal selalu tersedia (offline) + Google Drive opsional; **restore in-app** disediakan dengan mekanisme pengamanan, diimplementasikan pada fase akhir MVP | CONFIRMED |
| D-13 | Deaktivasi master | Product/Agent dapat dinonaktifkan kapan saja; hanya tidak dapat dipakai untuk transaksi baru. Sistem menampilkan **peringatan informatif** (stok di agen / outstanding) tanpa memblokir | CONFIRMED |
| D-14a | Insulated box | **Tidak dilacak** di sistem pada MVP (hanya aktivitas fisik) | CONFIRMED |
| D-14b | Automatic backup | Automatic backup dijalankan saat aplikasi dibuka apabila backup terakhir **> 7 hari** dan akun Google tersedia. Kegagalan tidak mengganggu operasi | CONFIRMED |
| D-15 | Business Profile | Tambah field opsional: `legal_name`, `tax_id` (NPWP), `invoice_prefix` (default `INV`); dipakai pada penomoran dan tampilan invoice | CONFIRMED |
| D-16 | Jadwal kunjungan | MVP **tanpa jadwal kunjungan** per agent; Delivery Plan dibuat manual harian. Dashboard mengutamakan kondisi transaksi | CONFIRMED |
| D-17 | Kelayakan return | Semua barang return masuk **owner stock**; barang tidak layak dicatat **terpisah** sebagai `ADJUSTMENT` WASTE dengan alasan. Reconciliation hanya mencatat jumlah return | CONFIRMED |
| D-18 | Timing movement | HABIS → `SOLD` dibuat saat Sales Confirmation; TIDAK_HABIS → `SOLD` + `RETURN` dibuat saat Reconciliation selesai | CONFIRMED |
| D-19 | Diskon pada invoice | Diskon ditampilkan sebagai baris terpisah pada invoice/PDF dengan Total Tagihan setelah diskon; `settlement.net_amount` tetap menjadi dasar laporan | CONFIRMED |

---

# 4. Detail Keputusan

## 4.1 D-02 — Delivery Plan wajib + UX "Plan Cepat"

- Setiap Delivery memiliki Delivery Plan. Tidak ada jalur operasional yang melewati planning pada level data.
- UX menyediakan **Plan Cepat**: satu layar untuk memilih Agent dan mengisi planned quantity, lalu melanjutkan ke input actual quantity dan konfirmasi.
- Planned quantity tetap disimpan dan tetap dibedakan dari actual quantity (`BR-DC-003`).

## 4.2 D-03 / D-04b — Kewajiban, diskon, dan outstanding

Definisi finansial yang berlaku:

```text
Net Settlement = Gross Sales - Agent Fee        (pada Settlement)

Discount       = diskon manual pada Invoice     (input petugas)

Payable        = Net Settlement - Discount

Outstanding    = Payable - Σ Pembayaran valid
```

- Settlement berstatus **PAID** apabila `Outstanding <= 0`.
- Pembayaran boleh **kurang** dari `Payable` (partial/underpayment). Status tetap outstanding hingga terpenuhi.
- Diskon **tidak** mengubah `settlement.net_amount` dan **bukan** bagian dari agent fee.
- Sistem tidak menghitung diskon secara otomatis; nilainya diisi manual oleh petugas.

## 4.3 D-04 — Kredit Agen (DEFERRED DESIGN)

- Arah keputusan: kelebihan pembayaran (overpayment) menjadi **saldo kredit Agent**, bukan diabaikan dan bukan pendapatan.
- Entitas kredit akan ditambahkan sebagai ledger terpisah. Nama entitas, kolom, dan aturan pemakaian kredit (apakah otomatis memotong kewajiban berikutnya atau hanya ditampilkan) **dibahas pada sesi desain Fase 6B**.
- Sebelum Fase 6B diimplementasikan, input pembayaran yang melebihi `Payable` ditolak dengan pesan bahwa penanganan kredit Agent belum diaktifkan.

## 4.4 D-07 — Koreksi transaksi

- Koreksi hanya tersedia **sebelum** transaksi memiliki turunan:
  - Production: boleh selama owner stock hasil pembalikan tidak menjadi negatif (`BR-IV-008`).
  - Delivery: hanya bila belum ada Sales Confirmation, Reconciliation, atau Settlement.
- Mekanisme: dibuat **stock movement pembalik** dengan `movement_type = ADJUSTMENT`, `source_type = CORRECTION`, `source_id` menunjuk transaksi asal, dan **reason wajib**.
- Transaksi asal tidak diedit dan tidak dihapus; hanya ditandai sudah dikoreksi (satu koreksi per transaksi).
- Koreksi terhadap transaksi yang sudah memiliki turunan belum diizinkan dan tetap `OPEN`.

## 4.5 D-10 — Nilai status yang digunakan

| Entitas | Status | Sumber |
| ------- | ------ | ------ |
| `delivery_plans` | `ACTIVE` → `COMPLETED` (saat delivery dikonfirmasi) | kolom `status` |
| `deliveries` | `CONFIRMED` | kolom `status` |
| Reconciliation | belum dilakukan / selesai | **derived** dari keberadaan record + item |
| Settlement | `OUTSTANDING` / `PAID` | **derived** dari `Payable - Σ Pembayaran` |

Tidak ada status `CANCELLED`, `VOID`, atau `DRAFT` pada MVP.

## 4.6 D-12 / D-14b — Backup dan Restore

- **Backup** menghasilkan salinan database yang konsisten (SQLite `VACUUM INTO`), disimpan lokal dan/atau diunggah ke Google Drive. `last_backup_at` diperbarui hanya bila backup berhasil.
- **Auto backup:** saat aplikasi dibuka, bila `last_backup_at` belum ada atau lebih tua dari 7 hari **dan** akun Google tersedia, backup dijalankan secara senyap. Kegagalan tidak boleh mengganggu atau memblokir operasi.
- **Restore (fase akhir MVP):** pilih file backup → validasi (header SQLite, `user_version` kompatibel, tabel inti tersedia) → safety backup database aktif → replace → reload aplikasi.
- Validasi gagal berarti **tidak ada perubahan** pada database aktif (`BR-BK-007`, `BR-BK-008`, `BR-BK-009`).
- Restore tidak pernah berjalan otomatis atau diam-diam.
- Backup **bukan** synchronization (`BR-OF-006`).

## 4.7 D-13 — Deaktivasi Product/Agent

- Product/Agent dapat dinonaktifkan kapan saja.
- Yang nonaktif tidak muncul sebagai pilihan pada transaksi baru; histori tetap utuh dan tetap dapat dibuka.
- Sistem menampilkan peringatan informatif bila Agent masih menyimpan stok, masih memiliki outstanding, atau Product masih memiliki stok. Peringatan tidak memblokir aksi.

## 4.8 D-15 — Business Profile

- Field yang sudah diketahui tetap: `name`, `address`, `phone`, `email`, `logo`.
- Field opsional yang ditambahkan: `legal_name`, `tax_id` (NPWP), `invoice_prefix` (default `INV`).
- `invoice_prefix` dipakai pada penomoran invoice (D-08).
- Bila `tax_id` diisi, nilai tersebut ikut disimpan sebagai snapshot pada invoice.

## 4.9 D-17 — Barang Return

- Seluruh barang return dicatat sebagai movement `RETURN` (Agent Stock → Owner Stock) tanpa penilaian kelayakan.
- Barang yang tidak layak dipakai dicatat **terpisah** sebagai movement `WASTE` dengan alasan, di luar form reconciliation.

## 4.10 D-18 — Timing stock movement

| Kondisi | Movement yang dibuat | Waktu |
| ------- | -------------------- | ----- |
| HABIS | `SOLD` sebesar actual delivered | saat Sales Confirmation |
| TIDAK HABIS | `RETURN` sebesar returned dan `SOLD` sebesar sold | saat Reconciliation selesai |

Agent stock setelah proses harus konsisten dengan seluruh movement (`INV-007`).

## 4.11 D-19 — Diskon pada dokumen invoice

Invoice dan PDF menampilkan:

```text
Gross Sales
Agent Fee
Net Settlement
Discount
Total Tagihan (Payable)
```

Diskon diisi manual, tidak dihitung otomatis, dan tidak mengubah nilai settlement historis.

---

# 5. Item yang Tetap Terbuka

| Item | Status | Catatan |
| ---- | ------ | ------- |
| Aturan pemakaian kredit Agent | DEFERRED DESIGN | Dibahas sebelum Fase 6B |
| Restore langsung dari Google Drive | OPEN | MVP restore dari file backup lokal |
| Delivery cancellation | OPEN | Tidak diwajibkan MVP |
| Kelayakan return sebagai field data | OPEN | D-17 menetapkan pencatatan terpisah via WASTE |
| Export file laporan | OPEN | Requirement hanya menyebut filter laporan |
| Notifikasi/reminder | OPEN | Auto backup berjalan senyap tanpa notifikasi |
| Draft transaksi | CONFIRMED (tidak ada) | Lihat asumsi pada bagian 6 |

---

# 6. Asumsi Implementasi

1. Tidak ada konsep draft transaksi: transaksi tersimpan saat dikonfirmasi. Satu-satunya record tersimpan pra-final adalah Delivery Plan berstatus `ACTIVE`.
2. Nilai uang direpresentasikan sebagai integer rupiah; quantity sebagai integer.
3. Tanggal disimpan sebagai string ISO-8601 (tanggal: `YYYY-MM-DD`, waktu: ISO-8601 lengkap).
4. Satu Business dan satu User operasional per device.
5. Bahasa antarmuka: Indonesia; mata uang tunggal: IDR.
6. Local database: SQLite melalui `expo-sqlite`; akses hanya melalui repository.
7. Android-first; iOS tidak diverifikasi pada MVP.

---

# 7. Dampak ke Dokumen

| Dokumen | Perubahan |
| ------- | --------- |
| `00-Baseline.md` | §7 role ditandai sebagai future direction; §39 Open Areas diperbarui |
| `02-Business-Rules.md` | BR-PY-008/009/010 → CONFIRMED; BR-PY-011/012 baru; BR-BK-009, BR-DI-005, BR-PR-006, BR-AG-002 diperjelas; §26 diperbarui |
| `03-Functional-Requirements.md` | FR-US-004/005, FR-PY-009/010/011, FR-BK-008 diperbarui; FR-PY-012/013, FR-BK-009/010, FR-IN-009 baru; §27 diperbarui |
| `04-UX-Flows.md` | Bab 8 (same-day delivery), §38 restore, §52 Open UX Decisions diperbarui |
| `05-Data-Model.md` | Business, User, Invoice, Payment diperbarui; §23A Agent Credit (placeholder); §56 diperbarui |
| `06-Acceptance-Criteria.md` | §36 diperbarui; bagian 39 baru berisi AC tambahan |

---

# 8. Change Log

| Version | Date | Perubahan |
| ------- | ---- | --------- |
| 1.0 | 2026-09-20 | Keputusan awal D-01 s.d. D-19 (role, delivery plan, payment, diskon, kredit agen, koreksi, backup/restore, deaktivasi, business profile, return, timing movement) |
