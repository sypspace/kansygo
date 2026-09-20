# 06-Acceptance-Criteria.md

**Version:** 0.1
**Status:** Draft for Review
**Last Updated:** 2026-09-19
**Related Documents:**

- `01-PRD.md` v1.0
- `02-Business-Rules.md` v1.0
- `03-Functional-Requirements.md` v1.0
- `04-UX-Flows.md` v1.0
- `05-Data-Model.md` v1.0

---

# 1. Purpose

Dokumen ini mendefinisikan kriteria yang harus dipenuhi agar suatu fitur atau proses dianggap **selesai dan diterima**.

Acceptance Criteria digunakan sebagai dasar untuk:

- functional testing
- integration testing
- manual testing
- automated testing
- GitHub Copilot Agent verification
- feature completion
- regression testing

Prinsip:

> **Fitur dianggap selesai bukan ketika UI sudah tampil, tetapi ketika perilaku bisnis dan data yang dihasilkan sudah benar.**

---

# 2. Acceptance Criteria Convention

Format:

```text
AC-[MODULE]-[NUMBER]
```

Setiap acceptance criterion menggunakan pola:

> **Given → When → Then**

### Given

Kondisi awal.

### When

Tindakan pengguna atau sistem.

### Then

Hasil yang harus terjadi.

---

# 3. Global Acceptance Criteria

## AC-APP-001 — Application Starts Offline

**Given**

- Device tidak memiliki koneksi internet.

**When**

- User membuka aplikasi.

**Then**

- Aplikasi dapat dibuka.
- Dashboard dapat ditampilkan.
- Tidak muncul error yang disebabkan oleh tidak adanya internet.

---

## AC-APP-002 — Core Operations Offline

**Given**

- Device offline.

**When**

- User melakukan operasi core MVP.

**Then**

- Operasi dapat dilakukan.
- Data tersimpan secara lokal.
- Tidak ada dependency terhadap server/cloud.

---

## AC-APP-003 — Persistence

**Given**

- Transaksi telah berhasil disimpan.

**When**

- Aplikasi ditutup dan dibuka kembali.

**Then**

- Transaksi tetap tersedia.
- Data tidak hilang.

---

## AC-APP-004 — Failed Transaction

**Given**

- User melakukan transaksi yang tidak valid.

**When**

- User mencoba menyimpan.

**Then**

- Sistem menolak transaksi.
- Data tidak berada dalam kondisi setengah tersimpan.
- User mendapat informasi mengenai kesalahan.

---

# 4. Business Profile

## AC-BP-001 — View Business Profile

**Given**

- Business Profile tersedia.

**When**

- User membuka Business Profile.

**Then**

- Informasi bisnis ditampilkan.

---

## AC-BP-002 — Edit Business Profile

**Given**

- User berada pada Business Profile.

**When**

- User mengubah data dan menyimpan.

**Then**

- Data Business Profile diperbarui.

---

## AC-BP-003 — Historical Business Snapshot

**Given**

- Invoice telah dibuat dengan Business Profile tertentu.

**When**

- Business Profile diubah.

**Then**

- Invoice lama tetap menampilkan informasi bisnis saat invoice dibuat.

---

# 5. User Profile & Authentication

## AC-US-001 — User Profile

**Given**

- User Profile tersedia.

**When**

- User membuka profile.

**Then**

- Informasi user dapat dilihat.

---

## AC-US-002 — Offline Without Authentication

**Given**

- Device offline.
- Authentication tidak digunakan pada MVP.

**When**

- User membuka aplikasi.

**Then**

- Operasional lokal tetap dapat dilakukan.

---

## AC-US-003 — Google Account Is Not Operational Dependency

**Given**

- User tidak menghubungkan Google Account.

**When**

- User melakukan production, delivery, reconciliation, settlement, atau payment.

**Then**

- Operasi tetap dapat dilakukan.

---

# 6. Product / Variant

## AC-PR-001 — Create Product Variant

**Given**

- User berada pada Product list.

**When**

- User memasukkan nama dan harga valid lalu menyimpan.

**Then**

- Product Variant dibuat.
- Product Variant dapat digunakan dalam transaksi baru.

---

## AC-PR-002 — Invalid Product

**Given**

- Nama atau harga tidak valid.

**When**

- User mencoba menyimpan.

**Then**

- Sistem menolak data.
- Product tidak dibuat.

---

## AC-PR-003 — Product Deactivation

**Given**

- Product Variant pernah digunakan dalam transaksi.

**When**

- User menonaktifkannya.

**Then**

- Product menjadi inactive.
- Product tidak tersedia untuk transaksi baru.
- Histori transaksi tetap dapat dilihat.

