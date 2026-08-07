import { api } from './api';

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

export const datasetService = {
  uploadDataset: async (file: File): Promise<DatasetPreview> => {
    const formData = new FormData();
    formData.append('file', file);
    
    const response = await api.post('/upload', formData, {
      headers: { 'Content-Type': 'multipart/form-data' }
    });
    
    const data = response.data;
    return {
      id: data.upload_id,
      name: data.filename,
      size: `${(file.size / (1024 * 1024)).toFixed(1)} MB`,
      uploadedBy: 'Administrator',
      uploadedAt: 'Just now',
      totalRows: data.total_records,
      qualityScore: 98,
      departments: 7,
      states: 8,
      dateRange: 'Active Dataset',
      columns: (data.columns || []).map((c: string) => ({ name: c, type: 'String', missing: '0%' })),
      sampleData: []
    };
  },

  loadDemoDataset: async (): Promise<DatasetPreview> => {
    const response = await api.post('/upload-demo');
    const data = response.data;
    return {
      id: data.upload_id,
      name: data.filename,
      size: '2.5 MB',
      uploadedBy: 'Government Demo',
      uploadedAt: 'Just now',
      totalRows: data.total_records,
      qualityScore: 99,
      departments: 7,
      states: 8,
      dateRange: 'National Grievances Sample',
      columns: (data.columns || []).map((c: string) => ({ name: c, type: 'String', missing: '0%' })),
      sampleData: []
    };
  },

  getRecentDatasets: async (): Promise<Partial<DatasetPreview>[]> => {
    return [
      { id: 'demo-250', name: 'sample_grievances.csv', size: '2.5 MB', uploadedBy: 'System Demo', uploadedAt: 'Recent', totalRows: 250, qualityScore: 98 }
    ];
  },

  deleteDataset: async (_id: string): Promise<void> => {},

  getMockPreview: (name: string): DatasetPreview => ({
    id: `ds-${Math.floor(Math.random() * 1000)}`,
    name,
    size: '42.5 MB',
    uploadedBy: 'Administrator',
    uploadedAt: 'Just now',
    totalRows: 250,
    qualityScore: 98,
    departments: 7,
    states: 8,
    dateRange: 'Active Grievance Dataset',
    columns: [
      { name: 'Grievance_ID', type: 'String', missing: '0%' },
      { name: 'Department', type: 'String', missing: '0%' },
      { name: 'Location', type: 'String', missing: '0%' },
      { name: 'Description', type: 'Text', missing: '0%' },
    ],
    sampleData: []
  })
};