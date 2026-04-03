import { create } from 'zustand';
import type { BucketConfig, BucketTransaction } from '@rowad/shared';
import type { BucketSetupInput, BucketIncomeInput, BucketUseInput } from '@rowad/shared';
import * as bucketsApi from '../api/buckets';

interface BucketState {
  config: BucketConfig | null;
  transactions: BucketTransaction[];
  loading: boolean;
  error: string | null;

  fetchBuckets: () => Promise<void>;
  setupBuckets: (data: BucketSetupInput) => Promise<void>;
  addIncome: (amount: number) => Promise<void>;
  useBucket: (data: BucketUseInput) => Promise<void>;
  resetBuckets: () => Promise<void>;
  clearBuckets: () => void;
}

export const useBucketStore = create<BucketState>((set, get) => ({
  config: null,
  transactions: [],
  loading: false,
  error: null,

  fetchBuckets: async () => {
    set({ loading: true, error: null });
    try {
      const state = await bucketsApi.getBuckets();
      set({
        config: state.config,
        transactions: state.transactions,
        loading: false,
      });
    } catch {
      set({ loading: false, error: 'فشل تحميل الدلاء' });
    }
  },

  setupBuckets: async (data: BucketSetupInput) => {
    set({ loading: true, error: null });
    try {
      const config = await bucketsApi.setupBuckets(data);
      set({ config, loading: false });
    } catch {
      set({ loading: false, error: 'فشل إعداد الدلاء' });
    }
  },

  addIncome: async (amount: number) => {
    set({ loading: true, error: null });
    try {
      await bucketsApi.addIncome({ amount });
      // Re-fetch to get updated balances and transactions
      await get().fetchBuckets();
    } catch {
      set({ loading: false, error: 'فشل إضافة الدخل' });
    }
  },

  useBucket: async (data: BucketUseInput) => {
    set({ loading: true, error: null });
    try {
      await bucketsApi.useBucket(data);
      // Re-fetch to get updated balances and transactions
      await get().fetchBuckets();
    } catch {
      set({ loading: false, error: 'فشل استخدام الدلو' });
    }
  },

  resetBuckets: async () => {
    set({ loading: true, error: null });
    try {
      await bucketsApi.resetBuckets();
      set({ config: null, transactions: [], loading: false });
    } catch {
      set({ loading: false, error: 'فشل إعادة تعيين الدلاء' });
    }
  },

  clearBuckets: () => set({ config: null, transactions: [] }),
}));
