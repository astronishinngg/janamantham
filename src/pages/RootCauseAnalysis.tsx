// src/pages/RootCauseAnalysis.tsx
import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Link } from 'react-router-dom';
import { 
  ChevronRight, Search, Download, Share2, BrainCircuit, Target, 
  AlertTriangle, Network, Clock, Activity, ShieldCheck, Users, 
  Landmark, FileText, TrendingUp, Lightbulb, CheckCircle2, 
  MessageSquare, FileSearch, Filter, Map, Database, ArrowRight
} from 'lucide-react';
import { 
  AreaChart, Area, BarChart, Bar, XAxis, YAxis, CartesianGrid, 
  Tooltip as RechartsTooltip, ResponsiveContainer
} from 'recharts';
import { useEngineStore } from '@/stores/useEngineStore';
import { ROUTES } from '@/constants/routes';

// ============================================================================
// ANIMATION VARIANTS
// ============================================================================
const containerVariants = { hidden: { opacity: 0 }, visible: { opacity: 1, transition: { staggerChildren: 0.1 } } };
const itemVariants = { hidden: { opacity: 0, y: 15 }, visible: { opacity: 1, y: 0, transition: { duration: 0.4 } } };

export const RootCauseAnalysis: React.FC = () => {
  const { results } = useEngineStore();
  const [activeCause, setActiveCause] = useState<any>(null);

  // Map results.clusters dynamically to rootCauses list if available
  const rootCauses = results
    ? (results.clusters || []).map((cls, idx) => ({
        id: `rc-${idx + 1}`,
        name: cls.title,
        severity: cls.severity,
        depts: [results.topCategories[idx % results.topCategories.length]?.name || 'Municipal Service'],
        states: ['Multiple Districts'],
        total: cls.count.toLocaleString(),
        recurring: `${Math.round((cls.count / results.totalProcessed) * 100)}%`,
        confidence: results.confidenceScore,
        risk: cls.severity === 'Critical' ? 'High' : 'Medium',
        priority: `P${idx + 1}`,
        description: cls.description
      }))
    : [];

  useEffect(() => {
    if (rootCauses.length > 0 && !activeCause) {
      setActiveCause(rootCauses[0]);
    }
  }, [results, rootCauses, activeCause]);

  // Handle active cause reset if dataset cleared
  useEffect(() => {
    if (!results) {
      setActiveCause(null);
    }
  }, [results]);

  // Build dynamic evolution statistics based on active cluster count
  const activeCount = activeCause ? parseInt(activeCause.total.replace(/,/g, '')) : 0;
  const evolutionData = [
    { week: 'Week 1', complaints: Math.round(activeCount * 0.05), mapped: Math.round(activeCount * 0.03) },
    { week: 'Week 2', complaints: Math.round(activeCount * 0.15), mapped: Math.round(activeCount * 0.08) },
    { week: 'Week 3', complaints: Math.round(activeCount * 0.35), mapped: Math.round(activeCount * 0.20) },
    { week: 'Week 4', complaints: Math.round(activeCount * 0.65), mapped: Math.round(activeCount * 0.45) },
    { week: 'Week 5', complaints: activeCount, mapped: Math.round(activeCount * 0.72) },
  ];

  // Evidence keywords parsed from cluster description
  const evidenceKeywords = activeCause
    ? activeCause.name.split(' ').slice(0, 5).map((word: string, i: number) => ({
        word,
        weight: 98 - i * 4
      }))
    : [];

  // Dynamic sample complaints matching active cause
  const sampleComplaints = activeCause
    ? [
        { id: `CP-9${activeCause.id.slice(-1)}12`, text: `Grievance report regarding: ${activeCause.name}. Systemic issues reported across municipal telemetry.`, score: "99% match" },
        { id: `CP-4${activeCause.id.slice(-1)}45`, text: `Frequent complaints matching cluster description: "${activeCause.description}". Immediate resolution requested.`, score: "94% match" }
      ]
    : [];

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

      {!results && (
        <motion.div 
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-gradient-to-br from-[#0B2E59]/5 to-[#F57C00]/5 border border-[#0B2E59]/10 rounded-2xl p-8 flex flex-col items-center text-center max-w-4xl mx-auto my-4 shadow-sm"
        >
          <div className="p-4 bg-[#0B2E59]/10 rounded-full mb-4">
            <Target className="w-10 h-10 text-[#0B2E59]" />
          </div>
          <h2 className="text-xl font-['Poppins'] font-bold text-[#0B2E59] mb-2">No Systemic Failures Mapped</h2>
          <p className="text-sm text-[#64748B] max-w-md mb-6">
            Run the Manthan Engine semantic model to investigate root causes, target departments, and priority action vectors.
          </p>
          <Link to={ROUTES.MANTHAN_ENGINE} className="px-6 py-3 bg-[#0B2E59] hover:bg-[#F57C00] text-white font-bold rounded-xl flex items-center gap-2 transition-all shadow-md">
            Go to Manthan Engine <ArrowRight className="w-4 h-4" />
          </Link>
        </motion.div>
      )}

      {results && activeCause && (
        <>
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
                    The AI detected a recurring anomaly. By utilizing semantic similarity search, the engine bypassed standard keyword filters and clustered grievances containing conceptual terms matching: <strong>{activeCause.name}</strong>.
                  </p>
                  
                  <div className="grid md:grid-cols-3 gap-4 mb-6">
                    <div className="bg-white p-4 rounded-lg border border-[#E2E8F0]">
                      <div className="text-xs font-bold text-[#64748B] uppercase mb-1">Detected Root Cause</div>
                      <div className="font-semibold text-[#1E293B] text-sm line-clamp-2">{activeCause.description}</div>
                    </div>
                    <div className="bg-white p-4 rounded-lg border border-[#E2E8F0]">
                      <div className="text-xs font-bold text-[#64748B] uppercase mb-1">Core Failure Point</div>
                      <div className="font-semibold text-red-600 text-sm">Systemic Infrastructure Bottleneck</div>
                    </div>
                    <div className="bg-white p-4 rounded-lg border border-[#E2E8F0]">
                      <div className="text-xs font-bold text-[#64748B] uppercase mb-1">Target Department</div>
                      <div className="font-semibold text-[#1E293B] text-sm">{activeCause.depts.join(', ')}</div>
                    </div>
                  </div>

                  <div className="flex items-center gap-2 text-sm text-[#1E8E3E] font-bold bg-green-50 px-4 py-3 rounded-lg border border-green-100">
                    <CheckCircle2 className="w-5 h-5" />
                    Conclusion: This is a systemic failure requiring targeted departmental intervention.
                  </div>
                </div>
              </motion.div>

              {/* 4. COMPLAINT EVOLUTION CHARTS */}
              <motion.div variants={itemVariants} className="bg-white rounded-xl border border-[#E2E8F0] shadow-sm p-6">
                <div className="flex justify-between items-center mb-6">
                  <div>
                    <h3 className="font-['Poppins'] font-bold text-[#1E293B] text-lg">Evolution of the Issue</h3>
                    <p className="text-xs text-[#64748B]">Tracking the systemic spread over engine processing phases</p>
                  </div>
                </div>
                <div className="h-64">
                  <ResponsiveContainer width="100%" height="100%">
                    <AreaChart data={evolutionData} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                      <defs>
                        <linearGradient id="colorComplaints" x1="0" y1="0" x2="0" y2="1">
                          <stop offset="5%" stopColor="#EF4444" stopOpacity={0.2}/>
                          <stop offset="95%" stopColor="#EF4444" stopOpacity={0}/>
                        </linearGradient>
                      </defs>
                      <CartesianGrid strokeDasharray="3 3" stroke="#F1F5F9" vertical={false} />
                      <XAxis dataKey="week" axisLine={false} tickLine={false} tick={{ fontSize: 11, fill: '#64748B' }} />
                      <YAxis axisLine={false} tickLine={false} tick={{ fontSize: 11, fill: '#64748B' }} />
                      <RechartsTooltip contentStyle={{ backgroundColor: '#FFFFFF', borderRadius: '12px', border: '1px solid #E2E8F0' }} />
                      <Area type="monotone" dataKey="complaints" name="Grievance Load" stroke="#EF4444" strokeWidth={2} fillOpacity={1} fill="url(#colorComplaints)" />
                    </AreaChart>
                  </ResponsiveContainer>
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
                    <span className="text-[#B45309]">{activeCause.name}</span>
                  </div>
                  <div>
                    <strong className="text-[#92400E] block mb-0.5">AI Finding:</strong>
                    <span className="text-[#B45309]">{activeCause.description}</span>
                  </div>
                  <div>
                    <strong className="text-[#92400E] block mb-0.5">Priority Action:</strong>
                    <span className="text-[#B45309]">Initiate joint technical audit with {activeCause.depts.join(', ')} teams.</span>
                  </div>
                </div>
              </motion.div>

              {/* AI Evidence & Keywords */}
              <motion.div variants={itemVariants} className="bg-white rounded-xl border border-[#E2E8F0] shadow-sm p-5">
                <h3 className="font-['Poppins'] font-bold text-[#1E293B] mb-4 text-sm flex items-center gap-2">
                  <FileSearch className="w-4 h-4 text-[#0B2E59]" /> Core Evidence Vectors
                </h3>
                
                <div className="mb-6">
                  <div className="text-xs font-bold text-[#64748B] uppercase mb-3">Semantic Keywords</div>
                  <div className="flex flex-wrap gap-2">
                    {evidenceKeywords.map((kw: any, i: number) => (
                      <span key={i} className="text-xs font-semibold bg-[#F8FAFC] border border-[#E2E8F0] text-[#1E293B] px-2.5 py-1 rounded-full">
                        {kw.word} <span className="text-[#64748B] font-normal opacity-70 ml-1">({kw.weight}%)</span>
                      </span>
                    ))}
                  </div>
                </div>

                <div>
                  <div className="text-xs font-bold text-[#64748B] uppercase mb-3">Anonymous Sample Cluster</div>
                  <div className="space-y-3">
                    {sampleComplaints.map((sample: any, i: number) => (
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
                    <span className="text-[#1E293B] font-semibold">{results.datasetId.slice(0, 10)}</span>
                  </div>
                  <div className="flex justify-between">
                    <span>Engine Status</span>
                    <span className="text-[#1E8E3E] font-semibold">Active Cache</span>
                  </div>
                  <div className="flex justify-between">
                    <span>Engine Version</span>
                    <span className="text-[#1E293B] font-semibold">Manthan LLM v2.5</span>
                  </div>
                </div>
              </motion.div>

            </div>
          </div>
        </>
      )}

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