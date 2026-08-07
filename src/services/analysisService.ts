export interface AnalysisConfig {
  embeddingModel: string;
  similarityThreshold: number;
  minClusterSize: number;
  analysisMode: string;
  language: string;
  removePII: boolean;
  generateBrief: boolean;
}

export interface AnalysisResult {
  id: string;
  datasetId: string;
  totalProcessed: number;
  clustersFound: number;
  rootCausesFound: number;
  confidenceScore: number;
  affectedDepartments: number;
  affectedStates: number;
  topCategories: { name: string; count: number }[];
  clusters: { title: string; count: number; severity: string; description: string }[];
}

export const analysisService = {
  startAnalysis: async (datasetId: string, config: AnalysisConfig): Promise<{ analysisId: string }> => {
    return new Promise((resolve) => {
      setTimeout(() => {
        resolve({ analysisId: `anl-${Date.now()}` });
      }, 1000);
    });
  },

  getResults: async (analysisId: string): Promise<AnalysisResult> => {
    return new Promise((resolve) => {
      setTimeout(() => {
        resolve({
          id: analysisId,
          datasetId: 'ds-mock',
          totalProcessed: 45210,
          clustersFound: 18,
          rootCausesFound: 4,
          confidenceScore: 96,
          affectedDepartments: 5,
          affectedStates: 8,
          topCategories: [
            { name: 'Financial/Scheme Failure', count: 18450 },
            { name: 'Infrastructure/Outage', count: 12200 },
            { name: 'Software/Portal Error', count: 8100 },
          ],
          clusters: [
            { title: 'PM-KISAN NPCI-Aadhaar Mapping Failure', count: 18450, severity: 'Critical', description: 'Bank CBS systems failing to push updated mandate files to NPCI mapper.' },
            { title: 'BSNL Tower Structural Damage', count: 12200, severity: 'High', description: 'Monsoon-induced optical fiber cuts across southern states.' },
            { title: 'EPFO Mobile UI Defect', count: 8100, severity: 'Medium', description: 'Responsive CSS hiding the download passbook button on viewports under 400px.' },
          ]
        });
      }, 1000);
    });
  }
};