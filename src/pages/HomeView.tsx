import React, { useState } from 'react';
import { 
  Calendar, 
  Home as HomeIcon, 
  Search, 
  ShieldCheck, 
  Clock, 
  Award, 
  Users, 
  ArrowRight, 
  CheckCircle2, 
  ChevronRight, 
  FileText, 
  UploadCloud, 
  Microscope, 
  TestTube2, 
  Activity, 
  HeartHandshake, 
  Cpu, 
  Sparkles, 
  Phone, 
  MessageSquare,
  HelpCircle,
  FlaskConical,
  Eye,
  Check
} from 'lucide-react';
import { PageType, CartItem, TestItem, HealthPackage } from '../types';
import { 
  LAB_INFO, 
  DIAGNOSTIC_DEPARTMENTS, 
  TRUST_POINTS
} from '../data/labData';
import { useData } from '../context/DataContext';
import { TestCard } from '../components/TestCard';
import { PackageCard } from '../components/PackageCard';

interface HomeViewProps {
  onNavigate: (page: PageType, param?: string) => void;
  cart: CartItem[];
  onAddToCart: (item: CartItem) => void;
  onRemoveFromCart: (id: string) => void;
  onBookNow: (item: CartItem) => void;
  onViewTestDetails: (item: TestItem | HealthPackage, type: 'test' | 'package') => void;
  onOpenPrescription: () => void;
  onOpenWhatsApp: () => void;
}

