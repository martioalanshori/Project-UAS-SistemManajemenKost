'use client';

import React, { useState } from 'react';
import { useAppContext } from '@/context/AppContext';
import { Button } from '@/components/ui/button';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Badge } from '@/components/ui/badge';
import { Upload, Plus } from 'lucide-react';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import Swal from 'sweetalert2';

export default function TenantPayments() {
  const { payments, tenants, currentUser, addPayment, updatePayment, rooms } = useAppContext();

  const myTenantRecord = tenants.find(t => t.user_id === currentUser?.id);
  const myPayments = myTenantRecord ? payments.filter(p => p.tenant_id === myTenantRecord.id) : [];
  const myRoom = myTenantRecord ? rooms.find(r => r.id === myTenantRecord.room_id) : null;

  const [isOpen, setIsOpen] = useState(false);
  const [formData, setFormData] = useState({ month_for: '', amount: myRoom ? myRoom.price.toString() : '', proof_image: '' });
  
  const [uploadPaymentId, setUploadPaymentId] = useState<string | null>(null);

  const handleSubmitNewPayment = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!myTenantRecord) return;

    if (!formData.proof_image) {
      Swal.fire('Gagal', 'Anda harus mengupload bukti pembayaran', 'error');
      return;
    }

    try {
      await addPayment({
        tenant_id: myTenantRecord.id,
        amount: parseInt(formData.amount),
        month_for: formData.month_for,
        proof_image: formData.proof_image,
        payment_date: new Date().toISOString()
      });

      Swal.fire('Terkirim!', 'Pembayaran berhasil dikirim dan menunggu verifikasi Admin.', 'success');
      setIsOpen(false);
    } catch (error: any) {
      const msg = error.response?.data?.error || 'Gagal mengirim pembayaran.';
      Swal.fire('Gagal', msg, 'error');
    }
  };

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>, isNew: boolean = true, paymentId?: string) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = async () => {
        if (isNew) {
          setFormData({...formData, proof_image: reader.result as string});
        } else if (paymentId) {
          // Upload for existing unpaid invoice
          try {
            await updatePayment(paymentId, { 
              proof_image: reader.result as string, 
              status: 'Menunggu Verifikasi',
              payment_date: new Date().toISOString() 
            });
            Swal.fire('Berhasil!', 'Bukti pembayaran berhasil diupload.', 'success');
          } catch (error) {
            Swal.fire('Gagal', 'Gagal mengupload bukti pembayaran', 'error');
          }
        }
      };
      reader.readAsDataURL(file);
    }
  };

  const handleViewProof = (payment: any) => {
    if (payment.proof_image && payment.proof_image !== '/room-placeholder.svg') {
      Swal.fire({
        title: 'Bukti Pembayaran',
        imageUrl: payment.proof_image,
        imageAlt: 'Bukti',
        confirmButtonText: 'Tutup'
      });
    } else {
      Swal.fire('Info', 'Tidak ada foto bukti pembayaran.', 'info');
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Riwayat Pembayaran</h1>
          <p className="text-muted-foreground">Kelola dan upload bukti pembayaran sewa Anda.</p>
        </div>
        
        {myTenantRecord && (
          <>
            <Button onClick={() => setIsOpen(true)}>
              <Plus className="mr-2 h-4 w-4" /> Bayar Tagihan Baru
            </Button>
            <Dialog open={isOpen} onOpenChange={setIsOpen}>
              <DialogContent>
              <DialogHeader>
                <DialogTitle>Kirim Pembayaran Baru</DialogTitle>
              </DialogHeader>
              <form onSubmit={handleSubmitNewPayment} className="space-y-4 pt-4">
                <div className="space-y-2">
                  <Label>Untuk Bulan (Contoh: 2024-08)</Label>
                  <Input 
                    required
                    type="month"
                    value={formData.month_for}
                    onChange={(e) => setFormData({...formData, month_for: e.target.value})}
                  />
                </div>
                <div className="space-y-2">
                  <Label>Jumlah Nominal (Rp)</Label>
                  <Input 
                    required
                    type="number"
                    value={formData.amount}
                    onChange={(e) => setFormData({...formData, amount: e.target.value})}
                  />
                </div>
                <div className="space-y-2">
                  <Label>Upload Bukti Transfer</Label>
                  <Input type="file" required accept="image/*" onChange={(e) => handleFileUpload(e, true)} />
                  {formData.proof_image && (
                    <div className="mt-2 w-32 h-40 relative overflow-hidden rounded-md border">
                      <img src={formData.proof_image} alt="Preview" className="object-cover w-full h-full" />
                    </div>
                  )}
                </div>
                <Button type="submit" className="w-full">
                  Kirim Pembayaran
                </Button>
              </form>
            </DialogContent>
          </Dialog>
          </>
        )}
      </div>

      <div className="rounded-md border bg-card overflow-x-auto">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead className="w-[50px]">No.</TableHead>
              <TableHead>Bulan</TableHead>
              <TableHead>Jumlah Tagihan</TableHead>
              <TableHead>Tanggal Bayar</TableHead>
              <TableHead>Status</TableHead>
              <TableHead className="text-right">Aksi</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {myPayments.map((payment, idx) => (
              <TableRow key={payment.id}>
                <TableCell className="font-medium">{idx + 1}</TableCell>
                <TableCell className="font-medium">{payment.month_for}</TableCell>
                <TableCell>Rp {payment.amount.toLocaleString('id-ID')}</TableCell>
                <TableCell>{payment.payment_date ? new Date(payment.payment_date).toLocaleDateString('id-ID') : '-'}</TableCell>
                <TableCell>
                  <Badge variant={
                    payment.status === 'Lunas' ? 'default' : 
                    payment.status === 'Menunggu Verifikasi' ? 'secondary' : 
                    payment.status === 'Ditolak' ? 'destructive' :
                    'outline'
                  }>
                    {payment.status}
                  </Badge>
                </TableCell>
                <TableCell className="text-right">
                  {payment.status === 'Belum Bayar' && (
                    <div className="relative inline-block overflow-hidden">
                      <Button size="sm">
                        <Upload className="mr-2 h-4 w-4" /> Upload Bukti
                      </Button>
                      <input 
                        type="file" 
                        accept="image/*"
                        className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
                        onChange={(e) => handleFileUpload(e, false, payment.id)}
                      />
                    </div>
                  )}
                  {payment.status !== 'Belum Bayar' && (
                    <Button variant="outline" size="sm" onClick={() => handleViewProof(payment)}>
                      Lihat Bukti
                    </Button>
                  )}
                </TableCell>
              </TableRow>
            ))}
            {myPayments.length === 0 && (
              <TableRow>
                <TableCell colSpan={5} className="text-center py-6 text-muted-foreground">
                  Belum ada riwayat tagihan.
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </div>
    </div>
  );
}
