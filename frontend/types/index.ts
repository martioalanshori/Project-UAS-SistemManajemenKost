export type Role = 'Admin' | 'Tenant' | 'Guest';

export interface User {
  id: string;
  role: Role;
  fullname: string;
  email: string;
  phone: string;
  avatar?: string;
}

export type RoomStatus = 'Kosong' | 'Dipesan' | 'Terisi';

export interface Facility {
  id: string;
  name: string;
  icon?: string;
}

export interface Room {
  id: string;
  room_number: string;
  price: number;
  description: string;
  status: RoomStatus;
  image: string;
  facilities: Facility[];
}

export type ApplicationStatus = 'Pending' | 'Approved' | 'Rejected';

export interface RentalApplication {
  id: string;
  user_id: string;
  room_id: string;
  start_date: string; // ISO date string
  duration: number; // in months
  ktp_image: string;
  status: ApplicationStatus;
  created_at: string;
  user?: User;
  room?: Room;
}

export interface Tenant {
  id: string;
  application_id: string;
  room_id: string;
  user_id: string;
  check_in: string;
  status?: string;
  user?: User;
  room?: Room;
  application?: RentalApplication;
}

export type PaymentStatus = 'Belum Bayar' | 'Menunggu Verifikasi' | 'Lunas' | 'Ditolak';

export interface Payment {
  id: string;
  tenant_id: string;
  amount: number;
  payment_date?: string;
  proof_image?: string;
  status: PaymentStatus;
  month_for: string; // e.g. "2024-05"
  tenant?: Tenant;
}

export interface Notification {
  id: string;
  user_id: string;
  title: string;
  message: string;
  is_read: boolean;
  created_at: string;
  user?: User;
}

export interface Expense {
  id: string;
  description: string;
  category: string;
  amount: number;
  expense_date: string;
  created_at: string;
}
