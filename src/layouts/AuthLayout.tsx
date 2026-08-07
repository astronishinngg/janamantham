import React from 'react';
import { Outlet } from 'react-router-dom';

export const AuthLayout: React.FC = () => {
  return (
    <div className="min-h-screen w-full bg-[#F8FAFC] flex flex-col m-0 p-0 selection:bg-[#2F6BFF]/20 text-[#1E293B] font-['Inter']">
      <Outlet />
    </div>
  );
};