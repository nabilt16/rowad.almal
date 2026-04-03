import type { GlossaryUnit } from '@rowad/shared';
import apiClient from './client';

export async function getGlossary(gradeNumber: number): Promise<GlossaryUnit[]> {
  const res = await apiClient.get<GlossaryUnit[]>(`/glossary/${gradeNumber}`);
  return res.data;
}
