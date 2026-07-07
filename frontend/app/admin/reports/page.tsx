'use client';

import React, { useState, useMemo } from 'react';
import { useAppContext } from '@/context/AppContext';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Button } from '@/components/ui/button';
import { Download, FileText, TrendingUp, TrendingDown, DollarSign } from 'lucide-react';
import { Badge } from '@/components/ui/badge';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip as RechartsTooltip, Legend, ResponsiveContainer } from 'recharts';

import jsPDF from 'jspdf';
import autoTable from 'jspdf-autotable';
import * as XLSX from 'xlsx';

export default function AdminReports() {
  const { payments, expenses } = useAppContext();
  const [activeTab, setActiveTab] = useState('all');

  // Calculate Metrics
  const totalPendapatan = payments
    .filter(p => p.status === 'Lunas')
    .reduce((acc, curr) => acc + curr.amount, 0);

  const totalPengeluaran = expenses.reduce((acc, curr) => acc + curr.amount, 0);
  const labaBersih = totalPendapatan - totalPengeluaran;

  // Prepare Chart Data
  const chartData = useMemo(() => {
    const monthNames = ['Jan', 'Feb', 'Mar', 'Apr', 'Mei', 'Jun', 'Jul', 'Agu', 'Sep', 'Okt', 'Nov', 'Des'];
    const now = new Date();
    const currentYear = now.getFullYear();
    const data = [];
    
    // Show last 6 months
    for (let i = 5; i >= 0; i--) {
      const d = new Date(currentYear, now.getMonth() - i, 1);
      const key = `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, '0')}`;
      
      const monthIncome = payments
        .filter(p => p.status === 'Lunas' && p.month_for === key)
        .reduce((sum, p) => sum + p.amount, 0);
        
      const monthExpense = expenses
        .filter(e => e.expense_date.startsWith(key))
        .reduce((sum, e) => sum + e.amount, 0);
        
      data.push({
        name: `${monthNames[d.getMonth()]} ${d.getFullYear().toString().slice(-2)}`,
        Pendapatan: monthIncome,
        Pengeluaran: monthExpense,
      });
    }
    return data;
  }, [payments, expenses]);

  // Prepare All Data
  const allTransactions = useMemo(() => {
    const incomes = payments.map((p: any) => ({
      id: p.id,
      date: p.payment_date || p.created_at, // fallback if payment_date is null
      type: 'Pemasukan',
      description: `Sewa Kamar ${p.tenant?.room?.room_number || '-'} - ${p.tenant?.user?.fullname || 'Unknown'}`,
      amount: p.amount,
      status: p.status
    }));

    const expensesList = expenses.map((e: any) => ({
      id: e.id,
      date: e.expense_date,
      type: 'Pengeluaran',
      description: `${e.category}: ${e.description}`,
      amount: e.amount,
      status: 'Lunas'
    }));

    return [...incomes, ...expensesList].sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());
  }, [payments, expenses]);

  // Helper functions for export
  const getExportData = () => {
    if (activeTab === 'all') {
      return allTransactions.map((trx: any) => ({
        'ID Transaksi': trx.type === 'Pemasukan' ? `${trx.id.toUpperCase()}-TRX` : `EXP-${trx.id.slice(0,8).toUpperCase()}`,
        'Tanggal': new Date(trx.date).toLocaleDateString('id-ID'),
        'Tipe': trx.type,
        'Keterangan': trx.description,
        'Nominal': trx.amount,
        'Status': trx.status
      }));
    } else if (activeTab === 'pemasukan') {
      return payments.map((payment: any) => {
        const user = payment.tenant?.user;
        const room = payment.tenant?.room;
        return {
          'ID Transaksi': `${payment.id.toUpperCase()}-TRX`,
          'Tanggal Bayar': payment.payment_date ? new Date(payment.payment_date).toLocaleDateString('id-ID') : '-',
          'Bulan Tagihan': payment.month_for,
          'Kamar': `Kamar ${room?.room_number || '-'}`,
          'Penghuni': user?.fullname || 'Unknown',
          'Metode': payment.payment_date ? 'Transfer Bank' : '-',
          'Nominal': payment.amount,
          'Status': payment.status
        };
      });
    } else {
      return expenses.map((expense: any) => {
        return {
          'ID Pengeluaran': `EXP-${expense.id.slice(0,8).toUpperCase()}`,
          'Tanggal': new Date(expense.expense_date).toLocaleDateString('id-ID'),
          'Kategori': expense.category,
          'Deskripsi': expense.description,
          'Nominal': expense.amount
        };
      });
    }
  };

  const reportTitle = activeTab === 'all' ? 'Laporan Semua Transaksi' : activeTab === 'pemasukan' ? 'Laporan Pemasukan Kost' : 'Laporan Pengeluaran Kost';

  const handleExportPDF = () => {
    const doc = new jsPDF();
    const data = getExportData();
    if (data.length === 0) return;
    
    doc.text(reportTitle, 14, 15);
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

    const finalY = (doc as any).lastAutoTable.finalY || 28;
    doc.setFontSize(10);
    doc.text(`Ringkasan Keuangan:`, 14, finalY + 10);
    doc.text(`Total Pemasukan: Rp ${totalPendapatan.toLocaleString('id-ID')}`, 14, finalY + 16);
    doc.text(`Total Pengeluaran: Rp ${totalPengeluaran.toLocaleString('id-ID')}`, 14, finalY + 22);
    doc.text(`Laba Bersih: Rp ${labaBersih.toLocaleString('id-ID')}`, 14, finalY + 28);

    doc.save(`${reportTitle.replace(/ /g, '_')}.pdf`);
  };

  const handleExportExcel = () => {
    const data = getExportData();
    if (data.length === 0) return;
    const worksheet = XLSX.utils.json_to_sheet(data);
    
    // Add summary rows at the end
    XLSX.utils.sheet_add_aoa(worksheet, [
      [], // empty row
      ['Ringkasan Keuangan:'],
      ['Total Pemasukan', `Rp ${totalPendapatan.toLocaleString('id-ID')}`],
      ['Total Pengeluaran', `Rp ${totalPengeluaran.toLocaleString('id-ID')}`],
      ['Laba Bersih', `Rp ${labaBersih.toLocaleString('id-ID')}`]
    ], { origin: -1 });

    const workbook = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(workbook, worksheet, 'Laporan');
    
    const maxWidths = Object.keys(data[0]).map(() => 15);
    worksheet['!cols'] = maxWidths.map(w => ({ wch: w }));

    XLSX.writeFile(workbook, `${reportTitle.replace(/ /g, '_')}.xlsx`);
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Laporan Keuangan</h1>
          <p className="text-muted-foreground">Analisis dan rekapitulasi keuangan kost.</p>
        </div>
        <div className="flex gap-2">
          <Button variant="outline" onClick={handleExportPDF}>
            <FileText className="mr-2 h-4 w-4" /> PDF
          </Button>
          <Button variant="outline" onClick={handleExportExcel}>
            <Download className="mr-2 h-4 w-4" /> Excel
          </Button>
        </div>
      </div>

      <div className="grid gap-4 md:grid-cols-3">
        <Card className="gap-2">
          <CardHeader className="flex flex-row items-center justify-between space-y-0">
            <CardTitle className="text-sm font-medium">Total Pemasukan</CardTitle>
            <TrendingUp className="h-4 w-4 text-green-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-green-600">Rp {totalPendapatan.toLocaleString('id-ID')}</div>
          </CardContent>
        </Card>
        <Card className="gap-2">
          <CardHeader className="flex flex-row items-center justify-between space-y-0">
            <CardTitle className="text-sm font-medium">Total Pengeluaran</CardTitle>
            <TrendingDown className="h-4 w-4 text-red-500" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-red-500">Rp {totalPengeluaran.toLocaleString('id-ID')}</div>
          </CardContent>
        </Card>
        <Card className="gap-2">
          <CardHeader className="flex flex-row items-center justify-between space-y-0">
            <CardTitle className="text-sm font-medium">Laba Bersih</CardTitle>
            <DollarSign className="h-4 w-4 text-primary" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-primary">Rp {labaBersih.toLocaleString('id-ID')}</div>
          </CardContent>
        </Card>
      </div>

      <Card>
        <CardHeader className="pb-2">
          <CardTitle>Grafik Pemasukan & Pengeluaran (6 Bulan Terakhir)</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="h-[200px] w-full">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={chartData} margin={{ top: 20, right: 30, left: 20, bottom: 5 }}>
                <CartesianGrid strokeDasharray="3 3" vertical={false} />
                <XAxis dataKey="name" tickLine={false} axisLine={false} />
                <YAxis 
                  tickLine={false} 
                  axisLine={false} 
                  tickFormatter={(value) => {
                    if (value >= 1000000) return `Rp ${(value / 1000000)}Jt`;
                    return value;
                  }}
                />
                <RechartsTooltip formatter={(value: any) => `Rp ${Number(value).toLocaleString('id-ID')}`} />
                <Legend />
                <Bar dataKey="Pendapatan" fill="#16a34a" radius={[4, 4, 0, 0]} />
                <Bar dataKey="Pengeluaran" fill="#ef4444" radius={[4, 4, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </CardContent>
      </Card>

      <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
        <TabsList className="grid w-full grid-cols-3 md:w-[500px]">
          <TabsTrigger value="all">Semua Transaksi</TabsTrigger>
          <TabsTrigger value="pemasukan">Data Pemasukan</TabsTrigger>
          <TabsTrigger value="pengeluaran">Data Pengeluaran</TabsTrigger>
        </TabsList>

        <TabsContent value="all" className="mt-4">
          <div className="rounded-md border bg-card overflow-x-auto">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Tanggal</TableHead>
                  <TableHead>Tipe</TableHead>
                  <TableHead>Keterangan</TableHead>
                  <TableHead>Nominal</TableHead>
                  <TableHead>Status</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {allTransactions.map((trx: any) => (
                  <TableRow key={trx.id}>
                    <TableCell>{new Date(trx.date).toLocaleDateString('id-ID')}</TableCell>
                    <TableCell>
                      <Badge variant={trx.type === 'Pemasukan' ? 'default' : 'destructive'}>
                        {trx.type}
                      </Badge>
                    </TableCell>
                    <TableCell>{trx.description}</TableCell>
                    <TableCell className={`font-medium ${trx.type === 'Pemasukan' ? 'text-green-600' : 'text-red-500'}`}>
                      {trx.type === 'Pemasukan' ? '+' : '-'} Rp {trx.amount.toLocaleString('id-ID')}
                    </TableCell>
                    <TableCell>
                      <Badge variant="outline">{trx.status}</Badge>
                    </TableCell>
                  </TableRow>
                ))}
                {allTransactions.length === 0 && (
                  <TableRow>
                    <TableCell colSpan={5} className="text-center h-24 text-muted-foreground">Belum ada transaksi.</TableCell>
                  </TableRow>
                )}
              </TableBody>
            </Table>
          </div>
        </TabsContent>
        
        <TabsContent value="pemasukan" className="mt-4">
          <div className="rounded-md border bg-card overflow-x-auto">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>ID Transaksi</TableHead>
                  <TableHead>Tanggal Bayar</TableHead>
                  <TableHead>Bulan Tagihan</TableHead>
                  <TableHead>Kamar</TableHead>
                  <TableHead>Penghuni</TableHead>
                  <TableHead>Metode</TableHead>
                  <TableHead>Nominal</TableHead>
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
                {payments.length === 0 && (
                  <TableRow>
                    <TableCell colSpan={8} className="text-center h-24 text-muted-foreground">Belum ada data pemasukan.</TableCell>
                  </TableRow>
                )}
              </TableBody>
            </Table>
          </div>
        </TabsContent>
        
        <TabsContent value="pengeluaran" className="mt-4">
          <div className="rounded-md border bg-card overflow-x-auto">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Tanggal</TableHead>
                  <TableHead>Kategori</TableHead>
                  <TableHead>Deskripsi</TableHead>
                  <TableHead>Nominal</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {expenses.map((expense: any) => (
                  <TableRow key={expense.id}>
                    <TableCell>{new Date(expense.expense_date).toLocaleDateString('id-ID')}</TableCell>
                    <TableCell>
                      <Badge variant="outline">{expense.category}</Badge>
                    </TableCell>
                    <TableCell>{expense.description}</TableCell>
                    <TableCell className="font-medium text-red-500">Rp {expense.amount.toLocaleString('id-ID')}</TableCell>
                  </TableRow>
                ))}
                {expenses.length === 0 && (
                  <TableRow>
                    <TableCell colSpan={4} className="text-center h-24 text-muted-foreground">Belum ada data pengeluaran.</TableCell>
                  </TableRow>
                )}
              </TableBody>
            </Table>
          </div>
        </TabsContent>
      </Tabs>
    </div>
  );
}
