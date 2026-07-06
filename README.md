# Kost Management System

Kost Management System adalah aplikasi berbasis web yang dirancang untuk membantu pemilik/admin mengelola kos-kosan dan memudahkan penyewa dalam melakukan pengajuan, pembayaran, serta menerima informasi. Sistem ini dibangun dengan arsitektur modern menggunakan **Next.js** di sisi _frontend_ dan **Express.js + Prisma** di sisi _backend_.

## 🌟 Fitur Utama

### Untuk Admin
* **Dashboard Cerdas**: Ringkasan jumlah kamar, pendapatan, pengeluaran, dan kalkulasi **Laba Bersih** otomatis beserta grafik interaktif.
* **Manajemen Kamar & Fasilitas**: Tambah, edit, hapus data kamar dan fasilitas yang tersedia.
* **Manajemen Penyewa & Pengajuan**: Memantau pengajuan sewa masuk (setujui/tolak) dan daftar penghuni aktif.
* **Manajemen Pembayaran**: Verifikasi bukti transfer yang diunggah penyewa.
* **Laporan Keuangan (Pengeluaran)**: Pencatatan tagihan listrik, air, perawatan, dll, yang akan memotong pendapatan kotor menjadi laba bersih.
* **Manajemen Pengguna**: Kelola akun pengguna dan _role_ (Admin/Tenant).

### Untuk Penyewa (Tenant)
* **Pencarian Kamar**: Katalog kamar yang tersedia beserta deskripsi, harga, dan fasilitas.
* **Dashboard Penyewa**: Informasi kamar yang disewa dan notifikasi.
* **Pengajuan Sewa**: Sistem *booking* kamar secara daring.
* **Pembayaran Tagihan**: Upload bukti pembayaran bulanan.
* **Profil Pengguna**: Pengaturan profil (nama, no. hp, foto/avatar, dan ubah password).

---

## 🛠️ Teknologi yang Digunakan

* **Frontend**: Next.js (React), Tailwind CSS, Shadcn UI (Radix UI), Recharts (Grafik), Axios, SweetAlert2.
* **Backend**: Node.js, Express.js, Prisma ORM, bcrypt (Keamanan Password).
* **Database**: SQLite (via Prisma).

---

## 🚀 Tata Cara Instalasi

Ikuti langkah-langkah di bawah ini untuk menjalankan aplikasi secara lokal di mesin Anda.

### 1. Persiapan
Pastikan Anda sudah menginstal **Node.js** (versi 16 atau yang lebih baru) di sistem Anda.
Buka terminal dan navigasikan ke direktori utama proyek ini:
```bash
cd kost-management-system
```

### 2. Setup Backend
Backend berjalan di port `5000` dan mengelola *database* serta *business logic*.

1. Masuk ke direktori backend:
   ```bash
   cd backend
   ```
2. Instal semua dependensi:
   ```bash
   npm install
   ```
3. Sinkronisasi skema *database* menggunakan Prisma (akan membuat file `dev.db` untuk SQLite lokal) dan menghasilkan Prisma Client:
   ```bash
   npx prisma db push
   npx prisma generate
   ```
4. Jalankan server *backend*:
   ```bash
   npm run dev
   ```
   > Server backend sekarang berjalan di `http://localhost:5000`.

### 3. Setup Frontend
Frontend berjalan di port `3000` dan menyediakan antarmuka bagi pengguna.
Buka **terminal/tab baru** agar server backend tetap berjalan.

1. Masuk ke direktori frontend:
   ```bash
   cd frontend
   ```
2. Instal semua dependensi:
   ```bash
   npm install
   ```
3. Jalankan *development server*:
   ```bash
   npm run dev
   ```
   > Aplikasi frontend sekarang dapat diakses di browser melalui `http://localhost:3000`.

---

## 🔐 Akun Akses Default

Saat pertama kali dijalankan, sistem mungkin tidak memiliki akun admin. Anda dapat melakukan Registrasi melalui antarmuka web, kemudian menggunakan salah satu alat manajemen SQLite (seperti *Prisma Studio*) untuk mengubah `role` akun Anda menjadi `Admin`.

Untuk membuka Prisma Studio (GUI database):
```bash
cd backend
npx prisma studio
```
Lalu ubah kolom `role` pada pengguna yang baru didaftarkan dari `Tenant` menjadi `Admin`.

---
_Aplikasi ini dikembangkan untuk memudahkan pengelolaan properti kos-kosan secara digital, efektif, dan efisien._
