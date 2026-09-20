# 04-UX-Flows.md

**Version:** 1.0
**Status:** Confirmed
**Last Updated:** 2026-09-19
**Related Documents:**

- `01-PRD.md` v1.0
- `02-Business-Rules.md` v1.0
- `03-Functional-Requirements.md` v1.0

---

# 1. Purpose

Dokumen ini mendefinisikan alur interaksi utama pengguna dengan aplikasi Distribusi Konsinyasi.

UX Flow menjelaskan:

- tujuan pengguna
- titik awal aktivitas
- langkah yang dilakukan
- respons sistem
- kondisi bercabang
- hasil akhir aktivitas
- navigasi antar proses

Dokumen ini belum menentukan:

- warna
- typography
- layout pixel-level
- komponen UI secara detail
- framework UI
- implementasi Android

Prinsip utama:

> **Pengguna harus dapat menyelesaikan pekerjaan operasional dengan langkah sesedikit mungkin tanpa mengorbankan validitas data.**

---

# 2. UX Principles

## UX-001 — Operational First

Aplikasi harus mengutamakan pekerjaan yang benar-benar dilakukan setiap hari.

Prioritas utama:

1. Delivery
2. Konfirmasi hasil penjualan
3. Reconciliation
4. Settlement
5. Payment
6. Production
7. Inventory
8. Monitoring

---

## UX-002 — Task Oriented

Dashboard harus membantu menjawab:

> **"Hari ini saya harus mengunjungi siapa dan melakukan apa?"**

Pengguna tidak seharusnya harus membuka banyak menu hanya untuk mengetahui pekerjaan hari ini.

---

## UX-003 — Minimum Input

Jika data dapat dihitung oleh sistem, pengguna tidak perlu memasukkannya secara manual.

Contoh:

```text
Actual Delivery = 50
Return = 12

System:
Sold = 50 - 12 = 38
```

Pengguna hanya memasukkan data yang benar-benar diketahui secara fisik.

---

## UX-004 — Physical Reality First

Untuk proses konsinyasi, data fisik menjadi sumber input utama.

Contoh:

Agent tidak diminta memasukkan:

```text
Coklat sold = 20
Strawberry sold = 15
```

Agent cukup memberikan:

```text
HABIS / TIDAK HABIS
```

Jika TIDAK HABIS, petugas menghitung barang fisik yang dikembalikan.

---

## UX-005 — Separate Business States

UX harus membedakan:

```text
Delivery
Sales
Reconciliation
Settlement
Payment
```

Pengguna tidak boleh menganggap kelima aktivitas tersebut sebagai satu transaksi yang sama.

---

## UX-006 — Safe by Default

Operasi yang berpotensi mengubah inventory atau nilai finansial harus memberikan konfirmasi dan validasi yang memadai.

---

## UX-007 — Offline by Default

Tidak boleh terdapat UI yang membuat pengguna merasa aplikasi harus online untuk menjalankan operasi inti.

Status internet bukan bagian dari alur operasional normal.

---

# 3. Application Navigation

Struktur navigasi konseptual MVP:

```text
Dashboard
│
├── Operasional
│   ├── Delivery
│   ├── Sales Confirmation
│   ├── Reconciliation
│   ├── Settlement
│   └── Payment
│
├── Produksi & Stok
│   ├── Production
│   └── Inventory
│
├── Master Data
│   ├── Product / Variant
│   └── Agent
│
├── Reports
│   ├── Product
│   ├── Agent
│   └── Inventory
│
└── Settings
    ├── Business Profile
    ├── User Profile
    └── Backup
```

Dashboard tetap menjadi entry point utama.

---

# 4. Daily Operational Flow

Alur operasional utama:

```text
START
  ↓
Dashboard
  ↓
Lihat tugas hari ini
  ↓
Delivery
  ↓
Konfirmasi Actual Delivery
  ↓
Agent menerima barang
  ↓
Sales Result
  ↓
 ┌─────────────────────┐
 │                     │
HABIS              TIDAK HABIS
 │                     │
 │               Reconciliation
 │                     │
 └──────────┬──────────┘
            ↓
        Settlement
            ↓
        Invoice
            ↓
          Payment
            ↓
           END
```

Tidak semua proses harus dilakukan dalam satu kunjungan.

---

# 5. Dashboard Flow

## UX-FLOW-DB-001 — Open Dashboard

### Goal

