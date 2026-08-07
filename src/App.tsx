import React from 'react';
import { AppRouter } from '@/routes/AppRouter';
import { Toaster } from 'sonner';

export const App: React.FC = () => {
  return (
    <React.Fragment>
      <AppRouter />
      <Toaster position="top-right" richColors />
    </React.Fragment>
  );
};