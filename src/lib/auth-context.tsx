'use client';

import React, { createContext, useContext, useState, useEffect, useCallback, type ReactNode } from 'react';
import {
  dbGet, dbInsert, dbFindOne, dbUpdate, dbFilter,
  dbGetValue, dbSetValue, dbRemoveValue,
  generateId, hashPassword, verifyPassword,
} from '@/lib/db';

// ─── Types ───────────────────────────────────────────────────────────────────

export interface User {
  id: string;
  email: string;
  password: string; // hashed
  firstName: string;
  lastName: string;
  phone: string;
  avatar: string;
  createdAt: string;
  addresses: Address[];
  wishlist: string[]; // product IDs
}

export interface Address {
  id: string;
  label: string;
  address: string;
  city: string;
  state: string;
  zip: string;
  country: string;
  isDefault: boolean;
}

export interface Order {
  id: string;
  userId: string;
  items: OrderItem[];
  subtotal: number;
  shipping: number;
  tax: number;
  total: number;
  status: 'pending' | 'processing' | 'shipped' | 'delivered' | 'cancelled';
  paymentMethod: string;
  shippingAddress: Omit<Address, 'id' | 'label' | 'isDefault'>;
  createdAt: string;
  updatedAt: string;
  trackingNumber?: string;
}

export interface OrderItem {
  productId: string;
  name: string;
  price: number;
  quantity: number;
  size: string;
  color: string;
  image: string;
}

interface AuthContextType {
  user: User | null;
  isLoading: boolean;
  login: (email: string, password: string) => Promise<{ success: boolean; error?: string }>;
  register: (data: RegisterData) => Promise<{ success: boolean; error?: string }>;
  logout: () => void;
  updateProfile: (updates: Partial<Pick<User, 'firstName' | 'lastName' | 'phone' | 'avatar'>>) => void;
  changePassword: (current: string, newPass: string) => Promise<{ success: boolean; error?: string }>;
  addAddress: (address: Omit<Address, 'id'>) => void;
  removeAddress: (addressId: string) => void;
  setDefaultAddress: (addressId: string) => void;
  toggleWishlist: (productId: string) => void;
  isInWishlist: (productId: string) => boolean;
  orders: Order[];
  placeOrder: (order: Omit<Order, 'id' | 'userId' | 'createdAt' | 'updatedAt' | 'status'>) => Order;
}

interface RegisterData {
  email: string;
  password: string;
  firstName: string;
  lastName: string;
}

const USERS_COLLECTION = 'users';
const ORDERS_COLLECTION = 'orders';
const SESSION_KEY = 'session_user_id';

