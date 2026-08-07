import React, { useEffect, useState, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { toast } from 'sonner';
import { 
  User, Shield, Sliders, Bell, Activity, LogOut, Camera, Trash2, 
  Eye, EyeOff, CheckCircle2, Loader2, Mail, Lock, KeyRound, MonitorSmartphone,
  Download, AlertTriangle, ArrowRight, ChevronRight, Check
} from 'lucide-react';

import { useSettingsStore } from '@/stores/useSettingsStore';
import { useAppStore } from '@/stores/useAppStore';
import { profileService, SessionActivity } from '@/services/profileService';
import { ROUTES } from '@/constants/routes';

// ============================================================================
// VALIDATION SCHEMAS
// ============================================================================

const profileSchema = z.object({
  fullName: z.string().min(2, 'Name is required'),
  designation: z.string().min(2, 'Designation is required'),
  phone: z.string().regex(/^\d{10}$/, 'Must be a valid 10-digit number'),
  officeAddress: z.string().min(5, 'Address is required'),
  bio: z.string().optional(),
});

const securitySchema = z.object({
  currentPassword: z.string().min(1, 'Current password is required'),
  newPassword: z.string()
    .min(8, 'Minimum 8 characters')
    .regex(/[A-Z]/, 'Must contain uppercase')
    .regex(/[a-z]/, 'Must contain lowercase')
    .regex(/[0-9]/, 'Must contain number')
    .regex(/[^A-Za-z0-9]/, 'Must contain special character'),
  confirmPassword: z.string()
}).refine(data => data.newPassword === data.confirmPassword, {
  message: "Passwords don't match",
  path: ['confirmPassword']
});

type TabType = 'profile' | 'account' | 'security' | 'preferences' | 'notifications' | 'activity';

// ============================================================================
// MAIN COMPONENT
// ============================================================================

export const Settings: React.FC = () => {
  const navigate = useNavigate();
  const { clearUser } = useAppStore();
  const { profile, preferences, notifications, setProfile, setPreference, setNotification } = useSettingsStore();
  
  const [activeTab, setActiveTab] = useState<TabType>('profile');
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    const fetchInitialData = async () => {
      if (!profile) {
        setIsLoading(true);
        const data = await profileService.getProfile();
        setProfile(data);
        setIsLoading(false);
      }
    };
    fetchInitialData();
  }, [profile, setProfile]);

  const handleLogout = () => {
    toast.success('Logged out securely');
    clearUser();
    navigate(ROUTES.LOGIN);
  };

  return (
    <div className="flex flex-col gap-6 lg:gap-8 pb-16 w-full min-w-0 font-['Inter']">
      
      {/* HEADER */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 bg-[#FFFFFF] p-5 rounded-xl border border-[#E2E8F0] shadow-sm shrink-0">
        <div>
          <div className="flex items-center gap-2 text-sm text-[#64748B] mb-1 font-medium">
            <span>JanaManthan</span>
            <ChevronRight className="w-4 h-4" />
            <span className="text-[#0B2E59] font-semibold">Settings</span>
          </div>
          <h1 className="text-2xl font-['Poppins'] font-bold text-[#0F172A]">Platform Settings</h1>
        </div>
        <button onClick={handleLogout} className="flex items-center justify-center gap-2 px-4 py-2 bg-red-50 text-red-600 hover:bg-red-100 border border-red-200 rounded-lg text-sm font-bold transition-colors focus:ring-2 focus:ring-[#F57C00]">
          <LogOut className="w-4 h-4" /> Secure Logout
        </button>
      </div>

      <div className="flex flex-col lg:flex-row gap-6 items-start">
        
        {/* SIDEBAR NAVIGATION */}
        <div className="w-full lg:w-64 shrink-0 bg-[#FFFFFF] rounded-xl border border-[#E2E8F0] shadow-sm p-3 sticky top-24">
          <nav className="flex flex-col gap-1">
            {[
              { id: 'profile', label: 'Profile Management', icon: User },
              { id: 'account', label: 'Account Information', icon: Shield },
              { id: 'security', label: 'Security & Access', icon: KeyRound },
              { id: 'preferences', label: 'Preferences', icon: Sliders },
              { id: 'notifications', label: 'Notifications', icon: Bell },
              { id: 'activity', label: 'Session Activity', icon: Activity },
            ].map((item) => (
              <button
                key={item.id}
                onClick={() => setActiveTab(item.id as TabType)}
                className={`flex items-center gap-3 px-4 py-3 rounded-lg text-sm font-semibold transition-all ${
                  activeTab === item.id 
                    ? 'bg-[#F57C00]/10 text-[#F57C00]' 
                    : 'text-[#64748B] hover:bg-[#F8FAFC] hover:text-[#0B2E59]'
                }`}
              >
                <item.icon className="w-4 h-4" /> {item.label}
              </button>
            ))}
          </nav>
        </div>

        {/* CONTENT AREA */}
        <div className="flex-1 w-full min-w-0 bg-[#FFFFFF] rounded-xl border border-[#E2E8F0] shadow-sm p-6 lg:p-8">
          {isLoading ? (
            <div className="flex flex-col items-center justify-center py-20 text-[#64748B]">
              <Loader2 className="w-8 h-8 animate-spin mb-4 text-[#F57C00]" />
              <p className="text-sm font-medium">Loading settings...</p>
            </div>
          ) : (
            <AnimatePresence mode="wait">
              <motion.div
                key={activeTab}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -10 }}
                transition={{ duration: 0.2 }}
              >
                {activeTab === 'profile' && <ProfileSection profile={profile} setProfile={setProfile} />}
                {activeTab === 'account' && <AccountSection profile={profile} />}
                {activeTab === 'security' && <SecuritySection />}
                {activeTab === 'preferences' && <PreferencesSection preferences={preferences} setPreference={setPreference} />}
                {activeTab === 'notifications' && <NotificationsSection notifications={notifications} setNotification={setNotification} />}
                {activeTab === 'activity' && <ActivitySection />}
              </motion.div>
            </AnimatePresence>
          )}
        </div>
      </div>
    </div>
  );
};