---

## AC-PR-004 — Historical Price

**Given**

- Product Variant memiliki harga Rp3.000.
- Delivery menggunakan harga tersebut.

**When**

- Harga Product Variant diubah menjadi Rp3.500.

**Then**

- Delivery lama tetap menggunakan snapshot Rp3.000.
- Settlement lama tetap menggunakan Rp3.000.

---

# 7. Agent

## AC-AG-001 — Create Agent

**Given**

- User memasukkan data Agent valid.

**When**

- User menyimpan.

**Then**

- Agent dibuat dan dapat digunakan untuk delivery.

---

## AC-AG-002 — Deactivate Agent

**Given**

- Agent telah memiliki histori transaksi.

**When**

- User menonaktifkan Agent.

**Then**

- Agent tidak tersedia untuk delivery baru.
- Histori Agent tetap tersedia.

---

## AC-AG-003 — Agent Fee

**Given**

- Agent memiliki fee Rp500/unit.

**When**

- Settlement dibuat untuk 20 unit.

**Then**

- Total fee = Rp10.000.

---

## AC-AG-004 — Historical Agent Fee

**Given**

- Agent fee saat settlement = Rp500/unit.

**When**

- Fee Agent kemudian diubah menjadi Rp600/unit.

**Then**

- Settlement lama tetap menggunakan Rp500/unit.

---

# 8. Production

## AC-PD-001 — Create Production Batch

**Given**

- Product Variant tersedia.

**When**

- User membuat Production Batch dengan quantity valid.

**Then**

- Production Batch tersimpan.
- Production Item tersimpan.

---

## AC-PD-002 — Calculate Production Total

**Given**

```text id="0zq8pt"
Coklat       41
Strawberry   42
Bubble Gum   40
```

**When**

- Batch disimpan.

**Then**

```text id="5uyj0u"
Total = 123
```

Sistem tidak membutuhkan input total manual.

---

## AC-PD-003 — Production Creates Stock

**Given**

- Production Batch berisi 80 unit.

**When**

- Production dikonfirmasi.

**Then**

- Owner Stock bertambah 80 unit.
- Stock Movement Production tercatat.

---

## AC-PD-004 — No Direct Stock Modification

**Given**

- User berada pada Inventory.

**When**

- User ingin mengubah stock.

**Then**

- User harus melalui transaksi adjustment atau transaksi operasional yang sesuai.
- Tidak tersedia perubahan angka stock secara bebas.

---

# 9. Inventory

## AC-IV-001 — Production Stock Movement

**Given**

- Production menghasilkan 80 unit.

**When**

- Production dikonfirmasi.

**Then**

- Stock Movement mencatat +80 ke Owner Stock.

---

## AC-IV-002 — Delivery Stock Movement

**Given**

- Owner Stock memiliki minimal 50 unit.
- Actual Delivery = 50.

**When**

- Delivery dikonfirmasi.

**Then**

- Owner Stock berkurang 50.
- Agent Stock bertambah 50.
- Stock Movement Delivery tercatat.

---

## AC-IV-003 — Insufficient Stock

**Given**

- Owner Stock = 30.
- User mencoba melakukan Actual Delivery = 50.

**When**

- Delivery dikonfirmasi.

**Then**

- Sistem menolak transaksi.
- Stock tidak berubah.

---

## AC-IV-004 — Return Stock Movement

**Given**

- Agent menerima 50 unit.
- Return = 10.

**When**

- Reconciliation dikonfirmasi.

**Then**

- Agent Stock berkurang 10.
- Owner Stock bertambah 10.
- Stock Movement Return tercatat.

---

## AC-IV-005 — Sold Stock Movement

**Given**

- Agent memiliki 50 unit.
- Sold = 40.

**When**

- Sales/Reconciliation selesai.

**Then**

- Agent Stock berkurang 40.
- Sold dapat ditelusuri ke delivery terkait.

---

## AC-IV-006 — Low Stock

**Given**

- Stock In Hand = 20.
- Threshold = 20.

**When**

- Sistem mengevaluasi inventory.

**Then**

- Product ditandai Low Stock.

---

# 10. Delivery Planning

## AC-DP-001 — Create Delivery Plan

**Given**

- Agent aktif.
- Product Variant aktif.

**When**

- User membuat Delivery Plan.

**Then**

- Plan tersimpan.
- Planned Quantity tersimpan.
- Owner Stock belum berubah.

---

## AC-DP-002 — Planned vs Actual

**Given**

```text id="k9n7vv"
Planned = 50
```

**When**

```text id="cctw9m"
Actual = 48
```

**Then**

