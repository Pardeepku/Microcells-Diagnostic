/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useEffect } from 'react';
import { PageType, CartItem, TestItem, HealthPackage, PatientReportRecord } from './types';
import { Header } from './components/Header';
import { Footer } from './components/Footer';

// Pages
import { HomeView } from './pages/HomeView';
import { AboutView } from './pages/AboutView';
import { ServicesView } from './pages/ServicesView';
import { AllTestsView } from './pages/AllTestsView';
import { PackagesView } from './pages/PackagesView';
import { HomeCollectionView } from './pages/HomeCollectionView';
import { WhyChooseUsView } from './pages/WhyChooseUsView';
import { PatientReportsView } from './pages/PatientReportsView';
import { BlogView } from './pages/BlogView';
import { BookTestView } from './pages/BookTestView';
import { ContactView } from './pages/ContactView';
import { FAQView } from './pages/FAQView';
import { CustomPageView } from './pages/CustomPageView';
import { AdminDashboardView } from './pages/AdminDashboardView';
import { AdminLoginView } from './pages/AdminLoginView';

// Modals & Drawers
import { BookingModal } from './components/BookingModal';
import { CartDrawer } from './components/CartDrawer';
import { PrescriptionUploadModal } from './components/PrescriptionUploadModal';
import { ReportViewerModal } from './components/ReportViewerModal';
import { TestDetailsModal } from './components/TestDetailsModal';
import { WhatsAppModal } from './components/WhatsAppModal';
import { AIChatWidget } from './components/AIChatWidget';

