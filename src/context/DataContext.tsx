import React, { createContext, useContext, useState, useEffect } from 'react';
import { 
  TestItem, 
  HealthPackage, 
  BlogPost, 
  FAQItem, 
  BookingRequest, 
  PatientReportRecord, 
  DiagnosticDepartment,
  AnnouncementSettings 
} from '../types';
import { 
  POPULAR_TESTS, 
  HEALTH_PACKAGES, 
  BLOG_POSTS, 
  FAQS, 
  SAMPLE_PATIENT_REPORTS, 
  LAB_INFO, 
  DIAGNOSTIC_DEPARTMENTS 
} from '../data/labData';

const STORAGE_KEY = 'microcells_diagnostic_store_v1';

const INITIAL_BOOKINGS: BookingRequest[] = [
  {
    id: 'bk-1001',
    referenceNumber: 'MCD-2026-804192',
    patientName: 'Rameshwar Dayal Sharma',
    age: 62,
    gender: 'Male',
    mobile: '9876543210',
    email: 'rameshwar.sharma@example.com',
    serviceType: 'home',
    address: 'Flat 402, Green Meadows Residency, Sector 14',
    city: 'City Central',
    pincode: '400001',
    preferredDate: '2026-08-19',
    preferredTimeSlot: '07:30 AM – 08:30 AM',
    selectedTests: ['HbA1c (Glycated Hemoglobin)', 'Lipid Profile (Cholesterol Panel)'],
    selectedPackages: ['Senior Citizen Comprehensive Care'],
    totalAmount: 3200,
    notes: 'Elderly patient with mild mobility issues. Please carry butterfly needle.',
    prescriptionAttached: true,
    prescriptionFileName: 'dr_sharma_prescription.pdf',
    createdAt: '2026-08-18 09:30 AM',
    status: 'Sample Collection Scheduled'
  },
  {
    id: 'bk-1002',
    referenceNumber: 'MCD-2026-772109',
    patientName: 'Sunita Mehra',
    age: 44,
    gender: 'Female',
    mobile: '9812345678',
    email: 'sunita.mehra@example.com',
    serviceType: 'lab',
    preferredDate: '2026-08-18',
    preferredTimeSlot: '10:00 AM – 11:00 AM',
    selectedTests: ['Thyroid Profile Total (T3, T4, TSH)', 'Vitamin D 25-Hydroxy (Total)'],
    selectedPackages: [],
    totalAmount: 1650,
    notes: 'Fasting completed since 10 PM yesterday.',
    createdAt: '2026-08-18 08:15 AM',
    status: 'Confirmed'
  },
  {
    id: 'bk-1003',
    referenceNumber: 'MCD-2026-651904',
    patientName: 'Aakash Singhania',
    age: 29,
    gender: 'Male',
    mobile: '9798765432',
    email: 'aakash.singh@example.com',
    serviceType: 'home',
    address: 'B-12, Orchid Towers, Healthcare Avenue',
    city: 'City Central',
    pincode: '400001',
    preferredDate: '2026-08-17',
    preferredTimeSlot: '07:00 AM – 08:00 AM',
    selectedTests: ['Complete Blood Count (CBC) with ESR'],
    selectedPackages: ['Executive Full Body Health Package'],
    totalAmount: 2850,
    notes: '',
    createdAt: '2026-08-17 06:45 PM',
    status: 'Processing'
  },
  {
    id: 'bk-1004',
    referenceNumber: 'MCD-2026-541298',
    patientName: 'Pooja Bhatia',
    age: 35,
    gender: 'Female',
    mobile: '9822334455',
    email: 'pooja.bhatia@example.com',
    serviceType: 'lab',
    preferredDate: '2026-08-17',
    preferredTimeSlot: '09:00 AM – 10:00 AM',
    selectedTests: ['Fasting Blood Sugar (Glucose Fasting)', 'HbA1c (Glycated Hemoglobin)'],
    selectedPackages: [],
    totalAmount: 570,
    notes: 'Routine quarterly diabetic checkup.',
    createdAt: '2026-08-17 08:00 AM',
    status: 'Report Ready'
  }
];

const INITIAL_ANNOUNCEMENT: AnnouncementSettings = {
  enabled: true,
  badgeText: 'Health Special',
  text: 'Free Vitamin D & B12 screening available with all Senior & Comprehensive Health Checkup Packages this month.',
  linkText: 'View Packages',
  linkPage: 'packages'
};

