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
import { PatientReportRecord } from '../types';

const COLLECTION_NAME = 'patientReports';

export const subscribeToPatientReports = (
  onData: (reports: PatientReportRecord[]) => void,
  onError?: (error: Error) => void
) => {
  const colRef = collection(db, COLLECTION_NAME);
  return onSnapshot(
    colRef,
    (snapshot) => {
      const reports: PatientReportRecord[] = [];
      snapshot.forEach((docSnap) => {
        const data = docSnap.data() as PatientReportRecord;
        reports.push({ ...data, uhid: docSnap.id });
      });
      onData(reports);
    },
    (error) => {
      console.error('Error listening to patient reports collection:', error);
      if (onError) onError(error);
    }
  );
};

export const getPatientReports = async (): Promise<PatientReportRecord[]> => {
  const colRef = collection(db, COLLECTION_NAME);
  const snapshot = await getDocs(colRef);
  const reports: PatientReportRecord[] = [];
  snapshot.forEach((docSnap) => {
    reports.push({ ...(docSnap.data() as PatientReportRecord), uhid: docSnap.id });
  });
  return reports;
};

export const getPatientReportByUhid = async (uhid: string): Promise<PatientReportRecord | null> => {
  const cleanUhid = uhid.trim();
  const docRef = doc(db, COLLECTION_NAME, cleanUhid);
  const docSnap = await getDoc(docRef);
  if (docSnap.exists()) {
    return { ...(docSnap.data() as PatientReportRecord), uhid: docSnap.id };
  }
  
  // Try case-insensitive search across all reports if exact ID not found
  const all = await getPatientReports();
  const found = all.find(
    r => r.uhid.toLowerCase() === cleanUhid.toLowerCase() ||
         r.billNo.toLowerCase() === cleanUhid.toLowerCase() ||
         r.barcode.toLowerCase() === cleanUhid.toLowerCase()
  );
  return found || null;
};

export const createPatientReport = async (report: PatientReportRecord): Promise<void> => {
  const docRef = doc(db, COLLECTION_NAME, report.uhid);
  await setDoc(docRef, {
    ...report,
    updatedAt: serverTimestamp(),
    createdAt: serverTimestamp()
  });
};

export const updatePatientReport = async (
  uhid: string, 
  patch: Partial<PatientReportRecord>
): Promise<void> => {
  const docRef = doc(db, COLLECTION_NAME, uhid);
  await updateDoc(docRef, {
    ...patch,
    updatedAt: serverTimestamp()
  });
};

export const deletePatientReport = async (uhid: string): Promise<void> => {
  const docRef = doc(db, COLLECTION_NAME, uhid);
  await deleteDoc(docRef);
};

export const savePatientReport = createPatientReport;

