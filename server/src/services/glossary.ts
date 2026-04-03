import { prisma } from '../app.js';
import { AppError } from '../middleware/errorHandler.js';

/**
 * Return all glossary units (with their terms) for a specific grade number.
 * Units are ordered by unitNumber, and terms are ordered alphabetically.
 */
export async function getByGrade(gradeNumber: number) {
  const grade = await prisma.grade.findUnique({
    where: { number: gradeNumber },
  });

  if (!grade) {
    throw new AppError(404, 'الصف غير موجود');
  }

  const glossaryUnits = await prisma.glossaryUnit.findMany({
    where: { gradeId: grade.id },
    orderBy: { unitNumber: 'asc' },
    include: {
      terms: {
        orderBy: { termAr: 'asc' },
      },
    },
  });

  return glossaryUnits;
}
