import { prisma } from '../app.js';
import { AppError } from '../middleware/errorHandler.js';
import { checkAndAwardBadges } from './badge.js';

interface QuizChoice {
  text: string;
  correct: boolean;
}

/**
 * Return overall progress for a user within a specific grade.
 * Includes completed lesson IDs and per-unit progress counts.
 */
export async function getGradeProgress(userId: string, gradeNumber: number) {
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

  // Collect all lesson IDs that belong to this grade
  const allLessonIds = grade.units.flatMap(u => u.lessons.map(l => l.id));

  // Fetch completed progress records for this user within those lessons
  const completedProgress = await prisma.lessonProgress.findMany({
    where: {
      userId,
      lessonId: { in: allLessonIds },
      completedAt: { not: null },
    },
    select: { lessonId: true },
  });

  const completedSet = new Set(completedProgress.map(p => p.lessonId));

  const unitProgress = grade.units.map(unit => ({
    unitId: unit.id,
    unitNumber: unit.number,
    totalLessons: unit.lessons.length,
    completedLessons: unit.lessons.filter(l => completedSet.has(l.id)).length,
  }));

  return {
    gradeNumber: grade.number,
    completedLessonIds: Array.from(completedSet),
    unitProgress,
  };
}

/**
 * Submit a quiz answer for a lesson.
 * Checks the chosen index against the lesson's quizChoices JSON
 * to determine correctness. Marks lesson progress and triggers badge check.
 */
export async function submitQuiz(userId: string, lessonId: string, choiceIndex: number) {
  const lesson = await prisma.lesson.findUnique({
    where: { id: lessonId },
    include: {
      unit: { include: { grade: true } },
    },
  });

  if (!lesson) {
    throw new AppError(404, 'الدرس غير موجود');
  }

  const choices = lesson.quizChoices as unknown as QuizChoice[];
  if (!Array.isArray(choices) || choiceIndex < 0 || choiceIndex >= choices.length) {
    throw new AppError(400, 'اختيار غير صالح');
  }

  const isCorrect = choices[choiceIndex]?.correct === true;

  // Upsert lesson progress: mark quiz completed
  const progress = await prisma.lessonProgress.upsert({
    where: {
      userId_lessonId: { userId, lessonId },
    },
    create: {
      userId,
      lessonId,
      quizCompleted: true,
      quizCorrect: isCorrect,
      completedAt: isCorrect ? new Date() : null,
    },
    update: {
      quizCompleted: true,
      quizCorrect: isCorrect,
      // Only set completedAt if it wasn't already completed and answer is correct
      ...(isCorrect ? { completedAt: new Date() } : {}),
    },
  });

  // Trigger badge evaluation asynchronously (fire and forget)
  checkAndAwardBadges(userId, lesson.unit.grade.number).catch(() => {
    // Silently ignore badge check errors so they don't break quiz flow
  });

  return {
    correct: isCorrect,
    progress,
  };
}

/**
 * Submit an activity result for a lesson.
 * Stores the score and answers payload.
 */
export async function submitActivity(
  userId: string,
  lessonId: string,
  activityType: string,
  score: number | undefined,
  answers: Record<string, unknown> | undefined,
) {
  const lesson = await prisma.lesson.findUnique({ where: { id: lessonId } });
  if (!lesson) {
    throw new AppError(404, 'الدرس غير موجود');
  }

  const completed = score !== undefined ? score >= 50 : true;

  const result = await prisma.activityResult.upsert({
    where: {
      userId_lessonId: { userId, lessonId },
    },
    create: {
      userId,
      lessonId,
      activityType,
      completed,
      score: score ?? null,
      answers: (answers ?? {}) as Record<string, string>,
    },
    update: {
      activityType,
      completed,
      score: score ?? null,
      answers: (answers ?? {}) as Record<string, string>,
    },
  });

  return result;
}

/**
 * Update the user's daily streak.
 * If the last active date was yesterday, increment the streak.
 * If it was today, do nothing. Otherwise, reset to 1.
 */
export async function updateStreak(userId: string) {
  const now = new Date();
  const todayStr = now.toISOString().slice(0, 10);

  const streak = await prisma.streak.findUnique({ where: { userId } });

  if (!streak) {
    // First ever activity
    return prisma.streak.create({
      data: {
        userId,
        currentStreak: 1,
        longestStreak: 1,
        lastActiveDate: now,
      },
    });
  }

  const lastDateStr = streak.lastActiveDate.toISOString().slice(0, 10);

  if (lastDateStr === todayStr) {
    // Already active today, nothing to update
    return streak;
  }

  // Check if last active was yesterday
  const yesterday = new Date(now);
  yesterday.setDate(yesterday.getDate() - 1);
  const yesterdayStr = yesterday.toISOString().slice(0, 10);

  let newStreak: number;
  if (lastDateStr === yesterdayStr) {
    newStreak = streak.currentStreak + 1;
  } else {
    // Streak broken, reset
    newStreak = 1;
  }

  const newLongest = Math.max(streak.longestStreak, newStreak);

  return prisma.streak.update({
    where: { userId },
    data: {
      currentStreak: newStreak,
      longestStreak: newLongest,
      lastActiveDate: now,
    },
  });
}
