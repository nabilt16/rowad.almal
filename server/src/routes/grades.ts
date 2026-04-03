import { Router, Response, NextFunction } from 'express';
import { authenticate, AuthRequest } from '../middleware/auth.js';
import { prisma } from '../app.js';
import { AppError } from '../middleware/errorHandler.js';

const router = Router();

// GET / - list all grades
router.get(
  '/',
  authenticate,
  async (_req: AuthRequest, res: Response, next: NextFunction) => {
    try {
      const grades = await prisma.grade.findMany({
        orderBy: { number: 'asc' },
      });

      res.json(grades);
    } catch (err) {
      next(err);
    }
  },
);

// GET /:number - get a single grade with its units and lessons
router.get(
  '/:number',
  authenticate,
  async (req: AuthRequest, res: Response, next: NextFunction) => {
    try {
      const gradeNumber = parseInt(req.params.number, 10);

      const grade = await prisma.grade.findUnique({
        where: { number: gradeNumber },
        include: {
          units: {
            orderBy: { sortOrder: 'asc' },
            include: {
              lessons: {
                orderBy: { sortOrder: 'asc' },
                select: {
                  id: true,
                  legacyId: true,
                  title: true,
                  subtitle: true,
                  bgEmoji: true,
                  bgColor: true,
                  sortOrder: true,
                },
              },
            },
          },
        },
      });

      if (!grade) {
        throw new AppError(404, 'الصف غير موجود');
      }

      res.json(grade);
    } catch (err) {
      next(err);
    }
  },
);

// GET /:number/units/:unitNum/lessons - list lessons in a specific unit
router.get(
  '/:number/units/:unitNum/lessons',
  authenticate,
  async (req: AuthRequest, res: Response, next: NextFunction) => {
    try {
      const gradeNumber = parseInt(req.params.number, 10);
      const unitNumber = parseInt(req.params.unitNum, 10);

      const grade = await prisma.grade.findUnique({
        where: { number: gradeNumber },
      });

      if (!grade) {
        throw new AppError(404, 'الصف غير موجود');
      }

      const unit = await prisma.unit.findUnique({
        where: {
          gradeId_number: {
            gradeId: grade.id,
            number: unitNumber,
          },
        },
        include: {
          lessons: {
            orderBy: { sortOrder: 'asc' },
            select: {
              id: true,
              legacyId: true,
              title: true,
              subtitle: true,
              bgEmoji: true,
              bgColor: true,
              sortOrder: true,
            },
          },
        },
      });

      if (!unit) {
        throw new AppError(404, 'الوحدة غير موجودة');
      }

      res.json(unit.lessons);
    } catch (err) {
      next(err);
    }
  },
);

export default router;
