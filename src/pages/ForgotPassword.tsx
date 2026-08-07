import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { Mail, ArrowLeft, Loader2, CheckCircle2, ShieldAlert } from 'lucide-react';
import { ROUTES } from '@/constants/routes';
import { authService } from '@/services/authService';

const schema = z.object({
  email: z.string().min(1, "Email is required").email("Please enter a valid government email address")
});

type FormData = z.infer<typeof schema>;

export const ForgotPassword: React.FC = () => {
  const [isSuccess, setIsSuccess] = useState(false);
  
  const { register, handleSubmit, formState: { errors, isSubmitting } } = useForm<FormData>({
    resolver: zodResolver(schema)
  });

  useEffect(() => {
    document.getElementById('email')?.focus();
  }, []);

  const onSubmit = async (data: FormData) => {
    try {
      await authService.forgotPassword(data.email);
      setIsSuccess(true);
    } catch (error) {
      // Handle potential network errors
    }
  };

  return (
    <div className="min-h-screen w-full flex items-center justify-center bg-[#F8FAFC] font-['Inter'] p-6 relative overflow-hidden">
      
      {/* Background Decorators */}
      <div className="absolute top-0 left-0 w-full h-full overflow-hidden pointer-events-none z-0">
        <div className="absolute top-[-10%] left-[-10%] w-[500px] h-[500px] bg-[#0B2E59]/5 rounded-full blur-[100px]"></div>
        <div className="absolute bottom-[-10%] right-[-10%] w-[500px] h-[500px] bg-[#2F6BFF]/5 rounded-full blur-[100px]"></div>
      </div>

      <motion.div 
        initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}
        className="w-full max-w-md bg-white border border-[#E2E8F0] p-8 md:p-10 rounded-2xl shadow-xl relative z-10"
      >
        <AnimatePresence mode="wait">
          {!isSuccess ? (
            <motion.div key="form" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0, scale: 0.95 }} transition={{ duration: 0.2 }}>
              <div className="w-14 h-14 bg-[#0B2E59]/5 border border-[#0B2E59]/10 rounded-xl flex items-center justify-center mb-6">
                <ShieldAlert className="w-7 h-7 text-[#0B2E59]" />
              </div>
              <h2 className="font-['Poppins'] text-2xl font-bold text-[#0F172A] mb-2">Reset Password</h2>
              <p className="text-[#64748B] text-sm mb-8 leading-relaxed">
                Enter your official government email address and we'll send you instructions to securely reset your password.
              </p>

              <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
                <div className="space-y-1.5">
                  <label htmlFor="email" className="block text-sm font-bold text-[#0F172A]">Email Address</label>
                  <div className="relative group">
                    <Mail className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-400 group-focus-within:text-[#2F6BFF] transition-colors" />
                    <input 
                      id="email" type="email" placeholder="name@gov.in"
                      className={`w-full pl-10 pr-4 py-3 bg-[#F8FAFC] border ${errors.email ? 'border-red-500' : 'border-[#E2E8F0]'} rounded-lg text-sm text-[#0F172A] focus:outline-none focus:border-[#2F6BFF] focus:ring-2 focus:ring-[#2F6BFF]/20 transition-all`}
                      {...register('email')}
                    />
                  </div>
                  {errors.email && <p className="text-red-600 text-xs font-semibold mt-1">{errors.email.message}</p>}
                </div>

                <div className="pt-2 space-y-4">
                  <motion.button 
                    whileTap={{ scale: isSubmitting ? 1 : 0.98 }} disabled={isSubmitting} type="submit"
                    className="w-full flex items-center justify-center gap-2 bg-[#0B2E59] hover:bg-[#082244] text-white py-3 rounded-lg font-bold shadow-md transition-colors disabled:opacity-70"
                  >
                    {isSubmitting ? <Loader2 className="w-5 h-5 animate-spin" /> : null}
                    {isSubmitting ? 'Sending Request...' : 'Send Reset Link'}
                  </motion.button>

                  <Link to={ROUTES.LOGIN} className="w-full flex items-center justify-center gap-2 text-sm font-bold text-[#64748B] hover:text-[#0B2E59] transition-colors py-2">
                    <ArrowLeft className="w-4 h-4" /> Back to Login
                  </Link>
                </div>
              </form>
            </motion.div>
          ) : (
            <motion.div key="success" initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }} className="text-center py-6">
              <div className="w-20 h-20 bg-green-50 border border-green-100 rounded-full flex items-center justify-center mx-auto mb-6">
                <CheckCircle2 className="w-10 h-10 text-[#1E8E3E]" />
              </div>
              <h2 className="font-['Poppins'] text-2xl font-bold text-[#0F172A] mb-3">Request Sent Successfully</h2>
              <p className="text-[#64748B] text-sm mb-8 leading-relaxed">
                Password reset instructions have been sent to your registered official email address. Please check your inbox.
              </p>
              <Link to={ROUTES.LOGIN} className="w-full flex items-center justify-center gap-2 bg-white border border-[#E2E8F0] hover:bg-[#F8FAFC] hover:border-[#0B2E59] text-[#0F172A] py-3 rounded-lg font-bold shadow-sm transition-all">
                Return to Login
              </Link>
            </motion.div>
          )}
        </AnimatePresence>
      </motion.div>
    </div>
  );
};