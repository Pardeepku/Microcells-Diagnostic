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
  Search,
  UploadCloud,
  ShieldCheck,
  LayoutDashboard
} from 'lucide-react';
import { PageType, CartItem } from '../types';
import { LAB_INFO } from '../data/labData';
import { AnnouncementBar } from './AnnouncementBar';

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
  const [isScrolled, setIsScrolled] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [servicesDropdownOpen, setServicesDropdownOpen] = useState(false);

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
    { label: 'Health Packages', page: 'packages' },
    { label: 'All Tests', page: 'tests' },
    { label: 'Home Collection', page: 'home-collection' },
    { label: 'Why Choose Us', page: 'why-choose-us' },
    { label: 'Blog', page: 'blog' },
    { label: 'Reports', page: 'reports' },
    { label: 'Contact', page: 'contact' },
  ];

  return (
    <header className="sticky top-0 z-50 w-full bg-white shadow-sm transition-all duration-200">
      {/* Announcement Ribbon */}
      <AnnouncementBar onNavigate={onNavigate} />

      {/* Top Information Bar */}
      <div className="bg-slate-900 text-slate-200 text-xs py-2 px-4 border-b border-slate-800">
        <div className="max-w-7xl mx-auto flex flex-wrap items-center justify-between gap-3">
          <div className="flex flex-wrap items-center gap-4 sm:gap-6">
            <a 
              href={`tel:${LAB_INFO.phone.replace(/[^0-9+]/g, '')}`} 
              className="flex items-center gap-1.5 hover:text-teal-400 transition-colors"
              title="Call Central Helpline"
            >
              <Phone className="w-3.5 h-3.5 text-teal-400" />
              <span>Call: <strong className="text-white font-medium">{LAB_INFO.phone}</strong></span>
            </a>

            <button 
              onClick={onOpenWhatsApp}
              className="flex items-center gap-1.5 hover:text-emerald-400 transition-colors text-slate-200"
            >
              <MessageSquare className="w-3.5 h-3.5 text-emerald-400" />
              <span>WhatsApp: <strong className="text-white font-medium">{LAB_INFO.whatsappDisplay}</strong></span>
            </button>

            <a 
              href={`mailto:${LAB_INFO.email}`} 
              className="hidden md:flex items-center gap-1.5 hover:text-teal-400 transition-colors"
            >
              <Mail className="w-3.5 h-3.5 text-teal-400" />
              <span>{LAB_INFO.email}</span>
            </a>
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
          </div>

          <div className="flex items-center gap-4 text-slate-300">
            <div className="hidden lg:flex items-center gap-1.5">
              <Clock className="w-3.5 h-3.5 text-teal-400" />
              <span>Lab Timings: <span className="text-white">{LAB_INFO.timings}</span></span>
            </div>

            <button
              onClick={() => onNavigate('reports')}
              className="flex items-center gap-1 text-teal-400 hover:text-teal-300 font-semibold transition-colors ml-2"
            >
              <FileText className="w-3.5 h-3.5" />
              <span>Download Report</span>
            </button>

            <button
              onClick={() => onNavigate('admin')}
              className="flex items-center gap-1 px-2.5 py-0.5 rounded-lg bg-teal-500/20 hover:bg-teal-500/30 text-teal-300 border border-teal-500/40 text-[11px] font-bold transition-all"
              title="Open Admin Dashboard & CMS"
            >
              <LayoutDashboard className="w-3 h-3" />
              <span>Admin Portal</span>
            </button>
          </div>
        </div>
      </div>

      {/* Main Navigation Bar */}
      <div className={`max-w-7xl mx-auto px-4 sm:px-6 transition-all duration-200 ${isScrolled ? 'py-3' : 'py-4'}`}>
        <div className="flex items-center justify-between gap-4">
          
          {/* Logo & Company Name */}
          <div 
            onClick={() => onNavigate('home')} 
            className="flex items-center gap-3 cursor-pointer group select-none"
            id="nav-brand-logo"
          >
            {/* Custom Modern Laboratory Icon */}
            <div className="w-11 h-11 sm:w-12 sm:h-12 rounded-xl bg-gradient-to-br from-blue-900 via-blue-800 to-teal-700 flex items-center justify-center text-white shadow-md group-hover:shadow-teal-500/20 transition-all">
              <div className="relative flex items-center justify-center">
                <svg className="w-7 h-7 text-teal-300" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <circle cx="12" cy="12" r="10" stroke="#0ea5e9" strokeWidth="1.5" strokeDasharray="3 3" opacity="0.6"/>
                  <path d="M10 2v7.31M14 9.3V1.99M8.5 2h7M14 9.3a6.5 6.5 0 1 1-4 0M5.52 16h12.96" stroke="#ffffff" />
                  <circle cx="12" cy="15" r="1.5" fill="#38bdf8" />
                </svg>
              </div>
            </div>

            <div className="flex flex-col">
              <div className="flex items-center gap-1.5">
                <span className="text-xl sm:text-2xl font-extrabold tracking-tight text-blue-950 font-display">
                  MICRO<span className="text-teal-600">CELLS</span>
                </span>
                <span className="hidden sm:inline-block px-1.5 py-0.5 text-[10px] uppercase font-bold tracking-wider bg-blue-100 text-blue-800 rounded">
                  Pvt. Ltd.
                </span>
              </div>
              <span className="text-[11px] font-medium tracking-wide text-slate-500 uppercase">
                Diagnostics & Pathology Laboratory
              </span>
            </div>
          </div>

          {/* Desktop Navigation Links */}
          <nav className="hidden xl:flex items-center gap-1 text-sm font-medium text-slate-700">
            {navItems.map((item) => {
              const isActive = currentPage === item.page;
              return (
                <button
                  key={item.page}
                  onClick={() => onNavigate(item.page)}
                  className={`px-3 py-2 rounded-lg transition-all ${
                    isActive 
                      ? 'text-blue-700 font-semibold bg-blue-50/80 shadow-xs' 
                      : 'text-slate-600 hover:text-blue-900 hover:bg-slate-100/70'
                  }`}
                >
                  {item.label}
                </button>
              );
            })}
          </nav>

          {/* Action CTAs */}
          <div className="hidden sm:flex items-center gap-2.5">
            {/* Quick Prescription Upload Button */}
            <button
              onClick={onOpenPrescription}
              className="p-2.5 rounded-xl border border-slate-200 text-slate-700 hover:text-blue-700 hover:bg-blue-50/60 hover:border-blue-200 transition-all text-xs font-semibold flex items-center gap-1.5"
              title="Upload Prescription"
              id="header-btn-upload-rx"
            >
              <UploadCloud className="w-4 h-4 text-blue-600" />
              <span className="hidden lg:inline">Upload Rx</span>
            </button>

            {/* Cart / Selected Tests Drawer Trigger */}
            <button
              onClick={onOpenCart}
              className="relative p-2.5 rounded-xl border border-slate-200 text-slate-700 hover:text-teal-700 hover:bg-teal-50/60 hover:border-teal-200 transition-all text-xs font-semibold flex items-center gap-1.5"
              title="View Selected Tests"
              id="header-btn-cart"
            >
              <ShoppingBag className="w-4 h-4 text-teal-600" />
              {cart.length > 0 && (
                <span className="absolute -top-1.5 -right-1.5 w-5 h-5 bg-teal-600 text-white text-[11px] font-bold rounded-full flex items-center justify-center shadow-xs">
                  {cart.length}
                </span>
              )}
            </button>

            {/* Book Home Collection CTA */}
            <button
              onClick={() => onNavigate('home-collection')}
              className="px-3.5 py-2.5 rounded-xl border border-teal-600/30 bg-teal-50 text-teal-800 hover:bg-teal-100 font-semibold text-xs transition-all flex items-center gap-1.5 shadow-xs"
              id="header-btn-home-collection"
            >
              <HomeIcon className="w-3.5 h-3.5 text-teal-700" />
              <span>Book Home Collection</span>
            </button>

            {/* Book a Test CTA */}
            <button
              onClick={() => onOpenBooking()}
              className="px-4 py-2.5 rounded-xl bg-gradient-to-r from-blue-900 to-blue-800 hover:from-blue-800 hover:to-blue-700 text-white font-semibold text-xs shadow-md shadow-blue-900/20 transition-all flex items-center gap-1.5"
              id="header-btn-book-test"
            >
              <Calendar className="w-3.5 h-3.5 text-teal-300" />
              <span>Book a Test</span>
            </button>
          </div>

          {/* Mobile Menu Button */}
          <div className="flex xl:hidden items-center gap-2">
            <button
              onClick={onOpenCart}
              className="relative p-2 rounded-lg border border-slate-200 text-slate-700"
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
              className="p-2 rounded-xl text-slate-700 hover:bg-slate-100 focus:outline-none"
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
                  className={`flex items-center justify-between px-4 py-2.5 rounded-lg text-left text-sm font-medium transition-colors ${
                    isActive 
                      ? 'bg-blue-50 text-blue-800 font-semibold' 
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
              className="w-full py-2.5 rounded-xl bg-teal-700 text-white font-semibold text-xs flex items-center justify-center gap-2 shadow-sm"
            >
              <HomeIcon className="w-4 h-4" />
              <span>Book Home Collection</span>
            </button>

            <button
              onClick={() => {
                onOpenBooking();
                setMobileMenuOpen(false);
              }}
              className="w-full py-2.5 rounded-xl bg-blue-900 text-white font-semibold text-xs flex items-center justify-center gap-2 shadow-sm"
            >
              <Calendar className="w-4 h-4 text-teal-300" />
              <span>Book a Test Appointment</span>
            </button>

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
