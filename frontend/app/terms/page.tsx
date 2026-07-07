'use client';

import React from 'react';
import Link from 'next/link';
import { MapPin } from 'lucide-react';

export default function TermsPage() {
  return (
    <div className="flex flex-col min-h-screen font-sans">
      <header className="fixed top-0 z-50 w-full bg-white border-b px-6 h-[80px] flex items-center justify-between">
        <Link className="flex items-center gap-2" href="/">
          <img src="/img/logo.png" alt="Papakos Logo" className="h-8 w-auto object-contain" />
          <span className="font-bold text-xl text-primary tracking-tight">Papakos</span>
        </Link>
        <Link href="/" className="text-sm font-medium hover:underline">
          Kembali ke Beranda
        </Link>
      </header>

      <main className="flex-1 mt-[80px] container mx-auto px-6 max-w-4xl py-12">
        <h1 className="text-4xl font-bold mb-8">Syarat dan Ketentuan</h1>
        
        <div className="space-y-6 text-muted-foreground leading-relaxed">
          <section>
            <h2 className="text-2xl font-semibold text-foreground mb-4">1. Pendahuluan</h2>
            <p>Selamat datang di Sistem Kost. Syarat dan ketentuan ini mengatur penggunaan layanan penyewaan kost melalui platform kami. Dengan mengakses dan menggunakan platform ini, Anda dianggap telah membaca, memahami, dan menyetujui semua syarat dan ketentuan yang berlaku.</p>
          </section>

          <section>
            <h2 className="text-2xl font-semibold text-foreground mb-4">2. Pendaftaran dan Akun</h2>
            <ul className="list-disc pl-6 space-y-2">
              <li>Setiap calon penghuni wajib mendaftarkan diri dengan data asli yang valid (KTP).</li>
              <li>Akun tidak dapat dipindahtangankan kepada pihak ketiga.</li>
              <li>Satu akun hanya berlaku untuk satu individu.</li>
            </ul>
          </section>

          <section>
            <h2 className="text-2xl font-semibold text-foreground mb-4">3. Sistem Pembayaran</h2>
            <ul className="list-disc pl-6 space-y-2">
              <li>Pembayaran wajib dilakukan tepat waktu setiap bulannya sesuai tanggal jatuh tempo.</li>
              <li>Bukti transfer harus diunggah melalui sistem untuk diverifikasi oleh admin.</li>
              <li>Keterlambatan pembayaran dapat dikenakan denda sesuai kebijakan manajemen kost.</li>
            </ul>
          </section>

          <section>
            <h2 className="text-2xl font-semibold text-foreground mb-4">4. Tata Tertib Kost</h2>
            <p>Penghuni wajib menjaga kebersihan, ketertiban, dan keamanan fasilitas kost. Dilarang keras membawa minuman keras, obat-obatan terlarang, atau melakukan tindakan melanggar hukum di lingkungan kost.</p>
          </section>
        </div>
      </main>

      <footer className="w-full bg-muted/30 py-8 border-t mt-auto">
        <div className="container mx-auto px-6 max-w-7xl flex flex-col md:flex-row justify-between items-center gap-4">
          <p className="text-sm text-muted-foreground">© 2026 Muhammad Martio Al Anshori. All rights reserved.</p>
          <div className="flex gap-6">
            <Link className="text-sm text-muted-foreground hover:underline" href="/privacy">Privasi</Link>
            <Link className="text-sm text-muted-foreground hover:underline" href="/terms">Syarat</Link>
            <Link className="text-sm text-muted-foreground hover:underline" href="/sitemap">Peta Situs</Link>
          </div>
        </div>
      </footer>
    </div>
  );
}
