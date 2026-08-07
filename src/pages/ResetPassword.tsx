import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { motion } from 'framer-motion';
import { toast } from 'sonner';
import { Lock, Eye, EyeOff, Loader2, KeyRound } from 'lucide-react';
import { ROUTES } from '@/constants/routes';
import { authService } from '@/services/authService';

const schema = z.object({
  password: z.string().min(8, "Password must be at least 8 characters"),
  confirmPassword: z.string()
}).refine((data) => data.password === data.confirmPassword, {
  message: "Passwords do not match",
  path: ["confirmPassword"],
});

type FormData = z.infer<typeof schema>;

export const ResetPassword: React.FC = () => {
  const navigate = useNavigate();
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  
  const { register, handleSubmit, watch, formState: { errors, isSubmitting } } = useForm<FormData>({
    resolver: zodResolver(schema)
  });

  const watchPassword = watch("password", "");

  const calculateStrength = (pwd: string) => {
    let strength = 0;
    if (pwd.length >= 8) strength += 25;
    if (pwd.match(/[a-z]/)) strength += 25;
    if (pwd.match(/[A-Z]/)) strength += 25;
    if (pwd.match(/[0-9!@#$%^&*]/)) strength += 25;
    return strength;
  };

  const strength = calculateStrength(watchPassword);
  const strengthColor = strength < 50 ? 'bg-red-500' : strength < 100 ? 'bg-yellow-500' : 'bg-[#1E8E3E]';
  const strengthLabel = strength < 50 ? 'Weak' : strength < 100 ? 'Good' : 'Strong';

  const onSubmit = async (data: FormData) => {
    try {
      await authService.resetPassword(data.password);
      toast.success('Password Reset Successful', { description: 'You can now login with your new password.' });
      navigate(ROUTES.LOGIN);
    } catch (error) {
      toast.error('Failed to reset password');
    }
  };

  return (
    <div className="min-h-screen w-full flex items-center justify-center bg-[#F8FAFC] font-['Inter'] p-6 relative overflow-hidden">
      <div className="absolute top-0 left-0 w-full h-full overflow-hidden pointer-events-none z-0">
        <div className="absolute top-[-10%] left-[-10%] w-[500px] h-[500px] bg-[#00A8A8]/5 rounded-full blur-[100px]"></div>
      </div>

      <motion.div 
        initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}
        className="w-full max-w-md bg-white border border-[#E2E8F0] p-8 md:p-10 rounded-2xl shadow-xl relative z-10"
      >
        <div className="w-14 h-14 bg-[#0B2E59]/5 border border-[#0B2E59]/10 rounded-xl flex items-center justify-center mb-6">
          <KeyRound className="w-7 h-7 text-[#0B2E59]" />
        </div>
        <h2 className="font-['Poppins'] text-2xl font-bold text-[#0F172A] mb-2">Create New Password</h2>
        <p className="text-[#64748B] text-sm mb-8 leading-relaxed">
          Your new password must be at least 8 characters long and contain a mix of uppercase, lowercase, numbers, and symbols.
        </p>

        <form onSubmit={handleSubmit(onSubmit)} className="space-y-5">
          <div className="space-y-1.5">
            <label className="block text-sm font-bold text-[#0F172A]">New Password</label>
            <div className="relative group">
              <Lock className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-400 group-focus-within:text-[#2F6BFF] transition-colors" />
              <input 
                type={showPassword ? 'text' : 'password'} placeholder="••••••••"
                className={`w-full pl-10 pr-12 py-3 bg-[#F8FAFC] border ${errors.password ? 'border-red-500' : 'border-[#E2E8F0]'} rounded-lg text-sm text-[#0F172A] focus:outline-none focus:border-[#2F6BFF] focus:ring-2 focus:ring-[#2F6BFF]/20 transition-all`}
                {...register('password')}
              />
              <button type="button" onClick={() => setShowPassword(!showPassword)} className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-[#0F172A]">
                {showPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
              </button>
            </div>
            {errors.password && <p className="text-red-600 text-xs font-semibold mt-1">{errors.password.message}</p>}
            
            {/* Password Strength Indicator */}
            {watchPassword.length > 0 && (
              <div className="pt-2">
                <div className="flex gap-1 mb-1.5 h-1.5">
                  <div className={`flex-1 rounded-full ${strength >= 25 ? strengthColor : 'bg-[#E2E8F0] transition-colors duration-300'}`}></div>
                  <div className={`flex-1 rounded-full ${strength >= 50 ? strengthColor : 'bg-[#E2E8F0] transition-colors duration-300'}`}></div>
                  <div className={`flex-1 rounded-full ${strength >= 75 ? strengthColor : 'bg-[#E2E8F0] transition-colors duration-300'}`}></div>
                  <div className={`flex-1 rounded-full ${strength >= 100 ? strengthColor : 'bg-[#E2E8F0] transition-colors duration-300'}`}></div>
                </div>
                <div className="text-[10px] font-bold text-[#64748B] text-right uppercase tracking-wider">{strengthLabel} Password</div>
              </div>
            )}
          </div>

          <div className="space-y-1.5 pt-2">
            <label className="block text-sm font-bold text-[#0F172A]">Confirm Password</label>
            <div className="relative group">
              <Lock className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-400 group-focus-within:text-[#2F6BFF] transition-colors" />
              <input 
                type={showConfirmPassword ? 'text' : 'password'} placeholder="••••••••"
                className={`w-full pl-10 pr-12 py-3 bg-[#F8FAFC] border ${errors.confirmPassword ? 'border-red-500' : 'border-[#E2E8F0]'} rounded-lg text-sm text-[#0F172A] focus:outline-none focus:border-[#2F6BFF] focus:ring-2 focus:ring-[#2F6BFF]/20 transition-all`}
                {...register('confirmPassword')}
              />
              <button type="button" onClick={() => setShowConfirmPassword(!showConfirmPassword)} className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-[#0F172A]">
                {showConfirmPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
              </button>
            </div>
            {errors.confirmPassword && <p className="text-red-600 text-xs font-semibold mt-1">{errors.confirmPassword.message}</p>}
          </div>

          <div className="pt-6">
            <motion.button 
              whileTap={{ scale: isSubmitting ? 1 : 0.98 }} disabled={isSubmitting} type="submit"
              className="w-full flex items-center justify-center gap-2 bg-[#0B2E59] hover:bg-[#082244] text-white py-3 rounded-lg font-bold shadow-md transition-colors disabled:opacity-70"
            >
              {isSubmitting ? <Loader2 className="w-5 h-5 animate-spin" /> : null}
              {isSubmitting ? 'Updating...' : 'Update Password'}
            </motion.button>
          </div>
        </form>
      </motion.div>
    </div>
  );
};