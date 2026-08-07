import { create } from 'zustand';
import { User, UserRole, LoginCredentials } from '../types/auth';
import { authService } from '../services/authService';

interface AuthState {
  user: User | null;
  accessToken: string | null;
  role: UserRole | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  isInitialized: boolean;
  
  // Actions
  login: (credentials: LoginCredentials) => Promise<void>;
  logout: () => Promise<void>;
  fetchCurrentUser: () => Promise<void>;
  setAuthSuccess: (token: string, role: UserRole) => void;
  clearAuth: () => void;
}

export const useAuthStore = create<AuthState>((set, get) => ({
  user: null,
  accessToken: null,
  role: null,
  isAuthenticated: false,
  isLoading: false,
  isInitialized: false, // Used to prevent layout shifts while checking session on mount

  login: async (credentials) => {
    set({ isLoading: true });
    try {
      const data = await authService.login(credentials);
      set({ 
        accessToken: data.access_token, 
        role: data.role, 
        isAuthenticated: true 
      });
      await get().fetchCurrentUser();
    } finally {
      set({ isLoading: false });
    }
  },

  logout: async () => {
    set({ isLoading: true });
    try {
      await authService.logout();
    } catch (error) {
      console.error("Logout API failed, clearing local state anyway", error);
    } finally {
      get().clearAuth();
    }
  },

  fetchCurrentUser: async () => {
    if (!get().accessToken) return;
    try {
      const user = await authService.getCurrentUser();
      set({ user, isInitialized: true });
    } catch (error) {
      get().clearAuth();
    }
  },

  setAuthSuccess: (token, role) => {
    set({ accessToken: token, role: role, isAuthenticated: true });
  },

  clearAuth: () => {
    set({ 
      user: null, 
      accessToken: null, 
      role: null, 
      isAuthenticated: false,
      isLoading: false,
      isInitialized: true 
    });
  }
}));