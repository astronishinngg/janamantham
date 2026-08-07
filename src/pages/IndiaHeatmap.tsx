import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  MapContainer, TileLayer, CircleMarker, Tooltip as LeafletTooltip, useMap 
} from 'react-leaflet';
import 'leaflet/dist/leaflet.css';
import { 
  ChevronRight, Download, Maximize, Search, Filter, Map as MapIcon, 
  Activity, ShieldCheck, Database, Target, FileText, AlertTriangle, 
  X, ChevronDown, TrendingUp, Crosshair, BrainCircuit, Building2 
} from 'lucide-react';
import { 
  BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip as RechartsTooltip, 
  ResponsiveContainer, AreaChart, Area 
} from 'recharts';

// ============================================================================
// MOCK DATA: GIS & DASHBOARD
// ============================================================================

const LAST_UPDATED = "Sunday, August 2, 2026, 7:04 PM IST";

type RiskLevel = 'Low' | 'Moderate' | 'High' | 'Critical';

interface StateData {
  id: string;
  name: string;
  coords: [number, number];
  complaints: number;
  recurring: number;
  riskScore: number;
  riskLevel: RiskLevel;
  topDept: string;
  topCategory: string;
  radius: number;
  color: string;
}

const stateGeoData: StateData[] = [
  { id: 'MH', name: 'Maharashtra', coords: [19.7515, 75.7139], complaints: 14520, recurring: 9800, riskScore: 88, riskLevel: 'Critical', topDept: 'Agriculture (PM-KISAN)', topCategory: 'Scheme Disbursement', radius: 24, color: '#ef4444' },
  { id: 'UP', name: 'Uttar Pradesh', coords: [26.8467, 80.9462], complaints: 12400, recurring: 7200, riskScore: 76, riskLevel: 'High', topDept: 'Agriculture', topCategory: 'Fund Delay', radius: 22, color: '#F57C00' },
  { id: 'GJ', name: 'Gujarat', coords: [22.2587, 71.1924], complaints: 8100, recurring: 6500, riskScore: 82, riskLevel: 'High', topDept: 'Banking & Finance', topCategory: 'Financial Fraud', radius: 18, color: '#F57C00' },
  { id: 'KA', name: 'Karnataka', coords: [15.3173, 75.7139], complaints: 5200, recurring: 2100, riskScore: 45, riskLevel: 'Moderate', topDept: 'Telecom', topCategory: 'Service Outage', radius: 14, color: '#eab308' },
  { id: 'BR', name: 'Bihar', coords: [25.0961, 85.3131], complaints: 4800, recurring: 1900, riskScore: 52, riskLevel: 'Moderate', topDept: 'Railways', topCategory: 'Infrastructure', radius: 14, color: '#eab308' },
  { id: 'DL', name: 'Delhi NCR', coords: [28.7041, 77.1025], complaints: 9200, recurring: 7800, riskScore: 91, riskLevel: 'Critical', topDept: 'Municipal', topCategory: 'Sanitation & Roads', radius: 20, color: '#ef4444' },
  { id: 'TN', name: 'Tamil Nadu', coords: [11.1271, 78.6569], complaints: 3100, recurring: 800, riskScore: 24, riskLevel: 'Low', topDept: 'Education', topCategory: 'Portal Issue', radius: 10, color: '#1E8E3E' },
  { id: 'RJ', name: 'Rajasthan', coords: [27.0238, 74.2179], complaints: 7400, recurring: 4300, riskScore: 68, riskLevel: 'High', topDept: 'Water Resources', topCategory: 'Pipeline Leakage', radius: 16, color: '#F57C00' },
  { id: 'MP', name: 'Madhya Pradesh', coords: [22.9734, 78.6569], complaints: 6800, recurring: 3900, riskScore: 62, riskLevel: 'High', topDept: 'Rural Dev', topCategory: 'PMAY Scheme', radius: 16, color: '#F57C00' },
  { id: 'WB', name: 'West Bengal', coords: [22.9868, 87.8550], complaints: 5900, recurring: 3100, riskScore: 55, riskLevel: 'Moderate', topDept: 'Food & Supplies', topCategory: 'Ration Distribution', radius: 14, color: '#eab308' },
  { id: 'TG', name: 'Telangana', coords: [18.1124, 79.0193], complaints: 4600, recurring: 1800, riskScore: 42, riskLevel: 'Moderate', topDept: 'Power & Electricity', topCategory: 'Billing Dispute', radius: 12, color: '#eab308' },
  { id: 'AP', name: 'Andhra Pradesh', coords: [15.9129, 79.7400], complaints: 4200, recurring: 1500, riskScore: 38, riskLevel: 'Moderate', topDept: 'Revenue', topCategory: 'Land Records', radius: 12, color: '#eab308' },
  { id: 'KL', name: 'Kerala', coords: [10.8505, 76.2711], complaints: 2800, recurring: 600, riskScore: 20, riskLevel: 'Low', topDept: 'Health', topCategory: 'Hospital Supply', radius: 10, color: '#1E8E3E' },
  { id: 'PB', name: 'Punjab', coords: [31.1471, 75.3412], complaints: 3900, recurring: 1400, riskScore: 48, riskLevel: 'Moderate', topDept: 'Agriculture', topCategory: 'Fertilizer Subsidy', radius: 12, color: '#eab308' },
  { id: 'HR', name: 'Haryana', coords: [29.0588, 76.0856], complaints: 4100, recurring: 1700, riskScore: 50, riskLevel: 'Moderate', topDept: 'Urban Local Bodies', topCategory: 'Property Tax ID', radius: 12, color: '#eab308' },
  { id: 'OR', name: 'Odisha', coords: [20.9517, 85.0985], complaints: 3500, recurring: 1100, riskScore: 35, riskLevel: 'Low', topDept: 'Disaster Mgmt', topCategory: 'Relief Fund', radius: 10, color: '#1E8E3E' },
  { id: 'AS', name: 'Assam', coords: [26.2006, 92.9376], complaints: 2900, recurring: 900, riskScore: 30, riskLevel: 'Low', topDept: 'Flood Relief', topCategory: 'Infrastructure Damage', radius: 10, color: '#1E8E3E' },
  { id: 'JH', name: 'Jharkhand', coords: [23.6102, 85.2799], complaints: 3400, recurring: 1200, riskScore: 44, riskLevel: 'Moderate', topDept: 'Mining & Welfare', topCategory: 'Displacement Grants', radius: 11, color: '#eab308' },
  { id: 'CG', name: 'Chhattisgarh', coords: [21.2787, 81.8661], complaints: 3100, recurring: 1000, riskScore: 36, riskLevel: 'Low', topDept: 'Forest & Tribal', topCategory: 'Patta Allotment', radius: 10, color: '#1E8E3E' },
  { id: 'UK', name: 'Uttarakhand', coords: [30.0668, 79.0193], complaints: 2200, recurring: 500, riskScore: 22, riskLevel: 'Low', topDept: 'Tourism & Roads', topCategory: 'Landslide Maintenance', radius: 9, color: '#1E8E3E' },
  { id: 'HP', name: 'Himachal Pradesh', coords: [31.1048, 77.1734], complaints: 1800, recurring: 400, riskScore: 18, riskLevel: 'Low', topDept: 'Horticulture', topCategory: 'Apple Transport', radius: 8, color: '#1E8E3E' },
  { id: 'JK', name: 'Jammu & Kashmir', coords: [33.7782, 76.5762], complaints: 2600, recurring: 700, riskScore: 28, riskLevel: 'Low', topDept: 'Public Works', topCategory: 'Snow Clearance', radius: 9, color: '#1E8E3E' },
  { id: 'GA', name: 'Goa', coords: [15.2993, 74.1240], complaints: 950, recurring: 150, riskScore: 12, riskLevel: 'Low', topDept: 'Tourism', topCategory: 'Taxi Regulation', radius: 7, color: '#1E8E3E' },
  { id: 'TR', name: 'Tripura', coords: [23.9408, 91.9882], complaints: 820, recurring: 120, riskScore: 15, riskLevel: 'Low', topDept: 'Education', topCategory: 'School Infra', radius: 7, color: '#1E8E3E' },
  { id: 'ML', name: 'Meghalaya', coords: [25.4670, 91.3662], complaints: 710, recurring: 90, riskScore: 10, riskLevel: 'Low', topDept: 'Public Health', topCategory: 'Sub-center Access', radius: 6, color: '#1E8E3E' }
];

