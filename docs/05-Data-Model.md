# 05-Data-Model.md

**Version:** 1.0
**Status:** Confirmed
**Last Updated:** 2026-09-19
**Related Documents:**

- `01-PRD.md` v1.0
- `02-Business-Rules.md` v1.0
- `03-Functional-Requirements.md` v1.0
- `04-UX-Flows.md` v1.0

---

# 1. Purpose

Dokumen ini mendefinisikan model data untuk aplikasi Distribusi Konsinyasi.

Data Model menjadi dasar untuk:

- database lokal MVP
- transaksi operasional
- inventory
- settlement
- invoice
- payment
- reporting
- historical traceability
- future API/cloud migration

Model data harus mendukung prinsip:

> **Simple for MVP, traceable for operations, and ready for future evolution.**

Dokumen ini mendefinisikan entitas, atribut utama, relasi, lifecycle, dan data integrity.

Detail implementasi database seperti:

- nama tabel final
- tipe data spesifik database
- ORM
- migration syntax
- indexing strategy
- SQLite library

ditentukan pada tahap implementasi teknis.

---

# 2. Data Model Principles

## DM-001 — Local First

Database lokal merupakan primary data store pada MVP.

## DM-002 — Transaction First

Inventory dan laporan harus dapat ditelusuri dari transaksi sumber.

## DM-003 — No Direct Stock Balance Editing

Stock bukan angka yang diedit secara bebas.

Perubahan stock berasal dari Stock Movement.

## DM-004 — Historical Integrity

Perubahan master data tidak boleh mengubah nilai transaksi historis.

## DM-005 — Stable Identity

Setiap entitas utama memiliki ID yang stabil.

ID tidak boleh bergantung pada urutan record lokal.

## DM-006 — Business Data vs Operational Data

Master data dipisahkan dari transactional data.

Contoh:

```text
Master:
Product
Agent
Business Profile

Transaction:
Production
Delivery
Reconciliation
Settlement
Payment
```

## DM-007 — Snapshot Historical Values

Nilai yang dapat berubah di masa depan tetapi diperlukan untuk histori harus disimpan sebagai snapshot pada transaksi.

Contoh:

- Selling Price
- Agent Fee
- Business Profile
- Agent information jika diperlukan oleh dokumen historis

## DM-008 — No Cloud Dependency

Data model MVP tidak membutuhkan server ID atau synchronization queue.

Namun struktur ID dan timestamp harus memungkinkan evolusi ke cloud.

---

# 3. Entity Overview

Entitas utama MVP:

```text
Business
User
Product Variant
Agent

Production Batch
Production Item

Delivery Plan
Delivery
Delivery Item

Sales Confirmation
Reconciliation
Reconciliation Item

Settlement
Settlement Item

Invoice
Invoice Item

Payment

Stock Movement

Operational Task
```

Relasi konseptual:

```text
Business
   │
   ├── User
   ├── Product Variant
   └── Agent

Product Variant
   │
   ├── Production Item
   ├── Delivery Item
   ├── Reconciliation Item
   └── Stock Movement
                  │
                  └── Inventory

Delivery
   │
   ├── Delivery Item
   ├── Sales Confirmation
   └── Reconciliation
          │
          └── Settlement
                 │
                 ├── Invoice
                 └── Payment
```

---

# 4. Entity: Business

Mewakili identitas bisnis.

## Main Attributes

| Field          | Description                  |
| -------------- | ---------------------------- |
| id             | Unique business ID           |
| name           | Business name                |
| legal_name     | Optional legal/business name |
| tax_id         | Optional Tax ID / NPWP       |
| address        | Business address             |
| phone          | Business phone               |
| email          | Business email               |
| logo           | Optional logo reference      |
| invoice_prefix | Invoice number prefix        |
| created_at     | Creation timestamp           |
| updated_at     | Last update timestamp        |

`invoice_prefix` digunakan untuk penomoran invoice (default `INV`).

Bila `tax_id` diisi, nilainya ikut disimpan sebagai snapshot pada invoice.

## Rules

- MVP hanya memiliki satu Business.
- Business ID tetap stabil.
- Informasi yang diperlukan untuk histori invoice dapat disnapshot.

---

# 5. Entity: User

Mewakili pengguna aplikasi.

## Main Attributes

| Field        | Description                          |
| ------------ | ------------------------------------ |
| id           | Unique user ID                       |
| name         | User name                            |
| email        | User email                           |
| role         | Prepared role (not enforced in MVP)  |
| profile_info | Optional profile information         |
| created_at   | Creation timestamp                   |
| updated_at   | Last update timestamp                |

`role` disiapkan untuk future multi-user dan **tidak** digunakan untuk membatasi akses pada MVP (`D-01`).

## Rules

