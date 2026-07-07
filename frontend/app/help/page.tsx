'use client';

import React from 'react';
import Link from 'next/link';
import { MapPin } from 'lucide-react';

export default function HelpPage() {
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
        <h1 className="text-4xl font-bold mb-8">Pusat Bantuan</h1>
        
        <div className="space-y-8 text-muted-foreground leading-relaxed">
          <section>
            <h2 className="text-2xl font-semibold text-foreground mb-4">FAQ (Pertanyaan yang Sering Diajukan)</h2>
            <div className="space-y-4">
              <div className="border rounded-lg p-4 bg-muted/20">
                <h3 className="font-semibold text-foreground mb-2">Bagaimana cara memesan kamar?</h3>
                <p className="text-sm">Anda dapat melakukan pencarian kamar di halaman utama. Jika menemukan kamar yang sesuai, klik "Detail" lalu pilih tombol "Ajukan Sewa". Admin akan meninjau pengajuan Anda dalam waktu 1x24 jam.</p>
              </div>
              
              <div className="border rounded-lg p-4 bg-muted/20">
                <h3 className="font-semibold text-foreground mb-2">Berapa lama batas waktu pembayaran?</h3>
                <p className="text-sm">Setelah pengajuan disetujui, Anda diberikan waktu maksimal 24 jam untuk melakukan pembayaran uang muka atau lunas. Jika melewati batas waktu, pengajuan akan otomatis dibatalkan.</p>
              </div>
              
              <div className="border rounded-lg p-4 bg-muted/20">
                <h3 className="font-semibold text-foreground mb-2">Apakah uang sewa bisa dikembalikan jika batal?</h3>
                <p className="text-sm">Pengembalian uang sewa hanya dapat dilakukan sesuai dengan kesepakatan awal dan syarat ketentuan yang berlaku. Harap hubungi admin secara langsung.</p>
              </div>
            </div>
          </section>

          <section>
            <h2 className="text-2xl font-semibold text-foreground mb-4">Hubungi Kami</h2>
            <p className="mb-4">Jika Anda memiliki pertanyaan lebih lanjut, silakan hubungi tim dukungan kami melalui kontak di bawah ini:</p>
            <ul className="list-disc pl-6 space-y-2">
              <li><strong>WhatsApp:</strong> +62 812-3456-7890</li>
              <li><strong>Email:</strong> support@sistemkost.com</li>
              <li><strong>Alamat:</strong> Jl. Kost Raya No. 123, Jakarta Selatan</li>
            </ul>
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
