# Konsinyasi Distribution Application — Baseline

**Version:** 0.4  
**Date:** 2026-09-07  
**Status:** Living Baseline

---

## 1. Purpose

Dokumen ini merupakan source of truth untuk keputusan dan requirement yang telah dikonfirmasi dalam pengembangan Aplikasi Distribusi Konsinyasi.

Dokumen ini digunakan sebagai acuan utama sebelum melakukan perubahan requirement, desain, maupun implementasi.

Requirement dengan status `CONFIRMED` tidak boleh diubah secara diam-diam oleh implementasi.

---

## 2. Product Scope

Aplikasi digunakan untuk mendukung operasional internal bisnis distribusi produk frozen food dengan model konsinyasi.

Fungsi utama:

- production
- inventory
- agent/reseller management
- consignment delivery
- daily agent confirmation
- physical reconciliation
- settlement
- invoice
- payment/collection
- return
- operational task
- reporting and analytics

Aplikasi pada MVP ditujukan untuk penggunaan internal dan belum ditujukan sebagai aplikasi untuk agen.

---

## 3. MVP Platform

### CONFIRMED

MVP menggunakan:

- Android application
- local database
- offline-first operation
- single business/organization
- penggunaan internal
- single-device oriented pada tahap awal

MVP tidak membutuhkan cloud server sebagai dependency operasional utama.

Aplikasi harus tetap dapat menjalankan fungsi operasional utama ketika tidak tersedia koneksi internet.

---

## 4. Future Cloud Architecture

### CONFIRMED — FUTURE / DEFERRED

Aplikasi dirancang agar dapat dikembangkan menjadi sistem terpusat dengan:

- Laravel API
- PostgreSQL
- multi-user
- multi-device
- cloud synchronization
- web/admin interface menggunakan Filament

Arsitektur future:

```text
Android Device(s)
       ↓
   Laravel API
       ↓
   PostgreSQL

Web/Admin
   ↓
Filament
   ↓
Laravel API / Application Layer
```

Cloud synchronization bukan bagian dari MVP.

---

## 5. Architecture Principle

MVP harus menggunakan pemisahan yang memungkinkan local data access digantikan atau dilengkapi dengan remote API pada masa depan.

Konsep:

```text
Android UI
    ↓
Application / Domain Logic
    ↓
Repository / Data Access
    ↓
Local Database
```

Future:

```text
Android UI
    ↓
Application / Domain Logic
    ↓
Repository / Data Access
    ├── Local Database
    └── Laravel API
             ↓
         PostgreSQL
```

Business logic tidak boleh dibuat sedemikian rupa sehingga hanya dapat berjalan melalui UI atau database lokal.

---

## 6. Organization Model

### CONFIRMED

MVP hanya mendukung satu business/organization.

Tidak ada multi-tenancy pada MVP.

Future cloud dapat tetap menggunakan satu business/organization terlebih dahulu dan dikembangkan menjadi model multi-user/multi-device sesuai kebutuhan.

---

## 7. Users & Access Control

> **KEPUTUSAN D-01 (`09-Decision-Log.md`):** MVP **tidak** menerapkan pemisahan role atau pembatasan menu. Uraian role di bawah ini adalah **future direction**, bukan perilaku MVP. Kolom `users.role` tetap disiapkan untuk kesiapan future.

MVP memiliki tiga role:

### OWNER_ADMIN

Full access terhadap seluruh fungsi aplikasi.

### PRODUCTION

Dapat:

- melihat stock
- mencatat actual production result
- melihat production history
- melihat production-related stock movements
- melihat low stock

Tidak dapat:

- mengubah saldo stock secara langsung
- melakukan delivery
- melakukan reconciliation
- melakukan settlement
- mencatat payment
- mengubah price/fee/business profile

### DELIVERY

Dapat:

- menjalankan delivery
- melakukan agent confirmation
- melakukan physical reconciliation
- melakukan settlement
- melakukan collection/payment
- menangani return

Agent/reseller tidak menggunakan aplikasi pada MVP.

---

## 8. Core Business Workflow

Model bisnis:

```text
Production
    ↓
Owner Stock
    ↓
Delivery to Agent
    ↓
Agent Consignment Stock
    ├── Sold
    └── Return
             ↓
        Owner Stock
```

Setiap pagi seluruh agent yang aktif/terjadwal menerima delivery baru.

Hasil penjualan hari sebelumnya tidak menghilangkan delivery hari berikutnya.

---

## 9. Production

Petugas produksi bertanggung jawab mencatat hasil produksi aktual per batch dan per varian.

Contoh:

```text
Batch 1
Coklat       41
Strawberry   42
Total        83

Batch 2
Mangga       44
Bubble Gum   40
Total        84
```

Sistem menghitung total output berdasarkan jumlah aktual per varian.