- MVP memiliki satu operational user.
- Role/permission belum diperlukan.
- Authentication dapat ditambahkan kemudian.
- User ID harus tetap stabil untuk future multi-user.

---

# 6. Entity: Product Variant

Product Variant merupakan **sellable item** dalam MVP.

Contoh:

```text
Coklat
Strawberry
Bubble Gum
Red Velvet
Oreo
Matcha
```

## Main Attributes

| Field               | Description            |
| ------------------- | ---------------------- |
| id                  | Unique variant ID      |
| name                | Variant name           |
| selling_price       | Current selling price  |
| description         | Optional description   |
| low_stock_threshold | Low stock threshold    |
| is_active           | Active/inactive status |
| created_at          | Creation timestamp     |
| updated_at          | Last update timestamp  |

## Rules

- ID harus unik.
- Nama wajib tersedia.
- Harga jual wajib tersedia.
- Variant inactive tidak dapat digunakan untuk transaksi baru.
- Histori transaksi tetap menggunakan ID variant lama.
- Perubahan harga tidak boleh mengubah historical transaction.

## Product Hierarchy

MVP tidak membutuhkan struktur:

```text
Product
   └── Variant
```

yang kompleks.

Sebagai gantinya:

```text
Product Variant
   ├── Coklat
   ├── Strawberry
   ├── Bubble Gum
   └── ...
```

Jika kebutuhan bisnis berkembang, parent Product dapat ditambahkan tanpa mengubah konsep bahwa transaksi mengacu pada sellable item.

---

# 7. Entity: Agent

Mewakili reseller/agen konsinyasi.

## Main Attributes

| Field        | Description                   |
| ------------ | ----------------------------- |
| id           | Unique agent ID               |
| name         | Agent name                    |
| contact      | Contact information           |
| address      | Address                       |
| location     | Optional location information |
| fee_per_unit | Current fee per sold unit     |
| is_active    | Active/inactive status        |
| created_at   | Creation timestamp            |
| updated_at   | Last update timestamp         |

## Rules

- Agent memiliki ID stabil.
- Agent inactive tidak digunakan untuk delivery baru.
- Histori transaksi Agent tetap tersedia.
- Fee saat settlement dibuat harus disimpan sebagai historical snapshot.

---

# 8. Entity: Production Batch

Mewakili satu kegiatan produksi.

## Main Attributes

| Field           | Description                 |
| --------------- | --------------------------- |
| id              | Unique batch ID             |
| batch_number    | Human-readable batch number |
| production_date | Production date             |
| created_by      | User ID                     |
| notes           | Optional notes              |
| created_at      | Creation timestamp          |
| updated_at      | Last update timestamp       |

## Relationship

```text
Production Batch
       │
       └── Production Item
```

Satu batch dapat memiliki beberapa Product Variant.

---

# 9. Entity: Production Item

Mewakili jumlah aktual Product Variant yang dihasilkan dalam satu batch.

## Main Attributes

| Field               | Description               |
| ------------------- | ------------------------- |
| id                  | Unique production item ID |
| production_batch_id | Parent batch              |
| product_variant_id  | Produced variant          |
| quantity            | Actual quantity           |
| created_at          | Creation timestamp        |

## Rules

Quantity merupakan hasil produksi aktual.

Contoh:

```text
Batch 001

Coklat       41
Strawberry   42
Bubble Gum   40
```

System menghitung:

```text
Total = 123
```

Total tidak perlu disimpan sebagai sumber kebenaran terpisah jika dapat dihitung dari item.

---

# 10. Entity: Delivery Plan

Mewakili rencana barang yang akan dikirim.

## Main Attributes

| Field         | Description           |
| ------------- | --------------------- |
| id            | Unique plan ID        |
| agent_id      | Destination agent     |
| delivery_date | Planned delivery date |
| status        | Plan status           |
| notes         | Optional notes        |
| created_at    | Creation timestamp    |
| updated_at    | Last update timestamp |

## Relationship

```text
Delivery Plan
      │
      └── Delivery Plan Item
```

---

# 11. Entity: Delivery Plan Item

Mewakili Product Variant dan planned quantity.

## Main Attributes

| Field              | Description        |
| ------------------ | ------------------ |
| id                 | Unique item ID     |
| delivery_plan_id   | Parent plan        |
| product_variant_id | Planned variant    |
| planned_quantity   | Planned quantity   |
| created_at         | Creation timestamp |

## Important

Planned quantity bukan actual stock movement.

Contoh:

```text
Plan:
Coklat       50
Strawberry   30
```

belum menghasilkan perubahan inventory.

---

# 12. Entity: Delivery

Mewakili delivery aktual yang telah dikonfirmasi.

## Main Attributes

