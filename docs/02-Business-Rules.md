# Business Rules

**Version:** 1.0
**Status:** Confirmed
**Last Updated:** 2026-09-19
**Related Document:** `01-PRD.md v1.0`

---

# 1. Purpose

Dokumen ini mendefinisikan aturan bisnis yang berlaku pada Aplikasi Distribusi Konsinyasi.

Business Rules menjadi dasar untuk:

- Functional Requirements;
- UX Flow;
- Data Model;
- Acceptance Criteria;
- implementasi aplikasi.

Business Rules menjelaskan **apa yang harus benar menurut proses bisnis**, bukan bagaimana aturan tersebut diimplementasikan secara teknis.

---

# 2. Business Model

Aplikasi mendukung bisnis distribusi produk dengan model **konsinyasi**.

Secara umum:

```text
Business / Owner
      ↓
    Stock
      ↓
   Delivery
      ↓
     Agent
      ↓
 Sold / Returned
      ↓
   Settlement
      ↓
    Payment
```

Produk yang dikirim kepada agent belum otomatis dianggap sebagai penjualan.

Penjualan ditentukan berdasarkan hasil penjualan aktual dan/atau reconciliation.

---

# 3. Business Entity Principles

Entitas utama yang terlibat dalam proses bisnis:

- Business / Organization;
- User;
- Product / Variant;
- Agent;
- Production Batch;
- Inventory;
- Delivery;
- Delivery Item;
- Sales Confirmation;
- Reconciliation;
- Settlement;
- Invoice;
- Payment;
- Operational Task.

Setiap entitas memiliki lifecycle dan hubungan yang berbeda.

Transaksi historis harus mempertahankan nilai yang relevan pada saat transaksi terjadi.

---

# 4. Business Profile Rules

### BR-BP-001 — Single Business

MVP hanya digunakan untuk satu Business/Organization pada satu aplikasi/device.

### BR-BP-002 — Business Identity

Business Profile menyimpan identitas bisnis yang digunakan dalam aplikasi dan dokumen.

### BR-BP-003 — Historical Business Information

Perubahan Business Profile di kemudian hari tidak boleh mengubah informasi historis yang telah digunakan pada dokumen/transaksi jika informasi tersebut telah disimpan sebagai snapshot.

### BR-BP-004 — Future Organization

Struktur data harus memungkinkan pengembangan ke multi-organization di masa depan, tetapi MVP tidak memerlukan multi-tenant behavior.

---

# 5. User & Authentication Rules

### BR-US-001 — Single Operational User

MVP digunakan oleh satu pengguna operasional pada satu device.

### BR-US-002 — No Role Separation in MVP

MVP tidak menerapkan pemisahan role dan permission.

Pengguna operasional dapat menjalankan seluruh fungsi aplikasi.

### BR-US-003 — User Profile

User Profile tetap disediakan sebagai data dasar pengguna.

### BR-US-004 — Authentication Optional

Authentication tidak wajib untuk menjalankan operasi utama MVP.

### BR-US-005 — Google Account

Google Account dapat digunakan apabila user ingin menggunakan fitur yang membutuhkan akses Google Drive.

### BR-US-006 — Offline Operation

Ketiadaan authentication atau koneksi Google tidak boleh menghalangi penggunaan fungsi operasional lokal.

---

# 6. Product & Variant Rules

### BR-PR-001 — Product Identity

Setiap product/variant memiliki ID unik.

### BR-PR-002 — Product Name

Setiap product/variant memiliki nama.

### BR-PR-003 — Selling Price

Product/variant memiliki harga jual yang digunakan sebagai dasar perhitungan transaksi.

### BR-PR-004 — Optional Description

Product/variant dapat memiliki description.

### BR-PR-005 — Historical Price

Harga yang digunakan pada transaksi harus disimpan sebagai nilai transaksi pada saat transaksi terjadi.

Perubahan harga master product tidak boleh mengubah transaksi historis.

### BR-PR-006 — Inactive Product

Product yang sudah pernah digunakan dalam transaksi tidak boleh menyebabkan transaksi historis menjadi tidak valid hanya karena product tersebut dinonaktifkan.

