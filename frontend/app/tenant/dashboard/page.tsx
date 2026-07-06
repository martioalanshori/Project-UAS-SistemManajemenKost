'use client';

import React from 'react';
import { useAppContext } from '@/context/AppContext';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Home, Bell, CheckCircle } from 'lucide-react';
import { Badge } from '@/components/ui/badge';
import Link from 'next/link';
import { buttonVariants } from '@/components/ui/button';

export default function TenantDashboard() {
  const { currentUser, tenants, rooms, notifications } = useAppContext();

  const myTenantRecord = tenants.find(t => t.user_id === currentUser?.id && (!t.status || t.status === 'Active'));
  const myRoom = myTenantRecord ? rooms.find(r => r.id === myTenantRecord.room_id) : null;
  const myNotifications = notifications.filter(n => n.user_id === currentUser?.id);

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold tracking-tight">Dashboard Penyewa</h1>
        <p className="text-muted-foreground">Selamat datang, {currentUser?.fullname}!</p>
      </div>

      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
        <Card className="col-span-1 lg:col-span-2">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Home className="h-5 w-5" /> Kamar Anda Saat Ini
            </CardTitle>
          </CardHeader>
          <CardContent>
            {myRoom ? (
              <div className="flex flex-col md:flex-row gap-6">
                <div className="w-full md:w-1/3 aspect-video md:aspect-square bg-muted rounded-md overflow-hidden relative">
                  <img src={myRoom.image} alt={`Kamar ${myRoom.room_number}`} className="object-cover w-full h-full" />
                </div>
                <div className="flex-1 space-y-4">
                  <div>
                    <h3 className="text-2xl font-bold">Kamar {myRoom.room_number}</h3>
                    <p className="text-muted-foreground">Mulai sewa: {myTenantRecord ? new Date(myTenantRecord.check_in).toLocaleDateString('id-ID') : '-'}</p>
                  </div>
                  <div>
                    <h4 className="font-semibold mb-2">Fasilitas:</h4>
                    <div className="flex flex-wrap gap-2">
                      {myRoom.facilities.map(f => (
                        <Badge key={f.id} variant="outline">{f.name}</Badge>
                      ))}
                    </div>
                  </div>
                  <div className="pt-4 mt-auto">
                    <Badge variant="default" className="bg-green-600 hover:bg-green-700">
                      <CheckCircle className="mr-1 h-3 w-3" /> Status Aktif
                    </Badge>
                  </div>
                </div>
              </div>
            ) : (
              <div className="text-center py-12 space-y-4">
                <p className="text-muted-foreground">Anda belum memiliki kamar aktif.</p>
                <Link href="/rooms" className={buttonVariants()}>
                  Cari Kamar
                </Link>
              </div>
            )}
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Bell className="h-5 w-5" /> Notifikasi Terbaru
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {myNotifications.length > 0 ? (
                myNotifications.map(notification => (
                  <div key={notification.id} className="flex gap-4 items-start pb-4 border-b last:border-0 last:pb-0">
                    <div className={`mt-1 h-2 w-2 rounded-full shrink-0 ${notification.is_read ? 'bg-muted' : 'bg-primary'}`} />
                    <div>
                      <p className="text-sm font-medium">{notification.title}</p>
                      <p className="text-xs text-muted-foreground">{notification.message}</p>
                      <p className="text-[10px] text-muted-foreground mt-1">
                        {new Date(notification.created_at).toLocaleDateString('id-ID')}
                      </p>
                    </div>
                  </div>
                ))
              ) : (
                <p className="text-sm text-muted-foreground text-center py-4">Tidak ada notifikasi baru.</p>
              )}
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
