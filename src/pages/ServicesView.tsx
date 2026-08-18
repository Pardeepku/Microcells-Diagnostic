import React, { useState } from 'react';
import { 
  FlaskConical, 
  Activity, 
  TestTube2, 
  ShieldCheck, 
  Microscope, 
  Eye, 
  CheckCircle2, 
  Calendar, 
  ArrowRight, 
  Clock, 
  Cpu,
  Droplet
} from 'lucide-react';
import { PageType, CartItem, TestItem, HealthPackage } from '../types';
import { DIAGNOSTIC_DEPARTMENTS, POPULAR_TESTS } from '../data/labData';
import { useData } from '../context/DataContext';

interface ServicesViewProps {
  onNavigate: (page: PageType, param?: string) => void;
  onBookTest: (initialItem?: CartItem) => void;
  onViewTestDetails: (item: TestItem | HealthPackage, type: 'test' | 'package') => void;
}

export const ServicesView: React.FC<ServicesViewProps> = ({
  onNavigate,
  onBookTest,
  onViewTestDetails
}) => {
  const { siteImages } = useData();
  const [activeDeptId, setActiveDeptId] = useState<string>(DIAGNOSTIC_DEPARTMENTS[0].id);

  const selectedDept = DIAGNOSTIC_DEPARTMENTS.find(d => d.id === activeDeptId) || DIAGNOSTIC_DEPARTMENTS[0];

  const deptImage = 
    selectedDept.id === 'clinical-pathology' ? siteImages.deptClinicalPathology :
    selectedDept.id === 'hematology' ? siteImages.deptHematology :
    selectedDept.id === 'clinical-biochemistry' ? siteImages.deptBiochemistry :
    selectedDept.id === 'microbiology' ? siteImages.deptMicrobiology :
    selectedDept.id === 'serology-immunology' ? siteImages.deptSerology :
    selectedDept.id === 'preventive-health' ? siteImages.deptPreventive :
    selectedDept.imageUrl;

  // Get matching tests in this category
  const matchingTests = POPULAR_TESTS.filter(t => t.category === selectedDept.title);

  return (
    <div className="space-y-12 sm:space-y-16 py-8">
      
      {/* Header Banner */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6">
        <div className="bg-gradient-to-r from-blue-950 via-slate-900 to-teal-950 text-white rounded-3xl p-8 sm:p-12 relative overflow-hidden">
          <div className="max-w-3xl space-y-3 relative z-10">
            <span className="px-3 py-1 bg-teal-500/20 text-teal-300 text-xs font-bold rounded-full border border-teal-500/30 uppercase tracking-wider inline-block">
              Clinical Specializations
            </span>
            <h1 className="text-3xl sm:text-5xl font-extrabold tracking-tight font-display">
              Our Diagnostic Services
            </h1>
            <p className="text-sm sm:text-base text-slate-300 leading-relaxed">
              Comprehensive pathology and laboratory testing services organized across six core medical disciplines.
            </p>
          </div>
        </div>
      </section>

      {/* Main Department Layout */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6">
        
        {/* Department Selector Tabs */}
        <div className="flex items-center gap-2 overflow-x-auto pb-4 mb-8 border-b border-slate-200 scrollbar-none">
          {DIAGNOSTIC_DEPARTMENTS.map((dept) => {
            const isSelected = dept.id === activeDeptId;
            return (
              <button
                key={dept.id}
                onClick={() => setActiveDeptId(dept.id)}
                className={`px-4 py-3 rounded-2xl text-xs font-bold whitespace-nowrap transition-all flex items-center gap-2 ${
                  isSelected 
                    ? 'bg-blue-900 text-white shadow-md shadow-blue-950/20' 
                    : 'bg-white border border-slate-200 text-slate-700 hover:bg-slate-50 hover:border-slate-300'
                }`}
              >
                <span>{dept.title}</span>
              </button>
            );
          })}
        </div>

        {/* Active Department Details */}
        <div className="bg-white rounded-3xl border border-slate-200 shadow-xs p-6 sm:p-10 space-y-10">
          
          {/* Top Hero of Department */}
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-center">
            <div className="lg:col-span-7 space-y-4">
              <div className="inline-flex items-center gap-2 text-xs font-bold text-teal-700 uppercase tracking-wider">
                <span>Department Profile</span>
              </div>
              <h2 className="text-2xl sm:text-3xl font-extrabold text-slate-900 font-display">
                {selectedDept.title}
              </h2>
              <p className="text-sm font-semibold text-slate-700 leading-snug">
                {selectedDept.subtitle}
              </p>
              <p className="text-xs sm:text-sm text-slate-600 leading-relaxed">
                {selectedDept.description}
              </p>

              <div className="bg-slate-50 p-4 rounded-2xl border border-slate-200 space-y-2">
                <span className="text-xs font-bold text-slate-900 flex items-center gap-2">
                  <Cpu className="w-4 h-4 text-teal-700" />
                  <span>Instrumentation & Methodology Overview</span>
                </span>
                <p className="text-xs text-slate-600 leading-relaxed">
                  {selectedDept.methodologyOverview}
                </p>
              </div>
            </div>

            <div className="lg:col-span-5">
              <div className="rounded-2xl overflow-hidden shadow-lg border border-slate-200 h-64 sm:h-72">
                <img
                  src={deptImage || selectedDept.imageUrl}
                  alt={selectedDept.title}
                  className="w-full h-full object-cover"
                  referrerPolicy="no-referrer"
                />
              </div>
            </div>
          </div>

          {/* Key Clinical Highlights */}
          <div className="space-y-4 pt-4 border-t border-slate-100">
            <h3 className="text-base font-bold text-slate-900">
              Department Capabilities & Quality Highlights
            </h3>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              {selectedDept.keyHighlights.map((highlight, index) => (
                <div key={index} className="flex items-start gap-2.5 p-3 rounded-xl bg-teal-50/50 border border-teal-100 text-xs text-slate-800">
                  <CheckCircle2 className="w-4 h-4 text-teal-600 shrink-0 mt-0.5" />
                  <span>{highlight}</span>
                </div>
              ))}
            </div>
          </div>

          {/* Subcategory Investigation Breakdown */}
          <div className="space-y-6 pt-4 border-t border-slate-100">
            <h3 className="text-base font-bold text-slate-900">
              Diagnostic Service Categories & Test Parameters
            </h3>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
              {selectedDept.subcategories.map((sub, idx) => (
                <div key={idx} className="bg-slate-50 rounded-2xl p-5 border border-slate-200 space-y-3 flex flex-col justify-between">
                  <div>
                    <h4 className="text-xs font-bold text-blue-950 uppercase tracking-wide mb-1">
                      {sub.title}
                    </h4>
                    <p className="text-[11px] text-slate-500 mb-3 leading-relaxed">
                      {sub.description}
                    </p>

                    <ul className="space-y-1.5 border-t border-slate-200/80 pt-2.5">
                      {sub.tests.map((testName, i) => (
                        <li key={i} className="text-xs text-slate-700 flex items-center gap-1.5">
                          <span className="w-1.5 h-1.5 rounded-full bg-teal-500 shrink-0"></span>
                          <span>{testName}</span>
                        </li>
                      ))}
                    </ul>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Available Popular Tests in this Category */}
          {matchingTests.length > 0 && (
            <div className="space-y-4 pt-4 border-t border-slate-100">
              <div className="flex items-center justify-between">
                <h3 className="text-base font-bold text-slate-900">
                  Popular Tests in {selectedDept.title}
                </h3>
                <button
                  onClick={() => onNavigate('tests')}
                  className="text-xs text-teal-700 font-bold hover:underline"
                >
                  View All Tests in Catalog
                </button>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                {matchingTests.map(test => (
                  <div key={test.id} className="p-4 rounded-2xl border border-slate-200 bg-white space-y-2.5">
                    <div className="flex items-center justify-between text-[11px]">
                      <span className="font-mono text-slate-400">{test.code}</span>
                      <span className="font-bold text-slate-900">₹{test.price}</span>
                    </div>
                    <h4 className="text-xs font-bold text-slate-900 line-clamp-1">{test.name}</h4>
                    <p className="text-[11px] text-slate-500 line-clamp-2">{test.description}</p>
                    <div className="flex items-center justify-between pt-2 border-t border-slate-100">
                      <button
                        onClick={() => onViewTestDetails(test, 'test')}
                        className="text-[11px] text-teal-700 font-semibold hover:underline"
                      >
                        Details
                      </button>
                      <button
                        onClick={() => onBookTest({
                          id: test.id,
                          type: 'test',
                          name: test.name,
                          price: test.price
                        })}
                        className="px-3 py-1 bg-blue-900 text-white rounded-lg text-[11px] font-semibold hover:bg-blue-800"
                      >
                        Book Test
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* CTA Bar */}
          <div className="bg-gradient-to-r from-blue-900 to-teal-900 text-white p-6 rounded-2xl flex flex-col sm:flex-row items-center justify-between gap-4">
            <div>
              <h4 className="text-sm sm:text-base font-bold">Need assistance choosing the right diagnostic test?</h4>
              <p className="text-xs text-teal-200 mt-0.5">Our laboratory desk can guide you based on your prescription or symptoms.</p>
            </div>
            <button
              onClick={() => onNavigate('book-test')}
              className="px-5 py-2.5 bg-white text-blue-950 font-bold text-xs rounded-xl hover:bg-slate-100 transition-all shrink-0"
            >
              Book an Appointment
            </button>
          </div>

        </div>

      </section>

    </div>
  );
};
