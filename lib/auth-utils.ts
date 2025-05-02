'use server';
//auth-utils.ts
import jwt from 'jsonwebtoken';

const SECRET_KEY = process.env.NEXT_PUBLIC_JWT_SECRET as string;

if (!SECRET_KEY) {
  throw new Error('JWT_SECRET environment variable is not defined');
}

// Types
export type User = {
  email: string;
  isAdmin: boolean;
};

// Create a JWT token
export const createToken = async (user: User): Promise<string> => {
  const token = jwt.sign(user, SECRET_KEY, {
    expiresIn: '7d'
  });

  return token;
};

// Verify a JWT token
export const verifyToken = (token: string): User | null => {
  try {
    const decoded = jwt.verify(token, SECRET_KEY) as User;
    return decoded;
  } catch (error) {
    return null;
  }
};
