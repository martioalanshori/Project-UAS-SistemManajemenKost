'use client';

import React, { useState } from 'react';
import { useAppContext } from '@/context/AppContext';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger, DialogFooter } from '@/components/ui/dialog';
import { Plus, Trash2, Edit } from 'lucide-react';
import Swal from 'sweetalert2';

export default function ExpensesManagementPage() {
  const { expenses, addExpense, updateExpense, deleteExpense } = useAppContext();
  
  const [isAddOpen, setIsAddOpen] = useState(false);
  const [isEditOpen, setIsEditOpen] = useState(false);
  
  const [formData, setFormData] = useState({ id: '', description: '', category: '', amount: '', expense_date: '' });

  const handleAddSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      await addExpense({
        description: formData.description,
        category: formData.category,
        amount: parseInt(formData.amount),
        expense_date: formData.expense_date
      });
      Swal.fire('Berhasil!', 'Pengeluaran baru berhasil ditambahkan.', 'success');
      setIsAddOpen(false);
      setFormData({ id: '', description: '', category: '', amount: '', expense_date: '' });
    } catch (error) {
      Swal.fire('Gagal', 'Terjadi kesalahan saat menambahkan pengeluaran', 'error');
    }
  };

  const openEdit = (expense: any) => {
    setFormData({
      id: expense.id,
      description: expense.description,
      category: expense.category,
      amount: expense.amount.toString(),
      expense_date: expense.expense_date
    });
    setIsEditOpen(true);
  };

  const handleEditSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      await updateExpense(formData.id, {
        description: formData.description,
        category: formData.category,
        amount: parseInt(formData.amount),
        expense_date: formData.expense_date
      });
      Swal.fire('Berhasil!', 'Pengeluaran berhasil diperbarui.', 'success');
      setIsEditOpen(false);
    } catch (error) {
      Swal.fire('Gagal', 'Terjadi kesalahan saat memperbarui pengeluaran', 'error');
    }
  };

  const handleDelete = (id: string) => {
    Swal.fire({
      title: 'Hapus Pengeluaran?',
      text: 'Aksi ini tidak dapat dibatalkan.',
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#d33',
      confirmButtonText: 'Ya, Hapus'
    }).then(async (result) => {
      if (result.isConfirmed) {
        try {
          await deleteExpense(id);
          Swal.fire('Terhapus!', 'Pengeluaran berhasil dihapus.', 'success');
        } catch (error) {
          Swal.fire('Gagal', 'Terjadi kesalahan saat menghapus pengeluaran', 'error');
        }
      }
    });
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Pengeluaran</h1>
          <p className="text-muted-foreground">Catat dan kelola pengeluaran operasional Kost.</p>
        </div>
        <Dialog open={isAddOpen} onOpenChange={setIsAddOpen}>
          <DialogTrigger render={<Button />}>
            <Plus className="mr-2 h-4 w-4" /> Tambah Pengeluaran
          </DialogTrigger>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Tambah Pengeluaran Baru</DialogTitle>
            </DialogHeader>
            <form onSubmit={handleAddSubmit} className="space-y-4 pt-4">
              <div className="space-y-2">
                <Label>Deskripsi (Misal: Bayar Listrik Bulan Ini)</Label>
                <Input required value={formData.description} onChange={(e) => setFormData({...formData, description: e.target.value})} />
              </div>
              <div className="space-y-2">
                <Label>Kategori (Misal: Listrik, Air, Kebersihan)</Label>
                <Input required value={formData.category} onChange={(e) => setFormData({...formData, category: e.target.value})} />
              </div>
              <div className="space-y-2">
                <Label>Bulan (Contoh: 2024-08)</Label>
                <Input required type="month" value={formData.expense_date} onChange={(e) => setFormData({...formData, expense_date: e.target.value})} />
              </div>
              <div className="space-y-2">
                <Label>Jumlah Nominal (Rp)</Label>
                <Input required type="number" value={formData.amount} onChange={(e) => setFormData({...formData, amount: e.target.value})} />
              </div>
              <DialogFooter>
                <Button type="submit" className="w-full">Simpan</Button>
              </DialogFooter>
            </form>
          </DialogContent>
        </Dialog>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Daftar Pengeluaran</CardTitle>
          <CardDescription>Semua catatan pengeluaran sistem tercatat di sini.</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="rounded-md border bg-card overflow-x-auto">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead className="w-[50px]">No.</TableHead>
                  <TableHead>Bulan</TableHead>
                  <TableHead>Kategori</TableHead>
                  <TableHead>Deskripsi</TableHead>
                  <TableHead>Nominal</TableHead>
                  <TableHead className="text-right">Aksi</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {expenses.map((exp, idx) => (
                  <TableRow key={exp.id}>
                    <TableCell className="font-medium">{idx + 1}</TableCell>
                    <TableCell>{exp.expense_date}</TableCell>
                    <TableCell>{exp.category}</TableCell>
                    <TableCell>{exp.description}</TableCell>
                    <TableCell>Rp {exp.amount.toLocaleString('id-ID')}</TableCell>
                    <TableCell className="text-right space-x-2">
                      <Button variant="outline" size="icon" onClick={() => openEdit(exp)}>
                        <Edit className="h-4 w-4" />
                      </Button>
                      <Button variant="destructive" size="icon" onClick={() => handleDelete(exp.id)}>
                        <Trash2 className="h-4 w-4" />
                      </Button>
                    </TableCell>
                  </TableRow>
                ))}
                {expenses.length === 0 && (
                  <TableRow>
                    <TableCell colSpan={6} className="text-center py-6 text-muted-foreground">Belum ada data pengeluaran.</TableCell>
                  </TableRow>
                )}
              </TableBody>
            </Table>
          </div>
        </CardContent>
      </Card>

      <Dialog open={isEditOpen} onOpenChange={setIsEditOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Edit Pengeluaran</DialogTitle>
          </DialogHeader>
          <form onSubmit={handleEditSubmit} className="space-y-4 pt-4">
            <div className="space-y-2">
              <Label>Deskripsi</Label>
              <Input required value={formData.description} onChange={(e) => setFormData({...formData, description: e.target.value})} />
            </div>
            <div className="space-y-2">
              <Label>Kategori</Label>
              <Input required value={formData.category} onChange={(e) => setFormData({...formData, category: e.target.value})} />
            </div>
            <div className="space-y-2">
              <Label>Bulan</Label>
              <Input required type="month" value={formData.expense_date} onChange={(e) => setFormData({...formData, expense_date: e.target.value})} />
            </div>
            <div className="space-y-2">
              <Label>Jumlah Nominal (Rp)</Label>
              <Input required type="number" value={formData.amount} onChange={(e) => setFormData({...formData, amount: e.target.value})} />
            </div>
            <DialogFooter>
              <Button type="submit" className="w-full">Simpan Perubahan</Button>
            </DialogFooter>
          </form>
        </DialogContent>
      </Dialog>
    </div>
  );
}
