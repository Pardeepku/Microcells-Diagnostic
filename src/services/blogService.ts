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
import { BlogPost } from '../types';

const COLLECTION_NAME = 'blogPosts';

export const subscribeToBlogPosts = (
  onData: (posts: BlogPost[]) => void,
  onError?: (error: Error) => void
) => {
  const colRef = collection(db, COLLECTION_NAME);
  return onSnapshot(
    colRef,
    (snapshot) => {
      const posts: BlogPost[] = [];
      snapshot.forEach((docSnap) => {
        const data = docSnap.data() as BlogPost;
        posts.push({ ...data, id: docSnap.id });
      });
      onData(posts);
    },
    (error) => {
      console.error('Error listening to blog posts collection:', error);
      if (onError) onError(error);
    }
  );
};

export const getBlogPosts = async (): Promise<BlogPost[]> => {
  const colRef = collection(db, COLLECTION_NAME);
  const snapshot = await getDocs(colRef);
  const posts: BlogPost[] = [];
  snapshot.forEach((docSnap) => {
    posts.push({ ...(docSnap.data() as BlogPost), id: docSnap.id });
  });
  return posts;
};

export const getBlogPostBySlug = async (slug: string): Promise<BlogPost | null> => {
  const posts = await getBlogPosts();
  return posts.find((p) => p.slug === slug) || null;
};

export const createBlogPost = async (
  postData: Omit<BlogPost, 'id'>, 
  customId?: string
): Promise<BlogPost> => {
  const id = customId || `post-${Date.now()}`;
  const docRef = doc(db, COLLECTION_NAME, id);
  const newPost: BlogPost = { ...postData, id };
  
  await setDoc(docRef, {
    ...newPost,
    updatedAt: serverTimestamp(),
    createdAt: serverTimestamp()
  });
  
  return newPost;
};

export const updateBlogPost = async (
  id: string, 
  patch: Partial<BlogPost>
): Promise<void> => {
  const docRef = doc(db, COLLECTION_NAME, id);
  await updateDoc(docRef, {
    ...patch,
    updatedAt: serverTimestamp()
  });
};

export const deleteBlogPost = async (id: string): Promise<void> => {
  const docRef = doc(db, COLLECTION_NAME, id);
  await deleteDoc(docRef);
};

export const saveBlogPost = async (post: BlogPost): Promise<void> => {
  const docRef = doc(db, COLLECTION_NAME, post.id || post.slug);
  await setDoc(docRef, {
    ...post,
    updatedAt: serverTimestamp()
  }, { merge: true });
};

