// src/pages/Landing.tsx
import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  BrainCircuit, LayoutDashboard, BarChart3, Map as MapIcon, 
  Target, FileText, ArrowRight, Menu, X, Network, Search, 
  ShieldCheck, Activity, Lightbulb, UserCheck, CheckCircle2,
  Database, Layers
} from 'lucide-react';
import { ROUTES } from '@/constants/routes';

// ==========================================
// STATIC DATA & CONSTANTS
// ==========================================

const NAV_LINKS = [
  { label: 'Home', id: 'home' },
  { label: 'The Challenge', id: 'problem' },
  { label: 'Solution', id: 'solution' },
  { label: 'Features', id: 'features' },
];

const CHALLENGE_STEPS = [
  { title: "Citizen Complaint", icon: UserCheck },
  { title: "Resolved Individually", icon: CheckCircle2 },
  { title: "Recurring Issues Continue", icon: Activity },
  { title: "Hidden Root Causes", icon: Search },
  { title: "Policy Decisions Lack Insights", icon: Lightbulb }
];

const SOLUTION_STEPS = [
  { 
    title: "Data Ingestion & Aggregation", 
    desc: "Securely connects to existing CPGRAMS and state portals to aggregate unstructured grievance data at scale.", 
    icon: Database 
  },
  { 
    title: "AI-Powered Semantic Analysis", 
    desc: "NLP models cluster conceptual similarities, bypassing varied languages and terminology to find true patterns.", 
    icon: Network 
  },
  { 
    title: "Actionable Policy Generation", 
    desc: "Transforms detected root causes into data-backed policy briefs for immediate governmental intervention.", 
    icon: Layers 
  }
];

const FEATURES_DATA = [
  { title: "AI Complaint Analysis", desc: "Process thousands of unstructured complaints instantly.", icon: BrainCircuit },
  { title: "Semantic Clustering", desc: "Group conceptually similar grievances automatically.", icon: Network },
  { title: "Root Cause Detection", desc: "Identify systemic infrastructural failures.", icon: Target },
  { title: "India Heatmap", desc: "Visualize grievance density and regional patterns.", icon: MapIcon },
  { title: "Policy Brief Generation", desc: "Auto-generate evidence-based policy proposals.", icon: FileText },
  { title: "Interactive Analytics", desc: "Track resolution impact and monitor policy effectiveness.", icon: BarChart3 }
];

// ==========================================
// ANIMATION VARIANTS
// ==========================================

const fadeInUp = {
  hidden: { opacity: 0, y: 30 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.6, ease: "easeOut" } }
};

const staggerContainer = {
  hidden: { opacity: 0 },
  visible: { opacity: 1, transition: { staggerChildren: 0.15 } }
};

// ==========================================
// MODULAR COMPONENTS
// ==========================================

