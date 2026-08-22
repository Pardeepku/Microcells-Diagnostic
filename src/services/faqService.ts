import { 
  collection, 
  doc, 
  getDocs, 
  getDoc, 
  setDoc, 
  updateDoc, 
  deleteDoc, 
  onSnapshot,
  serverTimestamp 
} from 'firebase/firestore';
import { db } from '../lib/firebase';
import { FAQItem } from '../types';

const COLLECTION_NAME = 'faqs';

export const subscribeToFAQs = (
  onData: (faqs: FAQItem[]) => void,
  onError?: (error: Error) => void
) => {
  const colRef = collection(db, COLLECTION_NAME);
  return onSnapshot(
    colRef,
    (snapshot) => {
      const items: FAQItem[] = [];
      snapshot.forEach((docSnap) => {
        const data = docSnap.data() as FAQItem;
        items.push({ ...data, id: docSnap.id });
      });
      onData(items);
    },
    (error) => {
      console.error('Error listening to FAQs collection:', error);
      if (onError) onError(error);
    }
  );
};

export const getFAQs = async (): Promise<FAQItem[]> => {
  const colRef = collection(db, COLLECTION_NAME);
  const snapshot = await getDocs(colRef);
  const items: FAQItem[] = [];
  snapshot.forEach((docSnap) => {
    items.push({ ...(docSnap.data() as FAQItem), id: docSnap.id });
  });
  return items;
};

export const createFAQ = async (
  faqData: Omit<FAQItem, 'id'>, 
  customId?: string
): Promise<FAQItem> => {
  const id = customId || `faq-${Date.now()}`;
  const docRef = doc(db, COLLECTION_NAME, id);
  const newFaq: FAQItem = { ...faqData, id };
  
  await setDoc(docRef, {
    ...newFaq,
    updatedAt: serverTimestamp(),
    createdAt: serverTimestamp()
  });
  
  return newFaq;
};

export const updateFAQ = async (
  id: string, 
  patch: Partial<FAQItem>
): Promise<void> => {
  const docRef = doc(db, COLLECTION_NAME, id);
  await updateDoc(docRef, {
    ...patch,
    updatedAt: serverTimestamp()
  });
};

export const deleteFAQ = async (id: string): Promise<void> => {
  const docRef = doc(db, COLLECTION_NAME, id);
  await deleteDoc(docRef);
};
