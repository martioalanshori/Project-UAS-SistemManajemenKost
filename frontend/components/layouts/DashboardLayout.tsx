'use client';

import React from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { useAppContext } from '@/context/AppContext';
import { Button } from '@/components/ui/button';
import { LogOut, Menu, User, Home } from 'lucide-react';
import { Sheet, SheetContent, SheetTrigger } from '@/components/ui/sheet';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { useRouter } from 'next/navigation';

interface SidebarItem {
  name: string;
  href: string;
  icon: React.ReactNode;
}

interface DashboardLayoutProps {
  children: React.ReactNode;
  role: 'Admin' | 'Tenant';
  sidebarItems: SidebarItem[];
}

export function DashboardLayout({ children, role, sidebarItems }: DashboardLayoutProps) {
  const pathname = usePathname();
  const { currentUser, logout } = useAppContext();
  const router = useRouter();

  const handleLogout = () => {
    logout();
    router.push('/login');
  };

  const SidebarContent = () => (
    <div className="flex h-full flex-col">
      <div className="flex h-14 items-center border-b px-4 lg:h-[60px] lg:px-6">
        <Link href="/" className="flex items-center gap-2 font-semibold">
          <Home className="h-6 w-6" />
          <span className="">Kost {role}</span>
        </Link>
      </div>
      <div className="flex-1 overflow-auto py-2">
        <nav className="grid items-start px-2 text-sm font-medium lg:px-4">
          {sidebarItems.map((item) => (
            <Link
              key={item.name}
              href={item.href}
              className={`flex items-center gap-3 rounded-lg px-3 py-2 transition-all hover:text-primary ${
                pathname === item.href ? 'bg-muted text-primary' : 'text-muted-foreground'
              }`}
            >
              {item.icon}
              {item.name}
            </Link>
          ))}
        </nav>
      </div>
      <div className="p-4 mt-auto border-t space-y-4">
        {currentUser && (
          <div className="flex items-center gap-3 px-2">
            <Avatar className="h-9 w-9">
              <AvatarImage src={currentUser.avatar || ''} alt={currentUser.fullname} className="object-cover" />
              <AvatarFallback className="bg-primary/10 text-primary">
                {currentUser.fullname?.charAt(0) || <User className="h-4 w-4" />}
              </AvatarFallback>
            </Avatar>
            <div className="flex flex-col overflow-hidden">
              <span className="text-sm font-medium truncate">{currentUser.fullname}</span>
              <span className="text-xs text-muted-foreground truncate">{currentUser.email}</span>
            </div>
          </div>
        )}
        <Button 
          variant="outline" 
          className="w-full justify-start text-destructive hover:text-destructive hover:bg-destructive/10" 
          onClick={handleLogout}
        >
          <LogOut className="mr-2 h-4 w-4" />
          Keluar
        </Button>
      </div>
    </div>
  );

  return (
    <div className="grid min-h-screen w-full lg:grid-cols-[260px_1fr]">
      <div className="hidden border-r bg-muted/40 lg:block">
        <SidebarContent />
      </div>
      <div className="flex flex-col">
        <header className="sticky top-0 z-50 flex h-16 items-center gap-4 border-b bg-background px-4 lg:px-6">
          <Sheet>
            <SheetTrigger
              render={
                <Button
                  variant="outline"
                  size="icon"
                  className="shrink-0 lg:hidden"
                />
              }
            >
              <Menu className="h-5 w-5" />
              <span className="sr-only">Toggle navigation menu</span>
            </SheetTrigger>
            <SheetContent side="left" className="flex flex-col">
              <SidebarContent />
            </SheetContent>
          </Sheet>
          <div className="w-full flex-1 max-w-lg mx-auto flex items-center">
            {/* Search removed as per request, features handled locally inside pages */}
          </div>
        </header>
        <main className="flex-1 w-full p-4 sm:p-6 lg:p-8">
          <div className="max-w-7xl mx-auto">
            {children}
          </div>
        </main>
      </div>
    </div>
  );
}