Petugas produksi tidak mengubah saldo inventory secara langsung.

Sistem membuat stock movement berdasarkan production result.

Alur:

```text
Actual Production Result
        ↓
Production Transaction
        ↓
Stock Movement
        ↓
Owner Stock
```

---

## 10. Inventory

Inventory merupakan bagian MVP.

Inventory harus dapat melacak:

- total production
- owner stock / stock in hand
- outgoing delivery
- stock at agents
- sold
- return
- waste
- stock adjustment
- low stock

Stock movement digunakan sebagai sumber traceability transaksi inventory.

Saldo stock tidak boleh menjadi satu-satunya sumber kebenaran.

---

## 11. Stock Movement

Stock movement harus dapat ditelusuri ke transaksi bisnis yang menyebabkannya.

Contoh:

```text
Production
→ Stock In

Delivery
→ Stock Out from Owner
→ Stock In to Agent Consignment

Return
→ Stock Out from Agent
→ Stock In to Owner

Waste / Adjustment
→ Adjustment Movement
```

---

## 12. Low Stock

Setiap product/variant dapat memiliki low stock threshold.

Rule:

```text
Stock In Hand <= Low Stock Threshold
→ LOW STOCK
```

Detail mekanisme notification/alert masih `OPEN`.

---

## 13. Agent

Agent merupakan pihak yang menerima produk secara konsinyasi.

Informasi agent minimal mencakup data identitas dan informasi operasional yang diperlukan untuk:

- delivery
- confirmation
- reconciliation
- settlement
- payment
- analytics

Agent tidak menggunakan aplikasi pada MVP.

---

## 14. Agent Fee

MVP hanya menggunakan:

```text
FIXED_PER_UNIT
```

Fee:

- dinegosiasikan per agent
- tidak ditentukan oleh agent level
- dapat berbeda antar-agent
- dapat digunakan sebagai strategi menarik agent baru

Hubungan:

```text
Agent Level ≠ Agent Fee
```

Percentage-based fee merupakan future functionality.

---

## 15. Agent Fee Agreement

Konsep:

```text
Agent Fee Agreement
├── Agent
├── Fee Type
├── Fee Value
├── Effective From
├── Effective Until
└── Status
```

Settlement harus menyimpan snapshot fee yang benar-benar digunakan.

Perubahan fee di masa depan tidak boleh mengubah settlement historis.

---

## 16. Delivery

Delivery quantity ditentukan secara manual oleh owner/employee pada MVP.

Sistem tidak secara otomatis menentukan jumlah delivery.

Setiap pagi:

```text
Active/Scheduled Agents
        ↓
New Delivery
```

Agent tetap menerima delivery baru meskipun memiliki:

- leftover dari hari sebelumnya
- outstanding payment
- hasil HABIS/TIDAK HABIS sebelumnya

Stock lama dan delivery baru harus dapat dibedakan secara logis.

---

## 17. Daily Agent Confirmation

Agent hanya memberikan salah satu status:

```text
HABIS
TIDAK HABIS
```

Agent tidak diwajibkan melaporkan jumlah leftover per product/variant.

Jumlah aktual leftover ditentukan oleh petugas saat physical reconciliation.

---

## 18. HABIS

Jika agent menyatakan `HABIS`:

- seluruh quantity delivered dianggap terjual
- return = 0
- physical visit tidak diperlukan hanya untuk menentukan leftover
- settlement dapat dilakukan tanpa physical reconciliation
- invoice dapat dibuat
- payment dapat dikumpulkan pada delivery berikutnya

---

## 19. TIDAK HABIS

Jika agent menyatakan `TIDAK HABIS`:

- physical reconciliation wajib dilakukan
- petugas menentukan leftover aktual per product/variant
- return dicatat
- sold dihitung oleh sistem
- leftover goods dikumpulkan
- insulated box dikumpulkan
- settlement dilakukan
- payment dikumpulkan saat kunjungan

---

## 20. Reconciliation

Physical reconciliation menentukan actual return.

Rule:

```text
Sold + Returned = Delivered
```

Reconciliation harus dilakukan per product/variant apabila diperlukan untuk menentukan jumlah actual return.

---

## 21. Settlement

Settlement dan payment merupakan dua konsep berbeda.

Settlement menentukan kewajiban pembayaran berdasarkan hasil penjualan.

Payment mencatat realisasi pembayaran.

Settlement harus menyimpan snapshot:

- delivered quantity
- sold quantity
- returned quantity
- applicable product price
- agent fee type
- agent fee value
- agent fee amount
- gross sales
- net amount payable

---

## 22. Invoice

Invoice dibuat berdasarkan settlement.

Invoice dapat dibuat sebelum payment dilakukan.

Invoice harus dapat direpresentasikan sebagai PDF.

