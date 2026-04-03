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
  const user    = useAuthStore((state) => state.user);

  return useCallback(
    (text: string): string => {
      // Derive the best available name:
      // 1. profile.studentName (after onboarding)
      // 2. email username part (before @) as last resort
      const studentName =
        profile?.studentName || 'الطالب';

      return personalizeText(text, {
        studentName,
        gender:  profile?.gender  ?? 'male',
        dadName: profile?.dadName ?? '',
        momName: profile?.momName ?? '',
        dadJob:  profile?.dadJob  ?? '',
        momJob:  profile?.momJob  ?? '',
      });
    },
    [profile, user],
  );
}