- Delivery menggunakan 48 sebagai Actual Delivery.
- Stock Movement menggunakan 48.
- 50 tidak dianggap sebagai barang yang dikirim.

---

# 11. Delivery Confirmation

## AC-DC-001 — Confirm Delivery

**Given**

- Delivery Plan tersedia.

**When**

- User mengkonfirmasi actual delivery.

**Then**

- Delivery menjadi confirmed.
- Actual Delivery tersimpan.
- Inventory berpindah Owner → Agent.

---

## AC-DC-002 — Delivery History

**Given**

- Delivery telah confirmed.

**When**

- User membuka histori delivery.

**Then**

- Delivery tetap tersedia sebagai histori.

---

## AC-DC-003 — Delivery Is Not Sales

**Given**

- Delivery = 50.

**When**

- Delivery dikonfirmasi.

**Then**

- Sistem tidak otomatis mencatat 50 sebagai sold.

Barang tetap dianggap berada di Agent Stock.

---

# 12. Sales Confirmation

## AC-SC-001 — HABIS

**Given**

- Actual Delivery = 50.

**When**

- User memilih HABIS.

**Then**

```text id="0lkw4g"
Sold = 50
Return = 0
```

- Reconciliation tidak diperlukan.
- Settlement dapat dibuat.

---

## AC-SC-002 — TIDAK HABIS

**Given**

- Actual Delivery = 50.

**When**

- User memilih TIDAK HABIS.

**Then**

- Reconciliation menjadi required.
- Settlement belum dapat dibuat.

---

## AC-SC-003 — No Manual Sold Input for HABIS

**Given**

- Sales Result = HABIS.

**When**

- User melanjutkan proses.

**Then**

- User tidak perlu memasukkan sold quantity per variant.

---

# 13. Reconciliation

## AC-RC-001 — Start Reconciliation

**Given**

- Delivery berstatus TIDAK HABIS.

**When**

- User membuka reconciliation.

**Then**

- Sistem menampilkan actual delivered quantity.

---

## AC-RC-002 — Calculate Sold

**Given**

```text id="xw1hfn"
Delivered = 50
Returned = 12
```

**When**

- User memasukkan return.

**Then**

```text id="3m5f3v"
Sold = 38
```

---

## AC-RC-003 — Return Cannot Exceed Delivery

**Given**

```text id="ud3pih"
Delivered = 50
```

**When**

- User memasukkan Return = 51.

**Then**

- Sistem menolak input/penyimpanan.
- Sold tidak menjadi nilai negatif.

---

## AC-RC-004 — Reconciliation Equation

**Given**

```text id="4g5zji"
Delivered = 50
Returned = 12
Sold = 38
```

**When**

- User menyimpan reconciliation.

**Then**

```text id="pyf3wv"
Sold + Returned = Delivered
38 + 12 = 50
```

---

## AC-RC-005 — Return Creates Stock Movement

**Given**

- Return = 12.

**When**

- Reconciliation dikonfirmasi.

**Then**

- Return stock movement dibuat.
- Barang kembali ke Owner Stock.

---

## AC-RC-006 — Settlement Blocked

**Given**

- Sales Result = TIDAK HABIS.
- Reconciliation belum selesai.

**When**

- User mencoba membuat Settlement.

**Then**

- Sistem menolak.
- User diarahkan untuk menyelesaikan reconciliation.

---

# 14. Settlement

## AC-ST-001 — Create Settlement

**Given**

- Sold quantity valid.
- Historical selling price tersedia.
- Historical agent fee tersedia.

**When**

- User membuat settlement.

**Then**

- Settlement dapat dibuat.

---

## AC-ST-002 — Gross Calculation

**Given**

```text id="z42z3d"
Sold = 46
Price = Rp3.000
```

**When**

- Settlement dihitung.

**Then**

```text id="jznf5g"
Gross = Rp138.000
```

---

## AC-ST-003 — Fee Calculation

**Given**

```text id="0l1c4v"
Sold = 46
Fee = Rp500
```

**When**

- Settlement dihitung.

**Then**

```text id="ecp3y0"
Fee = Rp23.000
```

---

## AC-ST-004 — Net Calculation

**Given**

```text id="k4f8br"
Gross = Rp138.000
Fee = Rp23.000
```

**When**

- Settlement dihitung.

**Then**

```text id="2k1lry"
Net = Rp115.000
```

---

## AC-ST-005 — Historical Settlement

**Given**

- Settlement telah dikonfirmasi.

**When**

- Product price atau Agent fee berubah.

**Then**

- Settlement lama tidak berubah.

---

## AC-ST-006 — Settlement Is Not Payment

**Given**

- Settlement berhasil dibuat.