**Status: CONFIRMED** — Product dapat dinonaktifkan kapan saja. Product nonaktif tidak muncul sebagai pilihan pada transaksi baru, dan sistem menampilkan peringatan informatif bila masih terdapat stok.

Dasar keputusan: `D-13` (`09-Decision-Log.md`).

---

# 7. Agent Rules

### BR-AG-001 — Agent Identity

Setiap agent memiliki ID unik.

### BR-AG-002 — Agent Status

Agent dapat memiliki status aktif/nonaktif.

### BR-AG-003 — Inactive Agent

Agent nonaktif tidak digunakan untuk delivery baru.

Transaksi historis agent tetap dapat dilihat.

### BR-AG-004 — Agent Does Not Use App

Agent tidak melakukan input transaksi langsung pada MVP.

### BR-AG-005 — Agent Result

Hasil penjualan agent pada proses harian dinyatakan sebagai:

- HABIS;
- TIDAK HABIS.

---

# 8. Production Rules

### BR-PD-001 — Actual Production

Production mencatat **hasil produksi aktual**, bukan target produksi.

### BR-PD-002 — Production Batch

Setiap proses produksi dicatat sebagai batch.

### BR-PD-003 — Variant Quantity

Setiap batch dapat memiliki quantity untuk masing-masing product/variant.

### BR-PD-004 — Automatic Total

Total produksi batch dihitung oleh sistem berdasarkan quantity masing-masing item.

### BR-PD-005 — Production Creates Stock

Produksi yang telah dicatat menghasilkan inventory movement masuk ke owner stock.

### BR-PD-006 — No Direct Stock Editing

Pengguna tidak mengubah saldo stock secara langsung melalui production.

### BR-PD-007 — Production Correction

Kesalahan produksi yang sudah tercatat tidak boleh diperbaiki dengan mengubah saldo stock secara bebas.

Correction dilakukan melalui mekanisme koreksi/adjustment yang ditentukan sistem.

---

# 9. Inventory Rules

### BR-IV-001 — Stock Movement as Source

Perubahan inventory harus berasal dari transaksi atau stock adjustment yang valid.

### BR-IV-002 — Owner Stock

Owner stock menunjukkan barang yang secara fisik berada pada bisnis/owner dan tersedia untuk operasional.

### BR-IV-003 — Delivery Movement

Barang yang dikonfirmasi telah dikirim berpindah dari owner stock menuju agent stock.

### BR-IV-004 — Agent Stock

Barang yang telah dikirim dan belum terjual atau dikembalikan dianggap berada pada agent stock.

### BR-IV-005 — Sold Movement

Barang yang dinyatakan terjual mengurangi agent stock.

### BR-IV-006 — Return Movement

Barang yang dikembalikan dari agent menambah owner stock.

### BR-IV-007 — Stock Conservation

Untuk setiap product/variant:

**Stock In + Stock Adjustment In - Stock Out - Stock Adjustment Out = Current Stock**

Detail formula implementasi dapat disesuaikan dengan model inventory yang dipilih.

### BR-IV-008 — Negative Stock

Sistem tidak boleh menghasilkan negative stock melalui transaksi operasional normal.

Jika terjadi kondisi yang memerlukan koreksi, pengguna harus menggunakan mekanisme adjustment yang sesuai.

### BR-IV-009 — Stock Adjustment

Stock adjustment harus memiliki alasan.

Alasan dapat mencakup:

- damaged goods;
- melted/unusable;
- production error;
- tester/sample;
- loss;
- stock opname correction.

Daftar final reason dapat diperluas kemudian.

---

# 10. Delivery Planning Rules

### BR-DP-001 — Delivery Plan

Delivery Plan digunakan untuk menentukan barang yang direncanakan akan dikirim.

### BR-DP-002 — Delivery Destination

Setiap delivery plan memiliki agent tujuan.

### BR-DP-003 — Delivery Items

Delivery plan dapat terdiri dari satu atau beberapa product/variant.

### BR-DP-004 — Manual Quantity

Quantity delivery ditentukan secara manual oleh pengguna.

### BR-DP-005 — No Automatic Recommendation