// ─── Context ─────────────────────────────────────────────────────────────────

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [orders, setOrders] = useState<Order[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  // Restore session on mount
  useEffect(() => {
    const userId = dbGetValue<string>(SESSION_KEY);
    if (userId) {
      const stored = dbFindOne<User>(USERS_COLLECTION, u => u.id === userId);
      if (stored) {
        setUser(stored);
        setOrders(dbFilter<Order>(ORDERS_COLLECTION, o => o.userId === userId));
      } else {
        dbRemoveValue(SESSION_KEY);
      }
    }
    setIsLoading(false);
  }, []);

  // ─── Auth Methods ──────────────────────────────────────────────────────────

  const login = useCallback(async (email: string, password: string) => {
    const normalizedEmail = email.toLowerCase().trim();
    const found = dbFindOne<User>(USERS_COLLECTION, u => u.email === normalizedEmail);

    if (!found) {
      return { success: false, error: 'No account found with this email' };
    }

    if (!verifyPassword(password, found.password)) {
      return { success: false, error: 'Incorrect password' };
    }

    setUser(found);
    dbSetValue(SESSION_KEY, found.id);
    setOrders(dbFilter<Order>(ORDERS_COLLECTION, o => o.userId === found.id));
    return { success: true };
  }, []);

  const register = useCallback(async (data: RegisterData) => {
    const normalizedEmail = data.email.toLowerCase().trim();

    // Check if email already exists
    const existing = dbFindOne<User>(USERS_COLLECTION, u => u.email === normalizedEmail);
    if (existing) {
      return { success: false, error: 'An account with this email already exists' };
    }

    // Validate
    if (data.password.length < 6) {
      return { success: false, error: 'Password must be at least 6 characters' };
    }

    const newUser: User = {
      id: generateId(),
      email: normalizedEmail,
      password: hashPassword(data.password),
      firstName: data.firstName.trim(),
      lastName: data.lastName.trim(),
      phone: '',
      avatar: '',
      createdAt: new Date().toISOString(),
      addresses: [],
      wishlist: [],
    };

    dbInsert(USERS_COLLECTION, newUser);
    setUser(newUser);
    dbSetValue(SESSION_KEY, newUser.id);
    setOrders([]);
    return { success: true };
  }, []);

  const logout = useCallback(() => {
    setUser(null);
    setOrders([]);
    dbRemoveValue(SESSION_KEY);
  }, []);

  // ─── Profile Methods ──────────────────────────────────────────────────────

  const updateProfile = useCallback((updates: Partial<Pick<User, 'firstName' | 'lastName' | 'phone' | 'avatar'>>) => {
    if (!user) return;
    const updated = dbUpdate<User>(USERS_COLLECTION, user.id, updates);
    if (updated) setUser(updated);
  }, [user]);

  const changePassword = useCallback(async (current: string, newPass: string) => {
    if (!user) return { success: false, error: 'Not logged in' };

    if (!verifyPassword(current, user.password)) {
      return { success: false, error: 'Current password is incorrect' };
    }

    if (newPass.length < 6) {
      return { success: false, error: 'New password must be at least 6 characters' };
    }

    const updated = dbUpdate<User>(USERS_COLLECTION, user.id, { password: hashPassword(newPass) });
    if (updated) setUser(updated);
    return { success: true };
  }, [user]);

  // ─── Address Methods ──────────────────────────────────────────────────────

  const addAddress = useCallback((address: Omit<Address, 'id'>) => {
    if (!user) return;
    const newAddress: Address = { ...address, id: generateId() };
    const addresses = [...user.addresses, newAddress];
    // If it's marked default, unset others
    if (newAddress.isDefault) {
      addresses.forEach(a => { if (a.id !== newAddress.id) a.isDefault = false; });
    }
    const updated = dbUpdate<User>(USERS_COLLECTION, user.id, { addresses });
    if (updated) setUser(updated);
  }, [user]);

  const removeAddress = useCallback((addressId: string) => {
    if (!user) return;
    const addresses = user.addresses.filter(a => a.id !== addressId);
    const updated = dbUpdate<User>(USERS_COLLECTION, user.id, { addresses });
    if (updated) setUser(updated);
  }, [user]);

  const setDefaultAddress = useCallback((addressId: string) => {
    if (!user) return;
    const addresses = user.addresses.map(a => ({ ...a, isDefault: a.id === addressId }));
    const updated = dbUpdate<User>(USERS_COLLECTION, user.id, { addresses });
    if (updated) setUser(updated);
  }, [user]);

  // ─── Wishlist Methods ──────────────────────────────────────────────────────

  const toggleWishlist = useCallback((productId: string) => {
    if (!user) return;
    const wishlist = user.wishlist.includes(productId)
      ? user.wishlist.filter(id => id !== productId)
      : [...user.wishlist, productId];
    const updated = dbUpdate<User>(USERS_COLLECTION, user.id, { wishlist });
    if (updated) setUser(updated);
  }, [user]);

  const isInWishlist = useCallback((productId: string) => {
    return user?.wishlist.includes(productId) ?? false;
  }, [user]);

  // ─── Order Methods ────────────────────────────────────────────────────────

  const placeOrder = useCallback((orderData: Omit<Order, 'id' | 'userId' | 'createdAt' | 'updatedAt' | 'status'>) => {
    const order: Order = {
      ...orderData,
      id: `ORD-${Date.now().toString(36).toUpperCase()}`,
      userId: user?.id ?? 'guest',
      status: 'pending',
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };
    dbInsert(ORDERS_COLLECTION, order);
    setOrders(prev => [order, ...prev]);
    return order;
  }, [user]);

  return (
    <AuthContext.Provider value={{
      user,
      isLoading,
      login,
      register,
      logout,
      updateProfile,
      changePassword,
      addAddress,
      removeAddress,
      setDefaultAddress,
      toggleWishlist,
      isInWishlist,
      orders,
      placeOrder,
    }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (!context) throw new Error('useAuth must be used within an AuthProvider');
  return context;
}