| Field            | Description                                    |
| ---------------- | ---------------------------------------------- |
| id               | Unique delivery ID                             |
| delivery_plan_id | Related plan, optional depending on final flow |
| agent_id         | Destination agent                              |
| delivery_date    | Actual delivery date                           |
| status           | Delivery status                                |
| created_by       | User ID                                        |
| notes            | Optional notes                                 |
| created_at       | Creation timestamp                             |
| updated_at       | Last update timestamp                          |

## Rules

Delivery merupakan transaksi aktual.

Delivery berbeda dengan Delivery Plan.

---

# 13. Entity: Delivery Item

Mewakili jumlah aktual Product Variant yang benar-benar dikirim.

## Main Attributes

| Field                  | Description               |
| ---------------------- | ------------------------- |
| id                     | Unique delivery item ID   |
| delivery_id            | Parent delivery           |
| product_variant_id     | Delivered variant         |
| actual_quantity        | Actual delivered quantity |
| selling_price_snapshot | Price at transaction time |
| created_at             | Creation timestamp        |

## Rules

`actual_quantity` menjadi dasar:

- Agent Stock
- Sales Confirmation
- Reconciliation
- Settlement

Contoh:

```text
Planned:
Coklat = 50

Actual:
Coklat = 48
```

Maka:

```text
Actual Delivery = 48
```

bukan 50.

---

# 14. Entity: Sales Confirmation

Mewakili hasil penjualan harian Agent.

## Main Attributes

| Field        | Description            |
| ------------ | ---------------------- |
| id           | Unique confirmation ID |
| delivery_id  | Related delivery       |
| result       | HABIS / TIDAK_HABIS    |
| confirmed_at | Confirmation timestamp |
| confirmed_by | User ID                |
| notes        | Optional notes         |

## Rules

Result hanya:

```text
HABIS
TIDAK_HABIS
```

Sales Confirmation tidak menyimpan sold quantity sebagai input manual jika quantity dapat dihitung dari delivery/reconciliation.

---

# 15. Entity: Reconciliation

Mewakili proses rekonsiliasi untuk TIDAK HABIS.

## Main Attributes

| Field         | Description              |
| ------------- | ------------------------ |
| id            | Unique reconciliation ID |
| delivery_id   | Related delivery         |
| status        | Reconciliation status    |
| reconciled_at | Completion timestamp     |
| reconciled_by | User ID                  |
| notes         | Optional notes           |

## Rules

Reconciliation wajib untuk TIDAK HABIS.

---

# 16. Entity: Reconciliation Item

Mewakili jumlah Product Variant yang dikembalikan secara fisik.

## Main Attributes

| Field                       | Description                   |
| --------------------------- | ----------------------------- |
| id                          | Unique reconciliation item ID |
| reconciliation_id           | Parent reconciliation         |
| product_variant_id          | Returned variant              |
| delivered_quantity_snapshot | Actual delivered quantity     |
| returned_quantity           | Physical return               |
| sold_quantity               | Calculated sold               |
| created_at                  | Creation timestamp            |

## Calculation

```text
Sold = Delivered - Returned
```

## Validation

```text
Returned <= Delivered

Sold >= 0

Sold + Returned = Delivered
```

## Example

```text
Delivered:
Coklat = 40

Returned:
Coklat = 8

Sold:
Coklat = 32
```

---

# 17. HABIS Data Behavior

Untuk HABIS tidak diperlukan Reconciliation Item.

System dapat menentukan:

```text
Sold = Delivery Item Actual Quantity
Return = 0
```

Secara konseptual:

```text
Delivery
   ↓
Sales Confirmation = HABIS
   ↓
Sold = Actual Delivery
Return = 0
```

Hal ini mengurangi input pengguna.

---

# 18. Entity: Settlement

Mewakili perhitungan kewajiban Agent atas barang yang terjual.

## Main Attributes

| Field           | Description           |
| --------------- | --------------------- |
| id              | Unique settlement ID  |
| agent_id        | Agent                 |
| delivery_id     | Related delivery      |
| settlement_date | Settlement date       |
| gross_amount    | Gross sales           |
| total_fee       | Total agent fee       |
| net_amount      | Net settlement        |
| status          | Settlement status     |
| created_at      | Creation timestamp    |
| updated_at      | Last update timestamp |

## Rules

Settlement berdasarkan barang yang sold.

Settlement bukan payment.

---

# 19. Entity: Settlement Item

Menyimpan detail per Product Variant pada settlement.

## Main Attributes

| Field                  | Description              |
| ---------------------- | ------------------------ |
| id                     | Unique item ID           |
| settlement_id          | Parent settlement        |
| product_variant_id     | Sold variant             |
| sold_quantity          | Sold quantity snapshot   |
| selling_price_snapshot | Historical selling price |
| fee_per_unit_snapshot  | Historical agent fee     |
| gross_amount           | Gross item amount        |
| fee_amount             | Fee amount               |
| net_amount             | Net item amount          |

