import type { StudentProfile } from '@rowad/shared';
import type { OnboardingInput, ProfileUpdateInput } from '@rowad/shared';
import apiClient from './client';

export async function getProfile(): Promise<StudentProfile> {
  const res = await apiClient.get<StudentProfile>('/profile');
  return res.data;
}

export async function updateProfile(data: ProfileUpdateInput): Promise<StudentProfile> {
  const res = await apiClient.put<StudentProfile>('/profile', data);
  return res.data;
}

export async function completeOnboarding(data: OnboardingInput): Promise<StudentProfile> {
  const res = await apiClient.put<StudentProfile>('/profile/onboarding', data);
  return res.data;
}
