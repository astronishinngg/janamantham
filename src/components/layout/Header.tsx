import React from 'react';
import { Menu, Bell, User } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { useAppStore } from '@/stores/useAppStore';
import { ROUTES } from '@/constants/routes';

export const Header: React.FC = () => {
  const navigate = useNavigate();
  const { toggleSidebar, user } = useAppStore();

  return (
    <header className="h-16 bg-white/85 backdrop-blur-lg border-b border-slate-200/60 flex items-center justify-between px-4 lg:px-6 sticky top-0 z-30 shadow-sm font-['Inter'] transition-all duration-300">
      <div className="flex items-center gap-4">
        <button onClick={toggleSidebar} className="p-2 text-slate-500 hover:bg-slate-100 rounded-lg transition-colors focus:outline-none focus:ring-2 focus:ring-[#0B2E59]/20">
          <Menu className="w-5 h-5" />
        </button>
        
        {/* MOBILE RESPONSIVE LOGO */}
        <div className="lg:hidden flex items-center gap-2">
          <img 
            src="/JanaManthan_logo.png" 
            alt="JanaManthan Logo" 
            className="h-[36px] w-auto object-contain" 
            loading="lazy" 
          />
        </div>
      </div>

      <div className="flex items-center gap-3 md:gap-5">
        <button className="relative p-2 text-slate-500 hover:bg-slate-100 hover:text-[#0B2E59] rounded-full transition-colors focus:outline-none focus:ring-2 focus:ring-[#0B2E59]/20">
          <Bell className="w-5 h-5" />
          {/* Brand Color Orange applied to Notification Badge */}
          <span className="absolute top-1.5 right-1.5 w-2 h-2 bg-[#F57C00] rounded-full border-2 border-white"></span>
        </button>
        
        <div className="h-8 w-px bg-slate-200 hidden sm:block"></div>

        <button onClick={() => navigate(ROUTES.SETTINGS)} className="flex items-center gap-3 hover:bg-slate-50 p-1.5 pr-3 rounded-full transition-colors border border-transparent hover:border-slate-200 focus:outline-none focus:ring-2 focus:ring-[#0B2E59]/20">
          <div className="w-8 h-8 rounded-full bg-[#0B2E59] flex items-center justify-center text-white font-['Poppins'] font-bold text-sm shadow-sm overflow-hidden border border-slate-200">
            {user?.avatarUrl ? <img src={user.avatarUrl} alt="Avatar" className="w-full h-full object-cover"/> : (user?.name?.charAt(0) || <User className="w-4 h-4"/>)}
          </div>
          <div className="hidden sm:block text-left">
            <p className="text-xs font-bold text-[#0B2E59] leading-tight font-['Inter']">{user?.name || 'Officer'}</p>
            <p className="text-[10px] font-semibold text-slate-500 font-['Inter'] tracking-wide">{user?.role || 'Gov Admin'}</p>
          </div>
        </button>
      </div>
    </header>
  );
};