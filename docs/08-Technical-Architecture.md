# Technical Architecture

**Version:** 0.2  
**Date:** 2026-09-07  
**Status:** CONFIRMED for MVP direction

---

## 1. Architecture Decision

MVP menggunakan pendekatan:

> **Android-first, local-first, offline-first.**

Tidak ada dependency terhadap cloud infrastructure untuk menjalankan fungsi operasional utama.

---

## 2. MVP Architecture

```text
┌─────────────────────────────────────┐
│           Android Application       │
│                                     │
│  UI                                │
│   ↓                                 │
│  Application / Domain Logic        │
│   ↓                                 │
│  Repository Layer                  │
│   ↓                                 │
│  Local Database                    │
└─────────────────────────────────────┘
```

Local database menggunakan SQLite atau teknologi local persistence yang sesuai dengan Android stack yang akhirnya dipilih.

---

## 3. Layering

### Presentation Layer

Bertanggung jawab terhadap:

- screen
- navigation
- form
- table/list
- dashboard
- user interaction

Tidak menjadi tempat utama business rule.

### Application / Domain Layer

Bertanggung jawab terhadap:

- production processing
- inventory transaction
- delivery
- confirmation
- reconciliation
- settlement
- payment
- return
- business validation
- business invariants

Layer ini harus dapat digunakan tanpa bergantung pada UI framework.

### Repository Layer

Menjadi boundary antara business/application logic dengan persistence.

MVP:

```text
Application
    ↓
Local Repository
    ↓
SQLite
```

Future:

```text
Application
    ↓
Repository
    ├── Local
    └── Remote API
```

---

## 4. Future Cloud Architecture

Ketika centralized access diperlukan:

```text
                    ┌────────────────┐
                    │ Android Device │
                    └───────┬────────┘
                            │
                            │ HTTPS API
                            ↓
                    ┌────────────────┐
                    │ Laravel        │
                    │ Application/API│
                    └───────┬────────┘
                            │
                    ┌───────▼────────┐
                    │ PostgreSQL     │
                    └────────────────┘

                    ┌────────────────┐
                    │ Web / Filament │
                    └───────┬────────┘
                            │
                            ↓
                         Laravel
```

Laravel menjadi centralized application/backend.

Filament menjadi web/admin interface.

---

## 5. Why Local-first

MVP memiliki kebutuhan operasional lapangan dan tidak memerlukan centralized multi-user access.

Local-first memberikan:

- no hosting cost for MVP
- operation without internet
- fast local interaction
- simpler deployment
- simpler initial infrastructure
- lower operational cost

---

## 6. Why Not Laravel/Filament in MVP

Laravel + Filament tetap merupakan pilihan future backend yang baik, tetapi tidak perlu menjadi runtime dependency pada tahap awal.

MVP tidak membutuhkan:

- VPS
- PostgreSQL server
- domain
- public API
- cloud monitoring
- centralized authentication
- multi-device synchronization

Infrastructure tersebut baru memberikan nilai ketika centralized access dibutuhkan.

---

## 7. Future Synchronization

Synchronization merupakan deferred architecture.

Future sync harus dapat menangani:

- local transaction identification
- sync status
- upload
- download
- retry
- authentication
- conflict handling
- server/client state

Detail protocol belum ditentukan.

Jangan mengimplementasikan sync sebelum requirements dan API contract disepakati.

---

## 8. Identifier Strategy

Karena future synchronization akan melibatkan lebih dari satu device, entity/transaction identifier sebaiknya tidak hanya bergantung pada local auto-increment ID.

Preferred direction:

- UUID
- ULID
- atau identifier global lain yang collision-resistant

Keputusan final dapat dibuat ketika Android stack dan data model final ditentukan.

---

## 9. Inventory Architecture

Inventory menggunakan transaction/movement model.

```text
Production
     ↓
Stock Movement
     ↓
Owner Stock

Delivery
     ↓
Stock Movement
     ↓
Agent Consignment Stock

Return
     ↓
Stock Movement
     ↓
Owner Stock

Waste / Adjustment
     ↓
Stock Movement
```

Saldo stock dapat dihitung/di-cache untuk kebutuhan performa, tetapi tidak boleh kehilangan traceability terhadap movement.

---

## 10. Business Logic Independence

Business logic tidak boleh bergantung pada:

- Android Activity/Fragment/Composable
- specific UI screen
- Filament Resource
- HTTP controller
- database implementation

Contoh yang diharapkan:

```text
ReconcileDelivery
    ↓
business validation
    ↓
calculate sold/return
    ↓
create settlement
    ↓
create stock movements
```

UI hanya memanggil application operation tersebut.

---

## 11. Transaction Integrity

Operasi yang mengubah beberapa data terkait harus bersifat atomic.

Contoh reconciliation:

```text
Validate
   ↓
Calculate Sold
   ↓
Record Return
   ↓
Update Stock Movement
   ↓
Create Settlement
```

Jika terjadi kegagalan di tengah proses, sistem tidak boleh meninggalkan business state yang setengah selesai.

---

## 12. MVP Data Persistence

Local database harus menyimpan minimal data yang dibutuhkan untuk:

- business profile
- users/roles
- products/variants
- agents
- agent fee agreements
- production
- stock movements
- deliveries
- confirmations
- reconciliations
- settlements
- invoices
- payments
- returns
- operational tasks

Detail schema ditentukan dalam `05-Data-Model.md`.

---

## 13. Offline-first Principle

Fungsi operasional utama harus dapat digunakan tanpa internet.

Internet tidak boleh menjadi prerequisite untuk:

- melihat local data
- mencatat production
- mencatat delivery
- confirmation
- reconciliation
- settlement
- payment
- inventory operation

Cloud sync, ketika tersedia di masa depan, menjadi mekanisme synchronization tambahan.

---

## 14. Future Multi-user

MVP tidak membutuhkan concurrent multi-user access.

Future cloud architecture harus mendukung:

- authentication
- authorization
- multiple users
- multiple devices
- centralized data
- auditability
- synchronization

Detail authorization dan concurrency rules akan ditentukan sebelum cloud implementation.

---

## 15. Architecture Constraints

Jangan menambahkan:

- microservices
- unnecessary backend
- unnecessary API
- message broker
- complex event infrastructure
- cloud dependency

ke MVP tanpa kebutuhan yang telah disepakati.

Future cloud architecture juga tetap harus mempertahankan prinsip kesederhanaan.

---

## 16. Architecture Evolution

### Phase 1 — MVP

```text
Android
  ↓
Domain/Application
  ↓
Local Repository
  ↓
SQLite
```

### Phase 2 — Cloud-enabled

```text
Android
  ↓
Sync/Remote Repository
  ↓
Laravel API
  ↓
PostgreSQL
```

### Phase 3 — Multi-user / Admin

```text
Android ────────┐
                ├── Laravel ── PostgreSQL
Web/Filament ───┘
```

Tidak ada kewajiban untuk langsung melompat dari Phase 1 ke Phase 3.

---

## 17. Architecture Principle

> **Optimize the MVP for current operational cost and reliability, while keeping the domain model and business transactions ready for future synchronization.**

Jangan mengorbankan kesederhanaan MVP hanya untuk mengantisipasi future scale.

Namun jangan pula membuat keputusan MVP yang secara fundamental menghalangi future cloud synchronization.