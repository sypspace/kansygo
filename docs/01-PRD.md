# Product Requirements Document

**Version:** 1.0  
**Status:** Confirmed  
**Last Updated:** 2026-09-07

---

# 1. Product Overview

Aplikasi Distribusi Konsinyasi adalah aplikasi Android internal untuk membantu operasional bisnis distribusi produk frozen food dengan model konsinyasi.

Aplikasi mendukung proses utama:

**Production → Inventory → Delivery Planning → Delivery Confirmation → Sales/Return → Settlement → Invoice → Payment**

MVP dirancang sebagai aplikasi:

- Android;
- single-device;
- single-business;
- single operational user;
- local-first;
- offline-first.

Seluruh operasi utama tidak bergantung pada koneksi internet.

Cloud tidak digunakan sebagai backend operasional MVP. Cloud hanya dapat digunakan secara opsional untuk **backup database lokal**, khususnya melalui Google Drive.

---

# 2. Problem Statement

Operasional bisnis konsinyasi membutuhkan pencatatan yang saling berhubungan antara:

- produksi;
- persediaan;
- produk yang akan dikirim;
- agen/reseller;
- pengiriman;
- barang terjual;
- barang dikembalikan;
- settlement;
- invoice;
- pembayaran.

Pencatatan manual atau tersebar dapat menyebabkan:

- ketidaksesuaian stok;
- kesalahan pencatatan delivery;
- kesalahan perhitungan barang terjual dan return;
- kesalahan settlement;
- pembayaran yang belum tertagih sulit dipantau;
- riwayat transaksi sulit ditelusuri;
- performa produk dan agen sulit dianalisis.

Aplikasi bertujuan menyediakan satu sistem operasional sederhana yang menghubungkan seluruh proses tersebut.

---

# 3. Product Vision

> **Menjadi alat operasional sederhana yang membantu bisnis konsinyasi mengontrol produksi, stok, distribusi, penjualan, dan pembayaran tanpa menambah beban administrasi.**

### Product Principles

1. **Simple** — hanya menyediakan kompleksitas yang memang dibutuhkan.
2. **Operational First** — fokus pada pekerjaan operasional sehari-hari.
3. **Offline First** — internet bukan dependency untuk operasi utama.
4. **Traceable** — perubahan stok dan transaksi dapat ditelusuri.
5. **Financially Safe** — perhitungan settlement dan payment harus dapat dipertanggungjawabkan.
6. **Low Cost** — meminimalkan kebutuhan infrastruktur.
7. **Future-ready, Not Future-heavy** — siap dikembangkan tanpa membebani MVP dengan kebutuhan masa depan.

---

# 4. Product Goals

MVP bertujuan membantu pengguna:

1. mencatat produksi aktual;
2. mengelola produk dan agen;
3. mengetahui kondisi stok;
4. menentukan produk dan jumlah yang akan dikirim kepada agen;
5. mencatat bahwa delivery telah dilakukan;
6. mencatat hasil penjualan;
7. melakukan rekonsiliasi barang yang tersisa;
8. menghitung barang terjual dan return;
9. membuat settlement;
10. membuat invoice;
11. mencatat pembayaran;
12. memantau outstanding;
13. mengetahui aktivitas operasional yang perlu dilakukan;
14. melihat informasi dasar performa produk dan agen;
15. melakukan backup database secara opsional.

Aplikasi harus membantu pengguna menjawab:

> **"Hari ini saya harus mengunjungi siapa dan melakukan apa?"**

---

# 5. Product Scope

Product Scope MVP terdiri dari fungsi-fungsi utama berikut.

