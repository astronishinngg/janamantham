import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { 
  ChevronRight, Printer, Download, Share2, FileText, CheckCircle2, 
  AlertTriangle, BrainCircuit, Users, Landmark, ShieldCheck, Check
} from 'lucide-react';
import { 
  AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip as RechartsTooltip, 
  ResponsiveContainer
} from 'recharts';

// ============================================================================
// MOCK DATA: POLICY BRIEF & OFFICIAL REPORT
// ============================================================================

const REPORT_META = {
  id: "PB-2026-08-041A",
  date: "August 3, 2026, 10:00 AM IST",
  aiVersion: "Manthan Engine v2.4 (LLM-XAI)",
  generatedBy: "System Automated",
  confidence: 96,
  status: "Pending Review"
};

const EXEC_SUMMARY = {
  title: "Resolution of PM-KISAN NPCI-Aadhaar Mapping Failures",
  overview: "AI analysis has identified a severe systemic failure causing the rejection of PM-KISAN 14th installment disbursements despite active citizen accounts. The core issue lies in asynchronous data states between local bank branches and the central NPCI mapper, causing an infinite redirection loop for citizens.",
  rootCause: "Data synchronization failure between Bank core banking systems (CBS) and NPCI Aadhaar mapper.",
  priority: "Critical (P1)",
};

const PROBLEM_STATS = {
  complaints: "18,450",
  recurring: "92%",
  severity: "High",
  riskLevel: "Critical"
};

const trendData = [
  { week: 'W1', volume: 450 }, { week: 'W2', volume: 800 }, { week: 'W3', volume: 1600 },
  { week: 'W4', volume: 4200 }, { week: 'W5', volume: 8900 }, { week: 'W6', volume: 18450 }
];

const roadmapPhases = [
  {
    phase: "Phase 1: Immediate Action (0-15 Days)",
    tasks: ["Halt automated rejection messages to citizens.", "Initiate API bridge audit between NIC and NPCI.", "Deploy Lead District Managers (LDMs) for manual camp overrides."],
    dept: "NIC & Dept of Agriculture",
    metrics: "Stop false grievance generation."
  },
  {
    phase: "Phase 2: Short-Term Reform (15-45 Days)",
    tasks: ["Deploy automated daily reconciliation script.", "Update PM-KISAN portal UI to show exact NPCI status.", "Train CSC (Common Service Center) operators on exact resolution steps."],
    dept: "Ministry of Finance & DBT Mission",
    metrics: "Resolve 60% of pending backlog."
  },
  {
    phase: "Phase 3: Long-Term Policy (45-90 Days)",
    tasks: ["Mandate 24-hour SLA for banks to update NPCI mapper.", "Integrate real-time Aadhaar validation during scheme registration."],
    dept: "Reserve Bank of India & NPCI",
    metrics: "Reduce structural recurrence to < 2%."
  }
];

const successMetrics = [
  { label: 'Expected Complaint Drop', value: '85%', trend: 'Positive' },
  { label: 'Est. Resolution Time', value: '48 Hrs', trend: 'Improved' },
  { label: 'Citizen Satisfaction', value: '+42%', trend: 'Positive' },
  { label: 'Man-hours Saved', value: '12,000/mo', trend: 'Positive' },
];

// ============================================================================
// ANIMATION VARIANTS
// ============================================================================

const containerVariants = { hidden: { opacity: 0 }, visible: { opacity: 1, transition: { staggerChildren: 0.1 } } };
const itemVariants = { hidden: { opacity: 0, y: 15 }, visible: { opacity: 1, y: 0, transition: { duration: 0.4 } } };

// ============================================================================
// MAIN COMPONENT
// ============================================================================

