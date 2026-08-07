// src/pages/Dashboard.tsx
import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { 
  BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer,
  AreaChart, Area, PieChart, Pie, Cell 
} from 'recharts';
import { 
  TrendingUp, AlertTriangle, CheckCircle2, Calendar, Download, 
  Filter, ChevronRight, Target, Database, Activity 
} from 'lucide-react';

const trendData = [
  { month: 'Jan', grievances: 4200, resolved: 3800 },
  { month: 'Feb', grievances: 5100, resolved: 4200 },
  { month: 'Mar', grievances: 4800, resolved: 4500 },
  { month: 'Apr', grievances: 5900, resolved: 5100 },
  { month: 'May', grievances: 6200, resolved: 5800 },
  { month: 'Jun', grievances: 5800, resolved: 5600 },
  { month: 'Jul', grievances: 7100, resolved: 6300 },
];

const categoryData = [
  { name: 'Infrastructure', count: 8430 },
  { name: 'Financial Schemes', count: 6210 },
  { name: 'Public Distribution', count: 4100 },
  { name: 'Healthcare Services', count: 3800 },
  { name: 'Education/Scholarship', count: 2900 },
];

const statusData = [
  { name: 'Resolved', value: 68 },
  { name: 'Pending Review', value: 22 },
  { name: 'Critical Action', value: 10 },
];

const recentGrievances = [
  { id: 'GRV-2026-891', dept: 'Rural Development', category: 'Infrastructure', status: 'Critical', date: '2 hours ago', match: '94%' },
  { id: 'GRV-2026-890', dept: 'Finance', category: 'Scheme Transfer', status: 'Pending', date: '4 hours ago', match: '88%' },
  { id: 'GRV-2026-889', dept: 'Health', category: 'Hospital Supplies', status: 'Resolved', date: '1 day ago', match: '97%' },
  { id: 'GRV-2026-888', dept: 'Education', category: 'Scholarship Delay', status: 'Pending', date: '1 day ago', match: '82%' },
];

const COLORS = ['#0B2E59', '#2E7D32', '#F57C00'];

const containerVariants = {
  hidden: { opacity: 0 },
  visible: { opacity: 1, transition: { staggerChildren: 0.1 } }
};

const itemVariants = {
  hidden: { opacity: 0, y: 15 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.3 } }
};

