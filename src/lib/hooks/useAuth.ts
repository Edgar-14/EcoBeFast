'use client';

import { createContext, useContext, useEffect, useState } from 'react';
import {
  User,
  signInWithEmailAndPassword,
  createUserWithEmailAndPassword,
  signOut as firebaseSignOut,
  sendEmailVerification,
  sendPasswordResetEmail,
  onAuthStateChanged,
  updateProfile
} from 'firebase/auth';
import { doc, getDoc, setDoc, serverTimestamp } from 'firebase/firestore';
import { auth, db } from '@/lib/firebase/config';
import { User as AppUser, CustomClaims, AuthContextType } from '@/lib/types/auth';
import { getErrorMessage } from '@/lib/utils/helpers';

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};

export const AuthProvider = ({ children }: { children: React.ReactNode }) => {
  const [user, setUser] = useState<AppUser | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (firebaseUser) => {
      if (firebaseUser) {
        try {
          // Get custom claims
          const idTokenResult = await firebaseUser.getIdTokenResult();
          const customClaims = idTokenResult.claims as CustomClaims;

          const appUser: AppUser = {
            uid: firebaseUser.uid,
            email: firebaseUser.email!,
            displayName: firebaseUser.displayName || '',
            emailVerified: firebaseUser.emailVerified,
            customClaims
          };

          setUser(appUser);
        } catch (error) {
          console.error('Error getting user data:', error);
          setUser(null);
        }
      } else {
        setUser(null);
      }
      setLoading(false);
    });

    return unsubscribe;
  }, []);

  const signIn = async (email: string, password: string): Promise<void> => {
    try {
      setLoading(true);
      await signInWithEmailAndPassword(auth, email, password);
    } catch (error) {
      throw new Error(getErrorMessage(error));
    } finally {
      setLoading(false);
    }
  };

  const signUp = async (
    email: string,
    password: string,
    additionalData?: any
  ): Promise<void> => {
    try {
      setLoading(true);

      const userCredential = await createUserWithEmailAndPassword(auth, email, password);
      const firebaseUser = userCredential.user;

      // Update profile with display name
      if (additionalData?.displayName) {
        await updateProfile(firebaseUser, {
          displayName: additionalData.displayName
        });
      }

      // Send email verification
      await sendEmailVerification(firebaseUser);

      // Set custom claims for user type (used by Cloud Functions)
      if (additionalData?.userType) {
        // This will be handled by Cloud Function trigger
        await setDoc(doc(db, 'userRegistrations', firebaseUser.uid), {
          ...additionalData,
          uid: firebaseUser.uid,
          createdAt: serverTimestamp()
        });
      }

    } catch (error) {
      throw new Error(getErrorMessage(error));
    } finally {
      setLoading(false);
    }
  };

  const signOut = async (): Promise<void> => {
    try {
      await firebaseSignOut(auth);
    } catch (error) {
      throw new Error(getErrorMessage(error));
    }
  };

  const resetPassword = async (email: string): Promise<void> => {
    try {
      await sendPasswordResetEmail(auth, email);
    } catch (error) {
      throw new Error(getErrorMessage(error));
    }
  };

  const updateUserProfile = async (data: Partial<AppUser>): Promise<void> => {
    try {
      if (!auth.currentUser) throw new Error('No user logged in');

      await updateProfile(auth.currentUser, {
        displayName: data.displayName
      });

      // Update user state
      setUser(prev => prev ? { ...prev, ...data } : null);
    } catch (error) {
      throw new Error(getErrorMessage(error));
    }
  };

  const value: AuthContextType = {
    user,
    loading,
    signIn,
    signUp,
    signOut,
    resetPassword,
    updateProfile: updateUserProfile
  };

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
};
