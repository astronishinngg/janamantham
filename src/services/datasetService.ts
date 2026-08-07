export interface DatasetColumn {
  name: string;
  type: string;
  missing: string;
}

export interface DatasetPreview {
  id: string;
  name: string;
  size: string;
  uploadedBy: string;
  uploadedAt: string;
  totalRows: number;
  qualityScore: number;
  departments: number;
  states: number;
  dateRange: string;
  columns: DatasetColumn[];
  sampleData: Record<string, string | number>[];
}

// STRICT NAMED EXPORT
export const datasetService = {
  uploadDataset: async (file: File): Promise<DatasetPreview> => {
    return new Promise((resolve) => {
      setTimeout(() => {
        resolve(datasetService.getMockPreview(file.name));
      }, 1500);
    });
  },

  loadDemoDataset: async (): Promise<DatasetPreview> => {
    return new Promise((resolve) => {
      setTimeout(() => {
        resolve(datasetService.getMockPreview('Q2_CPGRAMS_National_Demo.csv'));
      }, 800);
    });
  },

  getRecentDatasets: async (): Promise<Partial<DatasetPreview>[]> => {
    return new Promise((resolve) => {
      setTimeout(() => {
        resolve([
          { id: 'ds-101', name: 'Q2_CPGRAMS_National_Demo.csv', size: '42.5 MB', uploadedBy: 'Arvind Sharma', uploadedAt: '2 hours ago', totalRows: 45210, qualityScore: 98 },
          { id: 'ds-100', name: 'Telecom_Q1_Complaints.csv', size: '18.2 MB', uploadedBy: 'System', uploadedAt: 'Yesterday', totalRows: 14200, qualityScore: 92 },
        ]);
      }, 500);
    });
  },

  deleteDataset: async (id: string): Promise<void> => {
    return new Promise((resolve) => setTimeout(resolve, 800));
  },

  getMockPreview: (name: string): DatasetPreview => ({
    id: `ds-${Math.floor(Math.random() * 1000)}`,
    name,
    size: '42.5 MB',
    uploadedBy: 'Arvind Sharma',
    uploadedAt: 'Just now',
    totalRows: 45210,
    qualityScore: 98,
    departments: 12,
    states: 8,
    dateRange: 'Apr 1, 2026 - Jun 30, 2026',
    columns: [
      { name: 'Grievance_ID', type: 'String', missing: '0%' },
      { name: 'Date_Received', type: 'DateTime', missing: '0%' },
      { name: 'Department', type: 'String', missing: '0.2%' },
      { name: 'State', type: 'String', missing: '0.5%' },
      { name: 'Description', type: 'Text', missing: '1.2%' },
    ],
    sampleData: [
      { Grievance_ID: 'CPG-26-001', Date_Received: '2026-04-12', Department: 'Agriculture', State: 'Maharashtra', Description: 'PM-KISAN 14th installment not credited. Bank says Aadhaar not mapped to NPCI.' },
      { Grievance_ID: 'CPG-26-002', Date_Received: '2026-04-12', Department: 'Telecom', State: 'Karnataka', Description: 'No BSNL network in village for 5 days following heavy rains.' },
      { Grievance_ID: 'CPG-26-003', Date_Received: '2026-04-13', Department: 'Labor', State: 'Delhi', Description: 'Unable to download PF passbook on mobile app. Button is missing.' },
      { Grievance_ID: 'CPG-26-004', Date_Received: '2026-04-13', Department: 'Agriculture', State: 'Uttar Pradesh', Description: 'NPCI mapping error showing on PM-KISAN portal despite eKYC completion.' },
    ]
  })
};