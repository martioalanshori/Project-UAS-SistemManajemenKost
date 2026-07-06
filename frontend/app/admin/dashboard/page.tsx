'use client';

import React from 'react';
import { useAppContext } from '@/context/AppContext';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Users, Home, FileText, CreditCard } from 'lucide-react';
import { Area, AreaChart, ResponsiveContainer, XAxis, YAxis, Tooltip } from 'recharts';

export default function AdminDashboard() {
  const { rooms, applications, tenants, payments, expenses } = useAppContext();

  const totalKamar = rooms.length;
  const kamarKosong = rooms.filter(r => r.status === 'Kosong').length;
  const kamarTerisi = rooms.filter(r => r.status === 'Terisi').length;
  const pendingBooking = applications.filter(a => a.status === 'Pending').length;
  const pendingPayment = payments.filter(p => p.status === 'Menunggu Verifikasi').length;
  const activeTenantCount = tenants.filter(t => !t.status || t.status === 'Active').length;

  const totalPendapatan = payments
    .filter(p => p.status === 'Lunas')
    .reduce((acc, curr) => acc + curr.amount, 0);

  const totalPengeluaran = expenses.reduce((acc, curr) => acc + curr.amount, 0);
  const labaBersih = totalPendapatan - totalPengeluaran;

  const chartData = React.useMemo(() => {
    const monthNames = ['Jan', 'Feb', 'Mar', 'Apr', 'Mei', 'Jun', 'Jul', 'Agu', 'Sep', 'Okt', 'Nov', 'Des'];
    const now = new Date();
    const last6Months = [];
    for (let i = 5; i >= 0; i--) {
      const d = new Date(now.getFullYear(), now.getMonth() - i, 1);
      const key = `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, '0')}`;
      const monthPayments = payments.filter(p => p.status === 'Lunas' && p.month_for === key);
      const totalRev = monthPayments.reduce((sum, p) => sum + p.amount, 0);
      const monthExpenses = expenses.filter(e => e.expense_date === key);
      const totalExp = monthExpenses.reduce((sum, e) => sum + e.amount, 0);
      last6Months.push({ 
        name: monthNames[d.getMonth()], 
        pendapatan: totalRev, 
        pengeluaran: totalExp, 
        laba_bersih: totalRev - totalExp 
      });
    }
    return last6Months;
  }, [payments, expenses]);

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold tracking-tight">Dashboard Admin</h1>
        <p className="text-muted-foreground">Selamat datang kembali, berikut ringkasan kost Anda.</p>
      </div>

      <div className="grid gap-4 md:grid-cols-3">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Pendapatan</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-green-600">Rp {totalPendapatan.toLocaleString('id-ID')}</div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Pengeluaran</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-red-500">Rp {totalPengeluaran.toLocaleString('id-ID')}</div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Laba Bersih</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-primary">Rp {labaBersih.toLocaleString('id-ID')}</div>
          </CardContent>
        </Card>
      </div>
      
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Kamar</CardTitle>
            <Home className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{totalKamar}</div>
            <p className="text-xs text-muted-foreground">
              {kamarKosong} kosong, {kamarTerisi} terisi
            </p>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Pengajuan Baru</CardTitle>
            <FileText className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{pendingBooking}</div>
            <p className="text-xs text-muted-foreground">
              Menunggu persetujuan
            </p>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Penghuni</CardTitle>
            <Users className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{activeTenantCount}</div>
            <p className="text-xs text-muted-foreground">
              Penghuni aktif
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Verifikasi Pembayaran</CardTitle>
            <CreditCard className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{pendingPayment}</div>
            <p className="text-xs text-muted-foreground">
              Menunggu verifikasi admin
            </p>
          </CardContent>
        </Card>
      </div>

      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-7">
        <Card className="col-span-4">
          <CardHeader>
            <CardTitle>Ringkasan Pendapatan</CardTitle>
          </CardHeader>
          <CardContent className="pl-2 pt-4">
            <div className="h-[250px] w-full">
              <ResponsiveContainer width="100%" height="100%">
                <AreaChart data={chartData}>
                  <defs>
                    <linearGradient id="colorPendapatan" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%" stopColor="#16a34a" stopOpacity={0.8}/>
                      <stop offset="95%" stopColor="#16a34a" stopOpacity={0}/>
                    </linearGradient>
                    <linearGradient id="colorPengeluaran" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%" stopColor="#ef4444" stopOpacity={0.8}/>
                      <stop offset="95%" stopColor="#ef4444" stopOpacity={0}/>
                    </linearGradient>
                    <linearGradient id="colorLaba" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%" stopColor="var(--primary)" stopOpacity={0.8}/>
                      <stop offset="95%" stopColor="var(--primary)" stopOpacity={0}/>
                    </linearGradient>
                  </defs>
                  <XAxis 
                    dataKey="name" 
                    stroke="#888888" 
                    fontSize={12} 
                    tickLine={false} 
                    axisLine={false} 
                  />
                  <YAxis 
                    stroke="#888888" 
                    fontSize={12} 
                    tickLine={false} 
                    axisLine={false} 
                    tickFormatter={(value) => {
                      if (value >= 1000000) return `Rp${(value / 1000000).toLocaleString('id-ID')} Jt`;
                      if (value >= 1000) return `Rp${(value / 1000).toLocaleString('id-ID')} Rb`;
                      return `Rp${value.toLocaleString('id-ID')}`;
                    }}
                  />
                  <Tooltip 
                    formatter={(value: number, name: string) => [`Rp ${value.toLocaleString('id-ID')}`, name]}
                  />
                  <Area type="monotone" dataKey="pendapatan" name="Pendapatan" stroke="#16a34a" fillOpacity={1} fill="url(#colorPendapatan)" />
                  <Area type="monotone" dataKey="pengeluaran" name="Pengeluaran" stroke="#ef4444" fillOpacity={1} fill="url(#colorPengeluaran)" />
                  <Area type="monotone" dataKey="laba_bersih" name="Laba Bersih" stroke="var(--primary)" fillOpacity={1} fill="url(#colorLaba)" />
                </AreaChart>
              </ResponsiveContainer>
            </div>
          </CardContent>
        </Card>
        <Card className="col-span-3">
          <CardHeader>
            <CardTitle>Aktivitas Terbaru</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-8">
              {applications.slice(0,3).map(app => (
                <div key={app.id} className="flex items-center">
                  <span className="relative flex h-2 w-2 shrink-0 overflow-hidden rounded-full bg-blue-500 mr-4" />
                  <div className="space-y-1">
                    <p className="text-sm font-medium leading-none">Pengajuan Kamar {rooms.find(r=>r.id===app.room_id)?.room_number} oleh {app.user?.fullname || 'Unknown'}</p>
                    <p className="text-sm text-muted-foreground">Status: {app.status}</p>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
