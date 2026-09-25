export type PageType = 
  | 'home' 
  | 'about' 
  | 'services' 
  | 'tests' 
  | 'packages' 
  | 'home-collection' 
  | 'why-choose-us' 
  | 'reports' 
  | 'book-test' 
  | 'blog' 
  | 'blog-post' 
  | 'contact' 
  | 'faq' 
  | 'custom-page'
  | 'privacy' 
  | 'terms' 
  | 'disclaimer' 
  | 'admin'
  | 'admin-login'
  | (string & {});

export interface AdminUser {
  username: string;
  name: string;
  role: 'Super Administrator' | 'Lab Manager' | 'Chief Pathologist' | 'Staff Admin';
  email: string;
  lastLogin: string;
  avatarColor?: string;
}

export interface AdminCredential {
  username: string;
  password: string;
  name: string;
  role: 'Super Administrator' | 'Lab Manager' | 'Chief Pathologist' | 'Staff Admin';
  email: string;
  avatarColor?: string;
}

export type AdminTab = 
  | 'overview' 
  | 'tests' 
  | 'packages' 
  | 'faqs' 
  | 'blog' 
  | 'bookings' 
  | 'reports' 
  | 'images'
  | 'cms'
  | 'pages'
  | 'menu'
  | 'branding'
  | 'ai-agent'
  | 'settings';

export interface AISuggestedTest {
  id: string;
  name: string;
  code?: string;
  price: number;
  sampleType?: string;
  fastingRequired?: boolean;
  type?: 'test' | 'package';
}

export interface AIChatMessage {
  id: string;
  role: 'user' | 'assistant' | 'system';
  content: string;
  timestamp: string;
  suggestedTests?: AISuggestedTest[];
  source?: 'gemini' | 'openai' | 'pathology_engine';
  isError?: boolean;
  isMedicalOrDrugAdvised?: boolean;
  isOffTopicBlocked?: boolean;
  guardrailNotice?: string;
  showContactCard?: boolean;
  contactDeskInfo?: {
    phone: string;
    whatsapp: string;
    email: string;
    emergency: string;
  };
}

export interface AIAgentConfig {
  enabled: boolean;
  agentName: string;
  welcomeMessage: string;
  provider: 'auto' | 'gemini' | 'chatgpt';
  persona: 'pathologist' | 'counselor' | 'concierge';
  allowVoice: boolean;
  enableFloatingButton: boolean;
  suggestedPrompts: string[];
  customOpenAiKey?: string;
  customGeminiKey?: string;
  additionalInstructions?: string;
  strictWebsiteOnlyGuardrail?: boolean;
  flagDoctorMedicineAdvice?: boolean;
  contactDeskPhone?: string;
  contactDeskWhatsapp?: string;
  contactDeskEmail?: string;
  contactDeskEmergency?: string;
}

export interface SiteImagesConfig {
  homeHeroBanner: string;
  homeDoctorPortrait: string;
  homeAboutLab: string;
  homeCollectionBanner: string;
  qualityLabEquipment: string;
  prescriptionBanner: string;
  patientReportsBanner: string;
  contactSupportBanner: string;
  deptClinicalPathology: string;
  deptHematology: string;
  deptBiochemistry: string;
  deptMicrobiology: string;
  deptSerology: string;
  deptPreventive: string;
  doctorAnand: string;
  doctorPriya: string;
  doctorRajesh: string;
  brandLogoUrl?: string;
  faviconUrl?: string;
  headerLogoUrl?: string;
  footerLogoUrl?: string;
}

export interface SiteImageMeta {
  key: keyof SiteImagesConfig;
  title: string;
  section: 'Home & Landing' | 'About & Team' | 'Services & Departments' | 'Patient Portals & Banners' | 'Branding & Logos';
  description: string;
  recommendedSize: string;
  defaultUrl: string;
}

export interface AnnouncementSettings {
  enabled: boolean;
  text: string;
  badgeText?: string;
  linkText?: string;
  linkPage?: PageType;
}

export interface LabBranch {
  id?: string;
  name: string;
  address: string;
  phone: string;
  hours: string;
  isHQ?: boolean;
}

export interface LabInfo {
  companyName: string;
  tradeName: string;
  tagline: string;
  subTagline: string;
  brandLogoUrl: string;
  phone: string;
  altPhone: string;
  whatsappNumber: string;
  whatsappDisplay: string;
  email: string;
  supportEmail: string;
  address: string;
  landmark: string;
  city: string;
  pincode: string;
  timings: string;
  homeCollectionTimings: string;
  emergencyContact: string;
  nablAccreditationText: string;
  isoAccreditationText?: string;
  icmrRegNumber?: string;
  gstNumber?: string;
  googleMapEmbedUrl?: string;
  facebookUrl?: string;
  instagramUrl?: string;
  linkedinUrl?: string;
  twitterUrl?: string;
  youtubeUrl?: string;
  shortName?: string;
  lisPortalUrl?: string;
  branches: LabBranch[];
}

export interface MenuItem {
  id: string;
  label: string;
  page: PageType;
  customSlug?: string;
  enabled: boolean;
  order: number;
  isExternal?: boolean;
  externalUrl?: string;
  highlight?: boolean;
  iconName?: string;
}

export interface FooterConfig {
  aboutText: string;
  accreditationHeadline: string;
  accreditationSubtext: string;
  copyrightText: string;
  medicalDisclaimer: string;
  showQuickLinks: boolean;
  showDepartments: boolean;
  showContactInfo: boolean;
  showAccreditationBanner: boolean;
}

