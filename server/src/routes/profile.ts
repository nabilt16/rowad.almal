import { Router, Response, NextFunction } from 'express';
import { profileUpdateSchema, onboardingSchema } from '@rowad/shared';
import { authenticate, AuthRequest } from '../middleware/auth.js';
import { validate } from '../middleware/validate.js';
import { prisma } from '../app.js';
import { AppError } from '../middleware/errorHandler.js';

const router = Router();

// GET / - return profile for authenticated user
router.get(
  '/',
  authenticate,
  async (req: AuthRequest, res: Response, next: NextFunction) => {
    try {
      const profile = await prisma.studentProfile.findUnique({
        where: { userId: req.userId },
      });

      if (!profile) {
        throw new AppError(404, 'الملف الشخصي غير موجود');
      }

      res.json(profile);
    } catch (err) {
      next(err);
    }
  },
);

// PUT / - update profile for authenticated user
router.put(
  '/',
  authenticate,
  validate(profileUpdateSchema),
  async (req: AuthRequest, res: Response, next: NextFunction) => {
    try {
      const profile = await prisma.studentProfile.update({
        where: { userId: req.userId },
        data: req.body,
      });

      res.json(profile);
    } catch (err) {
      next(err);
    }
  },
);

// PUT /onboarding - create or update profile with onboarded=true
router.put(
  '/onboarding',
  authenticate,
  validate(onboardingSchema),
  async (req: AuthRequest, res: Response, next: NextFunction) => {
    try {
      const profile = await prisma.studentProfile.upsert({
        where: { userId: req.userId },
        create: {
          userId: req.userId!,
          ...req.body,
          onboarded: true,
        },
        update: {
          ...req.body,
          onboarded: true,
        },
      });

      res.json(profile);
    } catch (err) {
      next(err);
    }
  },
);

export default router;
