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

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { useAppContext } from '@/context/AppContext';

export default function TenantLayout({ children }: { children: React.ReactNode }) {
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
      if (user.role !== 'Tenant') {
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
    <DashboardLayout role="Tenant" sidebarItems={tenantSidebarItems}>
      {children}
    </DashboardLayout>
  );
}