export const Dashboard: React.FC = () => {
  const [timeRange, setTimeRange] = useState('This Month');

  return (
    <div className="flex flex-col gap-6 lg:gap-8 pb-12 w-full min-w-0 font-['Inter'] bg-[#FFFFFF] text-[#0F172A] p-4 lg:p-8">
      
      {/* Header Bar */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 bg-[#FFFFFF] p-6 rounded-2xl border border-[#E2E8F0] shadow-xs shrink-0">
        <div>
          <h1 className="text-2xl lg:text-3xl font-['Poppins'] font-bold text-[#0B2E59] tracking-tight">Intelligence Dashboard</h1>
          <p className="text-sm text-[#64748B] mt-1">National Grievance Analysis & Root Cause Detection</p>
        </div>
        
        <div className="flex flex-wrap items-center gap-3">
          <div className="flex items-center gap-2 bg-[#F8FAFC] border border-[#E2E8F0] rounded-xl px-3.5 py-2 text-sm font-medium text-[#0F172A]">
            <Calendar className="w-4 h-4 text-[#64748B]" />
            <select 
              value={timeRange} 
              onChange={(e) => setTimeRange(e.target.value)}
              className="bg-transparent border-none outline-none cursor-pointer text-[#0F172A] font-semibold"
            >
              <option>Today</option>
              <option>This Week</option>
              <option>This Month</option>
              <option>This Quarter</option>
            </select>
          </div>
          
          <button className="flex items-center gap-2 px-4 py-2 bg-[#FFFFFF] border border-[#E2E8F0] text-[#0F172A] text-sm font-semibold rounded-xl shadow-xs hover:border-[#F57C00] hover:text-[#F57C00] transition-colors">
            <Filter className="w-4 h-4" /> Filters
          </button>
          
          <button className="flex items-center gap-2 px-5 py-2.5 bg-[#0B2E59] hover:bg-[#082244] text-[#FFFFFF] text-sm font-bold rounded-xl shadow-sm transition-all">
            <Download className="w-4 h-4" /> Export Report
          </button>
        </div>
      </div>

      <motion.div variants={containerVariants} initial="hidden" animate="visible" className="space-y-6">
        
        {/* KPI Cards Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 lg:gap-6">
          
          <motion.div variants={itemVariants} className="bg-[#FFFFFF] p-6 rounded-2xl border border-[#E2E8F0] shadow-xs relative overflow-hidden group hover:border-[#F57C00] transition-all">
            <div className="flex items-center justify-between mb-3">
              <span className="text-xs font-bold text-[#64748B] uppercase tracking-wider">Total Processed</span>
              <div className="p-2.5 bg-[#0B2E59]/10 rounded-xl text-[#0B2E59]"><Database className="w-5 h-5" /></div>
            </div>
            <div className="text-3xl font-['Poppins'] font-bold text-[#0B2E59] mb-2">39,100</div>
            <div className="flex items-center gap-1.5 text-xs font-bold text-[#2E7D32]">
              <TrendingUp className="w-4 h-4" /> <span>+12.5% vs last month</span>
            </div>
          </motion.div>

          <motion.div variants={itemVariants} className="bg-[#FFFFFF] p-6 rounded-2xl border border-[#E2E8F0] shadow-xs relative overflow-hidden group hover:border-[#2E7D32] transition-all">
            <div className="flex items-center justify-between mb-3">
              <span className="text-xs font-bold text-[#64748B] uppercase tracking-wider">AI Resolution Match</span>
              <div className="p-2.5 bg-[#2E7D32]/10 rounded-xl text-[#2E7D32]"><CheckCircle2 className="w-5 h-5" /></div>
            </div>
            <div className="text-3xl font-['Poppins'] font-bold text-[#0B2E59] mb-2">84.2%</div>
            <div className="flex items-center gap-1.5 text-xs font-bold text-[#2E7D32]">
              <TrendingUp className="w-4 h-4" /> <span>+3.1% accuracy gain</span>
            </div>
          </motion.div>

          <motion.div variants={itemVariants} className="bg-[#FFFFFF] p-6 rounded-2xl border border-[#E2E8F0] shadow-xs relative overflow-hidden group hover:border-[#F57C00] transition-all">
            <div className="flex items-center justify-between mb-3">
              <span className="text-xs font-bold text-[#64748B] uppercase tracking-wider">Clusters Identified</span>
              <div className="p-2.5 bg-[#F57C00]/10 rounded-xl text-[#F57C00]"><Target className="w-5 h-5" /></div>
            </div>
            <div className="text-3xl font-['Poppins'] font-bold text-[#0B2E59] mb-2">142</div>
            <div className="flex items-center gap-1.5 text-xs font-bold text-[#64748B]">
              <Activity className="w-4 h-4 text-[#F57C00]" /> <span>Across 12 departments</span>
            </div>
          </motion.div>

          <motion.div variants={itemVariants} className="bg-[#FFFFFF] p-6 rounded-2xl border border-[#E2E8F0] shadow-xs relative overflow-hidden group hover:border-[#F57C00] transition-all">
            <div className="flex items-center justify-between mb-3">
              <span className="text-xs font-bold text-[#64748B] uppercase tracking-wider">Systemic Alerts</span>
              <div className="p-2.5 bg-[#F57C00]/10 rounded-xl text-[#F57C00]"><AlertTriangle className="w-5 h-5" /></div>
            </div>
            <div className="text-3xl font-['Poppins'] font-bold text-[#0B2E59] mb-2">18</div>
            <div className="flex items-center gap-1.5 text-xs font-bold text-[#F57C00]">
              <TrendingUp className="w-4 h-4" /> <span>+5 new policy drafts</span>
            </div>
          </motion.div>

        </div>

        {/* Charts Row */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          
          <motion.div variants={itemVariants} className="lg:col-span-2 bg-[#FFFFFF] p-6 rounded-2xl border border-[#E2E8F0] shadow-xs flex flex-col min-h-[350px]">
            <div className="flex items-center justify-between mb-6">
              <div>
                <h3 className="font-['Poppins'] font-bold text-[#0B2E59] text-base">Grievance Inflow vs Resolution</h3>
                <p className="text-xs text-[#64748B] mt-0.5">Monthly trend tracking across all integrated portals</p>
              </div>
            </div>
            <div className="flex-1 w-full min-h-[250px]">
              <ResponsiveContainer width="100%" height="100%">
                <AreaChart data={trendData} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                  <defs>
                    <linearGradient id="colorGrievances" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%" stopColor="#0B2E59" stopOpacity={0.2}/>
                      <stop offset="95%" stopColor="#0B2E59" stopOpacity={0}/>
                    </linearGradient>
                    <linearGradient id="colorResolved" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%" stopColor="#2E7D32" stopOpacity={0.2}/>
                      <stop offset="95%" stopColor="#2E7D32" stopOpacity={0}/>
                    </linearGradient>
                  </defs>
                  <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#E2E8F0" />
                  <XAxis dataKey="month" axisLine={false} tickLine={false} tick={{ fontSize: 12, fill: '#64748B' }} dy={10} />
                  <YAxis axisLine={false} tickLine={false} tick={{ fontSize: 12, fill: '#64748B' }} />
                  <Tooltip contentStyle={{ backgroundColor: '#FFFFFF', borderRadius: '12px', border: '1px solid #E2E8F0', boxShadow: '0 4px 12px rgba(0,0,0,0.05)' }} />
                  <Area type="monotone" dataKey="grievances" name="Incoming" stroke="#0B2E59" strokeWidth={2.5} fillOpacity={1} fill="url(#colorGrievances)" />
                  <Area type="monotone" dataKey="resolved" name="Resolved" stroke="#2E7D32" strokeWidth={2.5} fillOpacity={1} fill="url(#colorResolved)" />
                </AreaChart>
              </ResponsiveContainer>
            </div>
          </motion.div>

          <motion.div variants={itemVariants} className="bg-[#FFFFFF] p-6 rounded-2xl border border-[#E2E8F0] shadow-xs flex flex-col min-h-[350px]">
            <div className="mb-6">
              <h3 className="font-['Poppins'] font-bold text-[#0B2E59] text-base">Status Distribution</h3>
              <p className="text-xs text-[#64748B] mt-0.5">Real-time pipeline snapshot</p>
            </div>
            <div className="flex-1 w-full flex items-center justify-center relative min-h-[180px]">
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie data={statusData} cx="50%" cy="50%" innerRadius={65} outerRadius={85} paddingAngle={4} dataKey="value" stroke="none">
                    {statusData.map((_, index) => (
                      <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                    ))}
                  </Pie>
                  <Tooltip contentStyle={{ backgroundColor: '#FFFFFF', borderRadius: '12px', border: '1px solid #E2E8F0' }} />
                </PieChart>
              </ResponsiveContainer>
              <div className="absolute inset-0 flex flex-col items-center justify-center pointer-events-none">
                <span className="text-2xl font-['Poppins'] font-bold text-[#0B2E59]">68%</span>
                <span className="text-[10px] font-bold text-[#64748B] uppercase tracking-wider">Resolved</span>
              </div>
            </div>
            <div className="flex justify-center gap-4 mt-2">
              {statusData.map((item, index) => (
                <div key={item.name} className="flex items-center gap-2 text-xs font-semibold text-[#0F172A]">
                  <div className="w-3 h-3 rounded-full" style={{ backgroundColor: COLORS[index] }}></div>
                  {item.name}
                </div>
              ))}
            </div>
          </motion.div>

        </div>

        {/* Recent Grievances Table */}
        <motion.div variants={itemVariants} className="bg-[#FFFFFF] rounded-2xl border border-[#E2E8F0] shadow-xs overflow-hidden">
          <div className="p-6 border-b border-[#E2E8F0] flex justify-between items-center bg-[#F8FAFC]">
            <h3 className="font-['Poppins'] font-bold text-[#0B2E59] text-base flex items-center gap-2">
              <Activity className="w-4 h-4 text-[#F57C00]" /> Latest Processed Grievances
            </h3>
            <button className="flex items-center gap-1 text-sm font-bold text-[#0B2E59] hover:text-[#F57C00] transition-colors">
              View All <ChevronRight className="w-4 h-4" />
            </button>
          </div>
          
          <div className="overflow-x-auto w-full">
            <table className="w-full text-left min-w-[700px]">
              <thead className="bg-[#FFFFFF] border-b border-[#E2E8F0]">
                <tr>
                  {['ID / Date', 'Department', 'Root Cause Category', 'AI Confidence', 'Status'].map((h, i) => (
                    <th key={i} className="px-6 py-3.5 text-[10px] uppercase font-bold text-[#64748B] tracking-wider">{h}</th>
                  ))}
                </tr>
              </thead>
              <tbody className="text-sm font-medium">
                {recentGrievances.map((row, i) => (
                  <tr key={i} className="border-b border-[#E2E8F0] last:border-0 hover:bg-[#F8FAFC] transition-colors">
                    <td className="px-6 py-4">
                      <div className="font-bold text-[#0B2E59]">{row.id}</div>
                      <div className="text-xs text-[#64748B] mt-0.5">{row.date}</div>
                    </td>
                    <td className="px-6 py-4 text-[#0F172A] font-semibold">{row.dept}</td>
                    <td className="px-6 py-4">
                      <span className="inline-block px-2.5 py-1 bg-[#F8FAFC] border border-[#E2E8F0] rounded-lg text-xs font-semibold text-[#0F172A]">
                        {row.category}
                      </span>
                    </td>
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-2">
                        <span className="text-xs font-bold text-[#0F172A]">{row.match}</span>
                        <div className="w-16 h-1.5 bg-[#E2E8F0] rounded-full overflow-hidden">
                          <div className="h-full bg-[#2E7D32]" style={{ width: row.match }}></div>
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <span className={`inline-flex items-center px-2.5 py-1 rounded-lg text-[10px] font-bold uppercase tracking-wider ${
                        row.status === 'Resolved' ? 'bg-[#2E7D32]/10 text-[#2E7D32]' :
                        row.status === 'Critical' ? 'bg-[#F57C00]/10 text-[#F57C00]' :
                        'bg-[#0B2E59]/10 text-[#0B2E59]'
                      }`}>
                        {row.status}
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </motion.div>

      </motion.div>
    </div>
  );
};