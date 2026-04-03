import { useCallback } from 'react';
import { useAuthStore } from '../stores/authStore';
import { personalizeText } from '../utils/personalize';

/**
 * Hook that wraps the personalization engine.
 * Returns a function that takes raw lesson/story text and replaces
 * character names, parent names, and verb conjugations based on the
 * student's profile stored in authStore.
 *
 * If no profile is loaded yet (pre-onboarding), the text is returned as-is.
 *
 * Usage:
 *   const personalize = usePersonalize();
 *   const output = personalize(rawStoryText);
 */
export function usePersonalize() {
  const profile = useAuthStore((state) => state.profile);

  return useCallback(
    (text: string): string => {
      if (!profile) return text;

      return personalizeText(text, {
        studentName: profile.studentName,
        gender: profile.gender,
        dadName: profile.dadName,
        momName: profile.momName,
        dadJob: profile.dadJob,
        momJob: profile.momJob,
      });
    },
    [profile],
  );
}
