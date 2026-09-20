# 03-Functional-Requirements.md

**Version:** 1.0
**Status:** Confirmed
**Last Updated:** 2026-09-19
**Related Documents:**

- `01-PRD.md` v1.0
- `02-Business-Rules.md` v1.0

---

## 1. Purpose

Dokumen ini mendefinisikan kebutuhan fungsional aplikasi Distribusi Konsinyasi.

Functional Requirements menjelaskan **kemampuan yang harus disediakan oleh sistem** untuk mendukung proses bisnis yang telah ditetapkan pada PRD dan Business Rules.

Dokumen ini menjadi dasar untuk:

- UX Flow
- Data Model
- Acceptance Criteria
- Implementasi aplikasi
- Pengujian fungsional

Dokumen ini tidak menentukan detail implementasi teknis seperti framework Android, struktur class, library, atau teknologi database.

---

# 2. Functional Requirement Convention

Setiap requirement menggunakan format:

`FR-[MODULE]-[NUMBER]`

Status:

- **MUST** — wajib tersedia dalam MVP
- **SHOULD** — sebaiknya tersedia jika tidak menambah kompleksitas berarti
- **OPEN** — masih membutuhkan keputusan
- **DEFERRED** — ditunda di luar MVP

---

# 3. Application & General

## FR-APP-001 — Application Startup

**Priority:** MUST

Sistem harus dapat membuka aplikasi dan menampilkan kondisi operasional utama tanpa membutuhkan koneksi internet.

## FR-APP-002 — Offline Operation

**Priority:** MUST

Sistem harus dapat menjalankan seluruh fungsi operasional inti tanpa koneksi internet.

Fungsi inti meliputi:

- Product & Variant
- Agent
- Production
- Inventory
- Delivery Planning
- Delivery Confirmation
- Sales Confirmation
- Reconciliation
- Settlement
- Invoice generation
- Payment
- Operational Tasks
- Dashboard
- Reports

## FR-APP-003 — Local Persistence

**Priority:** MUST

Setiap transaksi yang berhasil disimpan harus tetap tersedia setelah aplikasi ditutup dan dibuka kembali.

## FR-APP-004 — Validation

**Priority:** MUST

Sistem harus melakukan validasi terhadap data sebelum transaksi disimpan.

## FR-APP-005 — Transaction Integrity

**Priority:** MUST

Operasi yang memengaruhi beberapa data terkait harus disimpan secara konsisten.

Kegagalan penyimpanan tidak boleh menghasilkan kondisi data setengah tersimpan.

---

# 4. Business Profile

## FR-BP-001 — View Business Profile

**Priority:** MUST

Pengguna dapat melihat informasi bisnis.

Informasi minimal meliputi:

- Business ID
- Nama bisnis
- Alamat
- Nomor telepon
- Email
- Logo jika tersedia

## FR-BP-002 — Edit Business Profile

**Priority:** MUST

Pengguna dapat mengubah informasi Business Profile.

## FR-BP-003 — Historical Business Snapshot

**Priority:** MUST

Sistem harus dapat menyimpan informasi bisnis yang relevan sebagai snapshot ketika digunakan pada dokumen historis seperti invoice.

Perubahan Business Profile di masa depan tidak boleh mengubah informasi historis.

---

# 5. User Profile & Authentication

## FR-US-001 — User Profile

**Priority:** MUST

Sistem harus memiliki User Profile minimal dengan:

- User ID
- Nama
- Email
- Informasi profil yang relevan

## FR-US-002 — View User Profile

**Priority:** MUST

Pengguna dapat melihat informasi profilnya.

## FR-US-003 — Edit User Profile

**Priority:** MUST

Pengguna dapat mengubah informasi profil yang diperbolehkan.

## FR-US-004 — Authentication

**Priority:** DEFERRED

MVP tidak menyediakan authentication. Seluruh fungsi operasional harus tetap dapat dilakukan tanpa login.

Authentication tidak boleh menjadi dependency untuk operasi offline inti.

Dasar keputusan: `D-11` (`09-Decision-Log.md`).

## FR-US-005 — Google Account

**Priority:** SHOULD

Sistem dapat menghubungkan Google Account untuk kebutuhan Google Drive Backup.

Tidak adanya Google Account tidak boleh menghalangi operasi lokal.

Dasar keputusan: `D-12` (`09-Decision-Log.md`).

---

# 6. Product & Variant

## FR-PR-001 — Product List