MVP tidak menentukan quantity delivery secara otomatis berdasarkan histori penjualan.

### BR-DP-006 — Daily Delivery

Agent aktif/scheduled dapat menerima delivery baru setiap hari sesuai kebutuhan operasional.

### BR-DP-007 — Previous Result Does Not Automatically Block Delivery

Hasil delivery sebelumnya tidak otomatis mencegah delivery berikutnya.

Agent tetap dapat menerima delivery baru meskipun sebelumnya:

- memiliki return;
- memiliki outstanding payment;
- tidak habis menjual barang.

### BR-DP-008 — Delivery Plan vs Actual Delivery

Delivery Plan dan Delivery Confirmation adalah dua aktivitas berbeda.

Plan menunjukkan rencana.

Confirmation menunjukkan bahwa delivery benar-benar dilakukan.

---

# 11. Delivery Confirmation Rules

### BR-DC-001 — Confirmation Required

Delivery baru dianggap benar-benar dikirim setelah pengguna melakukan Delivery Confirmation.

### BR-DC-002 — Stock Effect

Inventory movement dari owner stock ke agent stock terjadi berdasarkan actual delivery yang dikonfirmasi.

### BR-DC-003 — Planned Quantity Is Not Automatically Actual

Quantity pada Delivery Plan tidak otomatis dianggap sebagai actual delivery.

### BR-DC-004 — Actual Delivery

Actual delivery menjadi dasar untuk proses penjualan dan reconciliation berikutnya.

### BR-DC-005 — Delivery Confirmation History

Delivery yang telah dikonfirmasi menjadi bagian dari histori transaksi dan tidak boleh hilang hanya karena data master berubah.

### BR-DC-006 — Delivery Correction

Jika terjadi kesalahan pada actual delivery, koreksi harus menggunakan mekanisme yang menjaga histori transaksi dan inventory tetap konsisten.

Detail mekanisme correction ditentukan pada Functional Requirements.

---

# 12. Sales Confirmation Rules

### BR-SC-001 — Sales Result

Hasil penjualan harian agent memiliki dua status:

- HABIS;
- TIDAK HABIS.

### BR-SC-002 — HABIS

Jika status HABIS:

**Sold = Actual Delivered**

dan:

**Return = 0**

### BR-SC-003 — HABIS Requires No Physical Reconciliation

Status HABIS tidak membutuhkan pencatatan quantity return secara fisik.

### BR-SC-004 — TIDAK HABIS

Jika status TIDAK HABIS, pengguna wajib melakukan physical reconciliation untuk menentukan quantity yang tersisa.

### BR-SC-005 — No Agent Variant Report

Agent tidak diwajibkan memberikan detail quantity tersisa per product/variant melalui aplikasi.

Quantity aktual ditentukan melalui pemeriksaan fisik oleh petugas.

---

# 13. Reconciliation Rules

### BR-RC-001 — Reconciliation Required

Reconciliation diperlukan apabila hasil penjualan adalah TIDAK HABIS.

### BR-RC-002 — Physical Count

Quantity return ditentukan berdasarkan kondisi fisik barang.

### BR-RC-003 — Sold Calculation

Untuk setiap product/variant:

**Sold = Actual Delivered - Returned**

### BR-RC-004 — Conservation Rule

Untuk setiap product/variant:

**Sold + Returned = Actual Delivered**

### BR-RC-005 — Return Cannot Exceed Delivery

Quantity return tidak boleh lebih besar dari actual delivery.

### BR-RC-006 — Sold Cannot Be Negative

Quantity sold tidak boleh bernilai negatif.

### BR-RC-007 — Return Movement

Barang yang dikembalikan menghasilkan inventory movement dari agent stock menuju owner stock.

### BR-RC-008 — Reconciliation Completion

Settlement tidak boleh menggunakan hasil TIDAK HABIS sebelum reconciliation selesai.

---

# 14. Settlement Rules

### BR-ST-001 — Settlement Based on Sold

Settlement dihitung berdasarkan quantity yang benar-benar terjual.

### BR-ST-002 — Historical Selling Price

Settlement menggunakan selling price yang berlaku pada saat transaksi.

