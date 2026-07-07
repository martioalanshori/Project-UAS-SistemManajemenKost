<p align="center">
  <img src="frontend/app/icon.png" alt="Papakos Logo" width="80" />
</p>

<h1 align="center">🏠 Papakos — Sistem Manajemen Kost</h1>

<p align="center">
  Aplikasi web full-stack untuk mengelola operasional rumah kost secara digital, mulai dari manajemen kamar, penyewaan, pembayaran, hingga laporan keuangan.
</p>

<p align="center">
  <img src="https://img.shields.io/badge/Next.js-16-black?logo=next.js" alt="Next.js" />
  <img src="https://img.shields.io/badge/Express.js-4-green?logo=express" alt="Express" />
  <img src="https://img.shields.io/badge/Prisma-ORM-2D3748?logo=prisma" alt="Prisma" />
  <img src="https://img.shields.io/badge/PostgreSQL-Database-4169E1?logo=postgresql" alt="PostgreSQL" />
  <img src="https://img.shields.io/badge/TailwindCSS-4-06B6D4?logo=tailwindcss" alt="TailwindCSS" />
  <img src="https://img.shields.io/badge/License-MIT-yellow" alt="MIT License" />
</p>

---

## 📖 Deskripsi

**Papakos** adalah aplikasi web full-stack yang dirancang untuk memudahkan pengelolaan rumah kost (boarding house). Aplikasi ini menyediakan dua panel utama:

- **Panel Admin** — Dashboard lengkap untuk pemilik kost dalam mengelola kamar, fasilitas, pengajuan sewa, penghuni, pembayaran, pengeluaran, laporan keuangan, notifikasi, dan manajemen user.
- **Panel Tenant (Penyewa)** — Dashboard khusus penghuni untuk melihat informasi kamar, mengajukan sewa, mengelola pembayaran, dan mengatur profil.

Selain itu, terdapat **halaman publik (landing page)** yang memungkinkan calon penyewa melihat daftar kamar yang tersedia, mencari kamar berdasarkan fasilitas, serta melakukan registrasi dan login.

---

## ✨ Fitur Utama

### 🌐 Halaman Publik
- Landing page dengan pencarian kamar
- Daftar kamar dengan filter fasilitas (AC, WiFi, Dapur, Parkir)
- Halaman detail kamar
- Registrasi & Login
- Halaman Syarat & Ketentuan, Pusat Bantuan, Kebijakan Privasi

### 👨‍💼 Panel Admin
| Modul | Fitur |
|---|---|
| **Dashboard** | Ringkasan pendapatan, pengeluaran, laba bersih, grafik pendapatan, aktivitas terbaru |
| **Kamar** | CRUD kamar, kelola status (Kosong/Terisi/Dipesan), upload gambar kamar |
| **Fasilitas** | CRUD fasilitas yang tersedia untuk kamar |
| **Pengajuan** | Kelola pengajuan sewa (Approve/Reject), review KTP |
| **Penghuni** | Data penghuni aktif, riwayat penyewaan |
| **Pembayaran** | Verifikasi pembayaran penghuni, lihat bukti transfer |
| **Pengeluaran** | Catat pengeluaran operasional (Listrik, Air, WiFi, Kebersihan, dll.) |
| **Laporan** | Laporan keuangan dengan grafik, ekspor ke PDF & Excel |
| **Notifikasi** | Sistem notifikasi untuk admin |
| **Manajemen User** | Kelola data user (Admin & Tenant) |

### 🧑‍🤝‍🧑 Panel Tenant (Penyewa)
| Modul | Fitur |
|---|---|
| **Dashboard** | Info kamar saat ini, fasilitas, status penyewaan, notifikasi terbaru |
| **Pengajuan Saya** | Riwayat pengajuan sewa kamar |
| **Pembayaran** | Upload bukti pembayaran, riwayat pembayaran bulanan |
| **Profil** | Edit profil dan avatar |

---

## 🛠️ Tech Stack

