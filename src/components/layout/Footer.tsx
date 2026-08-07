import React from 'react';

export const Footer: React.FC = () => {
  return (
    <footer className="bg-[#FFFFFF] border-t border-[#E2E8F0] py-4 px-6 lg:px-8 mt-auto shrink-0 w-full z-20">
      <div className="flex flex-col md:flex-row justify-between items-center text-xs font-medium text-[#64748B] gap-4 w-full mx-auto">
        <p>© 2026 JanaManthan Decision Intelligence. Govt of India.</p>
        <div className="flex items-center gap-6">
          <a href="#" className="hover:text-[#0B2E59] transition-colors">Privacy Policy</a>
          <a href="#" className="hover:text-[#0B2E59] transition-colors">Terms of Use</a>
          <a href="#" className="hover:text-[#0B2E59] transition-colors">Support</a>
          <span className="px-2 py-1 bg-[#F8FAFC] border border-[#E2E8F0] rounded-md font-semibold text-[#0F172A]">Version 1.0</span>
        </div>
      </div>
    </footer>
  );
};