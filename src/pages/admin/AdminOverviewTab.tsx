import React from 'react';
import { 
  FlaskConical, 
  Package, 
  HelpCircle, 
  BookOpen, 
  CalendarCheck, 
  FileText, 
  Settings, 
  ArrowUpRight, 
  Download, 
  Upload, 
  RotateCcw, 
  CheckCircle2, 
  Clock, 
  TrendingUp, 
  ShieldAlert,
  Sparkles,
  PhoneCall,
  KeyRound
} from 'lucide-react';
import { AdminTab, BookingRequest } from '../../types';
import { useData } from '../../context/DataContext';

interface AdminOverviewTabProps {
  onSelectTab?: (tab: AdminTab) => void;
  onNavigateTab?: (tab: AdminTab) => void;
  onShowToast: (msg: string) => void;
}

export const AdminOverviewTab: React.FC<AdminOverviewTabProps> = ({
  onSelectTab,
  onNavigateTab,
  onShowToast
}) => {
  const handleSelectTab = (tab: AdminTab) => {
    if (onSelectTab) {
      onSelectTab(tab);
    } else if (onNavigateTab) {
      onNavigateTab(tab);
    }
  };
  const { 
    tests, 
    packages, 
    faqs, 
    blogPosts, 
    bookings, 
    patientReports, 
    announcement,
    exportDataJSON,
    importDataJSON,
    resetToDefaults,
    updateBookingStatus
  } = useData();

  const handleExport = () => {
    const jsonStr = exportDataJSON();
    const blob = new Blob([jsonStr], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `microcells_backup_${new Date().toISOString().slice(0,10)}.json`;
    a.click();
    URL.revokeObjectURL(url);
    onShowToast('Database exported successfully as JSON file');
  };

  const handleImportFile = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      const file = e.target.files[0];
      const reader = new FileReader();
      reader.onload = (event) => {
        const text = event.target?.result as string;
        if (text) {
          const ok = importDataJSON(text);
          if (ok) {
            onShowToast('Database restored successfully from backup!');
          } else {
            alert('Failed to parse JSON backup file. Please ensure it is a valid Microcells export.');
          }
        }
      };
      reader.readAsText(file);
    }
  };

  const handleReset = () => {
    if (window.confirm('Are you sure you want to reset all diagnostic tests, packages, FAQs, and reports back to default factory records? Any custom additions will be cleared.')) {
      resetToDefaults();
      onShowToast('All data has been reset to defaults');
    }
  };

  const pendingBookings = bookings.filter(b => b.status !== 'Report Ready');

  return (
    <div className="space-y-8 animate-in fade-in duration-200">
      
      {/* Top Welcome Banner */}
      <div className="bg-gradient-to-r from-sky-950 via-slate-900 to-teal-950 text-white rounded-3xl p-6 sm:p-8 relative overflow-hidden shadow-md">
        <div className="relative z-10 flex flex-col md:flex-row md:items-center justify-between gap-6">
          <div className="space-y-2 max-w-2xl">
            <div className="flex items-center gap-2">
              <span className="px-2.5 py-0.5 rounded-md bg-teal-500/20 text-teal-300 text-[11px] font-bold uppercase tracking-wider border border-teal-500/30">
                LIMS Command Center
              </span>
              <span className="text-xs text-slate-300 font-mono">Real-time Portal Manager</span>
            </div>
            <h2 className="text-2xl sm:text-3xl font-extrabold tracking-tight font-display">
              Diagnostic Content & Operational Control
            </h2>
            <p className="text-xs sm:text-sm text-slate-300 leading-relaxed">
              Create, update, and manage all pathology tests, health packages, patient FAQs, medical blog articles, appointments, and lab announcements in real-time.
            </p>
          </div>

          <div className="flex flex-wrap items-center gap-2.5 shrink-0">
            <button
              id="btn-overview-add-test"
              type="button"
              onClick={() => handleSelectTab('tests')}
              className="px-4 py-2.5 bg-teal-500 hover:bg-teal-400 active:scale-95 text-slate-950 text-xs font-bold rounded-xl shadow-xs transition-all flex items-center gap-1.5 cursor-pointer"
            >
              <FlaskConical className="w-4 h-4" />
              <span>+ Add New Test</span>
            </button>

            <button
              id="btn-overview-add-package"
              type="button"
              onClick={() => handleSelectTab('packages')}
              className="px-4 py-2.5 bg-white/10 hover:bg-white/20 active:scale-95 text-white text-xs font-bold rounded-xl border border-white/20 transition-all flex items-center gap-1.5 cursor-pointer"
            >
              <Package className="w-4 h-4" />
              <span>+ New Package</span>
            </button>
          </div>
        </div>

        {/* Announcement Indicator */}
        {announcement.enabled && (
          <div className="mt-5 pt-4 border-t border-white/10 flex items-center justify-between gap-4 text-xs">
            <div className="flex items-center gap-2 text-teal-200">
              <Sparkles className="w-4 h-4 text-teal-400 shrink-0" />
              <span><strong>Live Site Banner:</strong> {announcement.text}</span>
            </div>
            <button
              id="btn-overview-edit-banner"
              type="button"
              onClick={() => handleSelectTab('settings')}
              className="text-[11px] font-semibold text-white/80 hover:text-white underline shrink-0 cursor-pointer"
            >
              Edit Banner
            </button>
          </div>
        )}
      </div>

      {/* Primary KPI Cards Grid */}
      <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-4">
        
        {/* 1. Active Tests */}
        <button
          id="stat-card-tests"
          type="button"
          onClick={() => handleSelectTab('tests')}
          className="bg-white rounded-2xl p-4 border border-slate-200 shadow-2xs hover:border-teal-500 hover:shadow-lg hover:scale-[1.02] active:scale-[0.98] transition-all cursor-pointer group text-left focus:outline-none focus:ring-2 focus:ring-teal-500"
          title="Click to view and manage Tests Catalog"
        >
          <div className="flex items-center justify-between text-slate-400 mb-2">
            <div className="p-2 rounded-xl bg-sky-50 text-sky-900 group-hover:bg-sky-900 group-hover:text-white transition-colors shadow-2xs">
              <FlaskConical className="w-4 h-4" />
            </div>
            <ArrowUpRight className="w-4 h-4 text-slate-400 group-hover:text-teal-600 group-hover:translate-x-0.5 group-hover:-translate-y-0.5 transition-all" />
          </div>
          <p className="text-2xl font-black text-slate-900 group-hover:text-teal-700 transition-colors">{tests.length}</p>
          <p className="text-xs font-semibold text-slate-500 mt-0.5 flex items-center justify-between">
            <span>Active Tests</span>
            <span className="text-[10px] font-bold text-teal-600 opacity-0 group-hover:opacity-100 transition-opacity">View &rarr;</span>
          </p>
        </button>

        {/* 2. Health Packages */}
        <button
          id="stat-card-packages"
          type="button"
          onClick={() => handleSelectTab('packages')}
          className="bg-white rounded-2xl p-4 border border-slate-200 shadow-2xs hover:border-teal-500 hover:shadow-lg hover:scale-[1.02] active:scale-[0.98] transition-all cursor-pointer group text-left focus:outline-none focus:ring-2 focus:ring-teal-500"
          title="Click to view and manage Health Packages"
        >
          <div className="flex items-center justify-between text-slate-400 mb-2">
            <div className="p-2 rounded-xl bg-teal-50 text-teal-800 group-hover:bg-teal-700 group-hover:text-white transition-colors shadow-2xs">
              <Package className="w-4 h-4" />
            </div>
            <ArrowUpRight className="w-4 h-4 text-slate-400 group-hover:text-teal-600 group-hover:translate-x-0.5 group-hover:-translate-y-0.5 transition-all" />
          </div>
          <p className="text-2xl font-black text-slate-900 group-hover:text-teal-700 transition-colors">{packages.length}</p>
          <p className="text-xs font-semibold text-slate-500 mt-0.5 flex items-center justify-between">
            <span>Health Packages</span>
            <span className="text-[10px] font-bold text-teal-600 opacity-0 group-hover:opacity-100 transition-opacity">View &rarr;</span>
          </p>
        </button>

        {/* 3. Appointments / Bookings */}
        <button
          id="stat-card-bookings"
          type="button"
          onClick={() => handleSelectTab('bookings')}
          className="bg-white rounded-2xl p-4 border border-slate-200 shadow-2xs hover:border-amber-500 hover:shadow-lg hover:scale-[1.02] active:scale-[0.98] transition-all cursor-pointer group text-left focus:outline-none focus:ring-2 focus:ring-amber-500"
          title="Click to view and manage Appointments & Home Collections"
        >
          <div className="flex items-center justify-between text-slate-400 mb-2">
            <div className="p-2 rounded-xl bg-amber-50 text-amber-800 group-hover:bg-amber-600 group-hover:text-white transition-colors shadow-2xs">
              <CalendarCheck className="w-4 h-4" />
            </div>
            <span className="text-[10px] font-bold px-1.5 py-0.5 bg-amber-100 text-amber-900 group-hover:bg-amber-200 rounded-md transition-colors">
              {pendingBookings.length} Active
            </span>
          </div>
          <p className="text-2xl font-black text-slate-900 group-hover:text-amber-700 transition-colors">{bookings.length}</p>
          <p className="text-xs font-semibold text-slate-500 mt-0.5 flex items-center justify-between">
            <span>Appointments</span>
            <span className="text-[10px] font-bold text-amber-600 opacity-0 group-hover:opacity-100 transition-opacity">View &rarr;</span>
          </p>
        </button>

        {/* 4. Patient Reports */}
        <button
          id="stat-card-reports"
          type="button"
          onClick={() => handleSelectTab('reports')}
          className="bg-white rounded-2xl p-4 border border-slate-200 shadow-2xs hover:border-indigo-500 hover:shadow-lg hover:scale-[1.02] active:scale-[0.98] transition-all cursor-pointer group text-left focus:outline-none focus:ring-2 focus:ring-indigo-500"
          title="Click to view and manage Patient Diagnostic Reports"
        >
          <div className="flex items-center justify-between text-slate-400 mb-2">
            <div className="p-2 rounded-xl bg-indigo-50 text-indigo-800 group-hover:bg-indigo-700 group-hover:text-white transition-colors shadow-2xs">
              <FileText className="w-4 h-4" />
            </div>
            <ArrowUpRight className="w-4 h-4 text-slate-400 group-hover:text-indigo-600 group-hover:translate-x-0.5 group-hover:-translate-y-0.5 transition-all" />
          </div>
          <p className="text-2xl font-black text-slate-900 group-hover:text-indigo-700 transition-colors">{patientReports.length}</p>
          <p className="text-xs font-semibold text-slate-500 mt-0.5 flex items-center justify-between">
            <span>Patient Reports</span>
            <span className="text-[10px] font-bold text-indigo-600 opacity-0 group-hover:opacity-100 transition-opacity">View &rarr;</span>
          </p>
        </button>

        {/* 5. Blog Articles */}
        <button
          id="stat-card-blog"
          type="button"
          onClick={() => handleSelectTab('blog')}
          className="bg-white rounded-2xl p-4 border border-slate-200 shadow-2xs hover:border-rose-500 hover:shadow-lg hover:scale-[1.02] active:scale-[0.98] transition-all cursor-pointer group text-left focus:outline-none focus:ring-2 focus:ring-rose-500"
          title="Click to view and manage Health Blog Articles"
        >
          <div className="flex items-center justify-between text-slate-400 mb-2">
            <div className="p-2 rounded-xl bg-rose-50 text-rose-800 group-hover:bg-rose-700 group-hover:text-white transition-colors shadow-2xs">
              <BookOpen className="w-4 h-4" />
            </div>
            <ArrowUpRight className="w-4 h-4 text-slate-400 group-hover:text-rose-600 group-hover:translate-x-0.5 group-hover:-translate-y-0.5 transition-all" />
          </div>
          <p className="text-2xl font-black text-slate-900 group-hover:text-rose-700 transition-colors">{blogPosts.length}</p>
          <p className="text-xs font-semibold text-slate-500 mt-0.5 flex items-center justify-between">
            <span>Blog Articles</span>
            <span className="text-[10px] font-bold text-rose-600 opacity-0 group-hover:opacity-100 transition-opacity">View &rarr;</span>
          </p>
        </button>

        {/* 6. FAQ Items */}
        <button
          id="stat-card-faqs"
          type="button"
          onClick={() => handleSelectTab('faqs')}
          className="bg-white rounded-2xl p-4 border border-slate-200 shadow-2xs hover:border-purple-500 hover:shadow-lg hover:scale-[1.02] active:scale-[0.98] transition-all cursor-pointer group text-left focus:outline-none focus:ring-2 focus:ring-purple-500"
          title="Click to view and manage Patient FAQs"
        >
          <div className="flex items-center justify-between text-slate-400 mb-2">
            <div className="p-2 rounded-xl bg-purple-50 text-purple-800 group-hover:bg-purple-700 group-hover:text-white transition-colors shadow-2xs">
              <HelpCircle className="w-4 h-4" />
            </div>
            <ArrowUpRight className="w-4 h-4 text-slate-400 group-hover:text-purple-600 group-hover:translate-x-0.5 group-hover:-translate-y-0.5 transition-all" />
          </div>
          <p className="text-2xl font-black text-slate-900 group-hover:text-purple-700 transition-colors">{faqs.length}</p>
          <p className="text-xs font-semibold text-slate-500 mt-0.5 flex items-center justify-between">
            <span>FAQ Items</span>
            <span className="text-[10px] font-bold text-purple-600 opacity-0 group-hover:opacity-100 transition-opacity">View &rarr;</span>
          </p>
        </button>

      </div>

      {/* Recent Appointments & Fast Action Shortcuts */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        
        {/* Recent Patient Bookings (2 cols) */}
        <div className="lg:col-span-2 bg-white rounded-3xl border border-slate-200 p-6 shadow-2xs space-y-4">
          <div className="flex items-center justify-between">
            <div>
              <h3 className="text-base font-bold text-slate-900 font-display">Recent Patient Bookings & Home Visits</h3>
              <p className="text-xs text-slate-500">Live feed of appointment submissions from the patient portal</p>
            </div>
            <button
              id="btn-overview-view-all-bookings"
              type="button"
              onClick={() => handleSelectTab('bookings')}
              className="text-xs font-bold text-teal-700 hover:text-teal-800 flex items-center gap-1 cursor-pointer"
            >
              <span>View All ({bookings.length})</span>
              <ArrowUpRight className="w-3.5 h-3.5" />
            </button>
          </div>

          <div className="space-y-3">
            {bookings.slice(0, 4).map((b) => (
              <div 
                key={b.id}
                className="p-4 rounded-2xl border border-slate-100 hover:border-slate-300 bg-slate-50/60 hover:bg-white transition-all flex flex-col sm:flex-row sm:items-center justify-between gap-3"
              >
                <div className="space-y-1 min-w-0">
                  <div className="flex items-center gap-2">
                    <span className="font-bold text-xs text-slate-900">{b.patientName}</span>
                    <span className="text-[11px] text-slate-400 font-mono">({b.gender}, {b.age}y)</span>
                    <span className={`px-2 py-0.5 rounded-md text-[10px] font-bold ${
                      b.serviceType === 'home' 
                        ? 'bg-purple-100 text-purple-800' 
                        : 'bg-sky-100 text-sky-800'
                    }`}>
                      {b.serviceType === 'home' ? 'Home Collection' : 'Lab Walk-in'}
                    </span>
                  </div>

                  <p className="text-xs text-slate-600 truncate">
                    {b.selectedTests.concat(b.selectedPackages).join(', ') || 'Prescription Attached'}
                  </p>

                  <div className="flex items-center gap-3 text-[11px] text-slate-400">
                    <span>📅 {b.preferredDate} ({b.preferredTimeSlot})</span>
                    <span>•</span>
                    <span>Ref: {b.referenceNumber}</span>
                  </div>
                </div>

                <div className="flex items-center gap-2 shrink-0">
                  <select
                    value={b.status}
                    onChange={(e) => updateBookingStatus(b.id, e.target.value as BookingRequest['status'])}
                    className="text-xs font-semibold px-2.5 py-1.5 rounded-xl border border-slate-200 bg-white focus:outline-none focus:ring-1 focus:ring-teal-500"
                  >
                    <option value="Confirmed">Confirmed</option>
                    <option value="Sample Collection Scheduled">Sample Scheduled</option>
                    <option value="Sample Received">Sample Received</option>
                    <option value="Processing">Processing</option>
                    <option value="Report Ready">Report Ready</option>
                  </select>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Database Utilities & Quick Actions (1 col) */}
        <div className="bg-white rounded-3xl border border-slate-200 p-6 shadow-2xs space-y-5">
          <div>
            <h3 className="text-base font-bold text-slate-900 font-display">Data Management & Backup</h3>
            <p className="text-xs text-slate-500">Export or restore your custom laboratory configuration</p>
          </div>

          <div className="space-y-3">
            {/* Change Password & Security Settings */}
            <button
              id="btn-overview-change-password"
              type="button"
              onClick={() => handleSelectTab('settings')}
              className="w-full p-3 rounded-2xl bg-teal-50/70 hover:bg-teal-50 border border-teal-200 hover:border-teal-400 text-teal-950 text-xs font-bold transition-all flex items-center justify-between cursor-pointer"
            >
              <div className="flex items-center gap-2.5">
                <div className="p-2 rounded-xl bg-teal-600 shadow-2xs text-white">
                  <KeyRound className="w-4 h-4" />
                </div>
                <div className="text-left">
                  <p className="font-bold text-teal-900">Change Admin Password</p>
                  <p className="text-[10px] text-teal-700 font-normal">Manage credentials & security policies</p>
                </div>
              </div>
              <ArrowUpRight className="w-4 h-4 text-teal-600" />
            </button>

            {/* Export JSON */}
            <button
              onClick={handleExport}
              className="w-full p-3 rounded-2xl bg-slate-50 hover:bg-teal-50 border border-slate-200 hover:border-teal-300 text-slate-800 hover:text-teal-900 text-xs font-bold transition-all flex items-center justify-between"
            >
              <div className="flex items-center gap-2.5">
                <div className="p-2 rounded-xl bg-white shadow-2xs text-teal-700">
                  <Download className="w-4 h-4" />
                </div>
                <div className="text-left">
                  <p className="font-bold">Backup Database (JSON)</p>
                  <p className="text-[10px] text-slate-500 font-normal">Download tests, packages, FAQs & reports</p>
                </div>
              </div>
              <ArrowUpRight className="w-4 h-4 text-slate-400" />
            </button>

            {/* Import JSON */}
            <label className="w-full p-3 rounded-2xl bg-slate-50 hover:bg-sky-50 border border-slate-200 hover:border-sky-300 text-slate-800 hover:text-sky-900 text-xs font-bold transition-all flex items-center justify-between cursor-pointer">
              <div className="flex items-center gap-2.5">
                <div className="p-2 rounded-xl bg-white shadow-2xs text-sky-700">
                  <Upload className="w-4 h-4" />
                </div>
                <div className="text-left">
                  <p className="font-bold">Restore from Backup</p>
                  <p className="text-[10px] text-slate-500 font-normal">Upload previously saved JSON database</p>
                </div>
              </div>
              <input 
                type="file" 
                accept=".json"
                onChange={handleImportFile}
                className="hidden" 
              />
              <ArrowUpRight className="w-4 h-4 text-slate-400" />
            </label>

            {/* Reset Defaults */}
            <button
              onClick={handleReset}
              className="w-full p-3 rounded-2xl bg-rose-50/50 hover:bg-rose-50 border border-rose-200 text-rose-900 text-xs font-bold transition-all flex items-center justify-between"
            >
              <div className="flex items-center gap-2.5">
                <div className="p-2 rounded-xl bg-white shadow-2xs text-rose-600">
                  <RotateCcw className="w-4 h-4" />
                </div>
                <div className="text-left">
                  <p className="font-bold">Reset Factory Defaults</p>
                  <p className="text-[10px] text-rose-600/80 font-normal">Restore original catalog dataset</p>
                </div>
              </div>
              <ShieldAlert className="w-4 h-4 text-rose-400" />
            </button>
          </div>

          <div className="p-4 rounded-2xl bg-sky-50/70 border border-sky-200 text-slate-700 space-y-1 text-xs">
            <p className="font-bold text-sky-950 flex items-center gap-1.5">
              <CheckCircle2 className="w-3.5 h-3.5 text-teal-600" />
              <span>Zero-Code Instant Sync</span>
            </p>
            <p className="text-[11px] text-slate-600 leading-relaxed">
              All edits to tests, pricing, FAQs, packages, and reports immediately synchronize across the entire patient web portal and persist across sessions.
            </p>
          </div>
        </div>

      </div>

    </div>
  );
};
