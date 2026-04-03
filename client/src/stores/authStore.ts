import { create } from 'zustand';
import type { User, StudentProfile } from '@rowad/shared';
import type { RegisterInput, LoginInput } from '@rowad/shared';
import * as authApi from '../api/auth';
import * as profileApi from '../api/profile';

interface AuthState {
  user: User | null;
  token: string | null;
  profile: StudentProfile | null;
  loading: boolean;
  error: string | null;

  login: (data: LoginInput) => Promise<void>;
  register: (data: RegisterInput) => Promise<void>;
  logout: () => void;
  loadUser: () => Promise<void>;
  clearError: () => void;
}

export const useAuthStore = create<AuthState>((set, get) => ({
  user: null,
  token: localStorage.getItem('token'),
  profile: null,
  loading: false,
  error: null,

  login: async (data) => {
    set({ loading: true, error: null });
    try {
      const res = await authApi.login(data);
      localStorage.setItem('token', res.token);
      set({ user: res.user, token: res.token, loading: false });
      // Load profile after login
      try {
        const profile = await profileApi.getProfile();
        set({ profile });
      } catch {
        // Profile may not exist yet (pre-onboarding)
      }
    } catch (err: unknown) {
      const message =
        (err as { response?: { data?: { message?: string } } })?.response?.data?.message ||
        'فشل تسجيل الدخول';
      set({ loading: false, error: message });
      throw err;
    }
  },

  register: async (data) => {
    set({ loading: true, error: null });
    try {
      const res = await authApi.register(data);
      localStorage.setItem('token', res.token);
      set({ user: res.user, token: res.token, loading: false });
    } catch (err: unknown) {
      const message =
        (err as { response?: { data?: { message?: string } } })?.response?.data?.message ||
        'فشل إنشاء الحساب';
      set({ loading: false, error: message });
      throw err;
    }
  },

  logout: () => {
    localStorage.removeItem('token');
    set({ user: null, token: null, profile: null, error: null });
  },

  loadUser: async () => {
    const token = get().token;
    if (!token) return;

    set({ loading: true });
    try {
      const user = await authApi.getMe();
      set({ user, loading: false });
      // Load profile
      try {
        const profile = await profileApi.getProfile();
        set({ profile });
      } catch {
        // Profile may not exist yet
      }
    } catch {
      localStorage.removeItem('token');
      set({ user: null, token: null, profile: null, loading: false });
    }
  },

  clearError: () => set({ error: null }),
}));
