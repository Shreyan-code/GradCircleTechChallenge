'use client';

import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { useRouter, usePathname } from 'next/navigation';
import { mockData } from '@/lib/mock-data';
import type { User } from '@/lib/types';

interface AuthContextType {
  user: User | null;
  login: (email: string, pass: string) => boolean;
  logout: () => void;
  signup: (email: string, pass: string, displayName: string) => Promise<void>;
  forgotPassword: (email: string, newPass: string) => Promise<void>;
  loading: boolean;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);
  const router = useRouter();
  const pathname = usePathname();

  useEffect(() => {
    try {
      const storedUser = localStorage.getItem('petconnect-user');
      if (storedUser) {
        setUser(JSON.parse(storedUser));
      }
    } catch (error) {
      console.error("Failed to parse user from localStorage", error);
      localStorage.removeItem('petconnect-user');
    } finally {
        setLoading(false);
    }
  }, []);
  
  useEffect(() => {
    if (!loading && !user && !['/login', '/signup', '/', '/forgot-password'].includes(pathname)) {
        router.push('/login');
    }
    if (!loading && user && ['/login', '/signup', '/', '/forgot-password'].includes(pathname)) {
        router.push('/feed');
    }
  }, [user, loading, pathname, router]);


  const login = (email: string, pass: string) => {
    const foundUser = mockData.users.find(u => u.email === email && u.password === pass);
    if (foundUser) {
      const userToStore = { ...foundUser };
      // Do not store password in local storage
      delete userToStore.password;
      
      localStorage.setItem('petconnect-user', JSON.stringify(userToStore));
      setUser(userToStore);
      return true;
    }
    return false;
  };

  const logout = () => {
    localStorage.removeItem('petconnect-user');
    setUser(null);
  };
  
  const signup = async (email: string, pass: string, displayName: string) => {
    if (mockData.users.some(u => u.email === email)) {
        throw new Error("An account with this email already exists.");
    }
    if (pass.length < 6) {
        throw new Error("Password must be at least 6 characters long.");
    }
    if (displayName.length < 2) {
        throw new Error("Display name must be at least 2 characters long.");
    }

    const newUser: Omit<User, 'userId'> = {
        email,
        password: pass,
        displayName,
        photoURL: `https://picsum.photos/seed/${displayName.replace(/\s/g, '')}/400/400`,
        location: { city: "Unknown", state: "", country: "India" },
        bio: "",
        joinedAt: new Date().toISOString(),
        postCount: 0,
        petCount: 0,
        followers: 0,
        following: 0,
        petIds: []
    };

    const response = await fetch('/api/signup', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(newUser),
    });

    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(errorData.message || 'Signup failed');
    }
  };

  const forgotPassword = async (email: string, newPass: string) => {
    const response = await fetch('/api/forgot-password', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ email, newPassword: newPass }),
    });

    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(errorData.message || 'Password reset failed');
    }
  }

  const value = { user, login, logout, signup, forgotPassword, loading };

  return (
    <AuthContext.Provider value={value}>
      {loading ? null : children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
}