Mengetahui pekerjaan yang harus dilakukan hari ini.

### Flow

```text
Open App
   ↓
Dashboard
   ↓
System loads current operational state
   ↓
Display prioritized tasks
```

### Dashboard dapat menampilkan:

```text
Hari ini

Delivery
3 Agent

TIDAK HABIS
2 Agent

Outstanding
Rp xxx.xxx

Low Stock
3 Variant
```

### Primary Action

Pengguna dapat langsung memilih aktivitas yang perlu dilakukan.

---

# 6. Delivery Planning Flow

## UX-FLOW-DP-001 — Create Delivery Plan

### Goal

Menentukan barang yang akan dibawa untuk Agent.

### Flow

```text
Dashboard
   ↓
Delivery
   ↓
Create Delivery Plan
   ↓
Select Agent
   ↓
Select Product / Variant
   ↓
Input Planned Quantity
   ↓
Review
   ↓
Save Plan
```

### System

Sistem menyimpan:

- Agent
- Product/Variant
- Planned Quantity
- Date
- Plan status

### Important

Delivery Plan belum mengurangi Owner Stock.

---

# 7. Delivery Confirmation Flow

## UX-FLOW-DC-001 — Confirm Actual Delivery

### Goal

Mencatat barang yang benar-benar dikirim.

### Flow

```text
Delivery Task
   ↓
Select Agent
   ↓
View Delivery Plan
   ↓
Review Planned Quantity
   ↓
Input / Confirm Actual Quantity
   ↓
Review Actual Delivery
   ↓
Confirm Delivery
   ↓
Stock Movement
Owner → Agent
```

### Example

Planned:

```text
Coklat       50
Strawberry   30
```

Actual:

```text
Coklat       48
Strawberry   30
```

Sistem menggunakan:

```text
Actual Delivery
Coklat       48
Strawberry   30
```

bukan planned quantity.

### Setelah Confirm

Status delivery:

```text
CONFIRMED
```

dan Agent Stock bertambah sesuai actual delivery.

---

# 8. Same-Day Delivery Flow

Jika delivery dilakukan cepat pada hari yang sama, sistem menyediakan jalur **Plan Cepat** dalam satu layar:

```text
Delivery
   ↓
Select Agent
   ↓
Input Planned Quantity
   ↓
Input Actual Delivery
   ↓
Review
   ↓
Confirm
```

Delivery Plan tetap tersimpan (`BR-DC-003`), sehingga planned quantity dan actual quantity tetap dapat dibedakan.

**Status: CONFIRMED** — Delivery Plan wajib tersedia pada level data. Jalur operasional tanpa planning tidak disediakan.

Dasar keputusan: `D-02` (`09-Decision-Log.md`).

---

# 9. Sales Confirmation Flow

## UX-FLOW-SC-001 — Record Sales Result

### Goal

Mencatat hasil penjualan Agent.

### Flow

```text
Agent
   ↓
Select Active Delivery
   ↓
Record Sales Result
   ↓
Choose:
   ├── HABIS
   └── TIDAK HABIS
```

---

# 10. HABIS Flow

## UX-FLOW-SC-002

### User Input

```text
HABIS
```

### System

Sistem otomatis menetapkan:

```text
Sold = Actual Delivery
Return = 0
```

### Flow

```text
Sales Result
   ↓
HABIS
   ↓
System calculates Sold
   ↓
No Physical Reconciliation
   ↓
Settlement
   ↓
Invoice
   ↓
Payment
```

### Important UX Principle

Pengguna tidak perlu memasukkan jumlah sold per variant.

Karena status HABIS berarti seluruh actual delivery dianggap terjual.

---

# 11. TIDAK HABIS Flow

## UX-FLOW-SC-003

### User Input

```text
TIDAK HABIS
```

### System

Sistem mengarahkan pengguna ke reconciliation.

```text
Sales Result
   ↓
TIDAK HABIS
   ↓
Reconciliation Required
```

Tidak boleh langsung masuk settlement sebelum reconciliation selesai.

---

# 12. Reconciliation Flow

## UX-FLOW-RC-001

### Goal

Mencocokkan barang yang dikirim dengan barang yang kembali secara fisik.

### Flow

```text
TIDAK HABIS
   ↓
Start Reconciliation
   ↓
System displays Actual Delivery
   ↓
User counts physical returns
   ↓
Input Return per Variant
   ↓
System calculates Sold
   ↓
Validate
   ↓
Review
   ↓
Confirm Reconciliation
```

