import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import { UserProfile } from '@/services/profileService';

interface Preferences {
  language: string;
  theme: string;
  timezone: string;
  dateFormat: string;
  timeFormat: string;
  dashboardDefault: string;
}

interface Notifications {
  email: boolean;
  browser: boolean;
  aiAnalysis: boolean;
  policyBrief: boolean;
  criticalAlerts: boolean;
  weeklySummary: boolean;
  monthlyReport: boolean;
}

interface SettingsState {
  profile: UserProfile | null;
  preferences: Preferences;
  notifications: Notifications;
  
  setProfile: (profile: Partial<UserProfile>) => void;
  setPreference: (key: keyof Preferences, value: string) => void;
  setNotification: (key: keyof Notifications, value: boolean) => void;
}

const DEFAULT_PREFERENCES: Preferences = {
  language: 'English',
  theme: 'Light', // Forced to light as per requirements
  timezone: 'Asia/Kolkata',
  dateFormat: 'DD/MM/YYYY',
  timeFormat: '12h',
  dashboardDefault: 'Analytics',
};

const DEFAULT_NOTIFICATIONS: Notifications = {
  email: true,
  browser: true,
  aiAnalysis: true,
  policyBrief: true,
  criticalAlerts: true,
  weeklySummary: false,
  monthlyReport: true,
};

export const useSettingsStore = create<SettingsState>()(
  persist(
    (set) => ({
      profile: null,
      preferences: DEFAULT_PREFERENCES,
      notifications: DEFAULT_NOTIFICATIONS,

      setProfile: (updates) => set((state) => ({ 
        profile: state.profile ? { ...state.profile, ...updates } : updates as UserProfile 
      })),
      setPreference: (key, value) => set((state) => ({ 
        preferences: { ...state.preferences, [key]: value } 
      })),
      setNotification: (key, value) => set((state) => ({ 
        notifications: { ...state.notifications, [key]: value } 
      })),
    }),
    {
      name: 'janamanthan-settings-storage',
    }
  )
);