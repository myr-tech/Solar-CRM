import { initializeApp, getApps, getApp } from 'firebase/app';
import {
  getAuth,
  signInWithPopup,
  GoogleAuthProvider,
  onAuthStateChanged,
  signOut,
  User,
} from 'firebase/auth';
import firebaseConfig from '../../firebase-applet-config.json';

// Initialize Firebase App singleton safely
export const firebaseApp = getApps().length === 0 ? initializeApp(firebaseConfig) : getApp();
export const firebaseAuth = getAuth(firebaseApp);

// Configure Google Auth Provider with Google Drive file scope
export const googleAuthProvider = new GoogleAuthProvider();
googleAuthProvider.addScope('https://www.googleapis.com/auth/drive.file');
googleAuthProvider.setCustomParameters({
  prompt: 'select_account',
});

// State & in-memory access token cache
let isSigningIn = false;
let cachedAccessToken: string | null = null;
let currentUserProfile: User | null = null;

type AuthSubscriber = (user: User | null, accessToken: string | null) => void;
const subscribers = new Set<AuthSubscriber>();

const notifySubscribers = () => {
  subscribers.forEach((cb) => cb(currentUserProfile, cachedAccessToken));
};

export const subscribeToAuth = (cb: AuthSubscriber) => {
  subscribers.add(cb);
  cb(currentUserProfile, cachedAccessToken);
  return () => {
    subscribers.delete(cb);
  };
};

// Initialize auth state listener
export const initAuth = (
  onAuthSuccess?: (user: User, token: string) => void,
  onAuthFailure?: () => void
) => {
  return onAuthStateChanged(firebaseAuth, async (user: User | null) => {
    currentUserProfile = user;
    if (user) {
      if (cachedAccessToken) {
        notifySubscribers();
        if (onAuthSuccess) onAuthSuccess(user, cachedAccessToken);
      } else if (!isSigningIn) {
        // Token will be populated upon sign-in popup
        notifySubscribers();
        if (onAuthFailure) onAuthFailure();
      }
    } else {
      cachedAccessToken = null;
      notifySubscribers();
      if (onAuthFailure) onAuthFailure();
    }
  });
};

// Google Sign-In with popup
export const signInWithGoogleAccount = async (): Promise<{
  user: User;
  accessToken: string;
} | null> => {
  try {
    isSigningIn = true;
    const result = await signInWithPopup(firebaseAuth, googleAuthProvider);
    const credential = GoogleAuthProvider.credentialFromResult(result);
    if (!credential?.accessToken) {
      throw new Error('Failed to obtain Google Drive OAuth access token from Firebase authentication.');
    }

    cachedAccessToken = credential.accessToken;
    currentUserProfile = result.user;
    notifySubscribers();
    return { user: result.user, accessToken: cachedAccessToken };
  } catch (error: any) {
    console.error('Google Sign-In Error:', error);
    throw error;
  } finally {
    isSigningIn = false;
  }
};

export const getCachedAccessToken = (): string | null => {
  return cachedAccessToken;
};

export const getCurrentFirebaseUser = (): User | null => {
  return currentUserProfile || firebaseAuth.currentUser;
};

export const signOutGoogle = async () => {
  await signOut(firebaseAuth);
  cachedAccessToken = null;
  currentUserProfile = null;
  notifySubscribers();
};
