import React, { useEffect, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  BrainCircuit, Database, RefreshCw, Shield, Cpu, Network, Target, 
  TrendingUp, CheckCircle2, FileText, Loader2, Play
} from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { ROUTES } from '@/constants/routes';

interface AIThinkingModalProps {
  isOpen: boolean;
  onComplete: () => void;
}

const WORKFLOW_STEPS = [
  { id: 1, label: 'Reading Grievance Dataset', icon: Database },
  { id: 2, label: 'Cleaning Complaint Data', icon: RefreshCw },
  { id: 3, label: 'Removing Personal Information (PII)', icon: Shield },
  { id: 4, label: 'Generating LLM Embeddings', icon: Cpu },
  { id: 5, label: 'Semantic Similarity Search', icon: Network },
  { id: 6, label: 'Creating Complaint Clusters', icon: Database },
  { id: 7, label: 'Detecting Recurring Patterns', icon: TrendingUp },
  { id: 8, label: 'Identifying Root Causes', icon: Target },
  { id: 9, label: 'Calculating AI Confidence', icon: BrainCircuit },
  { id: 10, label: 'Generating Recommendations', icon: FileText },
  { id: 11, label: 'Drafting Policy Brief', icon: FileText },
];

export const AIThinkingModal: React.FC<AIThinkingModalProps> = ({ isOpen, onComplete }) => {
  const navigate = useNavigate();
  const [currentStep, setCurrentStep] = useState(0);
  const [progress, setProgress] = useState(0);
  const [elapsed, setElapsed] = useState(0);
  const [isFinished, setIsFinished] = useState(false);

  useEffect(() => {
    if (!isOpen) return;

    setCurrentStep(0);
    setProgress(0);
    setElapsed(0);
    setIsFinished(false);

    // Total time ~ 12 seconds for simulation
    const timerInterval = setInterval(() => setElapsed(e => e + 1), 1000);
    const progressInterval = setInterval(() => setProgress(p => (p < 99 ? p + 0.5 : p)), 60);

    const runSteps = async () => {
      for (let i = 0; i < WORKFLOW_STEPS.length; i++) {
        setCurrentStep(i);
        await new Promise(r => setTimeout(r, 1000 + Math.random() * 500));
      }
      clearInterval(timerInterval);
      clearInterval(progressInterval);
      setProgress(100);
      setIsFinished(true);
      
      // Auto redirect after complete
      setTimeout(() => {
        onComplete();
        navigate(ROUTES.ROOT_CAUSE); // Navigating to RCA or Engine Results based on flow
      }, 2000);
    };

    runSteps();

    return () => {
      clearInterval(timerInterval);
      clearInterval(progressInterval);
    };
  }, [isOpen, navigate, onComplete]);

  if (!isOpen) return null;

  return (
    <AnimatePresence>
      <motion.div 
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        className="fixed inset-0 z-[100] flex items-center justify-center bg-[#F8FAFC] overflow-hidden"
      >
        {/* Background Decorative */}
        <div className="absolute inset-0 bg-gradient-to-br from-[#0B2E59]/5 to-[#F57C00]/5 z-0" />
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[800px] h-[800px] bg-[#0B2E59]/5 rounded-full blur-[100px] pointer-events-none" />

        <div className="relative z-10 w-full max-w-3xl bg-white border border-[#E2E8F0] rounded-2xl shadow-2xl p-10 flex flex-col items-center">
          
          <div className="mb-8 text-center">
            <div className="inline-flex p-4 bg-[#0B2E59]/10 rounded-2xl mb-4 relative">
              <BrainCircuit className="w-12 h-12 text-[#0B2E59]" />
              {!isFinished && (
                <motion.div 
                  animate={{ rotate: 360 }} transition={{ repeat: Infinity, duration: 3, ease: "linear" }}
                  className="absolute inset-0 border-4 border-transparent border-t-[#F57C00] rounded-2xl"
                />
              )}
            </div>
            <h2 className="text-3xl font-['Poppins'] font-bold text-[#1E293B] mb-2">
              {isFinished ? 'Analysis Complete' : 'Manthan Engine Running'}
            </h2>
            <p className="text-[#64748B]">Please wait while AI generates intelligent policy insights.</p>
          </div>

          {/* Main Progress Bar */}
          <div className="w-full mb-8">
            <div className="flex justify-between items-end mb-2">
              <span className="text-sm font-bold text-[#1E293B]">Overall Progress</span>
              <span className="text-2xl font-bold font-['Poppins'] text-[#0B2E59]">{Math.floor(progress)}%</span>
            </div>
            <div className="h-4 bg-[#F8FAFC] rounded-full border border-[#E2E8F0] overflow-hidden">
              <motion.div 
                className={`h-full ${isFinished ? 'bg-[#1E8E3E]' : 'bg-gradient-to-r from-[#0B2E59] to-[#F57C00]'}`}
                initial={{ width: 0 }}
                animate={{ width: `${progress}%` }}
                transition={{ ease: "linear" }}
              />
            </div>
            <div className="flex justify-between text-xs font-semibold text-[#64748B] mt-2">
              <span>Time Elapsed: {elapsed}s</span>
              <span>Target: Deep Semantic Context</span>
            </div>
          </div>

          {/* Workflow Steps Display */}
          <div className="w-full bg-[#F8FAFC] border border-[#E2E8F0] rounded-xl p-6 h-64 overflow-hidden relative">
            <div className="absolute inset-x-0 top-0 h-6 bg-gradient-to-b from-[#F8FAFC] to-transparent z-10" />
            <div className="absolute inset-x-0 bottom-0 h-12 bg-gradient-to-t from-[#F8FAFC] to-transparent z-10" />
            
            <div className="space-y-4 transition-transform duration-500 ease-in-out" 
                 style={{ transform: `translateY(-${Math.max(0, (currentStep - 2) * 56)}px)` }}>
              {WORKFLOW_STEPS.map((step, index) => {
                const isCompleted = index < currentStep;
                const isCurrent = index === currentStep;
                const isPending = index > currentStep;

                return (
                  <div key={step.id} className={`flex items-center gap-4 transition-opacity duration-300 h-10 ${isPending ? 'opacity-30' : 'opacity-100'}`}>
                    <div className={`w-10 h-10 rounded-full flex items-center justify-center border-2 shrink-0 ${
                      isCompleted ? 'bg-[#1E8E3E] border-[#1E8E3E] text-white' :
                      isCurrent ? 'bg-white border-[#F57C00] text-[#F57C00] shadow-[0_0_15px_rgba(245,124,0,0.2)]' :
                      'bg-white border-[#E2E8F0] text-[#64748B]'
                    }`}>
                      {isCompleted ? <CheckCircle2 className="w-5 h-5" /> : 
                       isCurrent ? <Loader2 className="w-5 h-5 animate-spin" /> : 
                       <step.icon className="w-4 h-4" />}
                    </div>
                    <div className="flex-1">
                      <h4 className={`font-semibold ${isCurrent ? 'text-[#1E293B] text-base' : 'text-[#64748B] text-sm'}`}>
                        {step.label}
                      </h4>
                    </div>
                    <div className="shrink-0">
                      {isCurrent && <span className="bg-orange-100 text-orange-700 text-xs font-bold px-2.5 py-1 rounded-full uppercase tracking-wider">Running</span>}
                      {isCompleted && <span className="bg-green-100 text-green-700 text-xs font-bold px-2.5 py-1 rounded-full uppercase tracking-wider">Done</span>}
                    </div>
                  </div>
                );
              })}
            </div>
          </div>

          {/* Success State Text */}
          <AnimatePresence>
            {isFinished && (
              <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} className="mt-6 text-center text-sm font-bold text-[#1E8E3E] flex items-center gap-2">
                <CheckCircle2 className="w-5 h-5" /> AI Confidence Score: 96.4% — Redirecting to Results...
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </motion.div>
    </AnimatePresence>
  );
};