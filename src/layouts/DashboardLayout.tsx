import React from 'react';
import { Outlet } from 'react-router-dom';
import { Sidebar } from '@/components/layout/Sidebar';
import { Header } from '@/components/layout/Header';
import { Footer } from '@/components/layout/Footer';

export const DashboardLayout: React.FC = () => {
  return (
    <div className="flex h-screen w-full bg-[#F8FAFC] overflow-hidden text-[#1E293B] font-['Inter']">
      
      {/* Sidebar is fixed to the left and will not shrink */}
      <Sidebar />
      
      {/* 
        Main Content Wrapper: 
        flex-1 takes remaining space. 
        min-w-0 prevents tables/charts from breaking the flex container width.
      */}
      <div className="flex-1 flex flex-col min-w-0 h-screen overflow-hidden relative">
        <Header />
        
        {/* Scrollable Area */}
        <main className="flex-1 overflow-y-auto overflow-x-hidden p-6 lg:p-8 scroll-smooth w-full">
          
          {/* Centered Content Container ensuring no elements touch screen edges */}
          <div className="mx-auto max-w-7xl w-full pb-10 flex flex-col gap-6 lg:gap-8">
            <Outlet />
          </div>
          
        </main>
        
        <Footer />
      </div>
    </div>
  );
};