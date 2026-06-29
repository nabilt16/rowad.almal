import { create } from 'zustand';

interface UIState {
  sidebarOpen: boolean;
  activeTab: string;
  loading: boolean;
  personalBudget: number | null;   // set by budget onboarding, null = not yet chosen
  dreamName: string | null;        // financial dream name
  dreamCost: number | null;        // estimated cost of dream

  toggleSidebar: () => void;
  setSidebarOpen: (open: boolean) => void;
  setActiveTab: (tab: string) => void;
  setLoading: (loading: boolean) => void;
  setPersonalBudget: (budget: number) => void;
  setDream: (name: string, cost: number) => void;
}

export const useUIStore = create<UIState>((set) => ({
  sidebarOpen: false,
  activeTab: 'lessons',
  loading: false,
  personalBudget: null,
  dreamName: null,
  dreamCost: null,

  toggleSidebar: () => set((s) => ({ sidebarOpen: !s.sidebarOpen })),
  setSidebarOpen: (open) => set({ sidebarOpen: open }),
  setActiveTab: (tab) => set({ activeTab: tab }),
  setLoading: (loading) => set({ loading }),
  setPersonalBudget: (budget) => set({ personalBudget: budget }),
  setDream: (name, cost) => set({ dreamName: name, dreamCost: cost }),
}));