PDF dapat dibagikan menggunakan mekanisme share yang tersedia pada Android.

WhatsApp API bukan bagian MVP.

---

## 23. Historical Invoice Snapshot

Invoice historis harus mempertahankan snapshot identitas business pada saat invoice dibuat.

Perubahan business profile di masa depan tidak boleh mengubah invoice historis.

---

## 24. Payment / Collection

Payment dicatat secara terpisah dari settlement.

`HABIS`:

- payment dapat dikumpulkan pada delivery pagi berikutnya.

`TIDAK HABIS`:

- payment dikumpulkan saat physical reconciliation/visit.

Detail:

- payment method
- partial payment
- overpayment
- cancellation
- payment reference

masih `OPEN`.

---

## 25. Return

Return berasal dari hasil physical reconciliation.

Return yang diterima dan masih layak digunakan dapat dikembalikan ke owner stock.

Rule detail mengenai kelayakan return sebagai usable stock masih `OPEN`.

---

## 26. Insulated Box

Insulated box merupakan perangkat operasional yang ikut berpindah bersama delivery/collection.

Pada kondisi `TIDAK HABIS`, box dikumpulkan saat physical visit.

Detail tracking box masih `OPEN`.

---

## 27. Operational Task

Delivery staff bekerja berdasarkan task-oriented list, bukan mencari transaksi secara manual.

Morning tasks:

- delivery seluruh scheduled agents
- collection outstanding payment jika diperlukan

Afternoon/evening tasks:

- physical reconciliation untuk `TIDAK HABIS`
- pickup leftover
- pickup insulated box
- settlement
- payment collection

---

## 28. Reporting & Analytics

MVP harus menyediakan data yang dapat digunakan untuk menganalisis:

### Product

- quantity sold
- gross sales
- return
- sell-through
- variant performance

### Agent

- delivered
- sold
- returned
- sell-through
- gross sales
- agent fee
- net amount
- payment
- outstanding

### Inventory

- production
- stock in hand
- stock at agents
- movement
- return
- waste/adjustment
- low stock

Detail dashboard, filter, export, dan notification masih `OPEN`.

---

## 29. Agent Leveling

Agent leveling bukan bagian MVP.

Data dan struktur aplikasi harus tetap memungkinkan fitur ini ditambahkan di masa depan.

Agent fee tidak boleh bergantung pada agent level.

---

## 30. Business Profile

MVP mendukung satu business profile.

Informasi dapat mencakup:

- Business Name
- Legal Name
- Business Type
- Address
- Phone
- Email
- Logo
- Tax ID / NPWP
- Invoice Prefix
- Invoice Settings

Historical invoice menggunakan snapshot business profile.

---

## 31. Data Integrity Principles

Prinsip penting:

1. Stock harus dapat ditelusuri melalui stock movement.
2. Production actual output menjadi sumber stock-in dari production.
3. Petugas produksi tidak mengedit saldo stock secara langsung.
4. `Sold + Returned = Delivered`.
5. Settlement dan payment terpisah.
6. Historical settlement mempertahankan snapshot price dan fee.
7. Historical invoice mempertahankan snapshot business identity.
8. Business logic tidak boleh bergantung pada UI.
9. MVP harus dapat beroperasi tanpa koneksi internet untuk fungsi operasional utama.
10. Future synchronization tidak boleh mengharuskan perubahan fundamental pada business transaction model.

---

## 32. MVP Technical Direction

### CONFIRMED

MVP:

```text
Android Application
        ↓
Application / Domain Logic
        ↓
Repository Layer
        ↓
Local SQLite Database
```

Karakteristik:

- offline-first
- local-first
- single business
- internal use
- no cloud dependency

### FUTURE

```text
Android
   ↓
Laravel API
   ↓
PostgreSQL
```

dengan kemungkinan:

```text
Web Browser
   ↓
Filament
   ↓
Laravel
```

Future capabilities:

- cloud synchronization
- multi-user
- multi-device
- centralized data
- web/admin access
- centralized reporting

---

## 33. Synchronization Readiness

Cloud synchronization belum diimplementasikan pada MVP.

Namun transaksi dan data penting harus dirancang agar dapat diidentifikasi secara konsisten ketika synchronization diperkenalkan.

Transaction/entity identifiers sebaiknya tidak bergantung semata-mata pada auto-increment lokal.

Detail synchronization protocol, conflict resolution, sync status, retry mechanism, dan server authority masih `DEFERRED`.

---

## 34. Hosting

MVP tidak membutuhkan hosting/cloud server sebagai dependency utama.

Hosting Laravel/PostgreSQL baru diperlukan ketika cloud synchronization dan centralized access mulai diimplementasikan.

---

## 35. Scope Principles

Prinsip MVP:

