'use client';

import React, { use } from 'react';
import { useParams, useRouter } from 'next/navigation';
import { useAppContext } from '@/context/AppContext';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button, buttonVariants } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Check, ChevronLeft } from 'lucide-react';
import Link from 'next/link';
import { cn } from '@/lib/utils';

export default function RoomDetailPage() {
  const params = useParams();
  const router = useRouter();
  const id = params.id as string;
  const { rooms, currentUser } = useAppContext();

  const room = rooms.find(r => r.id === id);

  if (!room) {
    return (
      <div className="container mx-auto px-4 py-16 text-center">
        <h1 className="text-2xl font-bold mb-4">Kamar tidak ditemukan</h1>
        <Link href="/rooms" className={buttonVariants()}>Kembali ke Daftar Kamar</Link>
      </div>
    );
  }

  const handleApply = () => {
    if (!currentUser) {
      router.push(`/login?redirect=/rooms/${room.id}`);
    } else if (currentUser.role === 'Tenant' || currentUser.role === 'Guest') {
      router.push('/tenant/applications/new?roomId=' + room.id);
    } else {
      router.push(`/login?redirect=/rooms/${room.id}`);
    }
  };

  return (
    <div className="container mx-auto px-4 py-8 max-w-5xl">
      <Link href="/rooms" className={cn(buttonVariants({ variant: "ghost" }), "mb-6 -ml-4")}>
        <ChevronLeft className="mr-2 h-4 w-4" /> Kembali
      </Link>

      <div className="grid md:grid-cols-2 gap-8">
        <div>
          <div className="rounded-xl overflow-hidden mb-4 shadow-md bg-muted aspect-square md:aspect-auto h-[400px]">
            <img 
              src={room.image} 
              alt={`Kamar ${room.room_number}`} 
              className="w-full h-full object-cover"
            />
          </div>
        </div>

        <div className="flex flex-col">
          <div className="mb-6">
            <div className="flex items-center justify-between mb-2">
              <h1 className="text-3xl font-bold">Kamar {room.room_number}</h1>
              <Badge variant={room.status === 'Kosong' ? 'default' : 'secondary'} className="text-sm px-3 py-1">
                {room.status}
              </Badge>
            </div>
            <div className="text-3xl font-bold text-primary mb-4">
              Rp {room.price.toLocaleString('id-ID')} <span className="text-lg text-muted-foreground font-normal">/ bulan</span>
            </div>
            <p className="text-muted-foreground text-lg leading-relaxed">
              {room.description}
            </p>
          </div>

          <Card className="mb-6">
            <CardHeader>
              <CardTitle>Fasilitas Kamar</CardTitle>
            </CardHeader>
            <CardContent>
              <ul className="grid grid-cols-2 gap-3">
                {room.facilities.map(facility => (
                  <li key={facility.id} className="flex items-center text-sm">
                    <Check className="mr-2 h-4 w-4 text-primary" />
                    {facility.name}
                  </li>
                ))}
              </ul>
            </CardContent>
          </Card>

          <div className="mt-auto pt-6 border-t">
            <Button 
              size="lg" 
              className="w-full text-lg h-14" 
              disabled={room.status !== 'Kosong'}
              onClick={handleApply}
            >
              {room.status === 'Kosong' ? 'Ajukan Sewa Sekarang' : 'Kamar Tidak Tersedia'}
            </Button>
            {room.status !== 'Kosong' && (
              <p className="text-center text-sm text-muted-foreground mt-2">
                Kamar ini sedang {room.status.toLowerCase()}.
              </p>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
