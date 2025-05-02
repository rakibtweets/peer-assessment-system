'use client';

import type React from 'react';
import { createContext, useContext, useEffect, useState } from 'react';
import { getCurrentUser } from '@/lib/auth-service';
import { useRouter } from 'next/navigation';
import { User } from '@/lib/auth-utils';
import { login, logout } from '@/lib/client-auth';

type AuthContextType = {
  user: User | null;
  isLoading: boolean;
  isAuthenticated: boolean;
  isAdmin: boolean;
  login: (email: string, password: string) => Promise<boolean>;
  logout: () => void;
};

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider = ({ children }: { children: React.ReactNode }) => {
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const router = useRouter();

  useEffect(() => {
    const fetchUser = async () => {
      const currentUser = await getCurrentUser();
      setUser(currentUser);
      setIsLoading(false);
    };

    fetchUser();
  }, []);

  const handleLogin = async (
    email: string,
    password: string
  ): Promise<boolean> => {
    setIsLoading(true);
    const user = await login(email, password);
    setIsLoading(false);

    if (user) {
      setUser(user);
      return true;
    }

    return false;
  };

  const handleLogout = () => {
    logout();
    setUser(null);
    router.push('/sign-in');
  };

  const value = {
    user,
    isLoading,
    isAuthenticated: !!user,
    isAdmin: user?.isAdmin ?? false,
    login: handleLogin,
    logout: handleLogout
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};