### Example

```text
Actual Delivery

Coklat       40
Strawberry   30

Physical Return

Coklat        8
Strawberry    5
```

System:

```text
Sold

Coklat       32
Strawberry   25

Total Sold   57
Total Return 13
```

Validation:

```text
57 + 13 = 70
```

---

# 13. Reconciliation Error Flow

Jika user memasukkan return lebih besar daripada actual delivery:

```text
Return > Actual Delivery
```

Sistem harus menolak penyimpanan dan menampilkan informasi kesalahan.

Contoh:

```text
Jumlah kembali tidak boleh melebihi jumlah yang dikirim.
```

Pengguna kembali ke input reconciliation.

---

# 14. Return Collection Flow

Untuk TIDAK HABIS, aktivitas fisik yang dilakukan bersamaan:

```text
TIDAK HABIS
   ↓
Hitung Return
   ↓
Ambil Barang Return
   ↓
Ambil Insulated Box
   ↓
Confirm Reconciliation
```

Secara sistem, barang return menghasilkan:

```text
Agent Stock → Owner Stock
```

---

# 15. Settlement Flow

## UX-FLOW-ST-001

### Goal

Menghitung kewajiban Agent berdasarkan barang yang terjual.

### Flow

```text
Sales / Reconciliation
   ↓
Settlement
   ↓
System loads:
    Sold
    Selling Price
    Agent Fee
   ↓
Calculate
    Gross
    Fee
    Net
   ↓
Review
   ↓
Confirm Settlement
```

### Example

```text
Sold          46
Price     Rp3.000
Gross     Rp138.000

Fee/unit     Rp500
Fee Total    Rp23.000

Net        Rp115.000
```

User tidak perlu menghitung manual.

---

# 16. Settlement Review

Sebelum settlement dikonfirmasi, sistem menampilkan ringkasan:

```text
Agent: Agent A

Sold
46 batang

Gross Sales
Rp138.000

Agent Fee
Rp23.000

Net Settlement
Rp115.000
```

User melakukan:

```text
[ Kembali ]    [ Konfirmasi ]
```

Setelah dikonfirmasi, nilai settlement menjadi histori transaksi.

---

# 17. Invoice Flow

## UX-FLOW-IN-001

### Flow

```text
Settlement
   ↓
Generate Invoice
   ↓
System creates Invoice
   ↓
Generate PDF
   ↓
Preview / Share
```

User dapat:

```text
Share
```

menggunakan Android Share Sheet.

Tidak diperlukan integrasi langsung dengan WhatsApp.

---

# 18. Payment Flow

## UX-FLOW-PY-001 — Record Payment

### Flow

```text
Settlement
   ↓
Payment
   ↓
Review Outstanding
   ↓
Record Payment
   ↓
Confirm
   ↓
Settlement Status = PAID
```

Untuk pembayaran penuh.

---

# 19. HABIS Payment Flow

HABIS dapat diselesaikan tanpa kunjungan ulang:

```text
HABIS
  ↓
Settlement
  ↓
Invoice
  ↓
Outstanding
  ↓
Payment
```

Pembayaran dapat:

- dilakukan saat settlement
- dilakukan pada kunjungan berikutnya

---

# 20. TIDAK HABIS Payment Flow

TIDAK HABIS membutuhkan aktivitas fisik:

```text
TIDAK HABIS
   ↓
Visit Agent
   ↓
Reconciliation
   ↓
Return Collection
   ↓
Settlement
   ↓
Invoice
   ↓
Payment
```

---

# 21. Outstanding Collection Flow

## UX-FLOW-PY-002

Jika settlement belum dibayar:

```text
Dashboard
   ↓
Outstanding
   ↓
Select Agent / Settlement
   ↓
Review Outstanding
   ↓
Record Payment
   ↓
Confirm
```

Setelah pembayaran penuh:

```text
Outstanding → Paid
```

---

# 22. Next-Day Delivery Flow

Outstanding atau hasil TIDAK HABIS dari hari sebelumnya tidak otomatis menghilangkan Agent dari delivery berikutnya.

Contoh:

```text
Hari sebelumnya:
Agent A
- TIDAK HABIS
- Outstanding

Hari berikutnya:
Agent A
- Tetap dapat menerima delivery baru
- Outstanding tetap ditampilkan
- Collection task tetap tersedia
```

