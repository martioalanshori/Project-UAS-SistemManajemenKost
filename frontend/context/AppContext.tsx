'use client';

import React, { createContext, useContext, useState, useEffect } from 'react';
import Swal from 'sweetalert2';
import api from '@/lib/api';
import { User, Room, RentalApplication, Tenant, Payment, Notification, Facility, Expense } from '../types';

interface AppState {
  currentUser: User | null;
  rooms: Room[];
  applications: RentalApplication[];
  tenants: Tenant[];
  payments: Payment[];
  notifications: Notification[];
  facilities: Facility[];
  expenses: Expense[];
}

interface AppContextType extends AppState {
  login: (email: string, password: string) => Promise<void>;
  logout: () => void;
  addApplication: (app: Omit<RentalApplication, 'id' | 'created_at' | 'status'>) => Promise<void>;
  approveApplication: (id: string) => Promise<void>;
  rejectApplication: (id: string) => Promise<void>;
  addPayment: (payment: Omit<Payment, 'id' | 'status'>) => Promise<void>;
  verifyPayment: (id: string) => Promise<void>;
  markNotificationAsRead: (id: string) => Promise<void>;
  addRoom: (room: Omit<Room, 'id'>) => Promise<void>;
  updateRoom: (id: string, room: Partial<Room>) => Promise<void>;
  deleteRoom: (id: string) => Promise<void>;
  
  addFacility: (facility: Omit<Facility, 'id'>) => Promise<void>;
  updateFacility: (id: string, facility: Partial<Facility>) => Promise<void>;
  deleteFacility: (id: string) => Promise<void>;

  updatePayment: (id: string, paymentData: Partial<Payment>) => Promise<void>;
  rejectPayment: (id: string) => Promise<void>;
  checkoutTenant: (id: string) => Promise<void>;
  updateProfile: (id: string, data: any) => Promise<void>;

  addExpense: (expense: Omit<Expense, 'id' | 'created_at'>) => Promise<void>;
  updateExpense: (id: string, expense: Partial<Expense>) => Promise<void>;
  deleteExpense: (id: string) => Promise<void>;
}

const AppContext = createContext<AppContextType | undefined>(undefined);