## Calculation

```text
Gross Amount
= Sold Quantity × Selling Price Snapshot

Fee Amount
= Sold Quantity × Fee per Unit Snapshot

Net Amount
= Gross Amount - Fee Amount
```

## Example

```text
Sold = 46
Price = Rp3.000
Fee = Rp500

Gross = Rp138.000
Fee = Rp23.000
Net = Rp115.000
```

---

# 20. Settlement Snapshot

Settlement harus menyimpan nilai yang digunakan pada saat settlement.

Contoh:

Agent saat ini:

```text
Fee = Rp500
```

Settlement dibuat:

```text
Fee Snapshot = Rp500
```

Kemudian fee Agent berubah:

```text
Fee sekarang = Rp600
```

Settlement lama tetap:

```text
Fee Snapshot = Rp500
```

---

# 21. Entity: Invoice

Mewakili dokumen tagihan berdasarkan Settlement.

## Main Attributes

| Field                     | Description                   |
| ------------------------- | ----------------------------- |
| id                        | Unique invoice ID             |
| invoice_number            | Unique invoice number         |
| settlement_id             | Related settlement            |
| invoice_date              | Invoice date                  |
| business_name_snapshot    | Business name at invoice time |
| business_address_snapshot | Business address              |
| business_phone_snapshot   | Business phone                |
| business_email_snapshot   | Business email                |
| total_amount              | Invoice total                 |
| discount_amount           | Manual discount on invoice    |
| created_at                | Creation timestamp            |

## Rules

Invoice tidak mengambil nilai historis secara dinamis dari master.

Invoice harus mempertahankan snapshot.

`discount_amount` diisi manual oleh petugas (umumnya pembulatan ke bawah) dan tidak mengubah nilai Settlement.

```text
Payable = Net Settlement - discount_amount
```

Dasar keputusan: `D-04b`, `D-19` (`09-Decision-Log.md`).

---

# 22. Entity: Invoice Item

Mewakili detail Product Variant dalam Invoice.

## Main Attributes

| Field                 | Description    |
| --------------------- | -------------- |
| id                    | Unique item ID |
| invoice_id            | Parent invoice |
| product_name_snapshot | Product name   |
| quantity              | Quantity       |
| unit_price_snapshot   | Unit price     |
| fee_per_unit_snapshot | Agent fee      |
| gross_amount          | Gross amount   |
| fee_amount            | Fee amount     |
| net_amount            | Net amount     |

## Reason for Snapshot

Jika nama atau harga Product berubah setelah invoice dibuat, invoice lama tetap sama.

---

# 23. Entity: Payment

Mewakili pembayaran terhadap Settlement.

## Main Attributes

| Field          | Description        |
| -------------- | ------------------ |
| id             | Unique payment ID  |
| settlement_id  | Related settlement |
| payment_date   | Payment date       |
| amount         | Payment amount     |
| payment_method | Payment method     |
| notes          | Optional notes     |
| created_by     | User ID            |
| created_at     | Creation timestamp |

## Current MVP Status

**CONFIRMED:**

- satu settlement dapat memiliki **lebih dari satu** pembayaran (partial/underpayment diizinkan);
- overpayment dicatat sebagai **kredit Agent** (entitas ledger ditentukan pada desain terpisah);
- `payment_method` menyimpan `CASH`, `TRANSFER`, `QRIS`, atau `OTHER`.

Payment tidak mengubah `settlement.net_amount`.

Dasar keputusan: `D-03`, `D-04`, `D-05` (`09-Decision-Log.md`).

---

# 24. Payment & Outstanding

Outstanding secara konseptual:

```text
Payable
= Net Settlement - Discount

Outstanding
= Payable - Σ Valid Payment Amount
```

Settlement dianggap terbayar apabila `Outstanding <= 0`.

Nilai `Outstanding` negatif berarti terdapat kelebihan pembayaran yang dicatat sebagai kredit Agent.

Dasar keputusan: `D-03`, `D-04`, `D-04b` (`09-Decision-Log.md`).

---

# 24A. Entity: Agent Credit (DEFERRED DESIGN)

Entitas ini **belum final** dan akan ditentukan pada sesi desain sebelum diimplementasikan (`D-04`).

Konsep yang sudah disepakati:

```text
Payment > Payable
    ↓
Kelebihan pembayaran
    ↓
Kredit Agent (bukan pendapatan)
```

Hal yang belum ditetapkan:

- nama dan struktur entitas (ledger vs saldo);
- apakah kredit otomatis memotong kewajiban settlement berikutnya atau hanya ditampilkan;
- perilaku kredit ketika Agent dinonaktifkan.

Sampai entitas ini diimplementasikan, sistem menolak input pembayaran melebihi `Payable` dengan pesan yang jelas.

Untuk MVP dengan pembayaran penuh:

```text
Unpaid Settlement
→ Outstanding

Full Payment
→ Paid
```

Payment bukan bagian dari Settlement Item.

---

# 25. Entity: Stock Movement

Stock Movement merupakan sumber perubahan inventory.

## Main Attributes

| Field              | Description             |
| ------------------ | ----------------------- |
| id                 | Unique movement ID      |
| product_variant_id | Product Variant         |
| movement_type      | Movement type           |
| quantity           | Movement quantity       |
| source_type        | Source transaction type |
| source_id          | Source transaction ID   |
| from_location      | Source location         |
| to_location        | Destination location    |
| movement_date      | Movement date           |
| notes              | Optional notes          |
| created_at         | Creation timestamp      |

---

# 26. Stock Movement Types

Minimal movement type:

```text
PRODUCTION
DELIVERY
RETURN
SOLD
WASTE
ADJUSTMENT
```

## Conceptual Direction

### Production

```text
Production
   ↓
Owner Stock
```

### Delivery

```text
Owner Stock
   ↓
Agent Stock
```

### Sold

```text
Agent Stock
   ↓
Sold / Consumed
```

### Return

```text
Agent Stock
   ↓
Owner Stock
```

### Waste / Adjustment

```text
Stock
   ↓
Adjustment / Loss
```

---

# 27. Inventory Location

Untuk MVP, lokasi stock minimal:

```text
OWNER
AGENT
```

Agent location dapat diidentifikasi melalui Agent ID.

Conceptually:

```text
OWNER
   │
   ├── Agent A
   ├── Agent B
   └── Agent C
```

Tidak diperlukan warehouse/location management yang kompleks pada MVP.

---

# 28. Inventory Calculation

Stock In Hand Owner secara konseptual dihitung dari movement:

```text
Owner Stock
=
Production
+ Return
- Delivery
- Owner Waste
- Owner Adjustment Out
+ Owner Adjustment In
```

Agent Stock:

```text
Agent Stock
=
Delivery
- Sold
- Return
- Agent Adjustment
```

Total stock yang masih berada dalam sistem dapat direkonsiliasi dari seluruh movement yang relevan.

---

# 29. Stock Movement Source

Setiap Stock Movement harus dapat ditelusuri ke transaksi sumber.

Contoh:

```text
Stock Movement
   ↓
source_type = DELIVERY
source_id = DELIVERY-001
```

Pengguna dapat mengetahui:

> "Mengapa stock berkurang 50?"

Jawabannya dapat ditelusuri ke Delivery tertentu.

---

# 30. Stock Adjustment Reason

Stock Adjustment minimal memiliki reason:

```text
DAMAGED_GOODS
MELTED_UNUSABLE
PRODUCTION_ERROR
TESTER_SAMPLE
LOSS
STOCK_OPNAME_CORRECTION
```

Reason dapat disimpan sebagai enum/code atau master sederhana.

---

# 31. Entity: Operational Task

Task merupakan representasi kondisi operasional, bukan sumber transaksi.

## Main Attributes

| Field          | Description          |
| -------------- | -------------------- |
| id             | Unique task ID       |
| task_type      | Task type            |
| reference_type | Related entity       |
| reference_id   | Related entity ID    |
| task_date      | Relevant date        |
| status         | Task status          |
| completed_at   | Completion timestamp |
| notes          | Optional notes       |

## Task Types

Minimal:

```text
DELIVERY
RECONCILIATION
PAYMENT_COLLECTION
```

Task dapat dibuat/dihasilkan berdasarkan kondisi transaksi.

---

# 32. Task as Derived Data

Task tidak boleh menjadi sumber kebenaran transaksi.

Contoh:

```text
Delivery belum confirmed
        ↓
Delivery Task
```

Setelah delivery confirmed:

```text
Delivery confirmed
        ↓
Delivery Task resolved
```

Data Delivery tetap menjadi sumber kebenaran.

---

# 33. Entity Relationships

Relasi utama:

```text
Business
 ├── User
 ├── Product Variant
 └── Agent

Production Batch
 └── Production Item
       └── Product Variant

Delivery Plan
 ├── Agent
 └── Delivery Plan Item
       └── Product Variant

Delivery
 ├── Agent
 └── Delivery Item
       └── Product Variant

Delivery
 └── Sales Confirmation
        │
        ├── HABIS
        │
        └── TIDAK HABIS
               ↓
         Reconciliation
               ↓
      Reconciliation Item
               ↓
         Settlement
               ↓
       Settlement Item
               ↓
          Invoice
               ↓
         Invoice Item

Settlement
 └── Payment
```

---

# 34. Transaction Traceability

Sistem harus mampu menelusuri:

```text
Production
    ↓
Stock Movement
    ↓
Delivery
    ↓
Stock Movement
    ↓
Sales / Reconciliation
    ↓
Settlement
    ↓
Invoice
    ↓
Payment
```