const stateChartData = [
  { name: 'Agri', value: 4500 },
  { name: 'Bank', value: 3200 },
  { name: 'Tele', value: 2100 },
  { name: 'Rail', value: 1800 },
];

const stateTrendData = [
  { day: 'Mon', count: 120 }, { day: 'Tue', count: 250 }, { day: 'Wed', count: 400 },
  { day: 'Thu', count: 380 }, { day: 'Fri', count: 520 }, { day: 'Sat', count: 610 },
  { day: 'Sun', count: 850 },
];

const hotspotRanking = [
  { rank: 1, state: 'Maharashtra', district: 'Pune', complaints: '4,520', risk: 94, priority: 'Critical', trend: 'up' },
  { rank: 2, state: 'Delhi', district: 'Central', complaints: '3,840', risk: 91, priority: 'Critical', trend: 'up' },
  { rank: 3, state: 'Gujarat', district: 'Ahmedabad', complaints: '3,100', risk: 85, priority: 'High', trend: 'up' },
  { rank: 4, state: 'Uttar Pradesh', district: 'Lucknow', complaints: '2,950', risk: 78, priority: 'High', trend: 'up' },
  { rank: 5, state: 'Karnataka', district: 'Bangalore', complaints: '2,100', risk: 45, priority: 'Moderate', trend: 'down' },
];

