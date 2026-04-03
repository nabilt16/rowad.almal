import { prisma } from '../app.js';
import { AppError } from '../middleware/errorHandler.js';
import type { BadgeRequirementType as BadgeReqType } from '@prisma/client';

/**
 * Return all badges for a given grade, annotated with whether the user has earned them.
 */
export async function getGradeBadges(userId: string, gradeNumber: number) {
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
        where: { userId },
        select: { earnedAt: true },
      },
    },
  });

  return badges.map(badge => {
    const earned = badge.userBadges.length > 0;
    const { userBadges, ...rest } = badge;
    return {
      ...rest,
      earned,
      earnedAt: earned ? userBadges[0].earnedAt.toISOString() : null,
    };
  });
}

/**
 * Evaluate all badge rules for a grade and award any newly earned badges.
 * Returns the list of newly awarded badge keys.
 */
export async function checkAndAwardBadges(userId: string, gradeNumber: number): Promise<string[]> {
  const grade = await prisma.grade.findUnique({
    where: { number: gradeNumber },
    include: {
      badges: {
        include: {
          userBadges: {
            where: { userId },
          },
        },
      },
      units: {
        include: {
          lessons: {
            select: { id: true },
          },
        },
      },
    },
  });

  if (!grade) {
    return [];
  }

  // Badges the user hasn't earned yet
  const unearnedBadges = grade.badges.filter(b => b.userBadges.length === 0);
  if (unearnedBadges.length === 0) {
    return [];
  }

  // Gather the data needed for rule evaluation
  const allLessonIds = grade.units.flatMap(u => u.lessons.map(l => l.id));

  const completedProgress = await prisma.lessonProgress.findMany({
    where: {
      userId,
      lessonId: { in: allLessonIds },
      completedAt: { not: null },
    },
    select: { lessonId: true },
  });

  const completedLessonIds = new Set(completedProgress.map(p => p.lessonId));

  const streak = await prisma.streak.findUnique({ where: { userId } });
  const bucketConfig = await prisma.bucketConfig.findUnique({ where: { userId } });

  const newlyAwarded: string[] = [];

  for (const badge of unearnedBadges) {
    const met = evaluateRule(
      badge.requirementType,
      badge.requirementValue,
      badge.requirementKey,
      {
        completedLessonIds,
        gradeUnits: grade.units,
        streak,
        bucketConfig,
      },
    );

    if (met) {
      await prisma.userBadge.create({
        data: {
          userId,
          badgeId: badge.id,
        },
      });
      newlyAwarded.push(badge.badgeKey);
    }
  }

  return newlyAwarded;
}

// ──────────────────────────────────────────────
// Rule evaluation helpers
// ──────────────────────────────────────────────

interface EvalContext {
  completedLessonIds: Set<string>;
  gradeUnits: Array<{
    id: string;
    number: number;
    lessons: Array<{ id: string }>;
  }>;
  streak: { currentStreak: number; longestStreak: number } | null;
  bucketConfig: { saveGoalName: string } | null;
}

function evaluateRule(
  type: BadgeReqType,
  value: number,
  key: string | null,
  ctx: EvalContext,
): boolean {
  switch (type) {
    case 'LESSON_COUNT':
      // User has completed at least `value` lessons in this grade
      return ctx.completedLessonIds.size >= value;

    case 'UNIT_COMPLETED': {
      // All lessons in the unit identified by `key` (unit number) are completed
      const unitNumber = key ? parseInt(key, 10) : value;
      const unit = ctx.gradeUnits.find(u => u.number === unitNumber);
      if (!unit || unit.lessons.length === 0) return false;
      return unit.lessons.every(l => ctx.completedLessonIds.has(l.id));
    }

    case 'SAVINGS_STARTED':
      // User has created a bucket config (started using the savings feature)
      return ctx.bucketConfig !== null;

    case 'GOAL_SET':
      // User has set a savings goal name
      return ctx.bucketConfig !== null && ctx.bucketConfig.saveGoalName.length > 0;

    case 'STREAK_REACHED':
      // User's current streak is at least `value`
      return ctx.streak !== null && ctx.streak.currentStreak >= value;

    default:
      return false;
  }
}
