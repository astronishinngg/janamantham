import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  ChevronRight, Search, Download, Filter, FileText, Target, BarChart3, 
  Clock, CheckCircle2, Eye, Printer, Share2, Trash2, X, Plus, HardDrive, 
  AlertTriangle, ArrowUpDown, MoreVertical, FileBarChart2
} from 'lucide-react';

// ============================================================================
// MOCK DATA: DMS
// ============================================================================

const LAST_UPDATED = "Sunday, August 2, 2026, 8:15 PM IST";

type ReportStatus = 'Approved' | 'Pending Review' | 'Draft';
type ReportType = 'Policy Brief' | 'Root Cause Analysis' | 'Analytics Report';

interface Report {
  id: string;
  title: string;
  dept: string;
  state: string;
  type: ReportType;
  date: string;
  author: string;
  status: ReportStatus;
  version: string;
  confidence: number;
  summary: string;
  tags: string[];
}

const mockReports: Report[] = [
  {
    id: "PB-2026-0841",
    title: "Resolution of PM-KISAN NPCI Mapping Failures",
    dept: "Agriculture",
    state: "Maharashtra",
    type: "Policy Brief",
    date: "Aug 02, 2026",
    author: "Manthan AI",
    status: "Pending Review",
    version: "v1.0",
    confidence: 96,
    summary: "AI analysis identified a severe systemic failure causing the rejection of PM-KISAN 14th installment disbursements despite active citizen accounts. Recommends automated daily API reconciliation.",
    tags: ["High Priority", "Financial", "Infrastructure"]
  },
  {
    id: "RCA-2026-0792",
    title: "Telecom Outage Correlation with Monsoon Damage",
    dept: "Telecom",
    state: "Karnataka",
    type: "Root Cause Analysis",
    date: "Aug 01, 2026",
    author: "System Auto",
    status: "Approved",
    version: "v2.1",
    confidence: 88,
    summary: "Root cause investigation into the 340% spike in rural connectivity complaints. Confirms structural failure of BSNL towers in 4 districts due to recent floods.",
    tags: ["Disaster Mgmt", "Telecom", "Critical"]
  },
  {
    id: "AR-2026-0711",
    title: "Q2 National Grievance Trend Summary",
    dept: "Multi-Dept",
    state: "Pan-India",
    type: "Analytics Report",
    date: "Jul 28, 2026",
    author: "R. Sharma",
    status: "Approved",
    version: "v1.2",
    confidence: 99,
    summary: "Quarterly overview of grievance ingestion. Shows a 14% overall volume increase, primarily driven by the banking and agricultural sectors.",
    tags: ["Quarterly", "Summary", "Executive"]
  },
  {
    id: "PB-2026-0688",
    title: "EPFO Portal Mobile UI/UX Modernization",
    dept: "Labor",
    state: "Pan-India",
    type: "Policy Brief",
    date: "Jul 25, 2026",
    author: "Manthan AI",
    status: "Draft",
    version: "v0.9",
    confidence: 92,
    summary: "Semantic clustering reveals that 65% of passbook errors are UI issues where citizens cannot locate the download button on mobile devices.",
    tags: ["IT Reform", "Medium Priority", "UI/UX"]
  },
  {
    id: "RCA-2026-0650",
    title: "Railway Cleanliness Contract Failures",
    dept: "Railways",
    state: "Bihar",
    type: "Root Cause Analysis",
    date: "Jul 20, 2026",
    author: "Manthan AI",
    status: "Approved",
    version: "v1.0",
    confidence: 95,
    summary: "Identifies a lapse in 3rd party vendor SLAs across 12 major stations in Bihar, leading to a 40% increase in sanitation complaints.",
    tags: ["Sanitation", "Vendor Mgmt"]
  },
];

// ============================================================================
// ANIMATION VARIANTS
// ============================================================================

const containerVariants = { hidden: { opacity: 0 }, visible: { opacity: 1, transition: { staggerChildren: 0.1 } } };
const itemVariants = { hidden: { opacity: 0, y: 15 }, visible: { opacity: 1, y: 0, transition: { duration: 0.4 } } };
const slidePanelVariants = { 
  hidden: { x: '100%', opacity: 0 }, 
  visible: { x: 0, opacity: 1, transition: { type: 'spring', damping: 25, stiffness: 200 } }, 
  exit: { x: '100%', opacity: 0, transition: { duration: 0.2 } } 
};

