import { create } from 'zustand';
import { persist } from 'zustand/middleware';

interface DashboardState {
  dateRange: string;
  selectedDepartment: string;
  activeDataset: string;
  
  setDateRange: (range: string) => void;
  setDepartment: (dept: string) => void;
  setActiveDataset: (dataset: string) => void;
  resetFilters: () => void;
}

export const useDashboardStore = create<DashboardState>()(
  persist(
    (set) => ({
      dateRange: 'Q2 2026',
      selectedDepartment: 'All Departments',
      activeDataset: 'Q2_CPGRAMS_National_Demo.csv',
      
      setDateRange: (range) => set({ dateRange: range }),
      setDepartment: (dept) => set({ selectedDepartment: dept }),
      setActiveDataset: (dataset) => set({ activeDataset: dataset }),
      resetFilters: () => set({ dateRange: 'Q2 2026', selectedDepartment: 'All Departments' }),
    }),
    {
      name: 'janamanthan-dashboard-storage',
    }
  )
);