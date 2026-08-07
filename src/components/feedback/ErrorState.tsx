import React from 'react';
import { motion } from 'framer-motion';
import { AlertOctagon, RefreshCw, ArrowLeft } from 'lucide-react';
import { Button } from '@/components/common/Button';

interface ErrorStateProps {
  title?: string;
  message?: string;
  onRetry?: () => void;
  onBack?: () => void;
}

export const ErrorState: React.FC<ErrorStateProps> = ({ 
  title = "Something went wrong", 
  message = "An unexpected error occurred while processing your request. Please try again.", 
  onRetry, 
  onBack 
}) => {
  return (
    <motion.div 
      initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }}
      className="flex flex-col items-center justify-center p-12 text-center bg-white border border-red-100 rounded-xl w-full shadow-sm"
    >
      <div className="w-20 h-20 bg-red-50 rounded-full flex items-center justify-center mb-6">
        <AlertOctagon className="w-10 h-10 text-red-500" />
      </div>
      <h3 className="text-xl font-['Poppins'] font-bold text-[#1E293B] mb-2">{title}</h3>
      <p className="text-sm text-[#64748B] max-w-md mb-8">{message}</p>
      <div className="flex gap-4">
        {onBack && (
          <Button variant="outline" leftIcon={<ArrowLeft className="w-4 h-4"/>} onClick={onBack}>
            Go Back
          </Button>
        )}
        {onRetry && (
          <Button variant="primary" leftIcon={<RefreshCw className="w-4 h-4"/>} onClick={onRetry}>
            Retry Request
          </Button>
        )}
      </div>
    </motion.div>
  );
};