**Priority:** MUST

Sistem harus menampilkan daftar Product/Variant yang tersedia.

## FR-PR-002 — Add Product/Variant

**Priority:** MUST

Pengguna dapat menambahkan Product/Variant baru.

Minimal informasi:

- ID
- Nama
- Harga jual
- Deskripsi opsional
- Status aktif/nonaktif

## FR-PR-003 — Edit Product/Variant

**Priority:** MUST

Pengguna dapat mengubah informasi Product/Variant yang masih dapat diubah.

## FR-PR-004 — Deactivate Product/Variant

**Priority:** MUST

Pengguna dapat menonaktifkan Product/Variant.

Product/Variant yang tidak aktif tidak boleh digunakan untuk transaksi baru tetapi histori transaksi tetap tersedia.

## FR-PR-005 — Product Price

**Priority:** MUST

Sistem harus menggunakan harga jual Product/Variant pada saat transaksi.

## FR-PR-006 — Historical Price

**Priority:** MUST

Harga yang digunakan pada transaksi historis harus disimpan sebagai snapshot.

Perubahan harga Product/Variant tidak boleh mengubah transaksi lama.

## FR-PR-007 — Product Detail

**Priority:** SHOULD

Pengguna dapat melihat informasi detail Product/Variant termasuk informasi historis yang relevan.

---

# 7. Agent

## FR-AG-001 — Agent List

**Priority:** MUST

Sistem harus menampilkan daftar Agent.

## FR-AG-002 — Add Agent

**Priority:** MUST

Pengguna dapat menambahkan Agent.

Informasi minimal dapat meliputi:

- Agent ID
- Nama
- Nomor kontak
- Alamat/lokasi
- Status aktif/nonaktif
- Fee per unit

## FR-AG-003 — Edit Agent

**Priority:** MUST

Pengguna dapat mengubah informasi Agent.

## FR-AG-004 — Activate/Deactivate Agent

**Priority:** MUST

Pengguna dapat mengubah status aktif/nonaktif Agent.

Agent nonaktif tidak dapat digunakan untuk delivery baru tetapi histori tetap tersedia.

## FR-AG-005 — Agent Detail

**Priority:** MUST

Pengguna dapat melihat informasi Agent dan informasi operasional yang relevan.

## FR-AG-006 — Agent Fee

**Priority:** MUST

Sistem harus menyimpan fee per unit untuk Agent.

Fee dapat berbeda antar Agent.

## FR-AG-007 — Historical Agent Fee

**Priority:** MUST

Fee yang digunakan pada settlement harus disimpan sebagai snapshot.

Perubahan fee Agent tidak boleh mengubah settlement historis.

---

# 8. Production

## FR-PD-001 — Create Production Batch

**Priority:** MUST

Pengguna dapat membuat catatan Production Batch.

Setiap batch memiliki identitas unik.

## FR-PD-002 — Record Actual Production

**Priority:** MUST

Pengguna dapat mencatat jumlah produksi aktual untuk setiap Product/Variant dalam batch.

Contoh:

```text
Batch 001
Coklat       41
Strawberry   42
Total        83
```

## FR-PD-003 — Calculate Production Total

**Priority:** MUST

Sistem harus menghitung total produksi berdasarkan jumlah masing-masing Product/Variant.

Pengguna tidak perlu memasukkan total secara manual.

## FR-PD-004 — Production Date/Time

**Priority:** MUST

Sistem harus menyimpan waktu/tanggal produksi.

## FR-PD-005 — Production to Inventory

**Priority:** MUST

Production Batch yang berhasil disimpan harus menghasilkan stock movement masuk ke Owner Stock.

## FR-PD-006 — Production History

**Priority:** MUST

Pengguna dapat melihat histori Production Batch.

## FR-PD-007 — Production Correction

**Priority:** MUST

Jika terdapat kesalahan produksi yang telah dicatat, sistem harus menyediakan mekanisme koreksi yang tetap menjaga histori dan integritas inventory.

Detail mekanisme koreksi ditentukan pada tahap berikutnya.

---

# 9. Inventory

## FR-IV-001 — Inventory Overview

**Priority:** MUST

Sistem harus menampilkan kondisi inventory berdasarkan Product/Variant.

## FR-IV-002 — Owner Stock

**Priority:** MUST

Sistem harus dapat menampilkan jumlah stock yang berada pada Owner.

## FR-IV-003 — Agent Stock