export const HomeView: React.FC<HomeViewProps> = ({
  onNavigate,
  cart = [],
  onAddToCart,
  onRemoveFromCart,
  onBookNow,
  onViewTestDetails,
  onOpenPrescription,
  onOpenWhatsApp
}) => {
  const { tests, packages, blogPosts, faqs, siteImages, siteContent, labInfo } = useData();
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedConcern, setSelectedConcern] = useState<string>('All');
  const [faqOpenId, setFaqOpenId] = useState<string | null>(faqs[0]?.id || null);

  // Filter tests based on search and health concern
  const concerns = ['All', 'General Wellness', 'Diabetes', 'Heart', 'Liver', 'Kidney', 'Thyroid', 'Vitamins'];
  
  // Show popular tests, or all tests if none marked popular
  const popularSource = tests.some(t => t.isPopular) ? tests.filter(t => t.isPopular) : tests;

  const filteredPopularTests = popularSource.filter(t => {
    const matchesConcern = selectedConcern === 'All' || t.healthConcern === selectedConcern;
    const matchesSearch = !searchQuery || 
      t.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      t.code.toLowerCase().includes(searchQuery.toLowerCase()) ||
      t.category.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesConcern && matchesSearch;
  });

  const cartItemIds = new Set(cart.map(c => c.id));

  return (
    <div className="space-y-16 sm:space-y-24">
      
      {/* 1. HERO SECTION */}
      <section className="relative overflow-hidden bg-gradient-to-b from-slate-900 via-blue-950 to-slate-950 text-white pt-10 sm:pt-16 pb-20 lg:pb-28">
        
        {/* Subtle Background Glows */}
        <div className="absolute top-0 left-1/4 w-96 h-96 bg-teal-500/10 rounded-full blur-3xl pointer-events-none" />
        <div className="absolute bottom-0 right-1/4 w-96 h-96 bg-blue-600/15 rounded-full blur-3xl pointer-events-none" />

        <div className="max-w-7xl mx-auto px-4 sm:px-6 relative z-10">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-8 items-center">
            
            {/* Left Hero Content */}
            <div className="lg:col-span-7 space-y-6 text-center lg:text-left">
              
              <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-teal-500/15 border border-teal-500/30 text-teal-300 text-xs font-semibold">
                <Sparkles className="w-3.5 h-3.5" />
                <span>{siteContent?.hero?.badgeText || 'Advanced Pathology & Diagnostic Testing'}</span>
              </div>

              <h1 className="text-3xl sm:text-5xl lg:text-6xl font-extrabold tracking-tight text-white font-display leading-[1.15]">
                {siteContent?.hero?.headline ? (
                  siteContent.hero.headline
                ) : (
                  <>
                    Accurate Diagnostics.<br />
                    <span className="bg-gradient-to-r from-teal-300 via-cyan-200 to-blue-200 bg-clip-text text-transparent">
                      Better Healthcare.
                    </span>
                  </>
                )}
              </h1>

              <p className="text-base sm:text-lg text-slate-300 max-w-2xl mx-auto lg:mx-0 leading-relaxed font-normal">
                {siteContent?.hero?.subheadline || labInfo?.subTagline || 'Advanced pathology testing with clinical precision, automated analyzers, and same-day digital reports.'}
              </p>

              {/* CTAs */}
              <div className="flex flex-wrap items-center justify-center lg:justify-start gap-3.5 pt-2">
                <button
                  onClick={() => onNavigate('book-test')}
                  className="px-6 py-3.5 bg-teal-600 hover:bg-teal-500 text-white font-bold text-sm rounded-xl shadow-lg shadow-teal-900/30 hover:shadow-teal-600/40 transition-all flex items-center gap-2 group"
                  id="hero-btn-book-test"
                >
                  <Calendar className="w-4 h-4 text-teal-200" />
                  <span>Book a Test</span>
                  <ArrowRight className="w-4 h-4 group-hover:translate-x-0.5 transition-transform" />
                </button>

                <button
                  onClick={() => onNavigate('home-collection')}
                  className="px-6 py-3.5 bg-slate-800/90 hover:bg-slate-800 text-white font-semibold text-sm rounded-xl border border-slate-700 hover:border-slate-600 shadow-md transition-all flex items-center gap-2"
                  id="hero-btn-book-home"
                >
                  <HomeIcon className="w-4 h-4 text-teal-400" />
                  <span>Book Home Collection</span>
                </button>

                <button
                  onClick={onOpenPrescription}
                  className="px-4 py-3.5 bg-transparent hover:bg-white/10 text-teal-300 font-semibold text-sm rounded-xl transition-all flex items-center gap-1.5"
                >
                  <UploadCloud className="w-4 h-4" />
                  <span>Upload Rx</span>
                </button>
              </div>

              {/* Quick Search Input */}
              <div className="pt-4 max-w-xl mx-auto lg:mx-0">
                <div className="relative">
                  <Search className="w-5 h-5 text-slate-400 absolute left-4 top-3.5" />
                  <input
                    type="text"
                    placeholder="Search for a test, package or health checkup (e.g. CBC, Lipid, HbA1c)..."
                    value={searchQuery}
                    onChange={(e) => {
                      setSearchQuery(e.target.value);
                      if (e.target.value.length > 2 && window.location.hash !== '#popular-tests') {
                        // Smooth scroll to tests if searching
                        const el = document.getElementById('popular-tests');
                        if (el) el.scrollIntoView({ behavior: 'smooth' });
                      }
                    }}
                    className="w-full pl-12 pr-4 py-3 bg-slate-900/90 border border-slate-700/90 hover:border-teal-500/50 focus:border-teal-400 rounded-2xl text-xs sm:text-sm text-white placeholder-slate-400 focus:outline-none shadow-inner"
                  />
                </div>
              </div>

            </div>

            {/* Right Hero Image Card */}
            <div className="lg:col-span-5 relative">
              <div className="relative rounded-3xl overflow-hidden shadow-2xl border border-slate-700/80 bg-slate-900 group">
                <img
                  src={siteImages.homeHeroBanner || "https://images.unsplash.com/photo-1579154204601-01588f351e67?auto=format&fit=crop&w=1000&q=80"}
                  alt="Modern Pathology Laboratory Testing"
                  className="w-full h-80 sm:h-96 object-cover object-center group-hover:scale-105 transition-transform duration-700 opacity-90"
                  loading="eager"
                  referrerPolicy="no-referrer"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-slate-950 via-slate-950/40 to-transparent" />
                
                {/* Floating Laboratory Badge */}
                <div className="absolute bottom-4 left-4 right-4 p-4 rounded-2xl bg-slate-900/90 backdrop-blur-md border border-slate-700/80 flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-xl bg-teal-500/20 border border-teal-500/40 flex items-center justify-center text-teal-300">
                      <Microscope className="w-5 h-5" />
                    </div>
                    <div>
                      <h2 className="text-xs font-bold text-white">Central Reference Lab</h2>
                      <p className="text-[10px] text-slate-400">Automated analyzers & barcoding</p>
                    </div>
                  </div>
                  <span className="px-2.5 py-1 bg-emerald-500/20 text-emerald-300 text-[10px] font-bold rounded-full border border-emerald-500/30">
                    Active
                  </span>
                </div>
              </div>
            </div>

          </div>

          {/* 4 Trust Indicators Bar */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mt-16 pt-10 border-t border-slate-800/80">
            <div className="flex items-center gap-3 p-3 rounded-xl bg-slate-900/50 border border-slate-800">
              <div className="w-9 h-9 rounded-lg bg-teal-500/10 text-teal-400 flex items-center justify-center shrink-0">
                <Award className="w-5 h-5" />
              </div>
              <div>
                <h4 className="text-xs font-bold text-white">Accurate Testing</h4>
                <p className="text-[10px] text-slate-400">Calibrated Multi-level QC</p>
              </div>
            </div>

            <div className="flex items-center gap-3 p-3 rounded-xl bg-slate-900/50 border border-slate-800">
              <div className="w-9 h-9 rounded-lg bg-blue-500/10 text-blue-400 flex items-center justify-center shrink-0">
                <Cpu className="w-5 h-5" />
              </div>
              <div>
                <h4 className="text-xs font-bold text-white">Advanced Technology</h4>
                <p className="text-[10px] text-slate-400">Automated Chemistry & CLIA</p>
              </div>
            </div>

            <div className="flex items-center gap-3 p-3 rounded-xl bg-slate-900/50 border border-slate-800">
              <div className="w-9 h-9 rounded-lg bg-emerald-500/10 text-emerald-400 flex items-center justify-center shrink-0">
                <Users className="w-5 h-5" />
              </div>
              <div>
                <h4 className="text-xs font-bold text-white">Qualified Professionals</h4>
                <p className="text-[10px] text-slate-400">Certified Phlebotomists</p>
              </div>
            </div>

            <div className="flex items-center gap-3 p-3 rounded-xl bg-slate-900/50 border border-slate-800">
              <div className="w-9 h-9 rounded-lg bg-cyan-500/10 text-cyan-400 flex items-center justify-center shrink-0">
                <Clock className="w-5 h-5" />
              </div>
              <div>
                <h4 className="text-xs font-bold text-white">Timely Reports</h4>
                <p className="text-[10px] text-slate-400">Same-Day Digital Access</p>
              </div>
            </div>
          </div>

        </div>
      </section>

      {/* 2. QUICK ACTION CARDS */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 -mt-10 sm:-mt-14 relative z-20">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          
          {/* Card 1: Home Collection */}
          <div 
            onClick={() => onNavigate('home-collection')}
            className="p-5 rounded-2xl bg-white border border-slate-200/90 shadow-md hover:shadow-xl hover:border-teal-500/50 cursor-pointer transition-all duration-200 group flex items-start gap-4"
          >
            <div className="w-12 h-12 rounded-xl bg-teal-50 text-teal-700 group-hover:bg-teal-600 group-hover:text-white flex items-center justify-center shrink-0 transition-colors">
              <HomeIcon className="w-6 h-6" />
            </div>
            <div>
              <h3 className="text-sm font-bold text-slate-900 group-hover:text-teal-700 flex items-center gap-1 transition-colors">
                <span>Book Home Collection</span>
                <ChevronRight className="w-3.5 h-3.5" />
              </h3>
              <p className="text-xs text-slate-500 mt-1">
                Trained phlebotomists collect blood samples at your doorstep.
              </p>
            </div>
          </div>

          {/* Card 2: Find a Test */}
          <div 
            onClick={() => onNavigate('tests')}
            className="p-5 rounded-2xl bg-white border border-slate-200/90 shadow-md hover:shadow-xl hover:border-blue-500/50 cursor-pointer transition-all duration-200 group flex items-start gap-4"
          >
            <div className="w-12 h-12 rounded-xl bg-blue-50 text-blue-800 group-hover:bg-blue-900 group-hover:text-white flex items-center justify-center shrink-0 transition-colors">
              <Search className="w-6 h-6" />
            </div>
            <div>
              <h3 className="text-sm font-bold text-slate-900 group-hover:text-blue-900 flex items-center gap-1 transition-colors">
                <span>Find Any Blood Test</span>
                <ChevronRight className="w-3.5 h-3.5" />
              </h3>
              <p className="text-xs text-slate-500 mt-1">
                Explore 100+ routine & specialized pathology test parameters.
              </p>
            </div>
          </div>

          {/* Card 3: Download Reports */}
          <div 
            onClick={() => onNavigate('reports')}
            className="p-5 rounded-2xl bg-white border border-slate-200/90 shadow-md hover:shadow-xl hover:border-cyan-500/50 cursor-pointer transition-all duration-200 group flex items-start gap-4"
          >
            <div className="w-12 h-12 rounded-xl bg-cyan-50 text-cyan-800 group-hover:bg-cyan-700 group-hover:text-white flex items-center justify-center shrink-0 transition-colors">
              <FileText className="w-6 h-6" />
            </div>
            <div>
              <h3 className="text-sm font-bold text-slate-900 group-hover:text-cyan-800 flex items-center gap-1 transition-colors">
                <span>Download Report</span>
                <ChevronRight className="w-3.5 h-3.5" />
              </h3>
              <p className="text-xs text-slate-500 mt-1">
                Access verified digital PDF reports using your UHID or Mobile.
              </p>
            </div>
          </div>

          {/* Card 4: Upload Prescription */}
          <div 
            onClick={onOpenPrescription}
            className="p-5 rounded-2xl bg-white border border-slate-200/90 shadow-md hover:shadow-xl hover:border-emerald-500/50 cursor-pointer transition-all duration-200 group flex items-start gap-4"
          >
            <div className="w-12 h-12 rounded-xl bg-emerald-50 text-emerald-800 group-hover:bg-emerald-700 group-hover:text-white flex items-center justify-center shrink-0 transition-colors">
              <UploadCloud className="w-6 h-6" />
            </div>
            <div>
              <h3 className="text-sm font-bold text-slate-900 group-hover:text-emerald-800 flex items-center gap-1 transition-colors">
                <span>Upload Prescription</span>
                <ChevronRight className="w-3.5 h-3.5" />
              </h3>
              <p className="text-xs text-slate-500 mt-1">
                Upload your doctor's note for quick test mapping & booking.
              </p>
            </div>
          </div>

        </div>
      </section>

      {/* 3. ABOUT MICROCELLS DIAGNOSTICS */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 items-center">
          
          <div className="lg:col-span-6 relative">
            <div className="relative rounded-3xl overflow-hidden shadow-2xl border border-slate-200/90 bg-gradient-to-b from-blue-50 to-slate-100 group">
              <img
                src={siteImages.homeDoctorPortrait || "https://images.unsplash.com/photo-1622253692010-333f2da6031d?auto=format&fit=crop&w=1200&q=85"}
                alt="Lead Pathologist & Medical Doctor"
                className="w-full h-84 sm:h-96 lg:h-[440px] object-cover object-top group-hover:scale-102 transition-transform duration-500"
                referrerPolicy="no-referrer"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-slate-950/80 via-slate-950/20 to-transparent" />
              
              {/* Doctor Consultation Badge Top Right */}
              <div className="absolute top-4 right-4 bg-blue-950/90 backdrop-blur-md border border-blue-800/80 text-white px-3.5 py-1.5 rounded-xl shadow-lg flex items-center gap-2 text-xs">
                <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse"></span>
                <span className="font-semibold text-[11px] text-teal-300">Doctor Verified Lab</span>
              </div>

              {/* Bottom Info Floating Card */}
              <div className="absolute bottom-5 left-5 right-5 p-4 rounded-2xl bg-white/95 backdrop-blur-md border border-slate-100/90 shadow-xl">
                <div className="flex items-center justify-between gap-3">
                  <div className="flex items-center gap-3">
                    <div className="w-11 h-11 rounded-xl bg-blue-900 text-teal-300 flex items-center justify-center shrink-0 shadow-sm">
                      <ShieldCheck className="w-6 h-6" />
                    </div>
                    <div>
                      <h4 className="text-xs font-bold text-slate-900">Expert Medical & Pathology Supervision</h4>
                      <p className="text-[11px] text-slate-500">Every report reviewed & signed by qualified doctors</p>
                    </div>
                  </div>
                  <div className="hidden sm:flex items-center text-[10px] font-bold text-teal-700 bg-teal-50 px-2.5 py-1 rounded-lg border border-teal-200/60 shrink-0">
                    100% Verified
                  </div>
                </div>
              </div>
            </div>
          </div>

          <div className="lg:col-span-6 space-y-5">
            <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-blue-50 border border-blue-100 text-blue-900 text-xs font-semibold">
              <span>About Us</span>
            </div>

            <h2 className="text-2xl sm:text-4xl font-extrabold text-slate-900 tracking-tight font-display leading-tight">
              Microcells Diagnostics Pvt. Ltd.
            </h2>

            <p className="text-sm text-slate-600 leading-relaxed">
              Microcells Diagnostics Pvt. Ltd. is focused on providing dependable pathology and diagnostic services using modern technology, standardized processes, skilled professionals, and quality-focused laboratory practices.
            </p>

            <p className="text-xs text-slate-500 leading-relaxed">
              We understand that clinical diagnostics forms the foundation of modern medical decision-making. From routine blood cell examinations to advanced hormonal chemiluminescence and microbial cultures, our facility is engineered to deliver high precision, minimal turnaround times, and a patient-first experience.
            </p>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-2">
              <div className="flex items-center gap-2 text-xs font-semibold text-slate-800">
                <CheckCircle2 className="w-4 h-4 text-teal-600 shrink-0" />
                <span>Patient-Centric Approach</span>
              </div>
              <div className="flex items-center gap-2 text-xs font-semibold text-slate-800">
                <CheckCircle2 className="w-4 h-4 text-teal-600 shrink-0" />
                <span>Reliable Diagnostic Testing</span>
              </div>
              <div className="flex items-center gap-2 text-xs font-semibold text-slate-800">
                <CheckCircle2 className="w-4 h-4 text-teal-600 shrink-0" />
                <span>Modern Lab Infrastructure</span>
              </div>
              <div className="flex items-center gap-2 text-xs font-semibold text-slate-800">
                <CheckCircle2 className="w-4 h-4 text-teal-600 shrink-0" />
                <span>Quality-Focused Processes</span>
              </div>
              <div className="flex items-center gap-2 text-xs font-semibold text-slate-800">
                <CheckCircle2 className="w-4 h-4 text-teal-600 shrink-0" />
                <span>Timely Digital Reporting</span>
              </div>
              <div className="flex items-center gap-2 text-xs font-semibold text-slate-800">
                <CheckCircle2 className="w-4 h-4 text-teal-600 shrink-0" />
                <span>Professional Medical Expertise</span>
              </div>
            </div>

            <div className="pt-2">
              <button
                onClick={() => onNavigate('about')}
                className="px-5 py-3 rounded-xl bg-blue-900 hover:bg-blue-800 text-white text-xs font-bold transition-all inline-flex items-center gap-2 shadow-sm"
              >
                <span>Learn More About Us</span>
                <ArrowRight className="w-4 h-4" />
              </button>
            </div>

          </div>

        </div>
      </section>

      {/* 4. OUR DIAGNOSTIC SERVICES GRID */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6">
        <div className="text-center max-w-3xl mx-auto mb-12 space-y-3">
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-teal-50 border border-teal-100 text-teal-800 text-xs font-semibold">
            <span>Specialized Departments</span>
          </div>
          <h2 className="text-2xl sm:text-4xl font-extrabold text-slate-900 tracking-tight font-display">
            Comprehensive Diagnostic Services
          </h2>
          <p className="text-xs sm:text-sm text-slate-500 leading-relaxed">
            Our multi-disciplinary laboratory spans clinical pathology, hematology, biochemistry, immunology, microbiology, and histopathology.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {DIAGNOSTIC_DEPARTMENTS.map((dept) => {
            const deptImage = 
              dept.id === 'clinical-pathology' ? siteImages.deptClinicalPathology :
              dept.id === 'hematology' ? siteImages.deptHematology :
              dept.id === 'clinical-biochemistry' ? siteImages.deptBiochemistry :
              dept.id === 'microbiology' ? siteImages.deptMicrobiology :
              dept.id === 'serology-immunology' ? siteImages.deptSerology :
              dept.id === 'preventive-health' ? siteImages.deptPreventive :
              dept.imageUrl;

            return (
              <div
                key={dept.id}
                className="bg-white rounded-3xl border border-slate-200/90 hover:border-teal-500/40 p-6 shadow-xs hover:shadow-lg transition-all duration-200 flex flex-col justify-between group"
              >
                <div>
                  {/* Department Image & Badge */}
                  <div className="relative rounded-2xl overflow-hidden h-40 mb-5 bg-slate-100">
                    <img
                      src={deptImage || dept.imageUrl}
                      alt={dept.title}
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                      referrerPolicy="no-referrer"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-slate-950/80 via-slate-950/20 to-transparent" />
                    
                    <div className="absolute bottom-3 left-3 right-3 flex items-center justify-between text-white">
                      <span className="text-sm font-bold">{dept.title}</span>
                    </div>
                  </div>

                  <p className="text-xs text-slate-600 leading-relaxed mb-4">
                    {dept.subtitle}
                  </p>

                  {/* Subcategory test samples */}
                  <div className="space-y-2 mb-4">
                    {dept.subcategories.map((sub, idx) => (
                      <div key={idx} className="bg-slate-50 p-2.5 rounded-xl border border-slate-100 text-xs">
                        <span className="font-bold text-slate-800 block text-[11px] mb-1">
                          {sub.title}
                        </span>
                        <p className="text-[11px] text-slate-500 line-clamp-1">
                          {sub.tests.join(' • ')}
                        </p>
                      </div>
                    ))}
                  </div>
                </div>

                <div className="pt-3 border-t border-slate-100 flex items-center justify-between">
                  <button
                    onClick={() => onNavigate('services')}
                    className="text-xs font-bold text-teal-700 group-hover:text-teal-800 flex items-center gap-1 hover:underline"
                  >
                    <span>View Department Details</span>
                    <ChevronRight className="w-3.5 h-3.5" />
                  </button>

                  <button
                    onClick={() => onNavigate('tests')}
                    className="px-3 py-1.5 rounded-lg bg-blue-50 hover:bg-blue-100 text-blue-900 text-[11px] font-semibold transition-colors"
                  >
                    Explore Tests
                  </button>
                </div>
              </div>
            );
          })}
        </div>

        <div className="text-center mt-8">
          <button
            onClick={() => onNavigate('services')}
            className="px-6 py-3 rounded-xl bg-slate-900 hover:bg-slate-800 text-white text-xs font-bold inline-flex items-center gap-2 transition-all"
          >
            <span>View Complete Diagnostic Services Breakdown</span>
            <ArrowRight className="w-4 h-4" />
          </button>
        </div>
      </section>

      {/* 5. POPULAR TESTS SECTION */}
      <section id="popular-tests" className="max-w-7xl mx-auto px-4 sm:px-6 scroll-mt-24">
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-4 mb-8">
          <div className="space-y-2">
            <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-blue-50 border border-blue-100 text-blue-900 text-xs font-semibold">
              <span>Popular Pathology Tests</span>
            </div>
            <h2 className="text-2xl sm:text-4xl font-extrabold text-slate-900 tracking-tight font-display">
              Routine & Specialized Blood Investigations
            </h2>
            <p className="text-xs sm:text-sm text-slate-500">
              Clear upfront pricing, sample prerequisites, and same-day reporting turnaround.
            </p>
          </div>

          <button
            onClick={() => onNavigate('tests')}
            className="px-5 py-2.5 rounded-xl border border-slate-300 hover:border-teal-500 text-slate-700 hover:text-teal-800 text-xs font-semibold inline-flex items-center gap-1.5 transition-all self-start md:self-auto"
          >
            <span>View All Tests ({tests.length}+)</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </button>
        </div>

        {/* Health Concern Pills */}
        <div className="flex items-center gap-2 overflow-x-auto pb-3 mb-6 scrollbar-none">
          {concerns.map(concern => (
            <button
              key={concern}
              onClick={() => setSelectedConcern(concern)}
              className={`px-3.5 py-1.5 rounded-full text-xs font-semibold whitespace-nowrap transition-all ${
                selectedConcern === concern 
                  ? 'bg-blue-900 text-white shadow-xs' 
                  : 'bg-white border border-slate-200 text-slate-600 hover:bg-slate-50'
              }`}
            >
              {concern}
            </button>
          ))}
        </div>

        {/* Tests Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-5">
          {filteredPopularTests.slice(0, 8).map(test => (
            <TestCard
              key={test.id}
              test={test}
              isInCart={cartItemIds.has(test.id)}
              onAddToCart={onAddToCart}
              onRemoveFromCart={onRemoveFromCart}
              onBookNow={onBookNow}
              onViewDetails={(t) => onViewTestDetails(t, 'test')}
            />
          ))}
        </div>

        {filteredPopularTests.length === 0 && (
          <div className="text-center py-12 bg-white rounded-2xl border border-slate-200">
            <p className="text-sm text-slate-500">No tests found matching "{searchQuery}".</p>
            <button
              onClick={() => {
                setSearchQuery('');
                setSelectedConcern('All');
              }}
              className="mt-2 text-xs text-teal-700 font-bold hover:underline"
            >
              Reset Filters
            </button>
          </div>
        )}
      </section>

      {/* 6. HEALTH PACKAGES */}
      <section className="bg-gradient-to-b from-slate-50 to-blue-50/40 py-16 sm:py-20 border-y border-slate-200/80">
        <div className="max-w-7xl mx-auto px-4 sm:px-6">
          
          <div className="text-center max-w-3xl mx-auto mb-12 space-y-3">
            <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-teal-50 border border-teal-200 text-teal-800 text-xs font-semibold">
              <Sparkles className="w-3.5 h-3.5" />
              <span>Preventive Health Packages</span>
            </div>
            <h2 className="text-2xl sm:text-4xl font-extrabold text-slate-900 tracking-tight font-display">
              Total Body Health Checkups
            </h2>
            <p className="text-xs sm:text-sm text-slate-500 leading-relaxed">
              Comprehensive preventive wellness profiles combining organ function tests, vital vitamin levels, and metabolic indicators.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {packages.slice(0, 3).map(pkg => (
              <PackageCard
                key={pkg.id}
                pkg={pkg}
                isInCart={cartItemIds.has(pkg.id)}
                onAddToCart={onAddToCart}
                onRemoveFromCart={onRemoveFromCart}
                onBookNow={onBookNow}
                onViewDetails={(p) => onViewTestDetails(p, 'package')}
              />
            ))}
          </div>

          <div className="mt-10 text-center space-y-2">
            <button
              onClick={() => onNavigate('packages')}
              className="px-6 py-3 rounded-xl bg-blue-900 hover:bg-blue-800 text-white text-xs font-bold inline-flex items-center gap-2 shadow-md transition-all"
            >
              <span>Explore All {packages.length} Health Packages</span>
              <ArrowRight className="w-4 h-4" />
            </button>
            <p className="text-[11px] text-slate-400">
              *Package parameters and pricing placeholders are subject to clinical revision.
            </p>
          </div>

        </div>
      </section>

      {/* 7. HOME SAMPLE COLLECTION SPOTLIGHT */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6">
        <div className="bg-gradient-to-br from-slate-900 via-blue-950 to-teal-950 rounded-3xl text-white p-8 sm:p-12 shadow-2xl relative overflow-hidden">
          
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 items-center relative z-10">
            
            <div className="lg:col-span-7 space-y-6">
              <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-teal-500/20 text-teal-300 text-xs font-semibold border border-teal-500/30">
                <HomeIcon className="w-3.5 h-3.5" />
                <span>Doorstep Diagnostic Service</span>
              </div>

              <h2 className="text-2xl sm:text-4xl font-extrabold tracking-tight text-white font-display leading-tight">
                Diagnostic Testing From the Comfort of Your Home
              </h2>

              <p className="text-sm text-slate-300 leading-relaxed font-normal">
                Book a convenient home sample collection and let our trained professionals collect your samples safely at your preferred location.
              </p>

              {/* 6 Home Collection Key Benefits */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-2">
                <div className="flex items-center gap-2.5 text-xs text-slate-200">
                  <div className="w-6 h-6 rounded-full bg-teal-500/20 text-teal-300 flex items-center justify-center shrink-0">
                    <Check className="w-3.5 h-3.5" />
                  </div>
                  <span>Easy Online / Call Booking</span>
                </div>

                <div className="flex items-center gap-2.5 text-xs text-slate-200">
                  <div className="w-6 h-6 rounded-full bg-teal-500/20 text-teal-300 flex items-center justify-center shrink-0">
                    <Check className="w-3.5 h-3.5" />
                  </div>
                  <span>Trained & Certified Phlebotomists</span>
                </div>

                <div className="flex items-center gap-2.5 text-xs text-slate-200">
                  <div className="w-6 h-6 rounded-full bg-teal-500/20 text-teal-300 flex items-center justify-center shrink-0">
                    <Check className="w-3.5 h-3.5" />
                  </div>
                  <span>Safe Single-Use Sterile Vacutainers</span>
                </div>

                <div className="flex items-center gap-2.5 text-xs text-slate-200">
                  <div className="w-6 h-6 rounded-full bg-teal-500/20 text-teal-300 flex items-center justify-center shrink-0">
                    <Check className="w-3.5 h-3.5" />
                  </div>
                  <span>Convenient Early Morning Time Slots</span>
                </div>

                <div className="flex items-center gap-2.5 text-xs text-slate-200">
                  <div className="w-6 h-6 rounded-full bg-teal-500/20 text-teal-300 flex items-center justify-center shrink-0">
                    <Check className="w-3.5 h-3.5" />
                  </div>
                  <span>Cold-Chain Temperature Controlled Transit</span>
                </div>

                <div className="flex items-center gap-2.5 text-xs text-slate-200">
                  <div className="w-6 h-6 rounded-full bg-teal-500/20 text-teal-300 flex items-center justify-center shrink-0">
                    <Check className="w-3.5 h-3.5" />
                  </div>
                  <span>Same-Day Digital PDF Reports</span>
                </div>
              </div>

              <div className="flex flex-wrap items-center gap-4 pt-2">
                <button
                  onClick={() => onNavigate('home-collection')}
                  className="px-6 py-3.5 bg-teal-500 hover:bg-teal-400 text-slate-950 font-bold text-xs sm:text-sm rounded-xl shadow-lg transition-all flex items-center gap-2"
                >
                  <HomeIcon className="w-4 h-4" />
                  <span>Book Home Collection Now</span>
                </button>

                <button
                  onClick={onOpenWhatsApp}
                  className="px-5 py-3.5 bg-slate-800 hover:bg-slate-700 text-emerald-300 font-semibold text-xs rounded-xl border border-slate-700 transition-all flex items-center gap-2"
                >
                  <MessageSquare className="w-4 h-4 text-emerald-400" />
                  <span>Book on WhatsApp</span>
                </button>
              </div>

            </div>

            <div className="lg:col-span-5">
              <div className="rounded-2xl overflow-hidden border border-slate-700/80 shadow-2xl relative">
                <img
                  src={siteImages.homeCollectionBanner || "https://images.unsplash.com/photo-1579684385127-1ef15d508118?auto=format&fit=crop&w=800&q=80"}
                  alt="Home sample collection by phlebotomist"
                  className="w-full h-72 sm:h-80 object-cover object-center"
                  referrerPolicy="no-referrer"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-slate-950/80 via-transparent to-transparent" />
                <div className="absolute bottom-4 left-4 right-4 bg-slate-900/90 p-3 rounded-xl border border-slate-700 text-xs">
                  <span className="font-bold text-white block">Strict Biosafety Protocol</span>
                  <span className="text-[11px] text-slate-400">Single-use needles opened in front of you</span>
                </div>
              </div>
            </div>

          </div>

        </div>
      </section>

      {/* 8. HOW IT WORKS (4 STEPS) */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6">
        <div className="text-center max-w-3xl mx-auto mb-14 space-y-3">
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-blue-50 border border-blue-100 text-blue-900 text-xs font-semibold">
            <span>Seamless Process</span>
          </div>
          <h2 className="text-2xl sm:text-4xl font-extrabold text-slate-900 tracking-tight font-display">
            How It Works
          </h2>
          <p className="text-xs sm:text-sm text-slate-500">
            From test selection to verified report delivery in 4 transparent steps.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 relative">
          
          {/* Step 1 */}
          <div className="bg-white rounded-3xl p-6 border border-slate-200 shadow-xs hover:shadow-md transition-all relative group">
            <div className="w-12 h-12 rounded-2xl bg-blue-50 text-blue-900 font-mono font-extrabold text-base flex items-center justify-center mb-4 group-hover:bg-blue-900 group-hover:text-white transition-colors">
              01
            </div>
            <h3 className="text-base font-bold text-slate-900 mb-2">
              Book Your Test
            </h3>
            <p className="text-xs text-slate-500 leading-relaxed">
              Choose your test or health package online, via WhatsApp, or through prescription upload.
            </p>
          </div>

          {/* Step 2 */}
          <div className="bg-white rounded-3xl p-6 border border-slate-200 shadow-xs hover:shadow-md transition-all relative group">
            <div className="w-12 h-12 rounded-2xl bg-teal-50 text-teal-800 font-mono font-extrabold text-base flex items-center justify-center mb-4 group-hover:bg-teal-600 group-hover:text-white transition-colors">
              02
            </div>
            <h3 className="text-base font-bold text-slate-900 mb-2">
              Schedule Collection
            </h3>
            <p className="text-xs text-slate-500 leading-relaxed">
              Select laboratory visit or home sample collection with your preferred morning or evening time slot.
            </p>
          </div>

          {/* Step 3 */}
          <div className="bg-white rounded-3xl p-6 border border-slate-200 shadow-xs hover:shadow-md transition-all relative group">
            <div className="w-12 h-12 rounded-2xl bg-cyan-50 text-cyan-800 font-mono font-extrabold text-base flex items-center justify-center mb-4 group-hover:bg-cyan-700 group-hover:text-white transition-colors">
              03
            </div>
            <h3 className="text-base font-bold text-slate-900 mb-2">
              Sample Collection
            </h3>
            <p className="text-xs text-slate-500 leading-relaxed">
              Our trained professionals collect and barcode your sample, maintaining cold-chain transit to the lab.
            </p>
          </div>

          {/* Step 4 */}
          <div className="bg-white rounded-3xl p-6 border border-slate-200 shadow-xs hover:shadow-md transition-all relative group">
            <div className="w-12 h-12 rounded-2xl bg-emerald-50 text-emerald-800 font-mono font-extrabold text-base flex items-center justify-center mb-4 group-hover:bg-emerald-700 group-hover:text-white transition-colors">
              04
            </div>
            <h3 className="text-base font-bold text-slate-900 mb-2">
              Get Your Report
            </h3>
            <p className="text-xs text-slate-500 leading-relaxed">
              Receive your verified diagnostic report securely via SMS, WhatsApp, and our online patient portal.
            </p>
          </div>

        </div>
      </section>

      {/* 9. WHY CHOOSE MICROCELLS DIAGNOSTICS */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6">
        <div className="text-center max-w-3xl mx-auto mb-12 space-y-3">
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-teal-50 border border-teal-100 text-teal-800 text-xs font-semibold">
            <span>Trust & Credibility</span>
          </div>
          <h2 className="text-2xl sm:text-4xl font-extrabold text-slate-900 tracking-tight font-display">
            Why Choose Microcells Diagnostics?
          </h2>
          <p className="text-xs sm:text-sm text-slate-500">
            Engineered around accuracy, transparency, and medical excellence.
          </p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {TRUST_POINTS.map((pt, index) => (
            <div
              key={index}
              className="bg-white rounded-2xl p-6 border border-slate-200/90 shadow-2xs hover:shadow-md hover:border-blue-300 transition-all flex items-start gap-4"
            >
              <div className="w-10 h-10 rounded-xl bg-blue-50 text-blue-900 flex items-center justify-center shrink-0">
                <CheckCircle2 className="w-5 h-5 text-teal-600" />
              </div>
              <div>
                <h3 className="text-sm font-bold text-slate-900 mb-1">{pt.title}</h3>
                <p className="text-xs text-slate-500 leading-relaxed">{pt.desc}</p>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* 10. DIGITAL REPORT PORTAL QUICK ACCESS */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6">
        <div className="bg-gradient-to-r from-blue-950 via-slate-900 to-teal-950 rounded-3xl p-8 sm:p-12 text-white border border-slate-800 flex flex-col lg:flex-row items-center justify-between gap-8">
          
          <div className="space-y-3 max-w-xl text-center lg:text-left">
            <span className="px-3 py-1 rounded-full bg-teal-500/20 text-teal-300 text-xs font-semibold border border-teal-500/30 inline-block">
              Patient Portal Access
            </span>
            <h2 className="text-2xl sm:text-3xl font-extrabold tracking-tight font-display">
              Access Your Reports Easily
            </h2>
            <p className="text-xs sm:text-sm text-slate-300 leading-relaxed">
              Enter your Patient UHID or registered Mobile Number to securely view, verify, and download your electronic pathology report.
            </p>
          </div>

          <div className="bg-white/10 backdrop-blur-md p-6 rounded-2xl border border-white/15 w-full lg:max-w-md space-y-3">
            <div>
              <label className="text-[11px] font-bold text-teal-200 uppercase tracking-wider block mb-1">
                Patient UHID / Mobile Number
              </label>
              <input
                type="text"
                placeholder="e.g. MC-2026-90412 or 9876543210"
                className="w-full px-3.5 py-2.5 bg-slate-900/90 border border-slate-700 rounded-xl text-xs text-white placeholder-slate-400 focus:outline-none focus:border-teal-400 font-mono"
              />
            </div>

            <button
              onClick={() => onNavigate('reports')}
              className="w-full py-3 bg-teal-500 hover:bg-teal-400 text-slate-950 font-bold text-xs rounded-xl shadow-md transition-all flex items-center justify-center gap-2"
            >
              <FileText className="w-4 h-4" />
              <span>Access & Download Report</span>
            </button>
            <p className="text-[10px] text-slate-400 text-center">
              Sample report available for instant preview on portal
            </p>
          </div>

        </div>
      </section>

      {/* 11. BLOG & HEALTH ARTICLES PREVIEW */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6">
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-4 mb-10">
          <div className="space-y-2">
            <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-blue-50 border border-blue-100 text-blue-900 text-xs font-semibold">
              <span>Patient Education & Health Insights</span>
            </div>
            <h2 className="text-2xl sm:text-4xl font-extrabold text-slate-900 tracking-tight font-display">
              Latest Health & Diagnostic Articles
            </h2>
            <p className="text-xs sm:text-sm text-slate-500">
              Clear medical explanations to help you prepare for tests and interpret reports.
            </p>
          </div>

          <button
            onClick={() => onNavigate('blog')}
            className="px-5 py-2.5 rounded-xl border border-slate-300 hover:border-teal-500 text-slate-700 hover:text-teal-800 text-xs font-semibold inline-flex items-center gap-1.5 transition-all self-start md:self-auto"
          >
            <span>Read All Articles</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </button>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {blogPosts.slice(0, 3).map(post => (
            <div
              key={post.id}
              onClick={() => onNavigate('blog-post', post.slug)}
              className="bg-white rounded-3xl border border-slate-200/90 hover:border-teal-500/40 shadow-xs hover:shadow-lg overflow-hidden cursor-pointer transition-all duration-200 flex flex-col group"
            >
              <div className="h-48 overflow-hidden relative">
                <img
                  src={post.imageUrl}
                  alt={post.title}
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                />
                <span className="absolute top-3 left-3 px-2.5 py-1 bg-slate-900/80 backdrop-blur-xs text-white text-[10px] font-bold rounded-lg uppercase tracking-wider">
                  {post.category}
                </span>
              </div>

              <div className="p-6 flex-1 flex flex-col justify-between space-y-4">
                <div>
                  <div className="flex items-center gap-2 text-[11px] text-slate-400 mb-2">
                    <span>{post.date}</span>
                    <span>•</span>
                    <span>{post.readTime}</span>
                  </div>
                  <h3 className="text-base font-bold text-slate-900 group-hover:text-blue-900 line-clamp-2 transition-colors">
                    {post.title}
                  </h3>
                  <p className="text-xs text-slate-500 line-clamp-2 mt-2 leading-relaxed">
                    {post.excerpt}
                  </p>
                </div>

                <div className="text-xs font-bold text-teal-700 flex items-center gap-1 group-hover:underline pt-2 border-t border-slate-100">
                  <span>Read Article</span>
                  <ChevronRight className="w-3.5 h-3.5" />
                </div>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* 12. FAQ ACCORDION SECTION */}
      <section className="max-w-4xl mx-auto px-4 sm:px-6">
        <div className="text-center mb-10 space-y-3">
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-teal-50 border border-teal-100 text-teal-800 text-xs font-semibold">
            <HelpCircle className="w-3.5 h-3.5" />
            <span>Frequently Asked Questions</span>
          </div>
          <h2 className="text-2xl sm:text-4xl font-extrabold text-slate-900 tracking-tight font-display">
            Common Patient Questions
          </h2>
          <p className="text-xs sm:text-sm text-slate-500">
            Answers to common questions regarding booking, sample collection, and report delivery.
          </p>
        </div>

        <div className="space-y-3">
          {faqs.slice(0, 6).map(faq => {
            const isOpen = faqOpenId === faq.id;
            return (
              <div
                key={faq.id}
                className="bg-white rounded-2xl border border-slate-200 overflow-hidden shadow-2xs transition-all"
              >
                <button
                  onClick={() => setFaqOpenId(isOpen ? null : faq.id)}
                  className="w-full p-4 sm:p-5 text-left flex items-center justify-between gap-4 hover:bg-slate-50/70 transition-colors"
                >
                  <span className="text-sm font-bold text-slate-900">
                    {faq.question}
                  </span>
                  <span className={`w-6 h-6 rounded-full flex items-center justify-center text-xs font-bold shrink-0 transition-transform ${
                    isOpen ? 'bg-blue-900 text-white rotate-180' : 'bg-slate-100 text-slate-500'
                  }`}>
                    ▼
                  </span>
                </button>

                {isOpen && (
                  <div className="px-5 pb-5 text-xs text-slate-600 leading-relaxed border-t border-slate-100 pt-3 animate-in fade-in duration-200">
                    {faq.answer}
                  </div>
                )}
              </div>
            );
          })}
        </div>

        <div className="text-center mt-8">
          <button
            onClick={() => onNavigate('faq')}
            className="text-xs text-teal-700 hover:text-teal-800 font-bold hover:underline inline-flex items-center gap-1"
          >
            <span>View All Patient FAQs</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </button>
        </div>
      </section>

      {/* 13. FINAL CTA BANNER */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 pb-6">
        <div className="bg-gradient-to-r from-blue-900 via-teal-900 to-blue-950 rounded-3xl p-8 sm:p-12 text-white text-center space-y-6 shadow-xl relative overflow-hidden">
          <div className="max-w-2xl mx-auto space-y-3">
            <h2 className="text-2xl sm:text-4xl font-extrabold tracking-tight font-display">
              Ready to Schedule Your Diagnostic Test?
            </h2>
            <p className="text-xs sm:text-sm text-teal-100 leading-relaxed">
              Experience seamless sample collection, advanced automated laboratory testing, and secure digital reports delivered directly to you.
            </p>
          </div>

          <div className="flex flex-wrap items-center justify-center gap-3">
            <button
              onClick={() => onNavigate('book-test')}
              className="px-6 py-3.5 bg-white hover:bg-slate-100 text-blue-950 font-bold text-xs sm:text-sm rounded-xl shadow-lg transition-all"
            >
              Book Test Appointment
            </button>

            <button
              onClick={() => onNavigate('home-collection')}
              className="px-6 py-3.5 bg-teal-500 hover:bg-teal-400 text-slate-950 font-bold text-xs sm:text-sm rounded-xl shadow-lg transition-all flex items-center gap-1.5"
            >
              <HomeIcon className="w-4 h-4" />
              <span>Book Home Collection</span>
            </button>

            <button
              onClick={onOpenWhatsApp}
              className="px-5 py-3.5 bg-slate-900/60 hover:bg-slate-900 text-white font-semibold text-xs sm:text-sm rounded-xl border border-white/20 transition-all flex items-center gap-1.5"
            >
              <MessageSquare className="w-4 h-4 text-emerald-400" />
              <span>WhatsApp Us</span>
            </button>
          </div>
        </div>
      </section>

    </div>
  );
};
