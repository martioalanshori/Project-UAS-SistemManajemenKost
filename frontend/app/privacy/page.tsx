'use client';

import React from 'react';
import Link from 'next/link';
import { MapPin } from 'lucide-react';

export default function PrivacyPage() {
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
        <h1 className="text-4xl font-bold mb-8">Kebijakan Privasi</h1>
        
        <div className="space-y-6 text-muted-foreground leading-relaxed">
          <section>
            <h2 className="text-2xl font-semibold text-foreground mb-4">Pengumpulan Data Informasi</h2>
            <p>Sistem Kost mengumpulkan informasi pribadi Anda (seperti nama, nomor telepon, dan email) saat Anda mendaftar akun atau melakukan pemesanan. Kami juga mengumpulkan informasi teknis dari perangkat Anda untuk tujuan analitik.</p>
          </section>

          <section>
            <h2 className="text-2xl font-semibold text-foreground mb-4">Penggunaan Data</h2>
            <p>Data pribadi Anda hanya digunakan untuk tujuan administratif, yaitu memproses pemesanan, verifikasi pembayaran, serta mengirimkan notifikasi dan informasi penting seputar layanan kost.</p>
          </section>

          <section>
            <h2 className="text-2xl font-semibold text-foreground mb-4">Perlindungan Data</h2>
            <p>Kami menerapkan standar keamanan terbaik untuk melindungi data Anda dari akses, perubahan, atau penghapusan tanpa izin. Informasi Anda tidak akan diperjualbelikan kepada pihak ketiga mana pun.</p>
          </section>
        </div>
      </main>

      <footer className="w-full bg-muted/30 py-8 border-t mt-auto">
        <div className="container mx-auto px-6 max-w-7xl flex flex-col md:flex-row justify-between items-center gap-4">
          <p className="text-sm text-muted-foreground">© 2024 Sistem Manajemen Kost. All rights reserved.</p>
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
