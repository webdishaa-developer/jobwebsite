import { Router } from 'express';
import { getDashboardStats } from '../controllers/admin.controller';
import { protect } from '../middleware/auth.middleware';

const router = Router();
router.use(protect);
router.get('/dashboard', getDashboardStats);
export default router;
