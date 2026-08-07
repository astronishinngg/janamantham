import React from 'react';
import { Link } from 'react-router-dom';
import { Home } from 'lucide-react';
import { ROUTES } from '@/constants/routes';

export const NotFound: React.FC = () => {
  return (
    <div className="min-h-screen bg-[#F8FAFC] flex flex-col items-center justify-center p-6 text-center font-['Inter']">
      
      <img 
        src="/JanaManthan_logo.png" 
        alt="JanaManthan Logo" 
        className="h-[90px] w-auto object-contain mb-8 drop-shadow-md" 
        loading="lazy"
      />
      
      <h1 className="text-8xl font-['Poppins'] font-bold text-[#0B2E59] mb-4 drop-shadow-sm">404</h1>
      <h2 className="text-2xl font-bold text-slate-800 mb-3">Module Not Found</h2>
      
      <p className="text-slate-500 mb-8 max-w-md leading-relaxed font-medium">
        The intelligence module or dashboard you are looking for does not exist or has been restricted to a classified sector.
      </p>
      
      <Link to={ROUTES.HOME} className="flex items-center gap-2 bg-[#0B2E59] text-white px-8 py-3.5 rounded-lg font-bold shadow-md hover:bg-[#082244] hover:-translate-y-0.5 transition-all">
        <Home className="w-5 h-5" /> Return Home
      </Link>
    </div>
  );
};