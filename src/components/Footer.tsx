import React from 'react';
import { 
  Phone, 
  Mail, 
  MapPin, 
  Clock, 
  MessageSquare, 
  ShieldCheck, 
  ChevronRight, 
  FileText, 
  Award,
  HeartHandshake,
  ArrowUp,
  ExternalLink,
  Facebook,
  Instagram,
  Linkedin,
  Twitter
} from 'lucide-react';
import { PageType } from '../types';
import { useData } from '../context/DataContext';

interface FooterProps {
  onNavigate: (page: PageType, param?: string) => void;
  onOpenWhatsApp: () => void;
}

export const Footer: React.FC<FooterProps> = ({ onNavigate, onOpenWhatsApp }) => {
  const { labInfo, footerConfig, customPages, siteImages } = useData();

  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const logoSrc = labInfo?.brandLogoUrl || siteImages?.brandLogoUrl;
  const whatsappClean = (labInfo?.whatsappNumber || '+919876543210').replace(/[^0-9]/g, '');

  const customFooterPages = (customPages || []).filter(p => p.isPublished && p.showInFooter);

  return (
    <footer className="bg-slate-950 text-slate-300 pt-16 pb-0 border-t border-slate-800">
      
      {/* Top Banner / Accreditation Note */}
      {footerConfig?.showAccreditationBanner !== false && (
        <div className="max-w-7xl mx-auto px-4 sm:px-6 mb-12">
          <div className="bg-gradient-to-r from-blue-950/80 via-slate-900 to-teal-950/80 p-6 rounded-2xl border border-slate-800 flex flex-col md:flex-row items-center justify-between gap-6">
            <div className="flex items-center gap-4">
              <div className="w-12 h-12 rounded-xl bg-teal-500/10 border border-teal-500/30 flex items-center justify-center text-teal-400 shrink-0">
                <ShieldCheck className="w-6 h-6" />
              </div>
              <div>
                <h4 className="text-white font-semibold text-base sm:text-lg">
                  {footerConfig?.accreditationHeadline || 'Committed to Clinical Precision & Patient Safety'}
                </h4>
                <p className="text-xs sm:text-sm text-slate-400 mt-0.5">
                  {footerConfig?.accreditationSubtext || 'Standardized diagnostic protocols, barcoded sample tracking, automated analyzers, and internal quality controls.'}
                </p>
              </div>
            </div>

            <div className="flex flex-wrap items-center gap-3 shrink-0">
              <button
                onClick={() => onNavigate('home-collection')}
                className="px-4 py-2.5 bg-teal-600 hover:bg-teal-500 text-white rounded-xl text-xs font-semibold transition-all cursor-pointer"
              >
                Book Home Collection
              </button>
              <button
                onClick={() => onNavigate('reports')}
                className="px-4 py-2.5 bg-slate-800 hover:bg-slate-700 text-white border border-slate-700 rounded-xl text-xs font-semibold transition-all cursor-pointer"
              >
                Download Report
              </button>
            </div>
          </div>
        </div>
      )}

      <div className="max-w-7xl mx-auto px-4 sm:px-6">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-10 lg:gap-8 pb-12 border-b border-slate-800/80">
          
          {/* Col 1: Brand & Overview */}
          <div className="space-y-4">
            <div className="flex items-center gap-3">
              {logoSrc ? (
                <img
                  src={logoSrc}
                  alt={labInfo?.tradeName || 'Microcells'}
                  className="h-10 w-auto max-w-[130px] object-contain rounded-lg bg-white/10 p-1"
                />
              ) : (
                <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-blue-600 to-teal-500 flex items-center justify-center text-white shadow-md">
                  <svg className="w-6 h-6 text-white" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                    <path d="M10 2v7.31M14 9.3V1.99M8.5 2h7M14 9.3a6.5 6.5 0 1 1-4 0M5.52 16h12.96" />
                  </svg>
                </div>
              )}
              <div>
                <span className="text-lg font-bold text-white tracking-tight">
                  {labInfo?.tradeName || 'Microcells Diagnostics'}
                </span>
                <span className="block text-[11px] text-teal-400 font-medium tracking-wider uppercase">
                  Pvt. Ltd.
                </span>
              </div>
            </div>

            <p className="text-xs text-slate-400 leading-relaxed">
              {footerConfig?.aboutText || 'Microcells Diagnostics Pvt. Ltd. is a dedicated diagnostic and pathology testing laboratory offering reliable results, advanced technology, standardized processes, and patient-focused care.'}
            </p>

            <div className="pt-2 space-y-2">
              <div className="flex items-center gap-2 text-xs text-slate-300">
                <Award className="w-4 h-4 text-teal-400 shrink-0" />
                <span>{labInfo?.nablAccreditationText || 'Standardized Clinical Laboratory Protocols'}</span>
              </div>
              <div className="flex items-center gap-2 text-xs text-slate-300">
                <HeartHandshake className="w-4 h-4 text-teal-400 shrink-0" />
                <span>{labInfo?.isoAccreditationText || 'Patient-Centric Transparent Reporting'}</span>
              </div>
            </div>
          </div>

          {/* Col 2: Quick Links */}
          {footerConfig?.showQuickLinks !== false && (
            <div>
              <h3 className="text-sm font-bold text-white uppercase tracking-wider mb-4 flex items-center gap-2">
                <span className="w-2 h-2 rounded-full bg-teal-400"></span>
                Quick Links
              </h3>
              <ul className="space-y-2.5 text-xs text-slate-400">
                <li>
                  <button onClick={() => onNavigate('about')} className="hover:text-teal-400 transition-colors flex items-center gap-1.5 cursor-pointer">
                    <ChevronRight className="w-3.5 h-3.5 text-slate-600" />
                    <span>About {labInfo?.tradeName || 'Microcells'}</span>
                  </button>
                </li>
                <li>
                  <button onClick={() => onNavigate('services')} className="hover:text-teal-400 transition-colors flex items-center gap-1.5 cursor-pointer">
                    <ChevronRight className="w-3.5 h-3.5 text-slate-600" />
                    <span>Our Diagnostic Services</span>
                  </button>
                </li>
                <li>
                  <button onClick={() => onNavigate('tests')} className="hover:text-teal-400 transition-colors flex items-center gap-1.5 cursor-pointer">
                    <ChevronRight className="w-3.5 h-3.5 text-slate-600" />
                    <span>Search All Tests</span>
                  </button>
                </li>
                <li>
                  <button onClick={() => onNavigate('packages')} className="hover:text-teal-400 transition-colors flex items-center gap-1.5 cursor-pointer">
                    <ChevronRight className="w-3.5 h-3.5 text-slate-600" />
                    <span>Preventive Health Packages</span>
                  </button>
                </li>
                <li>
                  <button onClick={() => onNavigate('home-collection')} className="hover:text-teal-400 transition-colors flex items-center gap-1.5 cursor-pointer">
                    <ChevronRight className="w-3.5 h-3.5 text-slate-600" />
                    <span>Home Sample Collection</span>
                  </button>
                </li>
                <li>
                  <button onClick={() => onNavigate('why-choose-us')} className="hover:text-teal-400 transition-colors flex items-center gap-1.5 cursor-pointer">
                    <ChevronRight className="w-3.5 h-3.5 text-slate-600" />
                    <span>Why Choose Us</span>
                  </button>
                </li>
                <li>
                  <button onClick={() => onNavigate('blog')} className="hover:text-teal-400 transition-colors flex items-center gap-1.5 cursor-pointer">
                    <ChevronRight className="w-3.5 h-3.5 text-slate-600" />
                    <span>Health Articles & Blog</span>
                  </button>
                </li>
                <li>
                  <button onClick={() => onNavigate('admin')} className="hover:text-teal-400 text-teal-400/90 font-medium transition-colors flex items-center gap-1.5 cursor-pointer">
                    <ChevronRight className="w-3.5 h-3.5 text-teal-500" />
                    <span>Staff / Admin Portal</span>
                  </button>
                </li>
                <li>
                  <a 
                    href="https://emidas.co.in:8890/pages/Login.aspx" 
                    target="_blank" 
                    rel="noopener noreferrer" 
                    className="hover:text-sky-300 text-sky-400 font-medium transition-colors flex items-center gap-1.5"
                  >
                    <ChevronRight className="w-3.5 h-3.5 text-sky-400" />
                    <span>LIS Portal (EMIDAS Online)</span>
                  </a>
                </li>
              </ul>
            </div>
          )}

          {/* Col 3: Patient Services & Custom CMS Pages */}
          <div>
            <h3 className="text-sm font-bold text-white uppercase tracking-wider mb-4 flex items-center gap-2">
              <span className="w-2 h-2 rounded-full bg-teal-400"></span>
              Patient Services
            </h3>
            <ul className="space-y-2.5 text-xs text-slate-400">
              <li>
                <button onClick={() => onNavigate('book-test')} className="hover:text-teal-400 transition-colors flex items-center gap-1.5 cursor-pointer">
                  <ChevronRight className="w-3.5 h-3.5 text-slate-600" />
                  <span>Book a Test Appointment</span>
                </button>
              </li>
              <li>
                <button onClick={() => onNavigate('home-collection')} className="hover:text-teal-400 transition-colors flex items-center gap-1.5 cursor-pointer">
                  <ChevronRight className="w-3.5 h-3.5 text-slate-600" />
                  <span>Doorstep Blood Collection</span>
                </button>
              </li>
              <li>
                <button onClick={() => onNavigate('reports')} className="hover:text-teal-400 transition-colors flex items-center gap-1.5 cursor-pointer">
                  <ChevronRight className="w-3.5 h-3.5 text-slate-600" />
                  <span>Online Report Download Portal</span>
                </button>
              </li>
              <li>
                <button onClick={() => onNavigate('faq')} className="hover:text-teal-400 transition-colors flex items-center gap-1.5 cursor-pointer">
                  <ChevronRight className="w-3.5 h-3.5 text-slate-600" />
                  <span>Patient FAQs & Test Prep</span>
                </button>
              </li>
              <li>
                <button onClick={onOpenWhatsApp} className="hover:text-teal-400 transition-colors flex items-center gap-1.5 text-emerald-400 cursor-pointer">
                  <ChevronRight className="w-3.5 h-3.5 text-slate-600" />
                  <span>WhatsApp Test Inquiries</span>
                </button>
              </li>
              <li>
                <button onClick={() => onNavigate('contact')} className="hover:text-teal-400 transition-colors flex items-center gap-1.5 cursor-pointer">
                  <ChevronRight className="w-3.5 h-3.5 text-slate-600" />
                  <span>Lab Branches & Contact Info</span>
                </button>
              </li>

              {/* Dynamic Custom CMS Pages in Footer */}
              {customFooterPages.map(page => (
                <li key={page.id}>
                  <button onClick={() => onNavigate('custom-page', page.slug)} className="hover:text-teal-400 text-teal-300/90 transition-colors flex items-center gap-1.5 cursor-pointer">
                    <ChevronRight className="w-3.5 h-3.5 text-teal-500" />
                    <span>{page.title}</span>
                  </button>
                </li>
              ))}
            </ul>
          </div>

          {/* Col 4: Laboratory Contact & Timings */}
          {footerConfig?.showContactInfo !== false && (
            <div className="space-y-3.5 text-xs text-slate-400">
              <h3 className="text-sm font-bold text-white uppercase tracking-wider mb-4 flex items-center gap-2">
                <span className="w-2 h-2 rounded-full bg-teal-400"></span>
                Central Laboratory
              </h3>

              <div className="flex items-start gap-2.5">
                <MapPin className="w-4 h-4 text-teal-400 shrink-0 mt-0.5" />
                <span>{labInfo?.address || 'Plot 104, Medical Hub & Diagnostic Centre, Healthcare Avenue'}</span>
              </div>

              <div className="flex items-center gap-2.5">
                <Phone className="w-4 h-4 text-teal-400 shrink-0" />
                <div>
                  <a href={`tel:${(labInfo?.phone || '+91 98765 43210').replace(/[^0-9+]/g, '')}`} className="text-white hover:text-teal-400 font-medium">
                    {labInfo?.phone || '+91 98765 43210'}
                  </a>
                  <span className="text-slate-500 block text-[11px]">Central Helpline</span>
                </div>
              </div>

              <div className="flex items-center gap-2.5">
                <MessageSquare className="w-4 h-4 text-emerald-400 shrink-0" />
                <div>
                  <button onClick={onOpenWhatsApp} className="text-emerald-400 hover:underline font-medium cursor-pointer">
                    {labInfo?.whatsappDisplay || '+91 98765 43210'}
                  </button>
                  <span className="text-slate-500 block text-[11px]">Instant WhatsApp Assistance</span>
                </div>
              </div>

              <div className="flex items-center gap-2.5">
                <Mail className="w-4 h-4 text-teal-400 shrink-0" />
                <a href={`mailto:${labInfo?.email || 'contact@microcellsdiagnostics.com'}`} className="text-slate-300 hover:text-teal-400">
                  {labInfo?.email || 'contact@microcellsdiagnostics.com'}
                </a>
              </div>

              <div className="flex items-start gap-2.5 pt-1">
                <Clock className="w-4 h-4 text-teal-400 shrink-0 mt-0.5" />
                <div>
                  <span className="text-white font-medium">Operating Hours:</span>
                  <span className="block text-slate-400 mt-0.5">{labInfo?.timings || 'Mon - Sat: 7:00 AM – 9:00 PM'}</span>
                </div>
              </div>
            </div>
          )}

        </div>

        {/* Medical & Regulatory Disclaimer Note */}
        <div className="py-6 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 text-[11px] text-slate-500 leading-relaxed border-t border-slate-900">
          <p className="flex-1">
            <strong className="text-slate-400">Medical Disclaimer:</strong> {footerConfig?.medicalDisclaimer || 'Diagnostic test results and health content on this website are intended solely for medical screening, educational awareness, and diagnostic evaluation under the supervision of registered medical practitioners. Laboratory reports must be clinically correlated with patient history and physical findings by a qualified physician.'}
          </p>
          <button 
            onClick={scrollToTop}
            className="p-2 rounded-xl bg-slate-900 hover:bg-slate-800 text-slate-400 hover:text-teal-400 border border-slate-800 transition-all cursor-pointer shrink-0 flex items-center gap-1.5 text-xs"
            title="Back to Top"
          >
            <ArrowUp className="w-3.5 h-3.5" />
            <span>Top</span>
          </button>
        </div>

      </div>

      {/* ERA-LIMS / E-MIDAS Bottom Section matching design specification */}
      <div className="w-full bg-[#1d6088] text-white border-t border-[#175073]">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 py-4 sm:py-4.5">
          {/* Top Line: Navigation Links */}
          <div className="flex flex-wrap items-center gap-6 sm:gap-9 text-xs sm:text-[13.5px] font-normal text-white mb-2 sm:mb-2.5">
            <button 
              onClick={() => onNavigate('about')} 
              className="hover:text-cyan-200 transition-colors cursor-pointer text-left"
            >
              About Us
            </button>
            <button 
              onClick={() => onNavigate('custom-page', 'privacy-policy')} 
              className="hover:text-cyan-200 transition-colors cursor-pointer text-left"
            >
              Privacy Policy
            </button>
            <button 
              onClick={() => onNavigate('contact')} 
              className="hover:text-cyan-200 transition-colors cursor-pointer text-left"
            >
              Contact Us
            </button>
            <button 
              onClick={() => onNavigate('custom-page', 'refund-policy')} 
              className="hover:text-cyan-200 transition-colors cursor-pointer text-left"
            >
              Refund Policy
            </button>
          </div>

          {/* Bottom Line: Copyright & Attribution + Social Media Icons */}
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 text-xs sm:text-[13px] text-white">
            <div className="font-normal text-white/95">
              {footerConfig?.copyrightText && footerConfig.copyrightText.includes('ERA-LIMS') 
                ? footerConfig.copyrightText 
                : 'ERA-LIMS Copyright © 2026. All rights reserved. || Powered by: E-MIDAS INFOSYSTEM PVT.LTD.'}
            </div>

            <div className="flex items-center gap-3.5 sm:gap-4 text-white">
              <a 
                href={labInfo?.facebookUrl || "https://facebook.com"} 
                target="_blank" 
                rel="noopener noreferrer" 
                className="text-white hover:text-cyan-200 hover:scale-110 transition-transform p-0.5"
                title="Facebook"
                aria-label="Facebook"
              >
                <Facebook className="w-4 h-4 fill-current" />
              </a>
              <a 
                href={labInfo?.instagramUrl || "https://instagram.com"} 
                target="_blank" 
                rel="noopener noreferrer" 
                className="text-white hover:text-cyan-200 hover:scale-110 transition-transform p-0.5"
                title="Instagram"
                aria-label="Instagram"
              >
                <Instagram className="w-4 h-4" />
              </a>
              <a 
                href={labInfo?.linkedinUrl || "https://linkedin.com"} 
                target="_blank" 
                rel="noopener noreferrer" 
                className="text-white hover:text-cyan-200 hover:scale-110 transition-transform p-0.5"
                title="LinkedIn"
                aria-label="LinkedIn"
              >
                <Linkedin className="w-4 h-4 fill-current" />
              </a>
              <a 
                href={labInfo?.twitterUrl || "https://twitter.com"} 
                target="_blank" 
                rel="noopener noreferrer" 
                className="text-white hover:text-cyan-200 hover:scale-110 transition-transform p-0.5"
                title="Twitter"
                aria-label="Twitter"
              >
                <Twitter className="w-4 h-4 fill-current" />
              </a>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
};
