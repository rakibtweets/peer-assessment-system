// lib/server-auth.ts
'use server';

import { cookies } from 'next/headers';
import { redirect } from 'next/navigation';
import { User, verifyToken } from './auth-utils';

// Get current user from cookie on the server
export const getCurrentUser = async (): Promise<User | null> => {
  const cookieStore = await cookies();
  const token = cookieStore.get('auth-token')?.value;

  if (!token) return null;

  return verifyToken(token);
};

// Check if user is authenticated
export const isAuthenticated = (): boolean => {
  return getCurrentUser() !== null;
};

// Check if user is admin
export const isAdmin = async (): Promise<boolean> => {
  const user = await getCurrentUser();
  return !!user?.isAdmin;
};

// Middleware to protect admin routes
export const requireAdmin = () => {
  if (!isAdmin()) {
    redirect('/sign-in?callbackUrl=/admin');
  }
};

export const setAuthCookie = (token: string): void => {
  cookies().set('auth-token', token, {
    httpOnly: true,
    secure: process.env.NODE_ENV === 'production',
    sameSite: 'lax',
    maxAge: 7 * 24 * 60 * 60 // 7 days
  });
};

// Remove auth cookie
export const removeAuthCookie = (): void => {
  cookies().delete('auth-token');
};
