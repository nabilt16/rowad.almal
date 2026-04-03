import { prisma } from '../app.js';
import { AppError } from '../middleware/errorHandler.js';

/**
 * Return all teacher-guide units (with their lesson plans) for a specific grade number.
 * Units are ordered by unitNumber.
 */
export async function getByGrade(gradeNumber: number) {
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

  return guideUnits;
}
