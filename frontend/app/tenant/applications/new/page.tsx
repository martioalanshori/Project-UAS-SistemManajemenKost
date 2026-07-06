'use client';

import React, { useState, Suspense } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import { useAppContext } from '@/context/AppContext';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Upload, CheckCircle2 } from 'lucide-react';
import Swal from 'sweetalert2';

function NewApplicationForm() {
  const searchParams = useSearchParams();
  const roomId = searchParams.get('roomId');
  const router = useRouter();
  const { rooms, currentUser, addApplication } = useAppContext();
  
  const [duration, setDuration] = useState('1');
  const [startDate, setStartDate] = useState('');
  const [ktpImage, setKtpImage] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  const room = rooms.find(r => r.id === roomId);

  if (!room) {
    return (
      <div className="text-center py-12">
        <h2 className="text-xl font-bold mb-4">Kamar tidak ditemukan atau tidak dipilih.</h2>
        <Button onClick={() => router.push('/rooms')}>Pilih Kamar</Button>
      </div>
    );
  }

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      if (file.size > 2 * 1024 * 1024) {
        Swal.fire('File Terlalu Besar', 'Maksimal ukuran file KTP adalah 2MB.', 'error');
        return;
      }
      const reader = new FileReader();
      reader.onloadend = () => {
        setKtpImage(reader.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!currentUser) return;
    
    if (!ktpImage) {
      Swal.fire('Peringatan', 'Harap upload foto KTP Anda terlebih dahulu.', 'warning');
      return;
    }

    setIsSubmitting(true);
    
    try {
      await addApplication({
        user_id: currentUser.id,
        room_id: room.id,
        start_date: startDate,
        duration: parseInt(duration),
        ktp_image: ktpImage
      });
      Swal.fire('Berhasil!', 'Pengajuan sewa berhasil dikirim!', 'success');
      router.push('/tenant/applications');
    } catch (error: any) {
      console.error(error);
      const errorMsg = error.response?.data?.error || 'Terjadi kesalahan saat mengirim pengajuan';
      Swal.fire('Gagal', errorMsg, 'error');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="max-w-2xl mx-auto space-y-6">
      <div>
        <h1 className="text-3xl font-bold tracking-tight">Pengajuan Sewa</h1>
        <p className="text-muted-foreground">Lengkapi form di bawah ini untuk menyewa Kamar {room.room_number}.</p>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Detail Pemesan</CardTitle>
          <CardDescription>Informasi Anda akan digunakan untuk keperluan kontrak.</CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-6">
            <div className="grid gap-4">
              <div className="space-y-2">
                <Label>Nama Lengkap</Label>
                <Input value={currentUser?.fullname || ''} disabled />
              </div>
              <div className="space-y-2">
                <Label>Email</Label>
                <Input value={currentUser?.email || ''} disabled />
              </div>
            </div>

            <div className="space-y-2 border-t pt-4">
              <h3 className="font-semibold text-lg mb-2">Detail Sewa {room.room_number}</h3>
              <div className="grid sm:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="startDate">Tanggal Mulai Sewa</Label>
                  <Input 
                    id="startDate" 
                    type="date" 
                    required 
                    value={startDate}
                    onChange={(e) => setStartDate(e.target.value)}
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="duration">Durasi Sewa (Bulan)</Label>
                  <Input 
                    id="duration" 
                    type="number" 
                    min="1" 
                    max="12" 
                    required 
                    value={duration}
                    onChange={(e) => setDuration(e.target.value)}
                  />
                </div>
              </div>
            </div>

            <div className="space-y-3 border-t pt-6 mt-4">
              <Label>Upload KTP (Identitas)</Label>
              <div className="flex items-center gap-4">
                <div className="relative inline-block">
                  <Button type="button" variant="outline" className="cursor-pointer">
                    <Upload className="mr-2 h-4 w-4" /> 
                    {ktpImage ? 'Ganti File KTP' : 'Pilih File KTP'}
                  </Button>
                  <input 
                    type="file" 
                    accept="image/*" 
                    required={!ktpImage}
                    className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
                    onChange={handleFileUpload}
                  />
                </div>
                {ktpImage && (
                  <div className="flex items-center text-sm text-emerald-600 font-medium">
                    <CheckCircle2 className="h-4 w-4 mr-1" /> File KTP terlampir
                  </div>
                )}
              </div>
              <p className="text-xs text-muted-foreground">Format yang didukung: JPG, PNG, PDF (Max 2MB). Digunakan untuk keperluan verifikasi dan kontrak.</p>
              {ktpImage && (
                <div className="mt-4 w-40 h-24 relative overflow-hidden rounded-md border shadow-sm">
                  <img src={ktpImage} alt="Preview KTP" className="object-cover w-full h-full" />
                </div>
              )}
            </div>

            <div className="bg-muted p-4 rounded-lg flex justify-between items-center mt-6">
              <div>
                <p className="text-sm font-medium">Estimasi Tagihan Pertama</p>
                <p className="text-xs text-muted-foreground">Biaya 1 bulan sewa</p>
              </div>
              <div className="text-xl font-bold text-primary">
                Rp {room.price.toLocaleString('id-ID')}
              </div>
            </div>

            <div className="flex justify-end gap-4 pt-4">
              <Button type="button" variant="outline" onClick={() => router.back()}>Batal</Button>
              <Button type="submit" disabled={isSubmitting}>
                {isSubmitting ? 'Memproses...' : 'Kirim Pengajuan'}
              </Button>
            </div>
          </form>
        </CardContent>
      </Card>
    </div>
  );
}

export default function NewApplicationPage() {
  return (
    <Suspense fallback={<div className="p-8 text-center">Loading...</div>}>
      <NewApplicationForm />
    </Suspense>
  );
}
