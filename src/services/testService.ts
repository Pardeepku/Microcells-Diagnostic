import { 
  collection, 
  doc, 
  getDocs, 
  getDoc, 
  setDoc, 
  updateDoc, 
  deleteDoc, 
  onSnapshot, 
  query, 
  orderBy,
  serverTimestamp 
} from 'firebase/firestore';
import { db } from '../lib/firebase';
import { TestItem } from '../types';

const COLLECTION_NAME = 'tests';

export const subscribeToTests = (
  onData: (tests: TestItem[]) => void,
  onError?: (error: Error) => void
) => {
  const testsRef = collection(db, COLLECTION_NAME);
  return onSnapshot(
    testsRef,
    (snapshot) => {
      const tests: TestItem[] = [];
      snapshot.forEach((docSnap) => {
        const data = docSnap.data() as TestItem;
        tests.push({ ...data, id: docSnap.id });
      });
      onData(tests);
    },
    (error) => {
      console.error('Error listening to tests collection:', error);
      if (onError) onError(error);
    }
  );
};

export const getTests = async (): Promise<TestItem[]> => {
  const testsRef = collection(db, COLLECTION_NAME);
  const snapshot = await getDocs(testsRef);
  const tests: TestItem[] = [];
  snapshot.forEach((docSnap) => {
    tests.push({ ...(docSnap.data() as TestItem), id: docSnap.id });
  });
  return tests;
};

export const getTestById = async (id: string): Promise<TestItem | null> => {
  const docRef = doc(db, COLLECTION_NAME, id);
  const docSnap = await getDoc(docRef);
  if (docSnap.exists()) {
    return { ...(docSnap.data() as TestItem), id: docSnap.id };
  }
  return null;
};

export const createTest = async (
  testData: Omit<TestItem, 'id'>, 
  customId?: string
): Promise<TestItem> => {
  const id = customId || `test-${Date.now()}`;
  const docRef = doc(db, COLLECTION_NAME, id);
  const newTest: TestItem = { ...testData, id };
  
  await setDoc(docRef, {
    ...newTest,
    updatedAt: serverTimestamp(),
    createdAt: serverTimestamp()
  });
  
  return newTest;
};

export const updateTest = async (
  id: string, 
  patch: Partial<TestItem>
): Promise<void> => {
  const docRef = doc(db, COLLECTION_NAME, id);
  await updateDoc(docRef, {
    ...patch,
    updatedAt: serverTimestamp()
  });
};

export const deleteTest = async (id: string): Promise<void> => {
  const docRef = doc(db, COLLECTION_NAME, id);
  await deleteDoc(docRef);
};

export const togglePopularTest = async (
  id: string, 
  currentIsPopular: boolean
): Promise<void> => {
  const docRef = doc(db, COLLECTION_NAME, id);
  await updateDoc(docRef, {
    isPopular: !currentIsPopular,
    updatedAt: serverTimestamp()
  });
};
