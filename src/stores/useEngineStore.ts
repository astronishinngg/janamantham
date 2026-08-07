import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import { DatasetPreview } from '@/services/datasetService';
import { AnalysisConfig, AnalysisResult } from '@/services/analyticsService';

type EngineStep = 'IDLE' | 'PREVIEW' | 'PROCESSING' | 'COMPLETED';

interface EngineState {
  step: EngineStep;
  activeDataset: DatasetPreview | null;
  config: AnalysisConfig;
  activeAnalysisId: string | null;
  results: AnalysisResult | null;

  // Actions
  setStep: (step: EngineStep) => void;
  setActiveDataset: (dataset: DatasetPreview | null) => void;
  updateConfig: (updates: Partial<AnalysisConfig>) => void;
  startProcessing: (analysisId: string) => void;
  completeProcessing: (results: AnalysisResult) => void;
  resetEngine: () => void;
}

const DEFAULT_CONFIG: AnalysisConfig = {
  embeddingModel: 'BAAI/bge-large-en-v1.5',
  similarityThreshold: 85,
  minClusterSize: 50,
  analysisMode: 'Deep Semantic (Slower)',
  language: 'Multi-lingual (Indic)',
  removePII: true,
  generateBrief: true,
};

export const useEngineStore = create<EngineState>()(
  persist(
    (set) => ({
      step: 'IDLE',
      activeDataset: null,
      config: DEFAULT_CONFIG,
      activeAnalysisId: null,
      results: null,

      setStep: (step) => set({ step }),
      setActiveDataset: (dataset) => set({ activeDataset: dataset, step: dataset ? 'PREVIEW' : 'IDLE', activeAnalysisId: null, results: null }),
      updateConfig: (updates) => set((state) => ({ config: { ...state.config, ...updates } })),
      startProcessing: (analysisId) => set({ activeAnalysisId: analysisId, step: 'PROCESSING' }),
      completeProcessing: (results) => set({ results, step: 'COMPLETED' }),
      resetEngine: () => set({ step: 'IDLE', activeDataset: null, activeAnalysisId: null, results: null, config: DEFAULT_CONFIG }),
    }),
    {
      name: 'janamanthan-engine-state',
      partialize: (state) => ({ activeDataset: state.activeDataset, activeAnalysisId: state.activeAnalysisId, config: state.config, results: state.results, step: state.step }),
    }
  )
);