**When**

- User melihat status settlement.

**Then**

- Settlement belum dianggap paid jika belum ada payment valid.

---

# 15. Invoice

## AC-IN-001 — Generate Invoice

**Given**

- Settlement valid tersedia.

**When**

- User memilih Generate Invoice.

**Then**

- Invoice dibuat.
- Invoice memiliki nomor unik.

---

## AC-IN-002 — Invoice Snapshot

**Given**

- Settlement menggunakan price dan fee tertentu.

**When**

- Invoice dibuat.

**Then**

- Invoice menyimpan nilai historis yang relevan.

---

## AC-IN-003 — PDF

**Given**

- Invoice telah dibuat.

**When**

- User memilih Generate/Share.

**Then**

- Sistem menghasilkan file PDF.

---

## AC-IN-004 — Android Share

**Given**

- PDF invoice tersedia.

**When**

- User memilih Share.

**Then**

- Android Share mechanism terbuka.

---

## AC-IN-005 — No WhatsApp API Dependency

**Given**

- Device tidak memiliki WhatsApp API integration.

**When**

- User membagikan invoice.

**Then**

- Invoice tetap dapat dibagikan menggunakan Android Share Sheet.

---

# 16. Payment

## AC-PY-001 — Record Full Payment

**Given**

- Settlement = Rp115.000.
- Belum ada payment.

**When**

- User mencatat payment Rp115.000.

**Then**

- Payment tersimpan.
- Outstanding menjadi Rp0.
- Settlement menjadi Paid.

---

## AC-PY-002 — Outstanding

**Given**

- Settlement = Rp115.000.
- Belum dibayar.

**When**

- User membuka outstanding.

**Then**

- Settlement muncul sebagai outstanding Rp115.000.

---

## AC-PY-003 — Payment History

**Given**

- Payment telah dicatat.

**When**

- User membuka payment history.

**Then**

- Payment dapat dilihat kembali.

---

## AC-PY-004 — HABIS Payment

**Given**

- Sales Result = HABIS.
- Settlement valid.

**When**

- Payment belum dilakukan.

**Then**

- Settlement tetap dapat disimpan sebagai outstanding.
- Payment dapat dicatat pada kunjungan berikutnya.

---

## AC-PY-005 — TIDAK HABIS Payment

**Given**

- Sales Result = TIDAK HABIS.
- Reconciliation selesai.
- Settlement telah dibuat.

**When**

- User mencatat payment.

**Then**

- Payment dapat dicatat.

---

## AC-PY-006 — Outstanding Does Not Block Delivery

**Given**

- Agent memiliki outstanding.

**When**

- User membuat delivery baru untuk Agent tersebut.

**Then**

- Delivery tetap dapat dilakukan.

Outstanding tetap tercatat.

---

# 17. Operational Tasks

## AC-TK-001 — Delivery Task

**Given**

- Delivery belum dikonfirmasi.

**When**

- Dashboard/task list dibuka.

**Then**

- Delivery muncul sebagai operational task.

---

## AC-TK-002 — Reconciliation Task

**Given**

- Sales Result = TIDAK HABIS.
- Reconciliation belum selesai.

**When**

- Dashboard/task list dibuka.

**Then**

- Reconciliation muncul sebagai task.

---

## AC-TK-003 — Payment Collection Task

**Given**

- Settlement masih outstanding.

**When**

- Dashboard/task list dibuka.

**Then**

- Outstanding dapat ditampilkan sebagai payment collection task.

---

## AC-TK-004 — Task Resolution

**Given**

- Reconciliation task aktif.

**When**

- Reconciliation selesai.

**Then**

- Task tidak lagi muncul sebagai active task.

---

# 18. Dashboard

## AC-DB-001 — Operational Summary

**Given**

- Terdapat delivery, reconciliation, dan outstanding.

**When**

- User membuka Dashboard.

**Then**

- Dashboard menampilkan kondisi operasional tersebut.

---

## AC-DB-002 — Today's Priority

**Given**

- Beberapa task aktif.

**When**

- User membuka Dashboard.

**Then**

- User dapat mengetahui Agent yang perlu dikunjungi dan aktivitas yang perlu dilakukan.

---

## AC-DB-003 — Dashboard Uses Source Data

**Given**

- Delivery telah dikonfirmasi.

**When**

- Dashboard dibuka.

**Then**

- Dashboard mencerminkan kondisi delivery berdasarkan transaksi aktual.

Dashboard tidak memiliki data transaksi terpisah.

---

# 19. Reports

## AC-RP-001 — Product Report

**Given**

- Terdapat Production, Delivery, Sold, dan Return.

**When**

