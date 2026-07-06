'use client';

import React, { useState, useEffect } from 'react';
import { useAppContext } from '@/context/AppContext';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Button } from '@/components/ui/button';
import { UserCircle, Mail, Phone, Upload, Lock } from 'lucide-react';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import Swal from 'sweetalert2';

export default function TenantProfile() {
  const { currentUser, updateProfile } = useAppContext();

  const [fullname, setFullname] = useState('');
  const [email, setEmail] = useState('');
  const [phone, setPhone] = useState('');
  const [password, setPassword] = useState('');
  const [avatar, setAvatar] = useState('');

  useEffect(() => {
    if (currentUser) {
      setFullname(currentUser.fullname || '');
      setEmail(currentUser.email || '');
      setPhone(currentUser.phone || '');
      setAvatar(currentUser.avatar || '');
    }
  }, [currentUser]);

  const handleAvatarUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setAvatar(reader.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!currentUser) return;
    try {
      const payload: any = { fullname, phone, avatar };
      if (password) {
        payload.password = password;
      }
      await updateProfile(currentUser.id, payload);
      Swal.fire('Tersimpan!', 'Profil berhasil diperbarui.', 'success');
      setPassword(''); // Reset password field after save
    } catch (error: any) {
      const msg = error.response?.data?.error || 'Gagal memperbarui profil.';
      Swal.fire('Gagal', msg, 'error');
    }
  };

  return (
    <div className="space-y-6 max-w-2xl mx-auto">
      <div>
        <h1 className="text-3xl font-bold tracking-tight">Profil Saya</h1>
        <p className="text-muted-foreground">Kelola informasi pribadi Anda.</p>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Informasi Akun</CardTitle>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSave} className="space-y-4">
            <div className="flex flex-col items-center mb-6 space-y-4">
              <Avatar className="h-24 w-24">
                <AvatarImage src={avatar || ''} alt={fullname} className="object-cover" />
                <AvatarFallback className="bg-muted text-muted-foreground text-2xl">
                  {fullname ? fullname.charAt(0).toUpperCase() : <UserCircle className="h-12 w-12" />}
                </AvatarFallback>
              </Avatar>
              <div className="relative">
                <Button type="button" variant="outline" size="sm">
                  <Upload className="mr-2 h-4 w-4" /> Ubah Foto
                </Button>
                <input 
                  type="file" 
                  accept="image/*"
                  className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
                  onChange={handleAvatarUpload}
                />
              </div>
            </div>

            <div className="space-y-2">
              <Label htmlFor="fullname">Nama Lengkap</Label>
              <div className="relative">
                <UserCircle className="absolute left-3 top-2.5 h-4 w-4 text-muted-foreground" />
                <Input id="fullname" value={fullname} onChange={(e) => setFullname(e.target.value)} className="pl-9" />
              </div>
            </div>

            <div className="space-y-2">
              <Label htmlFor="email">Email</Label>
              <div className="relative">
                <Mail className="absolute left-3 top-2.5 h-4 w-4 text-muted-foreground" />
                <Input id="email" type="email" value={email} className="pl-9" disabled />
              </div>
              <p className="text-xs text-muted-foreground">Email tidak dapat diubah.</p>
            </div>

            <div className="space-y-2">
              <Label htmlFor="phone">Nomor HP</Label>
              <div className="relative">
                <Phone className="absolute left-3 top-2.5 h-4 w-4 text-muted-foreground" />
                <Input id="phone" type="tel" value={phone} onChange={(e) => setPhone(e.target.value)} className="pl-9" />
              </div>
            </div>

            <div className="space-y-2">
              <Label htmlFor="password">Password Baru (Opsional)</Label>
              <div className="relative">
                <Lock className="absolute left-3 top-2.5 h-4 w-4 text-muted-foreground" />
                <Input id="password" type="password" value={password} onChange={(e) => setPassword(e.target.value)} placeholder="Kosongkan jika tidak ingin diubah" className="pl-9" />
              </div>
            </div>

            <div className="pt-4 flex justify-end">
              <Button type="submit">Simpan Perubahan</Button>
            </div>
          </form>
        </CardContent>
      </Card>
    </div>
  );
}
