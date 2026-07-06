'use client';

import React from 'react';
import { useAppContext } from '@/context/AppContext';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Bell, CheckCircle } from 'lucide-react';
import { Button } from '@/components/ui/button';

export default function AdminNotifications() {
  const { notifications, markNotificationAsRead } = useAppContext();

  // Admin sees all notifications or specific admin notifications (in dummy data, just show all for demo)
  const adminNotifications = notifications;

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Notifikasi</h1>
          <p className="text-muted-foreground">Pemberitahuan sistem dan aktivitas terbaru.</p>
        </div>
      </div>

      <div className="grid gap-4">
        {adminNotifications.map(notification => (
          <Card key={notification.id} className={notification.is_read ? 'opacity-70' : ''}>
            <CardHeader className="py-4 flex flex-row items-center justify-between space-y-0">
              <div className="flex items-center gap-2">
                <Bell className={`h-5 w-5 ${notification.is_read ? 'text-muted-foreground' : 'text-primary'}`} />
                <CardTitle className="text-base">{notification.title}</CardTitle>
              </div>
              {!notification.is_read && (
                <Button 
                  variant="outline" 
                  size="sm" 
                  onClick={() => markNotificationAsRead(notification.id)}
                >
                  <CheckCircle className="mr-2 h-4 w-4" /> Tandai Dibaca
                </Button>
              )}
            </CardHeader>
            <CardContent className="pb-4">
              <p className="text-sm text-muted-foreground">{notification.message}</p>
              <p className="text-xs text-muted-foreground mt-2">
                {new Date(notification.created_at).toLocaleString('id-ID')}
              </p>
            </CardContent>
          </Card>
        ))}
        {adminNotifications.length === 0 && (
          <div className="text-center py-12 text-muted-foreground">
            Tidak ada notifikasi saat ini.
          </div>
        )}
      </div>
    </div>
  );
}
