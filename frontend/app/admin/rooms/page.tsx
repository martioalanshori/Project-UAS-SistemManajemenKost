'use client';

import React, { useState } from 'react';
import { useAppContext } from '@/context/AppContext';
import { Button } from '@/components/ui/button';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Badge } from '@/components/ui/badge';
import { Plus, Edit, Trash2 } from 'lucide-react';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import Swal from 'sweetalert2';

export default function AdminRooms() {
  const { rooms, addRoom, updateRoom, deleteRoom, facilities } = useAppContext();
  
  const [isOpen, setIsOpen] = useState(false);
  const [editId, setEditId] = useState<string | null>(null);
  const [formData, setFormData] = useState({
    room_number: '',
    price: '',
    description: '',
    image: '',
    selectedFacilities: [] as string[],
  });

  const handleOpenNew = () => {
    setEditId(null);
    setFormData({ room_number: '', price: '', description: '', image: '', selectedFacilities: [] });
    setIsOpen(true);
  };

  const handleOpenEdit = (room: any) => {
    setEditId(room.id);
    setFormData({
      room_number: room.room_number,
      price: room.price.toString(),
      description: room.description,
      image: room.image || '',
      selectedFacilities: room.facilities?.map((f: any) => f.id) || [],
    });
    setIsOpen(true);
  };

  const handleDelete = (id: string) => {
    Swal.fire({
      title: 'Hapus Kamar?',
      text: 'Data kamar akan dihapus permanen.',
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#d33',
      confirmButtonText: 'Ya, Hapus'
    }).then(async (result) => {
      if (result.isConfirmed) {
        try {
          await deleteRoom(id);
          Swal.fire('Terhapus!', 'Kamar berhasil dihapus.', 'success');
        } catch (error: any) {
          const msg = error.response?.data?.error || 'Gagal menghapus kamar.';
          Swal.fire('Gagal', msg, 'error');
        }
      }
    });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    // Map selected IDs back to full Facility objects to store in Room
    const selectedFacilityObjects = facilities.filter(f => formData.selectedFacilities.includes(f.id));

    try {
      if (editId) {
        await updateRoom(editId, {
          room_number: formData.room_number,
          price: parseInt(formData.price),
          description: formData.description,
          image: formData.image || '/room-placeholder.svg',
          facilities: selectedFacilityObjects,
        });
        Swal.fire('Berhasil!', 'Kamar berhasil diperbarui', 'success');
      } else {
        await addRoom({
          room_number: formData.room_number,
          price: parseInt(formData.price),
          description: formData.description,
          status: 'Kosong',
          image: formData.image || '/room-placeholder.svg',
          facilities: selectedFacilityObjects,
        });
        Swal.fire('Berhasil!', 'Kamar baru berhasil ditambahkan', 'success');
      }
      setIsOpen(false);
    } catch (error: any) {
      const msg = error.response?.data?.error || 'Gagal menyimpan data kamar.';
      Swal.fire('Gagal', msg, 'error');
    }
  };

  const [searchTerm, setSearchTerm] = useState('');

  const filteredRooms = rooms.filter(room => 
    room.room_number.toLowerCase().includes(searchTerm.toLowerCase()) ||
    room.description.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Manajemen Kamar</h1>
          <p className="text-muted-foreground">Kelola data kamar kost Anda.</p>
        </div>
        
        <div className="flex items-center gap-4">
          <Input 
            type="search" 
            placeholder="Cari kamar..." 
            className="w-[200px] sm:w-[250px]"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
          <Button onClick={handleOpenNew} className="shrink-0">
            <Plus className="mr-2 h-4 w-4" /> Tambah Kamar
          </Button>
        </div>

        <Dialog open={isOpen} onOpenChange={setIsOpen}>
          <DialogContent className="max-h-[90vh] overflow-y-auto">
            <DialogHeader>
              <DialogTitle>{editId ? 'Edit Kamar' : 'Tambah Kamar Baru'}</DialogTitle>
            </DialogHeader>
            <form onSubmit={handleSubmit} className="space-y-4 pt-4">
              <div className="space-y-2">
                <Label>Nomor Kamar</Label>
                <Input 
                  required
                  value={formData.room_number}
                  onChange={(e) => setFormData({...formData, room_number: e.target.value})}
                  placeholder="Misal: 101"
                />
              </div>
              <div className="space-y-2">
                <Label>Harga per Bulan</Label>
                <Input 
                  required
                  type="text"
                  value={formData.price ? `Rp ${parseInt(formData.price.replace(/[^0-9]/g, '') || '0').toLocaleString('id-ID')}` : ''}
                  onChange={(e) => setFormData({...formData, price: e.target.value.replace(/[^0-9]/g, '')})}
                  placeholder="Misal: Rp 1.500.000"
                />
              </div>
              <div className="space-y-2">
                <Label>Deskripsi</Label>
                <Input 
                  required
                  value={formData.description}
                  onChange={(e) => setFormData({...formData, description: e.target.value})}
                  placeholder="Deskripsi singkat kamar"
                />
              </div>
              <div className="space-y-2">
                <Label>Foto Kamar</Label>
                <Input 
                  type="file"
                  accept="image/*"
                  onChange={(e) => {
                    const file = e.target.files?.[0];
                    if (file) {
                      const reader = new FileReader();
                      reader.onloadend = () => {
                        setFormData({...formData, image: reader.result as string});
                      };
                      reader.readAsDataURL(file);
                    }
                  }}
                />
                {formData.image && formData.image !== '/room-placeholder.svg' && (
                  <div className="mt-2 w-32 h-24 relative overflow-hidden rounded-md border">
                    <img src={formData.image} alt="Preview" className="object-cover w-full h-full" />
                  </div>
                )}
              </div>
              
              <div className="space-y-2">
                <Label>Fasilitas Kamar</Label>
                <div className="grid grid-cols-2 gap-2 mt-2">
                  {facilities.map((facility) => {
                    const isChecked = formData.selectedFacilities.includes(facility.id);
                    return (
                      <label key={facility.id} className="flex items-center space-x-2 border p-2 rounded-md cursor-pointer hover:bg-muted/50">
                        <input
                          type="checkbox"
                          className="rounded border-gray-300 text-primary focus:ring-primary"
                          checked={isChecked}
                          onChange={(e) => {
                            if (e.target.checked) {
                              setFormData({
                                ...formData,
                                selectedFacilities: [...formData.selectedFacilities, facility.id]
                              });
                            } else {
                              setFormData({
                                ...formData,
                                selectedFacilities: formData.selectedFacilities.filter(id => id !== facility.id)
                              });
                            }
                          }}
                        />
                        <span className="text-sm">{facility.name}</span>
                      </label>
                    );
                  })}
                </div>
                {facilities.length === 0 && (
                  <p className="text-sm text-muted-foreground">Belum ada fasilitas yang ditambahkan ke sistem.</p>
                )}
              </div>

              <Button type="submit" className="w-full mt-4">
                {editId ? 'Simpan Perubahan' : 'Tambah Kamar'}
              </Button>
            </form>
          </DialogContent>
        </Dialog>
      </div>

      <div className="rounded-md border bg-card overflow-x-auto">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead className="w-[50px]">No.</TableHead>
              <TableHead>No. Kamar</TableHead>
              <TableHead>Harga/Bulan</TableHead>
              <TableHead>Status</TableHead>
              <TableHead>Fasilitas</TableHead>
              <TableHead className="text-right">Aksi</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {filteredRooms.map((room, idx) => (
              <TableRow key={room.id}>
                <TableCell className="font-medium">{idx + 1}</TableCell>
                <TableCell className="font-medium">Kamar {room.room_number}</TableCell>
                <TableCell>Rp {room.price.toLocaleString('id-ID')}</TableCell>
                <TableCell>
                  <Badge variant={room.status === 'Kosong' ? 'default' : 'secondary'}>
                    {room.status}
                  </Badge>
                </TableCell>
                <TableCell>
                  {room.facilities?.length || 0} Fasilitas
                </TableCell>
                <TableCell className="text-right space-x-2">
                  <Button variant="ghost" size="icon" title="Edit" onClick={() => handleOpenEdit(room)}>
                    <Edit className="h-4 w-4" />
                  </Button>
                  <Button 
                    variant="ghost" 
                    size="icon" 
                    className="text-destructive hover:text-destructive hover:bg-destructive/10" 
                    title="Hapus"
                    onClick={() => handleDelete(room.id)}
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
