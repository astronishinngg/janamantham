// src/pages/Login.tsx
import React, { useState } from 'react';
import { toast } from 'react-hot-toast'; // or 'sonner' depending on your setup
import { Loader2, ShieldAlert } from 'lucide-react';
import { useAppStore } from '@/stores/useAppStore';

export const Login: React.FC = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const setUser = useAppStore((s) => s.setUser);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);

    // 1. Show loading spinner for 1 second
    setTimeout(() => {
      // 2. Validate hardcoded credentials
      if (email === 'janamanthan@gov.in' && password === 'janamanthan@2026') {
        
        // Save prototype tokens exactly as requested
        localStorage.setItem("jm_authenticated", "true");
        localStorage.setItem("jm_user", JSON.stringify({
          name: "Government Officer",
          email: "janamanthan@gov.in",
          role: "Officer"
        }));

        // Sync Zustand store
        setUser({
          id: 'gov-officer-1',
          name: 'Government Officer',
          role: 'Officer',
          department: 'Administration',
          email: 'janamanthan@gov.in',
          avatarInitials: 'GO'
        });

        // 3. Show success toast
        toast.success('Welcome to JanaManthan');
        
        // 4. Navigate to dashboard (using window.location to force router refresh)
        window.location.href = '/dashboard';
        
      } else {
        setIsLoading(false);
        toast.error('Invalid Government Credentials');
      }
    }, 1000);
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-md w-full space-y-8 bg-white p-8 rounded-xl shadow-lg border border-gray-100">
        
        <div className="text-center">
          <h2 className="mt-6 text-3xl font-extrabold text-gray-900">
            JanaManthan
          </h2>
          <p className="mt-2 text-sm text-gray-600">
            Internal Government Decision Intelligence
          </p>
        </div>

        <form className="mt-8 space-y-6" onSubmit={handleSubmit}>
          <div className="space-y-4">
            <div>
              <label htmlFor="email" className="block text-sm font-medium text-gray-700">
                Email
              </label>
              <input
                id="email"
                name="email"
                type="email"
                autoComplete="email"
                required
                className="mt-1 appearance-none relative block w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                disabled={isLoading}
              />
            </div>

            <div>
              <label htmlFor="password" className="block text-sm font-medium text-gray-700">
                Password
              </label>
              <input
                id="password"
                name="password"
                type="password"
                autoComplete="current-password"
                required
                className="mt-1 appearance-none relative block w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                disabled={isLoading}
              />
            </div>
          </div>

          <div>
            <button
              type="submit"
              disabled={isLoading}
              className="group relative w-full flex justify-center py-2.5 px-4 border border-transparent text-sm font-medium rounded-md text-white bg-blue-900 hover:bg-blue-800 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-900 disabled:bg-blue-400 disabled:cursor-not-allowed transition-colors"
            >
              {isLoading ? (
                <>
                  <Loader2 className="animate-spin -ml-1 mr-2 h-5 w-5 text-white" />
                  Authenticating...
                </>
              ) : (
                'Sign In'
              )}
            </button>
          </div>
        </form>

        <div className="mt-6 border-t border-gray-100 pt-6">
          <div className="flex items-center justify-center text-sm text-gray-500 space-x-2">
            <ShieldAlert className="h-4 w-4 text-gray-400" />
            <span>Authorized Government Officials Only</span>
          </div>
        </div>
      </div>
    </div>
  );
};