import { 
  LayoutDashboard, BrainCircuit, BarChart3, Map, 
  Target, FileText, FileBarChart2, Settings
} from 'lucide-react';
import { ROUTES } from './routes';

export const SIDEBAR_ITEMS = [
  { path: ROUTES.DASHBOARD, label: 'Dashboard', icon: LayoutDashboard },
  { path: ROUTES.MANTHAN_ENGINE, label: 'Manthan Engine', icon: BrainCircuit },
  { path: ROUTES.ANALYTICS, label: 'Analytics', icon: BarChart3 },
  { path: ROUTES.INDIA_HEATMAP, label: 'India Heatmap', icon: Map },
  { path: ROUTES.ROOT_CAUSE, label: 'Root Cause Analysis', icon: Target },
  { path: ROUTES.POLICY_BRIEFS, label: 'Policy Briefs', icon: FileText },
  { path: ROUTES.REPORTS, label: 'Reports', icon: FileBarChart2 },
  { path: ROUTES.SETTINGS, label: 'Settings', icon: Settings },
];