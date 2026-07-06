'use client';

import React from 'react';
import Link from 'next/link';
import { useAppContext } from '@/context/AppContext';
import { buttonVariants } from '@/components/ui/button';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Badge } from '@/components/ui/badge';
import { Plus } from 'lucide-react';
import Swal from 'sweetalert2';

export default function TenantApplications() {
  const { applications, rooms, currentUser } = useAppContext();

  const myApplications = applications.filter(a => a.user_id === currentUser?.id);

  const handleViewDetail = (app: any) => {
    const room = rooms.find(r => r.id === app.room_id);
    Swal.fire({
      title: `Detail Pengajuan`,
      html: `
        <div style="text-align:left;">
          <p><strong>Kamar:</strong> ${room?.room_number || '-'}</p>
          <p><strong>Tanggal Pengajuan:</strong> ${new Date(app.created_at).toLocaleDateString('id-ID')}</p>
          <p><strong>Mulai Sewa:</strong> ${new Date(app.start_date).toLocaleDateString('id-ID')}</p>
          <p><strong>Durasi:</strong> ${app.duration} Bulan</p>
          <p><strong>Status:</strong> ${app.status}</p>
        </div>
      `,
      confirmButtonText: 'Tutup'
    });
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Pengajuan Saya</h1>
          <p className="text-muted-foreground">Status aplikasi sewa kamar Anda.</p>
        </div>
        <Link href="/rooms" className={buttonVariants()}>
          <Plus className="mr-2 h-4 w-4" /> Ajukan Sewa Kamar
        </Link>
      </div>

      <div className="rounded-md border bg-card">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead className="w-[50px]">No.</TableHead>
              <TableHead>Kamar</TableHead>
              <TableHead>Tanggal Pengajuan</TableHead>
              <TableHead>Mulai Sewa</TableHead>
              <TableHead>Durasi</TableHead>
              <TableHead>Status</TableHead>
              <TableHead className="text-right">Aksi</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {myApplications.map((app, idx) => {
              const room = rooms.find(r => r.id === app.room_id);
              
              return (
                <TableRow key={app.id}>
                  <TableCell className="font-medium">{idx + 1}</TableCell>
                  <TableCell className="font-medium">Kamar {room?.room_number}</TableCell>
                  <TableCell>{new Date(app.created_at).toLocaleDateString('id-ID')}</TableCell>
                  <TableCell>{new Date(app.start_date).toLocaleDateString('id-ID')}</TableCell>
                  <TableCell>{app.duration} Bulan</TableCell>
                  <TableCell>
                    <Badge variant={
                      app.status === 'Approved' ? 'default' : 
                      app.status === 'Rejected' ? 'destructive' : 
                      'outline'
                    }>
                      {app.status}
                    </Badge>
                  </TableCell>
                  <TableCell className="text-right">
                    <button 
                      className="inline-flex items-center justify-center whitespace-nowrap rounded-md text-sm font-medium ring-offset-background transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 hover:bg-accent hover:text-accent-foreground h-10 w-10"
                      title="Lihat Detail"
                      onClick={() => handleViewDetail(app)}
                    >
                      <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M14.5 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V7.5L14.5 2z"/><polyline points="14 2 14 8 20 8"/></svg>
                    </button>
                  </TableCell>
                </TableRow>
              );
            })}
            {myApplications.length === 0 && (
              <TableRow>
                <TableCell colSpan={6} className="text-center py-6 text-muted-foreground">
                  Anda belum memiliki riwayat pengajuan sewa.
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </div>
    </div>
  );
}