### Frontend
| Teknologi | Keterangan |
|---|---|
| [Next.js 16](https://nextjs.org/) | React framework dengan App Router |
| [TypeScript](https://www.typescriptlang.org/) | Type-safe JavaScript |
| [TailwindCSS 4](https://tailwindcss.com/) | Utility-first CSS framework |
| [shadcn/ui](https://ui.shadcn.com/) | Komponen UI modern |
| [Recharts](https://recharts.org/) | Library grafik/chart |
| [React Hook Form](https://react-hook-form.com/) + [Zod](https://zod.dev/) | Form handling & validasi |
| [Axios](https://axios-http.com/) | HTTP client |
| [Lucide React](https://lucide.dev/) | Icon library |
| [jsPDF](https://github.com/parallax/jsPDF) + [SheetJS](https://sheetjs.com/) | Ekspor PDF & Excel |
| [SweetAlert2](https://sweetalert2.github.io/) + [Sonner](https://sonner.emilkowal.dev/) | Notifikasi & alert |

### Backend
| Teknologi | Keterangan |
|---|---|
| [Express.js 4](https://expressjs.com/) | Node.js web framework |
| [Prisma ORM](https://www.prisma.io/) | Database ORM modern |
| [PostgreSQL](https://www.postgresql.org/) | Relational database |
| [JWT](https://jwt.io/) | Autentikasi berbasis token |
| [bcrypt](https://github.com/kelektiv/node.bcrypt.js) | Hashing password |
| [Multer](https://github.com/expressjs/multer) | Upload file/gambar |
| [Helmet](https://helmetjs.github.io/) | HTTP security headers |

---

## 📸 Screenshot

### Halaman Publik

#### Landing Page
![Landing Page](screenshot/Tangkapan%20Layar%202026-07-07%20pada%2011.45.04.png)

#### Daftar Kamar & Filter Fasilitas
![Daftar Kamar](screenshot/Tangkapan%20Layar%202026-07-07%20pada%2011.45.09.png)

#### Halaman Login
![Login](screenshot/Tangkapan%20Layar%202026-07-07%20pada%2011.51.13.png)

#### Halaman Registrasi
![Register](screenshot/Tangkapan%20Layar%202026-07-07%20pada%2011.51.17.png)

---

### Panel Admin

#### Dashboard Admin
![Dashboard Admin](screenshot/Tangkapan%20Layar%202026-07-07%20pada%2011.57.19.png)

#### Manajemen Kamar
![Manajemen Kamar](screenshot/Tangkapan%20Layar%202026-07-07%20pada%2011.57.22.png)

#### Manajemen Pengajuan Sewa
![Manajemen Pengajuan](screenshot/Tangkapan%20Layar%202026-07-07%20pada%2011.57.28.png)

#### Manajemen Pembayaran
![Manajemen Pembayaran](screenshot/Tangkapan%20Layar%202026-07-07%20pada%2011.57.32.png)

#### Laporan Keuangan
![Laporan Keuangan](screenshot/Tangkapan%20Layar%202026-07-07%20pada%2011.57.37.png)

---

### Panel Tenant (Penyewa)

#### Dashboard Penyewa
![Dashboard Penyewa](screenshot/Tangkapan%20Layar%202026-07-07%20pada%2011.58.39.png)

#### Riwayat Pembayaran
![Riwayat Pembayaran](screenshot/Tangkapan%20Layar%202026-07-07%20pada%2011.58.46.png)

---

## 📂 Struktur Proyek

```
Project-UAS-SistemManajemenKost/
├── backend/                    # Backend API (Express.js)
│   ├── prisma/
│   │   ├── schema.prisma       # Skema database
│   │   ├── migrations/         # File migrasi database
│   │   └── seed.js             # Data seeder
│   ├── src/
│   │   ├── server.js           # Entry point server
│   │   ├── routes/             # API routes
│   │   │   ├── auth.js         # Autentikasi (login/register)
│   │   │   ├── rooms.js        # CRUD kamar
│   │   │   ├── facilities.js   # CRUD fasilitas
│   │   │   ├── applications.js # Pengajuan sewa
│   │   │   ├── tenants.js      # Data penghuni
│   │   │   ├── payments.js     # Pembayaran
│   │   │   ├── expenses.js     # Pengeluaran
│   │   │   ├── notifications.js# Notifikasi
│   │   │   └── users.js        # Manajemen user
│   │   └── lib/                # Helper & middleware
│   └── uploads/                # File upload (gambar)
│
├── frontend/                   # Frontend (Next.js)
│   ├── app/                    # App Router pages
│   │   ├── page.tsx            # Landing page
│   │   ├── login/              # Halaman login
│   │   ├── register/           # Halaman registrasi
│   │   ├── rooms/              # Halaman daftar kamar
│   │   ├── admin/              # Panel Admin
│   │   │   ├── dashboard/
│   │   │   ├── rooms/
│   │   │   ├── facilities/
│   │   │   ├── applications/
│   │   │   ├── tenants/
│   │   │   ├── payments/
│   │   │   ├── expenses/
│   │   │   ├── reports/
│   │   │   ├── notifications/
│   │   │   └── users/
│   │   └── tenant/             # Panel Penyewa
│   │       ├── dashboard/
│   │       ├── applications/
│   │       ├── payments/
│   │       └── profile/
│   ├── components/             # Komponen UI
│   │   ├── ui/                 # shadcn/ui components
│   │   └── layouts/            # Layout components
│   ├── context/                # React context (auth, etc.)
│   ├── lib/                    # Utility functions
│   └── types/                  # TypeScript types
│
├── screenshot/                 # Screenshot aplikasi
└── LICENSE                     # MIT License
```

---

## 🗃️ Database Schema

Aplikasi menggunakan **PostgreSQL** dengan **Prisma ORM**. Berikut model-model utama:

```
User ──────────┬── RentalApplication ──── Tenant ──── Payment
               │
Room ──────────┘
  │
Facility (many-to-many)

Notification ── User
Expense (standalone)
```

| Model | Deskripsi |
|---|---|
| `User` | Data pengguna (Admin & Tenant) |
| `Room` | Data kamar kost beserta harga dan status |
| `Facility` | Fasilitas kamar (AC, WiFi, dll.) — relasi many-to-many dengan Room |
| `RentalApplication` | Pengajuan sewa kamar oleh penyewa |
| `Tenant` | Data penghuni aktif yang sudah di-approve |
| `Payment` | Riwayat pembayaran bulanan penghuni |
| `Notification` | Notifikasi untuk user |
| `Expense` | Pencatatan pengeluaran operasional kost |

---

## 🚀 Instalasi & Menjalankan Aplikasi

### Prasyarat

Pastikan sudah terinstall:
- [Node.js](https://nodejs.org/) (v18 atau lebih baru)
- [PostgreSQL](https://www.postgresql.org/) (v14 atau lebih baru)
- [Git](https://git-scm.com/)

### 1. Clone Repository

```bash
git clone https://github.com/username/Project-UAS-SistemManajemenKost.git
cd Project-UAS-SistemManajemenKost
```

### 2. Setup Backend

```bash
# Masuk ke folder backend
cd backend

# Install dependencies
npm install

# Buat file .env (sesuaikan dengan konfigurasi lokal)
# Isi file .env:
```

Buat file `.env` di folder `backend/` dengan isi:

```env
DATABASE_URL="postgresql://username:password@localhost:5432/papakos_db"
JWT_SECRET=your-secret-key-here
PORT=5000
CORS_ORIGIN=http://localhost:3000
```

> ⚠️ **Penting:** Ganti `username`, `password`, dan `your-secret-key-here` dengan value milikmu sendiri.

```bash
# Jalankan migrasi database
npx prisma migrate dev

# (Opsional) Jalankan seeder untuk data dummy
npx prisma db seed

# Jalankan backend server
npm run dev
```

Backend akan berjalan di `http://localhost:5000`

### 3. Setup Frontend

```bash
# Buka terminal baru, masuk ke folder frontend
cd frontend

# Install dependencies
npm install

# Buat file .env.local
```

Buat file `.env.local` di folder `frontend/` dengan isi:

```env
NEXT_PUBLIC_API_URL=http://localhost:5000
```

```bash
# Jalankan frontend development server
npm run dev
```

Frontend akan berjalan di `http://localhost:3000`

### 4. Akses Aplikasi

Buka browser dan akses `http://localhost:3000`

#### Akun Default (setelah seeding)

| Role | Email | Password |
|---|---|---|
| Admin | `admin@kost.com` | `admin123` |
| Tenant | `budi@gmail.com` | `password` |

---

## 📡 API Endpoints

| Prefix | Deskripsi |
|---|---|
| `POST /api/auth/login` | Login user |
| `POST /api/auth/register` | Register user baru |
| `GET/POST/PUT/DELETE /api/rooms` | CRUD kamar |
| `GET/POST/PUT/DELETE /api/facilities` | CRUD fasilitas |
| `GET/POST/PUT /api/applications` | Kelola pengajuan sewa |
| `GET/POST/PUT /api/tenants` | Kelola data penghuni |
| `GET/POST/PUT /api/payments` | Kelola pembayaran |
| `GET/POST/PUT/DELETE /api/expenses` | Kelola pengeluaran |
| `GET/POST /api/notifications` | Kelola notifikasi |
| `GET/PUT/DELETE /api/users` | Manajemen user |

---

## 🔐 Keamanan

- **JWT Authentication** — Token-based auth untuk setiap request API
- **bcrypt** — Password hashing dengan salt rounds
- **Helmet** — HTTP security headers
- **CORS** — Konfigurasi origin yang diizinkan
- **Express Validator** — Validasi input pada backend
- **Zod** — Validasi form pada frontend

---

## 📄 Lisensi

Proyek ini dilisensikan di bawah [MIT License](LICENSE).

**Copyright © 2026 Muhammad Martio Al Anshori**

---

<p align="center">
  Dibuat dengan ❤️ untuk UAS Pemrograman Web
</p>
