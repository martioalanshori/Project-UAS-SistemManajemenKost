'use client';

import React, { useState } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import { useAppContext } from '@/context/AppContext';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import Link from 'next/link';
import Swal from 'sweetalert2';
import { ChevronLeft } from 'lucide-react';
import { Suspense } from 'react';

function LoginContent() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const { login, currentUser } = useAppContext();
  const router = useRouter();
  const searchParams = useSearchParams();
  const redirectParam = searchParams.get('redirect');

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      await login(email, password);
      Swal.fire({
        icon: 'success',
        title: 'Login Berhasil',
        text: 'Selamat datang kembali!',
        timer: 1500,
        showConfirmButton: false
      });
    } catch (error: any) {
      const msg = error.response?.data?.error || 'Gagal login. Periksa email dan password Anda.';
      Swal.fire({
        icon: 'error',
        title: 'Gagal Login',
        text: msg
      });
    }
  };

  React.useEffect(() => {
    if (currentUser) {
      if (redirectParam) {
        router.push(redirectParam);
      } else if (currentUser.role === 'Admin') {
        router.push('/admin/dashboard');
      } else if (currentUser.role === 'Tenant') {
        router.push('/tenant/dashboard');
      } else {
        router.push('/rooms');
      }
    }
  }, [currentUser, router, redirectParam]);

  return (
    <div className="flex items-center justify-center min-h-screen bg-muted/40 p-4">
      <Card className="w-full max-w-md relative">
        <Link href="/" className="absolute left-4 top-4 text-muted-foreground hover:text-primary flex items-center text-sm transition-colors">
          <ChevronLeft className="h-4 w-4 mr-1" /> Kembali
        </Link>
        <CardHeader className="space-y-1 mt-6">
          <CardTitle className="text-2xl font-bold text-center">Login</CardTitle>
          <CardDescription className="text-center">
            Masukkan email Anda untuk masuk ke akun
          </CardDescription>
        </CardHeader>
        <form onSubmit={handleLogin}>
          <CardContent className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="email">Email</Label>
              <Input 
                id="email" 
                type="email" 
                placeholder="Masukkan Email" 
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required 
              />
            </div>
            <div className="space-y-2">
              <div className="flex items-center justify-between">
                <Label htmlFor="password">Password</Label>
              </div>
              <Input 
                id="password" 
                type="password" 
                placeholder="Masukan Password" 
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required 
              />
            </div>
          </CardContent>
          <CardFooter className="flex flex-col space-y-4">
            <Button type="submit" className="w-full">Sign In</Button>
            <div className="text-sm text-center text-muted-foreground">
              Belum punya akun?{' '}
              <Link href="/register" className="text-primary hover:underline">
                Daftar sekarang
              </Link>
            </div>
          </CardFooter>
        </form>
      </Card>
    </div>
  );
}

export default function LoginPage() {
  return (
    <Suspense fallback={<div className="flex items-center justify-center min-h-screen">Loading...</div>}>
      <LoginContent />
    </Suspense>
  );
}