UX harus mampu menampilkan kondisi tersebut secara bersamaan.

---

# 23. Production Flow

## UX-FLOW-PD-001

### Goal

Mencatat produksi aktual.

### Flow

```text
Production
   ↓
Create Batch
   ↓
Select Product / Variant
   ↓
Input Actual Quantity
   ↓
Add Variant
   ↓
Review Batch
   ↓
System calculates Total
   ↓
Confirm Production
   ↓
Owner Stock increases
```

### Example

```text
Batch 001

Coklat       41
Strawberry   42
Bubble Gum   40

Total       123
```

---

# 24. Production Correction Flow

Jika terdapat kesalahan pencatatan:

```text
Production History
   ↓
Select Batch
   ↓
Correction
   ↓
Input Correction Reason
   ↓
Review Inventory Impact
   ↓
Confirm
```

Koreksi tidak dilakukan dengan mengubah angka stock secara langsung.

Detail mekanisme koreksi akan ditentukan pada Data Model dan Acceptance Criteria.

---

# 25. Inventory Flow

## UX-FLOW-IV-001

### Flow

```text
Inventory
   ↓
Select Product / Variant
   ↓
View Stock
   ↓
View Movement History
```

Contoh:

```text
Coklat

Owner Stock
72

Agent Stock
48

Total in System
120
```

Pengguna dapat membuka histori:

```text
Production +80
Delivery   -50
Return     +10
Waste       -8
```

---

# 26. Stock Adjustment Flow

## UX-FLOW-IV-002

### Flow

```text
Inventory
   ↓
Stock Adjustment
   ↓
Select Product / Variant
   ↓
Input Quantity
   ↓
Select Reason
   ↓
Optional Note
   ↓
Review
   ↓
Confirm
```

Reason:

- Damaged goods
- Melted/unusable
- Production error
- Tester/sample
- Loss
- Stock opname correction

Adjustment menghasilkan stock movement yang dapat ditelusuri.

---

# 27. Low Stock Flow

## UX-FLOW-IV-003

```text
Inventory
   ↓
System evaluates:
Stock In Hand <= Threshold
   ↓
Low Stock Indicator
```

Low stock hanya memberikan informasi.

Tidak ada automatic purchase order atau production order.

---

# 28. Product Management Flow

## UX-FLOW-PR-001

### Add Product

```text
Product
   ↓
Add
   ↓
Input:
Name
Selling Price
Description
   ↓
Save
```

### Edit Product

```text
Product
   ↓
Select Product
   ↓
Edit
   ↓
Save
```

### Deactivate

```text
Product Detail
   ↓
Deactivate
   ↓
Confirmation
   ↓
Inactive
```

Product inactive tidak dapat digunakan untuk transaksi baru.

Histori tetap tersedia.

---

# 29. Agent Management Flow

## UX-FLOW-AG-001

### Add Agent

```text
Agent
   ↓
Add
   ↓
Input:
Name
Contact
Address / Location
Fee per Unit
   ↓
Save
```

### Edit Agent

```text
Agent
   ↓
Select Agent
   ↓
Edit
   ↓
Save
```

### Deactivate Agent

```text
Agent Detail
   ↓
Deactivate
   ↓
Confirmation
   ↓
Inactive
```

Agent inactive tidak digunakan untuk delivery baru.

Histori tetap tersedia.

---

# 30. Agent Detail Flow

Agent Detail menjadi salah satu titik navigasi penting.

Informasi dapat dikelompokkan:

```text
Agent A

Contact
Status
Fee / Unit

Today's Activity
Delivery
Sales Result
Outstanding

History
Delivery
Sales
Settlement
Payment
```

Tujuannya agar pengguna dapat memahami kondisi Agent tanpa harus membuka banyak menu.

---

# 31. Operational Task Flow

## UX-FLOW-TK-001

Dashboard menampilkan task berdasarkan kondisi transaksi.

Contoh:

```text
TODAY

3 Delivery
2 Reconciliation
1 Payment Collection
```

Ketika user memilih task:

```text
Task
 ↓
Related Transaction
 ↓
Perform Action
 ↓
Transaction Updated
 ↓
Task Resolved
```

Task bukan data transaksi baru.

---

# 32. Daily Route Flow

Untuk pekerjaan lapangan, UX harus memungkinkan pola:

