import React, { useState, useEffect } from 'react';
import { 
  Phone, 
  Clock, 
  Mail, 
  MessageSquare, 
  Menu, 
  X, 
  Calendar, 
  Home as HomeIcon, 
  FileText, 
  ShoppingBag, 
  ChevronDown,
  Sparkles,
  UploadCloud,
  ShieldCheck,
  LayoutDashboard,
  Lock,
  LogOut,
  ExternalLink,
  Database
} from 'lucide-react';
import { PageType, CartItem, MenuItem } from '../types';
import { AnnouncementBar } from './AnnouncementBar';
import { useData } from '../context/DataContext';

interface HeaderProps {
  currentPage: PageType;
  onNavigate: (page: PageType, param?: string) => void;
  cart: CartItem[];
  onOpenCart: () => void;
  onOpenBooking: (initialItem?: CartItem) => void;
  onOpenPrescription: () => void;
  onOpenWhatsApp: () => void;
}

export const Header: React.FC<HeaderProps> = ({
  currentPage,
  onNavigate,
  cart = [],
  onOpenCart,
  onOpenBooking,
  onOpenPrescription,
  onOpenWhatsApp
}) => {
  const { 
    isAdminAuthenticated, 
    adminUser, 
    logoutAdmin, 
    siteImages, 
    labInfo, 
    menuItems 
  } = useData();

  const [isScrolled, setIsScrolled] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      if (window.scrollY > 30) {
        setIsScrolled(true);
      } else {
        setIsScrolled(false);
      }
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const handleAdminAuthAction = () => {
    if (isAdminAuthenticated) {
      logoutAdmin();
      if (currentPage === 'admin') {
        onNavigate('home');
      }
    } else {
      onNavigate('admin-login');
    }
  };

  const handleMenuClick = (item: MenuItem) => {
    setMobileMenuOpen(false);
    if (item.isExternal && item.externalUrl) {
      window.open(item.externalUrl, '_blank', 'noopener,noreferrer');
      return;
    }
    if (item.page === 'custom-page' && item.customSlug) {
      onNavigate('custom-page', item.customSlug);
      return;
    }
    onNavigate(item.page, item.customSlug);
  };

  // Filter only enabled menu items sorted by order
  const activeNavItems = (menuItems && menuItems.length > 0)
    ? menuItems.filter(m => m.enabled).sort((a, b) => a.order - b.order)
    : [
        { id: '1', label: 'Home', page: 'home' as PageType, enabled: true, order: 1 },
        { id: '2', label: 'About Us', page: 'about' as PageType, enabled: true, order: 2 },
        { id: '3', label: 'Services', page: 'services' as PageType, enabled: true, order: 3 },
        { id: '4', label: 'Packages', page: 'packages' as PageType, enabled: true, order: 4, highlight: true },
        { id: '5', label: 'All Tests', page: 'tests' as PageType, enabled: true, order: 5 },
        { id: '6', label: 'Home Collection', page: 'home-collection' as PageType, enabled: true, order: 6 },
        { id: '7', label: 'Why Us', page: 'why-choose-us' as PageType, enabled: true, order: 7 },
        { id: '8', label: 'Blog', page: 'blog' as PageType, enabled: true, order: 8 },
        { id: '9', label: 'Contact', page: 'contact' as PageType, enabled: true, order: 9 }
      ];

  const logoSrc = labInfo?.brandLogoUrl || siteImages?.brandLogoUrl;
  const whatsappNumberClean = (labInfo?.whatsappNumber || '+919876543210').replace(/[^0-9]/g, '');

  return (
    <header className="sticky top-0 z-50 w-full bg-white shadow-sm transition-all duration-200">
      {/* Announcement Ribbon */}
      <AnnouncementBar onNavigate={onNavigate} />

      {/* Top Information Bar */}
      <div className="bg-slate-900 text-slate-200 text-xs py-2 px-4 border-b border-slate-800">
        <div className="max-w-7xl mx-auto flex flex-wrap items-center justify-between gap-2.5 sm:gap-4">
          
          {/* Left contact & hours items */}
          <div className="flex flex-wrap items-center gap-3.5 sm:gap-5">
            <a 
              href={`tel:${(labInfo?.phone || '+91 98765 43210').replace(/[^0-9+]/g, '')}`} 
              className="inline-flex items-center gap-1.5 hover:text-teal-400 transition-colors"
              title="Call Central Helpline"
            >
              <Phone className="w-3.5 h-3.5 text-teal-400 shrink-0" />
              <span>Call: <strong className="text-white font-semibold">{labInfo?.phone || '+91 98765 43210'}</strong></span>
            </a>

            <button 
              onClick={onOpenWhatsApp}
              className="inline-flex items-center gap-1.5 hover:text-emerald-400 transition-colors text-slate-200 cursor-pointer"
            >
              <MessageSquare className="w-3.5 h-3.5 text-emerald-400 shrink-0" />
              <span>WhatsApp: <strong className="text-white font-semibold">{labInfo?.whatsappDisplay || '+91 98765 43210'}</strong></span>
            </button>

            <div className="hidden lg:flex items-center gap-1.5 text-slate-400">
              <Clock className="w-3.5 h-3.5 text-teal-400 shrink-0" />
              <span>Hours: <span className="text-slate-200">{labInfo?.timings || 'Mon - Sat: 7:00 AM – 9:00 PM'}</span></span>
            </div>
          </div>

          {/* Right utility buttons: Download Report, LIS Portal & Admin Login/Logout */}
          <div className="flex items-center gap-2 sm:gap-3 ml-auto">
            {/* Download Report */}
            <button
              onClick={() => onNavigate('reports')}
              className="hidden sm:inline-flex items-center gap-1 text-slate-200 hover:text-teal-300 font-semibold transition-colors text-xs cursor-pointer"
              id="topbar-btn-reports"
            >
              <FileText className="w-3.5 h-3.5 text-teal-400" />
              <span>Download Report</span>
            </button>

            {/* LIS Button (Laboratory Information System) */}
            <a
              href="https://emidas.co.in:8890/pages/Login.aspx"
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-lg bg-sky-500/20 hover:bg-sky-500/30 text-sky-300 border border-sky-400/30 hover:border-sky-400/50 text-xs font-bold transition-all shadow-2xs group"
              title="Access Online LIS Portal (EMIDAS)"
              id="topbar-btn-lis"
            >
              <Database className="w-3.5 h-3.5 text-sky-400 group-hover:scale-110 transition-transform" />
              <span>LIS</span>
              <ExternalLink className="w-3 h-3 text-sky-400/80" />
            </a>

            <div className="h-3.5 w-px bg-slate-700 hidden sm:block"></div>

            {/* Admin Login / Logout Controls */}
            {isAdminAuthenticated ? (
              <div className="flex items-center gap-1.5">
                <button
                  onClick={() => onNavigate('admin')}
                  className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-lg bg-teal-500/20 hover:bg-teal-500/30 text-teal-300 border border-teal-500/40 text-xs font-bold transition-all cursor-pointer"
                  title="Go to Admin Dashboard"
                  id="topbar-btn-admin-panel"
                >
                  <LayoutDashboard className="w-3.5 h-3.5 text-teal-400" />
                  <span className="hidden sm:inline">Admin Panel</span>
                  {adminUser && (
                    <span className="hidden md:inline text-[10px] text-teal-200 font-normal">
                      ({adminUser.username})
                    </span>
                  )}
                </button>

                <button
                  onClick={handleAdminAuthAction}
                  className="inline-flex items-center gap-1 px-2.5 py-1 rounded-lg bg-rose-600 hover:bg-rose-500 text-white border border-rose-500 text-xs font-bold transition-all shadow-xs cursor-pointer"
                  title="Log out of Admin Portal"
                  id="topbar-btn-admin-logout"
                >
                  <LogOut className="w-3.5 h-3.5 text-white" />
                  <span>Logout</span>
                </button>
              </div>
            ) : (
              <button
                onClick={() => onNavigate('admin-login')}
                className="inline-flex items-center gap-1.5 px-3 py-1 rounded-lg bg-teal-600 hover:bg-teal-500 text-white border border-teal-500 text-xs font-bold transition-all shadow-xs cursor-pointer"
                title="Login to Admin Portal"
                id="topbar-btn-admin-login"
              >
                <Lock className="w-3.5 h-3.5 text-teal-200" />
                <span>Admin Login</span>
              </button>
            )}
          </div>
        </div>
      </div>

      {/* Main Navigation Bar */}
      <div className={`max-w-7xl mx-auto px-4 sm:px-6 transition-all duration-200 ${isScrolled ? 'py-2.5' : 'py-3.5'}`}>
        <div className="flex items-center justify-between gap-3 lg:gap-6">
          
          {/* Logo & Company Name */}
          <div 
            onClick={() => onNavigate('home')} 
            className="flex items-center gap-2.5 sm:gap-3 cursor-pointer group select-none shrink-0"
            id="nav-brand-logo"
          >
            {logoSrc ? (
              <img 
                src={logoSrc} 
                alt={`${labInfo?.tradeName || 'Microcells'} Logo`} 
                className="h-10 sm:h-11 w-auto max-w-[150px] object-contain rounded-lg"
                referrerPolicy="no-referrer"
              />
            ) : (
              /* Custom Modern Laboratory Icon */
              <div className="w-10 h-10 sm:w-11 sm:h-11 rounded-xl bg-linear-to-br from-blue-900 via-blue-800 to-teal-700 flex items-center justify-center text-white shadow-md group-hover:shadow-teal-500/20 transition-all shrink-0">
                <div className="relative flex items-center justify-center">
                  <svg className="w-6 h-6 text-teal-300" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                    <circle cx="12" cy="12" r="10" stroke="#0ea5e9" strokeWidth="1.5" strokeDasharray="3 3" opacity="0.6"/>
                    <path d="M10 2v7.31M14 9.3V1.99M8.5 2h7M14 9.3a6.5 6.5 0 1 1-4 0M5.52 16h12.96" stroke="#ffffff" />
                    <circle cx="12" cy="15" r="1.5" fill="#38bdf8" />
                  </svg>
                </div>
              </div>
            )}

            <div className="flex flex-col">
              <div className="flex items-center gap-1.5 leading-tight">
                <span className="text-lg sm:text-xl font-extrabold tracking-tight text-blue-950 font-display">
                  {labInfo?.tradeName || 'MICROCELLS'}
                </span>
                <span className="hidden sm:inline-block px-1.5 py-0.2 text-[9px] uppercase font-bold tracking-wider bg-blue-100 text-blue-800 rounded">
                  Pvt. Ltd.
                </span>
              </div>
              <span className="text-[10px] sm:text-[11px] font-medium tracking-wide text-slate-500 uppercase leading-none mt-0.5">
                {labInfo?.tagline || 'Diagnostics & Pathology Lab'}
              </span>
            </div>
          </div>

          {/* Desktop Navigation Links - Dynamically Rendered from CMS */}
          <nav className="hidden xl:flex items-center justify-center gap-1 flex-1 px-2">
            {activeNavItems.map((item) => {
              const isActive = currentPage === item.page;
              return (
                <button
                  key={item.id}
                  onClick={() => handleMenuClick(item)}
                  className={`inline-flex items-center justify-center h-9 px-2.5 lg:px-3 rounded-lg text-[13px] font-semibold tracking-tight leading-none whitespace-nowrap transition-all duration-150 cursor-pointer ${
                    item.highlight 
                      ? 'bg-teal-500/15 text-teal-800 font-bold border border-teal-500/30 shadow-2xs hover:bg-teal-500/25'
                      : isActive 
                        ? 'text-blue-800 font-bold bg-blue-50/90 shadow-2xs' 
                        : 'text-slate-600 hover:text-blue-900 hover:bg-slate-100/80'
                  }`}
                >
                  <span>{item.label}</span>
                  {item.isExternal && <ExternalLink className="w-3 h-3 ml-1 text-slate-400" />}
                </button>
              );
            })}
          </nav>

          {/* Action CTAs */}
          <div className="hidden sm:flex items-center gap-2 shrink-0">
            {/* Upload Rx Prescription Button */}
            <button
              onClick={onOpenPrescription}
              className="inline-flex items-center justify-center h-9 px-3 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-700 text-xs font-bold transition-all duration-150 cursor-pointer border border-slate-200/80"
              title="Upload Doctor Prescription"
              id="nav-btn-prescription"
            >
              <UploadCloud className="w-4 h-4 mr-1.5 text-teal-600 shrink-0" />
              <span>Upload Rx</span>
            </button>

            {/* Book Test / Home Collection CTA Button */}
            <button
              onClick={() => onOpenBooking()}
              className="inline-flex items-center justify-center h-9 px-3.5 rounded-xl bg-gradient-to-r from-teal-600 to-teal-500 hover:from-teal-500 hover:to-teal-400 text-white text-xs font-bold tracking-tight transition-all duration-150 shadow-sm shadow-teal-700/20 active:scale-98 cursor-pointer"
              id="nav-btn-book-test"
            >
              <Calendar className="w-3.5 h-3.5 mr-1.5 text-teal-100 shrink-0" />
              <span>Book a Test</span>
            </button>

            {/* Cart Button */}
            <button
              onClick={onOpenCart}
              className="relative inline-flex items-center justify-center h-9 w-9 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-700 transition-all duration-150 cursor-pointer border border-slate-200/80"
              aria-label="View Selected Tests Cart"
              id="nav-btn-cart"
            >
              <ShoppingBag className="w-4 h-4 text-slate-700 shrink-0" />
              {cart.length > 0 && (
                <span className="absolute -top-1.5 -right-1.5 bg-rose-600 text-white text-[10px] font-extrabold w-5 h-5 rounded-full flex items-center justify-center ring-2 ring-white shadow-xs">
                  {cart.length}
                </span>
              )}
            </button>
          </div>

          {/* Mobile Hamburger Toggle Button */}
          <div className="flex items-center gap-2 xl:hidden">
            <button
              onClick={onOpenCart}
              className="relative p-2 rounded-xl bg-slate-100 text-slate-700 hover:bg-slate-200 transition-colors"
              aria-label="Cart"
            >
              <ShoppingBag className="w-5 h-5" />
              {cart.length > 0 && (
                <span className="absolute -top-1 -right-1 bg-rose-600 text-white text-[10px] font-bold w-4 h-4 rounded-full flex items-center justify-center">
                  {cart.length}
                </span>
              )}
            </button>

            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="p-2 rounded-xl bg-slate-100 text-slate-700 hover:bg-slate-200 transition-colors"
              aria-label="Toggle navigation menu"
            >
              {mobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
            </button>
          </div>

        </div>
      </div>

      {/* Mobile Drawer Menu */}
      {mobileMenuOpen && (
        <div className="xl:hidden bg-white border-b border-slate-200 shadow-xl animate-in slide-in-from-top-2 duration-150">
          <div className="max-w-7xl mx-auto px-4 py-4 space-y-2">
            
            <div className="grid grid-cols-2 gap-2 pb-3 border-b border-slate-100">
              <button
                onClick={() => { setMobileMenuOpen(false); onOpenPrescription(); }}
                className="py-2.5 px-3 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-800 text-xs font-bold flex items-center justify-center gap-1.5"
              >
                <UploadCloud className="w-4 h-4 text-teal-600" />
                <span>Upload Rx</span>
              </button>

              <button
                onClick={() => { setMobileMenuOpen(false); onOpenBooking(); }}
                className="py-2.5 px-3 rounded-xl bg-teal-600 hover:bg-teal-500 text-white text-xs font-bold flex items-center justify-center gap-1.5 shadow-sm"
              >
                <Calendar className="w-4 h-4" />
                <span>Book Test</span>
              </button>
            </div>

            {/* Dynamic Menu Links in Mobile */}
            <div className="space-y-1 py-1">
              {activeNavItems.map((item) => (
                <button
                  key={item.id}
                  onClick={() => handleMenuClick(item)}
                  className={`w-full text-left py-2.5 px-3 rounded-xl text-sm font-semibold flex items-center justify-between ${
                    currentPage === item.page
                      ? 'bg-blue-50 text-blue-900 font-bold'
                      : 'text-slate-700 hover:bg-slate-50'
                  }`}
                >
                  <span>{item.label}</span>
                  {item.highlight && (
                    <span className="px-2 py-0.5 bg-teal-100 text-teal-800 text-[10px] font-bold rounded-md">
                      Special
                    </span>
                  )}
                  {item.isExternal && <ExternalLink className="w-3.5 h-3.5 text-slate-400" />}
                </button>
              ))}
            </div>

            <div className="pt-3 border-t border-slate-100 space-y-2">
              <button
                onClick={() => { setMobileMenuOpen(false); onNavigate('reports'); }}
                className="w-full py-2.5 px-3 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-800 text-xs font-bold flex items-center justify-center gap-2"
              >
                <FileText className="w-4 h-4 text-teal-600" />
                <span>Download Patient Report (UHID)</span>
              </button>
              
              <a
                href="https://emidas.co.in:8890/pages/Login.aspx"
                target="_blank"
                rel="noopener noreferrer"
                className="w-full py-2.5 px-3 rounded-xl bg-sky-50 text-sky-700 border border-sky-200 text-xs font-bold flex items-center justify-center gap-2"
              >
                <Database className="w-4 h-4 text-sky-600" />
                <span>Open Online LIS Portal (EMIDAS)</span>
              </a>
            </div>

          </div>
        </div>
      )}

    </header>
  );
};
