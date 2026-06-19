/**
 * Firebase Production Configuration
 * 
 * NOTE TO ADMINISTRATOR:
 * This file scaffolds the Cloud Database and Authentication layer.
 * To activate live cross-device synchronization:
 * 1. Create a project at https://console.firebase.google.com/
 * 2. Enable 'Email/Password Authentication' and 'Firestore Database'
 * 3. Replace the placeholder config below with your actual API variables
 * 4. Run `npm install firebase` in your terminal
 */

import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";
import { getFirestore } from "firebase/firestore";

const firebaseConfig = {
  apiKey: import.meta.env.VITE_FIREBASE_API_KEY,
  authDomain: import.meta.env.VITE_FIREBASE_AUTH_DOMAIN,
  projectId: import.meta.env.VITE_FIREBASE_PROJECT_ID,
  storageBucket: import.meta.env.VITE_FIREBASE_STORAGE_BUCKET,
  messagingSenderId: import.meta.env.VITE_FIREBASE_MESSAGING_SENDER_ID,
  appId: import.meta.env.VITE_FIREBASE_APP_ID,
  measurementId: import.meta.env.VITE_FIREBASE_MEASUREMENT_ID
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
export const auth = getAuth(app);
export const db = getFirestore(app);
