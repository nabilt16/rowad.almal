import { prisma } from '../app.js';
import { AppError } from '../middleware/errorHandler.js';

/**
 * Return every grade with its nested units (each unit includes lesson summaries).
 */
export async function getAllGrades() {
  const grades = await prisma.grade.findMany({
    orderBy: { number: 'asc' },
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

  return grades;
}

/**
 * Return a single grade (with units + lesson summaries) by its number (4, 5, or 6).
 */
export async function getGradeByNumber(gradeNumber: number) {
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

  return grade;
}

/**
 * Return all lessons belonging to a specific unit (full lesson data).
 */
export async function getLessonsByUnit(unitId: string) {
  const unit = await prisma.unit.findUnique({
    where: { id: unitId },
    include: {
      lessons: {
        orderBy: { sortOrder: 'asc' },
      },
    },
  });

  if (!unit) {
    throw new AppError(404, 'الوحدة غير موجودة');
  }

  return unit.lessons;
}

/**
 * Return full details for a single lesson by its id.
 */
export async function getLessonById(lessonId: string) {
  const lesson = await prisma.lesson.findUnique({
    where: { id: lessonId },
    include: {
      unit: {
        include: {
          grade: true,
        },
      },
    },
  });

  if (!lesson) {
    throw new AppError(404, 'الدرس غير موجود');
  }

  return lesson;
}
