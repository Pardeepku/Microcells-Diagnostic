import { 
  ref, 
  uploadBytes, 
  getDownloadURL, 
  uploadString 
} from 'firebase/storage';
import { storage } from '../lib/firebase';

/**
 * Uploads a laboratory image or document file to Firebase Storage and returns the public download URL.
 */
export const uploadFile = async (
  file: File, 
  folderPath: string = 'uploads'
): Promise<string> => {
  const timestamp = Date.now();
  const sanitizedName = file.name.replace(/[^a-zA-Z0-9.-]/g, '_');
  const fullPath = `${folderPath}/${timestamp}_${sanitizedName}`;
  const storageRef = ref(storage, fullPath);

  const snapshot = await uploadBytes(storageRef, file);
  const downloadUrl = await getDownloadURL(snapshot.ref);
  return downloadUrl;
};

/**
 * Uploads a base64 encoded data URI string (e.g. from an image crop or canvas).
 */
export const uploadDataUrl = async (
  dataUrl: string, 
  folderPath: string = 'images'
): Promise<string> => {
  const timestamp = Date.now();
  const fullPath = `${folderPath}/${timestamp}.png`;
  const storageRef = ref(storage, fullPath);

  const snapshot = await uploadString(storageRef, dataUrl, 'data_url');
  const downloadUrl = await getDownloadURL(snapshot.ref);
  return downloadUrl;
};

/**
 * Uploads a prescription file attached during test booking.
 */
export const uploadPrescriptionFile = async (
  file: File, 
  bookingReference: string
): Promise<string> => {
  const sanitizedRef = bookingReference.replace(/[^a-zA-Z0-9-]/g, '_');
  const fullPath = `prescriptions/${sanitizedRef}/${file.name}`;
  const storageRef = ref(storage, fullPath);

  const snapshot = await uploadBytes(storageRef, file);
  return await getDownloadURL(snapshot.ref);
};