- User membuka Product Report.

**Then**

- Sistem dapat menampilkan metrik terkait:

```text id="r8c0d5"
Produced
Delivered
Sold
Returned
Gross Sales
Sell-through
```

---

## AC-RP-002 — Agent Report

**Given**

- Agent memiliki histori transaksi.

**When**

- User membuka Agent Report.

**Then**

- Sistem dapat menampilkan:

```text id="o0n2q3"
Delivered
Sold
Returned
Sell-through
Gross Sales
Fee
Net
Payment
Outstanding
```

---

## AC-RP-003 — Inventory Report

**Given**

- Terdapat stock movement.

**When**

- User membuka Inventory Report.

**Then**

- Sistem menampilkan informasi inventory berdasarkan movement.

---

## AC-RP-004 — Historical Consistency

**Given**

- Harga Product berubah.

**When**

- User membuka report periode lama.

**Then**

- Nilai historis tidak berubah hanya karena master data berubah.

---

# 20. Search & History

## AC-SR-001 — Search Agent

**Given**

- Terdapat beberapa Agent.

**When**

- User mencari nama Agent.

**Then**

- Sistem menampilkan Agent yang sesuai.

---

## AC-SR-002 — Search Product

**Given**

- Terdapat beberapa Product Variant.

**When**

- User melakukan pencarian.

**Then**

- Sistem menampilkan Product Variant yang sesuai.

---

## AC-SR-003 — Transaction Traceability

**Given**

- Terdapat Settlement.

**When**

- User membuka Settlement Detail.

**Then**

- User dapat mengetahui Delivery yang menjadi sumbernya.

---

## AC-SR-004 — Payment Traceability

**Given**

- Payment terkait Settlement.

**When**

- User membuka Payment.

**Then**

- User dapat mengetahui Settlement yang dibayar.

---

# 21. Stock Adjustment

## AC-AD-001 — Create Adjustment

**Given**

- User memiliki alasan adjustment yang valid.

**When**

- User memasukkan Product Variant, quantity, dan reason.

**Then**

- Adjustment tersimpan.
- Stock Movement Adjustment dibuat.

---

## AC-AD-002 — Adjustment Reason Required

**Given**

- User melakukan stock adjustment.

**When**

- Reason tidak dipilih.

**Then**

- Sistem menolak penyimpanan.

---

## AC-AD-003 — Adjustment Traceability

**Given**

- Adjustment telah dibuat.

**When**

- User membuka stock movement history.

**Then**

- Adjustment dapat ditelusuri dengan alasan dan sumbernya.

---

# 22. Data Integrity

## AC-DI-001 — Atomic Transaction

**Given**

- Sebuah operasi terdiri dari beberapa perubahan data.

**When**

- Salah satu bagian gagal disimpan.

**Then**

- Sistem tidak meninggalkan transaksi setengah selesai.

---

## AC-DI-002 — Historical Master Changes

**Given**

- Product atau Agent memiliki transaksi historis.

**When**

- Master data diubah.

**Then**

- Transaksi historis tetap konsisten.

---

## AC-DI-003 — No Destructive Delete

**Given**

- Product/Agent telah digunakan dalam transaksi.

**When**

- User mencoba menghapusnya secara permanen.

**Then**

- Sistem mencegah penghapusan destruktif.

---

## AC-DI-004 — Stable IDs

**Given**

- Entitas memiliki transaksi terkait.

**When**

- Master data diubah.

**Then**

- Entity ID tetap sama.

---

# 23. Backup

## AC-BK-001 — Manual Backup

**Given**

- Google Account tersedia.
- Internet tersedia.

**When**

- User memilih Backup Now.

**Then**

- Database backup dibuat.
- Backup dikirim ke Google Drive.
- Last Successful Backup diperbarui.

---

## AC-BK-002 — Backup Failure

**Given**

- Internet gagal atau upload gagal.

**When**

- User menjalankan backup.

**Then**

- Backup ditandai gagal.
- Local database tidak berubah.
- Data operasional tetap tersedia.

---

## AC-BK-003 — No Google Account

**Given**

- User tidak memiliki Google Account terhubung.

**When**

- User membuka aplikasi.

**Then**

- Operasional inti tetap dapat digunakan.
- Backup Google Drive tidak tersedia.

---

## AC-BK-004 — Backup Does Not Delete Local Data

**Given**

- Backup berhasil.

**When**

- Proses backup selesai.

**Then**

- Database lokal tetap tersedia.

---

# 24. Future Compatibility

## AC-FU-001 — Stable Entity Identity

**Given**

- Data tersimpan di local database.

**When**

- Data nantinya dipindahkan melalui API.