const Header: React.FC<{ isScrolled: boolean }> = ({ isScrolled }) => {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  const scrollToSection = (e: React.MouseEvent<HTMLAnchorElement>, id: string) => {
    e.preventDefault();
    setIsMobileMenuOpen(false);
    const element = document.getElementById(id);
    if (element) {
      const offset = 80;
      const elementPosition = element.getBoundingClientRect().top + window.scrollY;
      window.scrollTo({ top: elementPosition - offset, behavior: 'smooth' });
    }
  };

  return (
    <header className={`fixed top-0 w-full z-50 transition-all duration-300 border-b ${isScrolled ? 'bg-[#FFFFFF]/95 backdrop-blur-md border-[#E2E8F0] shadow-sm py-3' : 'bg-[#FFFFFF] border-transparent py-5'}`}>
      <div className="max-w-7xl mx-auto px-6 flex items-center justify-between">
        <Link to="/" className="flex items-center gap-3">
          <img src="/JanaManthan_logo.png" alt="JanaManthan Logo" className="h-10 w-auto object-contain" />
          <div>
            <h1 className="font-['Poppins'] font-bold text-xl tracking-tight text-[#0B2E59] leading-none">JanaManthan</h1>
            <span className="text-[10px] uppercase font-bold tracking-widest text-[#F57C00]">Gov Intelligence</span>
          </div>
        </Link>

        <nav className="hidden md:flex items-center gap-8 font-medium">
          {NAV_LINKS.map(link => (
            <a key={link.id} href={`#${link.id}`} onClick={(e) => scrollToSection(e, link.id)} className="text-[#64748B] hover:text-[#F57C00] transition-colors text-sm font-semibold">
              {link.label}
            </a>
          ))}
        </nav>

        <div className="hidden md:flex items-center gap-4">
          <Link to={ROUTES.LOGIN} className="px-6 py-2.5 rounded-xl font-semibold text-[#FFFFFF] bg-[#0B2E59] hover:bg-[#F57C00] shadow-sm transition-all flex items-center gap-2">
            Officer Login <ArrowRight className="w-4 h-4" />
          </Link>
        </div>

        <button 
          aria-label="Toggle Menu"
          className="md:hidden p-2 text-[#0F172A] hover:bg-[#F8FAFC] rounded-lg transition-colors" 
          onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
        >
          {isMobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
        </button>
      </div>

      <AnimatePresence>
        {isMobileMenuOpen && (
          <motion.div initial={{ opacity: 0, height: 0 }} animate={{ opacity: 1, height: 'auto' }} exit={{ opacity: 0, height: 0 }} className="md:hidden absolute top-full left-0 w-full bg-[#FFFFFF] border-b border-[#E2E8F0] shadow-lg overflow-hidden">
            <div className="flex flex-col p-6 gap-4">
              {NAV_LINKS.map(link => (
                <a key={link.id} href={`#${link.id}`} onClick={(e) => scrollToSection(e, link.id)} className="text-[#0F172A] font-semibold hover:text-[#F57C00]">
                  {link.label}
                </a>
              ))}
              <div className="pt-4 border-t border-[#E2E8F0]">
                <Link to={ROUTES.LOGIN} className="w-full flex justify-center items-center gap-2 py-3 rounded-xl font-semibold text-[#FFFFFF] bg-[#0B2E59]">
                  Officer Login <ArrowRight className="w-4 h-4" />
                </Link>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </header>
  );
};

const HeroSection: React.FC = () => {
  return (
    <section id="home" className="relative pt-36 pb-24 lg:pt-48 lg:pb-32 overflow-hidden bg-[#FFFFFF]">
      <div className="absolute top-0 right-0 w-[600px] h-[600px] bg-gradient-to-br from-[#F57C00]/5 to-[#2E7D32]/5 rounded-full blur-[100px] -z-10 pointer-events-none" />
      
      <div className="max-w-7xl mx-auto px-6 grid lg:grid-cols-2 gap-12 items-center">
        <motion.div initial="hidden" animate="visible" variants={staggerContainer} className="max-w-2xl">
          <motion.div variants={fadeInUp} className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-[#2E7D32]/10 border border-[#2E7D32]/20 text-[#2E7D32] text-xs font-bold uppercase tracking-wider mb-6">
            <ShieldCheck className="w-4 h-4" /> 
            Government Ready
          </motion.div>

          <motion.div variants={fadeInUp} className="mb-6">
            <img src="/JanaManthan_logo.png" alt="JanaManthan Logo" className="h-28 w-auto object-contain" />
          </motion.div>
          
          <motion.h1 variants={fadeInUp} className="font-['Poppins'] text-4xl md:text-5xl lg:text-6xl font-bold text-[#0B2E59] leading-[1.15] mb-6">
            AI-Powered Decision Intelligence for <span className="text-[#F57C00]">Government Grievance Analysis</span>
          </motion.h1>
          
          <motion.p variants={fadeInUp} className="text-lg text-[#64748B] leading-relaxed mb-8 max-w-xl">
            JanaManthan helps government departments identify recurring grievance patterns, uncover systemic root causes, and generate evidence-based policy recommendations using AI.
          </motion.p>
          
          <motion.div variants={fadeInUp} className="flex flex-col sm:flex-row gap-4">
            <a href="#features" className="px-8 py-4 rounded-xl font-bold text-[#FFFFFF] bg-[#0B2E59] hover:bg-[#F57C00] shadow-sm transition-all text-center">
              Explore Platform
            </a>
            <Link to={ROUTES.LOGIN} className="px-8 py-4 rounded-xl font-bold text-[#0B2E59] bg-[#FFFFFF] border border-[#0B2E59] hover:bg-[#FFF3E0] hover:text-[#F57C00] hover:border-[#F57C00] transition-all text-center">
              Officer Login
            </Link>
          </motion.div>
        </motion.div>

        <motion.div initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} transition={{ duration: 0.8 }} className="relative hidden lg:block">
          <div className="bg-[#FFFFFF] rounded-2xl border border-[#E2E8F0] shadow-xl p-6 flex flex-col gap-5">
            <div className="flex items-center gap-2 border-b border-[#E2E8F0] pb-4">
              <div className="w-3 h-3 rounded-full bg-[#E2E8F0]"></div>
              <div className="w-3 h-3 rounded-full bg-[#E2E8F0]"></div>
              <div className="w-3 h-3 rounded-full bg-[#E2E8F0]"></div>
              <div className="ml-4 h-4 w-36 bg-[#F8FAFC] rounded-full"></div>
            </div>
            <div className="grid grid-cols-3 gap-4">
              <div className="h-28 bg-[#F57C00]/10 border border-[#F57C00]/20 rounded-xl flex items-center justify-center"><Target className="w-8 h-8 text-[#F57C00]" /></div>
              <div className="h-28 bg-[#0B2E59]/10 border border-[#0B2E59]/20 rounded-xl flex items-center justify-center"><BarChart3 className="w-8 h-8 text-[#0B2E59]" /></div>
              <div className="h-28 bg-[#2E7D32]/10 border border-[#2E7D32]/20 rounded-xl flex items-center justify-center"><Activity className="w-8 h-8 text-[#2E7D32]" /></div>
            </div>
            <div className="h-32 bg-[#F8FAFC] border border-[#E2E8F0] rounded-xl flex items-end p-4 gap-2">
              {[40, 70, 55, 85, 60, 90, 75].map((h, i) => (
                <div key={i} className="flex-1 bg-[#0B2E59] rounded-t-lg transition-all duration-1000 ease-out" style={{ height: `${h}%` }}></div>
              ))}
            </div>
          </div>
        </motion.div>
      </div>
    </section>
  );
};

const ChallengeSection: React.FC = () => {
  return (
    <section id="problem" className="py-24 bg-[#F8FAFC] border-y border-[#E2E8F0]">
      <div className="max-w-7xl mx-auto px-6">
        <div className="text-center max-w-3xl mx-auto mb-16">
          <h2 className="font-['Poppins'] text-3xl md:text-4xl font-bold text-[#0B2E59] mb-4">The Challenge</h2>
          <p className="text-lg text-[#64748B]">Government grievance portals efficiently resolve complaints, but recurring systemic issues remain hidden when handled in isolation.</p>
        </div>

        <div className="grid md:grid-cols-5 gap-4">
          {CHALLENGE_STEPS.map((step, i) => (
            <div key={i} className="bg-[#FFFFFF] border border-[#E2E8F0] p-6 rounded-2xl shadow-sm text-center flex flex-col items-center hover:shadow-md transition-shadow">
              <div className="w-12 h-12 rounded-xl bg-[#0B2E59]/10 text-[#0B2E59] flex items-center justify-center mb-4">
                <step.icon className="w-6 h-6" />
              </div>
              <span className="font-bold text-sm text-[#0F172A]">{step.title}</span>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

const SolutionSection: React.FC = () => {
  return (
    <section id="solution" className="py-24 bg-[#FFFFFF]">
      <div className="max-w-7xl mx-auto px-6">
        <div className="text-center max-w-3xl mx-auto mb-16">
          <h2 className="font-['Poppins'] text-3xl md:text-4xl font-bold text-[#0B2E59] mb-4">The Solution</h2>
          <p className="text-lg text-[#64748B]">Transforming raw grievance data into actionable intelligence through an automated, three-step enterprise pipeline.</p>
        </div>

        <div className="grid md:grid-cols-3 gap-8">
          {SOLUTION_STEPS.map((step, i) => (
            <div key={i} className="flex flex-col items-center text-center">
              <div className="w-20 h-20 rounded-2xl bg-[#F57C00]/10 text-[#F57C00] flex items-center justify-center mb-6 border border-[#F57C00]/20">
                <step.icon className="w-10 h-10" />
              </div>
              <h3 className="font-['Poppins'] font-bold text-xl text-[#0B2E59] mb-3">{step.title}</h3>
              <p className="text-[#64748B] leading-relaxed">{step.desc}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

const FeaturesSection: React.FC = () => {
  return (
    <section id="features" className="py-24 bg-[#F8FAFC] border-y border-[#E2E8F0]">
      <div className="max-w-7xl mx-auto px-6">
        <div className="text-center mb-16 max-w-3xl mx-auto">
          <h2 className="font-['Poppins'] text-3xl md:text-4xl font-bold text-[#0B2E59] mb-4">Enterprise Features</h2>
          <p className="text-lg text-[#64748B]">Built specifically for the scale, security, and analytical requirements of national government operations.</p>
        </div>

        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
          {FEATURES_DATA.map((feature, i) => (
            <div key={i} className="bg-[#FFFFFF] border border-[#E2E8F0] p-8 rounded-2xl shadow-sm hover:shadow-md hover:border-[#F57C00] transition-all group">
              <div className="w-14 h-14 bg-[#F8FAFC] border border-[#E2E8F0] rounded-xl flex items-center justify-center mb-6 group-hover:bg-[#0B2E59] transition-colors">
                <feature.icon className="w-7 h-7 text-[#0B2E59] group-hover:text-white transition-colors" />
              </div>
              <h3 className="font-['Poppins'] font-bold text-[#0B2E59] text-xl mb-3">{feature.title}</h3>
              <p className="text-[#64748B] leading-relaxed">{feature.desc}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

const CTASection: React.FC = () => {
  return (
    <section className="py-24 bg-[#0B2E59] text-center px-6 relative overflow-hidden">
      {/* Decorative abstract elements */}
      <div className="absolute top-0 left-0 w-full h-full overflow-hidden opacity-10 pointer-events-none">
        <div className="absolute -top-24 -left-24 w-96 h-96 rounded-full bg-[#FFFFFF] blur-3xl"></div>
        <div className="absolute top-1/2 right-12 w-64 h-64 rounded-full bg-[#F57C00] blur-3xl"></div>
      </div>

      <div className="max-w-3xl mx-auto relative z-10">
        <h2 className="font-['Poppins'] text-3xl md:text-5xl font-bold text-[#FFFFFF] mb-6">Ready to Transform Government Grievance Analysis?</h2>
        <p className="text-lg text-[#E2E8F0] mb-10 max-w-2xl mx-auto">Access the intelligence required to convert scattered grievance data into meaningful, systemic policy interventions.</p>
        <div className="flex flex-col sm:flex-row justify-center gap-4">
          <Link to={ROUTES.LOGIN} className="px-8 py-4 rounded-xl font-bold text-[#0B2E59] bg-[#FFFFFF] hover:bg-[#F8FAFC] shadow-lg transition-all flex items-center justify-center gap-2">
            Proceed to Officer Login <ArrowRight className="w-5 h-5" />
          </Link>
        </div>
      </div>
    </section>
  );
};

const Footer: React.FC = () => {
  return (
    <footer className="bg-[#FFFFFF] pt-12 pb-8">
      <div className="max-w-7xl mx-auto px-6 flex flex-col md:flex-row justify-between items-center gap-6 text-sm text-[#64748B]">
        <div className="flex items-center gap-3">
          <img src="/JanaManthan_logo.png" alt="JanaManthan Logo" className="h-8 w-auto object-contain grayscale opacity-70" />
          <span className="font-bold text-[#0F172A]">JanaManthan</span>
        </div>
        <p>© {new Date().getFullYear()} JanaManthan. Government Decision Intelligence Platform.</p>
        <div className="flex items-center gap-2 font-bold text-[#2E7D32]">
          <ShieldCheck className="w-4 h-4" /> Enterprise Security Grade
        </div>
      </div>
    </footer>
  );
};

// ==========================================
// MAIN PAGE COMPONENT
// ==========================================

export const Landing: React.FC = () => {
  const [isScrolled, setIsScrolled] = useState(false);

  useEffect(() => {
    const handleScroll = () => setIsScrolled(window.scrollY > 20);
    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  return (
    <div className="min-h-screen bg-[#FFFFFF] font-['Inter'] text-[#0F172A] overflow-x-hidden selection:bg-[#F57C00]/20 scroll-smooth">
      <Header isScrolled={isScrolled} />
      <main>
        <HeroSection />
        <ChallengeSection />
        <SolutionSection />
        <FeaturesSection />
        <CTASection />
      </main>
      <Footer />
    </div>
  );
};