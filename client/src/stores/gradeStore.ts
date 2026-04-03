import { create } from 'zustand';
import type { Grade, GradeWithUnits, Lesson } from '@rowad/shared';
import * as gradesApi from '../api/grades';

interface GradeState {
  grades: Grade[];
  currentGrade: GradeWithUnits | null;
  currentLesson: Lesson | null;
  gradesLoading: boolean;
  gradeLoading: boolean;
  lessonLoading: boolean;
  error: string | null;

  fetchGrades: () => Promise<void>;
  fetchGrade: (gradeNumber: number) => Promise<void>;
  fetchLesson: (lessonId: string) => Promise<void>;
  clearCurrentGrade: () => void;
  clearCurrentLesson: () => void;
}

export const useGradeStore = create<GradeState>((set) => ({
  grades: [],
  currentGrade: null,
  currentLesson: null,
  gradesLoading: false,
  gradeLoading: false,
  lessonLoading: false,
  error: null,

  fetchGrades: async () => {
    set({ gradesLoading: true, error: null });
    try {
      const grades = await gradesApi.getGrades();
      set({ grades, gradesLoading: false });
    } catch {
      set({ gradesLoading: false, error: 'فشل تحميل الصفوف' });
    }
  },

  fetchGrade: async (gradeNumber) => {
    set({ gradeLoading: true, error: null });
    try {
      const grade = await gradesApi.getGrade(gradeNumber);
      set({ currentGrade: grade, gradeLoading: false });
    } catch {
      set({ gradeLoading: false, error: 'فشل تحميل الصف' });
    }
  },

  fetchLesson: async (lessonId) => {
    set({ lessonLoading: true, error: null });
    try {
      const lesson = await gradesApi.getLesson(lessonId);
      set({ currentLesson: lesson, lessonLoading: false });
    } catch {
      set({ lessonLoading: false, error: 'فشل تحميل الدرس' });
    }
  },

  clearCurrentGrade: () => set({ currentGrade: null }),
  clearCurrentLesson: () => set({ currentLesson: null }),
}));
