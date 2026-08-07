import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  ChevronRight, Search, Download, Share2, BrainCircuit, Target, 
  AlertTriangle, Network, Clock, Activity, ShieldCheck, Users, 
  Landmark, FileText, TrendingUp, Lightbulb, CheckCircle2, 
  MessageSquare, FileSearch, Filter, Map, Database
} from 'lucide-react';
import { 
  AreaChart, Area, BarChart, Bar, XAxis, YAxis, CartesianGrid, 
  Tooltip as RechartsTooltip, ResponsiveContainer, LineChart, Line
} from 'recharts';

// ============================================================================
// MOCK DATA: XAI & INVESTIGATION REPORT
// ============================================================================

const LAST_ANALYSIS = "August 2, 2026, 7:15 PM IST";

const rootCauses = [
  { 
    id: 'rc-1', 
    name: 'PM-KISAN Disbursement Failure (Aadhaar-NPCI Mapping)',
    severity: 'Critical',
    depts: ['Agriculture', 'Banking'],
    states: ['Maharashtra', 'Uttar Pradesh'],
    total: '18,450',
    recurring: '92%',
    confidence: 96,
    risk: 'High',
    priority: 'P1'
  },
  { 
    id: 'rc-2', 
    name: 'Telecom Infrastructure Outage (Monsoon Damage)',
    severity: 'High',
    depts: ['Telecom'],
    states: ['Karnataka', 'Tamil Nadu'],
    total: '12,200',
    recurring: '68%',
    confidence: 88,
    risk: 'Medium',
    priority: 'P2'
  },
  { 
    id: 'rc-3', 
    name: 'EPFO Portal Server Timeout on Mobile Devices',
    severity: 'Medium',
    depts: ['Labor (EPFO)'],
    states: ['Pan-India'],
    total: '8,100',
    recurring: '85%',
    confidence: 94,
    risk: 'Medium',
    priority: 'P3'
  },
];

const evolutionData = [
  { week: 'Week 1', complaints: 450, mapped: 120 },
  { week: 'Week 2', complaints: 800, mapped: 300 },
  { week: 'Week 3', complaints: 1600, mapped: 750 },
  { week: 'Week 4', complaints: 4200, mapped: 2100 },
  { week: 'Week 5', complaints: 8900, mapped: 5400 },
  { week: 'Week 6', complaints: 18450, mapped: 12100 },
];

const evidenceKeywords = [
  { word: 'Aadhaar linking failed', weight: 98 },
  { word: 'Installment not received', weight: 95 },
  { word: 'NPCI status inactive', weight: 92 },
  { word: 'Bank branch refused', weight: 85 },
  { word: 'e-KYC pending error', weight: 81 },
];

const sampleComplaints = [
  { id: 'CP-8921', text: "My PM-KISAN 14th installment is stopped. Bank says Aadhaar is linked, but portal says NPCI mapping is missing.", score: "99% match" },
  { id: 'CP-4432', text: "Account closed due to KYC, now scheme money returning. CSC center unable to update new bank details.", score: "96% match" },
  { id: 'CP-9011', text: "Showing 'Aadhaar not seeded in NPCI' for 3 months. Visited Gram Panchayat and Bank 4 times.", score: "94% match" },
];

// ============================================================================
// ANIMATION VARIANTS
// ============================================================================

const containerVariants = { hidden: { opacity: 0 }, visible: { opacity: 1, transition: { staggerChildren: 0.1 } } };
const itemVariants = { hidden: { opacity: 0, y: 15 }, visible: { opacity: 1, y: 0, transition: { duration: 0.4 } } };

// ============================================================================
// MAIN COMPONENT
// ============================================================================

