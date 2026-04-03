import type { AuthResponse, User } from '@rowad/shared';
import type { RegisterInput, LoginInput } from '@rowad/shared';
import apiClient from './client';

export async function register(data: RegisterInput): Promise<AuthResponse> {
  const res = await apiClient.post<AuthResponse>('/auth/register', data);
  return res.data;
}

export async function login(data: LoginInput): Promise<AuthResponse> {
  const res = await apiClient.post<AuthResponse>('/auth/login', data);
  return res.data;
}

export async function getMe(): Promise<User> {
  const res = await apiClient.get<User>('/auth/me');
  return res.data;
}
