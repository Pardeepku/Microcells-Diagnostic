import { 
  doc, 
  getDoc, 
  setDoc, 
  updateDoc, 
  onSnapshot,
  serverTimestamp 
} from 'firebase/firestore';
import { db } from '../lib/firebase';
import { 
  SiteImagesConfig, 
  AnnouncementSettings, 
  DiagnosticDepartment 
} from '../types';
import { LAB_INFO } from '../data/labData';

const COLLECTION_NAME = 'siteSettings';

// Document IDs
const IMAGES_DOC = 'images';
const ANNOUNCEMENT_DOC = 'announcement';
const LAB_INFO_DOC = 'labInfo';
const DEPARTMENTS_DOC = 'departments';

// --- SITE IMAGES ---
export const subscribeToSiteImages = (
  onData: (images: SiteImagesConfig) => void,
  onError?: (error: Error) => void
) => {
  const docRef = doc(db, COLLECTION_NAME, IMAGES_DOC);
  return onSnapshot(
    docRef,
    (docSnap) => {
      if (docSnap.exists()) {
        onData(docSnap.data() as SiteImagesConfig);
      }
    },
    (error) => {
      console.error('Error listening to site images:', error);
      if (onError) onError(error);
    }
  );
};

export const getSiteImages = async (): Promise<SiteImagesConfig | null> => {
  const docRef = doc(db, COLLECTION_NAME, IMAGES_DOC);
  const snap = await getDoc(docRef);
  return snap.exists() ? (snap.data() as SiteImagesConfig) : null;
};

export const updateSiteImages = async (images: Partial<SiteImagesConfig>): Promise<void> => {
  const docRef = doc(db, COLLECTION_NAME, IMAGES_DOC);
  await setDoc(docRef, {
    ...images,
    updatedAt: serverTimestamp()
  }, { merge: true });
};

// --- ANNOUNCEMENTS ---
export const subscribeToAnnouncement = (
  onData: (announcement: AnnouncementSettings) => void,
  onError?: (error: Error) => void
) => {
  const docRef = doc(db, COLLECTION_NAME, ANNOUNCEMENT_DOC);
  return onSnapshot(
    docRef,
    (docSnap) => {
      if (docSnap.exists()) {
        onData(docSnap.data() as AnnouncementSettings);
      }
    },
    (error) => {
      console.error('Error listening to announcement:', error);
      if (onError) onError(error);
    }
  );
};

export const getAnnouncement = async (): Promise<AnnouncementSettings | null> => {
  const docRef = doc(db, COLLECTION_NAME, ANNOUNCEMENT_DOC);
  const snap = await getDoc(docRef);
  return snap.exists() ? (snap.data() as AnnouncementSettings) : null;
};

export const updateAnnouncement = async (announcement: Partial<AnnouncementSettings>): Promise<void> => {
  const docRef = doc(db, COLLECTION_NAME, ANNOUNCEMENT_DOC);
  await setDoc(docRef, {
    ...announcement,
    updatedAt: serverTimestamp()
  }, { merge: true });
};

// --- LAB INFO ---
export const subscribeToLabInfo = (
  onData: (info: typeof LAB_INFO) => void,
  onError?: (error: Error) => void
) => {
  const docRef = doc(db, COLLECTION_NAME, LAB_INFO_DOC);
  return onSnapshot(
    docRef,
    (docSnap) => {
      if (docSnap.exists()) {
        onData(docSnap.data() as typeof LAB_INFO);
      }
    },
    (error) => {
      console.error('Error listening to lab info:', error);
      if (onError) onError(error);
    }
  );
};

export const getLabInfo = async (): Promise<typeof LAB_INFO | null> => {
  const docRef = doc(db, COLLECTION_NAME, LAB_INFO_DOC);
  const snap = await getDoc(docRef);
  return snap.exists() ? (snap.data() as typeof LAB_INFO) : null;
};

export const updateLabInfo = async (info: Partial<typeof LAB_INFO>): Promise<void> => {
  const docRef = doc(db, COLLECTION_NAME, LAB_INFO_DOC);
  await setDoc(docRef, {
    ...info,
    updatedAt: serverTimestamp()
  }, { merge: true });
};

// --- DEPARTMENTS ---
export const subscribeToDepartments = (
  onData: (depts: DiagnosticDepartment[]) => void,
  onError?: (error: Error) => void
) => {
  const docRef = doc(db, COLLECTION_NAME, DEPARTMENTS_DOC);
  return onSnapshot(
    docRef,
    (docSnap) => {
      if (docSnap.exists()) {
        const data = docSnap.data();
        if (data && Array.isArray(data.items)) {
          onData(data.items as DiagnosticDepartment[]);
        }
      }
    },
    (error) => {
      console.error('Error listening to departments:', error);
      if (onError) onError(error);
    }
  );
};

export const getDepartments = async (): Promise<DiagnosticDepartment[] | null> => {
  const docRef = doc(db, COLLECTION_NAME, DEPARTMENTS_DOC);
  const snap = await getDoc(docRef);
  if (snap.exists()) {
    const data = snap.data();
    return data && Array.isArray(data.items) ? (data.items as DiagnosticDepartment[]) : null;
  }
  return null;
};

export const updateDepartments = async (items: DiagnosticDepartment[]): Promise<void> => {
  const docRef = doc(db, COLLECTION_NAME, DEPARTMENTS_DOC);
  await setDoc(docRef, {
    items,
    updatedAt: serverTimestamp()
  }, { merge: true });
};