**Priority:** MUST

Sistem harus dapat menampilkan stock yang sedang berada pada Agent berdasarkan delivery yang telah dikonfirmasi.

## FR-IV-004 — Stock Movement

**Priority:** MUST

Sistem harus mencatat pergerakan stock minimal untuk:

- Production
- Delivery
- Sold
- Return
- Waste
- Adjustment

## FR-IV-005 — Stock Movement History

**Priority:** MUST

Pengguna dapat melihat histori pergerakan stock.

## FR-IV-006 — Stock Conservation

**Priority:** MUST

Sistem harus menjaga konsistensi antara jumlah barang masuk, keluar, terjual, kembali, dan adjustment.

## FR-IV-007 — Negative Stock Prevention

**Priority:** MUST

Sistem tidak boleh menghasilkan negative stock melalui transaksi operasional normal.

## FR-IV-008 — Stock Adjustment

**Priority:** MUST

Pengguna dapat melakukan stock adjustment melalui transaksi khusus.

Adjustment harus memiliki alasan.

Alasan minimal:

- Damaged goods
- Melted/unusable
- Production error
- Tester/sample
- Loss
- Stock opname correction

## FR-IV-009 — Low Stock Threshold

**Priority:** MUST

Pengguna dapat menentukan threshold low stock untuk Product/Variant.

## FR-IV-010 — Low Stock Indicator

**Priority:** MUST

Sistem harus menandai Product/Variant sebagai low stock ketika:

`Stock In Hand <= Low Stock Threshold`

## FR-IV-011 — No Direct Stock Editing

**Priority:** MUST

Sistem tidak menyediakan perubahan angka stock secara langsung sebagai pengganti transaksi.

Perubahan stock harus memiliki sumber transaksi yang dapat ditelusuri.

---

# 10. Delivery Planning

## FR-DP-001 — Create Delivery Plan

**Priority:** MUST

Pengguna dapat membuat rencana delivery untuk Agent.

## FR-DP-002 — Select Agent

**Priority:** MUST

Delivery Plan harus memiliki Agent tujuan.

## FR-DP-003 — Select Products

**Priority:** MUST

Pengguna dapat menentukan Product/Variant yang akan dikirim.

## FR-DP-004 — Set Planned Quantity

**Priority:** MUST

Pengguna dapat menentukan jumlah rencana untuk setiap Product/Variant.

Jumlah ditentukan secara manual.

## FR-DP-005 — Delivery Plan List

**Priority:** MUST

Pengguna dapat melihat daftar Delivery Plan.

## FR-DP-006 — Delivery Plan Detail

**Priority:** MUST

Pengguna dapat melihat detail Agent, Product/Variant, dan planned quantity.

## FR-DP-007 — Plan vs Actual

**Priority:** MUST

Sistem harus membedakan Planned Delivery Quantity dengan Actual Delivery Quantity.

Planned quantity tidak otomatis dianggap sebagai barang yang telah dikirim.

---

# 11. Delivery Confirmation

## FR-DC-001 — Confirm Delivery

**Priority:** MUST

Pengguna dapat mengonfirmasi delivery berdasarkan Delivery Plan.

## FR-DC-002 — Record Actual Delivery

**Priority:** MUST

Pengguna dapat mencatat jumlah aktual barang yang benar-benar dikirim.

## FR-DC-003 — Delivery Confirmation Date/Time

**Priority:** MUST

Sistem harus menyimpan waktu/tanggal delivery confirmation.

## FR-DC-004 — Delivery Inventory Movement

**Priority:** MUST

Delivery Confirmation harus menghasilkan stock movement dari Owner Stock ke Agent Stock.

## FR-DC-005 — Actual Delivery as Source

**Priority:** MUST

Actual Delivery menjadi dasar untuk proses Sales Confirmation dan Reconciliation.

## FR-DC-006 — Delivery History

**Priority:** MUST

Pengguna dapat melihat histori delivery.

## FR-DC-007 — Delivery Correction

**Priority:** MUST

Sistem harus menyediakan mekanisme koreksi delivery yang menjaga histori dan konsistensi inventory.

---

# 12. Sales / Daily Confirmation

## FR-SC-001 — Record Sales Result

**Priority:** MUST

Pengguna dapat mencatat hasil penjualan Agent.

Pilihan hasil:

- HABIS
- TIDAK HABIS

## FR-SC-002 — HABIS Confirmation

**Priority:** MUST