// ============================================================================
// MAIN COMPONENT
// ============================================================================

export const Reports: React.FC = () => {
  const [selectedReport, setSelectedReport] = useState<Report | null>(null);

  const getStatusBadge = (status: ReportStatus) => {
    switch (status) {
      case 'Approved': return <span className="px-2.5 py-1 bg-green-100 text-green-700 text-xs font-bold rounded-md">Approved</span>;
      case 'Pending Review': return <span className="px-2.5 py-1 bg-orange-100 text-orange-700 text-xs font-bold rounded-md">Pending</span>;
      case 'Draft': return <span className="px-2.5 py-1 bg-slate-100 text-slate-700 text-xs font-bold rounded-md">Draft</span>;
    }
  };

  const getTypeIcon = (type: ReportType) => {
    switch (type) {
      case 'Policy Brief': return <FileText className="w-4 h-4 text-[#1E8E3E]" />;
      case 'Root Cause Analysis': return <Target className="w-4 h-4 text-[#F57C00]" />;
      case 'Analytics Report': return <BarChart3 className="w-4 h-4 text-[#0B2E59]" />;
    }
  };

  return (
    <motion.div variants={containerVariants} initial="hidden" animate="visible" className="space-y-6 pb-10">
      
      {/* 1. GLOBAL HEADER */}
      <motion.div variants={itemVariants} className="flex flex-col lg:flex-row lg:items-center justify-between gap-4 bg-white p-5 rounded-xl border border-[#E2E8F0] shadow-sm">
        <div>
          <div className="flex items-center gap-2 text-sm text-[#64748B] mb-1 font-medium">
            <span className="hover:text-[#0B2E59] cursor-pointer">Dashboard</span>
            <ChevronRight className="w-4 h-4" />
            <span className="text-[#0B2E59] font-semibold">Reports Vault</span>
          </div>
          <h1 className="text-2xl font-['Poppins'] font-bold text-[#1E293B] flex items-center gap-2">
            <FileBarChart2 className="w-6 h-6 text-[#0B2E59]" /> Document Management System
          </h1>
        </div>
        
        <div className="flex flex-wrap items-center gap-3">
          <span className="hidden md:flex text-xs text-[#64748B] bg-[#F8FAFC] px-3 py-2 rounded-lg border border-[#E2E8F0]">
            Last Sync: {LAST_UPDATED}
          </span>
          <button className="flex items-center gap-2 px-4 py-2 bg-white border border-[#E2E8F0] text-[#1E293B] text-sm font-semibold rounded-lg shadow-sm hover:bg-[#F8FAFC] transition-colors">
            <Download className="w-4 h-4" /> Export All
          </button>
          <button className="flex items-center gap-2 px-4 py-2 bg-[#0B2E59] text-white text-sm font-semibold rounded-lg shadow-sm hover:bg-[#082244] transition-colors">
            <Plus className="w-4 h-4" /> Generate Report
          </button>
        </div>
      </motion.div>

      {/* 2. SEARCH & FILTER PANEL */}
      <motion.div variants={itemVariants} className="bg-white p-4 rounded-xl border border-[#E2E8F0] shadow-sm flex items-center gap-4 overflow-x-auto hide-scrollbar">
        <div className="relative min-w-[250px]">
          <Search className="w-4 h-4 text-[#64748B] absolute left-3 top-1/2 -translate-y-1/2" />
          <input 
            type="text" 
            placeholder="Search report ID, title, tags..." 
            className="w-full pl-9 pr-4 py-2 bg-[#F8FAFC] border border-[#E2E8F0] rounded-lg text-sm focus:outline-none focus:border-[#0B2E59] focus:ring-1 focus:ring-[#0B2E59]"
          />
        </div>
        
        <div className="flex items-center gap-2 border-l border-[#E2E8F0] pl-4">
          <Filter className="w-4 h-4 text-[#64748B]" />
        </div>
        
        {['All Departments', 'All States', 'Report Type', 'Status', 'Date: Last 30 Days'].map((filter, i) => (
          <select key={i} className="bg-[#F8FAFC] border border-[#E2E8F0] text-[#1E293B] text-sm font-medium rounded-lg px-3 py-2 outline-none hover:border-[#0B2E59]/50 transition-colors cursor-pointer shrink-0 appearance-none pr-8 relative bg-[url('data:image/svg+xml;charset=US-ASCII,%3Csvg%20xmlns%3D%22http%3A%2F%2Fwww.w3.org%2F2000%2Fsvg%22%20width%3D%2216%22%20height%3D%2216%22%20viewBox%3D%220%200%2024%2024%22%20fill%3D%22none%22%20stroke%3D%22%2364748B%22%20stroke-width%3D%222%22%20stroke-linecap%3D%22round%22%20stroke-linejoin%3D%22round%22%3E%3Cpolyline%20points%3D%226%209%2012%2015%2018%209%22%3E%3C%2Fpolyline%3E%3C%2Fsvg%3E')] bg-no-repeat bg-[position:right_8px_center]">
            <option>{filter}</option>
          </select>
        ))}
        
        <div className="ml-auto pl-4 flex gap-2 shrink-0">
          <button className="text-sm font-semibold text-[#0B2E59] hover:underline px-2">Reset</button>
        </div>
      </motion.div>

      {/* 3. REPORT STATISTICS */}
      <motion.div variants={itemVariants} className="grid grid-cols-2 lg:grid-cols-6 gap-4">
        {[
          { title: "Total Reports", count: "1,248", icon: FileBarChart2, color: "text-[#0B2E59]", trend: "+12 this week" },
          { title: "Policy Briefs", count: "412", icon: FileText, color: "text-[#1E8E3E]", trend: "3 pending review" },
          { title: "Root Cause Reps", count: "386", icon: Target, color: "text-[#F57C00]", trend: "High priority active" },
          { title: "Analytics Reports", count: "450", icon: BarChart3, color: "text-[#64748B]", trend: "Weekly generated" },
          { title: "Pending Reviews", count: "24", icon: AlertTriangle, color: "text-orange-600", bg: "bg-orange-50", trend: "Action required" },
          { title: "Approved", count: "1,180", icon: CheckCircle2, color: "text-green-600", bg: "bg-green-50", trend: "Fully verified" },
        ].map((stat, i) => (
          <div key={i} className={`bg-white p-4 rounded-xl border border-[#E2E8F0] shadow-sm ${stat.bg || ''}`}>
            <div className="flex justify-between items-start mb-2">
              <div className={`p-2 rounded-lg bg-slate-50 border border-slate-100 ${stat.color}`}>
                <stat.icon className="w-4 h-4" />
              </div>
            </div>
            <div className="text-xl font-['Poppins'] font-bold text-[#1E293B] mb-0.5">{stat.count}</div>
            <h3 className="text-[#64748B] text-xs font-bold uppercase tracking-wider mb-1">{stat.title}</h3>
            <div className="text-[10px] text-[#64748B] font-medium">{stat.trend}</div>
          </div>
        ))}
      </motion.div>

      <div className="flex flex-col xl:flex-row gap-6">
        
        {/* ==================== LEFT MAIN AREA ==================== */}
        <div className="flex-1 min-w-0 space-y-6">
          
          {/* 4. REPORTS TABLE */}
          <motion.div variants={itemVariants} className="bg-white rounded-xl border border-[#E2E8F0] shadow-sm overflow-hidden">
            <div className="overflow-x-auto">
              <table className="w-full text-left border-collapse">
                <thead className="bg-[#F8FAFC] border-b border-[#E2E8F0] sticky top-0 z-10">
                  <tr>
                    {['Report ID', 'Document Title', 'Dept / State', 'Type', 'Date & Author', 'Status', 'Actions'].map((head, i) => (
                      <th key={i} className="px-5 py-4 text-xs uppercase font-bold text-[#64748B] whitespace-nowrap">
                        <div className="flex items-center gap-1 cursor-pointer hover:text-[#0B2E59]">
                          {head} {head !== 'Actions' && <ArrowUpDown className="w-3 h-3 opacity-50" />}
                        </div>
                      </th>
                    ))}
                  </tr>
                </thead>
                <tbody className="text-sm">
                  {mockReports.map((report) => (
                    <tr 
                      key={report.id} 
                      onClick={() => setSelectedReport(report)}
                      className="border-b border-[#E2E8F0] hover:bg-slate-50 transition-colors cursor-pointer group"
                    >
                      <td className="px-5 py-4 font-bold text-[#0B2E59] whitespace-nowrap">{report.id}</td>
                      <td className="px-5 py-4">
                        <div className="font-bold text-[#1E293B] mb-0.5 group-hover:text-[#0B2E59] transition-colors">{report.title}</div>
                        <div className="flex gap-1.5">
                          {report.tags.slice(0,2).map(tag => (
                            <span key={tag} className="text-[10px] font-semibold bg-slate-100 text-slate-600 px-1.5 rounded">{tag}</span>
                          ))}
                        </div>
                      </td>
                      <td className="px-5 py-4 whitespace-nowrap">
                        <div className="font-semibold text-[#1E293B]">{report.dept}</div>
                        <div className="text-xs text-[#64748B]">{report.state}</div>
                      </td>
                      <td className="px-5 py-4 whitespace-nowrap">
                        <div className="flex items-center gap-1.5 text-[#1E293B] font-medium text-xs">
                          {getTypeIcon(report.type)} {report.type}
                        </div>
                      </td>
                      <td className="px-5 py-4 whitespace-nowrap">
                        <div className="font-semibold text-[#1E293B]">{report.date}</div>
                        <div className="text-xs text-[#64748B]">{report.author}</div>
                      </td>
                      <td className="px-5 py-4 whitespace-nowrap">
                        {getStatusBadge(report.status)}
                      </td>
                      <td className="px-5 py-4 whitespace-nowrap">
                        <div className="flex items-center gap-2" onClick={(e) => e.stopPropagation()}>
                          <button onClick={() => setSelectedReport(report)} className="p-1.5 text-[#64748B] hover:text-[#0B2E59] hover:bg-[#F8FAFC] rounded transition-colors" title="Preview"><Eye className="w-4 h-4" /></button>
                          <button className="p-1.5 text-[#64748B] hover:text-[#1E8E3E] hover:bg-green-50 rounded transition-colors" title="Download"><Download className="w-4 h-4" /></button>
                          <button className="p-1.5 text-[#64748B] hover:text-[#1E293B] hover:bg-[#F8FAFC] rounded transition-colors"><MoreVertical className="w-4 h-4" /></button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
            {/* Pagination Mock */}
            <div className="p-4 border-t border-[#E2E8F0] bg-[#F8FAFC] flex justify-between items-center text-xs font-semibold text-[#64748B]">
              <span>Showing 1-5 of 1,248 Reports</span>
              <div className="flex gap-2">
                <button className="px-3 py-1.5 bg-white border border-[#E2E8F0] rounded hover:bg-slate-50 disabled:opacity-50" disabled>Previous</button>
                <button className="px-3 py-1.5 bg-white border border-[#E2E8F0] rounded hover:bg-slate-50">Next</button>
              </div>
            </div>
          </motion.div>

          {/* 5. RECENT & INSIGHTS GRID */}
          <div className="grid md:grid-cols-2 gap-6">
            <motion.div variants={itemVariants} className="bg-white rounded-xl border border-[#E2E8F0] shadow-sm p-5">
              <h3 className="font-['Poppins'] font-bold text-[#1E293B] mb-4">Recently Accessed</h3>
              <div className="space-y-3">
                {mockReports.slice(0,3).map(report => (
                  <div key={report.id} onClick={() => setSelectedReport(report)} className="flex items-start gap-3 p-3 rounded-lg border border-[#E2E8F0] hover:border-[#0B2E59]/30 hover:bg-[#F8FAFC] cursor-pointer transition-colors">
                    <div className="bg-slate-100 p-2 rounded text-[#0B2E59]">{getTypeIcon(report.type)}</div>
                    <div>
                      <h4 className="text-sm font-bold text-[#1E293B] line-clamp-1">{report.title}</h4>
                      <p className="text-xs text-[#64748B] mt-0.5">{report.date} • {report.dept}</p>
                    </div>
                  </div>
                ))}
              </div>
            </motion.div>

            <motion.div variants={itemVariants} className="bg-[#0B2E59] rounded-xl border border-[#0B2E59] shadow-sm p-5 text-white">
              <h3 className="font-['Poppins'] font-bold text-lg mb-4 flex items-center gap-2">
                <BarChart3 className="w-5 h-5 text-blue-300" /> Platform Insights
              </h3>
              <div className="space-y-4">
                <div className="flex justify-between items-center border-b border-white/10 pb-2">
                  <span className="text-sm text-white/80">Most active department</span>
                  <span className="font-bold">Agriculture (PM-KISAN)</span>
                </div>
                <div className="flex justify-between items-center border-b border-white/10 pb-2">
                  <span className="text-sm text-white/80">Avg. AI Confidence</span>
                  <span className="font-bold text-green-400">94.2%</span>
                </div>
                <div className="flex justify-between items-center border-b border-white/10 pb-2">
                  <span className="text-sm text-white/80">Reports requiring review</span>
                  <span className="font-bold text-orange-400">24 Documents</span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-sm text-white/80">Storage Utilized</span>
                  <span className="font-bold">42% (2.1 TB)</span>
                </div>
              </div>
            </motion.div>
          </div>

        </div>

        {/* ==================== RIGHT SIDEBAR (Optional Utilities) ==================== */}
        <div className="w-full xl:w-72 shrink-0 space-y-6">
          <motion.div variants={itemVariants} className="bg-white rounded-xl border border-[#E2E8F0] shadow-sm p-5">
            <h3 className="font-['Poppins'] font-bold text-[#1E293B] mb-4 text-sm">System Storage</h3>
            <div className="flex justify-between text-xs font-bold text-[#64748B] uppercase mb-1">
              <span>Secure Vault</span>
              <span>2.1 / 5.0 TB</span>
            </div>
            <div className="h-2 bg-[#F8FAFC] rounded-full border border-[#E2E8F0] mb-4 overflow-hidden">
              <div className="h-full bg-[#0B2E59] rounded-full w-[42%]"></div>
            </div>
            <p className="text-xs text-[#64748B] leading-relaxed">
              All documents are encrypted using AES-256 standard and stored within compliant GovCloud regions.
            </p>
          </motion.div>

          {/* QUICK ACTIONS */}
          <motion.div variants={itemVariants} className="bg-white rounded-xl border border-[#E2E8F0] shadow-sm p-5 space-y-2">
            <h3 className="font-['Poppins'] font-bold text-[#1E293B] mb-3 text-sm">Platform Shortcuts</h3>
            <button className="w-full flex items-center justify-between p-2.5 hover:bg-[#F8FAFC] rounded-lg border border-transparent hover:border-[#E2E8F0] transition-colors text-sm font-semibold text-[#1E293B]">
              <span className="flex items-center gap-2"><FileText className="w-4 h-4 text-[#64748B]" /> New Policy Brief</span>
            </button>
            <button className="w-full flex items-center justify-between p-2.5 hover:bg-[#F8FAFC] rounded-lg border border-transparent hover:border-[#E2E8F0] transition-colors text-sm font-semibold text-[#1E293B]">
              <span className="flex items-center gap-2"><Target className="w-4 h-4 text-[#64748B]" /> Investigate Root Cause</span>
            </button>
            <button className="w-full flex items-center justify-between p-2.5 hover:bg-[#F8FAFC] rounded-lg border border-transparent hover:border-[#E2E8F0] transition-colors text-sm font-semibold text-[#1E293B]">
              <span className="flex items-center gap-2"><BarChart3 className="w-4 h-4 text-[#64748B]" /> Analytics Dashboard</span>
            </button>
            <button className="w-full flex items-center justify-between p-2.5 hover:bg-[#F8FAFC] rounded-lg border border-transparent hover:border-[#E2E8F0] transition-colors text-sm font-semibold text-[#1E293B]">
              <span className="flex items-center gap-2"><HardDrive className="w-4 h-4 text-[#64748B]" /> Manage Data Sources</span>
            </button>
          </motion.div>
        </div>
      </div>

      {/* ==================== SLIDE-OVER REPORT PREVIEW ==================== */}
      <AnimatePresence>
        {selectedReport && (
          <>
            {/* Backdrop */}
            <motion.div 
              initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
              onClick={() => setSelectedReport(null)}
              className="fixed inset-0 bg-[#0B2E59]/20 backdrop-blur-sm z-[100]"
            />
            {/* Panel */}
            <motion.div 
              variants={slidePanelVariants}
              initial="hidden" animate="visible" exit="exit"
              className="fixed inset-y-0 right-0 w-full max-w-md bg-white shadow-2xl z-[110] border-l border-[#E2E8F0] flex flex-col"
            >
              {/* Header */}
              <div className="p-5 bg-[#F8FAFC] border-b border-[#E2E8F0] flex justify-between items-start">
                <div>
                  <div className="text-xs font-bold text-[#64748B] mb-1">{selectedReport.id}</div>
                  <h2 className="font-['Poppins'] font-bold text-lg text-[#1E293B] leading-snug">{selectedReport.title}</h2>
                </div>
                <button onClick={() => setSelectedReport(null)} className="p-1.5 text-[#64748B] hover:bg-[#E2E8F0] rounded transition-colors">
                  <X className="w-5 h-5" />
                </button>
              </div>

              {/* Scrollable Content */}
              <div className="flex-1 overflow-y-auto p-6 space-y-6">
                
                {/* Meta Grid */}
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <div className="text-[10px] uppercase font-bold text-[#64748B] mb-1">Status</div>
                    <div>{getStatusBadge(selectedReport.status)}</div>
                  </div>
                  <div>
                    <div className="text-[10px] uppercase font-bold text-[#64748B] mb-1">AI Confidence</div>
                    <div className="text-sm font-bold text-[#1E8E3E]">{selectedReport.confidence}%</div>
                  </div>
                  <div>
                    <div className="text-[10px] uppercase font-bold text-[#64748B] mb-1">Department</div>
                    <div className="text-sm font-semibold text-[#1E293B]">{selectedReport.dept}</div>
                  </div>
                  <div>
                    <div className="text-[10px] uppercase font-bold text-[#64748B] mb-1">Date</div>
                    <div className="text-sm font-semibold text-[#1E293B]">{selectedReport.date}</div>
                  </div>
                </div>

                {/* Tags */}
                <div>
                  <div className="text-[10px] uppercase font-bold text-[#64748B] mb-2">Document Tags</div>
                  <div className="flex flex-wrap gap-2">
                    {selectedReport.tags.map(tag => (
                      <span key={tag} className="text-xs font-semibold bg-[#F8FAFC] border border-[#E2E8F0] text-[#1E293B] px-2.5 py-1 rounded-full">
                        {tag}
                      </span>
                    ))}
                  </div>
                </div>

                {/* Executive Summary */}
                <div>
                  <div className="text-[10px] uppercase font-bold text-[#64748B] mb-2">Executive Summary</div>
                  <div className="bg-[#F8FAFC] border border-[#E2E8F0] p-4 rounded-lg text-sm text-[#1E293B] leading-relaxed">
                    {selectedReport.summary}
                  </div>
                </div>

                {/* Dummy Thumbnail to signify it's a document */}
                <div className="border border-[#E2E8F0] rounded-lg overflow-hidden bg-slate-50 flex flex-col items-center justify-center p-6 text-[#64748B]">
                  <FileText className="w-12 h-12 mb-2 opacity-20" />
                  <span className="text-xs font-semibold uppercase tracking-widest opacity-50">Document Preview</span>
                </div>
              </div>

              {/* Footer Actions */}
              <div className="p-5 border-t border-[#E2E8F0] bg-white grid grid-cols-2 gap-3">
                <button className="flex items-center justify-center gap-2 px-4 py-2.5 bg-white border border-[#E2E8F0] text-[#1E293B] text-sm font-bold rounded-lg shadow-sm hover:bg-[#F8FAFC] transition-colors">
                  <Download className="w-4 h-4" /> Download PDF
                </button>
                <button className="flex items-center justify-center gap-2 px-4 py-2.5 bg-[#0B2E59] text-white text-sm font-bold rounded-lg shadow-sm hover:bg-[#082244] transition-colors">
                  <Eye className="w-4 h-4" /> Open Full Report
                </button>
                <button className="col-span-2 flex items-center justify-center gap-2 px-4 py-2 text-[#64748B] hover:text-[#0B2E59] text-sm font-semibold transition-colors">
                  <Share2 className="w-4 h-4" /> Share Document Link
                </button>
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>

      <style>{`
        .hide-scrollbar::-webkit-scrollbar { display: none; }
        .hide-scrollbar { -ms-overflow-style: none; scrollbar-width: none; }
      `}</style>
    </motion.div>
  );
};