**Then**

- Entity memiliki identifier stabil yang dapat digunakan dalam proses migrasi/sync.

---

## AC-FU-002 — Business Logic Independence

**Given**

- Business operation berjalan pada local database.

**When**

- Persistence layer nantinya diganti atau ditambahkan remote API.

**Then**

- Business logic tidak harus bergantung langsung pada implementasi SQLite.

---

# 25. End-to-End Acceptance Scenario

Acceptance test utama harus dapat menjalankan satu siklus penuh.

## AC-E2E-001 — HABIS

**Given**

```text id="7j1vli"
Product:
Coklat
Price:
Rp3.000

Agent:
Agent A
Fee:
Rp500

Production:
80
```

**When**

```text id="8y6z7t"
1. Production dibuat
2. Delivery Plan = 50
3. Actual Delivery = 50
4. Sales Result = HABIS
5. Settlement dibuat
6. Invoice dibuat
7. Payment dicatat
```

**Then**

```text id="8kml5r"
Production = 80
Delivery = 50
Sold = 50
Return = 0

Gross = Rp150.000
Fee = Rp25.000
Net = Rp125.000

Payment = Rp125.000
Outstanding = Rp0
```

Inventory juga harus konsisten.

---

# 26. End-to-End Acceptance Scenario — TIDAK HABIS

## AC-E2E-002

**Given**

```text id="4n0u2x"
Product:
Coklat
Price:
Rp3.000

Agent:
Agent A
Fee:
Rp500

Production:
80
```

**When**

```text id="4vl5ny"
1. Production dibuat
2. Delivery Plan = 50
3. Actual Delivery = 50
4. Sales Result = TIDAK HABIS
5. Return = 12
6. Reconciliation
7. Settlement
8. Invoice
9. Payment
```

**Then**

```text id="8s4v0e"
Delivered = 50
Returned = 12
Sold = 38

Gross = Rp114.000
Fee = Rp19.000
Net = Rp95.000

Payment = Rp95.000
Outstanding = Rp0
```

Inventory:

```text id="qpxzq4"
Owner:
Production +80
Delivery -50
Return +12

Agent:
Delivery +50
Sold -38
Return -12
```

Hasil akhir harus konsisten dengan Stock Movement.

---

# 27. End-to-End Outstanding Scenario

## AC-E2E-003

**Given**

```text id="4b5v2q"
HABIS
Sold = 50
Net Settlement = Rp125.000
```

**When**

- User membuat settlement tetapi belum mencatat payment.

**Then**

```text id="mkw8sh"
Settlement = Outstanding
Outstanding = Rp125.000
```

**When**

- Agent menerima delivery baru pada hari berikutnya.

**Then**

- Delivery baru tetap dapat dibuat.
- Outstanding lama tetap tercatat.

---

# 28. End-to-End Historical Price Scenario

## AC-E2E-004

**Given**

```text id="k8i6g5"
Hari 1:
Price = Rp3.000
Fee = Rp500
Sold = 40
```

**When**

- Settlement dibuat.
- Kemudian price berubah menjadi Rp3.500.
- Fee berubah menjadi Rp600.

**Then**

- Settlement Hari 1 tetap:

```text id="v0w8r5"
Price = Rp3.000
Fee = Rp500
Gross = Rp120.000
Fee Total = Rp20.000
Net = Rp100.000
```

---

# 29. End-to-End Offline Scenario

## AC-E2E-005

**Given**

- Device tidak memiliki internet.

**When**

```text id="2tmxwu"
1. User membuat Production
2. User melakukan Delivery
3. User mencatat HABIS
4. User membuat Settlement
5. User membuat Invoice
6. User mencatat Payment
```

**Then**

- Seluruh operasi berhasil.
- Data tersimpan lokal.
- Tidak diperlukan koneksi internet.

---

# 30. Operational UX Acceptance

## AC-UX-001

Dashboard harus memungkinkan user menemukan:

- Agent yang harus dikunjungi
- Delivery yang harus dilakukan
- TIDAK HABIS yang harus direkonsiliasi
- Outstanding yang perlu ditagih

tanpa harus membuka laporan terlebih dahulu.

---

## AC-UX-002

Setelah Delivery berhasil dikonfirmasi, user harus dapat melanjutkan ke Sales Confirmation tanpa harus melakukan navigasi panjang.

---

## AC-UX-003

Setelah memilih HABIS, user tidak boleh dipaksa melewati form reconciliation.

---

## AC-UX-004

Setelah memilih TIDAK HABIS, sistem harus menyediakan jalur langsung menuju reconciliation.

---

## AC-UX-005

Setelah reconciliation selesai, user harus dapat melanjutkan ke settlement.

