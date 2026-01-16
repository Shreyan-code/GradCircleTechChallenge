'use client';

import React, { createContext, useContext, useEffect, ReactNode } from 'react';
import { useRouter, usePathname } from 'next/navigation';
import {
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
  signOut,
  sendPasswordResetEmail,
  updateProfile,
  User as FirebaseUser,
} from 'firebase/auth';
import { doc, setDoc, getDoc } from 'firebase/firestore';
import { auth, db } from '@/lib/firebase';
import { useAuthState } from 'react-firebase-hooks/auth';
import type { User } from '@/lib/types';

interface AuthContextType {
  user: User | null;
  login: (email: string, pass: string) => Promise<boolean>;
  logout: () => void;
  signup: (email: string, pass: string, displayName: string) => Promise<void>;
  forgotPassword: (email: string) => Promise<void>;
  loading: boolean;
  firebaseUser: FirebaseUser | null | undefined;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: ReactNode }) {
  const [firebaseUser, loading] = useAuthState(auth);
  const [user, setUser] = React.useState<User | null>(null);
  const router = useRouter();
  const pathname = usePathname();

  useEffect(() => {
    const getUserProfile = async (firebaseUser: FirebaseUser) => {
      const userDoc = await getDoc(doc(db, 'users', firebaseUser.uid));
      if (userDoc.exists()) {
        setUser(userDoc.data() as User);
      } else {
        // If the user exists in Firebase Auth but not in Firestore,
        // it's likely a new signup. The user profile will be created
        // during the signup process.
      }
    };

    if (firebaseUser) {
      getUserProfile(firebaseUser);
    } else {
      setUser(null);
    }
  }, [firebaseUser]);

  useEffect(() => {
    if (!loading && !firebaseUser && !['/login', '/signup', '/', '/forgot-password'].includes(pathname)) {
      router.push('/login');
    }
    if (!loading && firebaseUser && ['/login', '/signup', '/', '/forgot-password'].includes(pathname)) {
      router.push('/feed');
    }
  }, [firebaseUser, loading, pathname, router]);

  const login = async (email: string, pass: string) => {
    await signInWithEmailAndPassword(auth, email, pass);
    return true;
  };

  const logout = () => {
    signOut(auth);
  };

  const signup = async (email: string, pass: string, displayName: string) => {
    const userCredential = await createUserWithEmailAndPassword(auth, email, pass);
    const { user: firebaseUser } = userCredential;

    if (firebaseUser) {
      await updateProfile(firebaseUser, {
        displayName,
        photoURL: `https://picsum.photos/seed/${displayName.replace(/\s/g, '')}/400/400`,
      });

      const newUser: User = {
        userId: firebaseUser.uid,
        email: firebaseUser.email!,
        displayName: firebaseUser.displayName!,
        photoURL: firebaseUser.photoURL!,
        location: { city: 'Unknown', state: '', country: 'India' },
        bio: '',
        joinedAt: new Date().toISOString(),
        postCount: 0,
        petCount: 0,
        followers: 0,
        following: 0,
        petIds: [],
      };

      await setDoc(doc(db, 'users', firebaseUser.uid), newUser);
      setUser(newUser);
    }
  };

  const forgotPassword = async (email: string) => {
    await sendPasswordResetEmail(auth, email);
  };

  const value = { user, firebaseUser, login, logout, signup, forgotPassword, loading };

  return (
    <AuthContext.Provider value={value}>
      {!loading ? children : null}
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