interface LabDataStore {
  tests: TestItem[];
  packages: HealthPackage[];
  faqs: FAQItem[];
  blogPosts: BlogPost[];
  bookings: BookingRequest[];
  patientReports: PatientReportRecord[];
  labInfo: typeof LAB_INFO;
  departments: DiagnosticDepartment[];
  announcement: AnnouncementSettings;
}

interface DataContextType extends LabDataStore {
  // Tests CRUD
  addTest: (test: Omit<TestItem, 'id'>) => TestItem;
  updateTest: (id: string, test: Partial<TestItem>) => void;
  deleteTest: (id: string) => void;
  togglePopularTest: (id: string) => void;

  // Packages CRUD
  addPackage: (pkg: Omit<HealthPackage, 'id'>) => HealthPackage;
  updatePackage: (id: string, pkg: Partial<HealthPackage>) => void;
  deletePackage: (id: string) => void;
  togglePopularPackage: (id: string) => void;

  // FAQs CRUD
  addFAQ: (faq: Omit<FAQItem, 'id'>) => FAQItem;
  updateFAQ: (id: string, faq: Partial<FAQItem>) => void;
  deleteFAQ: (id: string) => void;

  // Blog CRUD
  addBlogPost: (post: Omit<BlogPost, 'id'>) => BlogPost;
  updateBlogPost: (id: string, post: Partial<BlogPost>) => void;
  deleteBlogPost: (id: string) => void;

  // Bookings CRUD
  addBooking: (booking: Omit<BookingRequest, 'id' | 'createdAt'>) => BookingRequest;
  updateBookingStatus: (id: string, status: BookingRequest['status']) => void;
  deleteBooking: (id: string) => void;

  // Patient Reports CRUD
  addPatientReport: (report: PatientReportRecord) => void;
  updatePatientReport: (uhid: string, report: Partial<PatientReportRecord>) => void;
  deletePatientReport: (uhid: string) => void;

  // Lab Info & Settings
  updateLabInfo: (info: Partial<typeof LAB_INFO>) => void;
  updateAnnouncement: (announcement: Partial<AnnouncementSettings>) => void;
  updateDepartment: (id: string, dept: Partial<DiagnosticDepartment>) => void;

  // System
  resetToDefaults: () => void;
  exportDataJSON: () => string;
  importDataJSON: (jsonString: string) => boolean;
}

const DataContext = createContext<DataContextType | null>(null);