```text
Dashboard
   ↓
Today's Agents
   ↓
Agent A
   ↓
Delivery
   ↓
Sales Result
   ↓
Settlement / Reconciliation
   ↓
Agent B
   ↓
...
```

Pengguna tidak harus kembali ke menu utama setelah setiap Agent.

Tujuan:

> Meminimalkan perpindahan layar selama kunjungan lapangan.

---

# 33. Agent Visit — HABIS

Flow operasional:

```text
Select Agent
   ↓
Delivery Confirmation
   ↓
Sales Result = HABIS
   ↓
Settlement
   ↓
Invoice
   ↓
Payment? ── No → Outstanding
   │
  Yes
   ↓
Next Agent
```

Jika payment dilakukan kemudian, user tidak perlu melakukan reconciliation.

---

# 34. Agent Visit — TIDAK HABIS

Flow operasional:

```text
Select Agent
   ↓
Delivery Confirmation
   ↓
Sales Result = TIDAK HABIS
   ↓
Physical Count
   ↓
Reconciliation
   ↓
Collect Return
   ↓
Collect Insulated Box
   ↓
Settlement
   ↓
Invoice
   ↓
Payment
   ↓
Next Agent
```

---

# 35. End-of-Day Flow

Setelah seluruh kunjungan selesai:

```text
Dashboard
   ↓
Review Today's Tasks
   ↓
Check:
    Unconfirmed Delivery
    Unreconciled TIDAK HABIS
    Outstanding
    Low Stock
    Production
   ↓
Complete remaining operational tasks
```

Tidak harus semua outstanding diselesaikan pada hari yang sama.

Outstanding tetap tercatat sebagai kewajiban.

---

# 36. Backup Flow

## UX-FLOW-BK-001

Backup bukan bagian dari operational flow harian wajib.

### Flow

```text
Settings
   ↓
Backup
   ↓
Check Google Account
   ↓
Backup Now
   ↓
Create Backup
   ↓
Upload to Google Drive
   ↓
Success
```

Jika Google Account belum terhubung:

```text
Backup
   ↓
Google Account Required
   ↓
Connect Google Account
```

Jika internet tidak tersedia:

```text
Backup Failed
```

Tetapi:

```text
Local Database = Unchanged
```

---

# 37. Backup Status

Screen Backup dapat menampilkan:

```text
Google Account
Connected

Last Successful Backup
19 Sep 2026, 18:32

Status
Up to date
```

Jika belum pernah backup:

```text
Last Backup
Never
```

---

# 38. Restore Flow

**Status: CONFIRMED** — restore tersedia pada MVP dan diimplementasikan pada fase akhir.

```text
Backup
   ↓
Restore
   ↓
Warning (dampak: database aktif akan digantikan)
   ↓
Select Backup File
   ↓
Validate Backup
   ↓
Safety Backup database aktif
   ↓
Confirm
   ↓
Restore
   ↓
Reload Application
```

Jika validasi gagal:

```text
Restore dibatalkan
Database aktif tidak berubah
```

Dasar keputusan: `D-12` (`09-Decision-Log.md`).

---

# 39. Search Flow

## UX-FLOW-SR-001

Search dapat digunakan pada master maupun histori.

### Agent

```text
Agent
   ↓
Search
   ↓
Input keyword
   ↓
Results
   ↓
Agent Detail
```

### Product

```text
Product
   ↓
Search
   ↓
Input keyword
   ↓
Results
```

---

# 40. Historical Transaction Flow

Pengguna dapat membuka histori dari beberapa titik.

Contoh:

```text
Agent Detail
   ↓
Settlement History
   ↓
Settlement Detail
   ↓
Invoice
   ↓
Payment
```

atau:

```text
Product Detail
   ↓
Transaction History
   ↓
Delivery / Production / Return
```

Tujuan utama:

> Data lama harus dapat ditelusuri kembali ke sumber transaksi.

---

# 41. Error & Validation UX

Validasi harus diberikan sedekat mungkin dengan sumber kesalahan.

Contoh:

### Invalid Quantity

```text
Jumlah harus lebih besar dari atau sama dengan 0.
```

### Return Exceeds Delivery

```text
Jumlah kembali tidak boleh melebihi jumlah yang dikirim.
```

### Settlement Without Reconciliation

```text
Reconciliation belum selesai.
Settlement belum dapat dibuat.
```

### Insufficient Owner Stock

```text
Stock tidak mencukupi untuk delivery ini.
```

### Backup Failure