const aiGeoInsights = [
  { title: 'Highest Risk Region', summary: 'Maharashtra shows a 34% spike in PM-KISAN related grievances.', priority: 'Critical', confidence: '96%' },
  { title: 'Emerging Hotspot', summary: 'Gujarat banking fraud clusters are expanding into rural districts.', priority: 'High', confidence: '88%' },
  { title: 'Cross-State Pattern', summary: 'Telecom outages simultaneously affecting Karnataka & Tamil Nadu borders.', priority: 'Medium', confidence: '92%' },
  { title: 'Most Improved', summary: 'Railway infrastructure complaints dropped 40% in Bihar this week.', priority: 'Low', confidence: '98%' },
];

// ============================================================================
// UTILITIES & ANIMATIONS
// ============================================================================

const containerVariants = { hidden: { opacity: 0 }, visible: { opacity: 1, transition: { staggerChildren: 0.1 } } };
const itemVariants = { hidden: { opacity: 0, y: 15 }, visible: { opacity: 1, y: 0, transition: { duration: 0.4 } } };
const slidePanelVariants = { hidden: { x: '100%', opacity: 0 }, visible: { x: 0, opacity: 1, transition: { type: 'spring', damping: 25, stiffness: 200 } }, exit: { x: '100%', opacity: 0, transition: { duration: 0.2 } } };

// Map bounds controller component
const MapController = ({ center, zoom }: { center: [number, number], zoom: number }) => {
  const map = useMap();
  map.setView(center, zoom, { animate: true, duration: 1 });
  return null;
};

// ============================================================================
// MAIN COMPONENT
// ============================================================================