Jika hasil adalah HABIS, sistem harus:

- menetapkan sold quantity = actual delivered quantity
- menetapkan return quantity = 0
- tidak meminta physical reconciliation
- memungkinkan proses settlement

## FR-SC-003 — TIDAK HABIS Confirmation

**Priority:** MUST

Jika hasil adalah TIDAK HABIS, sistem harus mengarahkan pengguna ke proses physical reconciliation.

## FR-SC-004 — Sales Confirmation History

**Priority:** MUST

Pengguna dapat melihat histori hasil penjualan Agent.

---

# 13. Reconciliation

## FR-RC-001 — Start Reconciliation

**Priority:** MUST

Pengguna dapat memulai reconciliation untuk delivery dengan status TIDAK HABIS.

## FR-RC-002 — Physical Return Count

**Priority:** MUST

Pengguna dapat mencatat jumlah fisik Product/Variant yang dikembalikan.

## FR-RC-003 — Calculate Sold Quantity

**Priority:** MUST

Sistem harus menghitung:

`Sold = Actual Delivered - Returned`

## FR-RC-004 — Validate Reconciliation

**Priority:** MUST

Sistem harus memastikan:

`Sold + Returned = Actual Delivered`

dan:

`Returned <= Actual Delivered`

## FR-RC-005 — Return Inventory Movement

**Priority:** MUST

Barang yang dikembalikan harus menghasilkan stock movement dari Agent Stock ke Owner Stock.

## FR-RC-006 — Reconciliation Status

**Priority:** MUST

Sistem harus dapat membedakan reconciliation yang:

- belum dilakukan
- sedang diproses
- selesai

Detail status dapat disempurnakan pada UX/Data Model.

## FR-RC-007 — Reconciliation History

**Priority:** MUST

Pengguna dapat melihat histori reconciliation.

## FR-RC-008 — Settlement Dependency

**Priority:** MUST

Settlement untuk transaksi TIDAK HABIS tidak dapat dibuat sebelum reconciliation selesai.

---

# 14. Settlement

## FR-ST-001 — Create Settlement

**Priority:** MUST

Pengguna dapat membuat settlement berdasarkan jumlah Product/Variant yang terjual.

## FR-ST-002 — Calculate Gross Sales

**Priority:** MUST

Sistem menghitung:

`Gross Sales = Sold Quantity × Historical Selling Price`

## FR-ST-003 — Calculate Agent Fee

**Priority:** MUST

Sistem menghitung:

`Agent Fee = Sold Quantity × Historical Agent Fee`

## FR-ST-004 — Calculate Net Settlement

**Priority:** MUST

Sistem menghitung:

`Net Settlement = Gross Sales - Agent Fee`

## FR-ST-005 — Settlement Detail

**Priority:** MUST

Settlement harus menampilkan minimal:

- Agent
- Product/Variant
- Sold quantity
- Selling price
- Gross sales
- Fee per unit
- Total fee
- Net settlement

## FR-ST-006 — Historical Snapshot

**Priority:** MUST

Settlement harus menyimpan snapshot nilai transaksi yang digunakan saat settlement dibuat.

## FR-ST-007 — Settlement History

**Priority:** MUST

Pengguna dapat melihat histori settlement.

## FR-ST-008 — Settlement Status

**Priority:** MUST

Sistem harus dapat mengetahui apakah settlement telah dibayar atau masih outstanding.

## FR-ST-009 — Payment Separation

**Priority:** MUST

Pembuatan settlement tidak otomatis dianggap sebagai payment.

---

# 15. Invoice

## FR-IN-001 — Generate Invoice

**Priority:** MUST

Pengguna dapat membuat invoice berdasarkan settlement.

## FR-IN-002 — Invoice Dependency

**Priority:** MUST

Invoice hanya dapat dibuat berdasarkan settlement yang valid.

## FR-IN-003 — Invoice Number

**Priority:** MUST

Sistem harus menghasilkan nomor invoice yang unik.

## FR-IN-004 — Invoice Snapshot

**Priority:** MUST

Invoice harus mempertahankan informasi transaksi yang digunakan ketika invoice dibuat.

## FR-IN-005 — Business Snapshot

**Priority:** MUST

Invoice harus menggunakan snapshot informasi Business Profile pada saat transaksi/invoice dibuat.

## FR-IN-006 — Generate PDF

**Priority:** MUST

Sistem harus dapat menghasilkan invoice dalam format PDF.

