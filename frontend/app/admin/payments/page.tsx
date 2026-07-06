'use client';

import React, { useState } from 'react';
import { useAppContext } from '@/context/AppContext';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Badge } from '@/components/ui/badge';
import { CheckCircle, Eye, XCircle } from 'lucide-react';
import Swal from 'sweetalert2';

export default function AdminPayments() {
  const { payments, verifyPayment, rejectPayment } = useAppContext();

  const handleVerify = (id: string) => {
    Swal.fire({
      title: 'Verifikasi Pembayaran?',
      text: "Anda akan menyetujui pembayaran ini.",
      icon: 'question',
      showCancelButton: true,
      confirmButtonText: 'Ya, Verifikasi'
    }).then(async (result) => {
      if (result.isConfirmed) {
        try {
          await verifyPayment(id);
          Swal.fire('Terverifikasi!', 'Pembayaran berhasil diverifikasi.', 'success');
        } catch (error: any) {
          const msg = error.response?.data?.error || 'Gagal verifikasi pembayaran.';
          Swal.fire('Gagal', msg, 'error');
        }
      }
    });
  };

  const handleReject = (id: string) => {
    Swal.fire({
      title: 'Tolak Pembayaran?',
      text: "Pembayaran akan ditandai sebagai ditolak.",
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#d33',
      confirmButtonText: 'Ya, Tolak'
    }).then(async (result) => {
      if (result.isConfirmed) {
        try {
          await rejectPayment(id);
          Swal.fire('Ditolak!', 'Pembayaran berhasil ditolak.', 'success');
        } catch (error: any) {
          const msg = error.response?.data?.error || 'Gagal menolak pembayaran.';
          Swal.fire('Gagal', msg, 'error');
        }
      }
    });
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
      Swal.fire('Info', 'Tidak ada foto bukti pembayaran atau masih default.', 'info');
    }
  };

  const [searchTerm, setSearchTerm] = useState('');

  const filteredPayments = payments.filter((payment: any) => {
    const user = payment.tenant?.user;
    const room = payment.tenant?.room;
    
    const userName = user?.fullname || '';
    const roomNumber = room?.room_number || '';
    return userName.toLowerCase().includes(searchTerm.toLowerCase()) || 
           roomNumber.toLowerCase().includes(searchTerm.toLowerCase());
  });

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Manajemen Pembayaran</h1>
          <p className="text-muted-foreground">Verifikasi pembayaran dari penghuni.</p>
        </div>
        
        <div className="flex items-center">
          <Input 
            type="search" 
            placeholder="Cari nama atau kamar..." 
            className="w-[200px] sm:w-[250px]"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>
      </div>

      <div className="rounded-md border bg-card overflow-x-auto">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead className="w-[50px]">No.</TableHead>
              <TableHead>Penghuni</TableHead>
              <TableHead>Kamar</TableHead>
              <TableHead>Bulan</TableHead>
              <TableHead>Jumlah</TableHead>
              <TableHead>Tanggal Bayar</TableHead>
              <TableHead>Status</TableHead>
              <TableHead className="text-right">Aksi</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {filteredPayments.map((payment: any, idx: number) => {
              const user = payment.tenant?.user;
              const room = payment.tenant?.room;
              
              return (
                <TableRow key={payment.id}>
                  <TableCell>{idx + 1}</TableCell>
                  <TableCell className="font-medium">{user?.fullname || 'Unknown'}</TableCell>
                  <TableCell>Kamar {room?.room_number}</TableCell>
                  <TableCell>{payment.month_for}</TableCell>
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
                  <TableCell className="text-right space-x-2">
                    <Button variant="ghost" size="icon" title="Lihat Bukti" onClick={() => handleViewProof(payment)}>
                      <Eye className="h-4 w-4" />
                    </Button>
                    {payment.status === 'Menunggu Verifikasi' && (
                      <>
                        <Button 
                          variant="ghost" 
                          size="icon" 
                          className="text-green-600 hover:text-green-700 hover:bg-green-50" 
                          title="Setujui"
                          onClick={() => handleVerify(payment.id)}
                        >
                          <CheckCircle className="h-4 w-4" />
                        </Button>
                        <Button 
                          variant="ghost" 
                          size="icon" 
                          className="text-red-600 hover:text-red-700 hover:bg-red-50" 
                          title="Tolak"
                          onClick={() => handleReject(payment.id)}
                        >
                          <XCircle className="h-4 w-4" />
                        </Button>
                      </>
                    )}
                  </TableCell>
                </TableRow>
              );
            })}
            {payments.length === 0 && (
              <TableRow>
                <TableCell colSpan={7} className="text-center py-6 text-muted-foreground">
                  Tidak ada data pembayaran.
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </div>
    </div>
  );
}
