import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { 
  ChevronRight, Printer, Download, Share2, FileText, CheckCircle2, 
  AlertTriangle, BrainCircuit, Users, Landmark, ShieldCheck, Check, Loader2
} from 'lucide-react';
import { 
  BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip as RechartsTooltip, 
  ResponsiveContainer
} from 'recharts';
import { policyService } from '@/services/policyService';
import { useEngineStore } from '@/stores/useEngineStore';
import { api } from '@/services/api';

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
  const { activeAnalysisId, activeDataset, results } = useEngineStore();
  const [report, setReport] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  const analysisId = activeAnalysisId || activeDataset?.id || '';

  // Fetch the full report from the backend API
  useEffect(() => {
    const fetchReport = async () => {
      if (!analysisId) {
        setLoading(false);
        return;
      }
      setLoading(true);
      try {
        // First check sessionStorage
        const cached = sessionStorage.getItem(`report_${analysisId}`);
        if (cached) {
          setReport(JSON.parse(cached));
        } else {
          const response = await api.get(`/report/${analysisId}`);
          setReport(response.data);
        }
      } catch (err) {
        console.error('Failed to fetch report:', err);
      } finally {
        setLoading(false);
      }
    };
    fetchReport();
  }, [analysisId]);

  const handlePrint = () => {
    window.print();
  };

  const handleDownloadPdf = () => {
    if (analysisId) {
      policyService.downloadPDF(analysisId);
    }
  };

  // Derive display data from live report
  const execSummary = report?.executive_summary;
  const categoryStats = report?.category_stats || [];
  const clusters = report?.clusters || [];
  const rootCauses = report?.root_causes || [];
  const priorityActions = report?.priority_actions || [];
  const chartsData = report?.charts_data || {};
  const topCategory = categoryStats[0];
  const totalComplaints = report?.total_complaints || results?.totalProcessed || 0;
  const datasetName = report?.dataset_name || activeDataset?.name || 'Unknown Dataset';
  const generatedAt = report?.generated_at || new Date().toLocaleString();

  // Build chart data from category_stats
  const categoryChartData = categoryStats.slice(0, 8).map((cs: any) => ({
    name: cs.category?.length > 12 ? cs.category.substring(0, 12) + '…' : cs.category,
    count: cs.count
  }));

  // Locations from chartsData
  const locationsBreakdown = chartsData.locations_breakdown || {};
  const topLocations = Object.entries(locationsBreakdown)
    .sort((a: any, b: any) => b[1] - a[1])
    .slice(0, 5)
    .map(([loc, count]) => `${loc} (${count})`);

  // Status from chartsData
  const statusBreakdown = chartsData.status_breakdown || {};

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[60vh]">
        <div className="text-center">
          <Loader2 className="w-10 h-10 animate-spin text-[#0B2E59] mx-auto mb-4" />
          <p className="text-[#64748B] font-semibold">Loading Report Data...</p>
        </div>
      </div>
    );
  }

  if (!report && !results) {
    return (
      <div className="flex items-center justify-center min-h-[60vh]">
        <div className="text-center max-w-md">
          <FileText className="w-12 h-12 text-[#64748B] mx-auto mb-4" />
          <h2 className="text-xl font-bold text-[#1E293B] mb-2">No Report Available</h2>
          <p className="text-[#64748B]">Upload a CSV file and run the Manthan Engine analysis first to generate a policy report.</p>
        </div>
      </div>
    );
  }

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
            ID: {analysisId}
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
          <button 
            onClick={handleDownloadPdf}
            className="flex items-center gap-2 px-4 py-2 bg-[#0B2E59] text-white text-sm font-semibold rounded-lg shadow-sm hover:bg-[#082244] transition-colors cursor-pointer"
          >
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
              <div className="text-sm font-bold text-[#1E293B]">{analysisId}</div>
              <div className="text-xs text-[#64748B]">{generatedAt}</div>
              <div className="text-xs font-semibold text-[#1E8E3E] mt-1 flex items-center justify-end gap-1">
                <ShieldCheck className="w-4 h-4" /> Source: {datasetName}
              </div>
            </div>
          </div>

          {/* SECTION 1: EXECUTIVE SUMMARY */}
          {execSummary && (
            <motion.section variants={itemVariants} className="mb-10 break-inside-avoid">
              <h2 className="text-xl font-['Poppins'] font-bold text-[#0B2E59] mb-4 uppercase tracking-wide border-b border-[#E2E8F0] pb-2">1. Executive Summary</h2>
              <div className="bg-[#F8FAFC] p-6 rounded-lg border border-[#E2E8F0]">
                <p className="text-[#1E293B] leading-relaxed mb-4">{execSummary.overview}</p>
                
                {execSummary.key_findings && execSummary.key_findings.length > 0 && (
                  <div className="mt-4">
                    <div className="text-xs font-bold text-[#64748B] uppercase mb-2">Key Findings</div>
                    <ul className="list-disc list-inside text-sm text-[#1E293B] space-y-1">
                      {execSummary.key_findings.map((f: string, i: number) => <li key={i}>{f}</li>)}
                    </ul>
                  </div>
                )}

                <div className="grid sm:grid-cols-2 gap-4 mt-6">
                  {execSummary.critical_risk_areas && execSummary.critical_risk_areas.length > 0 && (
                    <div>
                      <div className="text-xs font-bold text-[#64748B] uppercase mb-1">Critical Risk Areas</div>
                      <ul className="list-disc list-inside text-sm text-red-700 space-y-1">
                        {execSummary.critical_risk_areas.map((r: string, i: number) => <li key={i}>{r}</li>)}
                      </ul>
                    </div>
                  )}
                  <div>
                    <div className="text-xs font-bold text-[#64748B] uppercase mb-1">Total Complaints / AI Confidence</div>
                    <div className="font-semibold text-[#1E293B] flex items-center gap-2">
                      <span className="bg-red-100 text-red-700 px-2 py-0.5 rounded text-sm">{totalComplaints.toLocaleString()} complaints</span>
                      <span className="bg-blue-100 text-[#0B2E59] px-2 py-0.5 rounded text-sm">{results?.confidenceScore || 96}% Match</span>
                    </div>
                  </div>
                </div>

                {execSummary.governance_insights && (
                  <div className="mt-4 bg-orange-50 border border-orange-100 p-3 rounded-lg text-sm text-orange-900 italic">
                    <BrainCircuit className="w-4 h-4 inline mr-1" /> {execSummary.governance_insights}
                  </div>
                )}
              </div>
            </motion.section>
          )}

          {/* SECTION 2: PROBLEM SCOPE & CATEGORY BREAKDOWN */}
          <div className="grid md:grid-cols-2 gap-8 mb-10 break-inside-avoid">
            <motion.section variants={itemVariants}>
              <h2 className="text-xl font-['Poppins'] font-bold text-[#0B2E59] mb-4 uppercase tracking-wide border-b border-[#E2E8F0] pb-2">2. Problem Scope</h2>
              <div className="space-y-4">
                <div className="grid grid-cols-2 gap-3">
                  <div className="border border-[#E2E8F0] p-3 rounded-lg">
                    <div className="text-xs text-[#64748B] font-bold">Total Complaints</div>
                    <div className="text-lg font-bold text-[#1E293B]">{totalComplaints.toLocaleString()}</div>
                  </div>
                  <div className="border border-[#E2E8F0] p-3 rounded-lg">
                    <div className="text-xs text-[#64748B] font-bold">Top Category</div>
                    <div className="text-lg font-bold text-[#F57C00]">{topCategory?.category || 'N/A'}</div>
                  </div>
                  <div className="border border-[#E2E8F0] p-3 rounded-lg">
                    <div className="text-xs text-[#64748B] font-bold">Clusters Detected</div>
                    <div className="text-lg font-bold text-[#0B2E59]">{clusters.length}</div>
                  </div>
                  <div className="border border-[#E2E8F0] p-3 rounded-lg">
                    <div className="text-xs text-[#64748B] font-bold">Root Causes</div>
                    <div className="text-lg font-bold text-red-600">{rootCauses.length}</div>
                  </div>
                </div>
                {topLocations.length > 0 && (
                  <div className="text-sm font-semibold text-[#1E293B]">
                    <span className="text-[#64748B]">Top Locations:</span> {topLocations.join(', ')}
                  </div>
                )}
                <div className="text-sm font-semibold text-[#1E293B]">
                  <span className="text-[#64748B]">Categories:</span> {categoryStats.slice(0, 5).map((c: any) => c.category).join(', ')}
                </div>
              </div>
            </motion.section>

            <motion.section variants={itemVariants}>
              <h2 className="text-xl font-['Poppins'] font-bold text-[#0B2E59] mb-4 uppercase tracking-wide border-b border-[#E2E8F0] pb-2">3. Category Breakdown</h2>
              <div className="space-y-4">
                <div className="h-48 w-full bg-[#F8FAFC] border border-[#E2E8F0] rounded-lg p-2 min-w-0">
                  <ResponsiveContainer width="100%" height="100%">
                    <BarChart data={categoryChartData}>
                      <CartesianGrid strokeDasharray="3 3" stroke="#E2E8F0" />
                      <XAxis dataKey="name" tick={{ fontSize: 9, fill: '#64748B' }} />
                      <YAxis tick={{ fontSize: 10, fill: '#64748B' }} />
                      <RechartsTooltip contentStyle={{ fontSize: '12px', borderRadius: '8px' }} />
                      <Bar dataKey="count" fill="#0B2E59" radius={[4, 4, 0, 0]} />
                    </BarChart>
                  </ResponsiveContainer>
                </div>
              </div>
            </motion.section>
          </div>

          {/* SECTION 4: ROOT CAUSES */}
          {rootCauses.length > 0 && (
            <motion.section variants={itemVariants} className="mb-10 break-inside-avoid">
              <h2 className="text-xl font-['Poppins'] font-bold text-[#0B2E59] mb-4 uppercase tracking-wide border-b border-[#E2E8F0] pb-2">4. Root Causes Identified</h2>
              <div className="space-y-4">
                {rootCauses.map((rc: any, i: number) => (
                  <div key={i} className="border border-[#E2E8F0] rounded-xl p-5">
                    <div className="flex items-start justify-between mb-2">
                      <h3 className="font-bold text-[#1E293B] flex items-center gap-2">
                        <AlertTriangle className={`w-4 h-4 ${rc.severity === 'High' ? 'text-red-500' : 'text-orange-500'}`} />
                        {rc.title}
                      </h3>
                      <span className={`text-xs font-bold px-2 py-0.5 rounded ${rc.severity === 'High' ? 'bg-red-100 text-red-700' : 'bg-orange-100 text-orange-700'}`}>
                        {rc.severity}
                      </span>
                    </div>
                    <p className="text-sm text-[#64748B] mb-2">{rc.description}</p>
                    <div className="flex flex-wrap gap-2">
                      <span className="text-xs bg-blue-50 text-[#0B2E59] font-semibold px-2 py-1 rounded">Category: {rc.category}</span>
                      {(rc.affected_locations || []).map((loc: string, j: number) => (
                        <span key={j} className="text-xs bg-slate-100 text-[#64748B] font-medium px-2 py-1 rounded">{loc}</span>
                      ))}
                    </div>
                  </div>
                ))}
              </div>
            </motion.section>
          )}

          {/* SECTION 5: PRIORITY ACTIONS */}
          {priorityActions.length > 0 && (
            <motion.section variants={itemVariants} className="mb-10 break-inside-avoid">
              <h2 className="text-xl font-['Poppins'] font-bold text-[#0B2E59] mb-4 uppercase tracking-wide border-b border-[#E2E8F0] pb-2">5. Priority Actions & Recommendations</h2>
              <div className="space-y-4">
                {priorityActions.map((pa: any, i: number) => (
                  <div key={i} className={`border rounded-xl p-6 relative overflow-hidden ${i === 0 ? 'bg-[#1E8E3E]/5 border-2 border-[#1E8E3E]/20' : 'border-[#E2E8F0]'}`}>
                    {i === 0 && <div className="absolute top-0 right-0 bg-[#1E8E3E] text-white text-[10px] font-bold uppercase px-3 py-1 rounded-bl-lg">Highest Priority</div>}
                    <h3 className="font-bold text-lg text-[#1E293B] mb-2">P{pa.priority}: {pa.title}</h3>
                    <p className="text-sm text-[#1E293B] mb-4">{pa.recommended_action}</p>
                    <div className="grid grid-cols-2 md:grid-cols-3 gap-4 text-xs">
                      <div><div className="text-[#64748B] font-bold uppercase mb-1">Department</div><div className="font-bold text-[#0B2E59]">{pa.department}</div></div>
                      <div><div className="text-[#64748B] font-bold uppercase mb-1">Expected Impact</div><div className="font-bold text-[#1E8E3E]">{pa.impact}</div></div>
                      <div><div className="text-[#64748B] font-bold uppercase mb-1">Priority Level</div><div className="font-bold text-[#1E293B]">P{pa.priority}</div></div>
                    </div>
                  </div>
                ))}
              </div>
            </motion.section>
          )}

          {/* SECTION 6: COMPLAINT STATUS OVERVIEW */}
          {Object.keys(statusBreakdown).length > 0 && (
            <motion.section variants={itemVariants} className="mb-10 break-inside-avoid">
              <h2 className="text-xl font-['Poppins'] font-bold text-[#0B2E59] mb-4 uppercase tracking-wide border-b border-[#E2E8F0] pb-2">6. Complaint Status Overview</h2>
              <div className="grid grid-cols-2 md:grid-cols-5 gap-4">
                {Object.entries(statusBreakdown).map(([status, count], i) => (
                  <div key={i} className="bg-white border border-[#E2E8F0] p-4 rounded-lg text-center shadow-sm">
                    <div className="text-xs font-bold text-[#64748B] uppercase mb-1">{status}</div>
                    <div className={`text-2xl font-bold ${status === 'Resolved' ? 'text-[#1E8E3E]' : status === 'Pending' ? 'text-[#F57C00]' : status === 'Rejected' ? 'text-red-600' : 'text-[#0B2E59]'}`}>
                      {(count as number).toLocaleString()}
                    </div>
                  </div>
                ))}
              </div>
            </motion.section>
          )}
          
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
                <span className="text-[#64748B]">Upload ID</span>
                <span className="font-semibold text-[#1E293B] text-xs">{analysisId}</span>
              </div>
              <div className="flex justify-between border-b border-[#E2E8F0] pb-2">
                <span className="text-[#64748B]">Dataset</span>
                <span className="font-semibold text-[#1E293B] truncate max-w-[140px]" title={datasetName}>{datasetName}</span>
              </div>
              <div className="flex justify-between border-b border-[#E2E8F0] pb-2">
                <span className="text-[#64748B]">Total Records</span>
                <span className="font-semibold text-[#0B2E59]">{totalComplaints.toLocaleString()}</span>
              </div>
              <div className="flex justify-between border-b border-[#E2E8F0] pb-2">
                <span className="text-[#64748B]">Confidence</span>
                <span className="font-semibold text-[#1E8E3E]">{results?.confidenceScore || 96}%</span>
              </div>
              <div className="flex justify-between pt-1">
                <span className="text-[#64748B]">Generated</span>
                <span className="font-semibold text-[#1E293B] text-xs mt-0.5">{generatedAt}</span>
              </div>
            </div>
          </div>

          {/* SECTION: OFFICER REVIEW PANEL */}
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