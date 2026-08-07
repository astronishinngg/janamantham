import React from 'react';
import { motion } from 'framer-motion';

interface CardProps extends React.HTMLAttributes<HTMLDivElement> {
  hoverable?: boolean;
}

export const Card: React.FC<CardProps> = ({ className = '', hoverable = false, children, ...props }) => {
  return (
    <motion.div
      whileHover={hoverable ? { y: -2, boxShadow: '0 10px 15px -3px rgb(0 0 0 / 0.1), 0 4px 6px -4px rgb(0 0 0 / 0.1)' } : {}}
      className={`bg-[#FFFFFF] rounded-xl border border-[#E2E8F0] shadow-sm overflow-hidden transition-all duration-300 ${className}`}
      {...props}
    >
      {children}
    </motion.div>
  );
};