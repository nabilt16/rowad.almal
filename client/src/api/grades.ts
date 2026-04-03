import type { Grade, GradeWithUnits, UnitWithLessons, Lesson } from '@rowad/shared';
import apiClient from './client';

export async function getGrades(): Promise<Grade[]> {
  const res = await apiClient.get<Grade[]>('/grades');
  return res.data;
}

export async function getGrade(gradeNumber: number): Promise<GradeWithUnits> {
  const res = await apiClient.get<GradeWithUnits>(`/grades/${gradeNumber}`);
  return res.data;
}

export async function getUnitLessons(gradeNumber: number, unitNumber: number): Promise<UnitWithLessons> {
  const res = await apiClient.get<UnitWithLessons>(`/grades/${gradeNumber}/units/${unitNumber}`);
  return res.data;
}

export async function getLesson(lessonId: string): Promise<Lesson> {
  const res = await apiClient.get<Lesson>(`/lessons/${lessonId}`);
  return res.data;
}
