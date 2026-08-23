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
  X, 
  LogOut, 
  UserCheck, 
  Image as ImageIcon, 
  KeyRound,
  Compass,
  Layers,
  Edit3,
  Menu,
  ChevronRight
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
import { AdminImagesTab } from './admin/AdminImagesTab';
import { AdminBrandingTab } from './admin/AdminBrandingTab';
import { AdminMenuTab } from './admin/AdminMenuTab';
import { AdminContentCmsTab } from './admin/AdminContentCmsTab';
import { AdminPagesTab } from './admin/AdminPagesTab';
import { AdminSettingsTab } from './admin/AdminSettingsTab';
import { ReportViewerModal } from '../components/ReportViewerModal';
import { ChangePasswordModal } from '../components/ChangePasswordModal';
import { AdminLoginView } from './AdminLoginView';

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
  const [isChangePasswordModalOpen, setIsChangePasswordModalOpen] = useState(false);
  const [isMobileSidebarOpen, setIsMobileSidebarOpen] = useState(false);

  const { 
    tests, 
    packages, 
    faqs, 
    blogPosts, 
    bookings, 
    patientReports,
    customPages,
    isAdminAuthenticated,
    adminUser,
    logoutAdmin,
    labInfo
  } = useData();

  const showToast = (msg: string) => {
    setToastMessage(msg);
    setTimeout(() => {
      setToastMessage(null);
    }, 3500);
  };

  // If user is not authenticated, render the dedicated Admin Login Page
  if (!isAdminAuthenticated) {
    return (
      <AdminLoginView 
        onNavigate={onNavigate} 
        onLoginSuccess={() => showToast('Welcome to the Admin Portal')} 
      />
    );
  }

  const handleLogout = () => {
    logoutAdmin();
    showToast('Logged out of Admin Portal');
  };

  const navItems: { id: AdminTab; label: string; icon: React.FC<{ className?: string }>; count?: number; highlight?: boolean; group?: string }[] = [
    { id: 'overview', label: 'Overview', icon: LayoutDashboard, group: 'Core' },
    { id: 'branding', label: 'Branding & Logo', icon: Sparkles, highlight: true, group: 'Website CMS' },
    { id: 'cms', label: 'Website Text CMS', icon: Edit3, highlight: true, group: 'Website CMS' },
    { id: 'menu', label: 'Menu Bar', icon: Compass, group: 'Website CMS' },
    { id: 'pages', label: 'Manage Pages', icon: Layers, count: customPages.length, group: 'Website CMS' },
    { id: 'images', label: 'Site Images', icon: ImageIcon, group: 'Website CMS' },
    { id: 'tests', label: 'Tests Catalog', icon: FlaskConical, count: tests.length, group: 'Diagnostics' },
    { id: 'packages', label: 'Health Packages', icon: Package, count: packages.length, group: 'Diagnostics' },
    { id: 'bookings', label: 'Appointments', icon: CalendarCheck, count: bookings.length, group: 'Operations' },
    { id: 'reports', label: 'Reports', icon: FileText, count: patientReports.length, group: 'Operations' },
    { id: 'blog', label: 'Blog Posts', icon: BookOpen, count: blogPosts.length, group: 'Content' },
    { id: 'faqs', label: 'FAQs', icon: HelpCircle, count: faqs.length, group: 'Content' },
    { id: 'settings', label: 'Lab Settings', icon: Settings, group: 'System' },
  ];

  const currentNav = navItems.find(item => item.id === activeTab);

  const handleSelectTab = (tab: AdminTab) => {
    setActiveTab(tab);
    setIsMobileSidebarOpen(false);
  };

  return (
    <div className="min-h-screen bg-slate-100/70 text-slate-800 flex flex-col lg:flex-row">
      
      {/* Toast Notification */}
      {toastMessage && (
        <div className="fixed bottom-6 right-6 z-50 bg-slate-900 text-white px-5 py-3 rounded-2xl shadow-2xl flex items-center gap-3 border border-slate-800 animate-in slide-in-from-bottom-5 duration-200">
          <CheckCircle className="w-5 h-5 text-teal-400 shrink-0" />
          <span className="text-xs font-semibold">{toastMessage}</span>
          <button 
            onClick={() => setToastMessage(null)}
            className="p-1 hover:bg-slate-800 rounded-lg text-slate-400 hover:text-white cursor-pointer"
          >
            <X className="w-4 h-4" />
          </button>
        </div>
      )}

      {/* Mobile Sidebar Backdrop */}
      {isMobileSidebarOpen && (
        <div 
          className="fixed inset-0 bg-slate-950/70 backdrop-blur-xs z-40 lg:hidden animate-in fade-in duration-200"
          onClick={() => setIsMobileSidebarOpen(false)}
        />
      )}

      {/* Left Side Panel (Sidebar) */}
      <aside className={`
        fixed lg:sticky top-0 inset-y-0 left-0 z-50
        w-72 bg-slate-900 text-slate-200 flex flex-col h-screen
        border-r border-slate-800 shadow-2xl lg:shadow-none
        transition-transform duration-300 ease-in-out
        ${isMobileSidebarOpen ? 'translate-x-0' : '-translate-x-full lg:translate-x-0'}
      `}>
        
        {/* Sidebar Header & Brand */}
        <div className="p-4 sm:p-5 border-b border-slate-800/80 flex items-center justify-between shrink-0 bg-slate-950/40">
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 rounded-xl bg-gradient-to-br from-teal-500 to-teal-700 flex items-center justify-center text-white font-black text-base shadow-md shadow-teal-900/30">
              M
            </div>
            <div>
              <div className="flex items-center gap-1.5">
                <h1 className="text-sm font-bold tracking-tight text-white font-display">
                  {labInfo?.shortName || 'Microcells'}
                </h1>
                <span className="px-1.5 py-0.5 bg-teal-500/20 text-teal-300 border border-teal-500/30 rounded text-[9px] font-bold">
                  CMS
                </span>
              </div>
              <p className="text-[10px] text-slate-400 font-medium">
                Admin Control Center
              </p>
            </div>
          </div>

          <button
            onClick={() => setIsMobileSidebarOpen(false)}
            className="p-1.5 text-slate-400 hover:text-white hover:bg-slate-800 rounded-lg lg:hidden cursor-pointer"
            title="Close Sidebar"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Navigation Options List */}
        <div className="flex-1 overflow-y-auto py-4 px-3 space-y-1 scrollbar-thin scrollbar-thumb-slate-800 scrollbar-track-transparent">
          <div className="px-3 pb-2 text-[10px] font-bold tracking-wider text-slate-400 uppercase">
            Admin Navigation
          </div>

          {navItems.map((item) => {
            const Icon = item.icon;
            const isActive = activeTab === item.id;
            return (
              <button
                key={item.id}
                onClick={() => handleSelectTab(item.id)}
                id={`sidebar-tab-${item.id}`}
                className={`w-full flex items-center justify-between px-3 py-2.5 rounded-xl text-xs font-semibold transition-all duration-150 group cursor-pointer ${
                  isActive
                    ? 'bg-teal-600 text-white font-bold shadow-md shadow-teal-950/50'
                    : item.highlight
                      ? 'text-teal-300 hover:bg-slate-800/80 hover:text-white'
                      : 'text-slate-300 hover:bg-slate-800/70 hover:text-white'
                }`}
              >
                <div className="flex items-center gap-3 min-w-0">
                  <Icon className={`w-4 h-4 shrink-0 transition-transform group-hover:scale-110 ${
                    isActive 
                      ? 'text-white' 
                      : item.highlight 
                        ? 'text-teal-400' 
                        : 'text-slate-400 group-hover:text-slate-200'
                  }`} />
                  <span className="truncate text-left">{item.label}</span>
                </div>

                <div className="flex items-center gap-1.5 shrink-0">
                  {item.count !== undefined && (
                    <span className={`px-2 py-0.5 rounded-md text-[10px] font-bold ${
                      isActive 
                        ? 'bg-teal-700/80 text-white' 
                        : 'bg-slate-800 text-slate-300 group-hover:bg-slate-700'
                    }`}>
                      {item.count}
                    </span>
                  )}
                  {isActive && (
                    <ChevronRight className="w-3.5 h-3.5 text-teal-200" />
                  )}
                </div>
              </button>
            );
          })}
        </div>

        {/* Sidebar Footer Info & Quick Actions */}
        <div className="p-3 border-t border-slate-800/80 bg-slate-950/50 space-y-2 shrink-0">
          
          {/* Admin User Info */}
          {adminUser && (
            <div className="flex items-center gap-2.5 px-2 py-1.5 rounded-xl bg-slate-800/60 border border-slate-800">
              <div className="w-7 h-7 rounded-lg bg-teal-500/20 border border-teal-500/30 flex items-center justify-center text-teal-300 font-bold text-xs shrink-0">
                {adminUser.name.charAt(0)}
              </div>
              <div className="min-w-0 flex-1">
                <div className="text-xs font-bold text-white truncate leading-tight">
                  {adminUser.name}
                </div>
                <div className="text-[10px] text-teal-400 font-medium">
                  {adminUser.role}
                </div>
              </div>
              <div className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse shrink-0" title="Firestore Connected"></div>
            </div>
          )}

          {/* Quick Actions Grid */}
          <div className="grid grid-cols-2 gap-1.5 pt-1">
            <button
              onClick={() => setIsChangePasswordModalOpen(true)}
              className="px-2.5 py-1.5 bg-slate-800/90 hover:bg-slate-700 text-slate-300 hover:text-white rounded-lg text-[11px] font-semibold border border-slate-700/60 flex items-center justify-center gap-1.5 transition-colors cursor-pointer"
              title="Change Password"
              id="sidebar-btn-change-password"
            >
              <KeyRound className="w-3 h-3 text-teal-400" />
              <span>Password</span>
            </button>

            <button
              onClick={() => onNavigate('home')}
              className="px-2.5 py-1.5 bg-slate-800/90 hover:bg-slate-700 text-slate-300 hover:text-white rounded-lg text-[11px] font-semibold border border-slate-700/60 flex items-center justify-center gap-1.5 transition-colors cursor-pointer"
              title="View Public Website"
            >
              <ExternalLink className="w-3 h-3 text-sky-400" />
              <span>View Site</span>
            </button>
          </div>

          <button
            onClick={handleLogout}
            className="w-full py-2 bg-rose-950/60 hover:bg-rose-900/80 text-rose-200 hover:text-white border border-rose-900/60 rounded-xl text-xs font-bold flex items-center justify-center gap-2 transition-colors cursor-pointer"
            id="sidebar-btn-logout"
          >
            <LogOut className="w-3.5 h-3.5 text-rose-400" />
            <span>Log Out of Admin</span>
          </button>
        </div>

      </aside>

      {/* Main Content Area */}
      <div className="flex-1 flex flex-col min-w-0">
        
        {/* Main Content Top Navigation Bar */}
        <header className="bg-white border-b border-slate-200/80 sticky top-0 z-30 shadow-xs">
          <div className="px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between gap-4">
            
            {/* Left: Mobile Toggle & Page Breadcrumb */}
            <div className="flex items-center gap-3 min-w-0">
              <button
                onClick={() => setIsMobileSidebarOpen(true)}
                className="p-2 text-slate-600 hover:text-slate-900 hover:bg-slate-100 rounded-xl lg:hidden cursor-pointer"
                title="Open Navigation Menu"
              >
                <Menu className="w-5 h-5" />
              </button>

              <div className="min-w-0">
                <div className="flex items-center gap-2 text-xs text-slate-400 font-medium">
                  <span>Admin</span>
                  <span>/</span>
                  <span className="text-teal-700 font-semibold">{currentNav?.group || 'Section'}</span>
                </div>
                <h2 className="text-base sm:text-lg font-bold text-slate-900 tracking-tight truncate font-display">
                  {currentNav?.label || 'Overview'}
                </h2>
              </div>
            </div>

            {/* Right: Quick actions */}
            <div className="flex items-center gap-2 sm:gap-3 shrink-0">
              
              <div className="hidden sm:flex items-center gap-1.5 text-xs text-emerald-700 bg-emerald-50 px-2.5 py-1 rounded-full border border-emerald-200">
                <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse"></span>
                <span className="text-[11px] font-semibold">Live Firestore</span>
              </div>

              <button
                onClick={() => onNavigate('home')}
                className="p-2 sm:px-3 sm:py-1.5 bg-slate-100 hover:bg-slate-200 text-slate-700 rounded-xl text-xs font-bold transition-all flex items-center gap-1.5 cursor-pointer"
                title="Return to Public Patient Website"
              >
                <ArrowLeft className="w-4 h-4 text-slate-500" />
                <span className="hidden md:inline">Back to Website</span>
              </button>

              <button
                onClick={handleLogout}
                className="p-2 sm:px-3 sm:py-1.5 bg-rose-50 hover:bg-rose-100 text-rose-700 border border-rose-200 rounded-xl text-xs font-bold transition-all flex items-center gap-1.5 cursor-pointer"
                title="Log out of Admin Portal"
              >
                <LogOut className="w-4 h-4 text-rose-500" />
                <span className="hidden sm:inline">Logout</span>
              </button>

            </div>

          </div>
        </header>

        {/* Tab Content Body */}
        <main className="flex-1 p-4 sm:p-6 lg:p-8 max-w-7xl w-full mx-auto pb-20">
          
          {activeTab === 'overview' && (
            <AdminOverviewTab 
              onSelectTab={(tab) => setActiveTab(tab)}
              onNavigateTab={(tab) => setActiveTab(tab)} 
              onShowToast={showToast} 
            />
          )}

          {activeTab === 'branding' && (
            <AdminBrandingTab onShowToast={showToast} />
          )}

          {activeTab === 'cms' && (
            <AdminContentCmsTab onShowToast={showToast} />
          )}

          {activeTab === 'menu' && (
            <AdminMenuTab onShowToast={showToast} />
          )}

          {activeTab === 'pages' && (
            <AdminPagesTab 
              onShowToast={showToast} 
              onNavigateToPage={onNavigate}
            />
          )}

          {activeTab === 'images' && (
            <AdminImagesTab onShowToast={showToast} />
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

      </div>

      {/* Report Modal Preview */}
      <ReportViewerModal 
        report={activeViewingReport} 
        isOpen={Boolean(activeViewingReport)}
        onClose={() => setActiveViewingReport(null)} 
      />

      {/* Change Password Modal */}
      <ChangePasswordModal 
        isOpen={isChangePasswordModalOpen}
        onClose={() => setIsChangePasswordModalOpen(false)}
        onSuccess={(msg) => showToast(msg)}
      />

    </div>
  );
};