```text
Backup gagal.
Data lokal tetap aman.
Silakan coba lagi ketika koneksi tersedia.
```

---

# 42. Confirmation UX

Konfirmasi diperlukan untuk tindakan yang memiliki dampak signifikan.

Minimal:

- Confirm Production
- Confirm Delivery
- Confirm Reconciliation
- Confirm Settlement
- Confirm Payment
- Stock Adjustment
- Deactivate Product
- Deactivate Agent
- Restore Backup

Konfirmasi harus menjelaskan dampak tindakan secara singkat.

---

# 43. Navigation Rules

## UX-NAV-001

User dapat kembali dari detail ke daftar tanpa kehilangan data yang sudah tersimpan.

## UX-NAV-002

Setelah transaksi berhasil, sistem sebaiknya menawarkan next action yang relevan.

Contoh:

```text
Delivery berhasil.

[Catat Hasil Penjualan]
[Ke Dashboard]
```

## UX-NAV-003

Setelah HABIS:

```text
[Settlement]
```

menjadi next action utama.

## UX-NAV-004

Setelah TIDAK HABIS:

```text
[Reconciliation]
```

menjadi next action utama.

## UX-NAV-005

Setelah Reconciliation:

```text
[Settlement]
```

menjadi next action utama.

## UX-NAV-006

Setelah Settlement:

```text
[Generate Invoice]
[Catat Payment]
```

dapat menjadi next action.

---

# 44. Unsaved Data

Jika pengguna meninggalkan form yang belum disimpan:

```text
Data belum disimpan.

[Batalkan]
[Lanjut Edit]
```

Sistem tidak boleh secara diam-diam menyimpan transaksi setengah jadi sebagai transaksi final.

Draft behavior dapat ditentukan kemudian jika memang diperlukan.

---

# 45. Empty State

Setiap daftar utama harus memiliki kondisi kosong yang informatif.

Contoh:

### Belum ada Agent

```text
Belum ada Agent.

Tambahkan Agent untuk mulai melakukan distribusi.
[Tambah Agent]
```

### Belum ada Product

```text
Belum ada Product.

Tambahkan Product untuk mulai mencatat produksi.
[Tambah Product]
```

### Tidak ada Outstanding

```text
Tidak ada outstanding.
```

Empty state harus membantu user mengambil tindakan berikutnya bila relevan.

---

# 46. Success Feedback

Setelah transaksi berhasil disimpan, sistem harus memberikan feedback yang jelas.

Contoh:

```text
✓ Delivery berhasil dikonfirmasi
```

atau:

```text
✓ Reconciliation berhasil
Sold: 57
Return: 13
```

Feedback tidak perlu mengganggu alur operasional.

---

# 47. Operational Shortcut Principle

Untuk aktivitas yang sering dilakukan, aplikasi sebaiknya menyediakan shortcut dari Dashboard.

Contoh:

```text
Today's Delivery
    ↓
Agent A
    ↓
Confirm Delivery
```

daripada:

```text
Dashboard
 → Delivery
 → Delivery Plan
 → Agent
 → Detail
 → Confirm
```

Shortcut tidak mengubah struktur data atau business rule.

---

# 48. UX State Model

Secara konseptual transaksi dapat memiliki kondisi:

```text
PLANNED
   ↓
DELIVERED
   ↓
SALES CONFIRMED
   ↓
 ┌─────────────┐
 │             │
HABIS      TIDAK HABIS
 │             │
 │        RECONCILED
 │             │
 └──────┬──────┘
        ↓
   SETTLED
        ↓
     INVOICED
        ↓
 PAID / OUTSTANDING
```

Status detail dan state transition final akan diselaraskan dengan Data Model dan Acceptance Criteria.

---

# 49. UX Must Not Do

UX tidak boleh:

1. Menganggap Planned Delivery sebagai Actual Delivery.
2. Menganggap Delivery sebagai Sales.
3. Meminta user menghitung Sold jika sistem dapat menghitungnya.
4. Membolehkan settlement TIDAK HABIS sebelum reconciliation.
5. Mengubah stock secara langsung tanpa transaksi.
6. Menghapus histori hanya karena master data dinonaktifkan.
7. Memaksa internet untuk operasi inti.
8. Memaksa Google Account untuk operasi lokal.
9. Menganggap settlement sebagai payment.
10. Menghilangkan Agent dari delivery berikutnya hanya karena memiliki outstanding atau return sebelumnya.