export interface HeroSectionContent {
  badge: string;
  headline: string;
  headlineHighlight: string;
  subheadline: string;
  primaryCtaText: string;
  secondaryCtaText: string;
  stat1Value: string;
  stat1Label: string;
  stat2Value: string;
  stat2Label: string;
  stat3Value: string;
  stat3Label: string;
  stat4Value: string;
  stat4Label: string;
  trustPoints: string[];
}

export interface AboutSectionContent {
  title: string;
  subtitle: string;
  missionStatement: string;
  visionStatement: string;
  qualityCommitment: string;
  storyParagraph1: string;
  storyParagraph2: string;
  keyDifferentiators: string[];
}

export interface HomeCollectionSectionContent {
  headline: string;
  subheadline: string;
  badge: string;
  perks: { title: string; desc: string }[];
  instructions: string[];
}

export interface WhyChooseUsFeature {
  id: string;
  title: string;
  description: string;
  icon: string;
}

export interface WhyChooseUsSectionContent {
  headline: string;
  subheadline: string;
  features: WhyChooseUsFeature[];
}

export interface ContactSectionContent {
  headline: string;
  subheadline: string;
  helpdeskTitle: string;
  helpdeskDesc: string;
}

export interface SiteContentConfig {
  hero: HeroSectionContent;
  about: AboutSectionContent;
  homeCollection: HomeCollectionSectionContent;
  whyChooseUs: WhyChooseUsSectionContent;
  contact: ContactSectionContent;
  footer: FooterConfig;
}

export interface CustomPageItem {
  id: string;
  slug: string;
  title: string;
  subtitle?: string;
  bannerImageUrl?: string;
  content: string; // Rich markdown or HTML text
  showInMenu: boolean;
  showInFooter: boolean;
  metaDescription?: string;
  published: boolean;
  createdAt: string;
  updatedAt: string;
}

export type ServiceCategory = 
  | 'Clinical Pathology' 
  | 'Hematology' 
  | 'Biochemistry' 
  | 'Immunology & Serology' 
  | 'Microbiology' 
  | 'Histopathology & Cytology';

export type SampleType = 
  | 'Blood' 
  | 'Urine' 
  | 'Stool' 
  | 'Body Fluid' 
  | 'Swab' 
  | 'Tissue / Biopsy' 
  | 'Serum' 
  | 'Plasma';

export interface TestItem {
  id: string;
  name: string;
  code: string;
  category: ServiceCategory;
  sampleType: SampleType;
  fastingRequired: boolean;
  fastingHours?: number;
  turnaroundTime: string; // e.g. "6 to 8 hours" or "Same Day"
  price: number;
  originalPrice?: number;
  description: string;
  parametersCount: number;
  parametersList: string[];
  commonUses: string;
  preparationNotes: string;
  isPopular?: boolean;
  healthConcern?: 'Diabetes' | 'Heart' | 'Liver' | 'Kidney' | 'Thyroid' | 'Vitamins' | 'General Wellness' | 'Infection' | 'Fever';
}

export interface HealthPackage {
  id: string;
  name: string;
  tagline: string;
  price: number;
  originalPrice: number;
  discountPercentage: number;
  parametersCount: number;
  testsIncluded: string[];
  categoryBreakdown: { category: string; count: number; tests: string[] }[];
  idealFor: string;
  fastingInfo: string;
  isPopular?: boolean;
  sampleTypes: SampleType[];
  turnaroundTime: string;
  features: string[];
}

export interface DiagnosticDepartment {
  id: string;
  title: ServiceCategory;
  subtitle: string;
  description: string;
  iconName: string;
  imageUrl: string;
  keyHighlights: string[];
  subcategories: {
    title: string;
    description: string;
    tests: string[];
  }[];
  methodologyOverview: string;
}

export interface BlogPost {
  id: string;
  slug: string;
  title: string;
  excerpt: string;
  content: string[];
  category: 'Test Preparation' | 'Report Interpretation' | 'Preventive Health' | 'Disease Awareness' | 'Lab Technology';
  author: string;
  authorRole: string;
  date: string;
  readTime: string;
  imageUrl: string;
  tags: string[];
  keyTakeaways: string[];
}

export interface FAQItem {
  id: string;
  category: 'General & Booking' | 'Fasting & Preparation' | 'Home Sample Collection' | 'Online Reports' | 'Quality & Safety';
  question: string;
  answer: string;
}

export interface BookingRequest {
  id: string;
  referenceNumber: string;
  patientName: string;
  age: number;
  gender: 'Male' | 'Female' | 'Other';
  mobile: string;
  email: string;
  serviceType: 'home' | 'lab';
  address?: string;
  city?: string;
  pincode?: string;
  preferredDate: string;
  preferredTimeSlot: string;
  selectedTests: string[];
  selectedPackages: string[];
  totalAmount: number;
  notes?: string;
  prescriptionAttached?: boolean;
  prescriptionFileName?: string;
  createdAt: string;
  status: 'Confirmed' | 'Sample Collection Scheduled' | 'Sample Received' | 'Processing' | 'Report Ready';
}

export interface ReportResultItem {
  parameter: string;
  value: string;
  unit: string;
  normalRange: string;
  status: 'Normal' | 'High' | 'Low';
  flag?: string;
  method?: string;
}

export interface PatientReportRecord {
  uhid: string;
  billNo: string;
  barcode: string;
  patientName: string;
  age: number;
  gender: string;
  contactNumber: string;
  referredBy: string;
  sampleCollectionDate: string;
  reportingDate: string;
  testName: string;
  category: ServiceCategory;
  sampleType: string;
  status: 'Ready' | 'Processing' | 'Sample Collected';
  results: ReportResultItem[];
  pathologistNotes?: string;
  verifiedBy: string;
}

export interface CartItem {
  id: string;
  type: 'test' | 'package';
  name: string;
  code?: string;
  price: number;
  sampleType?: string;
  fastingRequired?: boolean;
}
