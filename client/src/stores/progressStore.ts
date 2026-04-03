import { create } from 'zustand';
import type { GradeProgress, BadgeWithEarned } from '@rowad/shared';
import * as progressApi from '../api/progress';

interface ProgressState {
  gradeProgress: GradeProgress | null;
  badges: BadgeWithEarned[];
  loading: boolean;
  error: string | null;

  fetchGradeProgress: (gradeNumber: number) => Promise<void>;
  fetchBadges: (gradeNumber: number) => Promise<void>;
  clearProgress: () => void;
}

export const useProgressStore = create<ProgressState>((set) => ({
  gradeProgress: null,
  badges: [],
  loading: false,
  error: null,

  fetchGradeProgress: async (gradeNumber) => {
    set({ loading: true, error: null });
    try {
      const progress = await progressApi.getGradeProgress(gradeNumber);
      set({ gradeProgress: progress, loading: false });
    } catch {
      set({ loading: false, error: 'فشل تحميل التقدم' });
    }
  },

  fetchBadges: async (gradeNumber) => {
    try {
      const badges = await progressApi.getGradeBadges(gradeNumber);
      set({ badges });
    } catch {
      // Silently fail — badges are non-critical
    }
  },

  clearProgress: () => set({ gradeProgress: null, badges: [] }),
}));