export const PolicyBriefs: React.FC = () => {
  const [reviewStatus, setReviewStatus] = useState<string>('pending');
  const [comments, setComments] = useState('');

  const handlePrint = () => {
    window.print();
  };

  return (
    <motion.div variants={containerVariants} initial="hidden" animate="visible" className="min-h-screen pb-10 font-['Inter'] w-full">
      
      {/* 1. GLOBAL HEADER (Hidden on Print) */}
      <motion.div variants={itemVariants} className="flex flex-col lg:flex-row lg:items-center justify-between gap-4 bg-white p-5 rounded-xl border border-[#E2E8F0] shadow-sm mb-6 print:hidden">
        <div>
          <div className="flex items-center gap-2 text-sm text-[#64748B] mb-1 font-medium">
            <span className="hover:text-[#0B2E59] cursor-pointer">Dashboard</span>
            <ChevronRight className="w-4 h-4" />
            <span className="text-[#0B2E59] font-semibold">Policy Briefs</span>
          </div>
          <h1 className="text-2xl font-['Poppins'] font-bold text-[#1E293B] flex items-center gap-2">
            <FileText className="w-6 h-6 text-[#1E8E3E]" /> Official Policy Report
          </h1>
        </div>
        
        <div className="flex flex-wrap items-center gap-3">
          <span className="text-xs font-bold text-[#64748B] bg-[#F8FAFC] px-3 py-2 rounded-lg border border-[#E2E8F0] hidden md:flex items-center gap-2">
            ID: {REPORT_META.id}
          </span>
          <button className="p-2 border border-[#E2E8F0] text-[#64748B] hover:text-[#0B2E59] hover:bg-[#F8FAFC] rounded-lg transition-colors">
            <Share2 className="w-4 h-4" />
          </button>
          <button 
            onClick={handlePrint}
            className="flex items-center gap-2 px-4 py-2 bg-white border border-[#E2E8F0] text-[#1E293B] text-sm font-semibold rounded-lg shadow-sm hover:bg-[#F8FAFC] transition-colors"
          >
            <Printer className="w-4 h-4" /> Print Brief
          </button>
          <button className="flex items-center gap-2 px-4 py-2 bg-[#0B2E59] text-white text-sm font-semibold rounded-lg shadow-sm hover:bg-[#082244] transition-colors">
            <Download className="w-4 h-4" /> Download PDF
          </button>
        </div>
      </motion.div>

      <div className="flex flex-col lg:flex-row gap-8">
        
        {/* ==================== MAIN DOCUMENT (Printable Area) ==================== */}
        <div className="flex-1 lg:max-w-5xl mx-auto bg-white border border-[#E2E8F0] shadow-md rounded-xl p-8 md:p-12 print:border-none print:shadow-none print:p-0 print:m-0 print:w-full min-w-0">
          
          {/* Document Header (Official Look) */}
          <div className="border-b-4 border-[#0B2E59] pb-6 mb-8 flex justify-between items-end">
            <div>
              <div className="text-[#F57C00] font-bold text-sm tracking-wider uppercase mb-1">JanaManthan Decision Intelligence</div>
              <h1 className="text-3xl md:text-4xl font-['Poppins'] font-bold text-[#1E293B]">Policy & Action Brief</h1>
              <p className="text-[#64748B] mt-2 font-medium">Generated from AI Root Cause Investigation</p>
            </div>
            <div className="text-right hidden sm:block">
              <div className="text-sm font-bold text-[#1E293B]">{REPORT_META.id}</div>
              <div className="text-xs text-[#64748B]">{REPORT_META.date}</div>
              <div className="text-xs font-semibold text-[#1E8E3E] mt-1 flex items-center justify-end gap-1">
                <ShieldCheck className="w-4 h-4" /> Verified by {REPORT_META.aiVersion}
              </div>
            </div>
          </div>

          {/* SECTION 1: EXECUTIVE SUMMARY */}
          <motion.section variants={itemVariants} className="mb-10 break-inside-avoid">
            <h2 className="text-xl font-['Poppins'] font-bold text-[#0B2E59] mb-4 uppercase tracking-wide border-b border-[#E2E8F0] pb-2">1. Executive Summary</h2>
            <div className="bg-[#F8FAFC] p-6 rounded-lg border border-[#E2E8F0]">
              <h3 className="font-bold text-lg text-[#1E293B] mb-2">{EXEC_SUMMARY.title}</h3>
              <p className="text-[#1E293B] leading-relaxed mb-4">{EXEC_SUMMARY.overview}</p>
              
              <div className="grid sm:grid-cols-2 gap-4 mt-6">
                <div>
                  <div className="text-xs font-bold text-[#64748B] uppercase mb-1">Primary Root Cause</div>
                  <div className="font-semibold text-red-700">{EXEC_SUMMARY.rootCause}</div>
                </div>
                <div>
                  <div className="text-xs font-bold text-[#64748B] uppercase mb-1">System Priority / AI Confidence</div>
                  <div className="font-semibold text-[#1E293B] flex items-center gap-2">
                    <span className="bg-red-100 text-red-700 px-2 py-0.5 rounded text-sm">{EXEC_SUMMARY.priority}</span>
                    <span className="bg-blue-100 text-[#0B2E59] px-2 py-0.5 rounded text-sm">{REPORT_META.confidence}% Match</span>
                  </div>
                </div>
              </div>
            </div>
          </motion.section>

          {/* SECTION 2 & 3: PROBLEM & EVIDENCE */}
          <div className="grid md:grid-cols-2 gap-8 mb-10 break-inside-avoid">
            <motion.section variants={itemVariants}>
              <h2 className="text-xl font-['Poppins'] font-bold text-[#0B2E59] mb-4 uppercase tracking-wide border-b border-[#E2E8F0] pb-2">2. Problem Scope</h2>
              <div className="space-y-4">
                <p className="text-sm text-[#1E293B] leading-relaxed">
                  Citizens report non-receipt of scheme funds. Field validation reveals funds are returned by destination banks with error <code className="bg-slate-100 text-red-600 px-1 rounded">52: AADHAAR_NOT_MAPPED_TO_NPCI</code> despite citizens completing e-KYC.
                </p>
                <div className="grid grid-cols-2 gap-3">
                  <div className="border border-[#E2E8F0] p-3 rounded-lg">
                    <div className="text-xs text-[#64748B] font-bold">Affected Volume</div>
                    <div className="text-lg font-bold text-[#1E293B]">{PROBLEM_STATS.complaints}</div>
                  </div>
                  <div className="border border-[#E2E8F0] p-3 rounded-lg">
                    <div className="text-xs text-[#64748B] font-bold">Systemic Recurrence</div>
                    <div className="text-lg font-bold text-[#F57C00]">{PROBLEM_STATS.recurring}</div>
                  </div>
                </div>
                <div className="text-sm font-semibold text-[#1E293B]">
                  <span className="text-[#64748B]">Affected States:</span> Maharashtra, Uttar Pradesh, Bihar
                </div>
                <div className="text-sm font-semibold text-[#1E293B]">
                  <span className="text-[#64748B]">Departments:</span> Agriculture, DBT Mission, Banks
                </div>
              </div>
            </motion.section>

            <motion.section variants={itemVariants}>
              <h2 className="text-xl font-['Poppins'] font-bold text-[#0B2E59] mb-4 uppercase tracking-wide border-b border-[#E2E8F0] pb-2">3. Key Evidence</h2>
              <div className="space-y-4">
                <div className="h-32 w-full bg-[#F8FAFC] border border-[#E2E8F0] rounded-lg p-2 min-w-0">
                  <ResponsiveContainer width="100%" height="100%">
                    <AreaChart data={trendData}>
                      <defs>
                        <linearGradient id="colorV" x1="0" y1="0" x2="0" y2="1">
                          <stop offset="5%" stopColor="#ef4444" stopOpacity={0.3}/>
                          <stop offset="95%" stopColor="#ef4444" stopOpacity={0}/>
                        </linearGradient>
                      </defs>
                      <RechartsTooltip contentStyle={{ fontSize: '12px' }} />
                      <Area type="monotone" dataKey="volume" stroke="#ef4444" strokeWidth={2} fill="url(#colorV)" />
                    </AreaChart>
                  </ResponsiveContainer>
                </div>
                <div className="bg-orange-50 border border-orange-100 p-3 rounded-lg text-sm text-orange-900 italic">
                  "AI detected identical semantic clusters bypassing standard keyword filters. 94% of cases involve rural branches failing to upload mandate files to NPCI post-KYC."
                </div>
              </div>
            </motion.section>
          </div>

          {/* SECTION 4: IMPACT ASSESSMENT */}
          <motion.section variants={itemVariants} className="mb-10 break-inside-avoid">
            <h2 className="text-xl font-['Poppins'] font-bold text-[#0B2E59] mb-4 uppercase tracking-wide border-b border-[#E2E8F0] pb-2">4. Impact Assessment</h2>
            <div className="grid md:grid-cols-2 gap-6">
              <div className="border border-[#E2E8F0] rounded-xl p-5">
                <h3 className="font-bold text-[#1E293B] flex items-center gap-2 mb-4"><Users className="w-5 h-5 text-[#F57C00]"/> Citizen Impact</h3>
                <ul className="space-y-3 text-sm">
                  <li className="flex justify-between border-b border-dashed border-[#E2E8F0] pb-1">
                    <span className="text-[#64748B]">Affected Citizens</span><span className="font-bold text-[#1E293B]">~24,500 Farmers</span>
                  </li>
                  <li className="flex justify-between border-b border-dashed border-[#E2E8F0] pb-1">
                    <span className="text-[#64748B]">Avg Service Delay</span><span className="font-bold text-red-600">42 Days</span>
                  </li>
                  <li className="flex justify-between border-b border-dashed border-[#E2E8F0] pb-1">
                    <span className="text-[#64748B]">Est. Financial Lock</span><span className="font-bold text-[#1E293B]">₹4.9 Crores</span>
                  </li>
                  <li className="flex justify-between">
                    <span className="text-[#64748B]">Citizen Satisfaction</span><span className="font-bold text-red-600">Critically Low</span>
                  </li>
                </ul>
              </div>
              <div className="border border-[#E2E8F0] rounded-xl p-5">
                <h3 className="font-bold text-[#1E293B] flex items-center gap-2 mb-4"><Landmark className="w-5 h-5 text-[#0B2E59]"/> Government Impact</h3>
                <ul className="space-y-3 text-sm">
                  <li className="flex justify-between border-b border-dashed border-[#E2E8F0] pb-1">
                    <span className="text-[#64748B]">Operational Burden</span><span className="font-bold text-red-600">Severe</span>
                  </li>
                  <li className="flex justify-between border-b border-dashed border-[#E2E8F0] pb-1">
                    <span className="text-[#64748B]">Resolution Failure</span><span className="font-bold text-[#1E293B]">88% Initial Rejection</span>
                  </li>
                  <li className="flex justify-between border-b border-dashed border-[#E2E8F0] pb-1">
                    <span className="text-[#64748B]">Resource Waste</span><span className="font-bold text-[#1E293B]">Repeated manual checks</span>
                  </li>
                  <li className="flex justify-between">
                    <span className="text-[#64748B]">Policy Risk</span><span className="font-bold text-orange-600">High Visibility Failure</span>
                  </li>
                </ul>
              </div>
            </div>
          </motion.section>

          {/* SECTION 5: POLICY RECOMMENDATIONS */}
          <motion.section variants={itemVariants} className="mb-10 break-inside-avoid">
            <h2 className="text-xl font-['Poppins'] font-bold text-[#0B2E59] mb-4 uppercase tracking-wide border-b border-[#E2E8F0] pb-2">5. Policy Recommendations</h2>
            
            <div className="bg-[#1E8E3E]/5 border-2 border-[#1E8E3E]/20 rounded-xl p-6 mb-4 relative overflow-hidden">
              <div className="absolute top-0 right-0 bg-[#1E8E3E] text-white text-[10px] font-bold uppercase px-3 py-1 rounded-bl-lg">Primary Directive</div>
              <h3 className="font-bold text-lg text-[#1E293B] mb-2">Automated Data Sync via API Bridge</h3>
              <p className="text-sm text-[#1E293B] mb-4">Implement a daily API-level reconciliation script between PM-KISAN portal and NPCI. If Aadhaar is unmapped, auto-generate a specialized ticket directly to the Lead District Bank Manager rather than returning a generic error to the citizen.</p>
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-xs">
                <div><div className="text-[#64748B] font-bold uppercase mb-1">Expected Benefit</div><div className="font-bold text-[#1E8E3E]">85% Grievance Drop</div></div>
                <div><div className="text-[#64748B] font-bold uppercase mb-1">Effort / Cost</div><div className="font-bold text-[#1E293B]">Low / In-house</div></div>
                <div><div className="text-[#64748B] font-bold uppercase mb-1">Responsibility</div><div className="font-bold text-[#1E293B]">NIC IT Dept</div></div>
                <div><div className="text-[#64748B] font-bold uppercase mb-1">Timeline</div><div className="font-bold text-[#1E293B]">14 Days</div></div>
              </div>
            </div>
            
            <div className="bg-white border border-[#E2E8F0] rounded-xl p-6">
              <h3 className="font-bold text-[#1E293B] mb-2">Mandatory 24-Hour Bank SLA</h3>
              <p className="text-sm text-[#64748B] mb-4">Issue a circular via DFS (Department of Financial Services) mandating rural bank branches to upload NPCI mandate files within 24 hours of citizen KYC submission.</p>
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-xs">
                <div><div className="text-[#64748B] font-bold uppercase mb-1">Expected Benefit</div><div className="font-bold text-[#1E8E3E]">Prevents Future Blocks</div></div>
                <div><div className="text-[#64748B] font-bold uppercase mb-1">Effort / Cost</div><div className="font-bold text-[#1E293B]">Admin Directive</div></div>
                <div><div className="text-[#64748B] font-bold uppercase mb-1">Responsibility</div><div className="font-bold text-[#1E293B]">DFS / RBI</div></div>
                <div><div className="text-[#64748B] font-bold uppercase mb-1">Timeline</div><div className="font-bold text-[#1E293B]">Immediate</div></div>
              </div>
            </div>
          </motion.section>

          {/* SECTION 6: IMPLEMENTATION ROADMAP */}
          <motion.section variants={itemVariants} className="mb-10 break-inside-avoid">
            <h2 className="text-xl font-['Poppins'] font-bold text-[#0B2E59] mb-4 uppercase tracking-wide border-b border-[#E2E8F0] pb-2">6. Implementation Roadmap</h2>
            <div className="pl-2">
              {roadmapPhases.map((phase, i) => (
                <div key={i} className="relative pl-8 pb-6 last:pb-0 border-l-2 border-[#E2E8F0]">
                  <div className="absolute left-[-9px] top-0 w-4 h-4 rounded-full bg-[#0B2E59] ring-4 ring-white"></div>
                  <h3 className="font-bold text-[#1E293B] mb-2">{phase.phase}</h3>
                  <div className="bg-[#F8FAFC] border border-[#E2E8F0] rounded-lg p-4">
                    <ul className="list-disc list-inside text-sm text-[#1E293B] mb-3 space-y-1">
                      {phase.tasks.map((task, j) => <li key={j}>{task}</li>)}
                    </ul>
                    <div className="flex flex-wrap justify-between text-xs pt-3 border-t border-[#E2E8F0]">
                      <span className="font-semibold text-[#64748B]">Lead: <span className="text-[#0B2E59]">{phase.dept}</span></span>
                      <span className="font-semibold text-[#64748B]">Target: <span className="text-[#1E8E3E]">{phase.metrics}</span></span>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </motion.section>

          {/* SECTION 7: SUCCESS METRICS */}
          <motion.section variants={itemVariants} className="break-inside-avoid mb-10">
            <h2 className="text-xl font-['Poppins'] font-bold text-[#0B2E59] mb-4 uppercase tracking-wide border-b border-[#E2E8F0] pb-2">7. Projected Success Metrics</h2>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              {successMetrics.map((metric, i) => (
                <div key={i} className="bg-white border border-[#E2E8F0] p-4 rounded-lg text-center shadow-sm">
                  <div className="text-xs font-bold text-[#64748B] uppercase mb-1">{metric.label}</div>
                  <div className="text-2xl font-bold text-[#1E8E3E] mb-1">{metric.value}</div>
                  <div className="text-[10px] font-semibold text-[#1E8E3E] bg-green-50 rounded-full px-2 py-0.5 inline-block">{metric.trend}</div>
                </div>
              ))}
            </div>
          </motion.section>
          
          <div className="text-center text-xs text-[#64748B] mt-12 pt-6 border-t border-[#E2E8F0] print:block hidden">
            End of Document - Generated by JanaManthan AI Engine
          </div>

        </div>

        {/* ==================== RIGHT SIDEBAR (Interactive / Hidden on Print) ==================== */}
        <div className="w-full lg:w-80 shrink-0 space-y-6 print:hidden">
          
          {/* Document Status */}
          <div className="bg-white rounded-xl border border-[#E2E8F0] shadow-sm p-5">
            <h3 className="font-['Poppins'] font-bold text-[#1E293B] mb-4 text-sm">Document Metadata</h3>
            <div className="space-y-3 text-sm">
              <div className="flex justify-between border-b border-[#E2E8F0] pb-2">
                <span className="text-[#64748B]">Status</span>
                <span className="font-semibold text-orange-600 bg-orange-50 px-2 py-0.5 rounded">{REPORT_META.status}</span>
              </div>
              <div className="flex justify-between border-b border-[#E2E8F0] pb-2">
                <span className="text-[#64748B]">Confidence</span>
                <span className="font-semibold text-[#1E8E3E]">{REPORT_META.confidence}%</span>
              </div>
              <div className="flex justify-between border-b border-[#E2E8F0] pb-2">
                <span className="text-[#64748B]">Engine</span>
                <span className="font-semibold text-[#1E293B] truncate max-w-[120px]" title={REPORT_META.aiVersion}>{REPORT_META.aiVersion}</span>
              </div>
              <div className="flex justify-between pt-1">
                <span className="text-[#64748B]">Generated</span>
                <span className="font-semibold text-[#1E293B] text-xs mt-0.5">Today</span>
              </div>
            </div>
          </div>

          {/* SECTION 9: OFFICER REVIEW PANEL */}
          <div className="bg-[#F8FAFC] rounded-xl border border-[#E2E8F0] shadow-sm p-5">
            <h3 className="font-['Poppins'] font-bold text-[#1E293B] mb-4 text-sm flex items-center gap-2">
              <CheckCircle2 className="w-4 h-4 text-[#0B2E59]" /> Officer Review
            </h3>
            
            <div className="space-y-4">
              <div>
                <label className="text-xs font-bold text-[#64748B] uppercase block mb-2">Approval Decision</label>
                <div className="space-y-2">
                  <label className={`flex items-center gap-2 p-2 rounded border cursor-pointer transition-colors ${reviewStatus === 'approve' ? 'bg-[#1E8E3E]/10 border-[#1E8E3E] text-[#1E8E3E]' : 'bg-white border-[#E2E8F0] text-[#1E293B]'}`}>
                    <input type="radio" name="status" value="approve" checked={reviewStatus === 'approve'} onChange={(e) => setReviewStatus(e.target.value)} className="hidden" />
                    <Check className="w-4 h-4" /> Approve & Forward Policy
                  </label>
                  <label className={`flex items-center gap-2 p-2 rounded border cursor-pointer transition-colors ${reviewStatus === 'revise' ? 'bg-orange-50 border-orange-400 text-orange-700' : 'bg-white border-[#E2E8F0] text-[#1E293B]'}`}>
                    <input type="radio" name="status" value="revise" checked={reviewStatus === 'revise'} onChange={(e) => setReviewStatus(e.target.value)} className="hidden" />
                    <AlertTriangle className="w-4 h-4" /> Request AI Revision
                  </label>
                </div>
              </div>
              
              <div>
                <label className="text-xs font-bold text-[#64748B] uppercase block mb-2">Officer Notes / Additions</label>
                <textarea 
                  className="w-full border border-[#E2E8F0] rounded-lg p-3 text-sm focus:outline-none focus:border-[#0B2E59] focus:ring-1 focus:ring-[#0B2E59] resize-y"
                  rows={4}
                  placeholder="Add manual notes before forwarding to the joint secretary..."
                  value={comments}
                  onChange={(e) => setComments(e.target.value)}
                ></textarea>
              </div>

              <button className="w-full py-2.5 bg-[#0B2E59] text-white text-sm font-bold rounded-lg shadow-md hover:bg-[#082244] transition-colors">
                Submit Review
              </button>
            </div>
          </div>
        </div>

      </div>
    </motion.div>
  );
};