| Functional Area                | MVP              | Deskripsi                                                                    |
| ------------------------------ | ---------------- | ---------------------------------------------------------------------------- |
| **Dashboard**                  | ✅               | Menampilkan ringkasan kondisi operasional dan aktivitas yang perlu dilakukan |
| **Product & Variant**          | ✅               | Mengelola produk yang dijual                                                 |
| **Agent**                      | ✅               | Mengelola data agen/reseller                                                 |
| **Production**                 | ✅               | Mencatat hasil produksi aktual                                               |
| **Inventory**                  | ✅               | Mengelola dan menelusuri stok                                                |
| **Delivery Planning**          | ✅               | Menentukan produk, jumlah, dan agen tujuan delivery                          |
| **Delivery Confirmation**      | ✅               | Mengonfirmasi bahwa delivery benar-benar dilakukan                           |
| **Sales / Daily Confirmation** | ✅               | Mencatat hasil penjualan melalui status HABIS/TIDAK HABIS                    |
| **Reconciliation**             | ✅               | Mencatat barang yang tersisa dan menentukan sold/return                      |
| **Settlement**                 | ✅               | Menghitung nilai transaksi berdasarkan barang terjual                        |
| **Invoice**                    | ✅               | Membuat invoice berdasarkan settlement                                       |
| **Payment**                    | ✅               | Mencatat pembayaran dan outstanding                                          |
| **Operational Tasks**          | ✅               | Menampilkan aktivitas yang perlu dilakukan                                   |
| **Reports & Analytics**        | ✅               | Menampilkan informasi performa produk, agen, dan inventory                   |
| **Business Profile**           | ✅               | Menyimpan identitas bisnis                                                   |
| **User Profile**               | ✅               | Menyimpan identitas pengguna untuk kebutuhan saat ini dan future development |
| **Database Backup**            | 🟡 Optional      | Backup database lokal ke Google Drive                                        |
| **Authentication**             | 🟡 Optional/Open | Authentication pengguna, terutama jika diperlukan untuk Google Drive         |
| **Cloud Sync**                 | ❌ Future        | Sinkronisasi data dengan server/cloud                                        |
| **Multi-user**                 | ❌ Future        | Penggunaan oleh banyak user                                                  |
| **Multi-device**               | ❌ Future        | Penggunaan dan sinkronisasi antar-device                                     |
| **Web/Admin**                  | ❌ Future        | Administrasi melalui aplikasi web                                            |

### Scope Boundary

Product Scope di atas menunjukkan **fungsi yang tersedia**, tetapi belum mendefinisikan detail:

- field;
- validation;
- business rules;
- status/state;
- permission;
- database structure;
- UI flow;
- acceptance criteria.

Detail tersebut akan ditentukan pada dokumen requirement berikutnya.

---

# 6. Target Users

## 6.1 MVP User

MVP disederhanakan menjadi **single operational user**.

Pengguna dapat berupa admin atau petugas yang ditunjuk oleh bisnis untuk mengerjakan seluruh proses operasional.

Tidak ada pemisahan role dan permission pada MVP.

Pengguna yang sama dapat melakukan:

- production;
- inventory;
- delivery planning;
- delivery confirmation;
- reconciliation;
- settlement;
- invoice;
- payment;
- monitoring;
- reporting.

## 6.2 Future User Model

Struktur aplikasi tetap menyediakan konsep:

- Organization/Business Profile;
- User Profile.

Struktur tersebut menjadi dasar apabila di masa depan aplikasi dikembangkan menjadi:

- authentication;
- multiple users;
- role;
- permission;
- multi-device;
- centralized system.

---

# 7. Organization / Business Profile

Aplikasi memiliki satu Business/Organization Profile.

Informasi minimal dapat meliputi:

- business ID;
- business name;
- address;
- phone;
- email;
- logo;
- informasi bisnis lainnya yang diperlukan.

Business Profile digunakan sebagai identitas bisnis dalam aplikasi dan dokumen seperti invoice.

Struktur data harus memungkinkan pengembangan ke sistem yang mendukung lebih dari satu organization di masa depan, tanpa membuat MVP menjadi multi-tenant.

### Historical Business Information

Informasi bisnis yang digunakan dalam dokumen/transaksi historis harus dapat dipertahankan sebagai snapshot apabila diperlukan sehingga perubahan Business Profile tidak mengubah informasi historis.

---

# 8. User Profile & Authentication

MVP memiliki konsep User Profile meskipun authentication belum wajib.

Informasi minimal:

- user ID;
- name;
- email;
- profile information.

User Profile dapat digunakan untuk identitas pengguna dan metadata transaksi.

### Authentication

Authentication:

**Status: OPTIONAL / OPEN**

MVP dapat berjalan tanpa authentication.

Jika diperlukan, Google Account/Google SSO dapat digunakan terutama untuk mengaktifkan akses ke Google Drive sebagai media backup.

Authentication tidak boleh menjadi dependency bagi operasi utama aplikasi.

Jika tidak ada akun Google yang terhubung, aplikasi tetap dapat digunakan secara offline.

---

# 9. Product & Variant

Product/Variant dibuat sederhana.

Informasi minimal:

- ID;
- Name;
- Selling Price;
- HPP;
- Description (optional).

Struktur tidak perlu memiliki product management yang kompleks pada MVP.

Jika bisnis memiliki beberapa varian produk, masing-masing varian dapat direpresentasikan sebagai item yang dapat memiliki ID, nama, harga jual, dan deskripsi.

Fitur seperti:

