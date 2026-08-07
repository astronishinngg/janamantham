import React, { useEffect, useState, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { toast } from 'sonner';
import { 
  BrainCircuit, UploadCloud, FileSpreadsheet, Play, ShieldCheck, Database, 
  Network, TrendingUp, Target, FileText, CheckCircle2, Loader2, Cpu, HardDrive, 
  RefreshCw, Clock, MapIcon, BarChart3, Shield, Activity, ChevronRight, Trash2, ListTree, Users, Building2, Eye
} from 'lucide-react';

import { useEngineStore } from '@/stores/useEngineStore';
import { datasetService, DatasetPreview } from '@/services/datasetService';
import { analysisService } from '@/services/analysisService';
import { policyService } from '@/services/policyService';
import { ROUTES } from '@/constants/routes';

const AI_PIPELINE_STEPS = [
  { id: 1, name: 'Reading Dataset into Memory', icon: FileSpreadsheet, duration: 1500 },
  { id: 2, name: 'Cleaning & Normalizing Data', icon: RefreshCw, duration: 2000 },
  { id: 3, name: 'Redacting PII (Personal Info)', icon: Shield, duration: 1500 },
  { id: 4, name: 'Generating Vector Embeddings', icon: Cpu, duration: 3000 },
  { id: 5, name: 'Searching Semantic Similarities', icon: Network, duration: 2500 },
  { id: 6, name: 'Forming Grievance Clusters', icon: Database, duration: 2000 },
  { id: 7, name: 'Detecting Systemic Trends', icon: TrendingUp, duration: 2000 },
  { id: 8, name: 'Identifying Root Causes', icon: Target, duration: 2500 },
  { id: 9, name: 'Calculating Confidence Scores', icon: Activity, duration: 1000 },
  { id: 10, name: 'Drafting Policy Recommendations', icon: FileText, duration: 2500 },
];

const containerVariants = { hidden: { opacity: 0 }, visible: { opacity: 1, transition: { staggerChildren: 0.1 } } };
const fadeUp = { hidden: { opacity: 0, y: 20 }, visible: { opacity: 1, y: 0, transition: { duration: 0.4 } } };

export const ManthanEngine: React.FC = () => {
  const navigate = useNavigate();
  const fileInputRef = useRef<HTMLInputElement>(null);
  
  const { step, activeDataset, config, results, setActiveDataset, updateConfig, startProcessing, completeProcessing, resetEngine } = useEngineStore();
  
  const [recentDatasets, setRecentDatasets] = useState<Partial<DatasetPreview>[]>([]);
  const [isLoadingRecent, setIsLoadingRecent] = useState(false);
  const [isDragActive, setIsDragActive] = useState(false);

  const [currentStepIndex, setCurrentStepIndex] = useState(0);
  const [progressPct, setProgressPct] = useState(0);
  const [elapsed, setElapsed] = useState(0);

  useEffect(() => {
    if (step === 'IDLE') {
      setIsLoadingRecent(true);
      datasetService.getRecentDatasets().then(data => {
        setRecentDatasets(data);
        setIsLoadingRecent(false);
      });
    }
  }, [step]);

  const handleDragOver = (e: React.DragEvent<HTMLDivElement>) => { e.preventDefault(); setIsDragActive(true); };
  const handleDragLeave = (e: React.DragEvent<HTMLDivElement>) => { e.preventDefault(); setIsDragActive(false); };
  const handleDrop = async (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    setIsDragActive(false);
    if (e.dataTransfer.files && e.dataTransfer.files.length > 0) {
      await processFileUpload(e.dataTransfer.files[0]);
    }
  };
  const handleFileInput = async (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files.length > 0) {
      await processFileUpload(e.target.files[0]);
    }
  };

  const processFileUpload = async (file: File) => {
    const loadingToast = toast.loading("Uploading dataset securely...");
    try {
      const preview = await datasetService.uploadDataset(file);
      setActiveDataset(preview);
      toast.success("Dataset validated successfully", { id: loadingToast });
    } catch (err) {
      toast.error("Upload failed", { id: loadingToast });
    }
  };

  const handleUseDemo = async () => {
    const loadingToast = toast.loading("Loading Government Demo Dataset...");
    const preview = await datasetService.loadDemoDataset();
    setActiveDataset(preview);
    toast.success("Demo Dataset Loaded", { id: loadingToast });
  };

  const handleStartAnalysis = async () => {
    if (!activeDataset) return;
    const loadingToast = toast.loading("Initializing Manthan Engine...");
    try {
      const { analysisId } = await analysisService.startAnalysis(activeDataset.id, config);
      startProcessing(analysisId);
      toast.dismiss(loadingToast);
    } catch (err) {
      toast.error("Failed to start analysis", { id: loadingToast });
    }
  };

  const handleGeneratePolicy = async () => {
    if (!results) return;
    const t = toast.loading("Drafting Official Policy Brief...");
    await policyService.generatePolicyBrief(results.id);
    toast.success("Policy Brief Generated", { id: t });
    navigate(ROUTES.POLICY_BRIEFS);
  };

  useEffect(() => {
    if (step !== 'PROCESSING') return;
    setCurrentStepIndex(0); setProgressPct(0); setElapsed(0);
    const timer = setInterval(() => setElapsed(e => e + 1), 1000);
    const totalDuration = AI_PIPELINE_STEPS.reduce((acc, s) => acc + s.duration, 0);
    const progressInterval = setInterval(() => setProgressPct(p => Math.min(p + (100 / (totalDuration / 100)), 99)), 100);

    const runPipeline = async () => {
      for (let i = 0; i < AI_PIPELINE_STEPS.length; i++) {
        setCurrentStepIndex(i);
        await new Promise(r => setTimeout(r, AI_PIPELINE_STEPS[i].duration));
      }
      clearInterval(progressInterval);
      setProgressPct(100);
      if (activeDataset) {
        const finalResults = await analysisService.getResults('mock-id');
        completeProcessing(finalResults);
      }
    };
    runPipeline();
    return () => { clearInterval(timer); clearInterval(progressInterval); };
  }, [step, activeDataset, completeProcessing]);

  return (
    <div className="flex flex-col gap-6 lg:gap-8 pb-10 w-full min-w-0 font-['Inter']">
      
      {/* GLOBAL HEADER */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 bg-[#FFFFFF] p-5 rounded-xl border border-[#E2E8F0] shadow-sm shrink-0">
        <div>
          <div className="flex items-center gap-2 text-sm text-[#64748B] mb-1 font-medium">
            <span className="hover:text-[#F57C00] cursor-pointer transition-colors" onClick={resetEngine}>Engine</span>
            <ChevronRight className="w-4 h-4" />
            <span className="text-[#0B2E59] font-semibold">Workspace</span>
          </div>
          <h1 className="text-2xl font-['Poppins'] font-bold text-[#0F172A] flex items-center gap-3">
            <BrainCircuit className="w-6 h-6 text-[#F57C00]" /> Manthan Engine
          </h1>
        </div>
        <div className="flex items-center gap-3">
          <div className="flex items-center gap-2 px-3 py-1.5 bg-[#F8FAFC] border border-[#E2E8F0] rounded-lg">
            <span className="text-[10px] uppercase font-bold text-[#64748B] tracking-wider">Status</span>
            <span className={`flex items-center gap-1.5 text-xs font-bold ${
              step === 'PROCESSING' ? 'text-[#F57C00]' : step === 'COMPLETED' ? 'text-[#2E7D32]' : 'text-[#0B2E59]'
            }`}>
              <span className={`w-2 h-2 rounded-full ${step === 'PROCESSING' ? 'bg-[#F57C00] animate-pulse' : step === 'COMPLETED' ? 'bg-[#2E7D32]' : 'bg-[#0B2E59]'}`} />
              {step}
            </span>
          </div>
          {step !== 'IDLE' && (
            <button onClick={resetEngine} className="text-sm font-semibold text-[#64748B] hover:text-red-600 px-3 py-1.5 border border-transparent hover:border-red-200 hover:bg-red-50 rounded-lg transition-colors focus:outline-none focus:ring-2 focus:ring-red-500">
              Reset Workspace
            </button>
          )}
        </div>
      </div>

      <AnimatePresence mode="wait">
        {step === 'IDLE' && (
          <motion.div key="idle" variants={containerVariants} initial="hidden" animate="visible" exit={{ opacity: 0, y: -20 }} className="space-y-6">
            <motion.div 
              variants={fadeUp} 
              onDragOver={handleDragOver} onDragLeave={handleDragLeave} onDrop={handleDrop}
              onClick={() => fileInputRef.current?.click()}
              className={`bg-[#FFFFFF] border-2 border-dashed rounded-xl p-8 md:p-14 text-center transition-all cursor-pointer shadow-sm ${isDragActive ? 'border-[#F57C00] bg-[#F57C00]/5' : 'border-[#E2E8F0] hover:border-[#0B2E59]/50 hover:bg-[#F8FAFC]'}`}
            >
              <input type="file" ref={fileInputRef} className="hidden" accept=".csv" onChange={handleFileInput} />
              <div className="w-16 h-16 bg-[#F8FAFC] border border-[#E2E8F0] rounded-full flex items-center justify-center mx-auto mb-6 shadow-sm group-hover:bg-[#FFFFFF]">
                <UploadCloud className="w-8 h-8 text-[#0B2E59]" />
              </div>
              <h3 className="text-xl md:text-2xl font-['Poppins'] font-bold text-[#0F172A] mb-2">Upload Grievance Dataset</h3>
              <p className="text-sm text-[#64748B] max-w-md mx-auto mb-8">
                Drag and drop your secure CPGRAMS or state portal CSV file here. Data is processed entirely in-memory.
              </p>
              <div className="flex flex-col sm:flex-row justify-center gap-4">
                <button className="px-6 py-3 bg-[#0B2E59] hover:bg-[#F57C00] text-[#FFFFFF] text-sm font-bold rounded-lg shadow-sm transition-colors focus:outline-none focus:ring-2 focus:ring-[#F57C00] focus:ring-offset-2">Browse Local Files</button>
                <button onClick={(e) => { e.stopPropagation(); handleUseDemo(); }} className="px-6 py-3 bg-[#FFFFFF] border border-[#E2E8F0] hover:border-[#F57C00] hover:text-[#F57C00] text-[#0F172A] text-sm font-bold rounded-lg shadow-sm transition-colors focus:outline-none focus:ring-2 focus:ring-[#F57C00]">Use Demo Dataset</button>
              </div>
            </motion.div>

            <motion.div variants={fadeUp} className="bg-[#FFFFFF] rounded-xl border border-[#E2E8F0] shadow-sm overflow-hidden min-w-0">
              <div className="p-4 border-b border-[#E2E8F0] bg-[#F8FAFC]/50">
                <h3 className="font-['Poppins'] font-bold text-[#0F172A] text-sm">Recent Vault Datasets</h3>
              </div>
              <div className="overflow-x-auto w-full hide-scrollbar">
                <table className="w-full text-left min-w-[600px]">
                  <thead className="bg-[#F8FAFC] border-b border-[#E2E8F0]">
                    <tr>{['Dataset Name', 'Size', 'Quality', 'Uploaded By', 'Actions'].map((h,i) => <th key={i} className="px-4 py-3 text-[10px] uppercase font-bold text-[#64748B] tracking-wider">{h}</th>)}</tr>
                  </thead>
                  <tbody className="text-sm">
                    {isLoadingRecent ? (
                      <tr><td colSpan={5} className="p-8 text-center text-[#64748B]"><Loader2 className="w-5 h-5 animate-spin mx-auto"/></td></tr>
                    ) : recentDatasets.map((ds) => (
                      <tr key={ds.id} className="border-b border-[#E2E8F0] hover:bg-[#F8FAFC] transition-colors">
                        <td className="px-4 py-3 font-semibold text-[#0B2E59]">{ds.name}</td>
                        <td className="px-4 py-3 text-[#64748B] text-xs">{ds.size} • {ds.totalRows} rows</td>
                        <td className="px-4 py-3"><span className="bg-[#2E7D32]/10 text-[#2E7D32] text-[10px] font-bold px-2 py-0.5 rounded uppercase">{ds.qualityScore}% Valid</span></td>
                        <td className="px-4 py-3 text-[#64748B] text-xs">{ds.uploadedBy} <span className="block text-[10px] text-[#64748B]/70 mt-0.5">{ds.uploadedAt}</span></td>
                        <td className="px-4 py-3">
                          <button onClick={handleUseDemo} className="text-xs font-bold text-[#0B2E59] hover:text-[#F57C00] bg-[#F8FAFC] border border-[#E2E8F0] hover:border-[#F57C00] px-3 py-1.5 rounded mr-2 transition-colors focus:outline-none focus:ring-2 focus:ring-[#F57C00]">Analyze</button>
                          <button className="text-[#64748B] hover:text-red-500 p-1.5 rounded hover:bg-red-50 transition-colors focus:outline-none focus:ring-2 focus:ring-red-500"><Trash2 className="w-4 h-4"/></button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </motion.div>
          </motion.div>
        )}

        {step === 'PREVIEW' && activeDataset && (
          <motion.div key="preview" variants={containerVariants} initial="hidden" animate="visible" exit={{ opacity: 0, x: -20 }} className="space-y-6">
            <motion.div variants={fadeUp} className="bg-[#FFFFFF] rounded-xl border border-[#E2E8F0] p-5 md:p-6 shadow-sm">
              <div className="flex flex-col md:flex-row md:justify-between md:items-start gap-4 mb-6">
                <div className="flex items-center gap-3">
                  <div className="bg-[#2E7D32]/10 p-3 rounded-lg"><FileSpreadsheet className="w-6 h-6 text-[#2E7D32]" /></div>
                  <div>
                    <h3 className="font-['Poppins'] font-bold text-[#0F172A] text-lg">{activeDataset.name}</h3>
                    <p className="text-xs text-[#64748B] mt-0.5">Validated and ready for analysis.</p>
                  </div>
                </div>
                <div className="flex gap-2">
                  <span className="bg-[#2E7D32]/10 text-[#2E7D32] text-xs font-bold px-3 py-1.5 rounded-full flex items-center gap-1 uppercase tracking-wide"><ShieldCheck className="w-4 h-4"/> Quality: {activeDataset.qualityScore}%</span>
                </div>
              </div>
              <div className="grid grid-cols-2 md:grid-cols-5 gap-4 pt-4 border-t border-[#E2E8F0]">
                <div><div className="text-[10px] text-[#64748B] uppercase font-bold mb-1 tracking-wider">Rows</div><div className="text-lg font-bold text-[#0F172A]">{activeDataset.totalRows.toLocaleString()}</div></div>
                <div><div className="text-[10px] text-[#64748B] uppercase font-bold mb-1 tracking-wider">Departments</div><div className="text-lg font-bold text-[#0F172A]">{activeDataset.departments}</div></div>
                <div><div className="text-[10px] text-[#64748B] uppercase font-bold mb-1 tracking-wider">States</div><div className="text-lg font-bold text-[#0F172A]">{activeDataset.states}</div></div>
                <div className="col-span-2"><div className="text-[10px] text-[#64748B] uppercase font-bold mb-1 tracking-wider">Date Range</div><div className="text-lg font-bold text-[#0F172A]">{activeDataset.dateRange}</div></div>
              </div>
            </motion.div>

            <motion.div variants={fadeUp} className="bg-[#FFFFFF] rounded-xl border border-[#E2E8F0] shadow-sm overflow-hidden min-w-0">
              <div className="p-4 border-b border-[#E2E8F0] flex justify-between items-center bg-[#F8FAFC]/50">
                <h3 className="font-['Poppins'] font-bold text-[#0F172A] text-sm">Data Sample (First 4 Rows)</h3>
              </div>
              <div className="overflow-x-auto w-full hide-scrollbar">
                <table className="w-full text-left min-w-[800px]">
                  <thead className="bg-[#F8FAFC] border-b border-[#E2E8F0]">
                    <tr>{activeDataset.columns.map(c => (
                      <th key={c.name} className="px-4 py-3 text-[10px] uppercase font-bold text-[#64748B] tracking-wider">
                        {c.name} <span className="block text-[9px] text-[#64748B]/70 font-normal mt-0.5">{c.type} • {c.missing} null</span>
                      </th>
                    ))}</tr>
                  </thead>
                  <tbody className="text-xs text-[#0F172A]">
                    {activeDataset.sampleData.map((row, i) => (
                      <tr key={i} className="border-b border-[#E2E8F0] hover:bg-[#F8FAFC] transition-colors">
                        {activeDataset.columns.map(c => (
                          <td key={c.name} className="px-4 py-3 truncate max-w-[200px]" title={String(row[c.name])}>{row[c.name]}</td>
                        ))}
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </motion.div>

            <motion.div variants={fadeUp} className="grid lg:grid-cols-3 gap-6 min-w-0">
              <div className="lg:col-span-2 bg-[#FFFFFF] rounded-xl border border-[#E2E8F0] p-6 shadow-sm">
                <h3 className="font-['Poppins'] font-bold text-[#0F172A] text-sm mb-4 flex items-center gap-2"><Cpu className="w-4 h-4 text-[#F57C00]"/> AI Model Configuration</h3>
                <div className="grid sm:grid-cols-2 gap-5">
                  <div className="space-y-1.5">
                    <label className="text-xs font-bold text-[#64748B] uppercase tracking-wider">Embedding Model</label>
                    <select value={config.embeddingModel} onChange={e => updateConfig({ embeddingModel: e.target.value })} className="w-full text-sm bg-[#F8FAFC] border border-[#E2E8F0] rounded-lg px-3 py-2.5 outline-none focus:border-[#F57C00] focus:ring-1 focus:ring-[#F57C00] transition-colors">
                      <option value="BAAI/bge-large-en-v1.5">BAAI/bge-large-en (Default)</option>
                      <option value="all-MiniLM-L6-v2">all-MiniLM-L6-v2 (Fast)</option>
                    </select>
                  </div>
                  <div className="space-y-1.5">
                    <label className="text-xs font-bold text-[#64748B] uppercase tracking-wider">Analysis Mode</label>
                    <select value={config.analysisMode} onChange={e => updateConfig({ analysisMode: e.target.value })} className="w-full text-sm bg-[#F8FAFC] border border-[#E2E8F0] rounded-lg px-3 py-2.5 outline-none focus:border-[#F57C00] focus:ring-1 focus:ring-[#F57C00] transition-colors">
                      <option>Deep Semantic (Slower)</option>
                      <option>Fast Keyword (Lexical)</option>
                    </select>
                  </div>
                  <div className="space-y-1.5">
                    <div className="flex justify-between"><label className="text-xs font-bold text-[#64748B] uppercase tracking-wider">Similarity Threshold</label><span className="text-xs font-bold text-[#F57C00]">{config.similarityThreshold}%</span></div>
                    <input type="range" min="50" max="99" value={config.similarityThreshold} onChange={e => updateConfig({ similarityThreshold: parseInt(e.target.value) })} className="w-full accent-[#F57C00]" />
                  </div>
                  <div className="space-y-1.5">
                    <label className="text-xs font-bold text-[#64748B] uppercase tracking-wider">Toggle Features</label>
                    <div className="flex flex-col gap-2 mt-1">
                      <label className="flex items-center gap-2 cursor-pointer"><input type="checkbox" checked={config.removePII} onChange={e => updateConfig({ removePII: e.target.checked })} className="accent-[#F57C00] w-4 h-4 focus:ring-[#F57C00]" /><span className="text-sm font-semibold text-[#0F172A]">Remove PII Context</span></label>
                      <label className="flex items-center gap-2 cursor-pointer"><input type="checkbox" checked={config.generateBrief} onChange={e => updateConfig({ generateBrief: e.target.checked })} className="accent-[#F57C00] w-4 h-4 focus:ring-[#F57C00]" /><span className="text-sm font-semibold text-[#0F172A]">Auto-Draft Policy Brief</span></label>
                    </div>
                  </div>
                </div>
              </div>
              
              <div className="bg-[#0B2E59] rounded-xl p-6 shadow-lg text-[#FFFFFF] flex flex-col justify-center items-center text-center relative overflow-hidden">
                <div className="absolute inset-0 opacity-20 pointer-events-none bg-[url('data:image/svg+xml;base64,PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHdpZHRoPSI4IiBoZWlnaHQ9IjgiPjxyZWN0IHdpZHRoPSI4IiBoZWlnaHQ9IjgiIGZpbGw9IiMwQjJFNTkiPjwvcmVjdD48cGF0aCBkPSJNMCAwaDh2OEgwem00IDhorNHY0SDR6IiBmaWxsPSIjRkZGRkZGIiBmaWxsLW9wYWNpdHk9IjAuMDUiPjwvcGF0aD48L3N2Zz4=')]"></div>
                <h3 className="font-['Poppins'] font-bold text-xl mb-2 relative z-10">Start Engine</h3>
                <p className="text-xs text-white/70 mb-6 relative z-10">Will execute {AI_PIPELINE_STEPS.length} sequential AI operations against {activeDataset.totalRows.toLocaleString()} rows.</p>
                <button onClick={handleStartAnalysis} className="relative z-10 w-full flex items-center justify-center gap-2 bg-[#F57C00] hover:bg-[#E67300] text-white py-3.5 rounded-lg font-bold shadow-md transition-all hover:-translate-y-0.5 focus:ring-2 focus:ring-offset-2 focus:ring-offset-[#0B2E59] focus:ring-white">
                  <Play className="w-4 h-4 fill-current" /> Initialize Manthan
                </button>
              </div>
            </motion.div>
          </motion.div>
        )}

        {step === 'PROCESSING' && (
          <motion.div key="processing" variants={fadeUp} initial="hidden" animate="visible" className="bg-[#FFFFFF] rounded-xl border border-[#E2E8F0] p-6 md:p-12 shadow-sm min-w-0 max-w-4xl mx-auto w-full">
            <div className="text-center mb-10">
              <div className="inline-flex items-center justify-center p-4 bg-[#F57C00]/10 rounded-full mb-4 border border-[#F57C00]/20">
                <BrainCircuit className="w-10 h-10 text-[#F57C00] animate-pulse" />
              </div>
              <h2 className="text-2xl md:text-3xl font-['Poppins'] font-bold text-[#0F172A]">Live AI Pipeline</h2>
              <p className="text-sm text-[#64748B] mt-2">Processing {activeDataset?.totalRows.toLocaleString()} grievances securely in-memory.</p>
            </div>

            <div className="mb-10 w-full bg-[#F8FAFC] border border-[#E2E8F0] rounded-xl p-5">
              <div className="flex justify-between text-sm font-bold text-[#0F172A] mb-2">
                <span>Overall Completion</span>
                <span className="text-[#F57C00]">{Math.floor(progressPct)}%</span>
              </div>
              <div className="h-3 bg-[#FFFFFF] rounded-full border border-[#E2E8F0] overflow-hidden mb-2">
                <motion.div className="h-full bg-gradient-to-r from-[#0B2E59] to-[#F57C00]" initial={{ width: 0 }} animate={{ width: `${progressPct}%` }} transition={{ ease: "linear" }} />
              </div>
              <div className="flex justify-between text-[10px] text-[#64748B] font-bold uppercase tracking-wider">
                <span>Elapsed: {elapsed}s</span>
                <span>Active Model: {config.embeddingModel}</span>
              </div>
            </div>

            <div className="space-y-0 relative pl-4">
              <div className="absolute left-[2.125rem] top-6 bottom-6 w-0.5 bg-[#E2E8F0] z-0"></div>
              {AI_PIPELINE_STEPS.map((ps, i) => {
                const isCompleted = i < currentStepIndex;
                const isCurrent = i === currentStepIndex;
                const isPending = i > currentStepIndex;

                return (
                  <div key={ps.id} className="relative flex items-center gap-4 md:gap-6 pb-6 last:pb-0 z-10">
                    <div className={`w-10 h-10 rounded-full flex items-center justify-center border-2 shrink-0 bg-[#FFFFFF] transition-colors duration-500 ${
                      isCompleted ? 'border-[#2E7D32] text-[#2E7D32] shadow-sm' :
                      isCurrent ? 'border-[#F57C00] text-[#F57C00] shadow-[0_0_15px_rgba(245,124,0,0.2)]' :
                      'border-[#E2E8F0] text-[#64748B]'
                    }`}>
                      {isCompleted ? <CheckCircle2 className="w-5 h-5" /> : isCurrent ? <Loader2 className="w-5 h-5 animate-spin" /> : <ps.icon className="w-4 h-4" />}
                    </div>
                    <div className={`flex-1 transition-opacity duration-300 ${isPending ? 'opacity-40' : 'opacity-100'}`}>
                      <h4 className={`font-semibold ${isCurrent ? 'text-[#0F172A] text-base' : 'text-[#64748B] text-sm'}`}>{ps.name}</h4>
                      {isCurrent && <p className="text-xs text-[#64748B] mt-1 hidden sm:block">Executing algorithmic operations...</p>}
                    </div>
                    <div className="shrink-0 text-right">
                      {isCurrent && <span className="text-[10px] font-bold text-[#F57C00] bg-[#F57C00]/10 px-2 py-1 rounded uppercase tracking-wider">Running</span>}
                      {isCompleted && <span className="text-[10px] font-bold text-[#2E7D32] bg-[#2E7D32]/10 px-2 py-1 rounded uppercase tracking-wider">Done</span>}
                    </div>
                  </div>
                );
              })}
            </div>
          </motion.div>
        )}

        {step === 'COMPLETED' && results && (
          <motion.div key="completed" variants={containerVariants} initial="hidden" animate="visible" className="space-y-6">
            
            <motion.div variants={fadeUp} className="bg-[#2E7D32]/10 border border-[#2E7D32]/20 rounded-xl p-5 md:p-6 flex flex-col md:flex-row justify-between md:items-center gap-4">
              <div className="flex items-center gap-4">
                <div className="bg-[#2E7D32] text-[#FFFFFF] p-3 rounded-full shadow-md shrink-0"><CheckCircle2 className="w-6 h-6 md:w-8 md:h-8" /></div>
                <div>
                  <h2 className="text-lg md:text-xl font-['Poppins'] font-bold text-[#0F172A]">Engine Analysis Successful</h2>
                  <p className="text-xs md:text-sm text-[#2E7D32] font-semibold">Processed {results.totalProcessed.toLocaleString()} records • Confidence Score: {results.confidenceScore}%</p>
                </div>
              </div>
              <button onClick={handleGeneratePolicy} className="w-full md:w-auto flex items-center justify-center gap-2 px-6 py-2.5 bg-[#0B2E59] text-[#FFFFFF] text-sm font-bold rounded-lg shadow-sm hover:bg-[#F57C00] transition-colors focus:outline-none focus:ring-2 focus:ring-[#F57C00] focus:ring-offset-2">
                <FileText className="w-4 h-4"/> Draft Policy Brief
              </button>
            </motion.div>

            <motion.div variants={fadeUp} className="grid grid-cols-2 lg:grid-cols-4 gap-4">
              {[
                { title: 'Semantic Clusters', value: results.clustersFound, icon: Network, color: 'text-[#0B2E59]', bg: 'bg-[#0B2E59]/10' },
                { title: 'Root Causes', value: results.rootCausesFound, icon: Target, color: 'text-red-600', bg: 'bg-red-50' },
                { title: 'Depts Affected', value: results.affectedDepartments, icon: Building2, color: 'text-[#F57C00]', bg: 'bg-[#F57C00]/10' },
                { title: 'States Affected', value: results.affectedStates, icon: MapIcon, color: 'text-[#2E7D32]', bg: 'bg-[#2E7D32]/10' },
              ].map((stat, i) => (
                <div key={i} className="bg-[#FFFFFF] p-5 rounded-xl border border-[#E2E8F0] shadow-sm flex flex-col hover:border-[#0B2E59]/30 transition-colors">
                  <div className="flex items-center gap-3 mb-2">
                    <div className={`p-2 rounded-lg ${stat.bg}`}><stat.icon className={`w-4 h-4 ${stat.color}`} /></div>
                    <h3 className="text-[#64748B] text-[10px] md:text-xs font-bold uppercase tracking-wider">{stat.title}</h3>
                  </div>
                  <div className="text-2xl font-['Poppins'] font-bold text-[#0F172A]">{stat.value}</div>
                </div>
              ))}
            </motion.div>

            <div className="grid lg:grid-cols-3 gap-6 min-w-0">
              <motion.div variants={fadeUp} className="lg:col-span-2 bg-[#FFFFFF] rounded-xl border border-[#E2E8F0] shadow-sm overflow-hidden flex flex-col min-w-0">
                <div className="p-4 border-b border-[#E2E8F0] bg-[#F8FAFC]/50">
                  <h3 className="font-['Poppins'] font-bold text-[#0F172A] text-sm flex items-center gap-2"><ListTree className="w-4 h-4 text-[#F57C00]"/> Discovered Systemic Clusters</h3>
                </div>
                <div className="p-4 space-y-4">
                  {results.clusters.map((c, i) => (
                    <div key={i} className="border border-[#E2E8F0] rounded-lg p-4 hover:border-[#F57C00]/50 transition-colors">
                      <div className="flex flex-col sm:flex-row sm:justify-between sm:items-start gap-2 mb-2">
                        <h4 className="font-bold text-[#0F172A] text-sm">{c.title}</h4>
                        <span className={`text-[10px] font-bold uppercase tracking-wider px-2 py-0.5 rounded w-max ${c.severity === 'Critical' ? 'bg-red-100 text-red-700' : c.severity === 'High' ? 'bg-[#F57C00]/20 text-[#F57C00]' : 'bg-yellow-100 text-yellow-700'}`}>{c.severity}</span>
                      </div>
                      <p className="text-xs text-[#64748B] mb-3 leading-relaxed">{c.description}</p>
                      <div className="flex items-center gap-4 text-[10px] font-bold text-[#64748B] uppercase tracking-wider">
                        <span className="flex items-center gap-1"><Users className="w-3.5 h-3.5"/> Volume: {c.count.toLocaleString()}</span>
                        <span className="flex items-center gap-1"><BrainCircuit className="w-3.5 h-3.5 text-[#F57C00]"/> AI Match: &gt;94%</span>
                      </div>
                    </div>
                  ))}
                </div>
              </motion.div>

              <motion.div variants={fadeUp} className="bg-[#FFFFFF] rounded-xl border border-[#E2E8F0] shadow-sm flex flex-col min-w-0">
                <div className="p-4 border-b border-[#E2E8F0] bg-[#F8FAFC]/50">
                  <h3 className="font-['Poppins'] font-bold text-[#0F172A] text-sm">Category Impact</h3>
                </div>
                <div className="p-4 space-y-3">
                  {results.topCategories.map((cat, i) => {
                    const pct = Math.round((cat.count / results.totalProcessed) * 100);
                    return (
                      <div key={i}>
                        <div className="flex justify-between text-xs font-semibold text-[#0F172A] mb-1">
                          <span>{cat.name}</span>
                          <span>{pct}%</span>
                        </div>
                        <div className="h-2 bg-[#E2E8F0] rounded-full overflow-hidden">
                          <div className="h-full bg-[#0B2E59] rounded-full" style={{ width: `${pct}%` }}></div>
                        </div>
                      </div>
                    );
                  })}
                </div>
                
                <div className="mt-auto p-4 border-t border-[#E2E8F0] bg-[#F8FAFC]/50 space-y-2">
                   <button onClick={() => navigate(ROUTES.ROOT_CAUSE)} className="w-full flex items-center justify-between p-2.5 bg-[#FFFFFF] border border-[#E2E8F0] hover:border-[#F57C00] rounded-lg transition-colors text-sm font-semibold text-[#0F172A] hover:text-[#F57C00] focus:outline-none focus:ring-2 focus:ring-[#F57C00]">
                      <span className="flex items-center gap-2"><Target className="w-4 h-4"/> Deep Root Cause Analysis</span>
                      <ChevronRight className="w-4 h-4"/>
                   </button>
                   <button onClick={() => navigate(ROUTES.ANALYTICS)} className="w-full flex items-center justify-between p-2.5 bg-[#FFFFFF] border border-[#E2E8F0] hover:border-[#F57C00] rounded-lg transition-colors text-sm font-semibold text-[#0F172A] hover:text-[#F57C00] focus:outline-none focus:ring-2 focus:ring-[#F57C00]">
                      <span className="flex items-center gap-2"><BarChart3 className="w-4 h-4"/> View Full Analytics</span>
                      <ChevronRight className="w-4 h-4"/>
                   </button>
                </div>
              </motion.div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};