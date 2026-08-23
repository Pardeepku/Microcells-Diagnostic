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
import { BookingRequest } from '../types';

const COLLECTION_NAME = 'bookings';

export const subscribeToBookings = (
  onData: (bookings: BookingRequest[]) => void,
  onError?: (error: Error) => void
) => {
  const colRef = collection(db, COLLECTION_NAME);
  return onSnapshot(
    colRef,
    (snapshot) => {
      const bookings: BookingRequest[] = [];
      snapshot.forEach((docSnap) => {
        const data = docSnap.data() as BookingRequest;
        bookings.push({ ...data, id: docSnap.id });
      });
      onData(bookings);
    },
    (error) => {
      console.error('Error listening to bookings collection:', error);
      if (onError) onError(error);
    }
  );
};

export const getBookings = async (): Promise<BookingRequest[]> => {
  const colRef = collection(db, COLLECTION_NAME);
  const snapshot = await getDocs(colRef);
  const bookings: BookingRequest[] = [];
  snapshot.forEach((docSnap) => {
    bookings.push({ ...(docSnap.data() as BookingRequest), id: docSnap.id });
  });
  return bookings;
};

export const createBooking = async (
  bookingData: Omit<BookingRequest, 'id' | 'createdAt'>,
  customId?: string
): Promise<BookingRequest> => {
  const id = customId || `bk-${Date.now()}`;
  const now = new Date();
  const createdAt = now.toLocaleDateString('en-GB', { day: '2-digit', month: 'short', year: 'numeric' }) + ' ' + now.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
  
  const newBooking: BookingRequest = {
    ...bookingData,
    id,
    createdAt
  };
  
  const docRef = doc(db, COLLECTION_NAME, id);
  await setDoc(docRef, {
    ...newBooking,
    updatedAt: serverTimestamp(),
    timestamp: serverTimestamp()
  });
  
  return newBooking;
};

export const updateBookingStatus = async (
  id: string, 
  status: BookingRequest['status']
): Promise<void> => {
  const docRef = doc(db, COLLECTION_NAME, id);
  await updateDoc(docRef, {
    status,
    updatedAt: serverTimestamp()
  });
};

export const deleteBooking = async (id: string): Promise<void> => {
  const docRef = doc(db, COLLECTION_NAME, id);
  await deleteDoc(docRef);
};

export const saveBooking = async (booking: BookingRequest): Promise<void> => {
  const docRef = doc(db, COLLECTION_NAME, booking.id);
  await setDoc(docRef, {
    ...booking,
    updatedAt: serverTimestamp()
  }, { merge: true });
};

