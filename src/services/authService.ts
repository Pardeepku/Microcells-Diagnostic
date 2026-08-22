import { 
  signInWithEmailAndPassword, 
  createUserWithEmailAndPassword, 
  signOut, 
  updatePassword,
  onAuthStateChanged,
  User as FirebaseUser 
} from 'firebase/auth';
import { 
  collection, 
  doc, 
  getDoc, 
  getDocs, 
  setDoc, 
  updateDoc, 
  serverTimestamp 
} from 'firebase/firestore';
import { auth, db } from '../lib/firebase';
import { AdminUser, AdminCredential } from '../types';

const ADMIN_COLLECTION = 'adminUsers';

export const DEFAULT_ADMIN_ACCOUNTS: AdminCredential[] = [
  {
    username: 'admin',
    password: 'admin123',
    name: 'Lab Administrator',
    role: 'Super Administrator',
    email: 'admin@microcells.com',
    avatarColor: 'teal'
  },
  {
    username: 'dr.pathology',
    password: 'microcells2026',
    name: 'Dr. Anand Verma, MD',
    role: 'Chief Pathologist',
    email: 'anand.verma@microcells.com',
    avatarColor: 'indigo'
  },
  {
    username: 'labmanager',
    password: 'manager123',
    name: 'Pooja Iyer',
    role: 'Lab Manager',
    email: 'pooja.iyer@microcells.com',
    avatarColor: 'amber'
  }
];

export const getAdminAccounts = async (): Promise<AdminCredential[]> => {
  try {
    const colRef = collection(db, ADMIN_COLLECTION);
    const snap = await getDocs(colRef);
    if (!snap.empty) {
      const accounts: AdminCredential[] = [];
      snap.forEach(d => {
        accounts.push({ ...(d.data() as AdminCredential), username: d.id });
      });
      return accounts;
    }
  } catch (e) {
    console.warn('Could not fetch admin accounts from Firestore:', e);
  }
  return DEFAULT_ADMIN_ACCOUNTS;
};

export const syncAdminAccounts = async (accounts: AdminCredential[]): Promise<void> => {
  try {
    for (const acc of accounts) {
      const docRef = doc(db, ADMIN_COLLECTION, acc.username.toLowerCase());
      await setDoc(docRef, {
        username: acc.username,
        name: acc.name,
        role: acc.role,
        email: acc.email,
        password: acc.password,
        avatarColor: acc.avatarColor || 'teal',
        updatedAt: serverTimestamp()
      }, { merge: true });
    }
  } catch (e) {
    console.error('Error syncing admin accounts to Firestore:', e);
  }
};

/**
 * Maps a username or email string to a standard email format for Firebase Auth if needed.
 */
export const resolveAdminEmail = (identifier: string): string => {
  const clean = identifier.trim().toLowerCase();
  if (clean.includes('@')) {
    return clean;
  }
  const match = DEFAULT_ADMIN_ACCOUNTS.find(a => a.username.toLowerCase() === clean);
  if (match) {
    return match.email;
  }
  return `${clean}@microcells.com`;
};

/**
 * Log in admin using Firebase Auth with fallback to Firestore admin collection verification.
 */