## FR-IN-007 — Share Invoice

**Priority:** MUST

Pengguna dapat membagikan file invoice melalui mekanisme share Android.

## FR-IN-008 — No WhatsApp API Dependency

**Priority:** MUST

Pembuatan dan pembagian invoice tidak bergantung pada WhatsApp API.

## FR-IN-009 — Invoice Discount

**Priority:** MUST

Invoice harus dapat memuat nilai diskon yang diisi manual oleh petugas dan menampilkan total tagihan setelah diskon.

```text
Payable = Net Settlement - Discount
```

Dasar keputusan: `D-04b`, `D-19` (`09-Decision-Log.md`).

---

# 16. Payment

## FR-PY-001 — Record Payment

**Priority:** MUST

Pengguna dapat mencatat pembayaran terhadap settlement.

## FR-PY-002 — Outstanding

**Priority:** MUST

Sistem harus menampilkan settlement yang belum dibayar sebagai outstanding.

## FR-PY-003 — Mark as Paid

**Priority:** MUST

Pengguna dapat mencatat pembayaran penuh dan sistem mengubah status menjadi paid.

## FR-PY-004 — Payment Date

**Priority:** MUST

Sistem harus menyimpan tanggal/waktu pembayaran.

## FR-PY-005 — Payment History

**Priority:** MUST

Pengguna dapat melihat histori pembayaran.

## FR-PY-006 — HABIS Payment

**Priority:** MUST

Settlement dari HABIS dapat dicatat sebagai dibayar pada saat settlement atau pada kunjungan berikutnya.

## FR-PY-007 — TIDAK HABIS Payment

**Priority:** MUST

Settlement TIDAK HABIS dapat dibayar setelah reconciliation dan settlement selesai.

## FR-PY-008 — Outstanding Does Not Block Delivery

**Priority:** MUST

Adanya outstanding tidak secara otomatis mencegah delivery berikutnya.

## FR-PY-009 — Partial Payment

**Priority:** MUST

Sistem harus mendukung pencatatan pembayaran yang lebih kecil dari kewajiban (`Payable`).

Settlement tetap outstanding sampai total pembayaran valid memenuhi kewajiban.

Dasar keputusan: `D-03` (`09-Decision-Log.md`).

## FR-PY-010 — Overpayment

**Priority:** MUST (DEFERRED DESIGN)

Sistem mengarahkan pembayaran melebihi kewajiban menjadi kredit Agent.

Implementasi entitas dan aturan kredit dilakukan setelah desainnya disepakati.

Dasar keputusan: `D-04` (`09-Decision-Log.md`).

## FR-PY-011 — Payment Method

**Priority:** MUST

Sistem harus menyimpan metode pembayaran:

```text
CASH
TRANSFER
QRIS
OTHER
```

Dasar keputusan: `D-05` (`09-Decision-Log.md`).

## FR-PY-012 — Invoice Discount

**Priority:** MUST

Invoice dapat memiliki nilai diskon yang diisi manual oleh petugas.

Sistem menghitung:

`Payable = Net Settlement - Discount`

Outstanding dihitung dari `Payable - Σ Pembayaran valid`.

Dasar keputusan: `D-04b` (`09-Decision-Log.md`).

## FR-PY-013 — Agent Credit Balance

**Priority:** MUST (DEFERRED DESIGN)

Sistem harus dapat merepresentasikan saldo kredit Agent dari kelebihan pembayaran.

Detail implementasi mengikuti hasil desain entitas kredit.

Dasar keputusan: `D-04` (`09-Decision-Log.md`).

---

# 17. Operational Tasks

## FR-TK-001 — Task List

**Priority:** MUST

Sistem harus menampilkan daftar tugas operasional yang perlu dilakukan.

## FR-TK-002 — Delivery Task

**Priority:** MUST

Delivery yang belum dikonfirmasi dapat menghasilkan task.

## FR-TK-003 — Reconciliation Task

**Priority:** MUST

Delivery TIDAK HABIS yang belum direkonsiliasi dapat menghasilkan task.

## FR-TK-004 — Payment Collection Task

**Priority:** MUST

Outstanding yang perlu ditagihkan dapat menghasilkan task.

## FR-TK-005 — Task Completion

**Priority:** MUST

Task harus hilang atau berpindah dari active task setelah kondisi yang mendasarinya selesai.

## FR-TK-006 — Transaction as Source

**Priority:** MUST

