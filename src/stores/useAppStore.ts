import { create } from 'zustand';
import { persist } from 'zustand/middleware';

export interface User {
  id: string;
  name: string;
  role: string;
  department: string;
  email: string;
  avatarInitials: string;
}

interface AppState {
  isSidebarCollapsed: boolean;
  isMobileSidebarOpen: boolean;
  user: User | null;
  notifications: number;
  isAuthenticated: boolean;
  
  // Actions
  toggleSidebar: () => void;
  setMobileSidebar: (isOpen: boolean) => void;
  setUser: (user: User | null) => void;
  clearUser: () => void;
  setNotifications: (count: number) => void;
}

export const useAppStore = create<AppState>()(
  persist(
    (set) => ({
      isSidebarCollapsed: false,
      isMobileSidebarOpen: false,
      user: null, // Starts null for secure auth flow
      isAuthenticated: false,
      notifications: 3,
      
      toggleSidebar: () => set((state) => ({ isSidebarCollapsed: !state.isSidebarCollapsed })),
      setMobileSidebar: (isOpen) => set({ isMobileSidebarOpen: isOpen }),
      setUser: (user) => set({ user, isAuthenticated: !!user }),
      clearUser: () => set({ user: null, isAuthenticated: false }),
      setNotifications: (count) => set({ notifications: count }),
    }),
    {
      name: 'janamanthan-app-storage',
      partialize: (state) => ({ 
        isSidebarCollapsed: state.isSidebarCollapsed,
        user: state.user,
        isAuthenticated: state.isAuthenticated
      }),
    }
  )
);