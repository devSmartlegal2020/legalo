import { Response, NextFunction } from 'express';
import jwt from 'jsonwebtoken';
import { AuthRequest, JWTPayload } from '../types';
import { User } from '../models';
import { isBlacklisted } from '../utils/tokenBlacklist';

const JWT_SECRET = process.env.JWT_SECRET;

if (!JWT_SECRET && process.env.NODE_ENV === 'production') {
  throw new Error('JWT_SECRET environment variable is required in production');
}

const secret = JWT_SECRET || 'development-only-secret-change-in-production';

export const authenticate = async (
  req: AuthRequest,
  res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    const authHeader = req.header('Authorization');
    const queryToken = req.query.token as string;
    const token = authHeader?.replace('Bearer ', '') || queryToken;

    if (!token) {
      res.status(401).json({ message: 'No token, authorization denied' });
      return;
    }

    // Check if token is blacklisted (logged out)
    if (isBlacklisted(token)) {
      res.status(401).json({ message: 'Token has been revoked' });
      return;
    }

    try {
      const decoded = jwt.verify(token, secret) as JWTPayload;
      const user = await User.findById(decoded.userId).select('-password');
      
      if (!user || !user.isActive) {
        res.status(401).json({ message: 'Token is not valid' });
        return;
      }

      req.user = user;
      next();
    } catch (jwtError) {
      res.status(401).json({ message: 'Token is not valid' });
    }
  } catch (error) {
    res.status(401).json({ message: 'Token is not valid' });
  }
};

export const authorize = (...roles: string[]) => {
  return (req: AuthRequest, res: Response, next: NextFunction): void => {
    if (!req.user) {
      res.status(401).json({ message: 'Authorization required' });
      return;
    }

    if (!roles.includes(req.user.role)) {
      res.status(403).json({ message: 'Access denied. Insufficient permissions' });
      return;
    }

    next();
  };
};
