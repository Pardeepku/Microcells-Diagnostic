import { 
  doc, 
  getDoc, 
  setDoc, 
  onSnapshot,
  serverTimestamp 
} from 'firebase/firestore';
import { db } from '../lib/firebase';
import { 
  SiteImagesConfig, 
  AnnouncementSettings, 
  DiagnosticDepartment,
  LabInfo,
  MenuItem,
  FooterConfig,
  SiteContentConfig,
  CustomPageItem
} from '../types';

const COLLECTION_NAME = 'siteSettings';

// Document IDs
const IMAGES_DOC = 'images';
const ANNOUNCEMENT_DOC = 'announcement';
const LAB_INFO_DOC = 'labInfo';
const DEPARTMENTS_DOC = 'departments';
const MENU_DOC = 'menu';
const FOOTER_DOC = 'footer';
const SITE_CONTENT_DOC = 'siteContent';
const CUSTOM_PAGES_DOC = 'customPages';

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

// --- LAB INFO & CONTACT ---
export const subscribeToLabInfo = (
  onData: (info: LabInfo) => void,
  onError?: (error: Error) => void
) => {
  const docRef = doc(db, COLLECTION_NAME, LAB_INFO_DOC);
  return onSnapshot(
    docRef,
    (docSnap) => {
      if (docSnap.exists()) {
        onData(docSnap.data() as LabInfo);
      }
    },
    (error) => {
      console.error('Error listening to lab info:', error);
      if (onError) onError(error);
    }
  );
};

export const getLabInfo = async (): Promise<LabInfo | null> => {
  const docRef = doc(db, COLLECTION_NAME, LAB_INFO_DOC);
  const snap = await getDoc(docRef);
  return snap.exists() ? (snap.data() as LabInfo) : null;
};

export const updateLabInfo = async (info: Partial<LabInfo>): Promise<void> => {
  const docRef = doc(db, COLLECTION_NAME, LAB_INFO_DOC);
  await setDoc(docRef, {
    ...info,
    updatedAt: serverTimestamp()
  }, { merge: true });
};

// --- MENU / NAVIGATION ---
export const subscribeToMenuItems = (
  onData: (items: MenuItem[]) => void,
  onError?: (error: Error) => void
) => {
  const docRef = doc(db, COLLECTION_NAME, MENU_DOC);
  return onSnapshot(
    docRef,
    (docSnap) => {
      if (docSnap.exists()) {
        const data = docSnap.data();
        if (data && Array.isArray(data.items)) {
          onData(data.items as MenuItem[]);
        }
      }
    },
    (error) => {
      console.error('Error listening to menu items:', error);
      if (onError) onError(error);
    }
  );
};

export const updateMenuItems = async (items: MenuItem[]): Promise<void> => {
  const docRef = doc(db, COLLECTION_NAME, MENU_DOC);
  await setDoc(docRef, {
    items,
    updatedAt: serverTimestamp()
  }, { merge: true });
};

// --- FOOTER CONFIG ---
export const subscribeToFooterConfig = (
  onData: (footer: FooterConfig) => void,
  onError?: (error: Error) => void
) => {
  const docRef = doc(db, COLLECTION_NAME, FOOTER_DOC);
  return onSnapshot(
    docRef,
    (docSnap) => {
      if (docSnap.exists()) {
        onData(docSnap.data() as FooterConfig);
      }
    },
    (error) => {
      console.error('Error listening to footer config:', error);
      if (onError) onError(error);
    }
  );
};

export const updateFooterConfig = async (footer: Partial<FooterConfig>): Promise<void> => {
  const docRef = doc(db, COLLECTION_NAME, FOOTER_DOC);
  await setDoc(docRef, {
    ...footer,
    updatedAt: serverTimestamp()
  }, { merge: true });
};

// --- WEBSITE CMS TEXT CONTENT ---
export const subscribeToSiteContent = (
  onData: (content: SiteContentConfig) => void,
  onError?: (error: Error) => void
) => {
  const docRef = doc(db, COLLECTION_NAME, SITE_CONTENT_DOC);
  return onSnapshot(
    docRef,
    (docSnap) => {
      if (docSnap.exists()) {
        onData(docSnap.data() as SiteContentConfig);
      }
    },
    (error) => {
      console.error('Error listening to site content:', error);
      if (onError) onError(error);
    }
  );
};

export const updateSiteContent = async (content: Partial<SiteContentConfig>): Promise<void> => {
  const docRef = doc(db, COLLECTION_NAME, SITE_CONTENT_DOC);
  await setDoc(docRef, {
    ...content,
    updatedAt: serverTimestamp()
  }, { merge: true });
};

// --- CUSTOM PAGES CMS ---
export const subscribeToCustomPages = (
  onData: (pages: CustomPageItem[]) => void,
  onError?: (error: Error) => void
) => {
  const docRef = doc(db, COLLECTION_NAME, CUSTOM_PAGES_DOC);
  return onSnapshot(
    docRef,
    (docSnap) => {
      if (docSnap.exists()) {
        const data = docSnap.data();
        if (data && Array.isArray(data.items)) {
          onData(data.items as CustomPageItem[]);
        }
      }
    },
    (error) => {
      console.error('Error listening to custom pages:', error);
      if (onError) onError(error);
    }
  );
};

export const updateCustomPages = async (pages: CustomPageItem[]): Promise<void> => {
  const docRef = doc(db, COLLECTION_NAME, CUSTOM_PAGES_DOC);
  await setDoc(docRef, {
    items: pages,
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

export const updateDepartments = async (items: DiagnosticDepartment[]): Promise<void> => {
  const docRef = doc(db, COLLECTION_NAME, DEPARTMENTS_DOC);
  await setDoc(docRef, {
    items,
    updatedAt: serverTimestamp()
  }, { merge: true });
};
