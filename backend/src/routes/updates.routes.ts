import { Router } from 'express';
import { prisma } from '../server';
import { protect } from '../middleware/auth.middleware';
import { AppError } from '../utils/AppError';
import slugify from '../utils/slugify';

const router = Router();

router.get('/', async (req, res, next) => {
  try {
    const { published = 'true', category, page = '1', limit = '10' } = req.query as any;
    const pageNum = parseInt(page);
    const limitNum = parseInt(limit);
    const where: any = {};
    if (published === 'true') where.isPublished = true;
    if (category) where.category = category;

    const [updates, total] = await Promise.all([
      prisma.companyUpdate.findMany({
        where, skip: (pageNum - 1) * limitNum, take: limitNum,
        orderBy: { createdAt: 'desc' },
        select: { id: true, title: true, slug: true, excerpt: true, category: true, imageUrl: true, publishedAt: true, author: true, views: true },
      }),
      prisma.companyUpdate.count({ where }),
    ]);
    res.json({ success: true, data: updates, pagination: { page: pageNum, limit: limitNum, total, pages: Math.ceil(total / limitNum) } });
  } catch (error) { next(error); }
});

router.get('/:slug', async (req, res, next) => {
  try {
    const update = await prisma.companyUpdate.findUnique({ where: { slug: req.params.slug } });
    if (!update) return next(new AppError('Update not found', 404));
    await prisma.companyUpdate.update({ where: { id: update.id }, data: { views: { increment: 1 } } });
    res.json({ success: true, data: update });
  } catch (error) { next(error); }
});

router.use(protect);

router.post('/', async (req, res, next) => {
  try {
    const slug = slugify(req.body.title) + '-' + Date.now();
    const update = await prisma.companyUpdate.create({
      data: { ...req.body, slug, publishedAt: req.body.isPublished ? new Date() : null },
    });
    res.status(201).json({ success: true, data: update });
  } catch (error) { next(error); }
});

router.put('/:id', async (req, res, next) => {
  try {
    const update = await prisma.companyUpdate.update({ where: { id: req.params.id }, data: req.body });
    res.json({ success: true, data: update });
  } catch (error) { next(error); }
});

router.delete('/:id', async (req, res, next) => {
  try {
    await prisma.companyUpdate.delete({ where: { id: req.params.id } });
    res.json({ success: true, message: 'Update deleted' });
  } catch (error) { next(error); }
});

export default router;