### BR-ST-003 — Gross Sales

Gross sales dihitung:

**Gross Sales = Sold Quantity × Selling Price**

### BR-ST-004 — Agent Fee

Agent fee MVP menggunakan nominal tetap per unit.

**Agent Fee = Sold Quantity × Agent Fee per Unit**

### BR-ST-005 — Net Settlement

Net settlement dihitung:

**Net Settlement = Gross Sales - Agent Fee**

### BR-ST-006 — Agent-specific Fee

Agent fee dapat berbeda antar-agent.

### BR-ST-007 — No Level-based Fee

Agent fee tidak ditentukan berdasarkan agent level.

### BR-ST-008 — No Percentage Fee

Percentage-based agent fee tidak termasuk MVP.

### BR-ST-009 — Settlement Snapshot

Settlement harus menyimpan nilai yang digunakan saat settlement dibuat, termasuk minimal:

- quantity sold;
- selling price;
- gross sales;
- agent fee;
- net settlement.

Perubahan master data setelah settlement tidak boleh mengubah nilai settlement historis.

### BR-ST-010 — Settlement and Payment Are Separate

Settlement tidak berarti payment telah dilakukan.

Settlement dapat memiliki status payment yang berbeda.

---

# 15. Invoice Rules

### BR-IN-001 — Invoice Based on Settlement

Invoice dibuat berdasarkan settlement.

### BR-IN-002 — Settlement Required

Invoice tidak boleh dibuat untuk transaksi yang belum memiliki dasar settlement yang valid.

### BR-IN-003 — Invoice Before Payment

Invoice dapat dibuat sebelum payment diterima.

### BR-IN-004 — Historical Invoice

Invoice historis harus mempertahankan informasi transaksi yang digunakan pada saat invoice dibuat.

### BR-IN-005 — Business Snapshot

Invoice harus menggunakan informasi Business Profile yang relevan pada saat invoice dibuat.

### BR-IN-006 — PDF

MVP menyediakan invoice dalam bentuk PDF.

### BR-IN-007 — Sharing

Invoice PDF dapat dibagikan melalui mekanisme share pada device.

### BR-IN-008 — No WhatsApp API

MVP tidak mengintegrasikan WhatsApp API.

---

# 16. Payment Rules

### BR-PY-001 — Payment Is Separate

Payment dicatat sebagai proses terpisah dari settlement.

### BR-PY-002 — Outstanding

Settlement yang belum dibayar menjadi outstanding.

### BR-PY-003 — Payment Reduces Outstanding

Payment yang valid mengurangi outstanding settlement.

### BR-PY-004 — Full Payment

Jika jumlah payment telah memenuhi nilai settlement yang harus dibayar, settlement dapat ditandai sebagai paid.

### BR-PY-005 — Payment Timing for HABIS

Untuk HABIS, payment dapat dilakukan:

- pada saat proses settlement; atau
- pada kunjungan berikutnya.

### BR-PY-006 — Payment Timing for TIDAK HABIS

Untuk TIDAK HABIS, payment dapat dilakukan setelah reconciliation dan settlement.

### BR-PY-007 — Next Delivery Is Not Automatically Blocked

Outstanding payment dari transaksi sebelumnya tidak otomatis mencegah delivery berikutnya.

### BR-PY-008 — Partial Payment

**Status: CONFIRMED**

Pembayaran boleh kurang dari kewajiban (`Payable`).

Settlement tetap outstanding sampai:

**Outstanding = Payable - Σ Pembayaran valid**

terpenuhi.

Satu settlement dapat memiliki lebih dari satu pembayaran.

Dasar keputusan: `D-03` (`09-Decision-Log.md`).

### BR-PY-009 — Overpayment

**Status: CONFIRMED — DEFERRED DESIGN**

Pembayaran melebihi kewajiban diizinkan dan dicatat sebagai **kredit Agent**.

Entitas kredit dan aturan pemakaiannya belum ditetapkan dan akan dibahas pada sesi desain sebelum diimplementasikan.

Dasar keputusan: `D-04` (`09-Decision-Log.md`).

### BR-PY-010 — Payment Method

