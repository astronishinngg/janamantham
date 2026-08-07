// Define rigorous TypeScript interfaces for backend contracts
export interface KPI {
  id: string;
  title: string;
  value: string | number;
  trend: string;
  isPositive: boolean;
  route: string;
}

export interface ChartDataPoint {
  name: string;
  [key: string]: string | number;
}

export interface AIAnalysisRecord {
  id: string;
  datasetName: string;
  startedAt: string;
  completedAt: string;
  status: 'Completed' | 'Processing' | 'Failed';
  confidence: number;
}

export interface ReportRecord {
  id: string;
  title: string;
  type: string;
  generatedDate: string;
  status: 'Approved' | 'Pending Review';
}

export interface AlertRecord {
  id: string;
  title: string;
  message: string;
  severity: 'Critical' | 'High' | 'Medium';
  time: string;
  relatedRoute: string;
}

export interface DashboardData {
  kpis: KPI[];
  trends: ChartDataPoint[];
  departments: ChartDataPoint[];
  categories: ChartDataPoint[];
  recentAnalysis: AIAnalysisRecord[];
  recentReports: ReportRecord[];
  alerts: AlertRecord[];
  lastAnalysisTime: string;
}

// Simulated Backend Implementation
export const dashboardService = {
  fetchDashboardData: async (dateRange: string, department: string): Promise<DashboardData> => {
    return new Promise((resolve) => {
      setTimeout(() => {
        resolve({
          lastAnalysisTime: 'August 2, 2026, 04:30 AM IST',
          kpis: [
            { id: 'kpi-1', title: 'Total Complaints', value: '45,210', trend: '+14% Volume', isPositive: false, route: '/analytics' },
            { id: 'kpi-2', title: 'Recurring Issues', value: '14,320', trend: '92% Similarity', isPositive: false, route: '/analytics' },
            { id: 'kpi-3', title: 'Root Causes Found', value: '4', trend: 'Critical Systemic', isPositive: true, route: '/root-cause' },
            { id: 'kpi-4', title: 'Policy Briefs', value: '2', trend: 'Ready for Review', isPositive: true, route: '/policy-briefs' },
            { id: 'kpi-5', title: 'States Covered', value: '8', trend: 'National Spread', isPositive: true, route: '/heatmap' },
            { id: 'kpi-6', title: 'Departments', value: '12', trend: 'Cross-functional', isPositive: true, route: '/analytics' },
          ],
          trends: [
            { name: 'Week 1', total: 450, recurring: 120 },
            { name: 'Week 2', total: 800, recurring: 300 },
            { name: 'Week 3', total: 1600, recurring: 750 },
            { name: 'Week 4', total: 4200, recurring: 2100 },
            { name: 'Week 5', total: 8900, recurring: 5400 },
            { name: 'Week 6', total: 18450, recurring: 12100 },
          ],
          departments: [
            { name: 'Agriculture', volume: 18450 },
            { name: 'Banking', volume: 12200 },
            { name: 'Telecom', volume: 8100 },
            { name: 'Labor', volume: 4300 },
            { name: 'Railways', volume: 2160 },
          ],
          categories: [
            { name: 'Financial Fraud', value: 35 },
            { name: 'Scheme Failure', value: 30 },
            { name: 'Service Outage', value: 20 },
            { name: 'Infrastructure', value: 15 },
          ],
          recentAnalysis: [
            { id: 'ANL-901', datasetName: 'Q2_CPGRAMS_National_Demo.csv', startedAt: '04:15 AM', completedAt: '04:30 AM', status: 'Completed', confidence: 96 },
            { id: 'ANL-899', datasetName: 'Telecom_Q1_Complaints.csv', startedAt: 'Yesterday', completedAt: 'Yesterday', status: 'Completed', confidence: 88 },
            { id: 'ANL-898', datasetName: 'Railways_Sanitation.csv', startedAt: '2 Days Ago', completedAt: '2 Days Ago', status: 'Completed', confidence: 94 },
          ],
          recentReports: [
            { id: 'PB-2026-0841', title: 'PM-KISAN NPCI Mapping Failures', type: 'Policy Brief', generatedDate: 'Today', status: 'Pending Review' },
            { id: 'RCA-2026-0792', title: 'Telecom Outage (Monsoon)', type: 'Root Cause', generatedDate: 'Yesterday', status: 'Approved' },
            { id: 'AR-2026-0711', title: 'Q2 National Grievance Trend', type: 'Analytics Report', generatedDate: '2 Days Ago', status: 'Approved' },
          ],
          alerts: [
            { id: 'al-1', title: 'Critical Anomaly Detected', message: '340% spike in agricultural scheme failures in Maharashtra.', severity: 'Critical', time: '1 hr ago', relatedRoute: '/root-cause' },
            { id: 'al-2', title: 'Policy Brief Ready', message: 'Manthan Engine has generated a new brief for Banking Frauds.', severity: 'Medium', time: '3 hrs ago', relatedRoute: '/policy-briefs' },
          ]
        });
      }, 1200); // Simulate real network delay for loading skeletons
    });
  }
};