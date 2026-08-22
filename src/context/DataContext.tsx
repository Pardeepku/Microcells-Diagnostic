import React, { createContext, useContext, useState, useEffect, useCallback } from 'react';
import { 
  TestItem, 
  HealthPackage, 
  BlogPost, 
  FAQItem, 
  BookingRequest, 
  PatientReportRecord, 
  DiagnosticDepartment,
  AnnouncementSettings,
  AdminUser,
  AdminCredential,
  SiteImagesConfig
} from '../types';
import { 
  POPULAR_TESTS, 
  HEALTH_PACKAGES, 
  BLOG_POSTS, 
  FAQS, 
  SAMPLE_PATIENT_REPORTS, 
  LAB_INFO, 
  DIAGNOSTIC_DEPARTMENTS,
  DEFAULT_SITE_IMAGES
} from '../data/labData';
import * as testService from '../services/testService';
import * as packageService from '../services/packageService';
import * as faqService from '../services/faqService';
import * as blogService from '../services/blogService';
import * as bookingService from '../services/bookingService';
import * as reportService from '../services/patientReportService';
import * as siteService from '../services/siteSettingsService';
import * as authService from '../services/authService';
import { seedInitialFirestoreData, checkAndMigrateLegacyLocalStorage } from '../services/migrationService';

const ADMIN_SESSION_KEY = 'microcells_admin_session_v1';

const INITIAL_ANNOUNCEMENT: AnnouncementSettings = {
  enabled: true,
  badgeText: 'Health Special',
  text: 'Free Vitamin D & B12 screening available with all Senior & Comprehensive Health Checkup Packages this month.',
  linkText: 'View Packages',
  linkPage: 'packages'
};

interface DataContextType {
  tests: TestItem[];
  packages: HealthPackage[];
  faqs: FAQItem[];
  blogPosts: BlogPost[];
  bookings: BookingRequest[];
  patientReports: PatientReportRecord[];
  labInfo: typeof LAB_INFO;
  departments: DiagnosticDepartment[];
  announcement: AnnouncementSettings;
  siteImages: SiteImagesConfig;
  isFirebaseLoading: boolean;

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

  // Site Images & Media
  updateSiteImage: (key: keyof SiteImagesConfig, url: string) => void;
  updateAllSiteImages: (images: Partial<SiteImagesConfig>) => void;
  resetSiteImages: () => void;

  // Admin Authentication & Access Control
  adminUser: AdminUser | null;
  isAdminAuthenticated: boolean;
  adminAccounts: AdminCredential[];
  loginAdmin: (username: string, password: string, rememberMe?: boolean) => { success: boolean; message?: string } | Promise<{ success: boolean; message?: string }>;
  logoutAdmin: () => void;
  changeAdminPassword: (username: string, currentPass: string, newPass: string) => { success: boolean; message: string } | Promise<{ success: boolean; message: string }>;
  updateAdminAccounts: (accounts: AdminCredential[]) => void;

  // System & Migration
  resetToDefaults: () => Promise<void>;
  exportDataJSON: () => string;
  importDataJSON: (jsonString: string) => boolean | Promise<boolean>;
  seedDatabase: (force?: boolean) => Promise<void>;
}

const DataContext = createContext<DataContextType | null>(null);

