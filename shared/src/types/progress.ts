export interface LessonProgress {
  id: string;
  userId: string;
  lessonId: string;
  quizCompleted: boolean;
  quizCorrect: boolean;
  storyRead: boolean;
  conceptRead: boolean;
  completedAt: string | null;
}

export interface ActivityResult {
  id: string;
  userId: string;
  lessonId: string;
  activityType: string;
  completed: boolean;
  score: number | null;
  answers: Record<string, unknown>;
}

export interface Streak {
  userId: string;
  currentStreak: number;
  longestStreak: number;
  lastActiveDate: string;
}

export interface UnitProgress {
  unitId: string;
  unitNumber: number;
  totalLessons: number;
  completedLessons: number;
}

export interface GradeProgress {
  gradeNumber: number;
  completedLessonIds: string[];
  unitProgress: UnitProgress[];
}
