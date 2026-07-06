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

export default function AdminLayout({ children }: { children: React.ReactNode }) {
  return (
    <DashboardLayout role="Admin" sidebarItems={adminSidebarItems}>
      {children}
    </DashboardLayout>
  );
}