- barcode;
- SKU kompleks;
- kategori bertingkat;
- atribut produk;
- unit conversion;
- pricing tier;

tidak menjadi kebutuhan MVP kecuali diperlukan kemudian.

---

# 10. Agent / Reseller

Agent adalah pihak yang menerima produk untuk dijual secara konsinyasi.

Agent tidak menggunakan aplikasi pada MVP.

Informasi agent minimal dapat meliputi:

- agent ID;
- name;
- contact;
- address/location;
- active/inactive status;
- informasi operasional lain yang diperlukan.

Agent tidak melakukan input transaksi langsung ke aplikasi.

Hasil penjualan diperoleh melalui proses konfirmasi:

- **HABIS**
- **TIDAK HABIS**

Jumlah barang tersisa pada kondisi TIDAK HABIS ditentukan oleh petugas melalui pemeriksaan fisik.

---

# 11. Production

Fungsi Production digunakan untuk mencatat hasil produksi aktual.

Contoh:

- Batch 001
- Coklat: 41 pcs
- Strawberry: 42 pcs
- Total: 83 pcs

Sistem menghitung total produksi dan menghasilkan inventory movement.

Pengguna tidak mengubah saldo stok secara langsung melalui fungsi Production.

---

# 12. Inventory

Inventory digunakan untuk memantau pergerakan stok.

Inventory mencakup setidaknya:

- production;
- owner stock;
- delivery;
- stock at agent;
- sold;
- return;
- waste/adjustment.

Stock movement menjadi dasar pencatatan perubahan stok.

Pengguna tidak melakukan perubahan saldo stok secara bebas tanpa transaksi atau adjustment yang sesuai.

---

# 13. Delivery Planning

Delivery Planning digunakan untuk menentukan barang yang **akan dikirim**.

Untuk setiap delivery, pengguna menentukan:

- agent tujuan;
- product/variant;
- quantity.

Contoh:

**Agent A**

- Coklat: 30
- Strawberry: 20

**Agent B**

- Coklat: 20
- Strawberry: 30

Pada MVP, quantity dan komposisi delivery ditentukan secara manual.

Sistem tidak memberikan automatic delivery recommendation pada MVP.

---

# 14. Delivery Confirmation

Delivery Confirmation digunakan untuk mencatat bahwa delivery yang direncanakan **benar-benar telah dilakukan**.

Dengan demikian terdapat dua aktivitas berbeda:

### Delivery Planning

> Apa yang direncanakan untuk dikirim dan kepada siapa?

### Delivery Confirmation

> Apakah barang tersebut benar-benar sudah dikirim?

Delivery Confirmation menjadi dasar untuk melanjutkan lifecycle barang menuju agent.

Jika terdapat perbedaan antara planned delivery dan actual delivery, mekanisme pencatatannya akan ditentukan pada Business Rules dan Functional Requirements.

---

# 15. Sales / Daily Confirmation

Setelah delivery, hasil penjualan agent dikategorikan menjadi:

- **HABIS**
- **TIDAK HABIS**

### HABIS

Jika HABIS:

- seluruh delivery dianggap terjual;
- return = 0;
- tidak diperlukan physical reconciliation;
- settlement dapat dibuat;
- invoice dapat dibuat;
- payment dapat dilakukan saat itu atau pada kunjungan berikutnya.

### TIDAK HABIS

Jika TIDAK HABIS:

- diperlukan physical reconciliation;
- petugas memeriksa barang yang tersisa;
- return dicatat;
- sold dihitung berdasarkan delivery dikurangi return;
- barang yang tersisa dapat dikembalikan;
- settlement dibuat berdasarkan hasil reconciliation.

---

# 16. Reconciliation

Reconciliation digunakan untuk mencocokkan barang yang dikirim dengan kondisi aktual.

Aturan utama:

**Sold + Returned = Delivered**

Contoh:

- Delivered = 50
- Returned = 4
- Sold = 46

Sistem menghitung sold berdasarkan hasil reconciliation.

Return menghasilkan inventory movement kembali ke owner stock sesuai business rules.

---

# 17. Settlement

Settlement digunakan untuk menghitung nilai transaksi berdasarkan barang yang terjual.

Settlement berbeda dari payment.

Contoh:

- Sold = 46 pcs
- Selling Price = Rp3.000
- Gross Sales = Rp138.000
- Agent Fee = Rp500/pcs
- Agent Fee Total = Rp23.000
- Net Settlement = Rp115.000

Settlement menyimpan nilai transaksi yang telah dihitung sehingga perubahan master product atau agent fee di kemudian hari tidak mengubah histori.