// ============================================================================
// 1. PROFILE SECTION
// ============================================================================

const ProfileSection = ({ profile, setProfile }: { profile: any, setProfile: any }) => {
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [isUploading, setIsUploading] = useState(false);
  
  const { register, handleSubmit, formState: { errors, isSubmitting } } = useForm({
    resolver: zodResolver(profileSchema),
    defaultValues: profile || {}
  });

  const onSubmit = async (data: any) => {
    try {
      await profileService.updateProfile(data);
      setProfile(data);
      toast.success('Profile updated successfully');
    } catch (e) {
      toast.error('Failed to update profile');
    }
  };

  const handleImageUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    if (file.size > 2 * 1024 * 1024) return toast.error('Image must be less than 2MB');
    
    setIsUploading(true);
    const reader = new FileReader();
    reader.onloadend = async () => {
      try {
        const { url } = await profileService.uploadProfileImage(reader.result as string);
        setProfile({ avatarUrl: url });
        toast.success('Profile image updated');
      } catch (err) {
        toast.error('Failed to upload image');
      } finally {
        setIsUploading(false);
      }
    };
    reader.readAsDataURL(file);
  };

  return (
    <div className="space-y-8">
      <div>
        <h2 className="text-xl font-['Poppins'] font-bold text-[#0F172A]">Profile Management</h2>
        <p className="text-sm text-[#64748B]">Update your official identity and contact details.</p>
      </div>

      <div className="flex flex-col sm:flex-row items-center gap-6 pb-8 border-b border-[#E2E8F0]">
        <div className="relative group">
          <div className="w-24 h-24 rounded-full bg-[#F8FAFC] border-4 border-[#FFFFFF] shadow-lg flex items-center justify-center overflow-hidden">
            {profile?.avatarUrl ? (
              <img src={profile.avatarUrl} alt="Profile" className="w-full h-full object-cover" />
            ) : (
              <User className="w-10 h-10 text-[#64748B]" />
            )}
            {isUploading && <div className="absolute inset-0 bg-white/60 flex items-center justify-center backdrop-blur-sm"><Loader2 className="w-6 h-6 animate-spin text-[#F57C00]" /></div>}
          </div>
          <input type="file" ref={fileInputRef} className="hidden" accept="image/*" onChange={handleImageUpload} />
        </div>
        <div className="text-center sm:text-left">
          <button onClick={() => fileInputRef.current?.click()} disabled={isUploading} className="px-4 py-2 bg-[#FFFFFF] border border-[#E2E8F0] text-[#0F172A] text-sm font-semibold rounded-lg shadow-sm hover:border-[#F57C00] hover:text-[#F57C00] transition-colors focus:ring-2 focus:ring-[#F57C00] mr-3">
            <Camera className="w-4 h-4 inline-block mr-2" /> Change Photo
          </button>
          <button onClick={() => setProfile({ avatarUrl: null })} className="px-4 py-2 text-red-600 text-sm font-semibold rounded-lg hover:bg-red-50 transition-colors focus:ring-2 focus:ring-red-500">
            Remove
          </button>
          <p className="text-xs text-[#64748B] mt-2">JPG, GIF or PNG. Max size of 2MB.</p>
        </div>
      </div>

      <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
        <div className="grid sm:grid-cols-2 gap-6">
          <div className="space-y-1.5">
            <label className="text-xs font-bold text-[#0F172A] uppercase tracking-wider">Full Name</label>
            <input type="text" {...register('fullName')} className="w-full bg-[#F8FAFC] border border-[#E2E8F0] rounded-lg px-4 py-2.5 text-sm focus:border-[#F57C00] focus:ring-1 focus:ring-[#F57C00] outline-none transition-colors" />
            {errors.fullName && <p className="text-red-500 text-xs mt-1">{(errors.fullName as any).message}</p>}
          </div>
          <div className="space-y-1.5">
            <label className="text-xs font-bold text-[#0F172A] uppercase tracking-wider">Designation</label>
            <input type="text" {...register('designation')} className="w-full bg-[#F8FAFC] border border-[#E2E8F0] rounded-lg px-4 py-2.5 text-sm focus:border-[#F57C00] focus:ring-1 focus:ring-[#F57C00] outline-none transition-colors" />
            {errors.designation && <p className="text-red-500 text-xs mt-1">{(errors.designation as any).message}</p>}
          </div>
          <div className="space-y-1.5">
            <label className="text-xs font-bold text-[#0F172A] uppercase tracking-wider">Official Email (Read Only)</label>
            <input type="text" value={profile?.email} disabled className="w-full bg-[#E2E8F0]/50 border border-[#E2E8F0] rounded-lg px-4 py-2.5 text-sm text-[#64748B] cursor-not-allowed outline-none" />
          </div>
          <div className="space-y-1.5">
            <label className="text-xs font-bold text-[#0F172A] uppercase tracking-wider">Phone Number</label>
            <input type="text" {...register('phone')} className="w-full bg-[#F8FAFC] border border-[#E2E8F0] rounded-lg px-4 py-2.5 text-sm focus:border-[#F57C00] focus:ring-1 focus:ring-[#F57C00] outline-none transition-colors" />
            {errors.phone && <p className="text-red-500 text-xs mt-1">{(errors.phone as any).message}</p>}
          </div>
          <div className="sm:col-span-2 space-y-1.5">
            <label className="text-xs font-bold text-[#0F172A] uppercase tracking-wider">Office Address</label>
            <input type="text" {...register('officeAddress')} className="w-full bg-[#F8FAFC] border border-[#E2E8F0] rounded-lg px-4 py-2.5 text-sm focus:border-[#F57C00] focus:ring-1 focus:ring-[#F57C00] outline-none transition-colors" />
            {errors.officeAddress && <p className="text-red-500 text-xs mt-1">{(errors.officeAddress as any).message}</p>}
          </div>
          <div className="sm:col-span-2 space-y-1.5">
            <label className="text-xs font-bold text-[#0F172A] uppercase tracking-wider">Professional Bio</label>
            <textarea {...register('bio')} rows={4} className="w-full bg-[#F8FAFC] border border-[#E2E8F0] rounded-lg px-4 py-2.5 text-sm focus:border-[#F57C00] focus:ring-1 focus:ring-[#F57C00] outline-none resize-none transition-colors" />
          </div>
        </div>
        <div className="flex justify-end gap-3 pt-4">
          <button type="button" className="px-6 py-2.5 bg-[#FFFFFF] border border-[#E2E8F0] text-[#0F172A] text-sm font-semibold rounded-lg hover:border-[#F57C00] hover:text-[#F57C00] transition-colors focus:ring-2 focus:ring-[#F57C00]">Cancel</button>
          <button type="submit" disabled={isSubmitting} className="flex items-center gap-2 px-6 py-2.5 bg-[#0B2E59] hover:bg-[#F57C00] text-[#FFFFFF] text-sm font-bold rounded-lg shadow-sm transition-colors disabled:opacity-70 focus:ring-2 focus:ring-[#F57C00] focus:ring-offset-2">
            {isSubmitting ? <Loader2 className="w-4 h-4 animate-spin" /> : <CheckCircle2 className="w-4 h-4" />} Save Changes
          </button>
        </div>
      </form>
    </div>
  );
};

