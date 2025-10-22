import { initializeApp } from 'firebase/app';
import { getFirestore, connectFirestoreEmulator } from 'firebase/firestore';
import { getAuth, connectAuthEmulator } from 'firebase/auth';
import { getFunctions, connectFunctionsEmulator } from 'firebase/functions';

// Firebase configuration
const firebaseConfig = {
  apiKey: "AIzaSyB5x7T30EkC60dfdOaeUF7sMSjrTh3pjQM",
  authDomain: "team-urlaubsplaner-rlp.firebaseapp.com",
  projectId: "team-urlaubsplaner-rlp",
  storageBucket: "team-urlaubsplaner-rlp.firebasestorage.app",
  messagingSenderId: "590899803409",
  appId: "1:590899803409:web:adfd752d032c766f2ec8b0"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);

// Initialize Firebase services
export const db = getFirestore(app);
export const auth = getAuth(app);
export const functions = getFunctions(app);

// Connect to emulators in development
if (import.meta.env.DEV && import.meta.env.VITE_USE_EMULATORS === 'true') {
  try {
    connectFirestoreEmulator(db, 'localhost', 8080);
    connectAuthEmulator(auth, 'http://localhost:9099');
    connectFunctionsEmulator(functions, 'localhost', 5001);
  } catch {
    // Emulators already connected
  }
}

export default app;
