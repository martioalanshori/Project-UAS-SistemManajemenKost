'use client';

import React, { useState, Suspense } from 'react';
import Link from 'next/link';
import { useSearchParams } from 'next/navigation';
import { useAppContext } from '@/context/AppContext';
import { Search, ChevronLeft, Filter, Wind, Wifi, Home, Flame, Car, Users, User, LogOut, LayoutDashboard } from 'lucide-react';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuGroup,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { useRouter } from 'next/navigation';
import { cn } from '@/lib/utils';
import { Button } from '@/components/ui/button';
import { RoomCard } from '@/components/ui/room-card';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger, DialogFooter } from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';

function RoomsContent() {
  const { rooms, currentUser, logout } = useAppContext();
  const router = useRouter();
  const searchParams = useSearchParams();
  const initialQuery = searchParams.get('q') || '';
  
  const [searchTerm, setSearchTerm] = useState(initialQuery);
  const [activeCategory, setActiveCategory] = useState('Semua');

  // Filter state
  const [isFilterOpen, setIsFilterOpen] = useState(false);
  const [minPrice, setMinPrice] = useState('');
  const [maxPrice, setMaxPrice] = useState('');
  const [statusFilter, setStatusFilter] = useState('Semua'); // 'Semua', 'Kosong', 'Terisi'

  const handleApplyFilter = () => {
    setIsFilterOpen(false);
  };

  const handleResetFilter = () => {
    setMinPrice('');
    setMaxPrice('');
    setStatusFilter('Semua');
    setIsFilterOpen(false);
  };

  const filteredRooms = rooms.filter(room => {
    // 1. Search Term
    const matchSearch = room.description.toLowerCase().includes(searchTerm.toLowerCase()) || 
                        room.room_number.toLowerCase().includes(searchTerm.toLowerCase());
    
    // 2. Category
    let matchCategory = true;
    if (activeCategory !== 'Semua') {
      matchCategory = room.facilities.some(f => f.name.toLowerCase().includes(activeCategory.toLowerCase()));
    }

    // 3. Price
    let matchPrice = true;
    if (minPrice) matchPrice = matchPrice && room.price >= parseInt(minPrice);
    if (maxPrice) matchPrice = matchPrice && room.price <= parseInt(maxPrice);

    // 4. Status
    let matchStatus = true;
    if (statusFilter !== 'Semua') {
      matchStatus = room.status === statusFilter;
    }

    return matchSearch && matchCategory && matchPrice && matchStatus;
  });

  const categories = [
    { name: 'Semua', icon: <Home className="h-6 w-6 mb-2" /> },
    { name: 'AC', icon: <Wind className="h-6 w-6 mb-2" /> },
    { name: 'WiFi', icon: <Wifi className="h-6 w-6 mb-2" /> },
    { name: 'Dapur', icon: <Flame className="h-6 w-6 mb-2" /> },
    { name: 'Parkir', icon: <Car className="h-6 w-6 mb-2" /> },
  ];

  return (
    <div className="min-h-screen flex flex-col font-sans bg-background pb-12">
      {/* Header Sticky Minimalist */}
      <header className="sticky top-0 z-40 bg-white border-b px-4 h-16 flex items-center justify-between shadow-sm">
        <Link href="/" className="flex items-center text-sm font-semibold hover:text-primary transition-colors">
          <ChevronLeft className="mr-1 h-5 w-5" /> Kembali
        </Link>
        <div className="flex-1 max-w-xl mx-4">
          <div className="relative w-full shadow-sm rounded-full border border-gray-300 hover:shadow-md transition-shadow flex items-center px-4 py-2 bg-white cursor-text">
            <Search className="h-4 w-4 text-gray-500 font-bold mr-2" />
            <input 
              className="w-full text-sm outline-none bg-transparent font-medium"
              placeholder="Cari kamar (contoh: 101, luas...)"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>
        </div>
        
        <div className="flex items-center gap-2">
          <Button 
            variant="outline" 
            size="sm" 
            className="rounded-full hidden sm:flex border-gray-300 hover:border-gray-800"
            onClick={() => setIsFilterOpen(true)}
          >
            <Filter className="mr-2 h-4 w-4" /> Filter
          </Button>

          {currentUser ? (
            <DropdownMenu>
              <DropdownMenuTrigger className="outline-none">
                <div className="flex items-center gap-2 border rounded-full p-1 pl-3 hover:shadow-md transition-shadow cursor-pointer bg-white">
                  <span className="text-sm font-medium px-2 hidden sm:block truncate max-w-[120px]">{currentUser.fullname}</span>
                  <Avatar className="h-8 w-8">
                    <AvatarImage src={currentUser.avatar || ''} alt={currentUser.fullname} className="object-cover" />
                    <AvatarFallback className="bg-primary text-white">
                      {currentUser.fullname?.charAt(0) || <User className="h-4 w-4" />}
                    </AvatarFallback>
                  </Avatar>
                </div>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end" className="w-56">
                <DropdownMenuGroup>
                  <DropdownMenuLabel>Akun Saya</DropdownMenuLabel>
                  <DropdownMenuSeparator />
                  <DropdownMenuItem onClick={() => router.push(currentUser.role === 'Admin' ? '/admin/dashboard' : '/tenant/dashboard')} className="cursor-pointer flex items-center">
                    <LayoutDashboard className="mr-2 h-4 w-4" />
                    <span>Dashboard</span>
                  </DropdownMenuItem>
                </DropdownMenuGroup>
                <DropdownMenuSeparator />
                <DropdownMenuItem onClick={logout} className="text-destructive focus:text-destructive cursor-pointer">
                  <LogOut className="mr-2 h-4 w-4" />
                  <span>Logout</span>
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          ) : (
            <div className="group flex items-center gap-2 border rounded-full p-1 pl-3 hover:shadow-md hover:bg-green-500 hover:text-white transition-all cursor-pointer bg-white">
              <Link href="/login" className="text-sm font-medium px-2 group-hover:text-white">Masuk</Link>
              <div className="bg-primary/10 text-primary p-2 rounded-full group-hover:bg-green-600 group-hover:text-white transition-all">
                <Users className="h-4 w-4" />
              </div>
            </div>
          )}
        </div>

        <Dialog open={isFilterOpen} onOpenChange={setIsFilterOpen}>
          <DialogContent className="sm:max-w-[425px]">
            <DialogHeader>
              <DialogTitle>Filter Pencarian</DialogTitle>
            </DialogHeader>
            <div className="grid gap-4 py-4">
              <div className="space-y-2">
                <Label>Rentang Harga (Per Bulan)</Label>
                <div className="flex items-center gap-2">
                  <Input 
                    type="text" 
                    placeholder="Min (Rp)" 
                    value={minPrice ? `Rp ${parseInt(minPrice.replace(/[^0-9]/g, '') || '0').toLocaleString('id-ID')}` : ''}
                    onChange={(e) => setMinPrice(e.target.value.replace(/[^0-9]/g, ''))}
                  />
                  <span>-</span>
                  <Input 
                    type="text" 
                    placeholder="Max (Rp)" 
                    value={maxPrice ? `Rp ${parseInt(maxPrice.replace(/[^0-9]/g, '') || '0').toLocaleString('id-ID')}` : ''}
                    onChange={(e) => setMaxPrice(e.target.value.replace(/[^0-9]/g, ''))}
                  />
                </div>
              </div>
              <div className="space-y-2 pt-2 border-t">
                <Label>Status Kamar</Label>
                <div className="flex gap-2 mt-2">
                  {['Semua', 'Kosong', 'Terisi', 'Dipesan'].map(status => (
                    <button
                      key={status}
                      onClick={() => setStatusFilter(status)}
                      className={cn(
                        "px-4 py-2 rounded-full text-sm border transition-all",
                        statusFilter === status 
                          ? "border-primary bg-primary text-primary-foreground" 
                          : "border-gray-200 hover:border-gray-800"
                      )}
                    >
                      {status}
                    </button>
                  ))}
                </div>
              </div>
            </div>
            <DialogFooter className="flex justify-between sm:justify-between w-full">
              <Button variant="ghost" onClick={handleResetFilter}>Reset</Button>
              <Button onClick={handleApplyFilter}>Terapkan</Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      </header>

      <main className="container mx-auto px-6 lg:px-8 max-w-7xl pt-6">
        {/* Category Icons (Airbnb style pill nav) */}
        <div className="flex items-center gap-8 overflow-x-auto pb-4 mb-6 hide-scrollbar">
          {categories.map((cat) => (
            <button 
              key={cat.name}
              onClick={() => setActiveCategory(cat.name)}
              className={cn(
                "flex flex-col items-center justify-center min-w-[64px] border-b-2 transition-all opacity-60 hover:opacity-100 pb-2",
                activeCategory === cat.name ? "border-foreground opacity-100 font-semibold" : "border-transparent"
              )}
            >
              {cat.icon}
              <span className="text-xs">{cat.name}</span>
            </button>
          ))}
        </div>

        {/* Room Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
          {filteredRooms.map((room) => (
            <RoomCard key={room.id} room={room} />
          ))}
        </div>

        {filteredRooms.length === 0 && (
          <div className="text-center py-20">
            <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-muted mb-4">
              <Search className="h-8 w-8 text-muted-foreground" />
            </div>
            <h3 className="text-xl font-semibold">Tidak ada kamar yang cocok</h3>
            <p className="text-muted-foreground mt-2">Coba hapus atau ubah filter Anda untuk melihat lebih banyak pilihan.</p>
            <Button variant="outline" className="mt-6" onClick={handleResetFilter}>
              Hapus Semua Filter
            </Button>
          </div>
        )}
      </main>
    </div>
  );
}

export default function RoomsPage() {
  return (
    <Suspense fallback={<div className="min-h-screen flex items-center justify-center">Memuat...</div>}>
      <RoomsContent />
    </Suspense>
  );
}
