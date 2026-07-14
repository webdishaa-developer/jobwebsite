import { Router } from 'express';
import { getAllTestimonials, createTestimonial, updateTestimonial, deleteTestimonial } from '../controllers/testimonials.controller';
import { protect } from '../middleware/auth.middleware';

const router = Router();
router.get('/', getAllTestimonials);
router.use(protect);
router.post('/', createTestimonial);
router.put('/:id', updateTestimonial);
router.delete('/:id', deleteTestimonial);
export default router;
