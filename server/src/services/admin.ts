import { prisma } from '../app.js';
import { AppError } from '../middleware/errorHandler.js';

/**
 * Return a paginated list of all users with their profiles.
 * Intended for admin dashboard.
 */
export async function getUsers(page: number = 1, limit: number = 20) {
  const skip = (page - 1) * limit;

  const [users, total] = await prisma.$transaction([
    prisma.user.findMany({
      skip,
      take: limit,
      orderBy: { createdAt: 'desc' },
      select: {
        id: true,
        email: true,
        role: true,
        createdAt: true,
        updatedAt: true,
        profile: {
          select: {
            studentName: true,
            gender: true,
            onboarded: true,
          },
        },
      },
    }),
    prisma.user.count(),
  ]);

  return {
    users,
    total,
    page,
    totalPages: Math.ceil(total / limit),
  };
}

/**
 * Return detailed information about a single user, including
 * profile, progress, badges, streak, and bucket config.
 */
export async function getUserById(userId: string) {
  const user = await prisma.user.findUnique({
    where: { id: userId },
    include: {
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

  // Strip passwordHash before returning
  const { passwordHash, ...safeUser } = user;

  return safeUser;
}

/**
 * Update a lesson's editable fields (for admin content management).
 */
export async function updateLesson(
  lessonId: string,
  data: {
    title?: string;
    subtitle?: string;
    goal?: string;
    storyTitle?: string;
    storyText?: string;
    conceptTitle?: string;
    conceptText?: string;
    conceptHtml?: string;
    quizQuestion?: string;
    quizChoices?: Record<string, unknown>[];
    activityType?: string;
    activityConfig?: Record<string, unknown>;
  },
) {
  const lesson = await prisma.lesson.findUnique({ where: { id: lessonId } });
  if (!lesson) {
    throw new AppError(404, 'الدرس غير موجود');
  }

  const updated = await prisma.lesson.update({
    where: { id: lessonId },
    data: data as Parameters<typeof prisma.lesson.update>[0]['data'],
  });

  return updated;
}

/**
 * Return high-level statistics for the admin dashboard:
 * total users, total lessons completed, active streaks, etc.
 */
export async function getStats() {
  const [
    totalUsers,
    totalStudents,
    onboardedStudents,
    totalCompletedLessons,
    activeStreaks,
    totalBadgesEarned,
    totalBucketConfigs,
  ] = await prisma.$transaction([
    prisma.user.count(),
    prisma.user.count({ where: { role: 'STUDENT' } }),
    prisma.studentProfile.count({ where: { onboarded: true } }),
    prisma.lessonProgress.count({ where: { completedAt: { not: null } } }),
    prisma.streak.count({ where: { currentStreak: { gte: 1 } } }),
    prisma.userBadge.count(),
    prisma.bucketConfig.count(),
  ]);

  return {
    totalUsers,
    totalStudents,
    onboardedStudents,
    totalCompletedLessons,
    activeStreaks,
    totalBadgesEarned,
    totalBucketConfigs,
  };
}
