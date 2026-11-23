import { initializeApp, getApps, getApp } from 'firebase/app';
import { 
  getAuth, 
  signInWithEmailAndPassword, 
  createUserWithEmailAndPassword, 
  signInWithPopup, 
  GoogleAuthProvider, 
  signOut, 
  onAuthStateChanged,
  User,
  IdTokenResult
} from 'firebase/auth';

/**
 * Firebase Client Configuration
 * Exclusively for Authentication (Email/Password & Google OAuth)
 * Free Spark Plan tier: 50,000 MAU
 */
const firebaseConfig = {
  apiKey: import.meta.env.VITE_FIREBASE_API_KEY || 'AIzaSyDemoAuraColorimetriaBiobio2026',
  authDomain: import.meta.env.VITE_FIREBASE_AUTH_DOMAIN || 'styled-by-wilma.firebaseapp.com',
  projectId: import.meta.env.VITE_FIREBASE_PROJECT_ID || 'styled-by-wilma',
  storageBucket: import.meta.env.VITE_FIREBASE_STORAGE_BUCKET || 'styled-by-wilma.appspot.com',
  messagingSenderId: import.meta.env.VITE_FIREBASE_MESSAGING_SENDER_ID || '465587150017',
  appId: import.meta.env.VITE_FIREBASE_APP_ID || '1:465587150017:web:8e4c4c6d10f7420f80c79e'
};

const app = !getApps().length ? initializeApp(firebaseConfig) : getApp();
export const auth = getAuth(app);
export const googleProvider = new GoogleAuthProvider();

export {
  signInWithEmailAndPassword,
  createUserWithEmailAndPassword,
  signInWithPopup,
  signOut,
  onAuthStateChanged
};

/**
 * Extracts and verifies the custom claim `admin: true` from the user's ID token
 */
export async function verifyUserAdminClaim(user: User | null, forceRefresh: boolean = false): Promise<boolean> {
  if (!user) return false;
  try {
    const idTokenResult: IdTokenResult = await user.getIdTokenResult(forceRefresh);
    return Boolean(idTokenResult.claims && idTokenResult.claims.admin === true);
  } catch (error) {
    console.error('Error al verificar custom claims de Firebase Auth:', error);
    return false;
  }
}
