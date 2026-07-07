# Kost Management System

Kost Management System adalah aplikasi berbasis web yang dirancang untuk membantu pemilik/admin dalam mengelola operasional kos secara digital, sekaligus memudahkan penyewa dalam melakukan pengajuan sewa, pembayaran tagihan, serta memperoleh informasi terkait tempat tinggalnya.

Sistem ini dibangun menggunakan arsitektur modern dengan **Next.js** sebagai frontend, **Express.js** sebagai backend REST API, **Prisma ORM** sebagai ORM, dan **MySQL** sebagai database utama.

---

# 🌟 Fitur Utama

## Untuk Admin

- **Dashboard Cerdas**
  - Ringkasan jumlah kamar.
  - Statistik penyewa aktif.
  - Total pendapatan.
  - Total pengeluaran.
  - Perhitungan **Laba Bersih** secara otomatis.
  - Grafik statistik menggunakan Recharts.

- **Manajemen Kamar**
  - Tambah kamar.
  - Edit data kamar.
  - Hapus kamar.
  - Mengatur status kamar (tersedia/terisi).

- **Manajemen Fasilitas**
  - Menambah fasilitas.
  - Mengubah fasilitas.
  - Menghapus fasilitas.

- **Manajemen Pengajuan**
  - Melihat pengajuan penyewa.
  - Menyetujui pengajuan.
  - Menolak pengajuan.

- **Manajemen Penyewa**
  - Melihat daftar penghuni.
  - Mengelola data penyewa.

- **Manajemen Pembayaran**
  - Verifikasi bukti pembayaran.
  - Mengubah status pembayaran.

- **Laporan Keuangan**
  - Mencatat pengeluaran.
  - Mengelola biaya listrik.
  - Mengelola biaya air.
  - Mengelola biaya perawatan.
  - Menghasilkan laba bersih.

- **Manajemen Pengguna**
  - Mengelola akun pengguna.
  - Mengubah role pengguna.
  - Menghapus akun pengguna.

---

## Untuk Penyewa (Tenant)

- Dashboard penyewa.
- Melihat daftar kamar yang tersedia.
- Detail kamar beserta fasilitas.
- Mengajukan penyewaan kamar.
- Upload bukti pembayaran bulanan.
- Melihat status pembayaran.
- Notifikasi.
- Mengubah profil.
- Mengubah password.
- Mengunggah foto profil.

---

# 🛠️ Teknologi yang Digunakan

## Frontend

- Next.js
- React.js
- Tailwind CSS
- Shadcn UI
- Radix UI
- Axios
- Recharts
- SweetAlert2

## Backend

- Node.js
- Express.js
- Prisma ORM
- bcrypt

## Database

- MySQL

---

# 📁 Struktur Proyek

```
kost-management-system/
│
├── backend/
│   ├── prisma/
│   ├── routes/
│   ├── controllers/
│   ├── middleware/
│   ├── uploads/
│   ├── package.json
│   └── .env
│
├── frontend/
│   ├── app/
│   ├── components/
│   ├── public/
│   ├── package.json
│   └── ...
│
└── README.md
```

---

# 🚀 Instalasi

## 1. Clone Repository

```bash
git clone https://github.com/username/kost-management-system.git
```

Masuk ke folder project.

```bash
cd kost-management-system
```

---

# ⚙️ Setup Database (MySQL)

Pastikan MySQL Server sudah berjalan.

Buat database baru.

```sql
CREATE DATABASE kost_management;
```

---

# ⚙️ Setup Backend

Masuk ke folder backend.

```bash
cd backend
```

Install dependency.

```bash
npm install
```

Buat file `.env`.

```env
DATABASE_URL="mysql://root:password@localhost:3306/kost_management"
JWT_SECRET=your_secret_key
PORT=5000
```

> **Catatan**
>
> Jika menggunakan XAMPP/Laragon dengan user `root` tanpa password:
>
> ```env
> DATABASE_URL="mysql://root:@localhost:3306/kost_management"
> ```

Sinkronisasi database menggunakan Prisma.

```bash
npx prisma db push
```

Generate Prisma Client.

```bash
npx prisma generate
```

Jalankan backend.

```bash
npm run dev
```

Backend berjalan pada:

```
http://localhost:5000
```

---

# 💻 Setup Frontend

Buka terminal baru.

Masuk ke folder frontend.

```bash
cd frontend
```

Install dependency.

```bash
npm install
```

Jalankan aplikasi.

```bash
npm run dev
```

Frontend berjalan pada:

```
http://localhost:3000
```

---

# 🔐 Akun Admin

Saat pertama kali dijalankan, sistem belum memiliki akun Admin.

Langkah-langkah:

1. Registrasi akun melalui halaman Register.
2. Jalankan Prisma Studio.

```bash
cd backend
npx prisma studio
```

3. Buka tabel **User**.
4. Ubah nilai field:

```
role
```

dari

```
Tenant
```

menjadi

```
Admin
```

Kemudian login kembali menggunakan akun tersebut.

---

# 🗄️ Prisma Commands

Generate Prisma Client.

```bash
npx prisma generate
```

Sinkronisasi schema ke database.

```bash
npx prisma db push
```

Membuka Prisma Studio.

```bash
npx prisma studio
```

Reset database.

```bash
npx prisma migrate reset
```

---

# 📊 Modul Sistem

### Admin

- Dashboard
- Manajemen Kamar
- Manajemen Fasilitas
- Manajemen Penyewa
- Manajemen Pengajuan
- Manajemen Pembayaran
- Manajemen Pengeluaran
- Manajemen User
- Profil

### Tenant

- Dashboard
- Daftar Kamar
- Detail Kamar
- Pengajuan Sewa
- Pembayaran
- Notifikasi
- Profil

---

# 🔒 Keamanan

- Password disimpan menggunakan **bcrypt hashing**.
- Validasi data dilakukan pada sisi backend.
- Role Based Access Control (RBAC) untuk Admin dan Tenant.
- Prisma ORM digunakan untuk meminimalkan risiko SQL Injection.

---

# 📈 Arsitektur

```
Frontend (Next.js)
        │
     Axios API
        │
Backend (Express.js)
        │
   Prisma ORM
        │
     MySQL Database
```

---

# 👨‍💻 Pengembang

Aplikasi ini dikembangkan sebagai sistem informasi manajemen kos berbasis web untuk membantu digitalisasi proses administrasi, pengelolaan kamar, penyewa, pembayaran, serta laporan keuangan secara efektif dan efisien.

---

## 📄 Lisensi

Project ini dibuat untuk kebutuhan pembelajaran, pengembangan, dan portofolio.