// ============================================================================
// 2. ACCOUNT INFORMATION SECTION
// ============================================================================

const AccountSection = ({ profile }: { profile: any }) => (
  <div className="space-y-8">
    <div>
      <h2 className="text-xl font-['Poppins'] font-bold text-[#0F172A]">Account Information</h2>
      <p className="text-sm text-[#64748B]">System attributes linked to your government digital identity.</p>
    </div>
    <div className="grid sm:grid-cols-2 gap-x-8 gap-y-6">
      {[
        { label: 'Employee ID', value: 'GOV-44921-MEIT' },
        { label: 'Username', value: 'arvind_sharma_nodal' },
        { label: 'Role Level', value: 'Level 4 (National Nodal)' },
        { label: 'Department', value: profile?.department },
        { label: 'Organization', value: profile?.organization },
        { label: 'Jurisdiction State', value: 'National' },
        { label: 'Date of Joining System', value: '14 August 2023' },
        { label: 'Account Status', value: 'Active / Verified', isBadge: true },
      ].map((item, i) => (
        <div key={i} className="space-y-1 p-4 bg-[#F8FAFC] border border-[#E2E8F0] rounded-lg">
          <span className="text-[10px] font-bold text-[#64748B] uppercase tracking-wider block">{item.label}</span>
          {item.isBadge ? (
            <span className="inline-block px-2 py-1 bg-[#2E7D32]/10 text-[#2E7D32] text-xs font-bold uppercase rounded mt-1">
              {item.value}
            </span>
          ) : (
            <span className="text-sm font-semibold text-[#0F172A]">{item.value}</span>
          )}
        </div>
      ))}
    </div>
    <div className="p-4 bg-[#0B2E59]/5 border border-[#0B2E59]/20 rounded-lg flex items-start gap-3">
      <AlertTriangle className="w-5 h-5 text-[#0B2E59] shrink-0 mt-0.5" />
      <p className="text-xs text-[#0B2E59] leading-relaxed font-medium">
        To modify read-only attributes such as Department or Role Level, a formal request must be submitted through the NIC HRMS portal. Changes will sync to JanaManthan within 24 hours of approval.
      </p>
    </div>
  </div>
);