export const loginAdminUser = async (
  usernameOrEmail: string, 
  password: string
): Promise<{ success: boolean; user?: AdminUser; message?: string }> => {
  const cleanIdentifier = usernameOrEmail.trim().toLowerCase();
  const cleanPass = password.trim();
  const email = resolveAdminEmail(cleanIdentifier);

  // 1. Try Firebase Auth sign in
  try {
    const userCredential = await signInWithEmailAndPassword(auth, email, cleanPass);
    if (userCredential.user) {
      // Find matching profile in Firestore
      const docRef = doc(db, ADMIN_COLLECTION, cleanIdentifier);
      const docSnap = await getDoc(docRef);
      const data = docSnap.exists() ? docSnap.data() as AdminCredential : null;

      const profile: AdminUser = {
        username: data?.username || cleanIdentifier,
        name: data?.name || userCredential.user.displayName || 'Laboratory Admin',
        role: data?.role || 'Super Administrator',
        email: userCredential.user.email || email,
        lastLogin: new Date().toLocaleString('en-IN', { dateStyle: 'medium', timeStyle: 'short' }),
        avatarColor: data?.avatarColor || 'teal'
      };

      // Record last login in Firestore
      await setDoc(doc(db, ADMIN_COLLECTION, profile.username.toLowerCase()), {
        ...profile,
        lastLogin: profile.lastLogin,
        updatedAt: serverTimestamp()
      }, { merge: true }).catch(() => {});

      return { success: true, user: profile };
    }
  } catch (authError: any) {
    // If user not yet created in Firebase Auth, attempt to authenticate against Firestore / preset credentials
    console.log('Firebase Auth attempt:', authError.code || authError.message);
  }

  // 2. Direct verification with Firestore admin records or default staff credentials
  try {
    const accounts = await getAdminAccounts();
    const matchedAccount = accounts.find(
      a => (a.username.toLowerCase() === cleanIdentifier || a.email.toLowerCase() === cleanIdentifier) &&
           a.password === cleanPass
    );

    if (matchedAccount) {
      // If valid, attempt to seamlessly provision this user into Firebase Auth for future sessions
      try {
        await createUserWithEmailAndPassword(auth, matchedAccount.email, matchedAccount.password);
      } catch (provisionErr) {
        // User may already exist in auth, that's fine
      }

      const profile: AdminUser = {
        username: matchedAccount.username,
        name: matchedAccount.name,
        role: matchedAccount.role,
        email: matchedAccount.email,
        lastLogin: new Date().toLocaleString('en-IN', { dateStyle: 'medium', timeStyle: 'short' }),
        avatarColor: matchedAccount.avatarColor || 'teal'
      };

      // Save/update in Firestore
      await setDoc(doc(db, ADMIN_COLLECTION, matchedAccount.username.toLowerCase()), {
        ...matchedAccount,
        lastLogin: profile.lastLogin,
        updatedAt: serverTimestamp()
      }, { merge: true }).catch(() => {});

      return { success: true, user: profile };
    }

    // Check if user exists but bad password
    const userExists = accounts.some(
      a => a.username.toLowerCase() === cleanIdentifier || a.email.toLowerCase() === cleanIdentifier
    );
    if (userExists) {
      return { success: false, message: 'Invalid password. Please check your credentials and try again.' };
    }
  } catch (firestoreErr) {
    console.error('Error during fallback admin validation:', firestoreErr);
  }

  return { success: false, message: 'Admin username not recognized. Please use an authorized laboratory administrator account.' };
};

/**
 * Sign out admin
 */
export const logoutAdminUser = async (): Promise<void> => {
  try {
    await signOut(auth);
  } catch (e) {
    console.error('Error signing out of Firebase Auth:', e);
  }
};

/**
 * Change admin password
 */
export const updateAdminUserPassword = async (
  username: string,
  currentPass: string,
  newPass: string
): Promise<{ success: boolean; message: string }> => {
  const cleanUser = username.trim().toLowerCase();
  const accounts = await getAdminAccounts();
  const targetAccIndex = accounts.findIndex(acc => acc.username.toLowerCase() === cleanUser);

  if (targetAccIndex === -1) {
    return { success: false, message: 'Admin account not found.' };
  }

  if (accounts[targetAccIndex].password !== currentPass.trim()) {
    return { success: false, message: 'Current password does not match.' };
  }

  if (!newPass || newPass.trim().length < 6) {
    return { success: false, message: 'New password must be at least 6 characters long.' };
  }

  // Update in Firestore
  const docRef = doc(db, ADMIN_COLLECTION, cleanUser);
  await updateDoc(docRef, {
    password: newPass.trim(),
    updatedAt: serverTimestamp()
  }).catch(async () => {
    await setDoc(docRef, {
      ...accounts[targetAccIndex],
      password: newPass.trim(),
      updatedAt: serverTimestamp()
    });
  });

  // Update in Firebase Auth if current user is signed in
  if (auth.currentUser) {
    try {
      await updatePassword(auth.currentUser, newPass.trim());
    } catch (e) {
      console.warn('Could not update Firebase Auth user password:', e);
    }
  }

  return { success: true, message: 'Admin password updated successfully!' };
};