export function AppProvider({ children }: { children: React.ReactNode }) {
  const [state, setState] = useState<AppState>({
    currentUser: null,
    rooms: [],
    applications: [],
    tenants: [],
    payments: [],
    notifications: [],
    facilities: [],
    expenses: [],
  });

  const fetchData = async (user?: User) => {
    try {
      let activeUser = user;
      if (!activeUser && typeof window !== 'undefined') {
        const userStr = localStorage.getItem('user');
        if (userStr) {
          try { activeUser = JSON.parse(userStr); } catch(e) {}
        }
      }
      const isAuth = !!activeUser || !!localStorage.getItem('token');
      const safeGet = (url: string) => api.get(url).catch(err => {
        return { data: [] };
      });

      const requests: Promise<any>[] = [
        safeGet(`/rooms`),
        safeGet(`/facilities`),
      ];
      
      if (isAuth) {
        requests.push(
          safeGet(`/applications`),
          safeGet(`/tenants`),
          safeGet(`/payments`),
          safeGet(`/notifications`)
        );
        if (activeUser?.role === 'Admin') {
          requests.push(safeGet(`/expenses`));
        } else {
          requests.push(Promise.resolve({ data: [] }));
        }
      } else {
        requests.push(Promise.resolve({ data: [] }), Promise.resolve({ data: [] }), Promise.resolve({ data: [] }), Promise.resolve({ data: [] }), Promise.resolve({ data: [] }));
      }

      const [roomsRes, facilitiesRes, appsRes, tenantsRes, paymentsRes, notificationsRes, expensesRes] = await Promise.all(requests);

      setState(prev => ({
        ...prev,
        rooms: roomsRes.data || [],
        facilities: facilitiesRes.data || [],
        applications: appsRes.data || [],
        tenants: tenantsRes.data || [],
        payments: paymentsRes.data || [],
        notifications: notificationsRes.data || [],
        expenses: expensesRes.data || [],
      }));
    } catch (error) {
      console.error('Failed to fetch data', error);
    }
  };

  useEffect(() => {
    let currentUser: User | undefined;
    const token = localStorage.getItem('token');
    const userStr = localStorage.getItem('user');
    if (token && userStr) {
      try {
        currentUser = JSON.parse(userStr);
        setState(prev => ({ ...prev, currentUser: currentUser as User }));
      } catch (e) {
        console.error(e);
      }
    }
    fetchData(currentUser);
  }, []);

  const login = async (email: string, password: string) => {
    const res = await api.post(`/auth/login`, { email, password });
    localStorage.setItem('token', res.data.token);
    localStorage.setItem('user', JSON.stringify(res.data.user));
    setState(prev => ({ ...prev, currentUser: res.data.user }));
  };

  const logout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    setState(prev => ({ ...prev, currentUser: null }));
  };

  const addApplication = async (appData: Omit<RentalApplication, 'id' | 'created_at' | 'status'>) => {
    try {
      await api.post(`/applications`, appData);
      await fetchData();
    } catch (error) {
      console.error(error);
      throw error;
    }
  };

  const approveApplication = async (id: string) => {
    try {
      await api.put(`/applications/${id}`, { status: 'Approved' });
      const app = state.applications.find(a => a.id === id);
      if (app) {
        await api.post(`/tenants`, {
          application_id: app.id,
          room_id: app.room_id,
          user_id: app.user_id,
          check_in: new Date().toISOString()
        });
      }
      await fetchData();
    } catch (error) {
      console.error(error);
      throw error;
    }
  };

  const rejectApplication = async (id: string) => {
    try {
      await api.put(`/applications/${id}`, { status: 'Rejected' });
      await fetchData();
    } catch (error) {
      console.error(error);
      throw error;
    }
  };

  const addPayment = async (paymentData: Omit<Payment, 'id' | 'status'>) => {
    try {
      await api.post(`/payments`, paymentData);
      await fetchData();
    } catch (error) {
      console.error(error);
      throw error;
    }
  };

  const verifyPayment = async (id: string) => {
    try {
      await api.put(`/payments/${id}`, { status: 'Lunas' });
      await fetchData();
    } catch (error) {
      console.error(error);
      throw error;
    }
  };

  const updatePayment = async (id: string, paymentData: Partial<Payment>) => {
    try {
      await api.put(`/payments/${id}`, paymentData);
      await fetchData();
    } catch (error) {
      console.error(error);
      throw error;
    }
  };

  const rejectPayment = async (id: string) => {
    try {
      await api.put(`/payments/${id}`, { status: 'Ditolak' });
      await fetchData();
    } catch (error) {
      console.error(error);
      throw error;
    }
  };

  const markNotificationAsRead = async (id: string) => {
    try {
      await api.put(`/notifications/${id}`);
      await fetchData();
    } catch (error) {
      console.error(error);
      throw error;
    }
  };

  const checkoutTenant = async (id: string) => {
    try {
      await api.delete(`/tenants/${id}`);
      await fetchData();
    } catch (error) {
      console.error(error);
      throw error;
    }
  };

  const addRoom = async (room: Omit<Room, 'id'>) => {
    try {
      await api.post(`/rooms`, room);
      await fetchData();
    } catch (error) {
      console.error(error);
      throw error;
    }
  };

  const updateRoom = async (id: string, roomData: Partial<Room>) => {
    try {
      await api.put(`/rooms/${id}`, roomData);
      await fetchData();
    } catch (error) {
      console.error(error);
      throw error;
    }
  };

  const deleteRoom = async (id: string) => {
    try {
      await api.delete(`/rooms/${id}`);
      await fetchData();
    } catch (error) {
      console.error(error);
      throw error;
    }
  };

  const addFacility = async (facility: Omit<Facility, 'id'>) => {
    try {
      await api.post(`/facilities`, facility);
      await fetchData();
    } catch (error) {
      console.error(error);
      throw error;
    }
  };

  const updateFacility = async (id: string, facilityData: Partial<Facility>) => {
    try {
      await api.put(`/facilities/${id}`, facilityData);
      await fetchData();
    } catch (error) {
      console.error(error);
      throw error;
    }
  };
  
  const deleteFacility = async (id: string) => {
    try {
      await api.delete(`/facilities/${id}`);
      await fetchData();
    } catch (error) {
      console.error(error);
      throw error;
    }
  };

  const updateProfile = async (id: string, data: Partial<User>) => {
    try {
      const res = await api.put(`/users/${id}`, data);
      const updatedUser = res.data;
      setState(prev => ({ ...prev, currentUser: updatedUser }));
      localStorage.setItem('user', JSON.stringify(updatedUser));
    } catch (error) {
      console.error(error);
      throw error;
    }
  };

  const addExpense = async (expense: Omit<Expense, 'id' | 'created_at'>) => {
    try {
      await api.post(`/expenses`, expense);
      await fetchData();
    } catch (error) {
      console.error(error);
      throw error;
    }
  };

  const updateExpense = async (id: string, expense: Partial<Expense>) => {
    try {
      await api.put(`/expenses/${id}`, expense);
      await fetchData();
    } catch (error) {
      console.error(error);
      throw error;
    }
  };
  
  const deleteExpense = async (id: string) => {
    try {
      await api.delete(`/expenses/${id}`);
      await fetchData();
    } catch (error) {
      console.error(error);
      throw error;
    }
  };

  return (
    <AppContext.Provider value={{
      ...state,
      login, logout, addApplication, approveApplication, rejectApplication, addPayment, updatePayment, verifyPayment, markNotificationAsRead,
      addRoom, updateRoom, deleteRoom, addFacility, updateFacility, deleteFacility, rejectPayment, checkoutTenant, updateProfile,
      addExpense, updateExpense, deleteExpense
    }}>
      {children}
    </AppContext.Provider>
  );
}

export function useAppContext() {
  const context = useContext(AppContext);
  if (context === undefined) {
    throw new Error('useAppContext must be used within an AppProvider');
  }
  return context;
}
