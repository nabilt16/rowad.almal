import { Router, Response, NextFunction } from 'express';
import { authenticate, requireAdmin, AuthRequest } from '../middleware/auth.js';
import { prisma } from '../app.js';
import { AppError } from '../middleware/errorHandler.js';

const router = Router();

// All admin routes require authentication + admin role
router.use(authenticate, requireAdmin);

// GET /users - list all users
router.get(
  '/users',
  async (_req: AuthRequest, res: Response, next: NextFunction) => {
    try {
      const users = await prisma.user.findMany({
        select: {
          id: true,
          email: true,
          role: true,
          createdAt: true,
          updatedAt: true,
          profile: {
            select: {
              studentName: true,
              onboarded: true,
            },
          },
        },
        orderBy: { createdAt: 'desc' },
      });

      res.json(users);
    } catch (err) {
      next(err);
    }
  },
);

// GET /users/:id - get a single user with full details
router.get(
  '/users/:id',
  async (req: AuthRequest, res: Response, next: NextFunction) => {
    try {
      const user = await prisma.user.findUnique({
        where: { id: req.params.id },
        select: {
          id: true,
          email: true,
          role: true,
          createdAt: true,
          updatedAt: true,
          profile: true,
          lessonProgress: {
            where: { completedAt: { not: null } },
            select: { lessonId: true, completedAt: true },
          },
          userBadges: {
            include: { badge: true },
          },
          streak: true,
          bucketConfig: true,
        },
      });

      if (!user) {
        throw new AppError(404, 'المستخدم غير موجود');
      }

      res.json(user);
    } catch (err) {
      next(err);
    }
  },
);

// PUT /lessons/:id - update a lesson (admin content editing)
router.put(
  '/lessons/:id',
  async (req: AuthRequest, res: Response, next: NextFunction) => {
    try {
      const lesson = await prisma.lesson.findUnique({
        where: { id: req.params.id },
      });

      if (!lesson) {
        throw new AppError(404, 'الدرس غير موجود');
      }

      const updated = await prisma.lesson.update({
        where: { id: req.params.id },
        data: req.body,
      });

      res.json(updated);
    } catch (err) {
      next(err);
    }
  },
);

// GET /stats - get platform statistics
router.get(
  '/stats',
  async (_req: AuthRequest, res: Response, next: NextFunction) => {
    try {
      const [
        totalUsers,
        onboardedUsers,
        totalLessons,
        completedProgressCount,
        activeBuckets,
      ] = await prisma.$transaction([
        prisma.user.count(),
        prisma.studentProfile.count({ where: { onboarded: true } }),
        prisma.lesson.count(),
        prisma.lessonProgress.count({ where: { completedAt: { not: null } } }),
        prisma.bucketConfig.count(),
      ]);

      res.json({
        totalUsers,
        onboardedUsers,
        totalLessons,
        completedProgressCount,
        activeBuckets,
      });
    } catch (err) {
      next(err);
    }
  },
);

export default router;
