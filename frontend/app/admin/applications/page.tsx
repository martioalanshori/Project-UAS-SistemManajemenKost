'use client';

import React from 'react';
import { useAppContext } from '@/context/AppContext';
import { Button } from '@/components/ui/button';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Badge } from '@/components/ui/badge';
import { CheckCircle, XCircle } from 'lucide-react';
import Swal from 'sweetalert2';

export default function AdminApplications() {
  const { applications, approveApplication, rejectApplication } = useAppContext();

  const handleApprove = (id: string) => {
    Swal.fire({
      title: 'Setujui Pengajuan?',
      text: 'Anda akan menyetujui pengajuan sewa ini.',
      icon: 'question',
      showCancelButton: true,
      confirmButtonText: 'Ya, Setujui',
      cancelButtonText: 'Batal'
    }).then(async (result) => {
      if (result.isConfirmed) {
        try {
          await approveApplication(id);
          Swal.fire('Disetujui!', 'Pengajuan berhasil disetujui.', 'success');
        } catch (error: any) {
          const msg = error.response?.data?.error || 'Gagal menyetujui pengajuan.';
          Swal.fire('Gagal', msg, 'error');
        }
      }
    });
  };

  const handleReject = (id: string) => {
    Swal.fire({
      title: 'Tolak Pengajuan?',
      text: 'Pengajuan sewa ini akan ditolak.',
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#d33',
      confirmButtonText: 'Ya, Tolak',
      cancelButtonText: 'Batal'
    }).then(async (result) => {
      if (result.isConfirmed) {
        try {
          await rejectApplication(id);
          Swal.fire('Ditolak!', 'Pengajuan berhasil ditolak.', 'success');
        } catch (error: any) {
          const msg = error.response?.data?.error || 'Gagal menolak pengajuan.';
          Swal.fire('Gagal', msg, 'error');
        }
      }
    });
  };

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold tracking-tight">Manajemen Pengajuan</h1>
        <p className="text-muted-foreground">Kelola persetujuan sewa kamar.</p>
      </div>

      <div className="rounded-md border bg-card">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead className="w-[50px]">No.</TableHead>
              <TableHead>Pemohon</TableHead>
              <TableHead>Kamar</TableHead>
              <TableHead>Tanggal Mulai</TableHead>
              <TableHead>Durasi (Bulan)</TableHead>
              <TableHead>Status</TableHead>
              <TableHead className="text-right">Aksi</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {applications.map((app: any, idx: number) => {
              return (
                <TableRow key={app.id}>
                  <TableCell className="font-medium">{idx + 1}</TableCell>
                  <TableCell>
                    <div className="font-medium">{app.user?.fullname || 'Unknown User'}</div>
                    <div className="text-xs text-muted-foreground">{app.user?.email}</div>
                  </TableCell>
                  <TableCell>Kamar {app.room?.room_number}</TableCell>
                  <TableCell>{new Date(app.start_date).toLocaleDateString('id-ID')}</TableCell>
                  <TableCell>{app.duration}</TableCell>
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
                    {app.status === 'Pending' && (
                      <div className="flex justify-end gap-2">
                        <Button 
                          size="sm" 
                          variant="outline" 
                          className="text-green-600 border-green-600 hover:bg-green-50"
                          onClick={() => handleApprove(app.id)}
                        >
                          <CheckCircle className="mr-1 h-4 w-4" /> Approve
                        </Button>
                        <Button 
                          size="sm" 
                          variant="outline" 
                          className="text-red-600 border-red-600 hover:bg-red-50"
                          onClick={() => handleReject(app.id)}
                        >
                          <XCircle className="mr-1 h-4 w-4" /> Reject
                        </Button>
                      </div>
                    )}
                  </TableCell>
                </TableRow>
              );
            })}
          </TableBody>
        </Table>
      </div>
    </div>
  );
}
