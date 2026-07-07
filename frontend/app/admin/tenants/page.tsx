'use client';

import React, { useState } from 'react';
import { useAppContext } from '@/context/AppContext';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { LogOut } from 'lucide-react';
import Swal from 'sweetalert2';

export default function AdminTenants() {
  const { tenants, checkoutTenant } = useAppContext();
  
  const [searchTerm, setSearchTerm] = useState('');

  const handleCheckout = (id: string, name: string) => {
    Swal.fire({
      title: 'Apakah Anda Yakin?',
      text: `Ingin mengeluarkan penghuni ${name}?`,
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#d33',
      cancelButtonColor: '#3085d6',
      confirmButtonText: 'Ya, Checkout',
      cancelButtonText: 'Batal'
    }).then(async (result) => {
      if (result.isConfirmed) {
        try {
          await checkoutTenant(id);
          Swal.fire(
            'Berhasil!',
            `Penghuni ${name} berhasil di-checkout.`,
            'success'
          );
        } catch (error: any) {
          const msg = error.response?.data?.error || 'Gagal checkout penghuni.';
          Swal.fire('Gagal', msg, 'error');
        }
      }
    });
  };

  const filteredTenants = tenants.filter((tenant: any) => {
    const user = tenant.user;
    const room = tenant.room;
    const userName = user?.fullname || '';
    const roomNumber = room?.room_number || '';
    return userName.toLowerCase().includes(searchTerm.toLowerCase()) || 
           roomNumber.toLowerCase().includes(searchTerm.toLowerCase());
  });

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Manajemen Penghuni</h1>
          <p className="text-muted-foreground">Daftar penghuni aktif di kost Anda.</p>
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
              <TableHead>Nama Penghuni</TableHead>
              <TableHead>Kamar</TableHead>
              <TableHead>Tanggal Masuk</TableHead>
              <TableHead>Durasi Sewa</TableHead>
              <TableHead>Tanggal Selesai</TableHead>
              <TableHead>Kontak</TableHead>
              <TableHead className="text-right">Aksi</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {filteredTenants.map((tenant: any, idx: number) => {
              const user = tenant.user;
              const room = tenant.room;
              const application = tenant.application;
              
              const duration = application?.duration || 1;
              const checkInDate = new Date(tenant.check_in);
              const checkOutDate = new Date(checkInDate);
              checkOutDate.setMonth(checkOutDate.getMonth() + duration);
              
              return (
                <TableRow key={tenant.id}>
                  <TableCell className="font-medium">{idx + 1}</TableCell>
                  <TableCell className="font-medium">{user?.fullname || 'Unknown'}</TableCell>
                  <TableCell>Kamar {room?.room_number}</TableCell>
                  <TableCell>{checkInDate.toLocaleDateString('id-ID')}</TableCell>
                  <TableCell>{duration} Bulan</TableCell>
                  <TableCell>{checkOutDate.toLocaleDateString('id-ID')}</TableCell>
                  <TableCell>{user?.phone}</TableCell>
                  <TableCell className="text-right">
                    <Button 
                      variant="outline" 
                      size="sm" 
                      className="text-destructive hover:bg-destructive/10"
                      onClick={() => handleCheckout(tenant.id, user?.fullname || 'Unknown')}
                    >
                      <LogOut className="h-4 w-4 mr-2" /> Checkout
                    </Button>
                  </TableCell>
                </TableRow>
              );
            })}
            {tenants.length === 0 && (
              <TableRow>
                  <TableCell colSpan={8} className="text-center h-24 text-muted-foreground">
                  Tidak ada penghuni aktif.
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </div>
    </div>
  );
}
