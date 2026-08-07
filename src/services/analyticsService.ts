export interface AnalyticsRecord {
  id: string;
  department: string;
  state: string;
  district: string;
  category: string;
  priority: 'Critical' | 'High' | 'Medium' | 'Low';
  status: 'Resolved' | 'Pending' | 'In Progress';
  description: string;
  aiSummary: string;
}

export interface AnalyticsKPI {
  id: string;
  title: string;
  value: string | number;
  trend: string;
  isPositive: boolean;
  route: string;
}

export interface TrendPoint {
  name: string;
  total: number;
  resolved: number;
}

export interface DepartmentPoint {
  name: string;
  volume: number;
  pending: number;
}

export interface Insight {
  id: string;
  title: string;
  confidence: number;
  reason: string;
  recommendation: string;
  route: string;
}

export interface AnalyticsData {
  kpis: AnalyticsKPI[];
  trendData: TrendPoint[];
  departmentData: DepartmentPoint[];
  tableRecords: AnalyticsRecord[];
  aiInsights: Insight[];
}

const mockAnalyticsData: AnalyticsData = {
  kpis: [
    { id: '1', title: 'Total Complaints', value: 12480, trend: '+12%', isPositive: true, route: '/analytics' },
    { id: '2', title: 'Resolved', value: 9830, trend: '+8%', isPositive: true, route: '/analytics' },
    { id: '3', title: 'Pending', value: 2650, trend: '-5%', isPositive: false, route: '/analytics' },
    { id: '4', title: 'States Covered', value: 28, trend: '+1', isPositive: true, route: '/india-heatmap' },
    { id: '5', title: 'Recurring Complaints', value: 312, trend: '+14%', isPositive: false, route: '/root-cause' },
    { id: '6', title: 'Avg Resolution', value: '6.4 days', trend: '-0.8', isPositive: true, route: '/analytics' },
  ],
  trendData: [
    { name: 'Jan', total: 920, resolved: 710 },
    { name: 'Feb', total: 1040, resolved: 820 },
    { name: 'Mar', total: 1180, resolved: 910 },
    { name: 'Apr', total: 1230, resolved: 970 },
    { name: 'May', total: 1310, resolved: 1030 },
    { name: 'Jun', total: 1420, resolved: 1110 },
  ],
  departmentData: [
    { name: 'Agriculture', volume: 1420, pending: 240 },
    { name: 'Banking', volume: 1180, pending: 190 },
    { name: 'Telecom', volume: 1680, pending: 310 },
    { name: 'Labor', volume: 920, pending: 140 },
    { name: 'Railways', volume: 1520, pending: 260 },
  ],
  tableRecords: [
    {
      id: 'REC-1001',
      department: 'Telecom',
      state: 'Maharashtra',
      district: 'Pune',
      category: 'Service Outage',
      priority: 'High',
      status: 'Pending',
      description: 'Repeated network disruptions affecting multiple wards.',
      aiSummary: 'Likely infrastructure congestion in last-mile towers.',
    },
    {
      id: 'REC-1002',
      department: 'Banking',
      state: 'Bihar',
      district: 'Patna',
      category: 'Financial Fraud',
      priority: 'Critical',
      status: 'Resolved',
      description: 'Unauthorized transaction dispute reported by user.',
      aiSummary: 'Pattern matches account compromise and delayed reversal.',
    },
    {
      id: 'REC-1003',
      department: 'Railways',
      state: 'Karnataka',
      district: 'Bengaluru',
      category: 'Infrastructure',
      priority: 'Medium',
      status: 'In Progress',
      description: 'Complaint about platform cleanliness and drainage.',
      aiSummary: 'Operational issue likely due to maintenance backlog.',
    },
  ],
  aiInsights: [
    {
      id: 'ins-1',
      title: 'Telecom outage cluster',
      confidence: 94,
      reason: 'Multiple nearby records show the same tower failure pattern.',
      recommendation: 'Escalate to regional network operations team.',
      route: '/root-cause',
    },
    {
      id: 'ins-2',
      title: 'Banking fraud spike',
      confidence: 91,
      reason: 'Recent complaints share suspicious transaction signatures.',
      recommendation: 'Trigger fraud review workflow and notify branch head.',
      route: '/root-cause',
    },
  ],
};

export const analyticsService = {
  async getAnalytics() {
    return mockAnalyticsData;
  },
  async exportCSV() {
    return true;
  },
  async exportPDF() {
    return true;
  },
  async shareReport() {
    return true;
  },
  printReport() {
    window.print();
  },
};