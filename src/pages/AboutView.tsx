import React from 'react';
import { 
  ShieldCheck, 
  Award, 
  Users, 
  Cpu, 
  Clock, 
  CheckCircle2, 
  HeartHandshake, 
  Microscope,
  Building2,
  Calendar,
  ArrowRight
} from 'lucide-react';
import { PageType } from '../types';
import { LAB_INFO } from '../data/labData';
import { useData } from '../context/DataContext';

interface AboutViewProps {
  onNavigate: (page: PageType) => void;
}

export const AboutView: React.FC<AboutViewProps> = ({ onNavigate }) => {
  const { siteImages } = useData();
  return (
    <div className="space-y-16 sm:space-y-20 py-8">
      
      {/* Page Header */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6">
        <div className="bg-gradient-to-r from-blue-950 via-slate-900 to-teal-950 text-white rounded-3xl p-8 sm:p-14 relative overflow-hidden">
          <div className="max-w-3xl space-y-4 relative z-10">
            <span className="px-3 py-1 bg-teal-500/20 text-teal-300 text-xs font-bold rounded-full border border-teal-500/30 uppercase tracking-wider inline-block">
              About Our Laboratory
            </span>
            <h1 className="text-3xl sm:text-5xl font-extrabold tracking-tight font-display">
              Microcells Diagnostics Pvt. Ltd.
            </h1>
            <p className="text-sm sm:text-base text-slate-300 leading-relaxed">
              Committed to providing dependable pathology and diagnostic services using modern technology, standardized processes, skilled professionals, and quality-focused laboratory practices.
            </p>
          </div>
        </div>
      </section>

      {/* Corporate Overview & Mission */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
          
          <div className="lg:col-span-6 space-y-5 text-xs sm:text-sm text-slate-600 leading-relaxed">
            <h2 className="text-2xl sm:text-3xl font-extrabold text-slate-900 font-display">
              Pioneering Diagnostic Precision & Patient Care
            </h2>

            <p>
              Microcells Diagnostics Pvt. Ltd. was established with a singular objective: to make high-accuracy pathology and diagnostic testing accessible, seamless, and patient-friendly. In modern clinical practice, diagnostic findings influence a significant majority of clinical decisions. We take this responsibility with the utmost diligence.
            </p>

            <p>
              Our central reference laboratory operates automated discrete analyzers, 5-part and 6-part hematology counters, and ultrasensitive chemiluminescence systems. Every biological sample is tagged with unique two-dimensional barcodes, ensuring an unbreakable chain of custody from the moment of venipuncture to final electronic authorization.
            </p>

            <div className="grid grid-cols-2 gap-4 pt-3 text-slate-800 font-semibold text-xs">
              <div className="p-4 bg-slate-50 rounded-2xl border border-slate-200">
                <span className="text-teal-700 text-xl font-black block mb-1">Our Mission</span>
                <p className="text-slate-600 font-normal leading-relaxed text-[11px]">
                  Deliver accurate, timely, and clinically validated diagnostic insights to empower physicians and patients.
                </p>
              </div>

              <div className="p-4 bg-slate-50 rounded-2xl border border-slate-200">
                <span className="text-blue-900 text-xl font-black block mb-1">Our Vision</span>
                <p className="text-slate-600 font-normal leading-relaxed text-[11px]">
                  To be the most trusted diagnostic partner through uncompromising quality control and patient care.
                </p>
              </div>
            </div>
          </div>

          <div className="lg:col-span-6">
            <div className="rounded-3xl overflow-hidden shadow-2xl border border-slate-200 relative">
              <img
                src={siteImages.homeAboutLab || "https://images.unsplash.com/photo-1579154204601-01588f351e67?auto=format&fit=crop&w=900&q=80"}
                alt="Laboratory Infrastructure"
                className="w-full h-80 sm:h-96 object-cover"
                referrerPolicy="no-referrer"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-slate-950/70 via-transparent to-transparent" />
              <div className="absolute bottom-6 left-6 right-6 p-4 rounded-2xl bg-white/95 backdrop-blur-md border border-slate-100 text-xs">
                <h3 className="font-bold text-slate-900">Modern Reference Facility</h3>
                <p className="text-slate-500 text-[11px] mt-0.5">Equipped with robotic chemistry and automated incubation systems</p>
              </div>
            </div>
          </div>

        </div>
      </section>

      {/* 6 Core Pillars of Quality */}
      <section className="bg-slate-50 py-16 border-y border-slate-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6">
          <div className="text-center max-w-2xl mx-auto mb-12 space-y-3">
            <span className="px-3 py-1 bg-teal-100 text-teal-800 text-xs font-bold rounded-full">
              Quality Assurance
            </span>
            <h2 className="text-2xl sm:text-3xl font-extrabold text-slate-900 font-display">
              Our Core Operational Pillars
            </h2>
            <p className="text-xs text-slate-500">
              Standardized processes ensuring clinical dependability across every investigation.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            <div className="p-6 bg-white rounded-2xl border border-slate-200 space-y-3">
              <div className="w-10 h-10 rounded-xl bg-blue-50 text-blue-900 flex items-center justify-center">
                <Award className="w-5 h-5" />
              </div>
              <h3 className="text-sm font-bold text-slate-900">Standardized Protocols</h3>
              <p className="text-xs text-slate-500 leading-relaxed">
                Adherence to international clinical laboratory operational standards, multi-level controls, and daily reagent calibration.
              </p>
            </div>

            <div className="p-6 bg-white rounded-2xl border border-slate-200 space-y-3">
              <div className="w-10 h-10 rounded-xl bg-teal-50 text-teal-800 flex items-center justify-center">
                <Cpu className="w-5 h-5" />
              </div>
              <h3 className="text-sm font-bold text-slate-900">Automated Robotics</h3>
              <p className="text-xs text-slate-500 leading-relaxed">
                Minimal human handling through automated primary tube sampling, barcode accessioning, and direct bi-directional LIS integration.
              </p>
            </div>

            <div className="p-6 bg-white rounded-2xl border border-slate-200 space-y-3">
              <div className="w-10 h-10 rounded-xl bg-cyan-50 text-cyan-800 flex items-center justify-center">
                <ShieldCheck className="w-5 h-5" />
              </div>
              <h3 className="text-sm font-bold text-slate-900">Sample Integrity & Cold-Chain</h3>
              <p className="text-xs text-slate-500 leading-relaxed">
                Specimens travel inside insulated cool boxes with digital temperature data loggers to protect cellular and enzyme stability.
              </p>
            </div>

            <div className="p-6 bg-white rounded-2xl border border-slate-200 space-y-3">
              <div className="w-10 h-10 rounded-xl bg-emerald-50 text-emerald-800 flex items-center justify-center">
                <Users className="w-5 h-5" />
              </div>
              <h3 className="text-sm font-bold text-slate-900">Certified Phlebotomists</h3>
              <p className="text-xs text-slate-500 leading-relaxed">
                Continuous training in sterile venipuncture, vein locating, pediatric care, and patient comfort.
              </p>
            </div>

            <div className="p-6 bg-white rounded-2xl border border-slate-200 space-y-3">
              <div className="w-10 h-10 rounded-xl bg-indigo-50 text-indigo-800 flex items-center justify-center">
                <Microscope className="w-5 h-5" />
              </div>
              <h3 className="text-sm font-bold text-slate-900">Pathologist Verification</h3>
              <p className="text-xs text-slate-500 leading-relaxed">
                Senior consultant pathologists review abnormal parameters, manual peripheral smears, and critical biological flags before release.
              </p>
            </div>

            <div className="p-6 bg-white rounded-2xl border border-slate-200 space-y-3">
              <div className="w-10 h-10 rounded-xl bg-purple-50 text-purple-800 flex items-center justify-center">
                <Clock className="w-5 h-5" />
              </div>
              <h3 className="text-sm font-bold text-slate-900">Rapid Turnaround</h3>
              <p className="text-xs text-slate-500 leading-relaxed">
                Same-day report availability for routine tests with instant SMS, WhatsApp notifications, and online PDF downloads.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Leadership & Laboratory Team Placeholders */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6">
        <div className="text-center max-w-2xl mx-auto mb-10 space-y-2">
          <h2 className="text-2xl sm:text-3xl font-extrabold text-slate-900 font-display">
            Laboratory Leadership & Technical Faculty
          </h2>
          <p className="text-xs text-slate-500">
            Guided by experienced diagnostic professionals and certified laboratory managers.
          </p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          <div className="p-6 rounded-3xl bg-white border border-slate-200 text-center space-y-3 shadow-xs hover:shadow-md transition-shadow">
            <div className="w-24 h-24 rounded-2xl overflow-hidden mx-auto border-2 border-teal-500/30 shadow-sm bg-slate-100">
              <img
                src={siteImages.doctorAnand || "https://images.unsplash.com/photo-1622253692010-333f2da6031d?auto=format&fit=crop&w=600&q=80"}
                alt="Dr. Anand Verma, MD"
                className="w-full h-full object-cover object-top"
                referrerPolicy="no-referrer"
              />
            </div>
            <div>
              <h3 className="text-base font-bold text-slate-900">Dr. Anand Verma, MD</h3>
              <p className="text-xs text-teal-700 font-semibold">Chief Pathologist & Medical Director</p>
              <p className="text-[11px] text-slate-500 mt-2">
                Overseeing microscopic morphology, cellular smear reviews, and critical biological correlations.
              </p>
            </div>
          </div>

          <div className="p-6 rounded-3xl bg-white border border-slate-200 text-center space-y-3 shadow-xs hover:shadow-md transition-shadow">
            <div className="w-24 h-24 rounded-2xl overflow-hidden mx-auto border-2 border-teal-500/30 shadow-sm bg-slate-100">
              <img
                src={siteImages.doctorPriya || "https://images.unsplash.com/photo-1594824813571-638f02614d3f?auto=format&fit=crop&w=600&q=80"}
                alt="Dr. Priya Sharma, MD"
                className="w-full h-full object-cover object-top"
                referrerPolicy="no-referrer"
              />
            </div>
            <div>
              <h3 className="text-base font-bold text-slate-900">Dr. Priya Sharma, MD</h3>
              <p className="text-xs text-teal-700 font-semibold">Consultant Microbiologist & Infection Control</p>
              <p className="text-[11px] text-slate-500 mt-2">
                Specialist in bacterial cultures, antibiotic susceptibility titration, and PCR diagnostics.
              </p>
            </div>
          </div>

          <div className="p-6 rounded-3xl bg-white border border-slate-200 text-center space-y-3 shadow-xs hover:shadow-md transition-shadow">
            <div className="w-24 h-24 rounded-2xl overflow-hidden mx-auto border-2 border-teal-500/30 shadow-sm bg-slate-100">
              <img
                src={siteImages.doctorRajesh || "https://images.unsplash.com/photo-1537368910025-700350fe46c7?auto=format&fit=crop&w=600&q=80"}
                alt="Dr. Rajesh Patel, PhD"
                className="w-full h-full object-cover object-top"
                referrerPolicy="no-referrer"
              />
            </div>
            <div>
              <h3 className="text-base font-bold text-slate-900">Dr. Rajesh Patel, PhD</h3>
              <p className="text-xs text-teal-700 font-semibold">Head of Clinical Biochemistry & QC</p>
              <p className="text-[11px] text-slate-500 mt-2">
                Managing multi-point analyzer calibrations, internal QC standard deviations, and cold-chain compliance.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Bottom */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6">
        <div className="p-8 rounded-3xl bg-blue-900 text-white flex flex-col sm:flex-row items-center justify-between gap-6 shadow-xl">
          <div>
            <h3 className="text-xl font-bold">Have Questions About Our Diagnostic Services?</h3>
            <p className="text-xs text-teal-200 mt-1">Our clinical desk is available to assist you with test selections and appointments.</p>
          </div>
          <div className="flex gap-3">
            <button
              onClick={() => onNavigate('contact')}
              className="px-5 py-3 bg-white text-blue-900 font-bold text-xs rounded-xl hover:bg-slate-100 transition-all"
            >
              Contact Laboratory
            </button>
            <button
              onClick={() => onNavigate('tests')}
              className="px-5 py-3 bg-teal-500 text-slate-950 font-bold text-xs rounded-xl hover:bg-teal-400 transition-all"
            >
              Browse All Tests
            </button>
          </div>
        </div>
      </section>

    </div>
  );
};
