import React from 'react';

export const KPISkeleton = () => (
  <div className="bg-white p-5 rounded-xl border border-[#E2E8F0] shadow-sm animate-pulse">
    <div className="flex justify-between items-start mb-4">
      <div className="w-10 h-10 bg-slate-200 rounded-lg"></div>
      <div className="w-12 h-4 bg-slate-200 rounded-full"></div>
    </div>
    <div className="w-24 h-3 bg-slate-200 rounded mb-2"></div>
    <div className="w-32 h-8 bg-slate-200 rounded mb-4"></div>
    <div className="w-full h-1.5 bg-slate-100 rounded-full overflow-hidden">
      <div className="w-1/2 h-full bg-slate-200"></div>
    </div>
  </div>
);

export const ChartSkeleton = () => (
  <div className="bg-white p-6 rounded-xl border border-[#E2E8F0] shadow-sm animate-pulse flex flex-col h-[380px]">
    <div className="flex justify-between items-center mb-6">
      <div className="w-40 h-5 bg-slate-200 rounded"></div>
      <div className="w-20 h-8 bg-slate-100 rounded-md"></div>
    </div>
    <div className="flex-1 bg-slate-50 border border-slate-100 rounded-lg w-full flex items-end p-4 gap-2">
      {/* Fake bars for visual feedback */}
      {[40, 70, 45, 90, 65, 30, 80].map((h, i) => (
        <div key={i} className="flex-1 bg-slate-200 rounded-t-sm" style={{ height: `${h}%` }}></div>
      ))}
    </div>
  </div>
);

export const TableSkeleton = ({ rows = 5 }) => (
  <div className="bg-white rounded-xl border border-[#E2E8F0] shadow-sm overflow-hidden animate-pulse">
    <div className="h-14 bg-slate-50 border-b border-[#E2E8F0] flex items-center px-6 gap-4">
      {[1, 2, 3, 4, 5].map((i) => <div key={i} className="flex-1 h-3 bg-slate-200 rounded"></div>)}
    </div>
    {Array.from({ length: rows }).map((_, i) => (
      <div key={i} className="h-16 border-b border-[#E2E8F0] flex items-center px-6 gap-4">
        {[1, 2, 3, 4, 5].map((j) => <div key={j} className="flex-1 h-4 bg-slate-100 rounded"></div>)}
      </div>
    ))}
  </div>
);