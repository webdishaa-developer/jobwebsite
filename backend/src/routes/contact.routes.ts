import { Router } from 'express';
import { submitContact, getAllMessages, updateMessageStatus } from '../controllers/contact.controller';
import { protect } from '../middleware/auth.middleware';

const router = Router();
router.post('/', submitContact);
router.use(protect);
router.get('/', getAllMessages);
router.patch('/:id/status', updateMessageStatus);
export default router;
