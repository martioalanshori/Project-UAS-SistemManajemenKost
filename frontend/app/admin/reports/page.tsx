'use client';

import React from 'react';
import { useAppContext } from '@/context/AppContext';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Button } from '@/components/ui/button';
import { Download, FileText } from 'lucide-react';
import { Badge } from '@/components/ui/badge';

import jsPDF from 'jspdf';
import autoTable from 'jspdf-autotable';
import * as XLSX from 'xlsx';

export default function AdminReports() {
  const { payments } = useAppContext();

  // Helper function to format data for export
  const getExportData = () => {
    return payments.map((payment: any) => {
      const user = payment.tenant?.user;
      const room = payment.tenant?.room;
      
      return {
        'ID Transaksi': `${payment.id.toUpperCase()}-TRX`,
        'Tanggal': payment.payment_date ? new Date(payment.payment_date).toLocaleDateString('id-ID') : '-',
        'Bulan': payment.month_for,
        'Kamar': `Kamar ${room?.room_number || '-'}`,
        'Penghuni': user?.fullname || 'Unknown',
        'Metode': payment.payment_date ? 'Transfer Bank' : '-',
        'Tagihan': payment.amount,
        'Denda': 0,
        'Status': payment.status
      };
    });
  };

  const handleExportPDF = () => {
    const doc = new jsPDF();
    const data = getExportData();
    
    doc.text('Laporan Keuangan Kost', 14, 15);
    doc.setFontSize(10);
    doc.text(`Tanggal Cetak: ${new Date().toLocaleDateString('id-ID')}`, 14, 22);

    const tableColumn = Object.keys(data[0] || {});
    const tableRows = data.map(row => Object.values(row).map(val => 
      typeof val === 'number' ? `Rp ${val.toLocaleString('id-ID')}` : val
    ));

    autoTable(doc, {
      head: [tableColumn],
      body: tableRows,
      startY: 28,
      styles: { fontSize: 8 },
    });

    doc.save('Laporan_Keuangan_Kost.pdf');
  };

  const handleExportExcel = () => {
    const data = getExportData();
    if (data.length === 0) return;
    const worksheet = XLSX.utils.json_to_sheet(data);
    const workbook = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(workbook, worksheet, 'Laporan Keuangan');
    
    // Auto adjust column widths
    const maxWidths = Object.keys(data[0]).map(() => 15); // basic width
    worksheet['!cols'] = maxWidths.map(w => ({ wch: w }));

    XLSX.writeFile(workbook, 'Laporan_Keuangan_Kost.xlsx');
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Laporan Keuangan</h1>
          <p className="text-muted-foreground">Detail transaksi pembayaran penghuni.</p>
        </div>
        <div className="flex gap-2">
          <Button variant="outline" onClick={handleExportPDF}>
            <FileText className="mr-2 h-4 w-4" /> Export PDF
          </Button>
          <Button variant="outline" onClick={handleExportExcel}>
            <Download className="mr-2 h-4 w-4" /> Export Excel
          </Button>
        </div>
      </div>

      <div className="rounded-md border bg-card overflow-x-auto">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>ID Transaksi</TableHead>
              <TableHead>Tanggal</TableHead>
              <TableHead>Bulan</TableHead>
              <TableHead>Kamar</TableHead>
              <TableHead>Penghuni</TableHead>
              <TableHead>Metode</TableHead>
              <TableHead>Tagihan</TableHead>
              <TableHead>Denda</TableHead>
              <TableHead>Status</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {payments.map((payment: any) => {
              const user = payment.tenant?.user;
              const room = payment.tenant?.room;

              return (
                <TableRow key={payment.id}>
                  <TableCell className="font-mono text-xs">{payment.id.toUpperCase()}-TRX</TableCell>
                  <TableCell>{payment.payment_date ? new Date(payment.payment_date).toLocaleDateString('id-ID') : '-'}</TableCell>
                  <TableCell className="font-medium">{payment.month_for}</TableCell>
                  <TableCell>Kamar {room?.room_number}</TableCell>
                  <TableCell>{user?.fullname || 'Unknown'}</TableCell>
                  <TableCell>{payment.payment_date ? 'Transfer Bank' : '-'}</TableCell>
                  <TableCell>Rp {payment.amount.toLocaleString('id-ID')}</TableCell>
                  <TableCell>Rp 0</TableCell>
                  <TableCell>
                    <Badge variant={
                      payment.status === 'Lunas' ? 'default' : 
                      payment.status === 'Menunggu Verifikasi' ? 'secondary' : 
                      'outline'
                    }>
                      {payment.status}
                    </Badge>
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