Contoh:

```text
Payment
   ↓
Settlement
   ↓
Delivery
   ↓
Delivery Item
   ↓
Product Variant
```

dan:

```text
Delivery
   ↓
Stock Movement
   ↓
Inventory
```

---

# 35. Transaction IDs

Setiap transaksi utama memiliki ID stabil:

```text
Production Batch ID
Delivery Plan ID
Delivery ID
Sales Confirmation ID
Reconciliation ID
Settlement ID
Invoice ID
Payment ID
Stock Movement ID
```

ID internal tidak boleh bergantung pada nomor urut yang dapat berubah.

Human-readable number dapat dibuat terpisah.

Contoh:

```text
Internal ID:
UUID / stable identifier

Display Number:
INV-20260919-001
```

Teknologi ID final ditentukan pada Technical Architecture/Implementation.

---

# 36. Timestamps

Entitas transaksi minimal memiliki timestamp yang relevan.

Contoh:

```text
created_at
updated_at
production_date
delivery_date
confirmed_at
reconciled_at
settlement_date
invoice_date
payment_date
```

Timestamp digunakan untuk:

- histori
- sorting
- reporting
- auditability
- future synchronization

---

# 37. Master Data vs Transaction Data

## Master Data

```text
Business
User
Product Variant
Agent
```

## Transaction Data

```text
Production Batch
Production Item

Delivery Plan
Delivery Plan Item

Delivery
Delivery Item

Sales Confirmation

Reconciliation
Reconciliation Item

Settlement
Settlement Item

Invoice
Invoice Item

Payment

Stock Movement
```

## Derived / Operational Data

```text
Operational Task
Dashboard Summary
Analytics
```

Dashboard dan analytics tidak menjadi sumber data transaksi.

---

# 38. Historical Snapshot Strategy

Snapshot diperlukan pada data yang dapat berubah.

Minimal:

### Delivery Item

```text
selling_price_snapshot
```

### Settlement Item

```text
sold_quantity
selling_price_snapshot
fee_per_unit_snapshot
```

### Invoice

```text
business_*_snapshot
product_name_snapshot
unit_price_snapshot
fee_per_unit_snapshot
```

Tujuan:

> Transaksi lama tetap dapat direproduksi dan dipahami meskipun master data berubah.

---

# 39. Soft Deactivation

Master data yang telah digunakan dalam transaksi tidak dihapus secara destruktif.

Contoh:

```text
Product Variant
is_active = false
```

atau:

```text
Agent
is_active = false
```

Data histori tetap mempertahankan referensi ID dan snapshot yang diperlukan.

---

# 40. Deletion Rules

## Master Data

Tidak boleh dihapus jika telah digunakan oleh transaksi historis.

## Transaction Data

Transaksi historis tidak boleh dihapus sembarangan.

Jika koreksi diperlukan, mekanisme correction harus mempertahankan traceability.

## Stock Movement

Stock Movement tidak boleh dihapus jika sudah menjadi bagian dari histori inventory.

---

# 41. Business Invariants in Data Model

Model data harus memungkinkan sistem menjaga:

```text
INV-001
Sold + Returned = Actual Delivered

INV-002
Returned <= Actual Delivered

INV-003
Sold <= Actual Delivered

INV-004
Settlement hanya menggunakan Sold Quantity yang valid

INV-005
HABIS:
Sold = Actual Delivered
Return = 0

INV-006
TIDAK HABIS:
Sold + Return = Actual Delivered

INV-007
Inventory konsisten dengan Stock Movement

INV-008
Historical Price tetap

INV-009
Historical Fee tetap

INV-010
Backup failure tidak mengubah local data
```

---

# 42. Transaction Boundaries

Operasi yang mengubah beberapa entitas terkait harus diperlakukan sebagai satu logical transaction.

Contoh Production:

```text
Create Production Batch
      +
Create Production Items
      +
Create Stock Movements
```

Jika salah satu bagian gagal, sistem tidak boleh meninggalkan kondisi setengah selesai.

Contoh Delivery:

```text
Confirm Delivery
      +
Create Delivery Items
      +
Create Stock Movements
```

Contoh Reconciliation:

```text
Confirm Reconciliation
      +
Calculate Sold
      +
Create Return Stock Movements
```

---

# 43. Derived Values

Nilai berikut sebaiknya dihitung dari source data atau transaction items:

```text
Production Total
Sold Quantity
Return Quantity
Gross Sales
Total Fee
Net Settlement
Outstanding
Stock Balance
Sell-through
```

Contoh:

```text
Gross
= Σ(Sold × Historical Price)

Fee
= Σ(Sold × Historical Fee)

Net
= Gross - Fee
```

Menghindari duplikasi angka yang dapat menyebabkan inconsistency.

