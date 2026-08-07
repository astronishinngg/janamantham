import React from 'react';
import { motion } from 'framer-motion';
import { cn } from '@/utils/cn';

interface CardProps extends React.HTMLAttributes<HTMLDivElement> {
  hoverable?: boolean;
}

export const Card: React.FC<CardProps> = ({ className, hoverable = false, children, ...props }) => {
  return (
    <motion.div
      whileHover={hoverable ? { y: -2 } : {}}
      className={cn(
        "bg-white rounded-xl border border-[#E2E8F0] shadow-sm overflow-hidden",
        hoverable && "hover:shadow-lg hover:border-[#0B2E59]/30 transition-all duration-300",
        className
      )}
      {...props}
    >
      {children}
    </motion.div>
  );
};