import React from 'react';
import { motion } from 'framer-motion';
import { SearchX, FolderOpen, BellOff } from 'lucide-react';
import { Button } from '@/components/common/Button';

interface EmptyStateProps {
  type?: 'search' | 'data' | 'notifications';
  title: string;
  description: string;
  actionLabel?: string;
  onAction?: () => void;
}

export const EmptyState: React.FC<EmptyStateProps> = ({ type = 'data', title, description, actionLabel, onAction }) => {
  const Icon = type === 'search' ? SearchX : type === 'notifications' ? BellOff : FolderOpen;

  return (
    <motion.div 
      initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }}
      className="flex flex-col items-center justify-center p-12 text-center bg-[#F8FAFC] border border-dashed border-[#E2E8F0] rounded-xl w-full"
    >
      <div className="w-16 h-16 bg-white border border-[#E2E8F0] rounded-2xl flex items-center justify-center mb-6 shadow-sm">
        <Icon className="w-8 h-8 text-[#64748B]" />
      </div>
      <h3 className="text-lg font-['Poppins'] font-bold text-[#1E293B] mb-2">{title}</h3>
      <p className="text-sm text-[#64748B] max-w-md mb-6">{description}</p>
      {actionLabel && onAction && (
        <Button variant="primary" onClick={onAction}>{actionLabel}</Button>
      )}
    </motion.div>
  );
};