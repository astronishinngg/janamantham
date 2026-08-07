import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { toast } from 'sonner';
import { 
  BarChart, Bar, AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer 
} from 'recharts';
import { 
  BarChart3, RefreshCw, Download, FileText, Filter, RotateCcw, 
  Search, ChevronRight, ArrowUpDown, ChevronLeft, Lightbulb, ExternalLink, 
  Target, Map as MapIcon, Activity, Printer, Share2, X, Eye, CheckCircle2
} from 'lucide-react';

// STRICT IMPORT FIXES:
import { useAnalyticsStore } from '@/stores/useAnalyticsStore';
import { analyticsService, AnalyticsData, AnalyticsRecord } from '@/services/analyticsService';
import { ROUTES } from '@/constants/routes';

const containerVariants = { hidden: { opacity: 0 }, visible: { opacity: 1, transition: { staggerChildren: 0.1 } } };
const itemVariants = { hidden: { opacity: 0, y: 15 }, visible: { opacity: 1, y: 0, transition: { duration: 0.4 } } };

export const Analytics: React.FC = () => {
  const navigate = useNavigate();
  const { 
    state, department, category, priority, status, dateRange, searchQuery, 
    currentPage, pageSize, sortColumn, sortDirection, selectedRecord,
    setFilter, resetFilters, setCurrentPage, setSorting, setSelectedRecord 
  } = useAnalyticsStore();

  const [data, setData] = useState<AnalyticsData | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isExporting, setIsExporting] = useState(false);

  const fetchAnalytics = async () => {
    setIsLoading(true);
    try {
      const result = await analyticsService.getAnalytics({
        state, department, category, priority, status, dateRange, searchQuery
      });
      setData(result);
    } catch (err) {
      toast.error("Failed to load analytics telemetry.");
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchAnalytics();
  }, [state, department, category, priority, status, dateRange, searchQuery]);

  // Sorting & Pagination logic
  const sortedRecords = React.useMemo(() => {
    if (!data?.tableRecords) return [];
    return [...data.tableRecords].sort((a, b) => {
      let aVal = (a as any)[sortColumn] || '';
      let bVal = (b as any)[sortColumn] || '';
      if (aVal < bVal) return sortDirection === 'asc' ? -1 : 1;
      if (aVal > bVal) return sortDirection === 'asc' ? 1 : -1;
      return 0;
    });
  }, [data?.tableRecords, sortColumn, sortDirection]);

  const totalPages = Math.ceil((sortedRecords.length || 1) / pageSize);
  const paginatedRecords = sortedRecords.slice((currentPage - 1) * pageSize, currentPage * pageSize);

  const handleExportCSV = async () => {
    setIsExporting(true);
    const t = toast.loading("Generating CSV export...");
    await analyticsService.exportCSV();
    setIsExporting(false);
    toast.success("CSV export downloaded successfully", { id: t });
  };

  const handleExportPDF = async () => {
    setIsExporting(true);
    const t = toast.loading("Rendering PDF executive report...");
    await analyticsService.exportPDF();
    setIsExporting(false);
    toast.success("PDF report generated successfully", { id: t });
  };

  const handleShare = async () => {
    const t = toast.loading("Generating secure share link...");
    await analyticsService.shareReport();
    toast.success("Secure report link copied to clipboard", { id: t });
  };

  return (
    <motion.div variants={containerVariants} initial="hidden" animate="visible" className="space-y-6 pb-16 w-full min-w-0 font-['Inter'] relative">
      
      {/* 1. HEADER */}
      <motion.div variants={itemVariants} className="flex flex-col lg:flex-row lg:items-center justify-between gap-4 bg-white p-5 rounded-xl border border-slate-200 shadow-sm">
        <div>
          <div className="flex items-center gap-2 text-sm text-slate-500 mb-1 font-medium">
            <span className="cursor-pointer hover:text-[#0B2E59] transition-colors" onClick={() => navigate(ROUTES.DASHBOARD)}>Dashboard</span>
            <ChevronRight className="w-4 h-4" />
            <span className="text-[#0B2E59] font-semibold">Analytics Studio</span>
          </div>
          <h1 className="text-2xl font-['Poppins'] font-bold text-slate-900 flex items-center gap-2">
            <BarChart3 className="w-6 h-6 text-[#2F6BFF]" /> Enterprise Analytics & Telemetry
          </h1>
        </div>
        
        <div className="flex flex-wrap items-center gap-2.5">
          <button onClick={handleExportCSV} disabled={isExporting} className="flex items-center gap-2 px-3.5 py-2 bg-white border border-slate-200 text-slate-700 text-xs font-semibold rounded-lg shadow-sm hover:bg-slate-50 transition-colors">
            <Download className="w-3.5 h-3.5" /> CSV
          </button>
          <button onClick={handleExportPDF} disabled={isExporting} className="flex items-center gap-2 px-3.5 py-2 bg-white border border-slate-200 text-slate-700 text-xs font-semibold rounded-lg shadow-sm hover:bg-slate-50 transition-colors">
            <FileText className="w-3.5 h-3.5" /> PDF
          </button>
          <button onClick={() => analyticsService.printReport()} className="flex items-center gap-2 px-3.5 py-2 bg-white border border-slate-200 text-slate-700 text-xs font-semibold rounded-lg shadow-sm hover:bg-slate-50 transition-colors">
            <Printer className="w-3.5 h-3.5" /> Print
          </button>
          <button onClick={handleShare} className="flex items-center gap-2 px-3.5 py-2 bg-white border border-slate-200 text-slate-700 text-xs font-semibold rounded-lg shadow-sm hover:bg-slate-50 transition-colors">
            <Share2 className="w-3.5 h-3.5" /> Share
          </button>
          <button onClick={fetchAnalytics} className="p-2 border border-slate-200 text-slate-600 hover:text-[#0B2E59] hover:bg-slate-50 rounded-lg transition-colors" title="Refresh">
            <RefreshCw className={`w-4 h-4 ${isLoading ? 'animate-spin' : ''}`} />
          </button>
        </div>
      </motion.div>

      {/* 2. WORKING FILTER BAR */}
      <motion.div variants={itemVariants} className="bg-white p-5 rounded-xl border border-slate-200 shadow-sm space-y-4">
        <div className="flex items-center justify-between border-b border-slate-200 pb-3">
          <div className="flex items-center gap-2 font-['Poppins'] font-bold text-slate-900 text-sm">
            <Filter className="w-4 h-4 text-[#2F6BFF]" /> Data Telemetry Filters
          </div>
          <button onClick={resetFilters} className="flex items-center gap-1.5 text-xs font-semibold text-slate-500 hover:text-red-600 transition-colors">
            <RotateCcw className="w-3.5 h-3.5" /> Reset Filters
          </button>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          <div className="space-y-1">
            <label className="text-[10px] font-bold text-slate-500 uppercase tracking-wider">State</label>
            <select value={state} onChange={(e) => setFilter('state', e.target.value)} className="w-full text-xs font-semibold bg-slate-50 border border-slate-200 rounded-lg p-2.5 outline-none focus:border-[#2F6BFF]">
              <option>All States</option>
              <option>Maharashtra</option>
              <option>Uttar Pradesh</option>
              <option>Bihar</option>
              <option>Karnataka</option>
            </select>
          </div>

          <div className="space-y-1">
            <label className="text-[10px] font-bold text-slate-500 uppercase tracking-wider">Department</label>
            <select value={department} onChange={(e) => setFilter('department', e.target.value)} className="w-full text-xs font-semibold bg-slate-50 border border-slate-200 rounded-lg p-2.5 outline-none focus:border-[#2F6BFF]">
              <option>All Departments</option>
              <option>Agriculture</option>
              <option>Banking</option>
              <option>Telecom</option>
              <option>Labor</option>
              <option>Railways</option>
            </select>
          </div>

          <div className="space-y-1">
            <label className="text-[10px] font-bold text-slate-500 uppercase tracking-wider">Complaint Category</label>
            <select value={category} onChange={(e) => setFilter('category', e.target.value)} className="w-full text-xs font-semibold bg-slate-50 border border-slate-200 rounded-lg p-2.5 outline-none focus:border-[#2F6BFF]">
              <option>All Categories</option>
              <option>Scheme Failure</option>
              <option>Financial Fraud</option>
              <option>Service Outage</option>
              <option>Infrastructure</option>
            </select>
          </div>

          <div className="space-y-1">
            <label className="text-[10px] font-bold text-slate-500 uppercase tracking-wider">Priority</label>
            <select value={priority} onChange={(e) => setFilter('priority', e.target.value)} className="w-full text-xs font-semibold bg-slate-50 border border-slate-200 rounded-lg p-2.5 outline-none focus:border-[#2F6BFF]">
              <option>All Priorities</option>
              <option>Critical</option>
              <option>High</option>
              <option>Medium</option>
            </select>
          </div>
        </div>

        <div className="pt-2">
          <div className="relative">
            <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
            <input 
              type="text" placeholder="Global Search across departments, states, categories, and IDs..." 
              value={searchQuery} onChange={(e) => setFilter('searchQuery', e.target.value)}
              className="w-full pl-10 pr-4 py-2.5 text-xs font-semibold bg-slate-50 border border-slate-200 rounded-lg outline-none focus:border-[#2F6BFF] shadow-sm"
            />
          </div>
        </div>
      </motion.div>

      {/* 3. WORKING KPI CARDS */}
      <motion.div variants={itemVariants} className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-6 gap-4 min-w-0">
        {isLoading ? Array.from({length: 6}).map((_, i) => (
          <div key={i} className="bg-white p-5 rounded-xl border border-slate-200 animate-pulse h-28"></div>
        )) : data?.kpis.map((kpi) => (
          <div 
            key={kpi.id} 
            onClick={() => {
              if (kpi.title === 'States Covered') navigate(ROUTES.INDIA_HEATMAP);
              else if (kpi.title === 'Recurring Complaints') navigate(ROUTES.ROOT_CAUSE);
              else navigate(kpi.route);
            }}
            className="bg-white p-5 rounded-xl border border-slate-200 shadow-sm hover:border-[#2F6BFF]/50 hover:shadow-md transition-all cursor-pointer group"
          >
            <div className="flex justify-between items-start mb-2">
              <div className="p-2 bg-slate-50 rounded-lg group-hover:bg-[#2F6BFF]/10 transition-colors">
                <Activity className="w-4 h-4 text-slate-500 group-hover:text-[#2F6BFF]" />
              </div>
              <span className={`text-[10px] font-bold px-1.5 py-0.5 rounded ${kpi.isPositive ? 'bg-green-100 text-green-800' : 'bg-orange-100 text-orange-800'}`}>
                {kpi.trend}
              </span>
            </div>
            <div className="text-[11px] font-bold text-slate-500 uppercase tracking-wider mb-0.5">{kpi.title}</div>
            <div className="text-xl font-['Poppins'] font-bold text-slate-900">{kpi.value}</div>
          </div>
        ))}
      </motion.div>

      {/* 4. INTERACTIVE CHARTS */}
      <motion.div variants={itemVariants} className="grid lg:grid-cols-2 gap-6 min-w-0">
        
        {/* Trend Area Chart */}
        <div className="bg-white p-6 rounded-xl border border-slate-200 shadow-sm flex flex-col h-[380px]">
          <h3 className="font-['Poppins'] font-bold text-slate-900 text-base mb-1">Complaint Volume & Resolution Flow</h3>
          <p className="text-xs text-slate-500 mb-4">Click chart areas to filter telemetry</p>
          <div className="flex-1 w-full min-h-0 cursor-pointer">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={data?.trendData} margin={{ top: 10, right: 10, left: -20, bottom: 0 }} onClick={(e) => {
                if (e && e.activePayload && e.activePayload[0]) {
                  setFilter('dateRange', e.activePayload[0].payload.name);
                  toast.success(`Filtered for month: ${e.activePayload[0].payload.name}`);
                }
              }}>
                <defs>
                  <linearGradient id="colTotal" x1="0" y1="0" x2="0" y2="1"><stop offset="5%" stopColor="#0B2E59" stopOpacity={0.3}/><stop offset="95%" stopColor="#0B2E59" stopOpacity={0}/></linearGradient>
                  <linearGradient id="colResolved" x1="0" y1="0" x2="0" y2="1"><stop offset="5%" stopColor="#1E8E3E" stopOpacity={0.3}/><stop offset="95%" stopColor="#1E8E3E" stopOpacity={0}/></linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#E2E8F0" />
                <XAxis dataKey="name" tick={{ fontSize: 11 }} axisLine={false} tickLine={false} />
                <YAxis tick={{ fontSize: 11 }} axisLine={false} tickLine={false} />
                <Tooltip />
                <Legend wrapperStyle={{ fontSize: '12px' }} />
                <Area type="monotone" dataKey="total" name="Total Ingested" stroke="#0B2E59" strokeWidth={2} fill="url(#colTotal)" />
                <Area type="monotone" dataKey="resolved" name="Resolved" stroke="#1E8E3E" strokeWidth={2} fill="url(#colResolved)" />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Department Comparison Bar Chart */}
        <div className="bg-white p-6 rounded-xl border border-slate-200 shadow-sm flex flex-col h-[380px]">
          <h3 className="font-['Poppins'] font-bold text-slate-900 text-base mb-1">Departmental Ingestion vs Resolution</h3>
          <p className="text-xs text-slate-500 mb-4">Click department bars to isolate ministry data</p>
          <div className="flex-1 w-full min-h-0 cursor-pointer">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={data?.departmentData} margin={{ top: 10, right: 10, left: -20, bottom: 0 }} onClick={(e) => {
                if (e && e.activePayload && e.activePayload[0]) {
                  setFilter('department', e.activePayload[0].payload.name);
                  toast.success(`Filtered for Department: ${e.activePayload[0].payload.name}`);
                }
              }}>
                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#E2E8F0" />
                <XAxis dataKey="name" tick={{ fontSize: 11 }} axisLine={false} tickLine={false} />
                <YAxis tick={{ fontSize: 11 }} axisLine={false} tickLine={false} />
                <Tooltip />
                <Legend wrapperStyle={{ fontSize: '12px' }} />
                <Bar dataKey="volume" name="Total Volume" fill="#0B2E59" radius={[4, 4, 0, 0]} />
                <Bar dataKey="pending" name="Backlog Pending" fill="#F57C00" radius={[4, 4, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>

      </motion.div>

      {/* 5. WORKING TABLES & AI INSIGHTS */}
      <div className="grid lg:grid-cols-3 gap-6 min-w-0">
        
        {/* Left: Interactive Data Table */}
        <motion.div variants={itemVariants} className="lg:col-span-2 bg-white rounded-xl border border-slate-200 shadow-sm overflow-hidden flex flex-col min-w-0">
          <div className="p-4 md:p-5 border-b border-slate-200 bg-slate-50/50 flex justify-between items-center">
            <div>
              <h3 className="font-['Poppins'] font-bold text-slate-900 text-base">Telemetry Records Ledger</h3>
              <p className="text-xs text-slate-500">Click any row to open full audit drawer</p>
            </div>
            <span className="text-xs font-semibold text-slate-500">{sortedRecords.length} records found</span>
          </div>
          
          <div className="overflow-x-auto w-full hide-scrollbar">
            <table className="w-full text-left min-w-[700px]">
              <thead className="bg-slate-50 border-b border-slate-200">
                <tr>
                  {[
                    { label: 'Record ID', key: 'id' },
                    { label: 'Department', key: 'department' },
                    { label: 'State / District', key: 'state' },
                    { label: 'Category', key: 'category' },
                    { label: 'Priority', key: 'priority' },
                    { label: 'Status', key: 'status' }
                  ].map((col) => (
                    <th 
                      key={col.key} onClick={() => setSorting(col.key)}
                      className="px-4 py-3 text-[10px] uppercase font-bold text-slate-500 tracking-wider whitespace-nowrap cursor-pointer hover:bg-slate-100 transition-colors"
                    >
                      <div className="flex items-center gap-1">
                        {col.label} <ArrowUpDown className="w-3 h-3 text-slate-400" />
                      </div>
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody className="text-xs font-medium">
                {isLoading ? (
                  <tr><td colSpan={6} className="p-8 text-center text-slate-400">Loading ledger...</td></tr>
                ) : paginatedRecords.length === 0 ? (
                  <tr><td colSpan={6} className="p-8 text-center text-slate-400">No records match current filter criteria.</td></tr>
                ) : paginatedRecords.map((row) => (
                  <tr 
                    key={row.id} onClick={() => setSelectedRecord(row)}
                    className="border-b border-slate-100 hover:bg-blue-50/50 transition-colors cursor-pointer"
                  >
                    <td className="px-4 py-3 text-[#0B2E59] font-bold whitespace-nowrap">{row.id}</td>
                    <td className="px-4 py-3 text-slate-900 font-bold">{row.department}</td>
                    <td className="px-4 py-3 text-slate-600">{row.state} <span className="text-slate-400">({row.district})</span></td>
                    <td className="px-4 py-3 text-slate-600">{row.category}</td>
                    <td className="px-4 py-3">
                      <span className={`px-2 py-0.5 rounded text-[10px] font-bold uppercase ${row.priority === 'Critical' ? 'bg-red-100 text-red-700' : 'bg-orange-100 text-orange-700'}`}>
                        {row.priority}
                      </span>
                    </td>
                    <td className="px-4 py-3">
                      <span className={`px-2 py-0.5 rounded text-[10px] font-bold uppercase ${row.status === 'Resolved' ? 'bg-green-100 text-green-700' : 'bg-blue-100 text-blue-700'}`}>
                        {row.status}
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          {/* Pagination Footer */}
          <div className="p-4 border-t border-slate-200 bg-slate-50 flex justify-between items-center text-xs text-slate-600">
            <span>Page {currentPage} of {totalPages || 1}</span>
            <div className="flex items-center gap-2">
              <button 
                onClick={() => setCurrentPage(Math.max(currentPage - 1, 1))} disabled={currentPage === 1}
                className="p-1.5 bg-white border border-slate-200 rounded disabled:opacity-50 hover:bg-slate-50"
              >
                <ChevronLeft className="w-4 h-4" />
              </button>
              <button 
                onClick={() => setCurrentPage(Math.min(currentPage + 1, totalPages))} disabled={currentPage === totalPages || totalPages === 0}
                className="p-1.5 bg-white border border-slate-200 rounded disabled:opacity-50 hover:bg-slate-50"
              >
                <ChevronRight className="w-4 h-4" />
              </button>
            </div>
          </div>
        </motion.div>

        {/* Right: AI Telemetry Insights */}
        <motion.div variants={itemVariants} className="bg-white rounded-xl border border-slate-200 shadow-sm p-5 flex flex-col min-w-0">
          <h3 className="font-['Poppins'] font-bold text-slate-900 text-base mb-4 flex items-center gap-2">
            <Lightbulb className="w-5 h-5 text-[#2F6BFF]" /> AI Telemetry Insights
          </h3>
          <div className="space-y-4 flex-1">
            {data?.aiInsights.map((insight) => (
              <div key={insight.id} className="bg-slate-50 border border-slate-200 rounded-xl p-4 space-y-3">
                <div className="flex justify-between items-start">
                  <h4 className="font-bold text-slate-900 text-sm">{insight.title}</h4>
                  <span className="bg-blue-100 text-[#2F6BFF] text-[10px] font-bold px-2 py-0.5 rounded-full">{insight.confidence}% Match</span>
                </div>
                <p className="text-xs text-slate-600 leading-relaxed">{insight.reason}</p>
                <div className="text-[11px] font-semibold text-[#0B2E59] bg-white p-2 rounded border border-slate-200">
                  <span className="text-slate-400 block text-[9px] uppercase font-bold">Recommendation</span>
                  {insight.recommendation}
                </div>
                <button 
                  onClick={() => navigate(insight.route)}
                  className="w-full flex items-center justify-center gap-2 py-2 bg-[#0B2E59] hover:bg-[#082244] text-white text-xs font-bold rounded-lg shadow-sm transition-colors"
                >
                  Open Root Cause <ExternalLink className="w-3.5 h-3.5" />
                </button>
              </div>
            ))}
          </div>
        </motion.div>

      </div>

      {/* ==================== 6. DETAIL DRAWER ==================== */}
      <AnimatePresence>
        {selectedRecord && (
          <>
            {/* Backdrop */}
            <motion.div 
              initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
              onClick={() => setSelectedRecord(null)}
              className="fixed inset-0 bg-slate-900/40 backdrop-blur-sm z-50"
            />
            
            {/* Drawer */}
            <motion.div 
              initial={{ x: '100%' }} animate={{ x: 0 }} exit={{ x: '100%' }}
              transition={{ type: 'spring', damping: 25, stiffness: 200 }}
              className="fixed right-0 top-0 h-screen w-full max-w-md bg-white shadow-2xl z-50 p-6 flex flex-col overflow-y-auto border-l border-slate-200"
            >
              <div className="flex justify-between items-center border-b border-slate-200 pb-4 mb-6">
                <div>
                  <span className="text-xs font-bold text-[#2F6BFF] uppercase tracking-wider">{selectedRecord.id}</span>
                  <h3 className="font-['Poppins'] font-bold text-xl text-slate-900">{selectedRecord.department}</h3>
                </div>
                <button onClick={() => setSelectedRecord(null)} className="p-2 text-slate-400 hover:text-slate-900 hover:bg-slate-100 rounded-full transition-colors">
                  <X className="w-5 h-5" />
                </button>
              </div>

              <div className="space-y-6 flex-1">
                <div>
                  <h4 className="text-xs font-bold text-slate-400 uppercase tracking-wider mb-2">Location Telemetry</h4>
                  <div className="bg-slate-50 p-3.5 rounded-lg border border-slate-200 text-sm font-semibold text-slate-800">
                    {selectedRecord.state} — District: {selectedRecord.district}
                  </div>
                </div>

                <div>
                  <h4 className="text-xs font-bold text-slate-400 uppercase tracking-wider mb-2">Complaint Description</h4>
                  <p className="text-sm text-slate-700 bg-slate-50 p-3.5 rounded-lg border border-slate-200 leading-relaxed">
                    {selectedRecord.description}
                  </p>
                </div>

                <div>
                  <h4 className="text-xs font-bold text-slate-400 uppercase tracking-wider mb-2">AI Summary & Root Cause</h4>
                  <div className="bg-blue-50/50 p-3.5 rounded-lg border border-blue-200 text-sm text-blue-900 leading-relaxed flex gap-3">
                    <CheckCircle2 className="w-5 h-5 text-[#2F6BFF] shrink-0 mt-0.5" />
                    <div>{selectedRecord.aiSummary}</div>
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div className="bg-slate-50 p-3 rounded-lg border border-slate-200">
                    <span className="text-[10px] uppercase font-bold text-slate-400 block mb-0.5">Priority</span>
                    <span className={`text-xs font-bold uppercase ${selectedRecord.priority === 'Critical' ? 'text-red-600' : 'text-orange-600'}`}>{selectedRecord.priority}</span>
                  </div>
                  <div className="bg-slate-50 p-3 rounded-lg border border-slate-200">
                    <span className="text-[10px] uppercase font-bold text-slate-400 block mb-0.5">Status</span>
                    <span className="text-xs font-bold text-slate-800 uppercase">{selectedRecord.status}</span>
                  </div>
                </div>
              </div>

              <div className="pt-6 border-t border-slate-200 space-y-3 mt-auto">
                <button 
                  onClick={() => { setSelectedRecord(null); navigate(ROUTES.ROOT_CAUSE); }}
                  className="w-full py-3 bg-[#0B2E59] hover:bg-[#082244] text-white text-sm font-bold rounded-lg shadow-sm transition-colors"
                >
                  Open Root Cause Analysis
                </button>
                <button 
                  onClick={() => { setSelectedRecord(null); navigate(ROUTES.INDIA_HEATMAP); }}
                  className="w-full py-3 bg-white border border-slate-200 hover:bg-slate-50 text-slate-700 text-sm font-bold rounded-lg transition-colors"
                >
                  View on India Heatmap
                </button>
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>

    </motion.div>
  );
};