// ============================================================================
// 3. SECURITY SECTION (WITH OTP MODAL)
// ============================================================================

const SecuritySection = () => {
  const [showCurrent, setShowCurrent] = useState(false);
  const [showNew, setShowNew] = useState(false);
  const [isForgotOpen, setIsForgotOpen] = useState(false);

  const { register, handleSubmit, watch, reset, formState: { errors, isSubmitting } } = useForm({
    resolver: zodResolver(securitySchema)
  });

  const newPassword = watch('newPassword', '');

  const getStrength = (pwd: string) => {
    let score = 0;
    if (pwd.length >= 8) score++;
    if (/[A-Z]/.test(pwd)) score++;
    if (/[a-z]/.test(pwd)) score++;
    if (/[0-9]/.test(pwd)) score++;
    if (/[^A-Za-z0-9]/.test(pwd)) score++;
    return score;
  };
  const strength = getStrength(newPassword);

  const onUpdatePassword = async (data: any) => {
    try {
      await profileService.changePassword(data.currentPassword, data.newPassword);
      toast.success('Password updated successfully');
      reset();
    } catch (e: any) {
      toast.error(e.message || 'Failed to update password');
    }
  };

  return (
    <div className="space-y-8">
      <div>
        <h2 className="text-xl font-['Poppins'] font-bold text-[#0F172A]">Security & Access</h2>
        <p className="text-sm text-[#64748B]">Manage your password and authentication methods.</p>
      </div>

      <form onSubmit={handleSubmit(onUpdatePassword)} className="max-w-md space-y-6">
        <div className="space-y-1.5">
          <label className="text-xs font-bold text-[#0F172A] uppercase tracking-wider">Current Password</label>
          <div className="relative">
            <input type={showCurrent ? "text" : "password"} {...register('currentPassword')} className="w-full bg-[#F8FAFC] border border-[#E2E8F0] rounded-lg px-4 py-2.5 text-sm focus:border-[#F57C00] focus:ring-1 focus:ring-[#F57C00] outline-none pr-10 transition-colors" />
            <button type="button" onClick={() => setShowCurrent(!showCurrent)} className="absolute right-3 top-1/2 -translate-y-1/2 text-[#64748B] hover:text-[#F57C00] focus:outline-none"><Eye className="w-4 h-4" /></button>
          </div>
          {errors.currentPassword && <p className="text-red-500 text-xs">{(errors.currentPassword as any).message}</p>}
        </div>

        <div className="pt-4 border-t border-[#E2E8F0] space-y-1.5">
          <label className="text-xs font-bold text-[#0F172A] uppercase tracking-wider">New Password</label>
          <div className="relative">
            <input type={showNew ? "text" : "password"} {...register('newPassword')} className="w-full bg-[#F8FAFC] border border-[#E2E8F0] rounded-lg px-4 py-2.5 text-sm focus:border-[#F57C00] focus:ring-1 focus:ring-[#F57C00] outline-none pr-10 transition-colors" />
            <button type="button" onClick={() => setShowNew(!showNew)} className="absolute right-3 top-1/2 -translate-y-1/2 text-[#64748B] hover:text-[#F57C00] focus:outline-none">{showNew ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}</button>
          </div>
          {errors.newPassword && <p className="text-red-500 text-xs">{(errors.newPassword as any).message}</p>}
          
          {newPassword.length > 0 && (
            <div className="pt-2">
              <div className="flex gap-1 h-1.5 mb-1">
                {[1, 2, 3, 4, 5].map(i => (
                  <div key={i} className={`flex-1 rounded-full transition-colors ${i <= strength ? (strength < 3 ? 'bg-red-500' : strength < 5 ? 'bg-[#F57C00]' : 'bg-[#2E7D32]') : 'bg-[#E2E8F0]'}`} />
                ))}
              </div>
              <p className="text-[10px] font-bold text-[#64748B] uppercase text-right">
                {strength < 3 ? 'Weak' : strength < 5 ? 'Good' : 'Strong'}
              </p>
            </div>
          )}
        </div>

        <div className="space-y-1.5">
          <label className="text-xs font-bold text-[#0F172A] uppercase tracking-wider">Confirm New Password</label>
          <input type="password" {...register('confirmPassword')} className="w-full bg-[#F8FAFC] border border-[#E2E8F0] rounded-lg px-4 py-2.5 text-sm focus:border-[#F57C00] focus:ring-1 focus:ring-[#F57C00] outline-none transition-colors" />
          {errors.confirmPassword && <p className="text-red-500 text-xs">{(errors.confirmPassword as any).message}</p>}
        </div>

        <div className="flex items-center justify-between pt-4">
          <button type="button" onClick={() => setIsForgotOpen(true)} className="text-sm font-bold text-[#0B2E59] hover:text-[#F57C00] hover:underline focus:outline-none">Forgot Password?</button>
          <button type="submit" disabled={isSubmitting} className="flex items-center gap-2 px-6 py-2.5 bg-[#0B2E59] hover:bg-[#F57C00] text-[#FFFFFF] text-sm font-bold rounded-lg shadow-sm transition-colors disabled:opacity-70 focus:ring-2 focus:ring-[#F57C00] focus:ring-offset-2">
            {isSubmitting ? <Loader2 className="w-4 h-4 animate-spin" /> : <Lock className="w-4 h-4" />} Update Password
          </button>
        </div>
      </form>
    </div>
  );
};

