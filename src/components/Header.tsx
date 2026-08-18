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
import { PageType, CartItem } from '../types';
import { LAB_INFO } from '../data/labData';
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
  const { isAdminAuthenticated, adminUser, logoutAdmin } = useData();
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

  const navItems: { label: string; page: PageType }[] = [
    { label: 'Home', page: 'home' },
    { label: 'About Us', page: 'about' },
    { label: 'Services', page: 'services' },
    { label: 'Packages', page: 'packages' },
    { label: 'All Tests', page: 'tests' },
    { label: 'Home Collection', page: 'home-collection' },
    { label: 'Why Us', page: 'why-choose-us' },
    { label: 'Blog', page: 'blog' },
    { label: 'Contact', page: 'contact' },
  ];

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
              href={`tel:${LAB_INFO.phone.replace(/[^0-9+]/g, '')}`} 
              className="inline-flex items-center gap-1.5 hover:text-teal-400 transition-colors"
              title="Call Central Helpline"
            >
              <Phone className="w-3.5 h-3.5 text-teal-400 shrink-0" />
              <span>Call: <strong className="text-white font-semibold">{LAB_INFO.phone}</strong></span>
            </a>

            <button 
              onClick={onOpenWhatsApp}
              className="inline-flex items-center gap-1.5 hover:text-emerald-400 transition-colors text-slate-200"
            >
              <MessageSquare className="w-3.5 h-3.5 text-emerald-400 shrink-0" />
              <span>WhatsApp: <strong className="text-white font-semibold">{LAB_INFO.whatsappDisplay}</strong></span>
            </button>

            <div className="hidden lg:flex items-center gap-1.5 text-slate-400">
              <Clock className="w-3.5 h-3.5 text-teal-400 shrink-0" />
              <span>Hours: <span className="text-slate-200">{LAB_INFO.timings}</span></span>
            </div>
          </div>

          {/* Right utility buttons: Download Report, LIS Portal & Admin Login/Logout */}
          <div className="flex items-center gap-2 sm:gap-3 ml-auto">
            {/* Download Report */}
            <button
              onClick={() => onNavigate('reports')}
              className="hidden sm:inline-flex items-center gap-1 text-slate-200 hover:text-teal-300 font-semibold transition-colors text-xs"
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
                  className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-lg bg-teal-500/20 hover:bg-teal-500/30 text-teal-300 border border-teal-500/40 text-xs font-bold transition-all"
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
            {/* Custom Modern Laboratory Icon */}
            <div className="w-10 h-10 sm:w-11 sm:h-11 rounded-xl bg-gradient-to-br from-blue-900 via-blue-800 to-teal-700 flex items-center justify-center text-white shadow-md group-hover:shadow-teal-500/20 transition-all shrink-0">
              <div className="relative flex items-center justify-center">
                <svg className="w-6 h-6 text-teal-300" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <circle cx="12" cy="12" r="10" stroke="#0ea5e9" strokeWidth="1.5" strokeDasharray="3 3" opacity="0.6"/>
                  <path d="M10 2v7.31M14 9.3V1.99M8.5 2h7M14 9.3a6.5 6.5 0 1 1-4 0M5.52 16h12.96" stroke="#ffffff" />
                  <circle cx="12" cy="15" r="1.5" fill="#38bdf8" />
                </svg>
              </div>
            </div>

            <div className="flex flex-col">
              <div className="flex items-center gap-1.5 leading-tight">
                <span className="text-lg sm:text-xl font-extrabold tracking-tight text-blue-950 font-display">
                  MICRO<span className="text-teal-600">CELLS</span>
                </span>
                <span className="hidden sm:inline-block px-1.5 py-0.2 text-[9px] uppercase font-bold tracking-wider bg-blue-100 text-blue-800 rounded">
                  Pvt. Ltd.
                </span>
              </div>
              <span className="text-[10px] sm:text-[11px] font-medium tracking-wide text-slate-500 uppercase leading-none mt-0.5">
                Diagnostics & Pathology Lab
              </span>
            </div>
          </div>

          {/* Desktop Navigation Links - Perfectly Aligned */}
          <nav className="hidden xl:flex items-center justify-center gap-1 flex-1 px-2">
            {navItems.map((item) => {
              const isActive = currentPage === item.page;
              return (
                <button
                  key={item.page}
                  onClick={() => onNavigate(item.page)}
                  className={`inline-flex items-center justify-center h-9 px-2.5 lg:px-3 rounded-lg text-[13px] font-semibold tracking-tight leading-none whitespace-nowrap transition-all duration-150 cursor-pointer ${
                    isActive 
                      ? 'text-blue-800 font-bold bg-blue-50/90 shadow-2xs' 
                      : 'text-slate-600 hover:text-blue-900 hover:bg-slate-100/80'
                  }`}
                >
                  {item.label}
                </button>
              );
            })}
          </nav>

          {/* Action CTAs - Uniform Alignment & Baseline */}
          <div className="hidden sm:flex items-center gap-2 shrink-0">
            {/* LIS Shortcut in Main Header */}
            <a
              href="https://emidas.co.in:8890/pages/Login.aspx"
              target="_blank"
              rel="noopener noreferrer"
              className="h-9 px-3 rounded-xl border border-sky-300 bg-sky-50 hover:bg-sky-100 text-sky-900 font-bold text-xs inline-flex items-center gap-1.5 transition-all shadow-2xs whitespace-nowrap"
              title="Access Online LIS Portal (EMIDAS)"
              id="header-btn-lis-main"
            >
              <Database className="w-3.5 h-3.5 text-sky-700" />
              <span>LIS</span>
              <ExternalLink className="w-3 h-3 text-sky-600" />
            </a>

            {/* Quick Prescription Upload Button */}
            <button
              onClick={onOpenPrescription}
              className="h-9 px-3 rounded-xl border border-slate-200 text-slate-700 hover:text-blue-700 hover:bg-blue-50/70 hover:border-blue-200 transition-all text-xs font-semibold inline-flex items-center gap-1.5 shadow-2xs whitespace-nowrap cursor-pointer"
              title="Upload Doctor Prescription"
              id="header-btn-upload-rx"
            >
              <UploadCloud className="w-3.5 h-3.5 text-blue-600" />
              <span className="hidden 2xl:inline">Upload Rx</span>
              <span className="2xl:hidden">Rx</span>
            </button>

            {/* Cart / Selected Tests Drawer Trigger */}
            <button
              onClick={onOpenCart}
              className="relative h-9 w-9 rounded-xl border border-slate-200 text-slate-700 hover:text-teal-700 hover:bg-teal-50/70 hover:border-teal-200 transition-all inline-flex items-center justify-center shadow-2xs cursor-pointer"
              title="View Selected Tests"
              id="header-btn-cart"
            >
              <ShoppingBag className="w-4 h-4 text-teal-600" />
              {cart.length > 0 && (
                <span className="absolute -top-1.5 -right-1.5 min-w-4.5 h-4.5 px-1 bg-teal-600 text-white text-[10px] font-bold rounded-full flex items-center justify-center shadow-xs">
                  {cart.length}
                </span>
              )}
            </button>

            {/* Book a Test CTA */}
            <button
              onClick={() => onOpenBooking()}
              className="h-9 px-3.5 sm:px-4 rounded-xl bg-gradient-to-r from-blue-900 to-blue-800 hover:from-blue-800 hover:to-blue-700 text-white font-bold text-xs shadow-sm shadow-blue-950/20 transition-all inline-flex items-center gap-1.5 whitespace-nowrap cursor-pointer"
              id="header-btn-book-test"
            >
              <Calendar className="w-3.5 h-3.5 text-teal-300" />
              <span>Book Test</span>
            </button>
          </div>

          {/* Mobile Menu & Cart Controls */}
          <div className="flex xl:hidden items-center gap-2">
            <button
              onClick={onOpenCart}
              className="relative p-2 rounded-xl border border-slate-200 text-slate-700"
              title="Cart"
            >
              <ShoppingBag className="w-5 h-5 text-teal-600" />
              {cart.length > 0 && (
                <span className="absolute -top-1 -right-1 w-4 h-4 bg-teal-600 text-white text-[10px] font-bold rounded-full flex items-center justify-center">
                  {cart.length}
                </span>
              )}
            </button>

            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="p-2 rounded-xl text-slate-700 hover:bg-slate-100 focus:outline-none cursor-pointer"
              aria-label="Toggle navigation menu"
              id="header-btn-mobile-menu"
            >
              {mobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Navigation Drawer */}
      {mobileMenuOpen && (
        <div className="xl:hidden bg-white border-b border-slate-200 shadow-xl px-4 pt-2 pb-6 animate-in slide-in-from-top-2 duration-200">
          
          {/* Quick LIS & Admin Bar for Mobile */}
          <div className="grid grid-cols-2 gap-2 mb-3 pb-3 border-b border-slate-100">
            <a
              href="https://emidas.co.in:8890/pages/Login.aspx"
              target="_blank"
              rel="noopener noreferrer"
              className="py-2.5 px-3 rounded-xl bg-sky-50 border border-sky-200 text-sky-900 font-bold text-xs flex items-center justify-center gap-1.5"
            >
              <Database className="w-3.5 h-3.5 text-sky-700" />
              <span>LIS Portal</span>
              <ExternalLink className="w-3 h-3 text-sky-600" />
            </a>

            {isAdminAuthenticated ? (
              <button
                onClick={() => {
                  logoutAdmin();
                  setMobileMenuOpen(false);
                }}
                className="py-2.5 px-3 rounded-xl bg-rose-50 border border-rose-200 text-rose-800 font-bold text-xs flex items-center justify-center gap-1.5"
              >
                <LogOut className="w-3.5 h-3.5 text-rose-600" />
                <span>Admin Logout</span>
              </button>
            ) : (
              <button
                onClick={() => {
                  onNavigate('admin-login');
                  setMobileMenuOpen(false);
                }}
                className="py-2.5 px-3 rounded-xl bg-teal-50 border border-teal-200 text-teal-800 font-bold text-xs flex items-center justify-center gap-1.5"
              >
                <Lock className="w-3.5 h-3.5 text-teal-700" />
                <span>Admin Login</span>
              </button>
            )}
          </div>

          {/* Navigation Items */}
          <div className="flex flex-col space-y-1 mb-4">
            {navItems.map((item) => {
              const isActive = currentPage === item.page;
              return (
                <button
                  key={item.page}
                  onClick={() => {
                    onNavigate(item.page);
                    setMobileMenuOpen(false);
                  }}
                  className={`flex items-center justify-between px-3.5 py-2.5 rounded-lg text-left text-sm font-medium transition-colors ${
                    isActive 
                      ? 'bg-blue-50 text-blue-800 font-bold' 
                      : 'text-slate-700 hover:bg-slate-50'
                  }`}
                >
                  <span>{item.label}</span>
                </button>
              );
            })}
          </div>

          <div className="grid grid-cols-2 gap-2 pt-2 border-t border-slate-100">
            <button
              onClick={() => {
                onOpenPrescription();
                setMobileMenuOpen(false);
              }}
              className="w-full py-2.5 px-3 border border-slate-200 rounded-xl text-xs font-semibold text-slate-700 flex items-center justify-center gap-1.5"
            >
              <UploadCloud className="w-3.5 h-3.5 text-blue-600" />
              <span>Upload Rx</span>
            </button>

            <button
              onClick={() => {
                onNavigate('reports');
                setMobileMenuOpen(false);
              }}
              className="w-full py-2.5 px-3 border border-teal-200 bg-teal-50 rounded-xl text-xs font-semibold text-teal-800 flex items-center justify-center gap-1.5"
            >
              <FileText className="w-3.5 h-3.5 text-teal-700" />
              <span>Download Report</span>
            </button>
          </div>

          <div className="flex flex-col gap-2 mt-3">
            <button
              onClick={() => {
                onNavigate('home-collection');
                setMobileMenuOpen(false);
              }}
              className="w-full py-2.5 rounded-xl bg-teal-700 text-white font-semibold text-xs flex items-center justify-center gap-2 shadow-xs"
            >
              <HomeIcon className="w-4 h-4" />
              <span>Book Home Collection</span>
            </button>

            <button
              onClick={() => {
                onOpenBooking();
                setMobileMenuOpen(false);
              }}
              className="w-full py-2.5 rounded-xl bg-blue-900 text-white font-semibold text-xs flex items-center justify-center gap-2 shadow-xs"
            >
              <Calendar className="w-4 h-4 text-teal-300" />
              <span>Book a Test Appointment</span>
            </button>

            {isAdminAuthenticated && (
              <button
                onClick={() => {
                  onNavigate('admin');
                  setMobileMenuOpen(false);
                }}
                className="w-full py-2.5 rounded-xl bg-slate-900 text-teal-300 font-semibold text-xs flex items-center justify-center gap-2 border border-teal-500/30"
              >
                <LayoutDashboard className="w-4 h-4 text-teal-400" />
                <span>Admin & CMS Dashboard</span>
              </button>
            )}
          </div>

          <div className="mt-4 pt-3 border-t border-slate-100 text-xs text-slate-500 space-y-1.5">
            <div className="flex items-center gap-2">
              <Phone className="w-3.5 h-3.5 text-teal-600" />
              <span>Helpline: {LAB_INFO.phone}</span>
            </div>
            <div className="flex items-center gap-2">
              <Clock className="w-3.5 h-3.5 text-teal-600" />
              <span>Hours: {LAB_INFO.timings}</span>
            </div>
          </div>
        </div>
      )}
    </header>
  );
};
