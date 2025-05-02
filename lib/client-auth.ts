// lib/client-auth.ts
'use client';

import {
  getCurrentUser,
  removeAuthCookie,
  setAuthCookie
} from './auth-service';
import { User, createToken } from './auth-utils';

// Hardcoded admin credentials for demo
const ADMIN_EMAIL = process.env.NEXT_PUBLIC_ADMIN_EMAIL;
const ADMIN_PASSWORD = process.env.NEXT_PUBLIC_ADMIN_PASSWORD;

// Login function
export const login = async (
  email: string,
  password: string
): Promise<User | null> => {
  await new Promise((resolve) => setTimeout(resolve, 500)); // simulate delay

  if (email === ADMIN_EMAIL && password === ADMIN_PASSWORD) {
    const user = { email, isAdmin: true };
    const token = await createToken(user);

    await setAuthCookie(token);

    return user;
  }

  return null;
};

// Logout function
export const logout = async () => {
  removeAuthCookie();
};

// Check if user is authenticated
export const isAuthenticated = (): boolean => {
  return getCurrentUser() !== null;
};

// Check if user is admin
export const isAdmin = (): boolean => {
  const user = getCurrentUser();
  return !!user?.isAdmin;
};
