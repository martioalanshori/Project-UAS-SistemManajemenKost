'use client';

import React from 'react';
import Link from 'next/link';
import { MapPin } from 'lucide-react';

export default function SitemapPage() {
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
        <h1 className="text-4xl font-bold mb-8">Peta Situs</h1>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 text-muted-foreground">
          <section>
            <h2 className="text-xl font-semibold text-foreground mb-4 border-b pb-2">Navigasi Utama</h2>
            <ul className="space-y-3">
              <li><Link href="/" className="hover:text-primary hover:underline">Beranda</Link></li>
              <li><Link href="/rooms" className="hover:text-primary hover:underline">Cari Kamar</Link></li>
              <li><Link href="/login" className="hover:text-primary hover:underline">Masuk / Login</Link></li>
              <li><Link href="/register" className="hover:text-primary hover:underline">Daftar Akun Baru</Link></li>
            </ul>
          </section>

          <section>
            <h2 className="text-xl font-semibold text-foreground mb-4 border-b pb-2">Informasi & Bantuan</h2>
            <ul className="space-y-3">
              <li><Link href="/help" className="hover:text-primary hover:underline">Pusat Bantuan (FAQ)</Link></li>
              <li><Link href="/terms" className="hover:text-primary hover:underline">Syarat & Ketentuan</Link></li>
              <li><Link href="/privacy" className="hover:text-primary hover:underline">Kebijakan Privasi</Link></li>
            </ul>
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