export const IndiaHeatmap: React.FC = () => {
  const [selectedState, setSelectedState] = useState<StateData | null>(null);
  const [isFullscreen, setIsFullscreen] = useState(false);

  return (
    <motion.div variants={containerVariants} initial="hidden" animate="visible" className="space-y-6 pb-10">
      
      {/* 1. GLOBAL HEADER */}
      <motion.div variants={itemVariants} className="flex flex-col lg:flex-row lg:items-center justify-between gap-4 bg-white p-5 rounded-xl border border-[#E2E8F0] shadow-sm">
        <div>
          <div className="flex items-center gap-2 text-sm text-[#64748B] mb-1 font-medium">
            <span className="hover:text-[#0B2E59] cursor-pointer">Dashboard</span>
            <ChevronRight className="w-4 h-4" />
            <span className="text-[#0B2E59] font-semibold">India Heatmap</span>
          </div>
          <h1 className="text-2xl font-['Poppins'] font-bold text-[#1E293B] flex items-center gap-2">
            <MapIcon className="w-6 h-6 text-[#0B2E59]" /> Geo-Intelligence Platform
          </h1>
        </div>
        
        <div className="flex flex-wrap items-center gap-3">
          <div className="relative">
            <Search className="w-4 h-4 text-[#64748B] absolute left-3 top-1/2 -translate-y-1/2" />
            <input 
              type="text" 
              placeholder="Search State or District..." 
              className="pl-9 pr-4 py-2 bg-[#F8FAFC] border border-[#E2E8F0] rounded-lg text-sm focus:outline-none focus:border-[#0B2E59] focus:ring-1 focus:ring-[#0B2E59] w-64"
            />
          </div>
          <span className="hidden md:block text-xs text-[#64748B] bg-[#F8FAFC] px-3 py-2 rounded-lg border border-[#E2E8F0]">
            Last Sync: {LAST_UPDATED}
          </span>
          <button 
            onClick={() => setIsFullscreen(!isFullscreen)}
            className="p-2 border border-[#E2E8F0] text-[#64748B] hover:text-[#0B2E59] hover:bg-[#F8FAFC] rounded-lg transition-colors"
            title="Toggle Fullscreen"
          >
            <Maximize className="w-4 h-4" />
          </button>
          <button className="flex items-center gap-2 px-4 py-2 bg-[#0B2E59] text-white text-sm font-semibold rounded-lg shadow-sm hover:bg-[#082244] transition-colors">
            <Download className="w-4 h-4" /> Export Map
          </button>
        </div>
      </motion.div>

      {/* 2. SMART FILTER PANEL */}
      <motion.div variants={itemVariants} className="bg-white p-4 rounded-xl border border-[#E2E8F0] shadow-sm flex items-center gap-4 overflow-x-auto hide-scrollbar">
        <div className="flex items-center gap-2 text-[#64748B] font-semibold text-sm pl-2 pr-4 border-r border-[#E2E8F0] shrink-0">
          <Filter className="w-4 h-4" /> Parameters
        </div>
        
        {['All States', 'All Districts', 'Dept: Agriculture', 'Category: Any', 'Priority: Critical', 'Last 7 Days', 'Risk: > 80'].map((filter, i) => (
          <select key={i} className="bg-[#F8FAFC] border border-[#E2E8F0] text-[#1E293B] text-sm font-medium rounded-lg px-3 py-1.5 outline-none hover:border-[#0B2E59]/50 transition-colors cursor-pointer shrink-0 appearance-none pr-8 relative bg-[url('data:image/svg+xml;charset=US-ASCII,%3Csvg%20xmlns%3D%22http%3A%2F%2Fwww.w3.org%2F2000%2Fsvg%22%20width%3D%2216%22%20height%3D%2216%22%20viewBox%3D%220%200%2024%2024%22%20fill%3D%22none%22%20stroke%3D%22%2364748B%22%20stroke-width%3D%222%22%20stroke-linecap%3D%22round%22%20stroke-linejoin%3D%22round%22%3E%3Cpolyline%20points%3D%226%209%2012%2015%2018%209%22%3E%3C%2Fpolyline%3E%3C%2Fsvg%3E')] bg-no-repeat bg-[position:right_8px_center]">
            <option>{filter}</option>
          </select>
        ))}
        
        <div className="ml-auto pl-4 flex gap-2 shrink-0">
          <button className="text-sm font-semibold text-[#0B2E59] hover:underline px-2">Reset</button>
          <button className="text-sm font-semibold bg-[#0B2E59] text-white px-4 py-1.5 rounded-lg hover:bg-[#082244]">Apply</button>
        </div>
      </motion.div>

      {/* 3. HERO: INTERACTIVE INDIA MAP & SLIDE PANEL */}
      <motion.div variants={itemVariants} className={`relative bg-white border border-[#E2E8F0] shadow-sm rounded-xl overflow-hidden flex ${isFullscreen ? 'fixed inset-4 z-50' : 'h-[650px]'}`}>
        
        {/* Map Container */}
        <div className="flex-1 relative z-0">
          <MapContainer 
            center={[22.5937, 78.9629]} 
            zoom={5} 
            scrollWheelZoom={true} 
            className="w-full h-full bg-[#f3f4f6]"
            zoomControl={false}
          >
            {/* Enterprise CartoDB Positron Basemap for clean data viz */}
            <TileLayer
              attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors &copy; <a href="https://carto.com/attributions">CARTO</a>'
              url="https://{s}.basemaps.cartocdn.com/light_all/{z}/{x}/{y}{r}.png"
            />
            
            {/* Control view based on selection */}
            {selectedState && <MapController center={selectedState.coords} zoom={7} />}
            {!selectedState && <MapController center={[22.5937, 78.9629]} zoom={5} />}

            {stateGeoData.map((state) => (
              <CircleMarker
                key={state.id}
                center={state.coords}
                radius={state.radius}
                pathOptions={{ 
                  fillColor: state.color, 
                  fillOpacity: 0.6, 
                  color: state.color, 
                  weight: 2 
                }}
                eventHandlers={{
                  click: () => setSelectedState(state),
                }}
              >
                <LeafletTooltip direction="top" offset={[0, -10]} opacity={0.95} permanent={true} className="custom-leaflet-tooltip">
                  <div className="px-2 py-1 font-['Inter'] text-center">
                    <div className="font-bold text-[#0B2E59] text-xs leading-none">{state.name}</div>
                    <div className="text-[10px] text-[#F57C00] font-semibold mt-0.5">{state.complaints.toLocaleString()} cases</div>
                  </div>
                </LeafletTooltip>
              </CircleMarker>
            ))}
          </MapContainer>

          {/* Map Overlays: Legend */}
          <div className="absolute bottom-6 left-6 z-[400] bg-white/90 backdrop-blur-md p-4 rounded-xl border border-[#E2E8F0] shadow-lg pointer-events-auto">
            <h4 className="font-['Poppins'] font-bold text-[#1E293B] text-sm mb-3 border-b border-[#E2E8F0] pb-2">Complaint Density & Risk</h4>
            <div className="space-y-2.5">
              <div className="flex items-center gap-3 text-sm font-medium text-[#64748B]">
                <span className="w-3.5 h-3.5 rounded-full bg-[#1E8E3E] border border-[#1E8E3E]/50 shadow-[0_0_8px_rgba(30,142,62,0.4)]"></span> Low / Normal Risk
              </div>
              <div className="flex items-center gap-3 text-sm font-medium text-[#64748B]">
                <span className="w-3.5 h-3.5 rounded-full bg-[#eab308] border border-[#eab308]/50 shadow-[0_0_8px_rgba(234,179,8,0.4)]"></span> Moderate Priority
              </div>
              <div className="flex items-center gap-3 text-sm font-medium text-[#64748B]">
                <span className="w-3.5 h-3.5 rounded-full bg-[#F57C00] border border-[#F57C00]/50 shadow-[0_0_8px_rgba(245,124,0,0.4)]"></span> High Risk Area
              </div>
              <div className="flex items-center gap-3 text-sm font-medium text-[#64748B]">
                <span className="w-3.5 h-3.5 rounded-full bg-[#ef4444] border border-[#ef4444]/50 shadow-[0_0_8px_rgba(239,68,68,0.4)]"></span> Critical Systemic Failure
              </div>
            </div>
          </div>
          
          {selectedState && (
            <button 
              onClick={() => setSelectedState(null)}
              className="absolute top-6 right-[420px] z-[400] bg-white px-4 py-2 rounded-lg border border-[#E2E8F0] shadow-md text-sm font-semibold text-[#1E293B] hover:bg-slate-50 transition-colors pointer-events-auto flex items-center gap-2"
            >
              Reset Map View
            </button>
          )}
        </div>

        {/* State Insights Panel (Slide Over) */}
        <AnimatePresence>
          {selectedState && (
            <motion.div 
              variants={slidePanelVariants}
              initial="hidden"
              animate="visible"
              exit="exit"
              className="absolute top-0 right-0 w-[400px] h-full bg-white border-l border-[#E2E8F0] shadow-[-10px_0_30px_rgba(0,0,0,0.05)] z-[500] flex flex-col pointer-events-auto"
            >
              {/* Header */}
              <div className="p-5 border-b border-[#E2E8F0] flex justify-between items-center bg-[#F8FAFC]">
                <div>
                  <h2 className="font-['Poppins'] font-bold text-2xl text-[#1E293B]">{selectedState.name}</h2>
                  <span className={`text-xs font-bold px-2 py-0.5 rounded-md mt-1 inline-block ${
                    selectedState.riskLevel === 'Critical' ? 'bg-red-100 text-red-700' :
                    selectedState.riskLevel === 'High' ? 'bg-orange-100 text-orange-700' :
                    selectedState.riskLevel === 'Moderate' ? 'bg-yellow-100 text-yellow-700' :
                    'bg-green-100 text-green-700'
                  }`}>
                    {selectedState.riskLevel} Risk Zone (Score: {selectedState.riskScore})
                  </span>
                </div>
                <button onClick={() => setSelectedState(null)} className="p-2 text-[#64748B] hover:bg-[#E2E8F0] rounded-lg transition-colors">
                  <X className="w-5 h-5" />
                </button>
              </div>

              {/* Scrollable Content */}
              <div className="flex-1 overflow-y-auto p-5 space-y-6 hide-scrollbar">
                
                {/* Metrics */}
                <div className="grid grid-cols-2 gap-3">
                  <div className="bg-[#F8FAFC] border border-[#E2E8F0] rounded-xl p-4 text-center">
                    <div className="text-xs text-[#64748B] font-bold uppercase mb-1">Total Volume</div>
                    <div className="text-xl font-['Poppins'] font-bold text-[#1E293B]">{selectedState.complaints.toLocaleString()}</div>
                  </div>
                  <div className="bg-[#F8FAFC] border border-[#E2E8F0] rounded-xl p-4 text-center">
                    <div className="text-xs text-[#64748B] font-bold uppercase mb-1">Systemic/Recurring</div>
                    <div className="text-xl font-['Poppins'] font-bold text-[#F57C00]">{selectedState.recurring.toLocaleString()}</div>
                  </div>
                </div>

                {/* AI Recommendation */}
                <div className="bg-[#0B2E59] rounded-xl p-5 text-white shadow-md">
                  <div className="flex items-center gap-2 text-blue-300 text-xs font-bold uppercase tracking-wider mb-2">
                    <BrainCircuit className="w-4 h-4" /> AI Insight
                  </div>
                  <h4 className="font-bold mb-2">Primary Failure: {selectedState.topCategory}</h4>
                  <p className="text-sm text-white/80 leading-relaxed mb-4">
                    Clustering algorithms detect a massive surge in {selectedState.topCategory.toLowerCase()} within the {selectedState.topDept} department. Immediate administrative intervention required.
                  </p>
                  <button className="w-full py-2 bg-white text-[#0B2E59] text-sm font-bold rounded-lg hover:bg-slate-100 transition-colors shadow-sm">
                    Generate Policy Brief
                  </button>
                </div>

                {/* Charts */}
                <div>
                  <h4 className="font-['Poppins'] font-bold text-[#1E293B] mb-3 text-sm">Department Distribution</h4>
                  <div className="h-[180px] bg-[#F8FAFC] rounded-xl border border-[#E2E8F0] p-4">
                    <ResponsiveContainer width="100%" height="100%">
                      <BarChart data={stateChartData}>
                        <XAxis dataKey="name" axisLine={false} tickLine={false} tick={{ fontSize: 10, fill: '#64748B' }} />
                        <RechartsTooltip cursor={{ fill: '#E2E8F0' }} contentStyle={{ borderRadius: '8px', fontSize: '12px' }} />
                        <Bar dataKey="value" fill="#0B2E59" radius={[4, 4, 0, 0]} />
                      </BarChart>
                    </ResponsiveContainer>
                  </div>
                </div>

                <div>
                  <h4 className="font-['Poppins'] font-bold text-[#1E293B] mb-3 text-sm">7-Day Complaint Trend</h4>
                  <div className="h-[140px] bg-[#F8FAFC] rounded-xl border border-[#E2E8F0] p-4">
                    <ResponsiveContainer width="100%" height="100%">
                      <AreaChart data={stateTrendData}>
                        <defs>
                          <linearGradient id="colorTrend" x1="0" y1="0" x2="0" y2="1">
                            <stop offset="5%" stopColor="#F57C00" stopOpacity={0.3}/>
                            <stop offset="95%" stopColor="#F57C00" stopOpacity={0}/>
                          </linearGradient>
                        </defs>
                        <XAxis dataKey="day" hide />
                        <RechartsTooltip contentStyle={{ borderRadius: '8px', fontSize: '12px' }} />
                        <Area type="monotone" dataKey="count" stroke="#F57C00" strokeWidth={2} fill="url(#colorTrend)" />
                      </AreaChart>
                    </ResponsiveContainer>
                  </div>
                </div>

              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </motion.div>

      {/* STATE QUICK NAVIGATION CHIPS */}
      <div className="flex overflow-x-auto gap-2 py-2 px-1 hide-scrollbar">
        {stateGeoData.map((state) => (
          <button
            key={state.id}
            onClick={() => setSelectedState(state)}
            className={`whitespace-nowrap px-3 py-1.5 text-sm font-semibold rounded-lg border transition-colors ${
              selectedState?.id === state.id 
                ? 'bg-[#0B2E59] text-white border-[#0B2E59]' 
                : 'bg-white text-[#0B2E59] border-[#E2E8F0] hover:bg-[#F8FAFC] hover:border-[#0B2E59]'
            }`}
          >
            {state.name}
          </button>
        ))}
      </div>

      {/* 4. REGIONAL OVERVIEW KPIs */}
      <motion.div variants={itemVariants} className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-6 gap-4">
        {[
          { title: "Total Geo Volume", value: "108,400", trend: "+12%", icon: MapIcon, color: "text-[#0B2E59]" },
          { title: "Recurring Nodes", value: "54,200", trend: "+18%", icon: Database, color: "text-[#F57C00]" },
          { title: "Critical Regions", value: "3", trend: "Active", icon: AlertTriangle, color: "text-red-600" },
          { title: "States Monitored", value: "25", trend: "Full Coverage", icon: ShieldCheck, color: "text-[#1E8E3E]" },
          { title: "Highest Risk Score", value: "94/100", trend: "Pune", icon: Crosshair, color: "text-[#ef4444]" },
          { title: "Avg AI Confidence", value: "96.4%", trend: "High", icon: BrainCircuit, color: "text-[#0B2E59]" },
        ].map((kpi, i) => (
          <div key={i} className="bg-white p-4 rounded-xl border border-[#E2E8F0] shadow-sm flex flex-col justify-between">
            <div className="flex justify-between items-start mb-2">
              <div className={`p-2 rounded-lg bg-slate-50 ${kpi.color}`}>
                <kpi.icon className="w-5 h-5" />
              </div>
              <span className="text-[10px] font-bold text-[#64748B] uppercase tracking-wider">{kpi.trend}</span>
            </div>
            <div>
              <h3 className="text-[#64748B] text-[11px] font-bold uppercase tracking-wider mb-0.5">{kpi.title}</h3>
              <div className="text-xl font-['Poppins'] font-bold text-[#1E293B]">{kpi.value}</div>
            </div>
          </div>
        ))}
      </motion.div>

      {/* 5. ALL INDIAN STATES & UTS MATRIX GRID */}
      <motion.div variants={itemVariants} className="bg-white rounded-xl border border-[#E2E8F0] shadow-sm p-6">
        <div className="flex justify-between items-center mb-6">
          <div>
            <h3 className="font-['Poppins'] font-bold text-[#1E293B] text-xl">All Indian States & UTs Grievance Matrix</h3>
            <p className="text-xs text-[#64748B] mt-0.5">Live monitoring across 25 active states and union territories</p>
          </div>
          <span className="bg-blue-50 text-[#0B2E59] font-bold text-xs px-3 py-1.5 rounded-lg border border-blue-100">
            25 States Active
          </span>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-4">
          {stateGeoData.map((st) => (
            <div 
              key={st.id} 
              onClick={() => setSelectedState(st)}
              className="bg-[#F8FAFC] border border-[#E2E8F0] hover:border-[#0B2E59] rounded-xl p-4 cursor-pointer transition-all hover:shadow-md group"
            >
              <div className="flex justify-between items-center mb-2">
                <span className="font-bold text-[#0B2E59] group-hover:text-[#F57C00] transition-colors">{st.name}</span>
                <span className={`text-[10px] font-bold px-2 py-0.5 rounded ${
                  st.riskLevel === 'Critical' ? 'bg-red-100 text-red-700' :
                  st.riskLevel === 'High' ? 'bg-orange-100 text-orange-700' :
                  st.riskLevel === 'Moderate' ? 'bg-yellow-100 text-yellow-700' :
                  'bg-green-100 text-green-700'
                }`}>{st.riskLevel}</span>
              </div>
              <div className="text-lg font-bold text-[#1E293B] mb-1">{st.complaints.toLocaleString()} <span className="text-xs font-normal text-[#64748B]">cases</span></div>
              <div className="text-xs text-[#64748B] truncate"><b className="text-[#334155]">Top Dept:</b> {st.topDept}</div>
              <div className="text-xs text-[#64748B] truncate mt-0.5"><b className="text-[#334155]">Issue:</b> {st.topCategory}</div>
            </div>
          ))}
        </div>
      </motion.div>

      {/* 5. HOTSPOT RANKING & AI GEO INSIGHTS */}
      <motion.div variants={itemVariants} className="grid lg:grid-cols-3 gap-6">
        
        {/* Hotspot Ranking Table */}
        <div className="lg:col-span-2 bg-white rounded-xl border border-[#E2E8F0] shadow-sm flex flex-col overflow-hidden">
          <div className="p-5 border-b border-[#E2E8F0] flex justify-between items-center">
            <div>
              <h3 className="font-['Poppins'] font-bold text-[#1E293B] text-lg">National Hotspot Ranking</h3>
              <p className="text-xs text-[#64748B]">Top 10 regions by AI Risk Score</p>
            </div>
            <button className="text-sm font-semibold text-[#0B2E59] flex items-center gap-1 hover:underline">
              View All <ChevronRight className="w-4 h-4" />
            </button>
          </div>
          <div className="overflow-x-auto">
            <table className="w-full text-left">
              <thead>
                <tr className="bg-[#F8FAFC] border-b border-[#E2E8F0] text-[11px] uppercase font-bold text-[#64748B]">
                  <th className="px-5 py-3">Rank</th>
                  <th className="px-5 py-3">District & State</th>
                  <th className="px-5 py-3 text-right">Volume</th>
                  <th className="px-5 py-3 text-center">AI Risk</th>
                  <th className="px-5 py-3">Priority</th>
                  <th className="px-5 py-3 text-center">Trend</th>
                </tr>
              </thead>
              <tbody className="text-sm font-medium text-[#1E293B]">
                {hotspotRanking.map((row) => (
                  <tr key={row.rank} className="border-b border-[#E2E8F0] hover:bg-slate-50">
                    <td className="px-5 py-4"><span className="w-6 h-6 rounded-full bg-slate-100 flex items-center justify-center text-xs font-bold text-[#64748B]">{row.rank}</span></td>
                    <td className="px-5 py-4 font-bold">{row.district}, {row.state}</td>
                    <td className="px-5 py-4 text-right font-semibold">{row.complaints}</td>
                    <td className="px-5 py-4 text-center">
                      <span className={`font-bold ${row.risk >= 90 ? 'text-red-600' : 'text-orange-600'}`}>{row.risk}</span>
                    </td>
                    <td className="px-5 py-4">
                      <span className={`px-2 py-1 rounded text-xs font-bold uppercase ${
                        row.priority === 'Critical' ? 'bg-red-100 text-red-700' : 
                        row.priority === 'High' ? 'bg-orange-100 text-orange-700' : 'bg-yellow-100 text-yellow-700'
                      }`}>{row.priority}</span>
                    </td>
                    <td className="px-5 py-4 text-center">
                      {row.trend === 'up' ? <TrendingUp className="w-4 h-4 mx-auto text-red-500" /> : <TrendingUp className="w-4 h-4 mx-auto text-green-500 rotate-180 scale-x-[-1]" />}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        {/* AI Geo Insights */}
        <div className="bg-[#F8FAFC] rounded-xl border border-[#E2E8F0] shadow-sm p-5 space-y-4">
          <div className="flex items-center gap-2 mb-2">
            <BrainCircuit className="w-5 h-5 text-[#0B2E59]" />
            <h3 className="font-['Poppins'] font-bold text-[#1E293B] text-lg">AI Spatial Intelligence</h3>
          </div>
          
          <div className="space-y-3">
            {aiGeoInsights.map((insight, i) => (
              <div key={i} className="bg-white p-4 rounded-lg border border-[#E2E8F0] shadow-sm hover:border-[#0B2E59]/30 transition-colors">
                <div className="flex justify-between items-start mb-2">
                  <h4 className="font-bold text-[#1E293B] text-sm">{insight.title}</h4>
                  <span className={`text-[10px] px-2 py-0.5 rounded font-bold uppercase ${
                    insight.priority === 'Critical' ? 'bg-red-100 text-red-700' :
                    insight.priority === 'High' ? 'bg-orange-100 text-orange-700' :
                    insight.priority === 'Medium' ? 'bg-blue-100 text-blue-700' : 'bg-green-100 text-green-700'
                  }`}>{insight.priority}</span>
                </div>
                <p className="text-xs text-[#64748B] leading-relaxed mb-3">{insight.summary}</p>
                <div className="flex justify-between items-center text-[10px] font-semibold text-[#1E293B]">
                  <span>Confidence: {insight.confidence}</span>
                  <button className="text-[#0B2E59] hover:underline flex items-center gap-1">Take Action <ChevronRight className="w-3 h-3"/></button>
                </div>
              </div>
            ))}
          </div>
        </div>

      </motion.div>

      {/* 6. QUICK ACTIONS */}
      <motion.div variants={itemVariants} className="pt-4 border-t border-[#E2E8F0]">
        <h3 className="font-['Poppins'] font-bold text-[#1E293B] text-lg mb-4">Geo-Strategic Actions</h3>
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-4">
          {[
            { icon: Activity, title: "Full Analytics", desc: "Detailed metric view", color: "text-[#0B2E59]", bg: "bg-blue-50 hover:bg-[#0B2E59] hover:text-white" },
            { icon: Target, title: "Root Cause Mode", desc: "Isolate structural issues", color: "text-[#F57C00]", bg: "bg-orange-50 hover:bg-[#F57C00] hover:text-white" },
            { icon: FileText, title: "Policy Briefs", desc: "Generate regional reports", color: "text-[#1E8E3E]", bg: "bg-green-50 hover:bg-[#1E8E3E] hover:text-white" },
            { icon: Building2, title: "Department Sync", desc: "Alert nodal officers", color: "text-purple-600", bg: "bg-purple-50 hover:bg-purple-600 hover:text-white" },
            { icon: Download, title: "Export GIS Data", desc: "Download GeoJSON/CSV", color: "text-[#64748B]", bg: "bg-slate-100 hover:bg-slate-700 hover:text-white" }
          ].map((action, idx) => (
            <div key={idx} className={`p-4 rounded-xl border border-[#E2E8F0] cursor-pointer group transition-all duration-300 ${action.bg}`}>
              <action.icon className={`w-6 h-6 mb-3 group-hover:text-white transition-colors ${action.color}`} />
              <h4 className="font-bold text-sm mb-1 group-hover:text-white transition-colors text-[#1E293B]">{action.title}</h4>
              <p className="text-xs group-hover:text-white/80 transition-colors text-[#64748B]">{action.desc}</p>
            </div>
          ))}
        </div>
      </motion.div>
      
      {/* Required for overriding some default leaflet tooltip styles strictly for this page */}
      <style>{`
        .custom-leaflet-tooltip {
          background: rgba(255, 255, 255, 0.95);
          border: 1px solid #E2E8F0;
          box-shadow: 0 4px 6px -1px rgba(0, 0, 0, 0.1);
          border-radius: 8px;
        }
        .leaflet-tooltip-top:before { border-top-color: #E2E8F0; }
        .hide-scrollbar::-webkit-scrollbar { display: none; }
        .hide-scrollbar { -ms-overflow-style: none; scrollbar-width: none; }
      `}</style>
    </motion.div>
  );
};