import { Router, Response, NextFunction } from 'express';
import { authenticate, AuthRequest } from '../middleware/auth.js';
import { prisma } from '../app.js';
import { AppError } from '../middleware/errorHandler.js';

const router = Router();

// GET /:id - get a single lesson by id
router.get(
  '/:id',
  authenticate,
  async (req: AuthRequest, res: Response, next: NextFunction) => {
    try {
      const lesson = await prisma.lesson.findUnique({
        where: { id: req.params.id },
        include: {
          unit: {
            select: {
              id: true,
              number: true,
              title: true,
              color: true,
              grade: {
                select: {
                  id: true,
                  number: true,
                  nameAr: true,
                },
              },
            },
          },
        },
      });

      if (!lesson) {
        throw new AppError(404, 'الدرس غير موجود');
      }

      res.json(lesson);
    } catch (err) {
      next(err);
    }
  },
);

export default router;
