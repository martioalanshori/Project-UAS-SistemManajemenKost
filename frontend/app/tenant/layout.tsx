'use client';

import React from 'react';
import { DashboardLayout } from '@/components/layouts/DashboardLayout';
import {
  LayoutDashboard,
  FileText,
  CreditCard,
  UserCircle
} from 'lucide-react';

const tenantSidebarItems = [
  { name: 'Dashboard', href: '/tenant/dashboard', icon: <LayoutDashboard className="h-4 w-4" /> },
  { name: 'Pengajuan Saya', href: '/tenant/applications', icon: <FileText className="h-4 w-4" /> },
  { name: 'Pembayaran', href: '/tenant/payments', icon: <CreditCard className="h-4 w-4" /> },
  { name: 'Profil', href: '/tenant/profile', icon: <UserCircle className="h-4 w-4" /> },
];

export default function TenantLayout({ children }: { children: React.ReactNode }) {
  return (
    <DashboardLayout role="Tenant" sidebarItems={tenantSidebarItems}>
      {children}
    </DashboardLayout>
  );
}
