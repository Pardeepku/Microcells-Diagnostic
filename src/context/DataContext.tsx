import React, { createContext, useContext, useState, useEffect } from 'react';
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
  SiteImagesConfig,
  LabInfo,
  MenuItem,
  FooterConfig,
  SiteContentConfig,
  CustomPageItem,
  AIAgentConfig
} from '../types';
import { 
  POPULAR_TESTS, 
  HEALTH_PACKAGES, 
  BLOG_POSTS, 
  FAQS, 
  SAMPLE_PATIENT_REPORTS, 
  LAB_INFO, 
  DIAGNOSTIC_DEPARTMENTS, 
  DEFAULT_SITE_IMAGES,
  DEFAULT_MENU_ITEMS,
  DEFAULT_FOOTER_CONFIG,
  DEFAULT_SITE_CONTENT,
  DEFAULT_CUSTOM_PAGES
} from '../data/labData';
import { getStoredAiConfig, saveStoredAiConfig, DEFAULT_AI_CONFIG } from '../services/aiAgentService';
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
  labInfo: LabInfo;
  departments: DiagnosticDepartment[];
  announcement: AnnouncementSettings;
  siteImages: SiteImagesConfig;
  menuItems: MenuItem[];
  footerConfig: FooterConfig;
  siteContent: SiteContentConfig;
  customPages: CustomPageItem[];
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

  // Lab Info & Branding & Contact
  updateLabInfo: (info: Partial<LabInfo>) => void;
  updateAnnouncement: (announcement: Partial<AnnouncementSettings>) => void;
  updateDepartment: (id: string, dept: Partial<DiagnosticDepartment>) => void;

  // Menu Bar Management
  updateMenuItems: (items: MenuItem[]) => void;
  addMenuItem: (item: Omit<MenuItem, 'id'>) => MenuItem;
  deleteMenuItem: (id: string) => void;
  toggleMenuItem: (id: string) => void;

  // Footer Management
  updateFooterConfig: (footer: Partial<FooterConfig>) => void;

  // Website CMS Text Content
  updateSiteContent: (content: Partial<SiteContentConfig>) => void;
  updateSiteContentSection: <K extends keyof SiteContentConfig>(section: K, data: Partial<SiteContentConfig[K]>) => void;

  // Custom Pages Management
  addCustomPage: (page: Omit<CustomPageItem, 'id' | 'createdAt' | 'updatedAt'>) => CustomPageItem;
  updateCustomPage: (id: string, page: Partial<CustomPageItem>) => void;
  deleteCustomPage: (id: string) => void;

  // Site Images & Media
  updateSiteImage: (key: keyof SiteImagesConfig, url: string) => void;
  updateAllSiteImages: (images: Partial<SiteImagesConfig>) => void;
  resetSiteImages: () => void;

  // AI Agent Configuration & Actions
  aiConfig: AIAgentConfig;
  updateAiConfig: (config: Partial<AIAgentConfig>) => void;
  isAiDrawerOpen: boolean;
  setAiDrawerOpen: (open: boolean) => void;
  activeAiPrompt: string | null;
  triggerAiPrompt: (prompt: string) => void;

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
  const [labInfo, setLabInfo] = useState<LabInfo>(LAB_INFO);
  const [departments, setDepartments] = useState<DiagnosticDepartment[]>(DIAGNOSTIC_DEPARTMENTS);
  const [announcement, setAnnouncement] = useState<AnnouncementSettings>(INITIAL_ANNOUNCEMENT);
  const [siteImages, setSiteImages] = useState<SiteImagesConfig>(DEFAULT_SITE_IMAGES);
  const [menuItems, setMenuItems] = useState<MenuItem[]>(DEFAULT_MENU_ITEMS);
  const [footerConfig, setFooterConfig] = useState<FooterConfig>(DEFAULT_FOOTER_CONFIG);
  const [siteContent, setSiteContent] = useState<SiteContentConfig>(DEFAULT_SITE_CONTENT);
  const [customPages, setCustomPages] = useState<CustomPageItem[]>(DEFAULT_CUSTOM_PAGES);
  const [adminAccounts, setAdminAccounts] = useState<AdminCredential[]>(authService.DEFAULT_ADMIN_ACCOUNTS);
  const [isFirebaseLoading, setIsFirebaseLoading] = useState(true);

  // AI Agent Configuration & Drawer State
  const [aiConfig, setAiConfig] = useState<AIAgentConfig>(getStoredAiConfig);
  const [isAiDrawerOpen, setAiDrawerOpen] = useState(false);
  const [activeAiPrompt, setActiveAiPrompt] = useState<string | null>(null);

  const updateAiConfig = (updated: Partial<AIAgentConfig>) => {
    setAiConfig((prev) => {
      const next = { ...prev, ...updated };
      saveStoredAiConfig(next);
      return next;
    });
  };

  const triggerAiPrompt = (prompt: string) => {
    setActiveAiPrompt(prompt);
    setAiDrawerOpen(true);
  };

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
    const unsubTests = testService.subscribeToTests((data) => {
      if (data && data.length > 0) setTests(data);
    });

    const unsubPackages = packageService.subscribeToPackages((data) => {
      if (data && data.length > 0) setPackages(data);
    });

    const unsubFaqs = faqService.subscribeToFAQs((data) => {
      if (data && data.length > 0) setFaqs(data);
    });

    const unsubBlog = blogService.subscribeToBlogPosts((data) => {
      if (data && data.length > 0) setBlogPosts(data);
    });

    const unsubBookings = bookingService.subscribeToBookings((data) => {
      if (data) setBookings(data);
    });

    const unsubReports = reportService.subscribeToPatientReports((data) => {
      if (data && data.length > 0) setPatientReports(data);
    });

    const unsubImages = siteService.subscribeToSiteImages((data) => {
      if (data) setSiteImages((prev) => ({ ...prev, ...data }));
    });

    const unsubAnnouncement = siteService.subscribeToAnnouncement((data) => {
      if (data) setAnnouncement((prev) => ({ ...prev, ...data }));
    });

    const unsubLabInfo = siteService.subscribeToLabInfo((data) => {
      if (data) setLabInfo((prev) => ({ ...prev, ...data }));
    });

    const unsubDepartments = siteService.subscribeToDepartments((data) => {
      if (data && data.length > 0) setDepartments(data);
    });

    const unsubMenu = siteService.subscribeToMenuItems((data) => {
      if (data && data.length > 0) setMenuItems(data);
    });

    const unsubFooter = siteService.subscribeToFooterConfig((data) => {
      if (data) setFooterConfig((prev) => ({ ...prev, ...data }));
    });

    const unsubSiteContent = siteService.subscribeToSiteContent((data) => {
      if (data) setSiteContent((prev) => ({ ...prev, ...data }));
    });

    const unsubCustomPages = siteService.subscribeToCustomPages((data) => {
      if (data && data.length > 0) setCustomPages(data);
    });

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
      unsubMenu();
      unsubFooter();
      unsubSiteContent();
      unsubCustomPages();
    };
  }, []);

  // --- TESTS CRUD ---
  const addTest = (newTestData: Omit<TestItem, 'id'>): TestItem => {
    const id = `test-${Date.now()}`;
    const newTest: TestItem = { ...newTestData, id };
    setTests((prev) => [newTest, ...prev]);
    testService.saveTest(newTest).catch((err) => {
      console.error('Error saving test to Firestore:', err);
    });
    return newTest;
  };

  const updateTest = (id: string, updatedFields: Partial<TestItem>) => {
    setTests((prev) => prev.map((t) => (t.id === id ? { ...t, ...updatedFields } : t)));
    testService.updateTest(id, updatedFields).catch((err) => {
      console.error('Error updating test in Firestore:', err);
    });
  };

  const deleteTest = (id: string) => {
    setTests((prev) => prev.filter((t) => t.id !== id));
    testService.deleteTest(id).catch((err) => {
      console.error('Error deleting test from Firestore:', err);
    });
  };

  const togglePopularTest = (id: string) => {
    const target = tests.find((t) => t.id === id);
    if (!target) return;
    updateTest(id, { isPopular: !target.isPopular });
  };

  // --- PACKAGES CRUD ---
  const addPackage = (newPkgData: Omit<HealthPackage, 'id'>): HealthPackage => {
    const id = `pkg-${Date.now()}`;
    const newPkg: HealthPackage = { ...newPkgData, id };
    setPackages((prev) => [newPkg, ...prev]);
    packageService.savePackage(newPkg).catch((err) => {
      console.error('Error saving package to Firestore:', err);
    });
    return newPkg;
  };

  const updatePackage = (id: string, updatedFields: Partial<HealthPackage>) => {
    setPackages((prev) => prev.map((p) => (p.id === id ? { ...p, ...updatedFields } : p)));
    packageService.updatePackage(id, updatedFields).catch((err) => {
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
    updatePackage(id, { isPopular: !target.isPopular });
  };

  // --- FAQS CRUD ---
  const addFAQ = (newFaqData: Omit<FAQItem, 'id'>): FAQItem => {
    const id = `faq-${Date.now()}`;
    const newFaq: FAQItem = { ...newFaqData, id };
    setFaqs((prev) => [newFaq, ...prev]);
    faqService.saveFAQ(newFaq).catch((err) => {
      console.error('Error saving FAQ to Firestore:', err);
    });
    return newFaq;
  };

  const updateFAQ = (id: string, updatedFields: Partial<FAQItem>) => {
    setFaqs((prev) => prev.map((f) => (f.id === id ? { ...f, ...updatedFields } : f)));
    faqService.updateFAQ(id, updatedFields).catch((err) => {
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
    const id = `blog-${Date.now()}`;
    const newPost: BlogPost = { ...newPostData, id };
    setBlogPosts((prev) => [newPost, ...prev]);
    blogService.saveBlogPost(newPost).catch((err) => {
      console.error('Error saving blog post to Firestore:', err);
    });
    return newPost;
  };

  const updateBlogPost = (id: string, updatedFields: Partial<BlogPost>) => {
    setBlogPosts((prev) => prev.map((b) => (b.id === id ? { ...b, ...updatedFields } : b)));
    blogService.updateBlogPost(id, updatedFields).catch((err) => {
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
    const randomSuffix = Math.floor(100000 + Math.random() * 900000);
    const referenceNumber = `MCD-2026-${randomSuffix}`;
    const now = new Date();
    const formattedDate = `${now.getFullYear()}-${String(now.getMonth() + 1).padStart(2, '0')}-${String(now.getDate()).padStart(2, '0')} ${now.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}`;

    const id = `bk-${Date.now()}`;
    const newBooking: BookingRequest = {
      ...bookingData,
      id,
      referenceNumber,
      createdAt: formattedDate,
      status: 'Confirmed'
    };

    setBookings((prev) => [newBooking, ...prev]);
    bookingService.saveBooking(newBooking).catch((err) => {
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
    setPatientReports((prev) => {
      const exists = prev.some((r) => r.uhid === report.uhid);
      if (exists) {
        return prev.map((r) => (r.uhid === report.uhid ? report : r));
      }
      return [report, ...prev];
    });
    reportService.savePatientReport(report).catch((err) => {
      console.error('Error saving patient report to Firestore:', err);
    });
  };

  const updatePatientReport = (uhid: string, reportFields: Partial<PatientReportRecord>) => {
    setPatientReports((prev) => prev.map((r) => (r.uhid === uhid ? { ...r, ...reportFields } : r)));
    reportService.updatePatientReport(uhid, reportFields).catch((err) => {
      console.error('Error updating patient report in Firestore:', err);
    });
  };

  const deletePatientReport = (uhid: string) => {
    setPatientReports((prev) => prev.filter((r) => r.uhid !== uhid));
    reportService.deletePatientReport(uhid).catch((err) => {
      console.error('Error deleting patient report from Firestore:', err);
    });
  };

  // --- LAB INFO & BRANDING & CONTACT ---
  const updateLabInfo = (info: Partial<LabInfo>) => {
    setLabInfo((prev) => {
      const updated = { ...prev, ...info };
      siteService.updateLabInfo(updated).catch((err) => {
        console.error('Error updating lab info in Firestore:', err);
      });
      return updated;
    });
  };

  const updateAnnouncement = (ann: Partial<AnnouncementSettings>) => {
    setAnnouncement((prev) => {
      const updated = { ...prev, ...ann };
      siteService.updateAnnouncement(updated).catch((err) => {
        console.error('Error updating announcement in Firestore:', err);
      });
      return updated;
    });
  };

  const updateDepartment = (id: string, deptFields: Partial<DiagnosticDepartment>) => {
    setDepartments((prev) => {
      const updated = prev.map((d) => (d.id === id ? { ...d, ...deptFields } : d));
      siteService.updateDepartments(updated).catch((err) => {
        console.error('Error updating departments in Firestore:', err);
      });
      return updated;
    });
  };

  // --- MENU BAR CMS ---
  const updateMenuItems = (items: MenuItem[]) => {
    setMenuItems(items);
    siteService.updateMenuItems(items).catch((err) => {
      console.error('Error updating menu items in Firestore:', err);
    });
  };

  const addMenuItem = (itemData: Omit<MenuItem, 'id'>): MenuItem => {
    const id = `menu-${Date.now()}`;
    const newItem: MenuItem = { ...itemData, id };
    const updated = [...menuItems, newItem];
    setMenuItems(updated);
    siteService.updateMenuItems(updated).catch((err) => {
      console.error('Error saving new menu item to Firestore:', err);
    });
    return newItem;
  };

  const deleteMenuItem = (id: string) => {
    const updated = menuItems.filter((m) => m.id !== id);
    setMenuItems(updated);
    siteService.updateMenuItems(updated).catch((err) => {
      console.error('Error deleting menu item in Firestore:', err);
    });
  };

  const toggleMenuItem = (id: string) => {
    const updated = menuItems.map((m) => (m.id === id ? { ...m, enabled: !m.enabled } : m));
    setMenuItems(updated);
    siteService.updateMenuItems(updated).catch((err) => {
      console.error('Error toggling menu item in Firestore:', err);
    });
  };

  // --- FOOTER CONFIG ---
  const updateFooterConfig = (footerFields: Partial<FooterConfig>) => {
    setFooterConfig((prev) => {
      const updated = { ...prev, ...footerFields };
      siteService.updateFooterConfig(updated).catch((err) => {
        console.error('Error updating footer config in Firestore:', err);
      });
      return updated;
    });
  };

  // --- WEBSITE CMS TEXT CONTENT ---
  const updateSiteContent = (contentFields: Partial<SiteContentConfig>) => {
    setSiteContent((prev) => {
      const updated = { ...prev, ...contentFields };
      siteService.updateSiteContent(updated).catch((err) => {
        console.error('Error updating site content in Firestore:', err);
      });
      return updated;
    });
  };

  const updateSiteContentSection = <K extends keyof SiteContentConfig>(section: K, data: Partial<SiteContentConfig[K]>) => {
    setSiteContent((prev) => {
      const updatedSection = { ...prev[section], ...data };
      const updatedContent = { ...prev, [section]: updatedSection };
      siteService.updateSiteContent(updatedContent).catch((err) => {
        console.error(`Error updating site content section ${String(section)}:`, err);
      });
      return updatedContent;
    });
  };

  // --- CUSTOM PAGES CMS ---
  const addCustomPage = (pageData: Omit<CustomPageItem, 'id' | 'createdAt' | 'updatedAt'>): CustomPageItem => {
    const now = new Date().toISOString();
    const id = `page-${Date.now()}`;
    const newPage: CustomPageItem = {
      ...pageData,
      id,
      createdAt: now,
      updatedAt: now
    };
    const updated = [...customPages, newPage];
    setCustomPages(updated);
    siteService.updateCustomPages(updated).catch((err) => {
      console.error('Error adding custom page to Firestore:', err);
    });
    return newPage;
  };

  const updateCustomPage = (id: string, pageFields: Partial<CustomPageItem>) => {
    const now = new Date().toISOString();
    const updated = customPages.map((p) => (p.id === id ? { ...p, ...pageFields, updatedAt: now } : p));
    setCustomPages(updated);
    siteService.updateCustomPages(updated).catch((err) => {
      console.error('Error updating custom page in Firestore:', err);
    });
  };

  const deleteCustomPage = (id: string) => {
    const updated = customPages.filter((p) => p.id !== id);
    setCustomPages(updated);
    siteService.updateCustomPages(updated).catch((err) => {
      console.error('Error deleting custom page in Firestore:', err);
    });
  };

  // --- SITE IMAGES & MEDIA ---
  const updateSiteImage = (key: keyof SiteImagesConfig, url: string) => {
    setSiteImages((prev) => {
      const updated = { ...prev, [key]: url };
      siteService.updateSiteImages(updated).catch((err) => {
        console.error('Error updating site images in Firestore:', err);
      });
      return updated;
    });
  };

  const updateAllSiteImages = (images: Partial<SiteImagesConfig>) => {
    setSiteImages((prev) => {
      const updated = { ...prev, ...images };
      siteService.updateSiteImages(updated).catch((err) => {
        console.error('Error updating multiple site images in Firestore:', err);
      });
      return updated;
    });
  };

  const resetSiteImages = () => {
    setSiteImages(DEFAULT_SITE_IMAGES);
    siteService.updateSiteImages(DEFAULT_SITE_IMAGES).catch((err) => {
      console.error('Error resetting site images in Firestore:', err);
    });
  };

  // --- ADMIN AUTHENTICATION ---
  const loginAdmin = async (username: string, pass: string, rememberMe = true) => {
    const result = await authService.authenticateAdmin(username, pass);
    if (result.success && result.user) {
      setAdminUser(result.user);
      const sessionData = JSON.stringify(result.user);
      if (rememberMe) {
        localStorage.setItem(ADMIN_SESSION_KEY, sessionData);
      } else {
        sessionStorage.setItem(ADMIN_SESSION_KEY, sessionData);
      }
    }
    return result;
  };

  const logoutAdmin = () => {
    setAdminUser(null);
    localStorage.removeItem(ADMIN_SESSION_KEY);
    sessionStorage.removeItem(ADMIN_SESSION_KEY);
  };

  const changeAdminPassword = async (username: string, currentPass: string, newPass: string) => {
    const result = await authService.updateAdminPassword(username, currentPass, newPass);
    if (result.success) {
      const accounts = await authService.getAdminAccounts();
      setAdminAccounts(accounts);
    }
    return result;
  };

  const updateAdminAccounts = (accounts: AdminCredential[]) => {
    setAdminAccounts(accounts);
    authService.syncAdminAccounts(accounts).catch((err) => {
      console.error('Error updating admin accounts in Firestore:', err);
    });
  };

  // --- SYSTEM & SEEDING ---
  const resetToDefaults = async () => {
    setIsFirebaseLoading(true);
    try {
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
      setMenuItems(DEFAULT_MENU_ITEMS);
      setFooterConfig(DEFAULT_FOOTER_CONFIG);
      setSiteContent(DEFAULT_SITE_CONTENT);
      setCustomPages(DEFAULT_CUSTOM_PAGES);
    } finally {
      setIsFirebaseLoading(false);
    }
  };

  const exportDataJSON = (): string => {
    const exportObject = {
      exportedAt: new Date().toISOString(),
      appVersion: '2.0.0',
      tests,
      packages,
      faqs,
      blogPosts,
      patientReports,
      labInfo,
      departments,
      announcement,
      siteImages,
      menuItems,
      footerConfig,
      siteContent,
      customPages
    };
    return JSON.stringify(exportObject, null, 2);
  };

  const importDataJSON = async (jsonString: string): Promise<boolean> => {
    try {
      const data = JSON.parse(jsonString);
      if (!data || typeof data !== 'object') return false;

      setIsFirebaseLoading(true);

      if (Array.isArray(data.tests)) {
        setTests(data.tests);
        for (const t of data.tests) await testService.saveTest(t);
      }
      if (Array.isArray(data.packages)) {
        setPackages(data.packages);
        for (const p of data.packages) await packageService.savePackage(p);
      }
      if (Array.isArray(data.faqs)) {
        setFaqs(data.faqs);
        for (const f of data.faqs) await faqService.saveFAQ(f);
      }
      if (Array.isArray(data.blogPosts)) {
        setBlogPosts(data.blogPosts);
        for (const b of data.blogPosts) await blogService.saveBlogPost(b);
      }
      if (Array.isArray(data.patientReports)) {
        setPatientReports(data.patientReports);
        for (const r of data.patientReports) await reportService.savePatientReport(r);
      }
      if (data.labInfo) {
        setLabInfo(data.labInfo);
        await siteService.updateLabInfo(data.labInfo);
      }
      if (Array.isArray(data.departments)) {
        setDepartments(data.departments);
        await siteService.updateDepartments(data.departments);
      }
      if (data.announcement) {
        setAnnouncement(data.announcement);
        await siteService.updateAnnouncement(data.announcement);
      }
      if (data.siteImages) {
        setSiteImages(data.siteImages);
        await siteService.updateSiteImages(data.siteImages);
      }
      if (Array.isArray(data.menuItems)) {
        setMenuItems(data.menuItems);
        await siteService.updateMenuItems(data.menuItems);
      }
      if (data.footerConfig) {
        setFooterConfig(data.footerConfig);
        await siteService.updateFooterConfig(data.footerConfig);
      }
      if (data.siteContent) {
        setSiteContent(data.siteContent);
        await siteService.updateSiteContent(data.siteContent);
      }
      if (Array.isArray(data.customPages)) {
        setCustomPages(data.customPages);
        await siteService.updateCustomPages(data.customPages);
      }

      return true;
    } catch (err) {
      console.error('Error importing backup JSON:', err);
      return false;
    } finally {
      setIsFirebaseLoading(false);
    }
  };

  const seedDatabase = async (force: boolean = false) => {
    setIsFirebaseLoading(true);
    try {
      await seedInitialFirestoreData(force);
    } finally {
      setIsFirebaseLoading(false);
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
        menuItems,
        footerConfig,
        siteContent,
        customPages,
        isFirebaseLoading,

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

        updateMenuItems,
        addMenuItem,
        deleteMenuItem,
        toggleMenuItem,

        updateFooterConfig,

        updateSiteContent,
        updateSiteContentSection,

        addCustomPage,
        updateCustomPage,
        deleteCustomPage,

        updateSiteImage,
        updateAllSiteImages,
        resetSiteImages,

        aiConfig,
        updateAiConfig,
        isAiDrawerOpen,
        setAiDrawerOpen,
        activeAiPrompt,
        triggerAiPrompt,

        adminUser,
        isAdminAuthenticated: !!adminUser,
        adminAccounts,
        loginAdmin,
        logoutAdmin,
        changeAdminPassword,
        updateAdminAccounts,

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
