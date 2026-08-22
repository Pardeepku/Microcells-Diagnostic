import { 
  collection, 
  doc, 
  getDocs, 
  getDoc, 
  setDoc, 
  writeBatch, 
  serverTimestamp 
} from 'firebase/firestore';
import { db } from '../lib/firebase';
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
import { DEFAULT_ADMIN_ACCOUNTS, syncAdminAccounts } from './authService';

const MIGRATION_FLAG_DOC = 'migration_status';
const SETTINGS_COLLECTION = 'siteSettings';

const INITIAL_ANNOUNCEMENT = {
  enabled: true,
  badgeText: 'Health Special',
  text: 'Free Vitamin D & B12 screening available with all Senior & Comprehensive Health Checkup Packages this month.',
  linkText: 'View Packages',
  linkPage: 'packages'
};

const INITIAL_BOOKINGS = [
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

/**
 * Checks Firestore and seeds initial diagnostic laboratory data if collections are empty.
 * Uses batch writes with deterministic document IDs to guarantee idempotency.
 */
export const seedInitialFirestoreData = async (force: boolean = false): Promise<void> => {
  try {
    const migrationDocRef = doc(db, SETTINGS_COLLECTION, MIGRATION_FLAG_DOC);
    const migrationSnap = await getDoc(migrationDocRef);

    if (migrationSnap.exists() && !force) {
      // Already migrated and seeded
      return;
    }

    console.log('Seeding initial laboratory collections into Cloud Firestore...');

    // 1. Check & Seed Tests
    const testsSnap = await getDocs(collection(db, 'tests'));
    if (testsSnap.empty || force) {
      for (const t of POPULAR_TESTS) {
        await setDoc(doc(db, 'tests', t.id), {
          ...t,
          createdAt: serverTimestamp(),
          updatedAt: serverTimestamp()
        }, { merge: true });
      }
    }

    // 2. Check & Seed Health Packages
    const pkgsSnap = await getDocs(collection(db, 'healthPackages'));
    if (pkgsSnap.empty || force) {
      for (const p of HEALTH_PACKAGES) {
        await setDoc(doc(db, 'healthPackages', p.id), {
          ...p,
          createdAt: serverTimestamp(),
          updatedAt: serverTimestamp()
        }, { merge: true });
      }
    }

    // 3. Check & Seed FAQs
    const faqsSnap = await getDocs(collection(db, 'faqs'));
    if (faqsSnap.empty || force) {
      for (const f of FAQS) {
        await setDoc(doc(db, 'faqs', f.id), {
          ...f,
          createdAt: serverTimestamp(),
          updatedAt: serverTimestamp()
        }, { merge: true });
      }
    }

    // 4. Check & Seed Blog Posts
    const blogSnap = await getDocs(collection(db, 'blogPosts'));
    if (blogSnap.empty || force) {
      for (const b of BLOG_POSTS) {
        await setDoc(doc(db, 'blogPosts', b.id), {
          ...b,
          createdAt: serverTimestamp(),
          updatedAt: serverTimestamp()
        }, { merge: true });
      }
    }

    // 5. Check & Seed Patient Reports
    const reportsSnap = await getDocs(collection(db, 'patientReports'));
    if (reportsSnap.empty || force) {
      for (const r of SAMPLE_PATIENT_REPORTS) {
        await setDoc(doc(db, 'patientReports', r.uhid), {
          ...r,
          createdAt: serverTimestamp(),
          updatedAt: serverTimestamp()
        }, { merge: true });
      }
    }

    // 6. Check & Seed Initial Bookings
    const bookingsSnap = await getDocs(collection(db, 'bookings'));
    if (bookingsSnap.empty || force) {
      for (const bk of INITIAL_BOOKINGS) {
        await setDoc(doc(db, 'bookings', bk.id), {
          ...bk,
          createdAt: serverTimestamp(),
          updatedAt: serverTimestamp()
        }, { merge: true });
      }
    }

    // 7. Seed Site Settings (Images, Announcement, Lab Info, Departments)
    await setDoc(doc(db, SETTINGS_COLLECTION, 'images'), DEFAULT_SITE_IMAGES, { merge: true });
    await setDoc(doc(db, SETTINGS_COLLECTION, 'announcement'), INITIAL_ANNOUNCEMENT, { merge: true });
    await setDoc(doc(db, SETTINGS_COLLECTION, 'labInfo'), LAB_INFO, { merge: true });
    await setDoc(doc(db, SETTINGS_COLLECTION, 'departments'), { items: DIAGNOSTIC_DEPARTMENTS }, { merge: true });

    // 8. Seed Admin Accounts
    await syncAdminAccounts(DEFAULT_ADMIN_ACCOUNTS);

    // 9. Mark migration completed
    await setDoc(migrationDocRef, {
      seededAt: serverTimestamp(),
      version: '1.0.0',
      status: 'completed'
    });

    console.log('Firebase Firestore seeding successfully completed!');
  } catch (error) {
    console.error('Error seeding initial Firestore data:', error);
  }
};

/**
 * Inspects legacy localStorage and seamlessly migrates any user modifications into Cloud Firestore.
 */
export const checkAndMigrateLegacyLocalStorage = async (): Promise<void> => {
  try {
    const legacyKey = 'microcells_diagnostic_store_v1';
    const raw = localStorage.getItem(legacyKey);
    if (!raw) return;

    const parsed = JSON.parse(raw);
    if (!parsed || typeof parsed !== 'object') return;

    console.log('Found legacy localStorage data. Migrating to Firestore...');

    if (Array.isArray(parsed.tests)) {
      for (const t of parsed.tests) {
        if (t.id) {
          await setDoc(doc(db, 'tests', t.id), t, { merge: true });
        }
      }
    }

    if (Array.isArray(parsed.packages)) {
      for (const p of parsed.packages) {
        if (p.id) {
          await setDoc(doc(db, 'healthPackages', p.id), p, { merge: true });
        }
      }
    }

    if (Array.isArray(parsed.bookings)) {
      for (const b of parsed.bookings) {
        if (b.id) {
          await setDoc(doc(db, 'bookings', b.id), b, { merge: true });
        }
      }
    }

    if (Array.isArray(parsed.patientReports)) {
      for (const r of parsed.patientReports) {
        if (r.uhid) {
          await setDoc(doc(db, 'patientReports', r.uhid), r, { merge: true });
        }
      }
    }

    if (parsed.siteImages) {
      await setDoc(doc(db, SETTINGS_COLLECTION, 'images'), parsed.siteImages, { merge: true });
    }

    if (parsed.announcement) {
      await setDoc(doc(db, SETTINGS_COLLECTION, 'announcement'), parsed.announcement, { merge: true });
    }

    console.log('Legacy localStorage data successfully synced into Firestore!');
  } catch (e) {
    console.warn('Legacy data migration completed with notice:', e);
  }
};
