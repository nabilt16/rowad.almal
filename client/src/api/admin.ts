import apiClient from './client';

export interface AdminUser {
  id: string;
  email: string;
  role: string;
  createdAt: string;
  updatedAt: string;
  profile: {
    studentName: string;
    onboarded: boolean;
  } | null;
}

export interface AdminUserDetail {
  id: string;
  email: string;
  role: string;
  createdAt: string;
  updatedAt: string;
  profile: {
    id: string;
    userId: string;
    studentName: string;
    gender: 'male' | 'female';
    whoWorks: 'dad' | 'mom' | 'both';
    dadName: string;
    dadJob: string;
    momName: string;
    momJob: string;
    onboarded: boolean;
  } | null;
  lessonProgress: {
    lessonId: string;
    completedAt: string;
  }[];
  userBadges: {
    id: string;
    earnedAt: string;
    badge: {
      id: string;
      icon: string;
      nameAr: string;
      badgeKey: string;
    };
  }[];
  streak: {
    currentStreak: number;
    longestStreak: number;
    lastActiveDate: string;
  } | null;
  bucketConfig: {
    allowance: number;
    spendBalance: number;
    saveBalance: number;
    giveBalance: number;
    saveGoalName: string;
    saveGoalPrice: number;
    giveGoalName: string;
    giveGoalPrice: number;
  } | null;
}

export interface AdminStats {
  totalUsers: number;
  onboardedUsers: number;
  totalLessons: number;
  completedProgressCount: number;
  activeBuckets: number;
}

export async function getUsers(): Promise<AdminUser[]> {
  const res = await apiClient.get<AdminUser[]>('/admin/users');
  return res.data;
}

export async function getUserById(id: string): Promise<AdminUserDetail> {
  const res = await apiClient.get<AdminUserDetail>(`/admin/users/${id}`);
  return res.data;
}

export async function updateLesson(id: string, data: Record<string, unknown>): Promise<unknown> {
  const res = await apiClient.put(`/admin/lessons/${id}`, data);
  return res.data;
}

export async function getStats(): Promise<AdminStats> {
  const res = await apiClient.get<AdminStats>('/admin/stats');
  return res.data;
}
