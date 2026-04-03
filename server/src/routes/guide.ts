import { Router, Response, NextFunction } from 'express';
import { authenticate, AuthRequest } from '../middleware/auth.js';
import { prisma } from '../app.js';
import { AppError } from '../middleware/errorHandler.js';

const router = Router();

// GET /:gradeNumber - get teacher guide units and lessons for a grade
router.get(
  '/:gradeNumber',
  authenticate,
  async (req: AuthRequest, res: Response, next: NextFunction) => {
    try {
      const gradeNumber = parseInt(req.params.gradeNumber, 10);

      const grade = await prisma.grade.findUnique({
        where: { number: gradeNumber },
      });

      if (!grade) {
        throw new AppError(404, 'الصف غير موجود');
      }

      const guideUnits = await prisma.guideUnit.findMany({
        where: { gradeId: grade.id },
        orderBy: { unitNumber: 'asc' },
        include: {
          lessons: true,
        },
      });

      res.json(guideUnits);
    } catch (err) {
      next(err);
    }
  },
);

export default router;
