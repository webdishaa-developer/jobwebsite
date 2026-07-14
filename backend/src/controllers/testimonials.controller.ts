import { Request, Response, NextFunction } from 'express';
import { prisma } from '../server';
import { AppError } from '../utils/AppError';

export const getAllTestimonials = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const { featured, active = 'true' } = req.query as Record<string, string>;
    const where: any = {};
    if (active === 'true') where.isActive = true;
    if (featured === 'true') where.isFeatured = true;

    const testimonials = await prisma.testimonial.findMany({
      where,
      orderBy: [{ isFeatured: 'desc' }, { createdAt: 'desc' }],
    });

    res.json({ success: true, data: testimonials });
  } catch (error) {
    next(error);
  }
};

export const createTestimonial = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const testimonial = await prisma.testimonial.create({ data: req.body });
    res.status(201).json({ success: true, data: testimonial, message: 'Testimonial created' });
  } catch (error) {
    next(error);
  }
};

export const updateTestimonial = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const { id } = req.params;
    const existing = await prisma.testimonial.findUnique({ where: { id } });
    if (!existing) return next(new AppError('Testimonial not found', 404));
    const testimonial = await prisma.testimonial.update({ where: { id }, data: req.body });
    res.json({ success: true, data: testimonial, message: 'Testimonial updated' });
  } catch (error) {
    next(error);
  }
};

export const deleteTestimonial = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const { id } = req.params;
    const existing = await prisma.testimonial.findUnique({ where: { id } });
    if (!existing) return next(new AppError('Testimonial not found', 404));
    await prisma.testimonial.delete({ where: { id } });
    res.json({ success: true, message: 'Testimonial deleted' });
  } catch (error) {
    next(error);
  }
};
