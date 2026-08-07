import React from 'react';
import { Outlet } from 'react-router-dom';
import { Sidebar } from '@/components/layout/Sidebar';
import { Header } from '@/components/layout/Header';
import { Footer } from '@/components/layout/Footer';
import { ChatbotWidget } from '@/components/shared/ChatbotWidget';

export const DashboardLayout: React.FC = () => {
  return (
    <div className="flex h-screen print:h-auto print:block w-full bg-[#F8FAFC] overflow-hidden print:overflow-visible text-[#1E293B] font-['Inter']">
      
      {/* Sidebar is hidden when printing */}
      <div className="print:hidden h-full">
        <Sidebar />
      </div>
      
      {/* Main Content Wrapper */}
      <div className="flex-1 flex flex-col min-w-0 h-screen print:h-auto overflow-hidden print:overflow-visible relative">
        <div className="print:hidden">
          <Header />
        </div>
        
        {/* Scrollable Area */}
        <main className="flex-1 overflow-y-auto print:overflow-visible overflow-x-hidden p-6 lg:p-8 print:p-0 scroll-smooth w-full">
          {/* Centered Content Container */}
          <div className="mx-auto max-w-7xl w-full pb-10 print:pb-0 flex flex-col gap-6 lg:gap-8">
            <Outlet />
          </div>
        </main>
        
        {/* Chatbot floating widget */}
        <ChatbotWidget />
        
        <div className="print:hidden">
          <Footer />
        </div>
      </div>
    </div>
  );
};