export const DataProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [store, setStore] = useState<LabDataStore>(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEY);
      if (saved) {
        const parsed = JSON.parse(saved);
        return {
          tests: Array.isArray(parsed.tests) && parsed.tests.length > 0 ? parsed.tests : POPULAR_TESTS,
          packages: Array.isArray(parsed.packages) && parsed.packages.length > 0 ? parsed.packages : HEALTH_PACKAGES,
          faqs: Array.isArray(parsed.faqs) && parsed.faqs.length > 0 ? parsed.faqs : FAQS,
          blogPosts: Array.isArray(parsed.blogPosts) && parsed.blogPosts.length > 0 ? parsed.blogPosts : BLOG_POSTS,
          bookings: Array.isArray(parsed.bookings) ? parsed.bookings : INITIAL_BOOKINGS,
          patientReports: Array.isArray(parsed.patientReports) && parsed.patientReports.length > 0 ? parsed.patientReports : SAMPLE_PATIENT_REPORTS,
          labInfo: parsed.labInfo ? { ...LAB_INFO, ...parsed.labInfo } : LAB_INFO,
          departments: Array.isArray(parsed.departments) && parsed.departments.length > 0 ? parsed.departments : DIAGNOSTIC_DEPARTMENTS,
          announcement: parsed.announcement ? { ...INITIAL_ANNOUNCEMENT, ...parsed.announcement } : INITIAL_ANNOUNCEMENT
        };
      }
    } catch (e) {
      console.error('Error initializing DataContext from localStorage', e);
    }

    return {
      tests: POPULAR_TESTS,
      packages: HEALTH_PACKAGES,
      faqs: FAQS,
      blogPosts: BLOG_POSTS,
      bookings: INITIAL_BOOKINGS,
      patientReports: SAMPLE_PATIENT_REPORTS,
      labInfo: LAB_INFO,
      departments: DIAGNOSTIC_DEPARTMENTS,
      announcement: INITIAL_ANNOUNCEMENT
    };
  });

  // Sync to localStorage on changes
  useEffect(() => {
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(store));
    } catch (e) {
      console.error('Failed to sync data store to localStorage', e);
    }
  }, [store]);

  // --- TESTS CRUD ---
  const addTest = (newTestData: Omit<TestItem, 'id'>): TestItem => {
    const id = `test-${Date.now()}`;
    const newTest: TestItem = { ...newTestData, id };
    setStore(prev => ({
      ...prev,
      tests: [newTest, ...prev.tests]
    }));
    return newTest;
  };

  const updateTest = (id: string, patch: Partial<TestItem>) => {
    setStore(prev => ({
      ...prev,
      tests: prev.tests.map(t => t.id === id ? { ...t, ...patch } : t)
    }));
  };

  const deleteTest = (id: string) => {
    setStore(prev => ({
      ...prev,
      tests: prev.tests.filter(t => t.id !== id)
    }));
  };

  const togglePopularTest = (id: string) => {
    setStore(prev => ({
      ...prev,
      tests: prev.tests.map(t => t.id === id ? { ...t, isPopular: !t.isPopular } : t)
    }));
  };

  // --- PACKAGES CRUD ---
  const addPackage = (newPkgData: Omit<HealthPackage, 'id'>): HealthPackage => {
    const id = `pkg-${Date.now()}`;
    const newPkg: HealthPackage = { ...newPkgData, id };
    setStore(prev => ({
      ...prev,
      packages: [newPkg, ...prev.packages]
    }));
    return newPkg;
  };

  const updatePackage = (id: string, patch: Partial<HealthPackage>) => {
    setStore(prev => ({
      ...prev,
      packages: prev.packages.map(p => p.id === id ? { ...p, ...patch } : p)
    }));
  };

  const deletePackage = (id: string) => {
    setStore(prev => ({
      ...prev,
      packages: prev.packages.filter(p => p.id !== id)
    }));
  };

  const togglePopularPackage = (id: string) => {
    setStore(prev => ({
      ...prev,
      packages: prev.packages.map(p => p.id === id ? { ...p, isPopular: !p.isPopular } : p)
    }));
  };

  // --- FAQS CRUD ---
  const addFAQ = (newFaqData: Omit<FAQItem, 'id'>): FAQItem => {
    const id = `faq-${Date.now()}`;
    const newFaq: FAQItem = { ...newFaqData, id };
    setStore(prev => ({
      ...prev,
      faqs: [...prev.faqs, newFaq]
    }));
    return newFaq;
  };

  const updateFAQ = (id: string, patch: Partial<FAQItem>) => {
    setStore(prev => ({
      ...prev,
      faqs: prev.faqs.map(f => f.id === id ? { ...f, ...patch } : f)
    }));
  };

  const deleteFAQ = (id: string) => {
    setStore(prev => ({
      ...prev,
      faqs: prev.faqs.filter(f => f.id !== id)
    }));
  };

  // --- BLOG CRUD ---
  const addBlogPost = (newPostData: Omit<BlogPost, 'id'>): BlogPost => {
    const id = `post-${Date.now()}`;
    const newPost: BlogPost = { ...newPostData, id };
    setStore(prev => ({
      ...prev,
      blogPosts: [newPost, ...prev.blogPosts]
    }));
    return newPost;
  };

  const updateBlogPost = (id: string, patch: Partial<BlogPost>) => {
    setStore(prev => ({
      ...prev,
      blogPosts: prev.blogPosts.map(b => b.id === id ? { ...b, ...patch } : b)
    }));
  };

  const deleteBlogPost = (id: string) => {
    setStore(prev => ({
      ...prev,
      blogPosts: prev.blogPosts.filter(b => b.id !== id)
    }));
  };

  // --- BOOKINGS CRUD ---
  const addBooking = (bookingData: Omit<BookingRequest, 'id' | 'createdAt'>): BookingRequest => {
    const id = `bk-${Date.now()}`;
    const now = new Date();
    const createdAt = now.toLocaleDateString('en-GB', { day: '2-digit', month: 'short', year: 'numeric' }) + ' ' + now.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
    const newBooking: BookingRequest = {
      ...bookingData,
      id,
      createdAt
    };
    setStore(prev => ({
      ...prev,
      bookings: [newBooking, ...prev.bookings]
    }));
    return newBooking;
  };

  const updateBookingStatus = (id: string, status: BookingRequest['status']) => {
    setStore(prev => ({
      ...prev,
      bookings: prev.bookings.map(b => b.id === id ? { ...b, status } : b)
    }));
  };

  const deleteBooking = (id: string) => {
    setStore(prev => ({
      ...prev,
      bookings: prev.bookings.filter(b => b.id !== id)
    }));
  };

  // --- PATIENT REPORTS CRUD ---
  const addPatientReport = (report: PatientReportRecord) => {
    setStore(prev => ({
      ...prev,
      patientReports: [report, ...prev.patientReports.filter(r => r.uhid !== report.uhid)]
    }));
  };

  const updatePatientReport = (uhid: string, patch: Partial<PatientReportRecord>) => {
    setStore(prev => ({
      ...prev,
      patientReports: prev.patientReports.map(r => r.uhid === uhid ? { ...r, ...patch } : r)
    }));
  };

  const deletePatientReport = (uhid: string) => {
    setStore(prev => ({
      ...prev,
      patientReports: prev.patientReports.filter(r => r.uhid !== uhid)
    }));
  };

  // --- LAB INFO & SETTINGS ---
  const updateLabInfo = (info: Partial<typeof LAB_INFO>) => {
    setStore(prev => ({
      ...prev,
      labInfo: { ...prev.labInfo, ...info }
    }));
  };

  const updateAnnouncement = (patch: Partial<AnnouncementSettings>) => {
    setStore(prev => ({
      ...prev,
      announcement: { ...prev.announcement, ...patch }
    }));
  };

  const updateDepartment = (id: string, patch: Partial<DiagnosticDepartment>) => {
    setStore(prev => ({
      ...prev,
      departments: prev.departments.map(d => d.id === id ? { ...d, ...patch } : d)
    }));
  };

  // --- BACKUP / RESTORE / RESET ---
  const resetToDefaults = () => {
    const defaultData: LabDataStore = {
      tests: POPULAR_TESTS,
      packages: HEALTH_PACKAGES,
      faqs: FAQS,
      blogPosts: BLOG_POSTS,
      bookings: INITIAL_BOOKINGS,
      patientReports: SAMPLE_PATIENT_REPORTS,
      labInfo: LAB_INFO,
      departments: DIAGNOSTIC_DEPARTMENTS,
      announcement: INITIAL_ANNOUNCEMENT
    };
    setStore(defaultData);
    localStorage.setItem(STORAGE_KEY, JSON.stringify(defaultData));
  };

  const exportDataJSON = () => {
    return JSON.stringify(store, null, 2);
  };

  const importDataJSON = (jsonString: string): boolean => {
    try {
      const parsed = JSON.parse(jsonString);
      if (parsed && typeof parsed === 'object') {
        const validated: LabDataStore = {
          tests: Array.isArray(parsed.tests) ? parsed.tests : store.tests,
          packages: Array.isArray(parsed.packages) ? parsed.packages : store.packages,
          faqs: Array.isArray(parsed.faqs) ? parsed.faqs : store.faqs,
          blogPosts: Array.isArray(parsed.blogPosts) ? parsed.blogPosts : store.blogPosts,
          bookings: Array.isArray(parsed.bookings) ? parsed.bookings : store.bookings,
          patientReports: Array.isArray(parsed.patientReports) ? parsed.patientReports : store.patientReports,
          labInfo: parsed.labInfo ? { ...store.labInfo, ...parsed.labInfo } : store.labInfo,
          departments: Array.isArray(parsed.departments) ? parsed.departments : store.departments,
          announcement: parsed.announcement ? { ...store.announcement, ...parsed.announcement } : store.announcement
        };
        setStore(validated);
        localStorage.setItem(STORAGE_KEY, JSON.stringify(validated));
        return true;
      }
      return false;
    } catch (e) {
      console.error('Import failed', e);
      return false;
    }
  };

  return (
    <DataContext.Provider
      value={{
        ...store,
        addTest,
        updateTest,
        deleteTest,
        togglePopularTest,
        addPackage,
        updatePackage,
        deletePackage,
        togglePopularPackage,
        addFAQ,
        updateFAQ,
        deleteFAQ,
        addBlogPost,
        updateBlogPost,
        deleteBlogPost,
        addBooking,
        updateBookingStatus,
        deleteBooking,
        addPatientReport,
        updatePatientReport,
        deletePatientReport,
        updateLabInfo,
        updateAnnouncement,
        updateDepartment,
        resetToDefaults,
        exportDataJSON,
        importDataJSON
      }}
    >
      {children}
    </DataContext.Provider>
  );
};

export const useData = () => {
  const context = useContext(DataContext);
  if (!context) {
    throw new Error('useData must be used within a DataProvider');
  }
  return context;
};