---

## AC-UX-006

Setelah settlement selesai, user harus dapat membuat invoice dan/atau mencatat payment.

---

# 31. Error Handling Acceptance

## AC-ERR-001

Input quantity negatif harus ditolak.

## AC-ERR-002

Return melebihi actual delivery harus ditolak.

## AC-ERR-003

Delivery melebihi available Owner Stock harus ditolak.

## AC-ERR-004

Settlement tanpa sold quantity valid harus ditolak.

## AC-ERR-005

Settlement TIDAK HABIS tanpa reconciliation selesai harus ditolak.

## AC-ERR-006

Payment terhadap settlement yang tidak valid harus ditolak.

## AC-ERR-007

Backup gagal tidak boleh mengubah local database.

---

# 32. Regression Acceptance

Setiap perubahan pada aplikasi harus memastikan bahwa fungsi yang sudah diterima sebelumnya tetap berjalan.

Minimal regression area:

```text id="o7wq90"
Production
Inventory
Delivery
Sales
Reconciliation
Settlement
Invoice
Payment
Dashboard
Reports
Backup
```

Perubahan pada satu modul tidak boleh menyebabkan business rule modul lain berubah secara tidak sengaja.

---

# 33. Definition of Done

Sebuah feature dianggap **Done** apabila:

1. Functional Requirement terkait telah diimplementasikan.
2. Business Rule terkait tidak berubah.
3. Acceptance Criteria terkait terpenuhi.
4. Validasi input tersedia.
5. Data tersimpan secara konsisten.
6. Inventory tetap konsisten jika feature memengaruhi stock.
7. Historical snapshot benar jika diperlukan.
8. Error case utama telah diuji.
9. Regression test yang relevan lulus.
10. UX Flow terkait dapat diselesaikan.
11. Tidak ada dependency internet untuk fungsi core.
12. Dokumentasi terkait tetap sinkron.

---

# 34. Test Categories

Testing MVP minimal mencakup:

### Unit Test

Menguji:

- calculation
- validation
- business rules
- state transition

### Integration Test

Menguji:

- transaction persistence
- stock movement
- settlement
- invoice
- payment

### UI Test

Menguji:

- navigation
- form
- confirmation
- error feedback
- operational flow

### End-to-End Test

Menguji lifecycle:

```text id="5a1qcu"
Production
→ Delivery
→ HABIS
→ Settlement
→ Invoice
→ Payment
```

dan:

```text id="yspv3a"
Production
→ Delivery
→ TIDAK HABIS
→ Reconciliation
→ Settlement
→ Invoice
→ Payment
```

### Offline Test

Menguji seluruh core flow tanpa internet.

---

# 35. Acceptance Traceability

Acceptance Criteria harus dapat ditelusuri:

```text id="l3f0j7"
PRD
 ↓
Business Rule
 ↓
Functional Requirement
 ↓
UX Flow
 ↓
Acceptance Criteria
 ↓
Test
```

Contoh:

```text id="p7yxx9"
BR-RC-003
Sold = Delivered - Returned
        ↓
FR-RC-003
Calculate Sold
        ↓
UX-FLOW-RC-001
Physical Reconciliation
        ↓
AC-RC-002
Sold calculation test
```

---

# 36. Open Acceptance Criteria

Acceptance Criteria berikut menunggu keputusan Business Rules / Data Model:

| ID          | Topic                              | Status          | Keputusan |
| ----------- | ---------------------------------- | --------------- | --------- |
| OPEN-AC-001 | Partial payment                    | CONFIRMED       | Bagian 39, `AC-PY-008` (`D-03`) |
| OPEN-AC-002 | Overpayment                        | DEFERRED DESIGN | Bagian 39, `AC-PY-009` (`D-04`) |
| OPEN-AC-003 | Payment method                     | CONFIRMED       | `CASH/TRANSFER/QRIS/OTHER` (`D-05`) |
| OPEN-AC-004 | Transaction correction             | CONFIRMED       | Bagian 39, `AC-CR-001` (`D-07`) |
| OPEN-AC-005 | Delivery cancellation              | OPEN            | Di luar MVP |
| OPEN-AC-006 | Planned vs actual handling details | CONFIRMED       | Plan wajib, actual menjadi dasar (`D-02`) |
| OPEN-AC-007 | Restore backup                     | CONFIRMED       | Bagian 39, `AC-BK-006` (`D-12`) |
| OPEN-AC-008 | Authentication                     | CONFIRMED       | Tidak ada authentication (`D-11`) |
| OPEN-AC-009 | Draft transaction behavior         | CONFIRMED       | Tidak ada draft transaksi |
| OPEN-AC-010 | Exact transaction states           | CONFIRMED       | Bagian 39 (`D-10`) |

