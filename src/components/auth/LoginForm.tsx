import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { Mail, Lock, Eye, EyeOff, AlertCircle, Loader2, LogIn } from 'lucide-react';
import { toast } from 'sonner';
import { ROUTES } from '@/constants/routes';

// Zod Validation Schema
const loginSchema = z.object({
  email: z.string().min(1, "Email address is required").email("Please enter a valid official email address"),
  password: z.string().min(8, "Password must be at least 8 characters long"),
  rememberMe: z.boolean().optional(),
});

type LoginFormValues = z.infer<typeof loginSchema>;

export const LoginForm: React.FC = () => {
  const navigate = useNavigate();
  const [showPassword, setShowPassword] = useState(false);
  const [serverError, setServerError] = useState<string | null>(null);
  
  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<LoginFormValues>({
    resolver: zodResolver(loginSchema),
    defaultValues: {
      email: '',
      password: '',
      rememberMe: false,
    },
  });

  const onSubmit = async (data: LoginFormValues) => {
    setServerError(null);
    
    try {
      // Simulate API Call for Authentication
      await new Promise((resolve, reject) => {
        setTimeout(() => {
          // Simulate random network/credential error for demonstration if needed, 
          // but we will resolve successfully to proceed to the dashboard.
          if (data.email === 'error@gov.in') {
            reject(new Error('Invalid officer credentials. Please try again or contact IT admin.'));
          } else {
            resolve(true);
          }
        }, 1500);
      });

      toast.success('Authentication Successful', {
        description: 'Redirecting to JanaManthan Dashboard...',
      });
      
      // Navigate to dashboard on success
      navigate(ROUTES.DASHBOARD);
      
    } catch (error: any) {
      setServerError(error.message || 'An unexpected network error occurred.');
      toast.error('Authentication Failed', {
        description: error.message,
      });
    }
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-5">
      {/* Server Error Banner */}
      {serverError && (
        <div className="bg-red-50 border border-red-200 text-red-600 px-4 py-3 rounded-lg flex items-start gap-3 text-sm animate-in fade-in zoom-in duration-300">
          <AlertCircle className="w-5 h-5 shrink-0 mt-0.5" />
          <p className="font-medium leading-relaxed">{serverError}</p>
        </div>
      )}

      {/* Email Field */}
      <div className="space-y-1.5">
        <label htmlFor="email" className="block text-sm font-semibold text-[#1E293B]">
          Official Email Address
        </label>
        <div className="relative">
          <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-[#64748B]">
            <Mail className="h-5 w-5" />
          </div>
          <input
            id="email"
            type="email"
            placeholder="officer@gov.in"
            className={`block w-full pl-10 pr-4 py-2.5 bg-white border ${
              errors.email ? 'border-red-500 focus:ring-red-500/20' : 'border-[#E2E8F0] focus:border-[#0B2E59] focus:ring-[#0B2E59]/20'
            } rounded-lg text-[#1E293B] placeholder:text-[#64748B] focus:outline-none focus:ring-4 transition-all duration-200`}
            aria-invalid={errors.email ? "true" : "false"}
            {...register('email')}
          />
        </div>
        {errors.email && (
          <p className="text-red-500 text-sm font-medium flex items-center gap-1 mt-1">
            <AlertCircle className="w-4 h-4" />
            {errors.email.message}
          </p>
        )}
      </div>

      {/* Password Field */}
      <div className="space-y-1.5">
        <label htmlFor="password" className="block text-sm font-semibold text-[#1E293B]">
          Password
        </label>
        <div className="relative">
          <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-[#64748B]">
            <Lock className="h-5 w-5" />
          </div>
          <input
            id="password"
            type={showPassword ? 'text' : 'password'}
            placeholder="••••••••"
            className={`block w-full pl-10 pr-12 py-2.5 bg-white border ${
              errors.password ? 'border-red-500 focus:ring-red-500/20' : 'border-[#E2E8F0] focus:border-[#0B2E59] focus:ring-[#0B2E59]/20'
            } rounded-lg text-[#1E293B] placeholder:text-[#64748B] focus:outline-none focus:ring-4 transition-all duration-200`}
            aria-invalid={errors.password ? "true" : "false"}
            {...register('password')}
          />
          <button
            type="button"
            onClick={() => setShowPassword(!showPassword)}
            className="absolute inset-y-0 right-0 pr-3 flex items-center text-[#64748B] hover:text-[#1E293B] transition-colors focus:outline-none focus:text-[#0B2E59]"
            aria-label={showPassword ? "Hide password" : "Show password"}
          >
            {showPassword ? <EyeOff className="h-5 w-5" /> : <Eye className="h-5 w-5" />}
          </button>
        </div>
        {errors.password && (
          <p className="text-red-500 text-sm font-medium flex items-center gap-1 mt-1">
            <AlertCircle className="w-4 h-4" />
            {errors.password.message}
          </p>
        )}
      </div>

      {/* Utilities: Remember Me & Forgot Password */}
      <div className="flex items-center justify-between pt-1">
        <label className="flex items-center gap-2 cursor-pointer group">
          <div className="relative flex items-center">
            <input
              type="checkbox"
              className="peer sr-only"
              {...register('rememberMe')}
            />
            <div className="w-4 h-4 rounded border border-[#E2E8F0] bg-white peer-checked:bg-[#0B2E59] peer-checked:border-[#0B2E59] peer-focus:ring-2 peer-focus:ring-[#0B2E59]/30 transition-all"></div>
            <svg className="absolute w-4 h-4 text-white pointer-events-none opacity-0 peer-checked:opacity-100 transition-opacity" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round">
              <polyline points="20 6 9 17 4 12"></polyline>
            </svg>
          </div>
          <span className="text-sm font-medium text-[#64748B] group-hover:text-[#1E293B] transition-colors">
            Remember my device
          </span>
        </label>
        
        <a href="#" className="text-sm font-semibold text-[#0B2E59] hover:text-[#F57C00] transition-colors focus:outline-none focus:underline">
          Forgot Password?
        </a>
      </div>

      {/* Submit Button */}
      <button
        type="submit"
        disabled={isSubmitting}
        className="w-full mt-6 bg-[#0B2E59] hover:bg-[#082244] text-white font-semibold py-3 px-4 rounded-lg shadow-lg hover:shadow-xl hover:-translate-y-0.5 transition-all duration-200 flex items-center justify-center gap-2 disabled:opacity-70 disabled:pointer-events-none disabled:transform-none"
      >
        {isSubmitting ? (
          <>
            <Loader2 className="w-5 h-5 animate-spin" />
            Authenticating...
          </>
        ) : (
          <>
            Sign In Securely
            <LogIn className="w-5 h-5" />
          </>
        )}
      </button>
    </form>
  );
};