'use client';

import React from 'react';
import { DashboardLayout } from '@/components/layouts/DashboardLayout';
import {
  LayoutDashboard,
  DoorClosed,
  Sofa,
  FileText,
  Users,
  CreditCard,
  Bell,
  PieChart,
  Receipt
} from 'lucide-react';

const adminSidebarItems = [
  { name: 'Dashboard', href: '/admin/dashboard', icon: <LayoutDashboard className="h-4 w-4" /> },
  { name: 'Kamar', href: '/admin/rooms', icon: <DoorClosed className="h-4 w-4" /> },
  { name: 'Fasilitas', href: '/admin/facilities', icon: <Sofa className="h-4 w-4" /> },
  { name: 'Pengajuan', href: '/admin/applications', icon: <FileText className="h-4 w-4" /> },
  { name: 'Penghuni', href: '/admin/tenants', icon: <Users className="h-4 w-4" /> },
  { name: 'Pembayaran', href: '/admin/payments', icon: <CreditCard className="h-4 w-4" /> },
  { name: 'Pengeluaran', href: '/admin/expenses', icon: <Receipt className="h-4 w-4" /> },
  { name: 'Notifikasi', href: '/admin/notifications', icon: <Bell className="h-4 w-4" /> },
  { name: 'Laporan', href: '/admin/reports', icon: <PieChart className="h-4 w-4" /> },
  { name: 'Manajemen User', href: '/admin/users', icon: <Users className="h-4 w-4" /> },
];

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { useAppContext } from '@/context/AppContext';

export default function AdminLayout({ children }: { children: React.ReactNode }) {
  const { state } = useAppContext();
  const router = useRouter();
  const [isAuthorized, setIsAuthorized] = useState(false);

  useEffect(() => {
    const token = localStorage.getItem('token');
    const userStr = localStorage.getItem('user');
    
    if (!token || !userStr) {
      router.push('/login');
      return;
    }
    
    try {
      const user = JSON.parse(userStr);
      if (user.role !== 'Admin') {
        router.push('/');
        return;
      }
      setIsAuthorized(true);
    } catch (e) {
      router.push('/login');
    }
  }, [router]);

  if (!isAuthorized) {
    return (
      <div className="flex h-screen w-screen items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary"></div>
      </div>
    );
  }

  return (
    <DashboardLayout role="Admin" sidebarItems={adminSidebarItems}>
      {children}
    </DashboardLayout>
  );
}
