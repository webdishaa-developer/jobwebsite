import { Router, Request, Response, NextFunction } from 'express';
import { protect } from '../middleware/auth.middleware';
import { uploadImage } from '../config/cloudinary';

const router = Router();
router.use(protect);

router.post('/image', uploadImage.single('image'), (req: Request, res: Response) => {
  const file = req.file as any;
  if (!file) return res.status(400).json({ success: false, message: 'No file uploaded' });
  res.json({
    success: true,
    data: {
      url: file.path,
      publicId: file.filename,
    },
  });
});

export default router;
