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
  | 'privacy' 
  | 'terms' 
  | 'disclaimer'
  | 'admin';

export type AdminTab = 
  | 'overview' 
  | 'tests' 
  | 'packages' 
  | 'faqs' 
  | 'blog' 
  | 'bookings' 
  | 'reports' 
  | 'settings';

export interface AnnouncementSettings {
  enabled: boolean;
  text: string;
  badgeText?: string;
  linkText?: string;
  linkPage?: PageType;
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
