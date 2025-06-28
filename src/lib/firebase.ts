import { initializeApp } from 'firebase/app';
import { getAuth, GoogleAuthProvider, setPersistence, browserLocalPersistence, browserSessionPersistence, inMemoryPersistence } from 'firebase/auth';

// Your Firebase config - you'll need to replace these with your actual values
const firebaseConfig = {
  apiKey: process.env.NEXT_PUBLIC_FIREBASE_API_KEY,
  authDomain: process.env.NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN,
  projectId: process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID,
  storageBucket: process.env.NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET,
  messagingSenderId: process.env.NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID,
  appId: process.env.NEXT_PUBLIC_FIREBASE_APP_ID,
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);

// Initialize Firebase Authentication and get a reference to the service
export const auth = getAuth(app);

// Configure persistence
// Change this value to switch between persistence modes
const PERSISTENCE_MODE = 'LOCAL' as const; // Options: 'LOCAL', 'SESSION', 'MEMORY'

const persistenceMap = {
  LOCAL: browserLocalPersistence,
  SESSION: browserSessionPersistence,
  MEMORY: inMemoryPersistence,
} as const;

const persistence = persistenceMap[PERSISTENCE_MODE];

setPersistence(auth, persistence)
  .then(() => {
    console.log(`Firebase auth persistence set to: ${PERSISTENCE_MODE}`);
  })
  .catch((error) => {
    console.error('Error setting persistence:', error);
  });

// Google Auth Provider
export const googleProvider = new GoogleAuthProvider();

export default app; 