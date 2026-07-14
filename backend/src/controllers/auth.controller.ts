import { Request, Response, NextFunction } from 'express';
import bcrypt from 'bcryptjs';
import { prisma } from '../server';
import { AppError } from '../utils/AppError';
import { generateToken, generateRefreshToken, AuthRequest } from '../middleware/auth.middleware';

export const login = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      return next(new AppError('Email and password are required', 400));
    }

    const admin = await prisma.admin.findUnique({
      where: { email: email.toLowerCase() },
    });

    if (!admin || !admin.isActive) {
      return next(new AppError('Invalid credentials', 401));
    }

    const isPasswordValid = await bcrypt.compare(password, admin.password);
    if (!isPasswordValid) {
      return next(new AppError('Invalid credentials', 401));
    }

    const token = generateToken(admin.id, admin.email);
    const refreshToken = generateRefreshToken(admin.id);

    // Update last login and refresh token
    await prisma.admin.update({
      where: { id: admin.id },
      data: {
        lastLogin: new Date(),
        refreshToken,
      },
    });

    // Set HTTP-only cookie
    res.cookie('token', token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'strict',
      maxAge: 7 * 24 * 60 * 60 * 1000, // 7 days
    });

    res.json({
      success: true,
      message: 'Login successful',
      data: {
        token,
        admin: {
          id: admin.id,
          email: admin.email,
          name: admin.name,
          role: admin.role,
        },
      },
    });
  } catch (error) {
    next(error);
  }
};

export const logout = async (req: AuthRequest, res: Response, next: NextFunction) => {
  try {
    if (req.admin) {
      await prisma.admin.update({
        where: { id: req.admin.id },
        data: { refreshToken: null },
      });
    }

    res.clearCookie('token');
    res.json({ success: true, message: 'Logged out successfully' });
  } catch (error) {
    next(error);
  }
};

export const getMe = async (req: AuthRequest, res: Response, next: NextFunction) => {
  try {
    const admin = await prisma.admin.findUnique({
      where: { id: req.admin!.id },
      select: {
        id: true,
        email: true,
        name: true,
        role: true,
        lastLogin: true,
        createdAt: true,
      },
    });

    res.json({ success: true, data: admin });
  } catch (error) {
    next(error);
  }
};

export const changePassword = async (req: AuthRequest, res: Response, next: NextFunction) => {
  try {
    const { currentPassword, newPassword } = req.body;

    const admin = await prisma.admin.findUnique({ where: { id: req.admin!.id } });
    if (!admin) return next(new AppError('Admin not found', 404));

    const isCurrentPasswordValid = await bcrypt.compare(currentPassword, admin.password);
    if (!isCurrentPasswordValid) {
      return next(new AppError('Current password is incorrect', 400));
    }

    if (newPassword.length < 8) {
      return next(new AppError('Password must be at least 8 characters', 400));
    }

    const hashedPassword = await bcrypt.hash(newPassword, 12);
    await prisma.admin.update({
      where: { id: admin.id },
      data: { password: hashedPassword },
    });

    res.json({ success: true, message: 'Password changed successfully' });
  } catch (error) {
    next(error);
  }
};
