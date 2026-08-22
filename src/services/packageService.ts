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
import { HealthPackage } from '../types';

const COLLECTION_NAME = 'healthPackages';

export const subscribeToPackages = (
  onData: (packages: HealthPackage[]) => void,
  onError?: (error: Error) => void
) => {
  const colRef = collection(db, COLLECTION_NAME);
  return onSnapshot(
    colRef,
    (snapshot) => {
      const pkgs: HealthPackage[] = [];
      snapshot.forEach((docSnap) => {
        const data = docSnap.data() as HealthPackage;
        pkgs.push({ ...data, id: docSnap.id });
      });
      onData(pkgs);
    },
    (error) => {
      console.error('Error listening to health packages collection:', error);
      if (onError) onError(error);
    }
  );
};

export const getPackages = async (): Promise<HealthPackage[]> => {
  const colRef = collection(db, COLLECTION_NAME);
  const snapshot = await getDocs(colRef);
  const pkgs: HealthPackage[] = [];
  snapshot.forEach((docSnap) => {
    pkgs.push({ ...(docSnap.data() as HealthPackage), id: docSnap.id });
  });
  return pkgs;
};

export const getPackageById = async (id: string): Promise<HealthPackage | null> => {
  const docRef = doc(db, COLLECTION_NAME, id);
  const docSnap = await getDoc(docRef);
  if (docSnap.exists()) {
    return { ...(docSnap.data() as HealthPackage), id: docSnap.id };
  }
  return null;
};

export const createPackage = async (
  pkgData: Omit<HealthPackage, 'id'>, 
  customId?: string
): Promise<HealthPackage> => {
  const id = customId || `pkg-${Date.now()}`;
  const docRef = doc(db, COLLECTION_NAME, id);
  const newPkg: HealthPackage = { ...pkgData, id };
  
  await setDoc(docRef, {
    ...newPkg,
    updatedAt: serverTimestamp(),
    createdAt: serverTimestamp()
  });
  
  return newPkg;
};

export const updatePackage = async (
  id: string, 
  patch: Partial<HealthPackage>
): Promise<void> => {
  const docRef = doc(db, COLLECTION_NAME, id);
  await updateDoc(docRef, {
    ...patch,
    updatedAt: serverTimestamp()
  });
};

export const deletePackage = async (id: string): Promise<void> => {
  const docRef = doc(db, COLLECTION_NAME, id);
  await deleteDoc(docRef);
};

export const togglePopularPackage = async (
  id: string, 
  currentIsPopular: boolean
): Promise<void> => {
  const docRef = doc(db, COLLECTION_NAME, id);
  await updateDoc(docRef, {
    isPopular: !currentIsPopular,
    updatedAt: serverTimestamp()
  });
};
