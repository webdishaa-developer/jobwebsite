import { Request, Response, NextFunction } from 'express';
import jwt from 'jsonwebtoken';
import { prisma } from '../server';
import { AppError } from '../utils/AppError';

export interface AuthRequest extends Request {
  admin?: {
    id: string;
    email: string;
    role: string;
    name: string;
  };
}

export const protect = async (req: AuthRequest, _res: Response, next: NextFunction) => {
  try {
    let token: string | undefined;

    // Get token from header or cookie
    if (req.headers.authorization?.startsWith('Bearer ')) {
      token = req.headers.authorization.split(' ')[1];
    } else if (req.cookies?.token) {
      token = req.cookies.token;
    }

    if (!token) {
      return next(new AppError('Authentication required. Please log in.', 401));
    }

    // Verify token
    const decoded = jwt.verify(token, process.env.JWT_SECRET!) as { id: string; email: string };

    // Check if admin still exists and is active
    const admin = await prisma.admin.findUnique({
      where: { id: decoded.id, isActive: true },
      select: { id: true, email: true, role: true, name: true, isActive: true },
    });

    if (!admin) {
      return next(new AppError('The admin account no longer exists or has been deactivated.', 401));
    }

    req.admin = {
      id: admin.id,
      email: admin.email,
      role: admin.role,
      name: admin.name,
    };

    next();
  } catch (error: any) {
    if (error.name === 'JsonWebTokenError') {
      return next(new AppError('Invalid token. Please log in again.', 401));
    }
    if (error.name === 'TokenExpiredError') {
      return next(new AppError('Your session has expired. Please log in again.', 401));
    }
    next(error);
  }
};

export const restrictTo = (...roles: string[]) => {
  return (req: AuthRequest, _res: Response, next: NextFunction) => {
    if (!req.admin || !roles.includes(req.admin.role)) {
      return next(new AppError('You do not have permission to perform this action.', 403));
    }
    next();
  };
};

export const generateToken = (id: string, email: string): string => {
  return jwt.sign({ id, email }, process.env.JWT_SECRET!, {
    expiresIn: process.env.JWT_EXPIRES_IN || '7d',
  } as jwt.SignOptions);
};

export const generateRefreshToken = (id: string): string => {
  return jwt.sign({ id }, process.env.JWT_REFRESH_SECRET!, {
    expiresIn: process.env.JWT_REFRESH_EXPIRES_IN || '30d',
  } as jwt.SignOptions);
};