---

# 50. UX Priorities

Jika terdapat trade-off antara kelengkapan informasi dan kecepatan operasional, desain harus mempertimbangkan:

### Level 1 — Operasional Lapangan

- Delivery
- Sales Result
- Reconciliation
- Settlement
- Payment

### Level 2 — Produksi & Inventory

- Production
- Stock
- Adjustment
- Low Stock

### Level 3 — Monitoring

- Dashboard
- Reports
- Analytics

### Level 4 — Administration

- Product
- Agent
- Business Profile
- User Profile
- Backup

---

# 51. UX Evolution Principle

MVP harus memiliki UX sederhana untuk satu user dan satu device.

UX tidak perlu menyediakan:

- multi-user workspace
- role switching
- sync status
- conflict resolution
- server connection management
- multi-device management

Namun navigasi dan struktur data tidak boleh menghalangi fitur-fitur tersebut pada fase berikutnya.

---

# 52. Open UX Decisions

| ID          | Topic                                                     | Status | Keputusan |
| ----------- | --------------------------------------------------------- | ------ | --------- |
| OPEN-UX-001 | Apakah Delivery Planning selalu wajib atau dapat dilewati | CONFIRMED | Wajib + jalur "Plan Cepat" (`D-02`) |
| OPEN-UX-002 | Detail transaction correction flow                        | CONFIRMED | Koreksi via movement pembalik sebelum ada turunan (`D-07`) |
| OPEN-UX-003 | Partial payment flow                                      | CONFIRMED | Pembayaran boleh kurang dari kewajiban (`D-03`) |
| OPEN-UX-004 | Overpayment flow                                          | DEFERRED DESIGN | Menjadi kredit Agent (`D-04`) |
| OPEN-UX-005 | Payment method UI                                         | CONFIRMED | `CASH/TRANSFER/QRIS/OTHER` (`D-05`) |
| OPEN-UX-006 | Delivery cancellation flow                                | OPEN   | Di luar MVP |
| OPEN-UX-007 | Restore backup UX                                         | CONFIRMED | Bab 38 (`D-12`) |
| OPEN-UX-008 | Authentication UX                                         | CONFIRMED | Tidak ada authentication (`D-11`) |
| OPEN-UX-009 | Draft transaction behavior                                | CONFIRMED | Tidak ada draft transaksi (`09-Decision-Log.md` bagian 6) |
| OPEN-UX-010 | Final dashboard layout                                    | OPEN   | Ditentukan saat Fase 7 |

Detail lengkap: `09-Decision-Log.md`.

---

# 53. UX Acceptance Principles

UX dianggap memenuhi requirement apabila:

1. User dapat mengetahui pekerjaan hari ini dari Dashboard.
2. User dapat melakukan delivery tanpa internet.
3. Planned Delivery dan Actual Delivery dapat dibedakan.
4. User dapat mencatat HABIS/TIDAK HABIS dengan sederhana.
5. TIDAK HABIS selalu mengarah pada reconciliation.
6. Sistem menghitung sold berdasarkan actual delivery dan return.
7. Settlement dihitung otomatis.
8. Invoice dapat dibuat dari settlement.
9. Payment dapat dicatat terpisah dari settlement.
10. Outstanding tetap terlihat meskipun Agent menerima delivery berikutnya.
11. Perubahan inventory dapat ditelusuri.
12. Operasi utama tidak membutuhkan Google Account atau internet.
13. Backup dapat dilakukan secara terpisah dari aktivitas operasional.

---

# 54. Core UX Principle

Alur aplikasi harus mengikuti realitas pekerjaan:

> **Rencanakan → Kirim → Konfirmasi → Cek Hasil → Rekonsiliasi bila perlu → Hitung Settlement → Buat Invoice → Terima Pembayaran**

Dengan prinsip:

> **Sedikit input manual, banyak perhitungan otomatis, setiap langkah memiliki status yang jelas, dan pekerjaan lapangan dapat diselesaikan secepat mungkin.**

---

# 55. Requirement Status

Dokumen ini menggunakan status:

- **CONFIRMED** — telah disepakati.
- **PROPOSED** — usulan untuk review.
- **OPEN** — membutuhkan keputusan.
- **DEFERRED** — sengaja ditunda.
- **REJECTED** — tidak akan diterapkan.

Detail visual UI/UX akan ditentukan setelah UX Flow dikonfirmasi.
