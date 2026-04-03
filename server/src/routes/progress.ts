import { Router, Response, NextFunction } from 'express';
import { quizSubmitSchema, activitySubmitSchema } from '@rowad/shared';
import { authenticate, AuthRequest } from '../middleware/auth.js';
import { validate } from '../middleware/validate.js';
import { prisma } from '../app.js';
import { AppError } from '../middleware/errorHandler.js';

const router = Router();

// GET /grade/:number - get progress for a grade
router.get(
  '/grade/:number',
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
                select: { id: true },
              },
            },
          },
        },
      });

      if (!grade) {
        throw new AppError(404, 'الصف غير موجود');
      }

      const allLessonIds = grade.units.flatMap(u => u.lessons.map(l => l.id));

      const completedProgress = await prisma.lessonProgress.findMany({
        where: {
          userId: req.userId,
          lessonId: { in: allLessonIds },
          completedAt: { not: null },
        },
        select: { lessonId: true },
      });

      const completedLessonIds = completedProgress.map(p => p.lessonId);

      const unitProgress = grade.units.map(unit => {
        const unitLessonIds = unit.lessons.map(l => l.id);
        return {
          unitId: unit.id,
          unitNumber: unit.number,
          totalLessons: unitLessonIds.length,
          completedLessons: unitLessonIds.filter(id =>
            completedLessonIds.includes(id),
          ).length,
        };
      });

      res.json({
        gradeNumber,
        completedLessonIds,
        unitProgress,
      });
    } catch (err) {
      next(err);
    }
  },
);

// POST /lesson/:id/quiz - submit quiz answer
router.post(
  '/lesson/:id/quiz',
  authenticate,
  validate(quizSubmitSchema),
  async (req: AuthRequest, res: Response, next: NextFunction) => {
    try {
      const lessonId = req.params.id;
      const { choiceIndex } = req.body;

      const lesson = await prisma.lesson.findUnique({
        where: { id: lessonId },
      });

      if (!lesson) {
        throw new AppError(404, 'الدرس غير موجود');
      }

      const choices = lesson.quizChoices as Array<{ text: string; correct: boolean }>;
      const isCorrect = choices[choiceIndex]?.correct === true;

      const progress = await prisma.lessonProgress.upsert({
        where: {
          userId_lessonId: {
            userId: req.userId!,
            lessonId,
          },
        },
        create: {
          userId: req.userId!,
          lessonId,
          quizCompleted: true,
          quizCorrect: isCorrect,
        },
        update: {
          quizCompleted: true,
          quizCorrect: isCorrect,
        },
      });

      // Mark lesson as completed if all parts are done
      if (progress.quizCompleted && progress.storyRead && progress.conceptRead) {
        await prisma.lessonProgress.update({
          where: { id: progress.id },
          data: { completedAt: new Date() },
        });
      }

      res.json({ correct: isCorrect, progress });
    } catch (err) {
      next(err);
    }
  },
);

// POST /lesson/:id/activity - submit activity result
router.post(
  '/lesson/:id/activity',
  authenticate,
  validate(activitySubmitSchema),
  async (req: AuthRequest, res: Response, next: NextFunction) => {
    try {
      const lessonId = req.params.id;
      const { score, answers } = req.body;

      const lesson = await prisma.lesson.findUnique({
        where: { id: lessonId },
      });

      if (!lesson) {
        throw new AppError(404, 'الدرس غير موجود');
      }

      const result = await prisma.activityResult.upsert({
        where: {
          userId_lessonId: {
            userId: req.userId!,
            lessonId,
          },
        },
        create: {
          userId: req.userId!,
          lessonId,
          activityType: lesson.activityType,
          completed: true,
          score: score ?? null,
          answers: answers ?? {},
        },
        update: {
          completed: true,
          score: score ?? null,
          answers: answers ?? {},
        },
      });

      res.json(result);
    } catch (err) {
      next(err);
    }
  },
);

// GET /badges/:gradeNumber - get badges with earned status
router.get(
  '/badges/:gradeNumber',
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

      const badges = await prisma.badge.findMany({
        where: { gradeId: grade.id },
        include: {
          userBadges: {
            where: { userId: req.userId },
          },
        },
      });

      const result = badges.map(badge => ({
        id: badge.id,
        gradeId: badge.gradeId,
        badgeKey: badge.badgeKey,
        icon: badge.icon,
        nameAr: badge.nameAr,
        requirementType: badge.requirementType,
        requirementValue: badge.requirementValue,
        requirementKey: badge.requirementKey,
        earned: badge.userBadges.length > 0,
        earnedAt: badge.userBadges[0]?.earnedAt?.toISOString() ?? null,
      }));

      res.json(result);
    } catch (err) {
      next(err);
    }
  },
);

export default router;