export const RootCauseAnalysis: React.FC = () => {
  const [activeCause, setActiveCause] = useState(rootCauses[0]);

  return (
    <motion.div variants={containerVariants} initial="hidden" animate="visible" className="space-y-6 pb-10">
      
      {/* 1. GLOBAL HEADER */}
      <motion.div variants={itemVariants} className="flex flex-col lg:flex-row lg:items-center justify-between gap-4 bg-white p-5 rounded-xl border border-[#E2E8F0] shadow-sm">
        <div>
          <div className="flex items-center gap-2 text-sm text-[#64748B] mb-1 font-medium">
            <span className="hover:text-[#0B2E59] cursor-pointer">Dashboard</span>
            <ChevronRight className="w-4 h-4" />
            <span className="text-[#0B2E59] font-semibold">Root Cause Analysis</span>
          </div>
          <h1 className="text-2xl font-['Poppins'] font-bold text-[#1E293B] flex items-center gap-2">
            <Target className="w-6 h-6 text-[#F57C00]" /> AI Investigation Report
          </h1>
        </div>
        
        <div className="flex flex-wrap items-center gap-3">
          <div className="relative hidden md:block">
            <Search className="w-4 h-4 text-[#64748B] absolute left-3 top-1/2 -translate-y-1/2" />
            <input 
              type="text" 
              placeholder="Search investigations..." 
              className="pl-9 pr-4 py-2 bg-[#F8FAFC] border border-[#E2E8F0] rounded-lg text-sm focus:outline-none focus:border-[#0B2E59] focus:ring-1 focus:ring-[#0B2E59] w-48"
            />
          </div>
          <button className="p-2 border border-[#E2E8F0] text-[#64748B] hover:text-[#0B2E59] hover:bg-[#F8FAFC] rounded-lg transition-colors">
            <Filter className="w-4 h-4" />
          </button>
          <button className="p-2 border border-[#E2E8F0] text-[#64748B] hover:text-[#0B2E59] hover:bg-[#F8FAFC] rounded-lg transition-colors">
            <Share2 className="w-4 h-4" />
          </button>
          <button className="flex items-center gap-2 px-4 py-2 bg-[#0B2E59] text-white text-sm font-semibold rounded-lg shadow-sm hover:bg-[#082244] transition-colors">
            <Download className="w-4 h-4" /> Export Report
          </button>
        </div>
      </motion.div>

      {/* 2. ROOT CAUSE SELECTOR OVERVIEW */}
      <motion.div variants={itemVariants}>
        <h2 className="text-sm font-bold text-[#64748B] uppercase tracking-wider mb-3">Detected Systemic Failures</h2>
        <div className="flex gap-4 overflow-x-auto pb-4 hide-scrollbar">
          {rootCauses.map((cause) => (
            <div 
              key={cause.id}
              onClick={() => setActiveCause(cause)}
              className={`min-w-[320px] p-4 rounded-xl border cursor-pointer transition-all ${
                activeCause.id === cause.id 
                  ? 'bg-[#0B2E59] border-[#0B2E59] shadow-lg text-white' 
                  : 'bg-white border-[#E2E8F0] hover:border-[#0B2E59]/30 text-[#1E293B]'
              }`}
            >
              <div className="flex justify-between items-start mb-2">
                <span className={`text-[10px] font-bold px-2 py-0.5 rounded uppercase tracking-wider ${
                  activeCause.id === cause.id ? 'bg-white/20 text-white' : 'bg-red-100 text-red-700'
                }`}>
                  {cause.severity} Priority
                </span>
                <span className={`text-xs font-bold flex items-center gap-1 ${
                  activeCause.id === cause.id ? 'text-blue-200' : 'text-[#64748B]'
                }`}>
                  <BrainCircuit className="w-3.5 h-3.5" /> {cause.confidence}% Match
                </span>
              </div>
              <h3 className={`font-['Poppins'] font-bold text-sm mb-3 line-clamp-2 ${activeCause.id === cause.id ? 'text-white' : 'text-[#1E293B]'}`}>
                {cause.name}
              </h3>
              <div className={`flex justify-between items-center text-xs font-medium border-t pt-3 ${
                activeCause.id === cause.id ? 'border-white/20 text-white/80' : 'border-[#E2E8F0] text-[#64748B]'
              }`}>
                <span>Vol: {cause.total}</span>
                <span>Recurring: {cause.recurring}</span>
              </div>
            </div>
          ))}
        </div>
      </motion.div>

      <div className="grid lg:grid-cols-3 xl:grid-cols-4 gap-6">
        
        {/* MAIN INVESTIGATION COLUMN */}
        <div className="lg:col-span-2 xl:col-span-3 space-y-6">
          
          {/* 3. EXPLAINABLE AI (XAI) PANEL */}
          <motion.div variants={itemVariants} className="bg-gradient-to-br from-white to-[#F8FAFC] rounded-xl border border-[#0B2E59]/20 shadow-sm overflow-hidden">
            <div className="bg-[#0B2E59]/5 border-b border-[#0B2E59]/10 p-4 flex items-center gap-3">
              <div className="bg-[#0B2E59] p-2 rounded-lg"><BrainCircuit className="w-5 h-5 text-white" /></div>
              <div>
                <h2 className="font-['Poppins'] font-bold text-[#1E293B]">AI Reasoning & Explanation</h2>
                <p className="text-xs text-[#64748B] font-medium">How the Manthan Engine identified this root cause</p>
              </div>
            </div>
            <div className="p-6">
              <p className="text-[#1E293B] font-medium leading-relaxed mb-6">
                The AI detected a sudden <strong>340% anomaly spike</strong> in agricultural complaints. By utilizing semantic similarity search, the engine bypassed standard keyword filters and clustered grievances containing varied phrases like <span className="bg-orange-100 text-orange-800 px-1 rounded">"money not credited"</span> and <span className="bg-orange-100 text-orange-800 px-1 rounded">"bank rejected"</span>. 
              </p>
              
              <div className="grid md:grid-cols-3 gap-4 mb-6">
                <div className="bg-white p-4 rounded-lg border border-[#E2E8F0]">
                  <div className="text-xs font-bold text-[#64748B] uppercase mb-1">Trigger Event</div>
                  <div className="font-semibold text-[#1E293B] text-sm">Release of 14th Installment</div>
                </div>
                <div className="bg-white p-4 rounded-lg border border-[#E2E8F0]">
                  <div className="text-xs font-bold text-[#64748B] uppercase mb-1">Core Failure Point</div>
                  <div className="font-semibold text-red-600 text-sm">NPCI-Aadhaar De-linking</div>
                </div>
                <div className="bg-white p-4 rounded-lg border border-[#E2E8F0]">
                  <div className="text-xs font-bold text-[#64748B] uppercase mb-1">Pattern Discovered</div>
                  <div className="font-semibold text-[#1E293B] text-sm">Citizens redirected in a loop</div>
                </div>
              </div>

              <div className="flex items-center gap-2 text-sm text-[#1E8E3E] font-bold bg-green-50 px-4 py-3 rounded-lg border border-green-100">
                <CheckCircle2 className="w-5 h-5" />
                Conclusion: This is a systemic infrastructural communication failure, not individual banking errors.
              </div>
            </div>
          </motion.div>

          {/* 4. COMPLAINT EVOLUTION CHARTS */}
          <motion.div variants={itemVariants} className="bg-white rounded-xl border border-[#E2E8F0] shadow-sm p-6">
            <div className="flex justify-between items-center mb-6">
              <div>
                <h3 className="font-['Poppins'] font-bold text-[#1E293B] text-lg">Evolution of the Issue</h3>
                <p className="text-xs text-[#64748B]">Tracking the systemic spread over 6 weeks</p>
              </div>
            </div>
            <div className="h-[280px] w-full">
              <ResponsiveContainer width="100%" height="100%">
                <AreaChart data={evolutionData} margin={{ top: 10, right: 10, left: 0, bottom: 0 }}>
                  <defs>
                    <linearGradient id="colorTotal" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%" stopColor="#ef4444" stopOpacity={0.3}/>
                      <stop offset="95%" stopColor="#ef4444" stopOpacity={0}/>
                    </linearGradient>
                    <linearGradient id="colorMapped" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%" stopColor="#0B2E59" stopOpacity={0.3}/>
                      <stop offset="95%" stopColor="#0B2E59" stopOpacity={0}/>
                    </linearGradient>
                  </defs>
                  <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#E2E8F0" />
                  <XAxis dataKey="week" axisLine={false} tickLine={false} tick={{ fill: '#64748B', fontSize: 12 }} dy={10} />
                  <YAxis axisLine={false} tickLine={false} tick={{ fill: '#64748B', fontSize: 12 }} />
                  <RechartsTooltip contentStyle={{ borderRadius: '8px', border: 'none', boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1)' }} />
                  <Area type="monotone" dataKey="complaints" name="Total Relevant Complaints" stroke="#ef4444" strokeWidth={3} fillOpacity={1} fill="url(#colorTotal)" />
                  <Area type="monotone" dataKey="mapped" name="Confirmed NPCI Errors" stroke="#0B2E59" strokeWidth={3} fillOpacity={1} fill="url(#colorMapped)" />
                </AreaChart>
              </ResponsiveContainer>
            </div>
          </motion.div>

          {/* 5. IMPACT ASSESSMENT */}
          <motion.div variants={itemVariants} className="grid md:grid-cols-2 gap-6">
            
            {/* Citizen Impact */}
            <div className="bg-white rounded-xl border border-[#E2E8F0] shadow-sm p-6">
              <div className="flex items-center gap-2 mb-6 border-b border-[#E2E8F0] pb-3">
                <Users className="w-5 h-5 text-[#F57C00]" />
                <h3 className="font-['Poppins'] font-bold text-[#1E293B]">Citizen Impact</h3>
              </div>
              <div className="space-y-5">
                <div>
                  <div className="flex justify-between text-xs font-bold text-[#64748B] uppercase mb-1">
                    <span>Estimated Affected Citizens</span>
                    <span className="text-[#1E293B]">~24,500</span>
                  </div>
                  <div className="h-2 bg-[#F8FAFC] rounded-full border border-[#E2E8F0]"><div className="h-full bg-[#F57C00] rounded-full w-[85%]"></div></div>
                </div>
                <div>
                  <div className="flex justify-between text-xs font-bold text-[#64748B] uppercase mb-1">
                    <span>Average Resolution Delay</span>
                    <span className="text-[#1E293B]">42 Days</span>
                  </div>
                  <div className="h-2 bg-[#F8FAFC] rounded-full border border-[#E2E8F0]"><div className="h-full bg-red-500 rounded-full w-[90%]"></div></div>
                </div>
                <div className="bg-orange-50 p-3 rounded-lg border border-orange-100 mt-2">
                  <span className="text-xs font-semibold text-orange-800">
                    High distress indicator: Multiple citizens report visiting administrative offices over 3 times without resolution.
                  </span>
                </div>
              </div>
            </div>

            {/* Government Impact */}
            <div className="bg-white rounded-xl border border-[#E2E8F0] shadow-sm p-6">
              <div className="flex items-center gap-2 mb-6 border-b border-[#E2E8F0] pb-3">
                <Landmark className="w-5 h-5 text-[#0B2E59]" />
                <h3 className="font-['Poppins'] font-bold text-[#1E293B]">Government Impact</h3>
              </div>
              <div className="space-y-5">
                <div>
                  <div className="flex justify-between text-xs font-bold text-[#64748B] uppercase mb-1">
                    <span>Operational Burden (Man-hours)</span>
                    <span className="text-[#1E293B]">Critical</span>
                  </div>
                  <div className="h-2 bg-[#F8FAFC] rounded-full border border-[#E2E8F0]"><div className="h-full bg-[#0B2E59] rounded-full w-[78%]"></div></div>
                </div>
                <div>
                  <div className="flex justify-between text-xs font-bold text-[#64748B] uppercase mb-1">
                    <span>Cross-Dept Coordination</span>
                    <span className="text-[#1E293B]">Failing</span>
                  </div>
                  <div className="h-2 bg-[#F8FAFC] rounded-full border border-[#E2E8F0]"><div className="h-full bg-red-500 rounded-full w-[88%]"></div></div>
                </div>
                <div className="bg-blue-50 p-3 rounded-lg border border-blue-100 mt-2">
                  <span className="text-xs font-semibold text-blue-800">
                    Resource drain: Nodal officers are individually replying to systemic mapping errors they cannot manually fix.
                  </span>
                </div>
              </div>
            </div>

          </motion.div>

          {/* 6. AI RECOMMENDATIONS & POLICY SUMMARY */}
          <motion.div variants={itemVariants}>
            <h3 className="font-['Poppins'] font-bold text-[#1E293B] text-xl mb-4 flex items-center gap-2">
              <Lightbulb className="w-6 h-6 text-[#1E8E3E]" /> Strategic Policy Actions
            </h3>
            
            <div className="space-y-4">
              {/* Primary Recommendation */}
              <div className="bg-white border-2 border-[#1E8E3E]/20 rounded-xl p-6 shadow-sm relative overflow-hidden">
                <div className="absolute top-0 right-0 bg-[#1E8E3E] text-white text-[10px] font-bold uppercase tracking-wider px-3 py-1 rounded-bl-lg">
                  Top Recommendation
                </div>
                <h4 className="font-bold text-[#1E293B] text-lg mb-2">Automated Data Sync between PM-KISAN Portal and NPCI</h4>
                <p className="text-sm text-[#64748B] mb-5 max-w-3xl leading-relaxed">
                  Bypass the manual citizen verification loop. Institute an API-level daily reconciliation between the agricultural disbursement database and the NPCI mapper to automatically identify and flag disconnected accounts directly to the citizen's local bank branch.
                </p>
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                  <div className="bg-[#F8FAFC] p-3 rounded-lg border border-[#E2E8F0]">
                    <div className="text-[10px] font-bold text-[#64748B] uppercase mb-1">Expected Benefit</div>
                    <div className="font-semibold text-[#1E8E3E] text-sm">85% Grievance Drop</div>
                  </div>
                  <div className="bg-[#F8FAFC] p-3 rounded-lg border border-[#E2E8F0]">
                    <div className="text-[10px] font-bold text-[#64748B] uppercase mb-1">Implementation Effort</div>
                    <div className="font-semibold text-[#F57C00] text-sm">Medium (IT Teams)</div>
                  </div>
                  <div className="bg-[#F8FAFC] p-3 rounded-lg border border-[#E2E8F0]">
                    <div className="text-[10px] font-bold text-[#64748B] uppercase mb-1">Responsible</div>
                    <div className="font-semibold text-[#1E293B] text-sm">NIC & Dept of Agri</div>
                  </div>
                  <div className="bg-[#F8FAFC] p-3 rounded-lg border border-[#E2E8F0] flex items-center justify-center">
                    <button className="text-sm font-bold text-[#0B2E59] hover:underline flex items-center gap-1">
                      Draft Order <ChevronRight className="w-4 h-4"/>
                    </button>
                  </div>
                </div>
              </div>
            </div>
          </motion.div>

        </div>

        {/* RIGHT SIDEBAR: CONTEXT & EVIDENCE */}
        <div className="space-y-6">
          
          {/* Executive Summary Document */}
          <motion.div variants={itemVariants} className="bg-[#FFFAEB] border border-[#FDE68A] rounded-xl p-5 shadow-sm">
            <div className="flex items-center gap-2 mb-4 border-b border-[#FDE68A] pb-3">
              <FileText className="w-5 h-5 text-[#D97706]" />
              <h3 className="font-['Poppins'] font-bold text-[#92400E]">Executive Brief</h3>
            </div>
            <div className="space-y-3 text-sm">
              <div>
                <strong className="text-[#92400E] block mb-0.5">Problem:</strong>
                <span className="text-[#B45309]">Mass failure of 14th installment crediting despite active accounts.</span>
              </div>
              <div>
                <strong className="text-[#92400E] block mb-0.5">AI Finding:</strong>
                <span className="text-[#B45309]">Structural communication gap between Bank systems and NPCI mapper.</span>
              </div>
              <div>
                <strong className="text-[#92400E] block mb-0.5">Priority Action:</strong>
                <span className="text-[#B45309]">Initiate joint technical audit with NIC and State Lead Bank Managers.</span>
              </div>
            </div>
            <button className="w-full mt-5 py-2 bg-white border border-[#FDE68A] text-[#92400E] text-sm font-bold rounded-lg shadow-sm hover:bg-[#FEF3C7] transition-colors">
              Export 1-Page PDF
            </button>
          </motion.div>

          {/* AI Evidence & Keywords */}
          <motion.div variants={itemVariants} className="bg-white rounded-xl border border-[#E2E8F0] shadow-sm p-5">
            <h3 className="font-['Poppins'] font-bold text-[#1E293B] mb-4 text-sm flex items-center gap-2">
              <FileSearch className="w-4 h-4 text-[#0B2E59]" /> Core Evidence Vectors
            </h3>
            
            <div className="mb-6">
              <div className="text-xs font-bold text-[#64748B] uppercase mb-3">Semantic Keywords</div>
              <div className="flex flex-wrap gap-2">
                {evidenceKeywords.map((kw, i) => (
                  <span key={i} className="text-xs font-semibold bg-[#F8FAFC] border border-[#E2E8F0] text-[#1E293B] px-2.5 py-1 rounded-full">
                    {kw.word} <span className="text-[#64748B] font-normal opacity-70 ml-1">({kw.weight}%)</span>
                  </span>
                ))}
              </div>
            </div>

            <div>
              <div className="text-xs font-bold text-[#64748B] uppercase mb-3">Anonymous Sample Cluster</div>
              <div className="space-y-3">
                {sampleComplaints.map((sample, i) => (
                  <div key={i} className="bg-[#F8FAFC] p-3 rounded-lg border border-[#E2E8F0] text-xs">
                    <div className="flex justify-between items-center mb-1.5">
                      <span className="font-bold text-[#0B2E59]">{sample.id}</span>
                      <span className="font-semibold text-[#1E8E3E] bg-green-50 px-1.5 rounded">{sample.score}</span>
                    </div>
                    <p className="text-[#64748B] leading-relaxed line-clamp-3 italic">"{sample.text}"</p>
                  </div>
                ))}
              </div>
            </div>
          </motion.div>

          {/* Investigation Context */}
          <motion.div variants={itemVariants} className="bg-white rounded-xl border border-[#E2E8F0] shadow-sm p-5">
            <h3 className="font-['Poppins'] font-bold text-[#1E293B] mb-4 text-sm">System Context</h3>
            <div className="space-y-3 text-xs font-medium text-[#64748B]">
              <div className="flex justify-between">
                <span>Dataset</span>
                <span className="text-[#1E293B] font-semibold">Q2_CPGRAMS_Agri</span>
              </div>
              <div className="flex justify-between">
                <span>Last Scan</span>
                <span className="text-[#1E293B] font-semibold">{LAST_ANALYSIS}</span>
              </div>
              <div className="flex justify-between">
                <span>Engine Version</span>
                <span className="text-[#1E293B] font-semibold">Manthan LLM v2.4</span>
              </div>
            </div>
          </motion.div>

        </div>
      </div>

      {/* 7. QUICK ACTIONS FLOOR */}
      <motion.div variants={itemVariants} className="pt-4 border-t border-[#E2E8F0]">
        <h3 className="font-['Poppins'] font-bold text-[#1E293B] text-lg mb-4">Investigation Next Steps</h3>
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4">
          {[
            { icon: FileText, title: "Policy Brief", color: "text-[#0B2E59]", bg: "bg-blue-50 hover:bg-[#0B2E59] hover:text-white" },
            { icon: Map, title: "View Heatmap", color: "text-[#F57C00]", bg: "bg-orange-50 hover:bg-[#F57C00] hover:text-white" },
            { icon: Activity, title: "Full Analytics", color: "text-[#1E8E3E]", bg: "bg-green-50 hover:bg-[#1E8E3E] hover:text-white" },
            { icon: Download, title: "Export Full Data", color: "text-purple-600", bg: "bg-purple-50 hover:bg-purple-600 hover:text-white" },
            { icon: BrainCircuit, title: "Run New Scan", color: "text-[#64748B]", bg: "bg-slate-100 hover:bg-slate-700 hover:text-white" },
            { icon: Database, title: "Reports Vault", color: "text-[#1E293B]", bg: "bg-slate-100 hover:bg-[#1E293B] hover:text-white" }
          ].map((action, idx) => (
            <div key={idx} className={`p-4 rounded-xl border border-[#E2E8F0] cursor-pointer group transition-all duration-300 flex flex-col items-center justify-center text-center ${action.bg}`}>
              <action.icon className={`w-5 h-5 mb-2 group-hover:text-white transition-colors ${action.color}`} />
              <h4 className="font-bold text-xs group-hover:text-white transition-colors text-[#1E293B]">{action.title}</h4>
            </div>
          ))}
        </div>
      </motion.div>

    </motion.div>
  );
};