export const DataProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  // State variables with immediate rich defaults from labData for instantaneous first-paint
  const [tests, setTests] = useState<TestItem[]>(POPULAR_TESTS);
  const [packages, setPackages] = useState<HealthPackage[]>(HEALTH_PACKAGES);
  const [faqs, setFaqs] = useState<FAQItem[]>(FAQS);
  const [blogPosts, setBlogPosts] = useState<BlogPost[]>(BLOG_POSTS);
  const [bookings, setBookings] = useState<BookingRequest[]>([]);
  const [patientReports, setPatientReports] = useState<PatientReportRecord[]>(SAMPLE_PATIENT_REPORTS);
  const [labInfo, setLabInfo] = useState<typeof LAB_INFO>(LAB_INFO);
  const [departments, setDepartments] = useState<DiagnosticDepartment[]>(DIAGNOSTIC_DEPARTMENTS);
  const [announcement, setAnnouncement] = useState<AnnouncementSettings>(INITIAL_ANNOUNCEMENT);
  const [siteImages, setSiteImages] = useState<SiteImagesConfig>(DEFAULT_SITE_IMAGES);
  const [adminAccounts, setAdminAccounts] = useState<AdminCredential[]>(authService.DEFAULT_ADMIN_ACCOUNTS);
  const [isFirebaseLoading, setIsFirebaseLoading] = useState(true);

  // Admin Session State
  const [adminUser, setAdminUser] = useState<AdminUser | null>(() => {
    try {
      const savedSession = localStorage.getItem(ADMIN_SESSION_KEY) || sessionStorage.getItem(ADMIN_SESSION_KEY);
      if (savedSession) {
        return JSON.parse(savedSession);
      }
    } catch (e) {
      console.error('Error reading admin session', e);
    }
    return null;
  });

  // 1. Initial Firestore Seeding & Legacy Data Migration
  useEffect(() => {
    const initializeDatabase = async () => {
      try {
        await seedInitialFirestoreData();
        await checkAndMigrateLegacyLocalStorage();
      } catch (err) {
        console.warn('Initial Firestore sync initialization:', err);
      } finally {
        setIsFirebaseLoading(false);
      }
    };
    initializeDatabase();
  }, []);

  // 2. Real-time Firestore Subscriptions
  useEffect(() => {
    // Tests subscription
    const unsubTests = testService.subscribeToTests((data) => {
      if (data && data.length > 0) {
        setTests(data);
      }
    });

    // Packages subscription
    const unsubPackages = packageService.subscribeToPackages((data) => {
      if (data && data.length > 0) {
        setPackages(data);
      }
    });

    // FAQs subscription
    const unsubFaqs = faqService.subscribeToFAQs((data) => {
      if (data && data.length > 0) {
        setFaqs(data);
      }
    });

    // Blog posts subscription
    const unsubBlog = blogService.subscribeToBlogPosts((data) => {
      if (data && data.length > 0) {
        setBlogPosts(data);
      }
    });

    // Bookings subscription
    const unsubBookings = bookingService.subscribeToBookings((data) => {
      if (data) {
        setBookings(data);
      }
    });

    // Patient Reports subscription
    const unsubReports = reportService.subscribeToPatientReports((data) => {
      if (data && data.length > 0) {
        setPatientReports(data);
      }
    });

    // Site Images subscription
    const unsubImages = siteService.subscribeToSiteImages((data) => {
      if (data) {
        setSiteImages((prev) => ({ ...prev, ...data }));
      }
    });

    // Announcement subscription
    const unsubAnnouncement = siteService.subscribeToAnnouncement((data) => {
      if (data) {
        setAnnouncement((prev) => ({ ...prev, ...data }));
      }
    });

    // Lab Info subscription
    const unsubLabInfo = siteService.subscribeToLabInfo((data) => {
      if (data) {
        setLabInfo((prev) => ({ ...prev, ...data }));
      }
    });

    // Departments subscription
    const unsubDepartments = siteService.subscribeToDepartments((data) => {
      if (data && data.length > 0) {
        setDepartments(data);
      }
    });

    // Load admin accounts
    authService.getAdminAccounts().then((accounts) => {
      if (accounts && accounts.length > 0) {
        setAdminAccounts(accounts);
      }
    });

    return () => {
      unsubTests();
      unsubPackages();
      unsubFaqs();
      unsubBlog();
      unsubBookings();
      unsubReports();
      unsubImages();
      unsubAnnouncement();
      unsubLabInfo();
      unsubDepartments();
    };
  }, []);

  // --- TESTS CRUD ---
  const addTest = (newTestData: Omit<TestItem, 'id'>): TestItem => {
    const id = `test-${Date.now()}`;
    const newTest: TestItem = { ...newTestData, id };
    
    // Optimistic UI update
    setTests((prev) => [newTest, ...prev]);
    
    // Firestore persistence
    testService.createTest(newTestData, id).catch((err) => {
      console.error('Error creating test in Firestore:', err);
    });
    
    return newTest;
  };

  const updateTest = (id: string, patch: Partial<TestItem>) => {
    // Optimistic UI update
    setTests((prev) => prev.map((t) => (t.id === id ? { ...t, ...patch } : t)));
    
    // Firestore persistence
    testService.updateTest(id, patch).catch((err) => {
      console.error('Error updating test in Firestore:', err);
    });
  };

  const deleteTest = (id: string) => {
    // Optimistic UI update
    setTests((prev) => prev.filter((t) => t.id !== id));
    
    // Firestore persistence
    testService.deleteTest(id).catch((err) => {
      console.error('Error deleting test from Firestore:', err);
    });
  };

  const togglePopularTest = (id: string) => {
    const target = tests.find((t) => t.id === id);
    if (!target) return;
    
    const nextStatus = !target.isPopular;
    setTests((prev) => prev.map((t) => (t.id === id ? { ...t, isPopular: nextStatus } : t)));
    
    testService.togglePopularTest(id, target.isPopular || false).catch((err) => {
      console.error('Error toggling popular test status in Firestore:', err);
    });
  };

  // --- PACKAGES CRUD ---
  const addPackage = (newPkgData: Omit<HealthPackage, 'id'>): HealthPackage => {
    const id = `pkg-${Date.now()}`;
    const newPkg: HealthPackage = { ...newPkgData, id };
    
    setPackages((prev) => [newPkg, ...prev]);
    
    packageService.createPackage(newPkgData, id).catch((err) => {
      console.error('Error creating package in Firestore:', err);
    });
    
    return newPkg;
  };

  const updatePackage = (id: string, patch: Partial<HealthPackage>) => {
    setPackages((prev) => prev.map((p) => (p.id === id ? { ...p, ...patch } : p)));
    
    packageService.updatePackage(id, patch).catch((err) => {
      console.error('Error updating package in Firestore:', err);
    });
  };

  const deletePackage = (id: string) => {
    setPackages((prev) => prev.filter((p) => p.id !== id));
    
    packageService.deletePackage(id).catch((err) => {
      console.error('Error deleting package from Firestore:', err);
    });
  };

  const togglePopularPackage = (id: string) => {
    const target = packages.find((p) => p.id === id);
    if (!target) return;
    
    const nextStatus = !target.isPopular;
    setPackages((prev) => prev.map((p) => (p.id === id ? { ...p, isPopular: nextStatus } : p)));
    
    packageService.togglePopularPackage(id, target.isPopular || false).catch((err) => {
      console.error('Error toggling popular package in Firestore:', err);
    });
  };

  // --- FAQS CRUD ---
  const addFAQ = (newFaqData: Omit<FAQItem, 'id'>): FAQItem => {
    const id = `faq-${Date.now()}`;
    const newFaq: FAQItem = { ...newFaqData, id };
    
    setFaqs((prev) => [...prev, newFaq]);
    
    faqService.createFAQ(newFaqData, id).catch((err) => {
      console.error('Error creating FAQ in Firestore:', err);
    });
    
    return newFaq;
  };

  const updateFAQ = (id: string, patch: Partial<FAQItem>) => {
    setFaqs((prev) => prev.map((f) => (f.id === id ? { ...f, ...patch } : f)));
    
    faqService.updateFAQ(id, patch).catch((err) => {
      console.error('Error updating FAQ in Firestore:', err);
    });
  };

  const deleteFAQ = (id: string) => {
    setFaqs((prev) => prev.filter((f) => f.id !== id));
    
    faqService.deleteFAQ(id).catch((err) => {
      console.error('Error deleting FAQ from Firestore:', err);
    });
  };

  // --- BLOG CRUD ---
  const addBlogPost = (newPostData: Omit<BlogPost, 'id'>): BlogPost => {
    const id = `post-${Date.now()}`;
    const newPost: BlogPost = { ...newPostData, id };
    
    setBlogPosts((prev) => [newPost, ...prev]);
    
    blogService.createBlogPost(newPostData, id).catch((err) => {
      console.error('Error creating blog post in Firestore:', err);
    });
    
    return newPost;
  };

  const updateBlogPost = (id: string, patch: Partial<BlogPost>) => {
    setBlogPosts((prev) => prev.map((b) => (b.id === id ? { ...b, ...patch } : b)));
    
    blogService.updateBlogPost(id, patch).catch((err) => {
      console.error('Error updating blog post in Firestore:', err);
    });
  };

  const deleteBlogPost = (id: string) => {
    setBlogPosts((prev) => prev.filter((b) => b.id !== id));
    
    blogService.deleteBlogPost(id).catch((err) => {
      console.error('Error deleting blog post from Firestore:', err);
    });
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
    
    setBookings((prev) => [newBooking, ...prev]);
    
    bookingService.createBooking(bookingData, id).catch((err) => {
      console.error('Error saving booking to Firestore:', err);
    });
    
    return newBooking;
  };

  const updateBookingStatus = (id: string, status: BookingRequest['status']) => {
    setBookings((prev) => prev.map((b) => (b.id === id ? { ...b, status } : b)));
    
    bookingService.updateBookingStatus(id, status).catch((err) => {
      console.error('Error updating booking status in Firestore:', err);
    });
  };

  const deleteBooking = (id: string) => {
    setBookings((prev) => prev.filter((b) => b.id !== id));
    
    bookingService.deleteBooking(id).catch((err) => {
      console.error('Error deleting booking from Firestore:', err);
    });
  };

  // --- PATIENT REPORTS CRUD ---
  const addPatientReport = (report: PatientReportRecord) => {
    setPatientReports((prev) => [report, ...prev.filter((r) => r.uhid !== report.uhid)]);
    
    reportService.createPatientReport(report).catch((err) => {
      console.error('Error saving patient report to Firestore:', err);
    });
  };

  const updatePatientReport = (uhid: string, patch: Partial<PatientReportRecord>) => {
    setPatientReports((prev) => prev.map((r) => (r.uhid === uhid ? { ...r, ...patch } : r)));
    
    reportService.updatePatientReport(uhid, patch).catch((err) => {
      console.error('Error updating patient report in Firestore:', err);
    });
  };

  const deletePatientReport = (uhid: string) => {
    setPatientReports((prev) => prev.filter((r) => r.uhid !== uhid));
    
    reportService.deletePatientReport(uhid).catch((err) => {
      console.error('Error deleting patient report from Firestore:', err);
    });
  };

  // --- LAB INFO & SETTINGS ---
  const updateLabInfo = (info: Partial<typeof LAB_INFO>) => {
    setLabInfo((prev) => ({ ...prev, ...info }));
    siteService.updateLabInfo(info).catch((err) => {
      console.error('Error updating lab info in Firestore:', err);
    });
  };

  const updateAnnouncement = (patch: Partial<AnnouncementSettings>) => {
    setAnnouncement((prev) => ({ ...prev, ...patch }));
    siteService.updateAnnouncement(patch).catch((err) => {
      console.error('Error updating announcement in Firestore:', err);
    });
  };

  const updateDepartment = (id: string, patch: Partial<DiagnosticDepartment>) => {
    const updated = departments.map((d) => (d.id === id ? { ...d, ...patch } : d));
    setDepartments(updated);
    siteService.updateDepartments(updated).catch((err) => {
      console.error('Error updating departments in Firestore:', err);
    });
  };

  // --- SITE IMAGES MANAGEMENT ---
  const updateSiteImage = (key: keyof SiteImagesConfig, url: string) => {
    const updated = {
      ...siteImages,
      [key]: url.trim()
    };
    setSiteImages(updated);
    siteService.updateSiteImages({ [key]: url.trim() }).catch((err) => {
      console.error('Error updating site image in Firestore:', err);
    });
  };

  const updateAllSiteImages = (images: Partial<SiteImagesConfig>) => {
    const updated = {
      ...siteImages,
      ...images
    };
    setSiteImages(updated);
    siteService.updateSiteImages(images).catch((err) => {
      console.error('Error updating site images in Firestore:', err);
    });
  };

  const resetSiteImages = () => {
    setSiteImages(DEFAULT_SITE_IMAGES);
    siteService.updateSiteImages(DEFAULT_SITE_IMAGES).catch((err) => {
      console.error('Error resetting site images in Firestore:', err);
    });
  };

  // --- ADMIN AUTHENTICATION & ACCESS CONTROL ---
  const loginAdmin = async (
    username: string, 
    password: string, 
    rememberMe = true
  ): Promise<{ success: boolean; message?: string }> => {
    const result = await authService.loginAdminUser(username, password);
    if (result.success && result.user) {
      setAdminUser(result.user);
      try {
        if (rememberMe) {
          localStorage.setItem(ADMIN_SESSION_KEY, JSON.stringify(result.user));
        } else {
          sessionStorage.setItem(ADMIN_SESSION_KEY, JSON.stringify(result.user));
        }
      } catch (e) {
        console.error('Failed to store admin session', e);
      }
      return { success: true };
    }
    return { success: false, message: result.message };
  };

  const logoutAdmin = () => {
    setAdminUser(null);
    authService.logoutAdminUser().catch(() => {});
    try {
      localStorage.removeItem(ADMIN_SESSION_KEY);
      sessionStorage.removeItem(ADMIN_SESSION_KEY);
    } catch (e) {
      console.error('Failed to clear admin session', e);
    }
  };

  const changeAdminPassword = async (
    username: string, 
    currentPass: string, 
    newPass: string
  ): Promise<{ success: boolean; message: string }> => {
    const res = await authService.updateAdminUserPassword(username, currentPass, newPass);
    if (res.success) {
      const refreshedAccounts = await authService.getAdminAccounts();
      setAdminAccounts(refreshedAccounts);
    }
    return res;
  };

  const updateAdminAccounts = (accounts: AdminCredential[]) => {
    setAdminAccounts(accounts);
    authService.syncAdminAccounts(accounts).catch(() => {});
  };

  // --- SYSTEM UTILITIES ---
  const seedDatabase = async (force: boolean = false) => {
    await seedInitialFirestoreData(force);
  };

  const resetToDefaults = async () => {
    await seedInitialFirestoreData(true);
    setTests(POPULAR_TESTS);
    setPackages(HEALTH_PACKAGES);
    setFaqs(FAQS);
    setBlogPosts(BLOG_POSTS);
    setPatientReports(SAMPLE_PATIENT_REPORTS);
    setLabInfo(LAB_INFO);
    setDepartments(DIAGNOSTIC_DEPARTMENTS);
    setAnnouncement(INITIAL_ANNOUNCEMENT);
    setSiteImages(DEFAULT_SITE_IMAGES);
    setAdminAccounts(authService.DEFAULT_ADMIN_ACCOUNTS);
  };

  const exportDataJSON = () => {
    const fullStore = {
      tests,
      packages,
      faqs,
      blogPosts,
      bookings,
      patientReports,
      labInfo,
      departments,
      announcement,
      siteImages
    };
    return JSON.stringify(fullStore, null, 2);
  };

  const importDataJSON = async (jsonString: string): Promise<boolean> => {
    try {
      const parsed = JSON.parse(jsonString);
      if (parsed && typeof parsed === 'object') {
        if (Array.isArray(parsed.tests)) {
          for (const t of parsed.tests) {
            await testService.createTest(t, t.id);
          }
        }
        if (Array.isArray(parsed.packages)) {
          for (const p of parsed.packages) {
            await packageService.createPackage(p, p.id);
          }
        }
        if (Array.isArray(parsed.faqs)) {
          for (const f of parsed.faqs) {
            await faqService.createFAQ(f, f.id);
          }
        }
        if (Array.isArray(parsed.blogPosts)) {
          for (const b of parsed.blogPosts) {
            await blogService.createBlogPost(b, b.id);
          }
        }
        if (Array.isArray(parsed.patientReports)) {
          for (const r of parsed.patientReports) {
            await reportService.createPatientReport(r);
          }
        }
        if (parsed.siteImages) {
          await siteService.updateSiteImages(parsed.siteImages);
        }
        if (parsed.announcement) {
          await siteService.updateAnnouncement(parsed.announcement);
        }
        if (parsed.labInfo) {
          await siteService.updateLabInfo(parsed.labInfo);
        }
        return true;
      }
      return false;
    } catch (e) {
      console.error('Import data failed', e);
      return false;
    }
  };

  return (
    <DataContext.Provider
      value={{
        tests,
        packages,
        faqs,
        blogPosts,
        bookings,
        patientReports,
        labInfo,
        departments,
        announcement,
        siteImages,
        isFirebaseLoading,
        // Tests
        addTest,
        updateTest,
        deleteTest,
        togglePopularTest,
        // Packages
        addPackage,
        updatePackage,
        deletePackage,
        togglePopularPackage,
        // FAQs
        addFAQ,
        updateFAQ,
        deleteFAQ,
        // Blog
        addBlogPost,
        updateBlogPost,
        deleteBlogPost,
        // Bookings
        addBooking,
        updateBookingStatus,
        deleteBooking,
        // Reports
        addPatientReport,
        updatePatientReport,
        deletePatientReport,
        // Lab Info & Settings
        updateLabInfo,
        updateAnnouncement,
        updateDepartment,
        // Site Images
        updateSiteImage,
        updateAllSiteImages,
        resetSiteImages,
        // Admin Authentication
        adminUser,
        isAdminAuthenticated: Boolean(adminUser),
        adminAccounts,
        loginAdmin,
        logoutAdmin,
        changeAdminPassword,
        updateAdminAccounts,
        // System
        resetToDefaults,
        exportDataJSON,
        importDataJSON,
        seedDatabase
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
