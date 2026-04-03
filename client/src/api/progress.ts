import type {
  GradeProgress,
  LessonProgress,
  ActivityResult,
  BadgeWithEarned,
} from '@rowad/shared';
import type { QuizSubmitInput, ActivitySubmitInput } from '@rowad/shared';
import apiClient from './client';

export async function getGradeProgress(gradeNumber: number): Promise<GradeProgress> {
  const res = await apiClient.get<GradeProgress>(`/progress/grade/${gradeNumber}`);
  return res.data;
}

export async function submitQuiz(
  lessonId: string,
  data: QuizSubmitInput,
): Promise<LessonProgress> {
  const res = await apiClient.post<LessonProgress>(
    `/progress/lessons/${lessonId}/quiz`,
    data,
  );
  return res.data;
}

export async function submitActivity(
  lessonId: string,
  data: ActivitySubmitInput,
): Promise<ActivityResult> {
  const res = await apiClient.post<ActivityResult>(
    `/progress/lessons/${lessonId}/activity`,
    data,
  );
  return res.data;
}

export async function getGradeBadges(gradeNumber: number): Promise<BadgeWithEarned[]> {
  const res = await apiClient.get<BadgeWithEarned[]>(`/progress/grade/${gradeNumber}/badges`);
  return res.data;
}
