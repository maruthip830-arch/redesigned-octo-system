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
  apiKey: "AIzaSyBY2dBQzcaaJ3ZCwdAOpwXxIIUl8cy14S0",
  authDomain: "astrarent-f4a55.firebaseapp.com",
  projectId: "astrarent-f4a55",
  storageBucket: "astrarent-f4a55.firebasestorage.app",
  messagingSenderId: "249409220629",
  appId: "1:249409220629:web:75dba3eab2cc2091259e1c",
  measurementId: "G-97336489VV"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
export const auth = getAuth(app);
export const db = getFirestore(app);
