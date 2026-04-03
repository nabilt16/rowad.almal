export const GRADE_CONFIG = {
  4: {
    number: 4,
    nameAr: 'الصف الرابع',
    slug: 'grade-4',
    unitCount: 5,
    lessonCount: 19,
    hasGlossary: false,
  },
  5: {
    number: 5,
    nameAr: 'الصف الخامس',
    slug: 'grade-5',
    unitCount: 5,
    lessonCount: 19,
    hasGlossary: true,
  },
  6: {
    number: 6,
    nameAr: 'الصف السادس',
    slug: 'grade-6',
    unitCount: 5,
    lessonCount: 20,
    hasGlossary: true,
  },
} as const;

export type GradeNumber = 4 | 5 | 6;
