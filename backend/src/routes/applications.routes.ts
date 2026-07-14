import { Router } from 'express';
import {
  createApplication, getAllApplications, getApplicationById,
  updateApplicationStatus, getApplicationStats,
} from '../controllers/applications.controller';
import { protect } from '../middleware/auth.middleware';
import { uploadResume } from '../config/cloudinary';

const router = Router();

// Public - apply for a job
router.post('/job/:jobId', uploadResume.single('resume'), createApplication);

// Protected admin routes
router.use(protect);
router.get('/', getAllApplications);
router.get('/stats', getApplicationStats);
router.get('/:id', getApplicationById);
router.patch('/:id/status', updateApplicationStatus);

export default router;