**Status: CONFIRMED**

Metode pembayaran dicatat sebagai salah satu dari:

```text
CASH
TRANSFER
QRIS
OTHER
```

Metode pembayaran tidak memengaruhi kalkulasi finansial.

Dasar keputusan: `D-05` (`09-Decision-Log.md`).

### BR-PY-011 — Invoice Discount

**Status: CONFIRMED**

Invoice dapat memiliki nilai diskon yang diisi **manual** oleh petugas, umumnya untuk pembulatan ke bawah karena satuan uang terkecil tidak tersedia.

```text
Payable     = Net Settlement - Discount

Outstanding = Payable - Σ Pembayaran valid
```

Diskon tidak mengubah `Net Settlement` dan tidak mengubah agent fee.

Dasar keputusan: `D-04b` (`09-Decision-Log.md`).

### BR-PY-012 — Agent Credit Balance

**Status: CONFIRMED — DEFERRED DESIGN**

Kelebihan pembayaran menjadi saldo kredit Agent dan bukan pendapatan bisnis.

Aturan pemakaian kredit (pemotongan otomatis atau hanya informasi) belum ditetapkan.

Dasar keputusan: `D-04` (`09-Decision-Log.md`).

---

# 17. Operational Task Rules

### BR-TK-001 — Task Based on Operational State

Task dibuat berdasarkan kondisi transaksi yang membutuhkan tindakan.

### BR-TK-002 — Delivery Task

Delivery yang belum dikonfirmasi dapat menjadi task delivery.

### BR-TK-003 — Reconciliation Task

Delivery dengan hasil TIDAK HABIS yang belum direkonsiliasi menjadi task reconciliation.

### BR-TK-004 — Payment Collection Task

Outstanding payment dapat menjadi task collection.

### BR-TK-005 — Completed Task

Task tidak boleh tetap ditampilkan sebagai pekerjaan aktif setelah kondisi yang membutuhkan tindakan telah diselesaikan.

### BR-TK-006 — Task Is Operational View

Task merupakan representasi aktivitas yang perlu dilakukan, bukan sumber data transaksi utama.

---

# 18. Dashboard Rules

### BR-DB-001 — Dashboard Is Summary

Dashboard hanya menyediakan ringkasan kondisi operasional.

### BR-DB-002 — Dashboard Uses Transaction Data

Informasi dashboard harus berasal dari data transaksi yang tercatat.

### BR-DB-003 — No Independent Dashboard Data

Dashboard tidak boleh menjadi sumber data terpisah yang dapat menyebabkan perbedaan dengan transaksi utama.

---

# 19. Reporting & Analytics Rules

### BR-RP-001 — Based on Historical Transactions

Report dan analytics dihitung berdasarkan data transaksi.

### BR-RP-002 — Product Performance

Product performance dapat dihitung berdasarkan:

- produced;
- delivered;
- sold;
- returned;
- gross sales;
- sell-through.

### BR-RP-003 — Agent Performance

Agent performance dapat dihitung berdasarkan:

- delivered;
- sold;
- returned;
- sell-through;
- gross sales;
- agent fee;
- net settlement;
- payment;
- outstanding.

### BR-RP-004 — Inventory Report

Inventory report dapat menunjukkan:

- stock in hand;
- stock at agent;
- production;
- delivery;
- sold;
- return;
- adjustment.

### BR-RP-005 — Historical Consistency

Perubahan master data tidak boleh mengubah hasil laporan historis yang memang bergantung pada snapshot transaksi.

---

# 20. Low Stock Rules

### BR-LS-001 — Low Stock Threshold

Product/variant dapat memiliki low stock threshold.

### BR-LS-002 — Low Stock Condition

Product dianggap low stock apabila:

**Stock In Hand ≤ Low Stock Threshold**

### BR-LS-003 — Informational

Low stock pada MVP merupakan indikator operasional dan tidak otomatis membuat purchase order atau production order.

---

# 21. Database & Offline Rules

### BR-OF-001 — Local Database

Local database adalah sumber data operasional utama pada MVP.

### BR-OF-002 — No Network Dependency

Operasi utama tidak boleh membutuhkan koneksi internet.

