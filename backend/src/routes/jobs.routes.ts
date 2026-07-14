import { Router } from 'express';
import {
  getAllJobs, getJobBySlug, getJobById, createJob,
  updateJob, deleteJob, getJobStats,
} from '../controllers/jobs.controller';
import { protect, restrictTo } from '../middleware/auth.middleware';

const router = Router();

// Public routes
router.get('/', getAllJobs);
router.get('/stats', getJobStats);
router.get('/slug/:slug', getJobBySlug);
router.get('/:id', getJobById);

// Protected admin routes
router.use(protect);
router.post('/', restrictTo('SUPER_ADMIN', 'ADMIN', 'EDITOR'), createJob);
router.put('/:id', restrictTo('SUPER_ADMIN', 'ADMIN', 'EDITOR'), updateJob);
router.patch('/:id', restrictTo('SUPER_ADMIN', 'ADMIN', 'EDITOR'), updateJob);
router.delete('/:id', restrictTo('SUPER_ADMIN', 'ADMIN'), deleteJob);

export default router;
