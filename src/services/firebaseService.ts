import { initializeApp } from 'firebase/app';
import { getFirestore, connectFirestoreEmulator } from 'firebase/firestore';
import { getAuth, connectAuthEmulator } from 'firebase/auth';
import { getFunctions, connectFunctionsEmulator } from 'firebase/functions';

// Firebase configuration
const firebaseConfig = {
  apiKey: "your-api-key-here",
  authDomain: "team-urlaubsplaner-rlp.firebaseapp.com",
  projectId: "team-urlaubsplaner-rlp",
  storageBucket: "team-urlaubsplaner-rlp.appspot.com",
  messagingSenderId: "your-sender-id-here",
  appId: "your-app-id-here"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);

// Initialize Firebase services
export const db = getFirestore(app);
export const auth = getAuth(app);
export const functions = getFunctions(app);

// Connect to emulators in development
if (import.meta.env.DEV) {
  try {
    connectFirestoreEmulator(db, 'localhost', 8080);
    connectAuthEmulator(auth, 'http://localhost:9099');
    connectFunctionsEmulator(functions, 'localhost', 5001);
  } catch {
    // Emulators already connected
  }
}

export default app;
