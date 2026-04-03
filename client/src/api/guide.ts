import type { GuideUnit } from '@rowad/shared';
import apiClient from './client';

export async function getGuide(gradeNumber: number): Promise<GuideUnit[]> {
  const res = await apiClient.get<GuideUnit[]>(`/guide/${gradeNumber}`);
  return res.data;
}