// ============================================================================
// 4. PREFERENCES SECTION
// ============================================================================

const PreferencesSection = ({ preferences, setPreference }: { preferences: any, setPreference: any }) => (
  <div className="space-y-8">
    <div>
      <h2 className="text-xl font-['Poppins'] font-bold text-[#0F172A]">Platform Preferences</h2>
      <p className="text-sm text-[#64748B]">Customize your JanaManthan dashboard experience.</p>
    </div>

    <div className="grid sm:grid-cols-2 gap-8 max-w-3xl">
      <div className="space-y-1.5">
        <label className="text-xs font-bold text-[#0F172A] uppercase tracking-wider">System Language</label>
        <select value={preferences.language} onChange={e => setPreference('language', e.target.value)} className="w-full bg-[#F8FAFC] border border-[#E2E8F0] rounded-lg px-4 py-2.5 text-sm outline-none focus:border-[#F57C00] focus:ring-1 focus:ring-[#F57C00] transition-colors">
          <option value="English">English</option>
          <option value="Hindi">Hindi (हिंदी)</option>
          <option value="Marathi">Marathi (मराठी)</option>
        </select>
      </div>

      <div className="space-y-1.5">
        <label className="text-xs font-bold text-[#0F172A] uppercase tracking-wider">UI Theme</label>
        <select value={preferences.theme} onChange={e => setPreference('theme', e.target.value)} className="w-full bg-[#F8FAFC] border border-[#E2E8F0] rounded-lg px-4 py-2.5 text-sm outline-none focus:border-[#F57C00] focus:ring-1 focus:ring-[#F57C00] transition-colors">
          <option value="Light">Light (Gov Standard)</option>
          <option value="Dark" disabled>Dark (Beta)</option>
          <option value="System" disabled>System Default</option>
        </select>
        <p className="text-[10px] text-[#64748B] mt-1">Dark theme is currently restricted by platform policy.</p>
      </div>

      <div className="space-y-1.5">
        <label className="text-xs font-bold text-[#0F172A] uppercase tracking-wider">Timezone</label>
        <select value={preferences.timezone} onChange={e => setPreference('timezone', e.target.value)} className="w-full bg-[#F8FAFC] border border-[#E2E8F0] rounded-lg px-4 py-2.5 text-sm outline-none focus:border-[#F57C00] focus:ring-1 focus:ring-[#F57C00] transition-colors">
          <option value="Asia/Kolkata">Asia/Kolkata (IST)</option>
        </select>
      </div>

      <div className="space-y-1.5">
        <label className="text-xs font-bold text-[#0F172A] uppercase tracking-wider">Default Dashboard Page</label>
        <select value={preferences.dashboardDefault} onChange={e => setPreference('dashboardDefault', e.target.value)} className="w-full bg-[#F8FAFC] border border-[#E2E8F0] rounded-lg px-4 py-2.5 text-sm outline-none focus:border-[#F57C00] focus:ring-1 focus:ring-[#F57C00] transition-colors">
          <option value="Analytics">Main Analytics</option>
          <option value="ManthanEngine">Manthan Engine Workspace</option>
          <option value="Heatmap">India Heatmap</option>
        </select>
      </div>
    </div>
  </div>
);