Snapshot tetap boleh disimpan pada titik transaksi jika dibutuhkan untuk historical integrity.

---

# 44. Sell-through

Sell-through dapat dihitung sebagai:

```text
Sell-through
=
Sold / Actual Delivered × 100%
```

Untuk:

```text
Actual Delivered > 0
```

Jika actual delivered = 0, sell-through tidak dihitung atau ditampilkan sebagai `N/A`.

---

# 45. Agent Outstanding

Outstanding Agent dapat ditelusuri dari Settlement dan Payment.

Konsep:

```text
Settlement
   ↓
Payment
   ↓
Outstanding
```

Outstanding bukan angka yang berdiri sendiri tanpa sumber transaksi.

---

# 46. Daily Delivery Lifecycle

Model mendukung kondisi:

```text
Day 1

Delivery A
   ↓
Agent Stock
   ↓
HABIS / TIDAK HABIS
```

Kemudian:

```text
Day 2

New Delivery B
   ↓
Agent Stock
```

Data Delivery A dan Delivery B tetap merupakan transaksi berbeda.

Hal ini penting karena Agent dapat menerima delivery baru walaupun:

- memiliki outstanding
- memiliki histori return
- memiliki aktivitas sebelumnya

---

# 47. Multiple Deliveries

Model harus memungkinkan satu Agent memiliki lebih dari satu Delivery dalam histori.

Contoh:

```text
Agent A

Delivery #001
2026-09-18

Delivery #002
2026-09-19

Delivery #003
2026-09-20
```

Tidak boleh menggunakan satu record Agent Stock harian sebagai pengganti histori delivery.

---

# 48. Agent Stock vs Delivery History

Agent Stock merupakan kondisi inventory saat ini.

Delivery merupakan histori pergerakan.

Contoh:

```text
Agent A

Current Agent Stock:
Coklat = 20
```

tidak berarti sistem kehilangan informasi:

```text
Delivery:
+50

Sold:
-30

Current:
20
```

Historinya tetap tersedia.

---

# 49. Backup Compatibility

Database harus dapat diekspor/dibackup sebagai satu kesatuan yang dapat dipulihkan.

Backup harus mempertahankan:

- master data
- transactions
- stock movements
- settlement
- invoices
- payments
- relevant metadata

Backup bukan synchronization.

---

# 50. Future Cloud Compatibility

Model harus memungkinkan evolusi:

```text
Current

Android
   ↓
Local Repository
   ↓
SQLite
```

menjadi:

```text
Future

Android
   ↓
Repository / Sync
   ↓
Laravel API
   ↓
PostgreSQL
```

Tidak diperlukan tabel sync khusus dalam MVP.

Namun model harus memiliki:

- stable IDs
- timestamps
- explicit relationships
- historical transaction records
- separation between master and transactions

---

# 51. Future Multi-User Compatibility

MVP hanya satu user.

Namun transaksi dapat menyimpan:

```text
created_by
```

atau user reference pada aktivitas yang relevan.

Hal ini tidak berarti MVP membutuhkan role/permission.

Tujuannya hanya menjaga struktur agar future multi-user dapat ditambahkan tanpa redesign total.

---

# 52. Future Multi-Business Compatibility

MVP hanya satu Business.

Namun entitas utama secara konseptual berada di bawah:

```text
Business
```

Future:

```text
Business A
 ├── Users
 ├── Products
 └── Agents

Business B
 ├── Users
 ├── Products
 └── Agents
```

Multi-tenant architecture tidak dibangun pada MVP.

---

# 53. Suggested Logical ERD

```text
┌──────────────┐
│   BUSINESS   │
└──────┬───────┘
       │
       ├───────────────┐
       ↓               ↓
┌──────────────┐  ┌──────────────┐
│     USER     │  │    AGENT     │
└──────────────┘  └──────┬───────┘
                         │
                         │
                  ┌──────▼───────┐
                  │   DELIVERY   │
                  └──────┬───────┘
                         │
                ┌────────┴────────┐
                ↓                 ↓
       ┌────────────────┐  ┌─────────────────┐
       │ DELIVERY ITEM  │  │ SALES CONFIRM.  │
       └───────┬────────┘  └────────┬────────┘
               │                    │
               │              ┌─────┴─────┐
               │              ↓           ↓
               │           HABIS      TIDAK HABIS
               │                          │
               │                   ┌──────▼──────┐
               │                   │RECONCILIATION│
               │                   └──────┬──────┘
               │                          │
               └──────────────┬───────────┘
                              ↓
                       ┌────────────┐
                       │ SETTLEMENT │
                       └─────┬──────┘
                             │
                    ┌────────┴────────┐
                    ↓                 ↓
               ┌─────────┐      ┌─────────┐
               │ INVOICE │      │ PAYMENT │
               └─────────┘      └─────────┘


┌──────────────────┐
│ PRODUCT VARIANT  │
└────────┬─────────┘
         │
   ┌─────┼──────┬──────────────┐
   ↓     ↓      ↓              ↓
Production Delivery Reconciliation Settlement
   │     │      │              │
   └─────┴──────┴──────────────┘
                 │
                 ↓
          STOCK MOVEMENT
```

