import { Router } from 'express';
import { prisma } from '../server';
import { protect } from '../middleware/auth.middleware';

const router = Router();
router.use(protect);

router.get('/', async (req, res, next) => {
  try {
    const { page = '1', limit = '20', search, available } = req.query as any;
    const pageNum = parseInt(page);
    const limitNum = parseInt(limit);
    const where: any = {};
    if (available === 'true') where.isAvailable = true;
    if (search) {
      where.OR = [
        { firstName: { contains: search } },
        { lastName: { contains: search } },
        { email: { contains: search } },
        { skills: { contains: search } },
      ];
    }
    const [candidates, total] = await Promise.all([
      prisma.candidate.findMany({ where, skip: (pageNum - 1) * limitNum, take: limitNum, orderBy: { createdAt: 'desc' } }),
      prisma.candidate.count({ where }),
    ]);
    res.json({ success: true, data: candidates, pagination: { page: pageNum, limit: limitNum, total, pages: Math.ceil(total / limitNum) } });
  } catch (error) { next(error); }
});

router.post('/', async (req, res, next) => {
  try {
    const candidate = await prisma.candidate.create({ data: req.body });
    res.status(201).json({ success: true, data: candidate });
  } catch (error) { next(error); }
});

router.put('/:id', async (req, res, next) => {
  try {
    const candidate = await prisma.candidate.update({ where: { id: req.params.id }, data: req.body });
    res.json({ success: true, data: candidate });
  } catch (error) { next(error); }
});

router.delete('/:id', async (req, res, next) => {
  try {
    await prisma.candidate.delete({ where: { id: req.params.id } });
    res.json({ success: true, message: 'Candidate deleted' });
  } catch (error) { next(error); }
});

export default router;