### BR-OF-003 — Internet Failure

Kegagalan koneksi internet tidak boleh menyebabkan transaksi lokal gagal hanya karena network tidak tersedia.

### BR-OF-004 — Local Persistence

Transaksi yang berhasil disimpan harus tetap tersedia setelah aplikasi ditutup dan dibuka kembali.

### BR-OF-005 — No Sync in MVP

MVP tidak melakukan synchronization dengan cloud server.

### BR-OF-006 — Backup Is Not Sync

Google Drive backup hanya membuat salinan database lokal.

Backup tidak mengubah database aktif berdasarkan data cloud.

---

# 22. Backup Rules

### BR-BK-001 — Backup Is Optional

Google Drive backup merupakan fitur optional.

### BR-BK-002 — Google Account Required

Google Account diperlukan untuk mengakses Google Drive backup.

### BR-BK-003 — Local Operation Without Google

Aplikasi tetap dapat digunakan tanpa akun Google.

### BR-BK-004 — Manual Backup

MVP minimal mendukung manual backup.

### BR-BK-005 — Backup File

Backup menghasilkan file database yang dapat digunakan untuk recovery.

### BR-BK-006 — Backup Timestamp

Sistem harus dapat mengetahui waktu backup yang berhasil.

### BR-BK-007 — Failed Backup

Kegagalan upload backup tidak boleh mengubah atau merusak database lokal.

### BR-BK-008 — Backup Does Not Delete Local Data

Backup tidak menghapus data lokal.

### BR-BK-009 — Restore Safety

**Status: CONFIRMED**

Restore tidak boleh dilakukan secara diam-diam dan harus memiliki perlindungan terhadap kehilangan database aktif.

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

Gagal validasi berarti tidak ada perubahan pada database aktif.

Dasar keputusan: `D-12` (`09-Decision-Log.md`).

---

# 23. Data Integrity Rules

### BR-DI-001 — Transaction Consistency

Perubahan data yang merupakan satu transaksi bisnis harus berhasil secara konsisten atau tidak menghasilkan perubahan parsial yang menyebabkan data tidak valid.

### BR-DI-002 — Historical Transactions

Transaksi historis tidak boleh berubah hanya karena master data berubah.

### BR-DI-003 — Stable Identity

Entity yang sudah digunakan dalam transaksi harus memiliki identity yang stabil.

### BR-DI-004 — No Destructive Master Deletion

Master data yang sudah digunakan transaksi tidak boleh dihapus secara destructive jika penghapusan tersebut menyebabkan histori tidak dapat ditelusuri.

### BR-DI-005 — Correction Through Transaction

**Status: CONFIRMED**

Koreksi terhadap transaksi historis harus menggunakan mekanisme yang menjaga auditability dan konsistensi inventory.

Mekanisme MVP:

- koreksi dilakukan melalui **stock movement pembalik**;
- movement pembalik memakai `movement_type = ADJUSTMENT`, `source_type = CORRECTION`, dan menunjuk transaksi asal;
- reason wajib diisi;
- transaksi asal tidak diedit dan tidak dihapus, hanya ditandai sudah dikoreksi;
- koreksi hanya tersedia sebelum transaksi memiliki turunan (Sales Confirmation, Reconciliation, Settlement).

Dasar keputusan: `D-07` (`09-Decision-Log.md`).

---

# 24. Transaction Lifecycle

Lifecycle utama transaksi konsinyasi:

```text
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

### Important Principle

**Delivery bukan penjualan.**

Barang yang baru dikirim masih merupakan stock at agent sampai dinyatakan terjual atau dikembalikan.

---

# 25. Business Invariants

Invariants adalah kondisi yang harus selalu benar.

### INV-001 — Reconciliation

**Sold + Returned = Actual Delivered**

### INV-002 — Return Limit

**Returned ≤ Actual Delivered**

### INV-003 — Sold Limit

**Sold ≤ Actual Delivered**

### INV-004 — Settlement

Settlement hanya dihitung berdasarkan quantity sold yang valid.

### INV-005 — HABIS

Jika status HABIS:

**Sold = Actual Delivered**

dan:

**Returned = 0**

### INV-006 — TIDAK HABIS

Jika status TIDAK HABIS:

**Sold + Returned = Actual Delivered**

### INV-007 — Stock

Inventory harus konsisten dengan seluruh stock movements yang valid.

### INV-008 — Historical Price

Nilai transaksi historis tidak berubah karena perubahan harga master.

### INV-009 — Historical Agent Fee

Nilai settlement historis tidak berubah karena perubahan agent fee master.

### INV-010 — Backup

Backup failure tidak boleh mengubah database lokal yang sedang digunakan.

---

# 26. Open Business Decisions

Seluruh keputusan bisnis berikut telah ditetapkan dan dipindahkan ke `09-Decision-Log.md`.

| ID | Topik | Status | Keputusan |
| -- | ----- | ------ | --------- |
| OPEN-001 | Partial Payment | **CONFIRMED** | Pembayaran boleh kurang dari kewajiban; outstanding hingga terpenuhi (`BR-PY-008`, `D-03`) |
| OPEN-002 | Overpayment | **CONFIRMED — DEFERRED DESIGN** | Menjadi kredit Agent; entitas & aturan dibahas sebelum implementasi (`BR-PY-009`, `BR-PY-012`, `D-04`) |
| OPEN-003 | Payment Method | **CONFIRMED** | `CASH`, `TRANSFER`, `QRIS`, `OTHER` (`BR-PY-010`, `D-05`) |
| OPEN-004 | Transaction Correction | **CONFIRMED** | Movement pembalik sebelum transaksi memiliki turunan (`BR-DI-005`, `D-07`) |
| OPEN-005 | Delivery Cancellation | **OPEN** | Tidak diwajibkan MVP (`09-Decision-Log.md` bagian 5) |
| OPEN-006 | Actual Delivery Difference | **CONFIRMED** | Actual delivery menjadi dasar transaksi; plan wajib tersedia (`D-02`) |
| OPEN-007 | Restore | **CONFIRMED** | Restore dengan validasi + safety backup (`BR-BK-009`, `D-12`) |
| OPEN-008 | Automatic Backup | **CONFIRMED** | Otomatis saat aplikasi dibuka bila backup terakhir > 7 hari (`D-14b`) |
| OPEN-009 | Authentication | **CONFIRMED** | MVP tanpa authentication (`D-11`) |
| OPEN-010 | Product Deactivation | **CONFIRMED** | Boleh kapan saja + peringatan informatif (`BR-PR-006`, `D-13`) |

Tambahan aturan baru: `BR-PY-011` (invoice discount) dan `BR-PY-012` (agent credit balance).

---

# 27. Deferred Business Rules

Aturan berikut sengaja ditunda sampai fitur terkait benar-benar dibutuhkan:

- multi-user authorization;
- role/permission;
- multi-device;
- cloud synchronization;
- conflict resolution;
- server authority;
- agent application;
- agent self-service;
- automatic delivery recommendation;
- agent leveling;
- percentage-based fee;
- advanced payment processing;
- advanced notification;
- online ordering.

---

# 28. Business Rule Status

Setiap business rule menggunakan status:

- **CONFIRMED** — telah disepakati;
- **PROPOSED** — rekomendasi yang menunggu persetujuan;
- **OPEN** — belum diputuskan;
- **DEFERRED** — ditunda untuk fase berikutnya;
- **REJECTED** — tidak digunakan.

---

# 29. Core Business Principle

Prinsip utama aplikasi:

> **Setiap barang yang bergerak harus dapat ditelusuri, setiap barang yang terjual harus dapat dipertanggungjawabkan, dan setiap kewajiban finansial harus dapat direkonsiliasi.**

Aturan operasional utamanya:

```text
Production
    ↓
Owner Stock
    ↓
Actual Delivery
    ↓
Agent Stock
    ↓
Sold / Return
    ↓
Settlement
    ↓
Payment
```

Dengan prinsip:

> **Delivery ≠ Sales ≠ Settlement ≠ Payment**

Keempat proses tersebut merupakan tahapan berbeda dan harus tetap dapat ditelusuri secara terpisah.