Task tidak boleh menjadi sumber utama data transaksi.

Task merupakan tampilan operasional dari kondisi transaksi.

---

# 18. Dashboard

## FR-DB-001 — Dashboard Overview

**Priority:** MUST

Sistem harus menyediakan dashboard yang menampilkan ringkasan kondisi operasional.

## FR-DB-002 — Delivery Summary

**Priority:** MUST

Dashboard menampilkan delivery yang perlu dilakukan.

## FR-DB-003 — Agent Visit Summary

**Priority:** MUST

Dashboard menampilkan Agent yang perlu dikunjungi atau memiliki aktivitas.

## FR-DB-004 — TIDAK HABIS Summary

**Priority:** MUST

Dashboard menampilkan transaksi TIDAK HABIS yang membutuhkan reconciliation.

## FR-DB-005 — Outstanding Summary

**Priority:** MUST

Dashboard menampilkan outstanding yang perlu ditindaklanjuti.

## FR-DB-006 — Inventory Summary

**Priority:** MUST

Dashboard menampilkan informasi stock yang relevan termasuk low stock.

## FR-DB-007 — Production Summary

**Priority:** SHOULD

Dashboard dapat menampilkan ringkasan produksi.

## FR-DB-008 — Sales Summary

**Priority:** SHOULD

Dashboard dapat menampilkan ringkasan penjualan.

## FR-DB-009 — Operational Priority

**Priority:** MUST

Dashboard harus mengutamakan informasi yang menjawab:

> "Hari ini saya harus mengunjungi siapa dan melakukan apa?"

---

# 19. Reports & Analytics

## FR-RP-001 — Product Report

**Priority:** MUST

Sistem harus menyediakan laporan Product/Variant.

Minimal metrik:

- Produced
- Delivered
- Sold
- Returned
- Gross Sales
- Sell-through
- Variant performance

## FR-RP-002 — Agent Report

**Priority:** MUST

Sistem harus menyediakan laporan Agent.

Minimal metrik:

- Delivered
- Sold
- Returned
- Sell-through
- Gross Sales
- Fee
- Net Settlement
- Payment
- Outstanding

## FR-RP-003 — Inventory Report

**Priority:** MUST

Sistem harus menyediakan laporan inventory.

Minimal informasi:

- Production
- Owner Stock
- Agent Stock
- Delivery
- Sold
- Return
- Waste
- Adjustment
- Stock Movement

## FR-RP-004 — Historical Reporting

**Priority:** MUST

Laporan harus menggunakan data transaksi historis dan tidak boleh berubah hanya karena perubahan master data.

## FR-RP-005 — Date Filtering

**Priority:** SHOULD

Pengguna dapat memfilter laporan berdasarkan periode.

## FR-RP-006 — Agent Filtering

**Priority:** SHOULD

Pengguna dapat memfilter laporan berdasarkan Agent.

## FR-RP-007 — Product Filtering

**Priority:** SHOULD

Pengguna dapat memfilter laporan berdasarkan Product/Variant.

---

# 20. Database Backup

## FR-BK-001 — Backup Availability

**Priority:** SHOULD

Sistem menyediakan fitur backup database lokal.

## FR-BK-002 — Google Account Requirement

**Priority:** MUST

Google Account diperlukan untuk melakukan backup ke Google Drive.

## FR-BK-003 — Backup Without Internet

**Priority:** MUST

Operasi bisnis tetap dapat berjalan apabila Google Account atau internet tidak tersedia.

## FR-BK-004 — Manual Backup

**Priority:** SHOULD

Pengguna dapat menjalankan backup secara manual melalui tindakan seperti:

`Backup Now`

## FR-BK-005 — Backup Timestamp

**Priority:** SHOULD

Sistem menyimpan informasi waktu backup terakhir yang berhasil.

## FR-BK-006 — Backup Failure

**Priority:** MUST

Kegagalan backup tidak boleh mengubah atau merusak database lokal.

## FR-BK-007 — Backup Does Not Delete Local Data

**Priority:** MUST

Proses backup tidak boleh menghapus data lokal.

## FR-BK-008 — Restore

**Priority:** MUST

Sistem harus menyediakan restore dari file backup dengan mekanisme yang aman.

Mekanisme minimal:

```text
Pilih file backup
   ↓
Validasi file (format database, versi schema, tabel inti)
   ↓
Safety backup database aktif
   ↓
Replace database
   ↓
Reload aplikasi
```

