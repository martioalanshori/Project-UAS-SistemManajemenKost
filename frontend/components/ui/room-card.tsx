import React from 'react';
import Link from 'next/link';
import { Room } from '@/types';
import { MapPin, Star } from 'lucide-react';

interface RoomCardProps {
  room: Room;
}

export function RoomCard({ room }: RoomCardProps) {
  const isAvailable = room.status === 'Kosong';

  return (
    <Link href={`/rooms/${room.id}`} className="group flex flex-col gap-3">
      {/* Image Container */}
      <div className="relative aspect-[4/3] w-full overflow-hidden rounded-xl bg-muted shadow-sm transition-shadow group-hover:shadow-md">
        <img 
          src={room.image} 
          alt={`Kamar ${room.room_number}`} 
          className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-105"
        />
        
        {/* Status Badge Overlaid (Top Left) */}
        <div className="absolute top-3 left-3">
          <span className={`inline-flex items-center px-2.5 py-1 rounded-full text-xs font-semibold shadow-sm backdrop-blur-sm text-white ${
            isAvailable ? 'bg-green-600/90' : room.status === 'Terisi' ? 'bg-red-600/90' : 'bg-yellow-600/90'
          }`}>
            {isAvailable ? 'Tersedia' : room.status}
          </span>
        </div>

        {/* Heart / Favorite Icon placeholder - Airbnb style (Top Right) */}
        <button className="absolute right-3 top-3 text-white hover:scale-110 transition-transform active:scale-95 drop-shadow-md">
          <svg viewBox="0 0 32 32" xmlns="http://www.w3.org/2000/svg" aria-hidden="true" role="presentation" focusable="false" style={{ display: 'block', fill: 'rgba(0, 0, 0, 0.4)', height: '24px', width: '24px', stroke: 'white', strokeWidth: 2, overflow: 'visible' }}>
            <path d="M16 28c7-4.73 14-10 14-17a6.98 6.98 0 0 0-7-6.94c-2.24 0-4.32.96-5.83 2.6A8.04 8.04 0 0 0 11.34 4 7 7 0 0 0 4.29 11c0 7 7 12.27 14 17z"></path>
          </svg>
        </button>
      </div>
      
      {/* Details Container */}
      <div className="flex flex-col gap-1 px-1">
        <div className="flex justify-between items-start">
          <h3 className="font-semibold text-foreground text-[15px] tracking-tight">
            Kamar {room.room_number}
          </h3>
          <div className="flex items-center gap-1 text-sm">
          </div>
        </div>
        
        <p className="text-[14px] text-muted-foreground line-clamp-1 leading-relaxed">
          {room.description}
        </p>
        
        <div className="mt-1 flex items-baseline gap-1">
          <span className="font-semibold text-[15px]">Rp {room.price.toLocaleString('id-ID')}</span>
          <span className="text-[14px] text-muted-foreground">/ bulan</span>
        </div>
      </div>
    </Link>
  );
}
