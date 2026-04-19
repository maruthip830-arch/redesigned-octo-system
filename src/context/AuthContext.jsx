import React, { createContext, useState, useEffect, useContext } from 'react';
import { auth, db } from '../firebase';
import { 
  createUserWithEmailAndPassword, 
  signInWithEmailAndPassword, 
  signOut as firebaseSignOut, 
  onAuthStateChanged 
} from 'firebase/auth';
import { doc, setDoc, getDoc } from 'firebase/firestore';

const AuthContext = createContext();

export const useAuth = () => useContext(AuthContext);

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [isAuthModalOpen, setIsAuthModalOpen] = useState(false);

  useEffect(() => {
    // Listen to live Firebase JWT changes
    const unsubscribe = onAuthStateChanged(auth, async (currentUser) => {
      if (currentUser) {
        try {
          const userDoc = await getDoc(doc(db, 'users', currentUser.uid));
          if (userDoc.exists()) {
            const userData = { ...currentUser, ...userDoc.data() };
            setUser(userData);
            localStorage.setItem('astra_user', JSON.stringify(userData));
          } else {
            setUser(currentUser);
            localStorage.setItem('astra_user', JSON.stringify(currentUser));
          }
        } catch (e) {
          console.error("Firestore Error:", e);
          setUser(currentUser);
        }
      } else {
        setUser(null);
        localStorage.removeItem('astra_user');
      }
    });

    return () => unsubscribe();
  }, []);

  const login = async (email, password) => {
    try {
      await signInWithEmailAndPassword(auth, email, password);
      setIsAuthModalOpen(false);
      return { success: true };
    } catch (error) {
      console.error("Firebase Login Error:", error);
      return { success: false, error: 'Authorization Denied: ' + error.message };
    }
  };

  const signup = async (name, email, phone, password) => {
    try {
      const userCredential = await createUserWithEmailAndPassword(auth, email, password);
      const userObj = userCredential.user;
      
      // Save extended profile data into Firestore Document
      await setDoc(doc(db, 'users', userObj.uid), {
        name,
        email,
        phone,
        createdAt: new Date().toISOString(),
        role: email === 'admin@astrarent.com' ? 'admin' : 'user'
      });
      
      setIsAuthModalOpen(false);
      return { success: true };
    } catch (error) {
      console.error("Firebase Signup Error:", error);
      return { success: false, error: 'Registration Blocked: ' + error.message };
    }
  };

  const logout = async () => {
    try {
      await firebaseSignOut(auth);
      localStorage.removeItem('astra_cart');
      localStorage.removeItem('astra_order_id');
      localStorage.removeItem('astra_kyc_status');
    } catch (error) {
      console.error('Logout failed', error);
    }
  };

  const openAuthModal = () => setIsAuthModalOpen(true);
  const closeAuthModal = () => setIsAuthModalOpen(false);

  return (
    <AuthContext.Provider value={{
      user,
      login,
      signup,
      logout,
      isAuthModalOpen,
      openAuthModal,
      closeAuthModal
    }}>
      {children}
    </AuthContext.Provider>
  );
};