Validasi yang gagal tidak boleh mengubah database aktif.

Dasar keputusan: `D-12` (`09-Decision-Log.md`).

## FR-BK-009 — Automatic Backup

**Priority:** SHOULD

Sistem menjalankan automatic backup saat aplikasi dibuka apabila backup terakhir lebih tua dari 7 hari dan akun Google tersedia.

Kegagalan automatic backup tidak boleh menghalangi atau mengganggu operasi.

Dasar keputusan: `D-14b` (`09-Decision-Log.md`).

## FR-BK-010 — Local Backup File

**Priority:** SHOULD

Sistem dapat menghasilkan file backup database lokal yang dapat disimpan atau dibagikan melalui mekanisme share device, tanpa membutuhkan internet.

Dasar keputusan: `D-12` (`09-Decision-Log.md`).

---

# 21. Data Search & Navigation

## FR-SR-001 — Search Agent

**Priority:** SHOULD

Pengguna dapat mencari Agent berdasarkan nama atau informasi relevan.

## FR-SR-002 — Search Product

**Priority:** SHOULD

Pengguna dapat mencari Product/Variant.

## FR-SR-003 — Transaction History

**Priority:** MUST

Pengguna dapat menelusuri histori transaksi berdasarkan modul yang relevan.

## FR-SR-004 — Detail to Source

**Priority:** SHOULD

Informasi ringkasan yang berasal dari transaksi dapat ditelusuri kembali ke transaksi sumber.

---

# 22. Data Correction & Historical Integrity

## FR-CR-001 — Controlled Correction

**Priority:** MUST

Sistem harus menyediakan mekanisme koreksi terhadap transaksi yang salah tanpa mengubah histori secara sembarangan.

## FR-CR-002 — Preserve Historical Transaction

**Priority:** MUST

Koreksi tidak boleh menyebabkan hilangnya kemampuan untuk menelusuri kondisi transaksi sebelumnya.

## FR-CR-003 — Inventory Correction

**Priority:** MUST

Koreksi transaksi yang memengaruhi inventory harus menghasilkan perubahan inventory yang konsisten.

## FR-CR-004 — Correction Reason

**Priority:** SHOULD

Koreksi sebaiknya memiliki alasan atau catatan.

## FR-CR-005 — Deletion Protection

**Priority:** MUST

Data master yang sudah digunakan dalam transaksi tidak boleh dihapus secara destruktif sehingga merusak histori.

---

# 23. Functional Dependencies

Hubungan fungsi utama:

```text
Product / Variant
       ↓
Production
       ↓
Owner Stock
       ↓
Delivery Planning
       ↓
Delivery Confirmation
       ↓
Agent Stock
       ↓
Sales Confirmation
       ↓
 ┌───────────────┐
 │               │
HABIS        TIDAK HABIS
 │               │
 │          Reconciliation
 │               │
 └───────┬───────┘
         ↓
     Settlement
         ↓
       Invoice
         ↓
      Payment
```

Inventory mendapatkan perubahan dari transaksi yang relevan sepanjang lifecycle tersebut.

---

# 24. Functional Dependency Rules

## FR-DEP-001

Production harus tersedia sebelum stock hasil produksi dapat tersedia melalui proses produksi normal.

## FR-DEP-002

Delivery Confirmation harus memiliki Delivery Plan atau konteks delivery yang valid.

## FR-DEP-003

Sales Confirmation harus mengacu pada Actual Delivery.

## FR-DEP-004

TIDAK HABIS membutuhkan Reconciliation.

## FR-DEP-005

Settlement TIDAK HABIS membutuhkan Reconciliation yang selesai.

## FR-DEP-006

Settlement membutuhkan data sold yang valid.

## FR-DEP-007

Invoice membutuhkan Settlement.

## FR-DEP-008

Payment membutuhkan Settlement.

## FR-DEP-009

Dashboard, Task, dan Report membaca data dari transaksi sumber dan bukan membuat data bisnis baru.

---

# 25. MVP Functional Scope

Fungsi berikut termasuk core MVP:

### Master Data

- Business Profile
- User Profile
- Product/Variant
- Agent

### Operational

- Production
- Inventory
- Delivery Planning
- Delivery Confirmation
- Sales Confirmation
- Reconciliation
- Settlement
- Invoice
- Payment
- Operational Tasks

### Monitoring

- Dashboard
- Product Report
- Agent Report
- Inventory Report
- Low Stock

