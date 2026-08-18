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
  ArrowUp
} from 'lucide-react';
import { PageType } from '../types';
import { LAB_INFO } from '../data/labData';

interface FooterProps {
  onNavigate: (page: PageType) => void;
  onOpenWhatsApp: () => void;
}

export const Footer: React.FC<FooterProps> = ({ onNavigate, onOpenWhatsApp }) => {
  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  return (
    <footer className="bg-slate-950 text-slate-300 pt-16 pb-8 border-t border-slate-800">
      {/* Top Banner / Accreditation Note */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 mb-12">
        <div className="bg-gradient-to-r from-blue-950/80 via-slate-900 to-teal-950/80 p-6 rounded-2xl border border-slate-800 flex flex-col md:flex-row items-center justify-between gap-6">
          <div className="flex items-center gap-4">
            <div className="w-12 h-12 rounded-xl bg-teal-500/10 border border-teal-500/30 flex items-center justify-center text-teal-400 shrink-0">
              <ShieldCheck className="w-6 h-6" />
            </div>
            <div>
              <h4 className="text-white font-semibold text-base sm:text-lg">
                Committed to Clinical Precision & Patient Safety
              </h4>
              <p className="text-xs sm:text-sm text-slate-400 mt-0.5">
                Standardized diagnostic protocols, barcoded sample tracking, and internal quality controls.
              </p>
            </div>
          </div>

          <div className="flex flex-wrap items-center gap-3 shrink-0">
            <button
              onClick={() => onNavigate('home-collection')}
              className="px-4 py-2.5 bg-teal-600 hover:bg-teal-500 text-white rounded-xl text-xs font-semibold transition-all"
            >
              Book Home Collection
            </button>
            <button
              onClick={() => onNavigate('reports')}
              className="px-4 py-2.5 bg-slate-800 hover:bg-slate-700 text-white border border-slate-700 rounded-xl text-xs font-semibold transition-all"
            >
              Download Report
            </button>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-10 lg:gap-8 pb-12 border-b border-slate-800/80">
          
          {/* Col 1: Brand & Overview */}
          <div className="space-y-4">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-blue-600 to-teal-500 flex items-center justify-center text-white shadow-md">
                <svg className="w-6 h-6 text-white" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                  <path d="M10 2v7.31M14 9.3V1.99M8.5 2h7M14 9.3a6.5 6.5 0 1 1-4 0M5.52 16h12.96" />
                </svg>
              </div>
              <div>
                <span className="text-lg font-bold text-white tracking-tight">
                  Microcells Diagnostics
                </span>
                <span className="block text-[11px] text-teal-400 font-medium tracking-wider uppercase">
                  Pvt. Ltd.
                </span>
              </div>
            </div>

            <p className="text-xs text-slate-400 leading-relaxed">
              Microcells Diagnostics Pvt. Ltd. is a dedicated diagnostic and pathology testing laboratory offering reliable results, advanced technology, standardized processes, and patient-focused care.
            </p>

            <div className="pt-2 space-y-2">
              <div className="flex items-center gap-2 text-xs text-slate-300">
                <Award className="w-4 h-4 text-teal-400 shrink-0" />
                <span>Standardized Clinical Laboratory Protocols</span>
              </div>
              <div className="flex items-center gap-2 text-xs text-slate-300">
                <HeartHandshake className="w-4 h-4 text-teal-400 shrink-0" />
                <span>Patient-Centric Transparent Reporting</span>
              </div>
            </div>
          </div>

          {/* Col 2: Quick Links */}
          <div>
            <h3 className="text-sm font-bold text-white uppercase tracking-wider mb-4 flex items-center gap-2">
              <span className="w-2 h-2 rounded-full bg-teal-400"></span>
              Quick Links
            </h3>
            <ul className="space-y-2.5 text-xs text-slate-400">
              <li>
                <button onClick={() => onNavigate('about')} className="hover:text-teal-400 transition-colors flex items-center gap-1.5">
                  <ChevronRight className="w-3.5 h-3.5 text-slate-600" />
                  <span>About Microcells Diagnostics</span>
                </button>
              </li>
              <li>
                <button onClick={() => onNavigate('services')} className="hover:text-teal-400 transition-colors flex items-center gap-1.5">
                  <ChevronRight className="w-3.5 h-3.5 text-slate-600" />
                  <span>Our Diagnostic Services</span>
                </button>
              </li>
              <li>
                <button onClick={() => onNavigate('tests')} className="hover:text-teal-400 transition-colors flex items-center gap-1.5">
                  <ChevronRight className="w-3.5 h-3.5 text-slate-600" />
                  <span>Search All Tests</span>
                </button>
              </li>
              <li>
                <button onClick={() => onNavigate('packages')} className="hover:text-teal-400 transition-colors flex items-center gap-1.5">
                  <ChevronRight className="w-3.5 h-3.5 text-slate-600" />
                  <span>Preventive Health Packages</span>
                </button>
              </li>
              <li>
                <button onClick={() => onNavigate('home-collection')} className="hover:text-teal-400 transition-colors flex items-center gap-1.5">
                  <ChevronRight className="w-3.5 h-3.5 text-slate-600" />
                  <span>Home Sample Collection</span>
                </button>
              </li>
              <li>
                <button onClick={() => onNavigate('why-choose-us')} className="hover:text-teal-400 transition-colors flex items-center gap-1.5">
                  <ChevronRight className="w-3.5 h-3.5 text-slate-600" />
                  <span>Why Choose Us</span>
                </button>
              </li>
              <li>
                <button onClick={() => onNavigate('blog')} className="hover:text-teal-400 transition-colors flex items-center gap-1.5">
                  <ChevronRight className="w-3.5 h-3.5 text-slate-600" />
                  <span>Health Articles & Blog</span>
                </button>
              </li>
              <li>
                <button onClick={() => onNavigate('admin')} className="hover:text-teal-400 text-teal-400/90 font-medium transition-colors flex items-center gap-1.5">
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

          {/* Col 3: Patient Services */}
          <div>
            <h3 className="text-sm font-bold text-white uppercase tracking-wider mb-4 flex items-center gap-2">
              <span className="w-2 h-2 rounded-full bg-teal-400"></span>
              Patient Services
            </h3>
            <ul className="space-y-2.5 text-xs text-slate-400">
              <li>
                <button onClick={() => onNavigate('book-test')} className="hover:text-teal-400 transition-colors flex items-center gap-1.5">
                  <ChevronRight className="w-3.5 h-3.5 text-slate-600" />
                  <span>Book a Test Appointment</span>
                </button>
              </li>
              <li>
                <button onClick={() => onNavigate('home-collection')} className="hover:text-teal-400 transition-colors flex items-center gap-1.5">
                  <ChevronRight className="w-3.5 h-3.5 text-slate-600" />
                  <span>Doorstep Blood Collection</span>
                </button>
              </li>
              <li>
                <button onClick={() => onNavigate('reports')} className="hover:text-teal-400 transition-colors flex items-center gap-1.5">
                  <ChevronRight className="w-3.5 h-3.5 text-slate-600" />
                  <span>Online Report Download Portal</span>
                </button>
              </li>
              <li>
                <button onClick={() => onNavigate('faq')} className="hover:text-teal-400 transition-colors flex items-center gap-1.5">
                  <ChevronRight className="w-3.5 h-3.5 text-slate-600" />
                  <span>Patient FAQs & Test Prep</span>
                </button>
              </li>
              <li>
                <button onClick={onOpenWhatsApp} className="hover:text-teal-400 transition-colors flex items-center gap-1.5 text-emerald-400">
                  <ChevronRight className="w-3.5 h-3.5 text-slate-600" />
                  <span>WhatsApp Test Inquiries</span>
                </button>
              </li>
              <li>
                <button onClick={() => onNavigate('contact')} className="hover:text-teal-400 transition-colors flex items-center gap-1.5">
                  <ChevronRight className="w-3.5 h-3.5 text-slate-600" />
                  <span>Lab Branches & Contact Info</span>
                </button>
              </li>
            </ul>
          </div>

          {/* Col 4: Laboratory Contact & Timings */}
          <div className="space-y-3.5 text-xs text-slate-400">
            <h3 className="text-sm font-bold text-white uppercase tracking-wider mb-4 flex items-center gap-2">
              <span className="w-2 h-2 rounded-full bg-teal-400"></span>
              Central Laboratory
            </h3>

            <div className="flex items-start gap-2.5">
              <MapPin className="w-4 h-4 text-teal-400 shrink-0 mt-0.5" />
              <span>{LAB_INFO.address}</span>
            </div>

            <div className="flex items-center gap-2.5">
              <Phone className="w-4 h-4 text-teal-400 shrink-0" />
              <div>
                <a href={`tel:${LAB_INFO.phone.replace(/[^0-9+]/g, '')}`} className="text-white hover:text-teal-400 font-medium">
                  {LAB_INFO.phone}
                </a>
                <span className="text-slate-500 block text-[11px]">Central Helpline</span>
              </div>
            </div>

            <div className="flex items-center gap-2.5">
              <MessageSquare className="w-4 h-4 text-emerald-400 shrink-0" />
              <div>
                <button onClick={onOpenWhatsApp} className="text-emerald-400 hover:underline font-medium">
                  {LAB_INFO.whatsappDisplay}
                </button>
                <span className="text-slate-500 block text-[11px]">Instant WhatsApp Assistance</span>
              </div>
            </div>

            <div className="flex items-center gap-2.5">
              <Mail className="w-4 h-4 text-teal-400 shrink-0" />
              <a href={`mailto:${LAB_INFO.email}`} className="text-slate-300 hover:text-teal-400">
                {LAB_INFO.email}
              </a>
            </div>

            <div className="flex items-start gap-2.5 pt-1">
              <Clock className="w-4 h-4 text-teal-400 shrink-0 mt-0.5" />
              <div>
                <span className="text-white font-medium">Operating Hours:</span>
                <span className="block text-slate-400 mt-0.5">{LAB_INFO.timings}</span>
              </div>
            </div>
          </div>

        </div>

        {/* Medical & Regulatory Disclaimer Note */}
        <div className="py-6 border-b border-slate-900 text-[11px] text-slate-500 leading-relaxed">
          <p>
            <strong className="text-slate-400">Medical Disclaimer:</strong> Diagnostic test results and health content on this website are intended solely for medical screening, educational awareness, and diagnostic evaluation under the supervision of registered medical practitioners. Laboratory reports must be clinically correlated with patient history and physical findings by a qualified physician. Microcells Diagnostics Pvt. Ltd. does not offer direct prescription or therapeutic medical advice.
          </p>
        </div>

        {/* Bottom Bar */}
        <div className="pt-6 flex flex-col sm:flex-row items-center justify-between gap-4 text-xs text-slate-500">
          <div>
            © {new Date().getFullYear()} Microcells Diagnostics Pvt. Ltd. All Rights Reserved.
          </div>

          <div className="flex flex-wrap items-center gap-4 sm:gap-6">
            <button onClick={() => onNavigate('privacy')} className="hover:text-slate-300 transition-colors">
              Privacy Policy
            </button>
            <button onClick={() => onNavigate('terms')} className="hover:text-slate-300 transition-colors">
              Terms & Conditions
            </button>
            <button onClick={() => onNavigate('disclaimer')} className="hover:text-slate-300 transition-colors">
              Disclaimer
            </button>
            <button 
              onClick={scrollToTop}
              className="p-1.5 rounded-lg bg-slate-900 hover:bg-slate-800 text-slate-400 hover:text-white transition-colors"
              title="Back to Top"
            >
              <ArrowUp className="w-4 h-4" />
            </button>
          </div>
        </div>

      </div>
    </footer>
  );
};