- simple
- low cost
- operationally useful
- offline capable
- internal use
- avoid unnecessary infrastructure
- avoid speculative features

Jangan membangun cloud infrastructure sebelum kebutuhan bisnis membenarkannya.

---

## 36. Requirement Status Convention

Gunakan status:

- `CONFIRMED` — telah disepakati
- `PROPOSED` — usulan yang belum disepakati
- `OPEN` — masih perlu keputusan
- `DEFERRED` — sengaja ditunda
- `REJECTED` — tidak digunakan

---

## 37. Current Confirmed Architecture

### MVP

**Android + Local SQLite + Offline-first**

### Future

**Android + Laravel API + PostgreSQL**

dengan **Filament** sebagai future web/admin interface.

Tidak ada requirement bahwa Laravel/Filament harus berjalan pada MVP.

---

## 38. Current Confirmed Roles

MVP:

- `OWNER_ADMIN`
- `PRODUCTION`
- `DELIVERY`

Agent tidak menggunakan aplikasi.

---

## 39. Open Areas

Status per `09-Decision-Log.md`:

| Area | Status | Keputusan / Catatan |
| ---- | ------ | ------------------- |
| Android technology stack | CONFIRMED | Expo SDK 57 (React Native + TypeScript) |
| authentication | CONFIRMED | Tidak ada authentication pada MVP (`D-11`) |
| local database implementation | CONFIRMED | SQLite via `expo-sqlite` |
| user/device model | CONFIRMED | Single user, single device (`D-01`) |
| detailed authorization | CONFIRMED | Tidak ada role gating pada MVP (`D-01`) |
| product master | CONFIRMED | Product Variant sebagai sellable item |
| production batch numbering | CONFIRMED | `BATCH-YYYYMMDD-NNN` (`D-08`) |
| production correction/cancellation | CONFIRMED | Koreksi via movement pembalik (`D-07`) |
| stock opname | CONFIRMED | Melalui stock adjustment dengan alasan (`FR-IV-008`) |
| returned goods eligibility | CONFIRMED | Semua return masuk owner stock; tidak layak dicatat sebagai WASTE (`D-17`) |
| inventory adjustment/waste | CONFIRMED | Adjustment dengan reason wajib |
| delivery schedule | CONFIRMED | Tidak ada jadwal kunjungan pada MVP (`D-16`) |
| partial delivery | CONFIRMED | Actual delivery bisa berbeda dari planned; plan wajib ada (`D-02`) |
| delivery cancellation | OPEN | Di luar MVP |
| invoice numbering | CONFIRMED | `{invoice_prefix}-YYYYMMDD-NNN` (`D-08`) |
| invoice lifecycle | CONFIRMED | Dibuat dari settlement; status lunas diturunkan dari payment (`D-10`) |
| invoice cancellation | OPEN | Di luar MVP |
| payment methods | CONFIRMED | `CASH`, `TRANSFER`, `QRIS`, `OTHER` (`D-05`) |
| partial payment | CONFIRMED | Diizinkan (`D-03`) |
| overpayment | CONFIRMED | Menjadi kredit Agent (`D-04`) |
| payment cancellation | OPEN | Di luar MVP |
| settlement lifecycle | CONFIRMED | Outstanding/paid derived (`D-10`) |
| insulated box tracking | CONFIRMED | Tidak dilacak pada MVP (`D-14a`) |
| dashboard | CONFIRMED | Derived dari transaksi (`BR-DB-002`) |
| reporting/export | OPEN | MVP menyediakan laporan dengan filter; export file belum ditetapkan |
| notification | OPEN | Tidak ada notifikasi pada MVP |
| backup/restore strategy for local data | CONFIRMED | Backup lokal + Google Drive opsional, auto > 7 hari, restore dengan validasi (`D-12`, `D-14b`) |
| cloud synchronization protocol | DEFERRED | Di luar MVP |
| conflict resolution | DEFERRED | Di luar MVP |
| future API contract | DEFERRED | Di luar MVP |
| future multi-user architecture | DEFERRED | Struktur data disiapkan, implementasi di luar MVP |

---

## 40. Baseline Summary

Aplikasi Konsinyasi MVP adalah aplikasi Android internal yang:

- berjalan secara local/offline-first
- menggunakan local database
- mendukung production actual result
- mengelola inventory
- mengelola agent
- mengelola consignment delivery
- mendukung HABIS/TIDAK HABIS
- mendukung physical reconciliation
- menghitung settlement
- mengelola invoice
- mencatat payment
- menangani return
- menyediakan operational task
- menyediakan reporting/analytics

Cloud, Laravel API, PostgreSQL, Filament web/admin, multi-user, dan multi-device merupakan **future evolution**, bukan dependency MVP.

Prinsip utama:

> **Build the operational application first. Add cloud infrastructure when the business needs centralized multi-user access.**