### Supporting

- Search
- Historical transaction
- Controlled correction
- Optional Google Drive backup

---

# 26. Deferred Functional Scope

Fungsi berikut tidak menjadi bagian implementasi MVP:

- Agent self-service application
- Agent login
- Multi-user authorization
- Role/permission management
- Multi-device operation
- Cloud synchronization
- Laravel API
- PostgreSQL server
- Web/Admin application
- Automatic delivery recommendation
- Agent leveling
- Percentage-based commission
- Advanced payment management
- WhatsApp API
- Advanced notification system
- Online ordering
- Complex product attributes
- Advanced pricing
- Automatic backup unless separately approved

---

# 27. Open Functional Decisions

Beberapa kebutuhan masih membutuhkan keputusan sebelum implementasi final:

| ID          | Topic                               | Status     | Keputusan |
| ----------- | ----------------------------------- | ---------- | --------- |
| OPEN-FR-001 | Authentication MVP                  | CONFIRMED  | Tidak ada authentication (`D-11`) |
| OPEN-FR-002 | Partial payment                     | CONFIRMED  | Diizinkan (`D-03`) |
| OPEN-FR-003 | Overpayment                         | DEFERRED DESIGN | Menjadi kredit Agent (`D-04`) |
| OPEN-FR-004 | Payment method                      | CONFIRMED  | `CASH/TRANSFER/QRIS/OTHER` (`D-05`) |
| OPEN-FR-005 | Transaction correction mechanism    | CONFIRMED  | Movement pembalik sebelum turunan (`D-07`) |
| OPEN-FR-006 | Delivery cancellation               | OPEN       | Di luar MVP |
| OPEN-FR-007 | Planned vs actual quantity handling | CONFIRMED  | Plan wajib, actual menjadi dasar (`D-02`) |
| OPEN-FR-008 | Database restore flow               | CONFIRMED  | Validasi + safety backup (`D-12`) |
| OPEN-FR-009 | Automatic backup                    | CONFIRMED  | > 7 hari saat aplikasi dibuka (`D-14b`) |
| OPEN-FR-010 | Product deactivation behavior       | CONFIRMED  | Boleh kapan saja + peringatan (`D-13`) |

Detail lengkap: `09-Decision-Log.md`.

---

# 28. Requirement Traceability

Functional Requirements harus dapat ditelusuri kembali ke:

```text
PRD
 ↓
Business Rules
 ↓
Functional Requirements
 ↓
UX Flow
 ↓
Data Model
 ↓
Acceptance Criteria
 ↓
Implementation
```

Tidak boleh terdapat fungsi utama yang bertentangan dengan Business Rules yang telah dikonfirmasi.

---

# 29. Functional Requirement Principles

Implementasi harus mengikuti prinsip:

1. **Business Rule First**
   Functional Requirement tidak boleh mengubah aturan bisnis.

2. **Operational First**
   Fungsi harus membantu pekerjaan operasional sehari-hari.

3. **Simple by Default**
   Hindari fungsi yang menambah kompleksitas tanpa kebutuhan bisnis yang jelas.

4. **Offline First**
   Fungsi inti harus tetap berjalan tanpa internet.

5. **Traceable**
   Setiap perubahan stock dan transaksi finansial harus dapat ditelusuri.

6. **Historical Integrity**
   Perubahan master data tidak boleh mengubah histori transaksi.

7. **Single Source of Truth**
   Data transaksi menjadi sumber utama untuk Dashboard, Task, Report, dan Analytics.

8. **Future Ready, Not Future Heavy**
   Struktur fungsi harus memungkinkan evolusi ke API/cloud tanpa membangun mekanisme cloud pada MVP.

---

# 30. Requirement Status

Dokumen ini menggunakan status:

- **CONFIRMED** — telah disepakati.
- **PROPOSED** — usulan untuk review.
- **OPEN** — membutuhkan keputusan.
- **DEFERRED** — sengaja ditunda.
- **REJECTED** — tidak akan diterapkan.

Status final setiap requirement akan ditentukan selama proses review.

---

# 31. Core Functional Principle

Aplikasi harus mampu menjalankan siklus:

> **Produksi → Stok → Delivery → Penjualan/Return → Reconciliation → Settlement → Invoice → Payment**

dengan kondisi:

> **Offline, sederhana, dapat ditelusuri, dan tidak bergantung pada server/cloud untuk operasi inti.**
