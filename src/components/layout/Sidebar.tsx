// src/components/layout/Sidebar/Sidebar.tsx
import React from 'react';
import { NavLink } from 'react-router-dom';
import { LogOut, LayoutDashboard, BrainCircuit, BarChart3, Map, Target, FileText, Settings } from 'lucide-react';
import { useAppStore } from '@/stores/useAppStore';
import { SIDEBAR_ITEMS } from '@/constants/navigation';

export const Sidebar: React.FC = () => {
  const { isSidebarCollapsed, clearUser } = useAppStore();

  return (
    <aside className={`flex flex-col bg-[#FFFFFF] border-r border-[#E2E8F0] text-[#0F172A] transition-all duration-300 ease-in-out relative z-40 ${isSidebarCollapsed ? 'w-20' : 'w-64'}`}>
      
      {/* Brand Header */}
      <div className="flex h-16 shrink-0 items-center gap-3 border-b border-[#E2E8F0] px-4 justify-center bg-[#F8FAFC]">
        <img src="/JanaManthan_logo.png" alt="JanaManthan Logo" className="h-9 w-auto object-contain" />
        {!isSidebarCollapsed && (
          <div className="flex flex-col">
            <span className="font-['Poppins'] font-bold text-lg tracking-tight text-[#0B2E59]">JanaManthan</span>
            <span className="text-[9px] uppercase font-bold tracking-widest text-[#F57C00]">Gov Intelligence</span>
          </div>
        )}
      </div>

      {/* Navigation Links */}
      <nav className="flex-1 overflow-y-auto py-6 px-3 space-y-1.5 custom-scrollbar">
        {SIDEBAR_ITEMS.map((item) => (
          <NavLink
            key={item.path}
            to={item.path}
            className={({ isActive }) =>
              `group flex items-center gap-3.5 rounded-xl px-4 py-3 text-sm font-semibold transition-all duration-200 ${
                isActive 
                  ? 'bg-[#0B2E59] text-[#FFFFFF] shadow-md font-bold' 
                  : 'text-[#64748B] hover:bg-[#F8FAFC] hover:text-[#0B2E59]'
              } ${isSidebarCollapsed ? 'justify-center px-2' : ''}`
            }
            title={isSidebarCollapsed ? item.label : undefined}
          >
            <item.icon className={`w-5 h-5 shrink-0 ${isSidebarCollapsed ? '' : 'group-hover:scale-110 transition-transform'}`} />
            {!isSidebarCollapsed && <span className="truncate">{item.label}</span>}
          </NavLink>
        ))}
      </nav>

      {/* Logout Footer */}
      <div className="p-4 border-t border-[#E2E8F0] bg-[#F8FAFC]">
        <button
          onClick={clearUser}
          className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-xl text-[#64748B] hover:bg-red-50 hover:text-red-600 transition-colors font-semibold text-sm ${isSidebarCollapsed ? 'justify-center' : ''}`}
          title={isSidebarCollapsed ? 'Logout' : undefined}
        >
          <LogOut className="w-5 h-5 text-red-500" />
          {!isSidebarCollapsed && <span>Logout</span>}
        </button>
      </div>
    </aside>
  );
};