import React from 'react';
import { 
  ShieldCheck, 
  Award, 
  Cpu, 
  Clock, 
  Users, 
  Sparkles, 
  CheckCircle2, 
  Eye, 
  QrCode, 
  FileText, 
  HeartHandshake,
  ArrowRight
} from 'lucide-react';
import { PageType } from '../types';
import { TRUST_POINTS, LAB_INFO } from '../data/labData';

interface WhyChooseUsViewProps {
  onNavigate: (page: PageType) => void;
}

export const WhyChooseUsView: React.FC<WhyChooseUsViewProps> = ({ onNavigate }) => {
  return (
    <div className="space-y-16 py-8">
      
      {/* Banner */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6">
        <div className="bg-gradient-to-r from-blue-950 via-slate-900 to-teal-950 text-white rounded-3xl p-8 sm:p-14 relative overflow-hidden">
          <div className="max-w-3xl space-y-4 relative z-10">
            <span className="px-3 py-1 bg-teal-500/20 text-teal-300 text-xs font-bold rounded-full border border-teal-500/30 uppercase tracking-wider inline-block">
              Clinical Precision & Trust
            </span>
            <h1 className="text-3xl sm:text-5xl font-extrabold tracking-tight font-display">
              Why Choose Microcells Diagnostics?
            </h1>
            <p className="text-sm sm:text-base text-slate-300 leading-relaxed">
              Discover how our commitment to automated technology, multi-level quality controls, barcoded tracking, and patient-first ethics sets us apart.
            </p>
          </div>
        </div>
      </section>

      {/* 8 Distinct Pillars */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          {TRUST_POINTS.map((item, index) => (
            <div
              key={index}
              className="bg-white rounded-3xl p-8 border border-slate-200 shadow-xs hover:shadow-lg transition-all space-y-4 flex flex-col justify-between"
            >
              <div className="space-y-3">
                <div className="flex items-center justify-between">
                  <div className="w-12 h-12 rounded-2xl bg-blue-50 text-blue-900 flex items-center justify-center font-black text-base">
                    0{index + 1}
                  </div>
                  <span className="px-3 py-1 bg-teal-50 text-teal-800 rounded-full text-[11px] font-bold">
                    Standard of Care
                  </span>
                </div>

                <h3 className="text-lg font-bold text-slate-900 font-display">
                  {item.title}
                </h3>

                <p className="text-xs sm:text-sm text-slate-600 leading-relaxed">
                  {item.desc}
                </p>
              </div>

              <div className="pt-4 border-t border-slate-100 flex items-center gap-2 text-xs text-teal-700 font-semibold">
                <CheckCircle2 className="w-4 h-4 text-teal-600" />
                <span>Verified Diagnostic Protocol</span>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* The Quality Cycle Infographic */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6">
        <div className="bg-slate-900 text-white rounded-3xl p-8 sm:p-12 space-y-8">
          <div className="max-w-2xl space-y-2">
            <span className="text-teal-400 text-xs font-bold uppercase tracking-wider">Quality Assurance</span>
            <h2 className="text-2xl sm:text-3xl font-extrabold font-display">
              Uncompromising 4-Tier Verification Process
            </h2>
            <p className="text-xs text-slate-400">
              How every sample is checked, cross-checked, and authenticated before reaching your hands:
            </p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            <div className="bg-slate-800/80 p-5 rounded-2xl border border-slate-700 space-y-2">
              <span className="text-teal-400 font-mono text-sm font-black">Tier 1</span>
              <h4 className="text-sm font-bold text-white">Pre-Analytical Check</h4>
              <p className="text-xs text-slate-400 leading-relaxed">
                Verification of sample volume, absence of hemolysis or lipemia, correct tube color, and barcode match.
              </p>
            </div>

            <div className="bg-slate-800/80 p-5 rounded-2xl border border-slate-700 space-y-2">
              <span className="text-teal-400 font-mono text-sm font-black">Tier 2</span>
              <h4 className="text-sm font-bold text-white">Daily Multi-Level QC</h4>
              <p className="text-xs text-slate-400 leading-relaxed">
                Running low, normal, and high control serums daily on all automated chemistry and hematology analyzers.
              </p>
            </div>

            <div className="bg-slate-800/80 p-5 rounded-2xl border border-slate-700 space-y-2">
              <span className="text-teal-400 font-mono text-sm font-black">Tier 3</span>
              <h4 className="text-sm font-bold text-white">Delta Check & Correlation</h4>
              <p className="text-xs text-slate-400 leading-relaxed">
                LIMS software flags unusual deviations against patient historic baseline values for automatic re-run.
              </p>
            </div>

            <div className="bg-slate-800/80 p-5 rounded-2xl border border-slate-700 space-y-2">
              <span className="text-teal-400 font-mono text-sm font-black">Tier 4</span>
              <h4 className="text-sm font-bold text-white">Doctor Sign-off</h4>
              <p className="text-xs text-slate-400 leading-relaxed">
                Consultant pathologist validates findings, peripheral blood smears, and critical biological flags.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Bottom */}
      <section className="max-w-4xl mx-auto px-4 sm:px-6 text-center space-y-4">
        <h3 className="text-xl font-bold text-slate-900">
          Experience High Accuracy Pathology Services
        </h3>
        <p className="text-xs text-slate-500 max-w-md mx-auto">
          Book your routine or preventive tests today with flexible doorstep sample collection.
        </p>
        <div className="flex justify-center gap-3">
          <button
            onClick={() => onNavigate('book-test')}
            className="px-6 py-3.5 bg-blue-900 hover:bg-blue-800 text-white font-bold text-xs rounded-xl shadow-md transition-all inline-flex items-center gap-2"
          >
            <span>Book a Test Appointment</span>
            <ArrowRight className="w-4 h-4" />
          </button>
          <button
            onClick={() => onNavigate('packages')}
            className="px-6 py-3.5 bg-white border border-slate-300 hover:border-teal-500 text-slate-800 font-bold text-xs rounded-xl transition-all"
          >
            View Health Packages
          </button>
        </div>
      </section>

    </div>
  );
};