export default function App() {
  // Navigation State
  const [currentPage, setCurrentPage] = useState<PageType>('home');
  const [pageParam, setPageParam] = useState<string | null>(null);

  // Cart State (Persisted in localStorage)
  const [cart, setCart] = useState<CartItem[]>(() => {
    try {
      const saved = localStorage.getItem('microcells_cart');
      if (saved) {
        const parsed = JSON.parse(saved);
        if (Array.isArray(parsed)) return parsed;
      }
      return [];
    } catch {
      return [];
    }
  });

  // Modal Visibility States
  const [isCartOpen, setIsCartOpen] = useState(false);
  const [isBookingOpen, setIsBookingOpen] = useState(false);
  const [bookingInitialItem, setBookingInitialItem] = useState<CartItem | null>(null);
  const [isPrescriptionOpen, setIsPrescriptionOpen] = useState(false);
  const [isWhatsAppOpen, setIsWhatsAppOpen] = useState(false);
  
  // Detail Modals
  const [detailsItem, setDetailsItem] = useState<TestItem | HealthPackage | null>(null);
  const [detailsType, setDetailsType] = useState<'test' | 'package'>('test');
  const [isDetailsOpen, setIsDetailsOpen] = useState(false);

  // Report Modal
  const [activeReport, setActiveReport] = useState<PatientReportRecord | null>(null);
  const [isReportViewerOpen, setIsReportViewerOpen] = useState(false);

  // Toast Notification
  const [toastMessage, setToastMessage] = useState<string | null>(null);

  // Sync Cart to localStorage
  useEffect(() => {
    try {
      localStorage.setItem('microcells_cart', JSON.stringify(cart));
    } catch (e) {
      console.error('Failed to sync cart to localStorage', e);
    }
  }, [cart]);

  // Scroll to top on navigation change
  const handleNavigate = (page: PageType, param?: string) => {
    setCurrentPage(page);
    setPageParam(param || null);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const showToast = (msg: string) => {
    setToastMessage(msg);
    setTimeout(() => {
      setToastMessage(null);
    }, 2800);
  };

  // Cart Operations
  const handleAddToCart = (item: CartItem) => {
    if (!cart.some(c => c.id === item.id)) {
      setCart(prev => [...prev, item]);
      showToast(`Added "${item.name}" to your test list`);
    }
  };

  const handleRemoveFromCart = (id: string) => {
    setCart(prev => prev.filter(c => c.id !== id));
  };

  const handleClearCart = () => {
    setCart([]);
  };

  // Booking Flow Triggers
  const handleBookNow = (item?: CartItem) => {
    setBookingInitialItem(item || null);
    setIsBookingOpen(true);
  };

  // Open Details Modal
  const handleViewDetails = (item: TestItem | HealthPackage, type: 'test' | 'package') => {
    setDetailsItem(item);
    setDetailsType(type);
    setIsDetailsOpen(true);
  };

  // Open Report Viewer
  const handleViewReport = (report: PatientReportRecord) => {
    setActiveReport(report);
    setIsReportViewerOpen(true);
  };

  const isAdminSection = currentPage === 'admin' || currentPage === 'admin-login';

  return (
    <div className="min-h-screen flex flex-col bg-slate-50 text-slate-900 font-sans selection:bg-teal-500 selection:text-white">
      
      {/* Header Bar (hidden in Admin section) */}
      {!isAdminSection && (
        <Header
          currentPage={currentPage}
          onNavigate={handleNavigate}
          cart={cart}
          onOpenCart={() => setIsCartOpen(true)}
          onOpenPrescription={() => setIsPrescriptionOpen(true)}
          onOpenBooking={() => handleBookNow()}
          onOpenWhatsApp={() => setIsWhatsAppOpen(true)}
        />
      )}

      {/* Main Page Body */}
      <main className="flex-1">
        {currentPage === 'home' && (
          <HomeView
            onNavigate={handleNavigate}
            cart={cart}
            onAddToCart={handleAddToCart}
            onRemoveFromCart={handleRemoveFromCart}
            onBookNow={handleBookNow}
            onViewTestDetails={handleViewDetails}
            onOpenPrescription={() => setIsPrescriptionOpen(true)}
            onOpenWhatsApp={() => setIsWhatsAppOpen(true)}
          />
        )}

        {currentPage === 'about' && (
          <AboutView
            onNavigate={handleNavigate}
            onOpenWhatsApp={() => setIsWhatsAppOpen(true)}
          />
        )}

        {currentPage === 'services' && (
          <ServicesView
            onNavigate={handleNavigate}
            onBookTest={handleBookNow}
            onViewTestDetails={handleViewDetails}
          />
        )}

        {currentPage === 'tests' && (
          <AllTestsView
            cart={cart}
            onAddToCart={handleAddToCart}
            onRemoveFromCart={handleRemoveFromCart}
            onBookNow={handleBookNow}
            onViewDetails={(test) => handleViewDetails(test, 'test')}
            onNavigate={handleNavigate}
          />
        )}

        {currentPage === 'packages' && (
          <PackagesView
            cart={cart}
            onAddToCart={handleAddToCart}
            onRemoveFromCart={handleRemoveFromCart}
            onBookNow={handleBookNow}
            onViewDetails={(pkg) => handleViewDetails(pkg, 'package')}
            onNavigate={handleNavigate}
          />
        )}

        {currentPage === 'home-collection' && (
          <HomeCollectionView
            onNavigate={handleNavigate}
            onOpenBooking={() => handleBookNow()}
            onOpenWhatsApp={() => setIsWhatsAppOpen(true)}
          />
        )}

        {currentPage === 'why-choose-us' && (
          <WhyChooseUsView
            onNavigate={handleNavigate}
          />
        )}

        {currentPage === 'reports' && (
          <PatientReportsView
            onViewReport={handleViewReport}
            onNavigate={handleNavigate}
          />
        )}

        {currentPage === 'contact' && (
          <ContactView
            onNavigate={handleNavigate}
          />
        )}

        {currentPage === 'faq' && (
          <FAQView
            onNavigate={handleNavigate}
          />
        )}

        {(currentPage === 'custom-page' || currentPage === 'privacy' || currentPage === 'terms') && (
          <CustomPageView
            slug={
              currentPage === 'privacy'
                ? 'privacy-policy'
                : currentPage === 'terms'
                ? 'terms-of-service'
                : pageParam || undefined
            }
            onNavigate={handleNavigate}
          />
        )}

        {(currentPage === 'blog' || currentPage === 'blog-post') && (
          <BlogView
            initialSlug={pageParam}
            onNavigate={handleNavigate}
            onBookTest={handleBookNow}
          />
        )}

        {currentPage === 'book-test' && (
          <BookTestView
            cart={cart}
            onAddToCart={handleAddToCart}
            onRemoveFromCart={handleRemoveFromCart}
            onClearCart={handleClearCart}
            onNavigate={handleNavigate}
          />
        )}

        {currentPage === 'admin-login' && (
          <AdminLoginView
            onNavigate={handleNavigate}
            onLoginSuccess={() => handleNavigate('admin')}
          />
        )}

        {currentPage === 'admin' && (
          <AdminDashboardView
            onNavigate={handleNavigate}
          />
        )}
      </main>

      {/* Footer (hidden in Admin section) */}
      {!isAdminSection && (
        <Footer
          onNavigate={handleNavigate}
          onOpenWhatsApp={() => setIsWhatsAppOpen(true)}
        />
      )}

      {/* Floating Action Menu for Quick Support & Cart (hidden in Admin section) */}
      {!isAdminSection && (
        <div className="fixed bottom-24 right-6 z-40 flex flex-col items-end gap-2.5 no-print">
          {/* WhatsApp Quick Button */}
          <button
            onClick={() => setIsWhatsAppOpen(true)}
            className="p-3 bg-emerald-600 hover:bg-emerald-500 text-white rounded-2xl shadow-xl shadow-emerald-900/20 hover:scale-105 active:scale-95 transition-all flex items-center gap-2 group cursor-pointer"
            title="Chat with Diagnostic Desk on WhatsApp"
          >
            <svg className="w-4 h-4 fill-current" viewBox="0 0 24 24">
              <path d="M12.031 6.172c-3.181 0-5.767 2.586-5.768 5.766-.001 1.298.38 2.27 1.019 3.287l-.582 2.128 2.182-.573c.978.58 1.911.928 3.145.929 3.178 0 5.767-2.587 5.768-5.766.001-3.187-2.575-5.77-5.764-5.771zm3.392 8.244c-.144.405-.837.774-1.17.824-.312.045-.694.062-2.18-.553-1.899-.785-3.119-2.733-3.214-2.86-.095-.127-.773-1.029-.773-1.963 0-.933.489-1.392.664-1.583.174-.191.381-.239.508-.239.127 0 .254.001.365.006.118.005.275-.045.431.328.159.381.54 1.317.587 1.413.047.095.079.207.016.334-.063.127-.095.207-.191.318-.095.111-.201.248-.287.333-.095.095-.195.199-.084.39.111.191.494.814 1.06 1.317.728.647 1.342.847 1.533.942.191.095.302.079.413-.048.111-.127.476-.556.603-.746.127-.19.254-.159.429-.095.175.063 1.111.524 1.302.619.191.095.318.143.365.222.048.079.048.46-.096.865z"/>
            </svg>
            <span className="hidden sm:inline text-xs font-bold pr-1">WhatsApp Desk</span>
          </button>

          {/* Floating Cart Button (if items > 0) */}
          {cart.length > 0 && (
            <button
              onClick={() => setIsCartOpen(true)}
              className="p-3 bg-sky-900 hover:bg-sky-800 text-white rounded-2xl shadow-xl shadow-sky-950/25 hover:scale-105 active:scale-95 transition-all flex items-center gap-2 cursor-pointer"
            >
              <div className="relative">
                <span className="w-2.5 h-2.5 bg-teal-400 rounded-full absolute -top-1 -right-1 ring-2 ring-sky-900 animate-pulse"></span>
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M16 11V7a4 4 0 00-8 0v4M5 9h14l1 12H4L5 9z" />
                </svg>
              </div>
              <span className="text-xs font-bold pr-1">{cart.length} Tests</span>
            </button>
          )}
        </div>
      )}

      {/* Floating AI Diagnostic Agent Widget (hidden in Admin section) */}
      {!isAdminSection && (
        <AIChatWidget
          onBookTest={handleBookNow}
          onAddToCart={handleAddToCart}
          onNavigate={handleNavigate}
        />
      )}

      {/* Toast Notification Banner */}
      {toastMessage && (
        <div className="fixed top-20 right-6 z-50 animate-in slide-in-from-top-4 duration-200">
          <div className="bg-slate-900 text-white px-4 py-3 rounded-2xl shadow-2xl border border-slate-700 flex items-center gap-3 text-xs">
            <span className="w-2 h-2 rounded-full bg-teal-400"></span>
            <span className="font-semibold">{toastMessage}</span>
          </div>
        </div>
      )}

      {/* Modals and Drawers */}
      <BookingModal
        isOpen={isBookingOpen}
        onClose={() => setIsBookingOpen(false)}
        initialItem={bookingInitialItem}
        cartItems={cart}
      />

      <CartDrawer
        isOpen={isCartOpen}
        onClose={() => setIsCartOpen(false)}
        cart={cart}
        onRemoveItem={handleRemoveFromCart}
        onClearCart={handleClearCart}
        onProceedToBooking={() => handleBookNow()}
        onExploreMore={() => handleNavigate('tests')}
      />

      <PrescriptionUploadModal
        isOpen={isPrescriptionOpen}
        onClose={() => setIsPrescriptionOpen(false)}
      />

      <ReportViewerModal
        isOpen={isReportViewerOpen}
        report={activeReport}
        onClose={() => {
          setIsReportViewerOpen(false);
          setActiveReport(null);
        }}
      />

      <TestDetailsModal
        isOpen={isDetailsOpen}
        item={detailsItem}
        type={detailsType}
        onClose={() => {
          setIsDetailsOpen(false);
          setDetailsItem(null);
        }}
        isInCart={detailsItem ? cart.some(c => c.id === detailsItem.id) : false}
        onAddToCart={handleAddToCart}
        onBookNow={handleBookNow}
      />

      <WhatsAppModal
        isOpen={isWhatsAppOpen}
        onClose={() => setIsWhatsAppOpen(false)}
      />

    </div>
  );
}