Dasar keputusan lengkap: `09-Decision-Log.md`.

---

# 37. Core Acceptance Principle

Aplikasi dianggap memenuhi MVP apabila pengguna dapat menjalankan:

```text id="h4h1du"
PRODUCTION
    ↓
OWNER STOCK
    ↓
DELIVERY
    ↓
AGENT STOCK
    ↓
┌───────────────┐
│               │
HABIS       TIDAK HABIS
│               │
│        RECONCILIATION
│               │
└───────┬───────┘
        ↓
    SETTLEMENT
        ↓
     INVOICE
        ↓
      PAYMENT
```

secara:

- benar secara bisnis
- konsisten secara inventory
- konsisten secara finansial
- dapat ditelusuri
- tetap berjalan offline
- dapat diuji secara objektif

---

# 38. Final Acceptance Principle

> **"Done" berarti bukan sekadar fitur dapat digunakan, tetapi hasilnya benar, data konsisten, histori tetap aman, dan alur bisnis dapat dipertanggungjawabkan.**

---

# 39. Acceptance Criteria dari Keputusan (`09-Decision-Log.md`)

## AC-PY-007 — Discount Reduces Payable

**Given**

- Net Settlement = Rp56.300
- Diskon manual = Rp300

**When**

- Invoice dibuat.

**Then**

- Tagihan yang harus dibayar = Rp56.000.
- `settlement.net_amount` tetap Rp56.300.

---

## AC-PY-008 — Underpayment Keeps Outstanding

**Given**

- Tagihan (Payable) = Rp56.000
- Pembayaran dicatat Rp50.000

**When**

- Settlement dibuka.

**Then**

- Outstanding = Rp6.000.
- Status belum lunas.

---

## AC-PY-009 — Overpayment Becomes Agent Credit

**Given**

- Tagihan (Payable) = Rp125.000
- Pembayaran dicatat Rp130.000

**When**

- Pembayaran disimpan.

**Then**

- Kelebihan Rp5.000 dicatat sebagai kredit Agent, bukan pendapatan.
- Perilaku ini diimplementasikan setelah desain entitas kredit disepakati.

---

## AC-BK-005 — Automatic Backup

**Given**

- Backup terakhir lebih tua dari 7 hari atau belum pernah ada.
- Akun Google tersedia.

**When**

- Aplikasi dibuka.

**Then**

- Backup dijalankan tanpa mengganggu operasional.
- Bila gagal, aplikasi tetap dapat digunakan dan database lokal tidak berubah.

---

## AC-BK-006 — Restore Rejects Invalid File

**Given**

- Database aktif berisi transaksi.

**When**

- User memilih file backup yang tidak valid atau tidak kompatibel.

**Then**

- Restore dibatalkan.
- Database aktif tidak berubah.

---

## AC-BK-007 — Restore After Validation

**Given**

- File backup valid dan kompatibel.

**When**

- User mengonfirmasi restore.

**Then**

- Safety backup database aktif dibuat terlebih dahulu.
- Database aktif digantikan oleh isi backup.
- Aplikasi dimuat ulang dan data hasil restore tersedia.

---

## AC-CR-001 — Correction Creates Reversing Movement

**Given**

- Delivery dikonfirmasi dan belum memiliki Sales Confirmation.

**When**

- User melakukan koreksi dengan alasan.

**Then**

- Stock movement pembalik dibuat dengan `source_type = CORRECTION`.
- Transaksi asal tetap ada dan ditandai sudah dikoreksi.
- Inventory kembali konsisten.

---

## AC-CR-002 — Correction Blocked After Downstream

**Given**

- Delivery sudah memiliki Sales Confirmation atau Reconciliation.

**When**

- User mencoba melakukan koreksi.

**Then**

- Sistem menolak koreksi dan menjelaskan alasannya.

---

## AC-DI-005 — Deactivation Keeps History

**Given**

- Product/Agent memiliki transaksi historis.

**When**

- Product/Agent dinonaktifkan.

**Then**

- Data historis tetap utuh dan dapat dibuka.
- Product/Agent tidak muncul pada pilihan transaksi baru.
- Bila masih ada stok atau outstanding, sistem menampilkan peringatan informatif tanpa memblokir.

---

## AC-IN-006 — Invoice Shows Discount

**Given**

- Invoice memiliki `discount_amount` > 0.

**When**

- PDF invoice dibuat.

**Then**

- PDF menampilkan Gross Sales, Agent Fee, Net Settlement, Diskon, dan Total Tagihan (setelah diskon).
