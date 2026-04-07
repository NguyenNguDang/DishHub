import { create } from 'zustand';

export interface AppState {
  // UI State
  isSidebarOpen: boolean;
  toggleSidebar: () => void;
  setSidebarOpen: (open: boolean) => void;

  // Filter State
  selectedCategory: string | null;
  setSelectedCategory: (category: string | null) => void;

  // Search State
  searchQuery: string;
  setSearchQuery: (query: string) => void;

  // Modal State
  isModalOpen: boolean;
  setModalOpen: (open: boolean) => void;

  // Reset all state
  reset: () => void;
}

const initialState = {
  isSidebarOpen: false,
  selectedCategory: null,
  searchQuery: '',
  isModalOpen: false,
};

export const useAppStore = create<AppState>((set) => ({
  ...initialState,

  toggleSidebar: () => set((state) => ({ isSidebarOpen: !state.isSidebarOpen })),
  setSidebarOpen: (open) => set({ isSidebarOpen: open }),

  setSelectedCategory: (category) => set({ selectedCategory: category }),

  setSearchQuery: (query) => set({ searchQuery: query }),

  setModalOpen: (open) => set({ isModalOpen: open }),

  reset: () => set(initialState),
}));

