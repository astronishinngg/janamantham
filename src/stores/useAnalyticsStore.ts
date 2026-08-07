import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import { AnalyticsFilterParams, AnalyticsRecord } from '@/services/analyticsService';

interface AnalyticsState extends AnalyticsFilterParams {
  currentPage: number;
  pageSize: number;
  sortColumn: string;
  sortDirection: 'asc' | 'desc';
  selectedRecord: AnalyticsRecord | null;
  
  // Actions
  setFilter: (key: keyof AnalyticsFilterParams, value: string) => void;
  resetFilters: () => void;
  setCurrentPage: (page: number) => void;
  setSorting: (column: string) => void;
  setSelectedRecord: (record: AnalyticsRecord | null) => void;
}

const INITIAL_FILTERS: AnalyticsFilterParams = {
  state: 'All States',
  district: 'All Districts',
  department: 'All Departments',
  category: 'All Categories',
  dateRange: 'Q2 2026',
  priority: 'All Priorities',
  status: 'All Statuses',
  searchQuery: '',
};

export const useAnalyticsStore = create<AnalyticsState>()(
  persist(
    (set) => ({
      ...INITIAL_FILTERS,
      currentPage: 1,
      pageSize: 5,
      sortColumn: 'date',
      sortDirection: 'desc',
      selectedRecord: null,

      setFilter: (key, value) => set((state) => ({ [key]: value, currentPage: 1 })),
      resetFilters: () => set({ ...INITIAL_FILTERS, currentPage: 1 }),
      setCurrentPage: (currentPage) => set({ currentPage }),
      setSorting: (sortColumn) => set((state) => ({
        sortColumn,
        sortDirection: state.sortColumn === sortColumn && state.sortDirection === 'asc' ? 'desc' : 'asc'
      })),
      setSelectedRecord: (selectedRecord) => set({ selectedRecord }),
    }),
    {
      name: 'janamanthan-analytics-storage',
      partialize: (state) => ({ 
        state: state.state,
        department: state.department,
        category: state.category,
        priority: state.priority,
        status: state.status,
        dateRange: state.dateRange,
        searchQuery: state.searchQuery,
        pageSize: state.pageSize
      }),
    }
  )
);