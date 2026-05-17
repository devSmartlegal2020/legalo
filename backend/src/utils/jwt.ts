import jwt from 'jsonwebtoken';
import { JWTPayload } from '../types';

const JWT_SECRET = process.env.JWT_SECRET;
if (!JWT_SECRET && process.env.NODE_ENV === 'production') {
  throw new Error('JWT_SECRET environment variable is required in production');
}

const secret = JWT_SECRET || 'development-only-secret-change-in-production';

export const generateToken = (payload: JWTPayload): string => {
  return jwt.sign(payload, secret, { expiresIn: (process.env.JWT_EXPIRE || '1d') as any });
};

export const verifyToken = (token: string): JWTPayload => {
  return jwt.verify(token, secret) as JWTPayload;
};

export const decodeToken = (token: string): JWTPayload | null => {
  try {
    return jwt.decode(token) as JWTPayload;
  } catch {
    return null;
  }
};
