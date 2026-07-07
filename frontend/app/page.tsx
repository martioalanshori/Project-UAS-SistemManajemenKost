'use client';

import React from 'react';
import Link from 'next/link';
import { Button, buttonVariants } from '@/components/ui/button';
import { Search, MapPin, Calendar, Users, User, LogOut, LayoutDashboard } from 'lucide-react';
import { useAppContext } from '@/context/AppContext';
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
import { RoomCard } from '@/components/ui/room-card';
import { Input } from '@/components/ui/input';
import { useRouter } from 'next/navigation';

export default function LandingPage() {
  const { rooms, currentUser, logout } = useAppContext();
  const router = useRouter();
  
  // Ambil 4 kamar pertama untuk featured
  const featuredRooms = rooms.slice(0, 4);

  return (
    <div className="flex flex-col min-h-screen font-sans">
      {/* Header Sticky */}
      <header className="fixed top-0 z-50 w-full bg-white/90 backdrop-blur-md border-b px-6 h-[80px] flex items-center justify-between transition-all duration-300">
        <Link className="flex items-center gap-2" href="/">
          <img src="/img/logo.png" alt="Papakos Logo" className="h-10 w-auto object-contain" />
          <span className="font-bold text-xl text-primary tracking-tight">Papakos</span>
        </Link>

        <div className="flex items-center gap-4">
          <div className="hidden sm:flex items-center gap-6 mr-4">
            <Link href="/rooms" className="relative text-sm font-medium py-1 transition-colors after:absolute after:bottom-0 after:left-0 after:h-[2px] after:w-full after:origin-bottom-right after:scale-x-0 after:bg-green-500 after:transition-transform after:duration-300 hover:after:origin-bottom-left hover:after:scale-x-100">
              Cari Kamar
            </Link>
            <Link href="/terms" className="relative text-sm font-medium py-1 transition-colors after:absolute after:bottom-0 after:left-0 after:h-[2px] after:w-full after:origin-bottom-right after:scale-x-0 after:bg-green-500 after:transition-transform after:duration-300 hover:after:origin-bottom-left hover:after:scale-x-100">
              Syarat dan Ketentuan
            </Link>
            <Link href="/help" className="relative text-sm font-medium py-1 transition-colors after:absolute after:bottom-0 after:left-0 after:h-[2px] after:w-full after:origin-bottom-right after:scale-x-0 after:bg-green-500 after:transition-transform after:duration-300 hover:after:origin-bottom-left hover:after:scale-x-100">
              Pusat Bantuan
            </Link>
          </div>
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
      </header>

      <main className="flex-1 mt-[80px]">
        {/* Hero Section */}
        <section className="relative w-full h-[350px] flex flex-col items-center justify-center px-4">
          {/* Background Image */}
          <div className="absolute inset-0 z-0 bg-primary/20">
            <img 
              src="/img/wallpaper.jpg" 
              alt="Interior Kost Estetik" 
              className="w-full h-full object-cover brightness-[0.85] opacity-50"
            />
          </div>

          {/* Floating Search Bar (Functional & Simplified) */}
          <form 
            onSubmit={(e) => {
              e.preventDefault();
              const formData = new FormData(e.currentTarget);
              const q = formData.get('q') as string;
              window.location.href = `/rooms${q ? `?q=${encodeURIComponent(q)}` : ''}`;
            }}
            className="z-10 bg-white rounded-full p-2 flex items-center gap-2 shadow-2xl w-full max-w-2xl border mx-auto"
          >
            <div className="flex-1 px-6 py-2">
              <div className="text-xs font-bold mb-1">Cari Kamar</div>
              <Input 
                name="q"
                className="h-6 p-0 border-0 focus-visible:ring-0 shadow-none text-muted-foreground placeholder:text-muted-foreground/60 w-full" 
                placeholder="Masukkan nomor kamar atau deskripsi..." 
              />
            </div>
            <Button type="submit" size="icon" className="h-12 w-12 rounded-full flex-shrink-0 bg-primary hover:bg-primary/90 hidden sm:flex">
              <Search className="h-5 w-5" />
            </Button>
            <Button type="submit" className="w-full sm:hidden mt-2 rounded-full" size="lg">
              <Search className="mr-2 h-4 w-4" /> Cari
            </Button>
          </form>
        </section>
        
        {/* Featured Rooms */}
        <section className="w-full py-16">
          <div className="container mx-auto px-4 md:px-6 max-w-7xl">
            <div className="flex items-center justify-between mb-8">
              <h2 className="text-2xl font-bold tracking-tight">Rekomendasi Kamar</h2>
              <Link href="/rooms" className="text-sm font-semibold underline hover:text-primary">
                Lihat semua
              </Link>
            </div>
            
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
              {featuredRooms.map(room => (
                <RoomCard key={room.id} room={room} />
              ))}
            </div>
          </div>
        </section>
      </main>

      <footer className="w-full bg-muted/30 py-8 border-t mt-auto">
        <div className="container mx-auto px-6 max-w-7xl flex flex-col md:flex-row justify-between items-center gap-4">
          <p className="text-sm text-muted-foreground">© 2026 Muhammad Martio Al Anshori. All rights reserved.</p>
          <div className="flex gap-6">
            <Link className="text-sm text-muted-foreground hover:underline" href="/privacy">Privasi</Link>
            <Link className="text-sm text-muted-foreground hover:underline" href="/terms">Syarat</Link>
            <Link className="text-sm text-muted-foreground hover:underline" href="/sitemap">Peta Situs</Link>
          </div>
        </div>
      </footer>
    </div>
  );
}