---

# 54. Minimum MVP Entities

Implementasi MVP minimal membutuhkan:

### Master

1. Business
2. User
3. Product Variant
4. Agent

### Production

5. Production Batch
6. Production Item

### Distribution

7. Delivery Plan
8. Delivery Plan Item
9. Delivery
10. Delivery Item

### Sales

11. Sales Confirmation
12. Reconciliation
13. Reconciliation Item

### Financial

14. Settlement
15. Settlement Item
16. Invoice
17. Invoice Item
18. Payment

### Inventory

19. Stock Movement

### Operational

20. Operational Task

---

# 55. Potentially Derived, Not Primary Tables

Beberapa data tidak harus menjadi table terpisah pada MVP:

```text
Dashboard Summary
Low Stock List
Sell-through
Outstanding Summary
Agent Performance
Product Performance
```

Data tersebut dapat dihitung dari transaction data dan stock movement.

Tujuannya menghindari duplicate source of truth.

---

# 56. Open Data Model Decisions

| ID          | Topic                                                  | Status          | Keputusan |
| ----------- | ------------------------------------------------------ | --------------- | --------- |
| OPEN-DM-001 | Final ID format: UUID/ULID/etc.                        | CONFIRMED       | UUID v4 (`D-09`) |
| OPEN-DM-002 | Final Delivery Plan optionality                        | CONFIRMED       | Plan wajib (`D-02`) |
| OPEN-DM-003 | Delivery cancellation representation                   | OPEN            | Di luar MVP |
| OPEN-DM-004 | Transaction correction model                           | CONFIRMED       | Movement pembalik `ADJUSTMENT`/`CORRECTION` (`D-07`) |
| OPEN-DM-005 | Partial payment model                                  | CONFIRMED       | Banyak pembayaran per settlement (`D-03`) |
| OPEN-DM-006 | Overpayment model                                      | DEFERRED DESIGN | Entitas kredit Agent (§24A, `D-04`) |
| OPEN-DM-007 | Payment method model                                   | CONFIRMED       | `CASH/TRANSFER/QRIS/OTHER` (`D-05`) |
| OPEN-DM-008 | Restore mechanism                                      | CONFIRMED       | Validasi + safety backup (`D-12`) |
| OPEN-DM-009 | Authentication fields/details                          | CONFIRMED       | Tidak ada authentication; `users.role` disiapkan (`D-01`, `D-11`) |
| OPEN-DM-010 | Exact transaction status values                        | CONFIRMED       | §4.5 `09-Decision-Log.md` (`D-10`) |
| OPEN-DM-011 | Whether Operational Task is persisted or fully derived | CONFIRMED       | Fully derived (`D-06`) |

Dasar keputusan lengkap: `09-Decision-Log.md`.

---

# 57. Data Model Principles for Implementation

Implementasi database harus mengikuti prinsip:

1. **Stable IDs**
2. **Explicit Foreign Keys**
3. **Historical Snapshots**
4. **Transaction Integrity**
5. **No Destructive Historical Deletion**
6. **Stock Movement as Inventory Source**
7. **Master Data Separate from Transactions**
8. **Derived Data Does Not Become Independent Source of Truth**
9. **Local First**
10. **Future API Compatible**

---

# 58. Core Data Principle

Model data harus mampu menjawab tiga pertanyaan utama:

### 1. Barang berasal dari mana?

```text
Production
   ↓
Stock Movement
```

### 2. Barang pergi ke mana dan akhirnya bagaimana?

```text
Delivery
   ↓
Agent Stock
   ↓
Sold / Return
```

### 3. Uang yang menjadi kewajiban Agent berapa dan sudah dibayar atau belum?

```text
Sold
   ↓
Settlement
   ↓
Invoice
   ↓
Payment
   ↓
Outstanding / Paid
```

Dengan demikian:

> **Setiap pergerakan barang memiliki sumber transaksi, setiap penjualan memiliki dasar kuantitas, dan setiap kewajiban finansial memiliki histori settlement serta payment.**

---

# 59. Requirement Status

Dokumen ini menggunakan status:

- **CONFIRMED** — telah disepakati.
- **PROPOSED** — usulan untuk review.
- **OPEN** — membutuhkan keputusan.
- **DEFERRED** — sengaja ditunda.
- **REJECTED** — tidak akan diterapkan.

Finalisasi detail Data Model akan dilakukan setelah review dokumen ini.
