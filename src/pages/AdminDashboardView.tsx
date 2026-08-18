import React, { useState } from 'react';
import { 
  LayoutDashboard, 
  FlaskConical, 
  Package, 
  HelpCircle, 
  BookOpen, 
  CalendarCheck, 
  FileText, 
  Settings, 
  ArrowLeft, 
  ShieldCheck, 
  Sparkles,
  ExternalLink,
  CheckCircle,
  X
} from 'lucide-react';
import { PageType, AdminTab, PatientReportRecord } from '../types';
import { useData } from '../context/DataContext';
import { AdminOverviewTab } from './admin/AdminOverviewTab';
import { AdminTestsTab } from './admin/AdminTestsTab';
import { AdminPackagesTab } from './admin/AdminPackagesTab';
import { AdminFAQsTab } from './admin/AdminFAQsTab';
import { AdminBlogTab } from './admin/AdminBlogTab';
import { AdminBookingsTab } from './admin/AdminBookingsTab';
import { AdminReportsTab } from './admin/AdminReportsTab';
import { AdminSettingsTab } from './admin/AdminSettingsTab';
import { ReportViewerModal } from '../components/ReportViewerModal';

interface AdminDashboardViewProps {
  onNavigate: (page: PageType, param?: string) => void;
  initialTab?: AdminTab;
}

