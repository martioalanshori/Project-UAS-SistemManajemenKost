'use client';

import React, { useState } from 'react';
import { useAppContext } from '@/context/AppContext';
import { Button } from '@/components/ui/button';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Plus, Edit, Trash2 } from 'lucide-react';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import Swal from 'sweetalert2';

export default function AdminFacilities() {
  const { facilities, addFacility, updateFacility, deleteFacility } = useAppContext();
  
  const [isOpen, setIsOpen] = useState(false);
  const [editId, setEditId] = useState<string | null>(null);
  const [formData, setFormData] = useState({ name: '' });

  const handleOpenNew = () => {
    setEditId(null);
    setFormData({ name: '' });
    setIsOpen(true);
  };

  const handleOpenEdit = (facility: any) => {
    setEditId(facility.id);
    setFormData({ name: facility.name });
    setIsOpen(true);
  };

  const handleDelete = (id: string) => {
    Swal.fire({
      title: 'Hapus Fasilitas?',
      text: 'Fasilitas ini juga akan terhapus dari semua kamar.',
      icon: 'warning',
      showCancelButton: true,
      confirmButtonText: 'Ya, Hapus'
    }).then(async (result) => {
      if (result.isConfirmed) {
        try {
          await deleteFacility(id);
          Swal.fire('Terhapus!', 'Fasilitas berhasil dihapus.', 'success');
        } catch (error: any) {
          const msg = error.response?.data?.error || 'Gagal menghapus fasilitas.';
          Swal.fire('Gagal', msg, 'error');
        }
      }
    });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      if (editId) {
        await updateFacility(editId, { name: formData.name });
        Swal.fire('Berhasil!', 'Fasilitas berhasil diperbarui', 'success');
      } else {
        await addFacility({ name: formData.name });
        Swal.fire('Berhasil!', 'Fasilitas baru berhasil ditambahkan', 'success');
      }
      setIsOpen(false);
    } catch (error: any) {
      const msg = error.response?.data?.error || 'Gagal menyimpan fasilitas.';
      Swal.fire('Gagal', msg, 'error');
    }
  };

  const [searchTerm, setSearchTerm] = useState('');

  const filteredFacilities = facilities.filter(facility => 
    facility.name.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Manajemen Fasilitas</h1>
          <p className="text-muted-foreground">Daftar fasilitas yang tersedia untuk kamar.</p>
        </div>
        
        <div className="flex items-center gap-4">
          <Input 
            type="search" 
            placeholder="Cari fasilitas..." 
            className="w-[200px] sm:w-[250px]"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
          <Button onClick={handleOpenNew} className="shrink-0">
            <Plus className="mr-2 h-4 w-4" /> Tambah Fasilitas
          </Button>
        </div>

        <Dialog open={isOpen} onOpenChange={setIsOpen}>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>{editId ? 'Edit Fasilitas' : 'Tambah Fasilitas Baru'}</DialogTitle>
            </DialogHeader>
            <form onSubmit={handleSubmit} className="space-y-4 pt-4">
              <div className="space-y-2">
                <Label>Nama Fasilitas</Label>
                <Input 
                  required
                  value={formData.name}
                  onChange={(e) => setFormData({ name: e.target.value })}
                  placeholder="Misal: AC, WiFi, Kasur"
                />
              </div>
              <Button type="submit" className="w-full">
                {editId ? 'Simpan Perubahan' : 'Tambah Fasilitas'}
              </Button>
            </form>
          </DialogContent>
        </Dialog>
      </div>

      <div className="rounded-md border bg-card">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead className="w-[50px]">No.</TableHead>
              <TableHead>Nama Fasilitas</TableHead>
              <TableHead className="text-right">Aksi</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {filteredFacilities.map((facility, idx) => (
              <TableRow key={facility.id}>
                <TableCell className="font-medium">{idx + 1}</TableCell>
                <TableCell>{facility.name}</TableCell>
                <TableCell className="text-right space-x-2">
                  <Button variant="ghost" size="icon" title="Edit" onClick={() => handleOpenEdit(facility)}>
                    <Edit className="h-4 w-4" />
                  </Button>
                  <Button 
                    variant="ghost" 
                    size="icon" 
                    className="text-destructive hover:text-destructive hover:bg-destructive/10" 
                    title="Hapus"
                    onClick={() => handleDelete(facility.id)}
                  >
                    <Trash2 className="h-4 w-4" />
                  </Button>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>
    </div>
  );
}
