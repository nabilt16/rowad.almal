export interface Grade {
  id: string;
  number: number;
  nameAr: string;
  slug: string;
}

export interface Unit {
  id: string;
  gradeId: string;
  number: number;
  title: string;
  color: string;
  sortOrder: number;
}

export interface Lesson {
  id: string;
  unitId: string;
  legacyId: string;
  title: string;
  subtitle: string;
  bgEmoji: string;
  bgColor: string;
  goal: string;
  storyTitle: string;
  storyText: string;
  conceptTitle: string;
  conceptText: string;
  conceptHtml: string;
  quizQuestion: string;
  quizChoices: QuizChoice[];
  activityType: string;
  activityConfig: Record<string, unknown>;
  sortOrder: number;
}

export interface QuizChoice {
  text: string;
  correct: boolean;
}

export interface LessonSummary {
  id: string;
  legacyId: string;
  title: string;
  subtitle: string;
  bgEmoji: string;
  bgColor: string;
  sortOrder: number;
}

export interface UnitWithLessons extends Unit {
  lessons: LessonSummary[];
}

export interface GradeWithUnits extends Grade {
  units: UnitWithLessons[];
}