### Agent Fee

MVP menggunakan:

- fixed nominal fee per unit;
- dapat berbeda antar-agent;
- dapat dinegosiasikan per-agent.

Agent Fee tidak ditentukan berdasarkan agent level.

**Agent Level ≠ Agent Fee**

Percentage-based fee tidak termasuk MVP.

---

# 18. Invoice

Invoice dibuat berdasarkan Settlement.

Invoice:

- dapat dibuat sebelum payment;
- menggunakan informasi settlement;
- dapat dibuat sebagai PDF;
- dapat dibagikan menggunakan mekanisme share pada Android;
- tidak menggunakan WhatsApp API pada MVP.

Informasi penting yang digunakan pada invoice historis harus dipertahankan sebagai snapshot.

---

# 19. Payment & Outstanding

Payment merupakan proses terpisah dari Settlement.

Sistem harus dapat menunjukkan:

- settlement yang belum dibayar;
- settlement yang sudah dibayar;
- outstanding.

Contoh lifecycle:

### HABIS

Delivery → HABIS → Settlement → Invoice → Payment

Payment dapat dilakukan pada saat itu maupun pada kunjungan berikutnya.

### TIDAK HABIS

Delivery → TIDAK HABIS → Reconciliation → Return → Settlement → Invoice → Payment

Detail seperti partial payment, overpayment, payment cancellation, dan payment method yang lebih kompleks dapat ditentukan kemudian.

---

# 20. Operational Tasks

Operational Tasks membantu pengguna mengetahui pekerjaan yang harus dilakukan.

Contoh aktivitas pagi:

- delivery agent;
- collection outstanding payment.

Contoh aktivitas siang/sore:

- agent dengan status TIDAK HABIS;
- physical reconciliation;
- pickup return;
- pickup insulated box;
- settlement;
- payment collection.

Tujuannya adalah mengurangi kebutuhan pengguna mencari transaksi atau agent secara manual.

---

# 21. Dashboard

Dashboard memberikan ringkasan kondisi operasional.

Informasi yang dapat ditampilkan antara lain:

- aktivitas delivery hari ini;
- agent yang perlu dikunjungi;
- agent dengan status TIDAK HABIS;
- outstanding payment;
- stock condition;
- low stock;
- ringkasan produksi;
- ringkasan penjualan.

Detail widget/dashboard belum ditentukan pada PRD.

---

# 22. Reports & Analytics

MVP menyediakan laporan dan analitik dasar.

### Product

- quantity produced;
- quantity delivered;
- quantity sold;
- quantity returned;
- gross sales;
- sell-through;
- performance per product/variant.

### Agent

- quantity delivered;
- quantity sold;
- quantity returned;
- sell-through;
- gross sales;
- agent fee;
- net settlement;
- payment;
- outstanding.

### Inventory

- production;
- stock in hand;
- stock at agent;
- delivery;
- sold;
- return;
- waste/adjustment;
- stock movement.

Detail report dan filter ditentukan pada Functional Requirements.

---

# 23. Database & Offline Behavior

Database utama MVP berada secara lokal pada device.

Aplikasi dirancang **offline-first**, bukan sekadar menyediakan "offline mode".

Artinya operasi utama memang menggunakan local database sebagai sumber data utama.

Operasi berikut harus dapat dilakukan tanpa internet:

- product management;
- agent management;
- production;
- inventory;
- delivery planning;
- delivery confirmation;
- sales confirmation;
- reconciliation;
- settlement;
- invoice;
- payment;
- reporting dasar.

Internet hanya dibutuhkan oleh fitur yang memang memerlukan koneksi eksternal, seperti Google Drive backup.

### Data Integrity

Data transaksi yang telah disimpan di local database menjadi sumber data operasional utama.

Aplikasi harus meminimalkan risiko kehilangan atau kerusakan data akibat:

- aplikasi ditutup;
- perangkat offline;
- berpindah screen;
- kegagalan proses;
- restart aplikasi.

Detail mekanisme database transaction, recovery, validation, dan backup ditentukan pada dokumen teknis/functional berikutnya.

---

# 24. Database Backup

MVP dapat menyediakan backup database lokal ke Google Drive sebagai fitur optional.

Konsep:

```text
Local Database
      ↓
Backup File
      ↓
Google Drive
```

Backup **bukan synchronization**.

Tujuan backup adalah menyediakan mekanisme recovery jika terjadi:

- kerusakan device;
- kehilangan device;
- database corruption;
- pergantian device.

### Backup Activation

Untuk menggunakan Google Drive backup, user perlu menghubungkan akun Google.