export const AdminDashboardView: React.FC<AdminDashboardViewProps> = ({ 
  onNavigate, 
  initialTab = 'overview' 
}) => {
  const [activeTab, setActiveTab] = useState<AdminTab>(initialTab);
  const [toastMessage, setToastMessage] = useState<string | null>(null);
  const [activeViewingReport, setActiveViewingReport] = useState<PatientReportRecord | null>(null);

  const { tests, packages, faqs, blogPosts, bookings, patientReports } = useData();

  const showToast = (msg: string) => {
    setToastMessage(msg);
    setTimeout(() => {
      setToastMessage(null);
    }, 3500);
  };

  const navItems: { id: AdminTab; label: string; icon: React.FC<{ className?: string }>; count?: number }[] = [
    { id: 'overview', label: 'Overview & Stats', icon: LayoutDashboard },
    { id: 'tests', label: 'Tests Catalog', icon: FlaskConical, count: tests.length },
    { id: 'packages', label: 'Health Packages', icon: Package, count: packages.length },
    { id: 'faqs', label: 'Patient FAQs', icon: HelpCircle, count: faqs.length },
    { id: 'blog', label: 'Health Blog', icon: BookOpen, count: blogPosts.length },
    { id: 'bookings', label: 'Appointments', icon: CalendarCheck, count: bookings.length },
    { id: 'reports', label: 'Diagnostic Reports', icon: FileText, count: patientReports.length },
    { id: 'settings', label: 'Lab Settings', icon: Settings },
  ];

  return (
    <div className="min-h-screen bg-slate-100/70 text-slate-800 pb-20">
      
      {/* Toast Notification */}
      {toastMessage && (
        <div className="fixed bottom-6 right-6 z-50 bg-slate-900 text-white px-5 py-3 rounded-2xl shadow-2xl flex items-center gap-3 border border-slate-800 animate-in slide-in-from-bottom-5 duration-200">
          <CheckCircle className="w-5 h-5 text-teal-400 shrink-0" />
          <span className="text-xs font-semibold">{toastMessage}</span>
          <button 
            onClick={() => setToastMessage(null)}
            className="p-1 hover:bg-slate-800 rounded-lg text-slate-400 hover:text-white"
          >
            <X className="w-4 h-4" />
          </button>
        </div>
      )}

      {/* Admin Top Header */}
      <header className="bg-slate-900 text-white border-b border-slate-800 sticky top-0 z-40 shadow-md">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
          
          <div className="flex items-center gap-3">
            <button
              onClick={() => onNavigate('home')}
              className="p-2 text-slate-400 hover:text-white hover:bg-slate-800 rounded-xl transition-all flex items-center gap-1.5 text-xs font-bold mr-2"
              title="Return to Public Website"
            >
              <ArrowLeft className="w-4 h-4" />
              <span className="hidden sm:inline">Back to Website</span>
            </button>

            <div className="h-6 w-px bg-slate-800 hidden sm:block"></div>

            <div className="flex items-center gap-2.5">
              <div className="w-8 h-8 rounded-xl bg-teal-500/20 border border-teal-500/30 flex items-center justify-center text-teal-400 font-black text-sm">
                M
              </div>
              <div>
                <div className="flex items-center gap-2">
                  <h1 className="text-sm font-bold tracking-tight text-white font-display">
                    Micro Cells Diagnostics
                  </h1>
                  <span className="px-2 py-0.5 bg-teal-500/20 text-teal-300 border border-teal-500/30 rounded-md text-[10px] font-bold">
                    Admin Portal
                  </span>
                </div>
                <p className="text-[10px] text-slate-400 hidden sm:block">
                  Live Content Management System (No-Code Operations)
                </p>
              </div>
            </div>
          </div>

          {/* Quick links & Status */}
          <div className="flex items-center gap-3">
            <div className="hidden md:flex items-center gap-2 text-xs text-slate-300 bg-slate-800/80 px-3 py-1.5 rounded-xl border border-slate-700">
              <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse"></span>
              <span className="text-[11px] font-medium">Database Synced</span>
            </div>

            <button
              onClick={() => onNavigate('home')}
              className="px-3.5 py-1.5 bg-teal-600 hover:bg-teal-500 text-white rounded-xl text-xs font-bold transition-all shadow-xs flex items-center gap-1.5"
            >
              <span>View Site</span>
              <ExternalLink className="w-3.5 h-3.5" />
            </button>
          </div>

        </div>

        {/* Secondary Navigation Tabs Ribbon */}
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 overflow-x-auto scrollbar-none border-t border-slate-800/60">
          <nav className="flex space-x-1 py-2">
            {navItems.map((tab) => {
              const Icon = tab.icon;
              const isActive = activeTab === tab.id;
              return (
                <button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id)}
                  className={`flex items-center gap-2 px-3.5 py-2 rounded-xl text-xs font-bold transition-all whitespace-nowrap ${
                    isActive
                      ? 'bg-teal-600 text-white shadow-sm'
                      : 'text-slate-400 hover:text-slate-200 hover:bg-slate-800/60'
                  }`}
                >
                  <Icon className={`w-4 h-4 ${isActive ? 'text-white' : 'text-slate-400'}`} />
                  <span>{tab.label}</span>
                  {tab.count !== undefined && (
                    <span className={`px-1.5 py-0.5 rounded-md text-[10px] font-bold ${
                      isActive ? 'bg-teal-700 text-white' : 'bg-slate-800 text-slate-400'
                    }`}>
                      {tab.count}
                    </span>
                  )}
                </button>
              );
            })}
          </nav>
        </div>
      </header>

      {/* Main Admin Content Container */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-8">
        
        {activeTab === 'overview' && (
          <AdminOverviewTab 
            onNavigateTab={(tab) => setActiveTab(tab)} 
            onShowToast={showToast} 
          />
        )}

        {activeTab === 'tests' && (
          <AdminTestsTab onShowToast={showToast} />
        )}

        {activeTab === 'packages' && (
          <AdminPackagesTab onShowToast={showToast} />
        )}

        {activeTab === 'faqs' && (
          <AdminFAQsTab onShowToast={showToast} />
        )}

        {activeTab === 'blog' && (
          <AdminBlogTab 
            onShowToast={showToast} 
            onPreviewPost={(slug) => onNavigate('blog-post', slug)} 
          />
        )}

        {activeTab === 'bookings' && (
          <AdminBookingsTab onShowToast={showToast} />
        )}

        {activeTab === 'reports' && (
          <AdminReportsTab 
            onShowToast={showToast} 
            onViewReport={(report) => setActiveViewingReport(report)}
          />
        )}

        {activeTab === 'settings' && (
          <AdminSettingsTab onShowToast={showToast} />
        )}

      </main>

      {/* Report Modal Preview */}
      <ReportViewerModal 
        report={activeViewingReport} 
        isOpen={Boolean(activeViewingReport)}
        onClose={() => setActiveViewingReport(null)} 
      />

    </div>
  );
};