// ============================================================================
// 5. NOTIFICATIONS SECTION
// ============================================================================

const NotificationsSection = ({ notifications, setNotification }: { notifications: any, setNotification: any }) => {
  const toggles = [
    { key: 'email', label: 'Email Notifications', desc: 'Receive daily digests and critical alerts via official email.' },
    { key: 'browser', label: 'Browser Push Notifications', desc: 'Receive real-time toast notifications while logged in.' },
    { key: 'aiAnalysis', label: 'AI Analysis Completed', desc: 'Alert when a background dataset analysis finishes.' },
    { key: 'policyBrief', label: 'Policy Brief Generated', desc: 'Alert when the LLM successfully drafts a new policy.' },
    { key: 'criticalAlerts', label: 'Critical Systemic Alerts', desc: 'Immediate notification when grievance spikes cross 200%.' },
    { key: 'weeklySummary', label: 'Weekly Summary Report', desc: 'Every Monday at 9:00 AM IST.' },
    { key: 'monthlyReport', label: 'Monthly Executive Report', desc: 'Generated on the 1st of every month.' },
  ];

  return (
    <div className="space-y-8">
      <div>
        <h2 className="text-xl font-['Poppins'] font-bold text-[#0F172A]">Notification Settings</h2>
        <p className="text-sm text-[#64748B]">Control how and when JanaManthan alerts you.</p>
      </div>

      <div className="max-w-3xl divide-y divide-[#E2E8F0]">
        {toggles.map((t) => (
          <div key={t.key} className="flex items-center justify-between py-4">
            <div className="pr-4">
              <h4 className="text-sm font-bold text-[#0F172A]">{t.label}</h4>
              <p className="text-xs text-[#64748B] mt-0.5">{t.desc}</p>
            </div>
            <button
              onClick={() => setNotification(t.key, !notifications[t.key])}
              className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors shrink-0 focus:outline-none focus:ring-2 focus:ring-[#F57C00] focus:ring-offset-2 ${notifications[t.key] ? 'bg-[#F57C00]' : 'bg-[#E2E8F0]'}`}
            >
              <span className={`inline-block h-4 w-4 transform rounded-full bg-[#FFFFFF] transition-transform ${notifications[t.key] ? 'translate-x-6' : 'translate-x-1'}`} />
            </button>
          </div>
        ))}
      </div>
    </div>
  );
};

// ============================================================================
// 6. ACTIVITY & ACCOUNT ACTIONS SECTION
// ============================================================================

const ActivitySection = () => {
  const [sessions, setSessions] = useState<SessionActivity[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    profileService.getSessions().then(data => {
      setSessions(data);
      setLoading(false);
    });
  }, []);

  const handleLogoutOthers = async () => {
    const t = toast.loading('Terminating other sessions...');
    await profileService.logoutOtherSessions();
    setSessions(sessions.filter(s => s.isCurrent));
    toast.success('All other sessions terminated securely', { id: t });
  };

  const handleExport = async () => {
    const t = toast.loading('Preparing account data export...');
    await profileService.exportAccountData();
    toast.success('Account data exported as encrypted ZIP', { id: t });
  };

  const handleDelete = async () => {
    if (window.confirm('Are you absolutely sure? This will request account deletion from the NIC central server.')) {
      const t = toast.loading('Submitting deletion request...');
      await profileService.deleteAccount();
      toast.success('Deletion request submitted to IT Admin.', { id: t });
    }
  };

  return (
    <div className="space-y-10">
      <div>
        <h2 className="text-xl font-['Poppins'] font-bold text-[#0F172A]">Session Activity</h2>
        <p className="text-sm text-[#64748B]">Monitor active logins across devices.</p>
      </div>

      <div className="max-w-3xl space-y-4">
        {loading ? <div className="animate-pulse h-20 bg-[#F8FAFC] rounded-lg border border-[#E2E8F0]"></div> : sessions.map(s => (
          <div key={s.id} className={`flex items-start md:items-center justify-between p-4 border rounded-lg ${s.isCurrent ? 'border-[#0B2E59] bg-[#0B2E59]/5' : 'border-[#E2E8F0] bg-[#FFFFFF]'}`}>
            <div className="flex items-center gap-4">
              <div className={`p-3 rounded-full ${s.isCurrent ? 'bg-[#0B2E59]/10 text-[#0B2E59]' : 'bg-[#F8FAFC] text-[#64748B] border border-[#E2E8F0]'}`}>
                <MonitorSmartphone className="w-5 h-5" />
              </div>
              <div>
                <h4 className="text-sm font-bold text-[#0F172A] flex items-center gap-2">
                  {s.device} • {s.browser}
                  {s.isCurrent && <span className="px-2 py-0.5 bg-[#2E7D32] text-[#FFFFFF] text-[10px] uppercase font-bold rounded">Current</span>}
                </h4>
                <p className="text-xs text-[#64748B] mt-0.5">{s.ipAddress} • {s.location} • {s.time}</p>
              </div>
            </div>
          </div>
        ))}
        {sessions.length > 1 && (
          <div className="flex justify-end pt-2">
            <button onClick={handleLogoutOthers} className="text-sm font-bold text-[#F57C00] hover:bg-[#F57C00]/10 px-4 py-2 rounded-lg transition-colors focus:outline-none focus:ring-2 focus:ring-[#F57C00]">
              Log out of all other devices
            </button>
          </div>
        )}
      </div>

      <div className="pt-8 border-t border-[#E2E8F0]">
        <h2 className="text-xl font-['Poppins'] font-bold text-[#0F172A] mb-6">Account Actions</h2>
        <div className="flex flex-col sm:flex-row gap-4">
          <button onClick={handleExport} className="flex items-center justify-center gap-2 px-6 py-3 bg-[#FFFFFF] border border-[#E2E8F0] text-[#0F172A] text-sm font-bold rounded-lg shadow-sm hover:border-[#0B2E59] hover:text-[#0B2E59] transition-colors focus:outline-none focus:ring-2 focus:ring-[#0B2E59]">
            <Download className="w-4 h-4" /> Export Account Data
          </button>
          <button onClick={handleDelete} className="flex items-center justify-center gap-2 px-6 py-3 bg-[#FFFFFF] border border-red-200 text-red-600 text-sm font-bold rounded-lg shadow-sm hover:bg-red-50 hover:border-red-300 transition-colors focus:outline-none focus:ring-2 focus:ring-red-500">
            <Trash2 className="w-4 h-4" /> Request Account Deletion
          </button>
        </div>
      </div>
    </div>
  );
};