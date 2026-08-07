import React from 'react';
import { Outlet } from 'react-router-dom';
import { Sidebar } from './Sidebar';
import { Header } from './Header';
import { Footer } from './Footer';
import { PageTransition } from '../ui/PageTransition';

export const AppLayout: React.FC = () => {
  return (
    <div className="flex h-screen w-full bg-[#F8FAFC] overflow-hidden font-sans text-[#0F172A]">
      {/* Fixed Sidebar */}
      <Sidebar />
      
      {/* 
        Main Content Shell:
        flex-1 forces it to fill remaining width.
        min-w-0 prevents inner flex children from blowing out the viewport.
      */}
      <div className="flex-1 flex flex-col min-w-0 h-screen overflow-hidden relative">
        {/* Fixed Header */}
        <Header />
        
        {/* Scrollable Main Area */}
        <main className="flex-1 overflow-y-auto overflow-x-hidden p-4 sm:p-6 lg:p-8 scroll-smooth w-full relative z-0">
          <div className="mx-auto max-w-7xl w-full flex flex-col pb-8 min-h-full">
            <PageTransition>
              <Outlet />
            </PageTransition>
          </div>
        </main>
        
        {/* Footer */}
        <Footer />
      </div>
    </div>
  );
};