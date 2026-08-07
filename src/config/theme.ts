// src/config/theme.ts

export const BRAND_COLORS = {
  primaryNavy: '#0B2E59',   // Headings, Nav, Primary Buttons
  accentOrange: '#F57C00',  // Highlights, Badges, Active States, Secondary CTA
  accentGreen: '#2E7D32',   // Success states, Positive Metrics, Verification icons
  background: '#FFFFFF',    // Pure White primary background
  surface: '#F8FAFC',       // Subtle card/surface backgrounds
  border: '#E2E8F0',        // Light gray clean borders
  textMain: '#0F172A',      // Near black for maximum readability
  textMuted: '#64748B',     // Secondary gray text
} as const;

export const THEME_CLASSES = {
  bgApp: 'bg-[#FFFFFF] text-[#0F172A]',
  bgSurface: 'bg-[#F8FAFC]',
  card: 'bg-[#FFFFFF] border border-[#E2E8F0] shadow-sm hover:shadow-md transition-all duration-200',
  buttonPrimary: 'bg-[#0B2E59] text-[#FFFFFF] hover:bg-[#082244] focus:ring-2 focus:ring-[#F57C00]',
  buttonSecondary: 'bg-[#FFFFFF] text-[#0B2E59] border border-[#0B2E59] hover:bg-[#FFF3E0] hover:text-[#F57C00]',
  accentOrangeText: 'text-[#F57C00]',
  accentGreenText: 'text-[#2E7D32]',
  navyText: 'text-[#0B2E59]',
};