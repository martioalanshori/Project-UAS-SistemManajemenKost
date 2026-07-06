'use client';

import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Trash2, UserCog, Edit } from 'lucide-react';
import Swal from 'sweetalert2';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from '@/components/ui/dialog';
import { Label } from '@/components/ui/label';
import axios from 'axios';
import { User } from '@/types';

export default function UsersManagementPage() {
  const [users, setUsers] = useState<User[]>([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [isEditDialogOpen, setIsEditDialogOpen] = useState(false);
  const [editingUser, setEditingUser] = useState<User | null>(null);
  const [editForm, setEditForm] = useState({ fullname: '', email: '', phone: '', role: '', password: '' });
  const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000/api';

  const fetchUsers = async () => {
    try {
      const res = await axios.get(`${API_URL}/users`);
      setUsers(res.data);
    } catch (error) {
      console.error(error);
    }
  };

  useEffect(() => {
    fetchUsers();
  }, []);

  const handleDelete = (id: string) => {
    Swal.fire({
      title: 'Hapus Pengguna?',
      text: 'Aksi ini tidak dapat dibatalkan.',
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#d33',
      confirmButtonText: 'Ya, Hapus'
    }).then(async (result) => {
      if (result.isConfirmed) {
        try {
          await axios.delete(`${API_URL}/users/${id}`);
          setUsers(users.filter(user => user.id !== id));
          Swal.fire('Terhapus!', 'Pengguna berhasil dihapus dari sistem.', 'success');
        } catch (error) {
          Swal.fire('Gagal', 'Terjadi kesalahan saat menghapus pengguna', 'error');
        }
      }
    });
  };

  const handleRoleChange = async (id: string, currentRole: string) => {
    // Deprecated, use openEditDialog instead
  };

  const openEditDialog = (user: User) => {
    setEditingUser(user);
    setEditForm({ fullname: user.fullname, email: user.email, phone: user.phone, role: user.role, password: '' });
    setIsEditDialogOpen(true);
  };

  const handleEditSubmit = async () => {
    if (!editingUser) return;
    try {
      const payload: any = { ...editForm };
      if (!payload.password) delete payload.password;

      await axios.put(`${API_URL}/users/${editingUser.id}`, payload);
      setUsers(users.map(u => u.id === editingUser.id ? { ...u, ...payload } : u));
      setIsEditDialogOpen(false);
      Swal.fire('Berhasil!', 'Data pengguna berhasil diperbarui.', 'success');
    } catch (error) {
      Swal.fire('Gagal', 'Terjadi kesalahan saat memperbarui pengguna.', 'error');
    }
  };

  const filteredUsers = users.filter(user => 
    user.fullname.toLowerCase().includes(searchTerm.toLowerCase()) ||
    user.email.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Manajemen User</h1>
          <p className="text-muted-foreground">Kelola hak akses dan data pengguna sistem.</p>
        </div>
      </div>

      <Card>
        <CardHeader className="flex flex-col sm:flex-row sm:items-center justify-between space-y-2 sm:space-y-0">
          <div>
            <CardTitle>Daftar Pengguna</CardTitle>
            <CardDescription>Semua pendaftar, penghuni, dan pengelola terdaftar di sini.</CardDescription>
          </div>
          <div className="flex items-center">
            <Input 
              type="search" 
              placeholder="Cari nama atau email..." 
              className="w-[200px] sm:w-[250px]"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>
        </CardHeader>
        <CardContent>
          <div className="rounded-md border bg-card overflow-x-auto">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead className="w-[50px]">No.</TableHead>
                  <TableHead>Nama Pengguna</TableHead>
                  <TableHead>No. Telepon</TableHead>
                  <TableHead>Role</TableHead>
                  <TableHead className="text-right">Aksi</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filteredUsers.map((user, idx) => (
                  <TableRow key={user.id}>
                    <TableCell className="font-medium">{idx + 1}</TableCell>
                    <TableCell>
                      <div className="font-medium">{user.fullname}</div>
                      <div className="text-xs text-muted-foreground">{user.email}</div>
                    </TableCell>
                    <TableCell>{user.phone}</TableCell>
                    <TableCell>
                      <Badge variant={user.role === 'Admin' ? 'default' : user.role === 'Tenant' ? 'secondary' : 'outline'}>
                        {user.role}
                      </Badge>
                    </TableCell>
                    <TableCell className="text-right space-x-2">
                      <Button 
                        variant="outline" 
                        size="icon" 
                        title="Edit Pengguna"
                        onClick={() => openEditDialog(user)}
                      >
                        <Edit className="h-4 w-4" />
                      </Button>
                      <Button 
                        variant="destructive" 
                        size="icon" 
                        title="Hapus Pengguna"
                        disabled={user.role === 'Admin'}
                        onClick={() => handleDelete(user.id)}
                      >
                        <Trash2 className="h-4 w-4" />
                      </Button>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </div>
        </CardContent>
      </Card>

      <Dialog open={isEditDialogOpen} onOpenChange={setIsEditDialogOpen}>
        <DialogContent className="sm:max-w-[425px]">
          <DialogHeader>
            <DialogTitle>Edit Pengguna</DialogTitle>
          </DialogHeader>
          <div className="grid gap-4 py-4">
            <div className="grid gap-2">
              <Label>Nama Lengkap</Label>
              <Input 
                value={editForm.fullname} 
                onChange={e => setEditForm({...editForm, fullname: e.target.value})} 
              />
            </div>
            <div className="grid gap-2">
              <Label>Email</Label>
              <Input 
                value={editForm.email} 
                type="email"
                onChange={e => setEditForm({...editForm, email: e.target.value})} 
              />
            </div>
            <div className="grid gap-2">
              <Label>No. Telepon</Label>
              <Input 
                value={editForm.phone} 
                onChange={e => setEditForm({...editForm, phone: e.target.value})} 
              />
            </div>
            <div className="grid gap-2">
              <Label>Role</Label>
              <select 
                className="flex h-10 w-full items-center justify-between rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
                value={editForm.role}
                onChange={e => setEditForm({...editForm, role: e.target.value})}
              >
                <option value="Admin">Admin</option>
                <option value="Tenant">Tenant</option>
              </select>
            </div>
            <div className="grid gap-2">
              <Label>Password Baru (Opsional)</Label>
              <Input 
                type="password"
                placeholder="Kosongkan jika tidak ingin diubah"
                value={editForm.password} 
                onChange={e => setEditForm({...editForm, password: e.target.value})} 
              />
              <p className="text-xs text-muted-foreground">Catatan: Password tidak dapat dilihat karena telah dienkripsi. Anda hanya bisa mengatur password baru.</p>
            </div>
          </div>
          <DialogFooter>
            <Button variant="ghost" onClick={() => setIsEditDialogOpen(false)}>Batal</Button>
            <Button onClick={handleEditSubmit}>Simpan Perubahan</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}