Jika tidak ada akun Google yang terhubung:

- aplikasi tetap dapat digunakan;
- database tetap disimpan lokal;
- fitur backup cloud tidak tersedia.

### Recommended MVP Approach

Untuk tahap awal, backup direkomendasikan menggunakan:

- manual "Backup Now";
- backup file database;
- timestamp/version;
- informasi last successful backup.

Automatic scheduled backup dapat dipertimbangkan setelah mekanisme manual stabil.

### Restore

Restore merupakan bagian dari strategi backup.

MVP sebaiknya menyediakan mekanisme restore yang aman, tetapi detail teknisnya akan ditentukan kemudian.

---

# 25. Future Cloud Evolution

MVP tidak menggunakan cloud backend.

Jika kebutuhan berkembang, arsitektur dapat dikembangkan menjadi:

```text
Android
    ↓
Repository / Sync Layer
    ↓
Laravel API
    ↓
PostgreSQL

Web/Admin
    ↓
Filament
    ↓
Laravel
```

Future capabilities dapat mencakup:

- centralized database;
- multi-user;
- multi-device;
- cloud synchronization;
- web/admin;
- centralized reporting;
- API.

Semua fitur tersebut bukan dependency MVP.

---

# 26. Future-readiness Principle

MVP tidak perlu mengimplementasikan synchronization sejak awal.

Namun desain internal harus menghindari coupling yang membuat pengembangan cloud menjadi sulit.

Prinsip yang digunakan:

```text
UI
 ↓
Application / Domain Logic
 ↓
Repository
 ↓
Local Database
```

Future:

```text
UI
 ↓
Application / Domain Logic
 ↓
Repository / Sync
 ↓
Local Database + API
```

MVP tidak perlu memiliki:

- sync queue;
- conflict resolution;
- server authority;
- retry synchronization;
- distributed transaction;
- complex sync status.

Hal tersebut baru dirancang ketika cloud synchronization benar-benar diperlukan.

Namun data sebaiknya memiliki:

- stable ID;
- timestamps yang relevan;
- historical transaction;
- pemisahan master data dan transactional data;
- business logic yang tidak bergantung langsung pada SQLite.

---

# 27. Out of Scope — MVP

Fitur berikut tidak termasuk MVP:

- agent application;
- agent self-service;
- online ordering;
- cloud backend;
- Laravel API;
- PostgreSQL server;
- web/admin application;
- multi-user;
- multi-device;
- cloud synchronization;
- automatic delivery recommendation;
- agent leveling;
- percentage-based agent fee;
- WhatsApp API;
- advanced notification infrastructure;
- complex authentication/authorization;
- complex product attributes;
- advanced pricing;
- complex payment processing.

**Google Drive Backup** bukan out of scope, tetapi merupakan **Optional MVP Feature**.

---

# 28. Success Criteria

MVP dianggap berhasil apabila pengguna dapat:

1. mencatat produksi aktual secara offline;
2. mengelola produk dan agent;
3. melihat stok;
4. menentukan delivery;
5. mengonfirmasi delivery;
6. mencatat status HABIS/TIDAK HABIS;
7. melakukan reconciliation untuk TIDAK HABIS;
8. menghitung sold dan return secara otomatis;
9. membuat settlement;
10. membuat invoice;
11. mencatat payment;
12. melihat outstanding;
13. melihat operational tasks;
14. melihat dashboard dan laporan dasar;
15. menjalankan seluruh operasi utama tanpa internet;
16. melakukan backup database ke Google Drive jika fitur tersebut diaktifkan.

---

# 29. Requirement Status

Status requirement yang digunakan dalam dokumentasi:

- **CONFIRMED** — telah disepakati;
- **PROPOSED** — rekomendasi yang menunggu persetujuan;
- **OPEN** — belum diputuskan;
- **DEFERRED** — sengaja ditunda untuk fase berikutnya;
- **REJECTED** — tidak digunakan.

---

# 30. Current Product Direction

Arah produk saat ini:

> **Membangun aplikasi Android internal yang sederhana, single-device, local-first, dan offline-first untuk menangani lifecycle distribusi konsinyasi dari produksi hingga pembayaran.**

MVP tidak membutuhkan server/cloud untuk menjalankan operasional.

Google Drive digunakan secara opsional sebagai media backup database lokal.

Struktur **Business/Organization Profile** dan **User Profile** tetap disiapkan sebagai fondasi pengembangan authentication dan sistem yang lebih terpusat di masa depan.

Prinsip pengembangan:

> **Build simple for today, but don't design yourself into a dead end for tomorrow.**
