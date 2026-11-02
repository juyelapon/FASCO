import { createContext, useCallback, useContext, useEffect, useMemo, useState } from 'react';
import { app } from '../firebase';

const AuthContext = createContext(null);
const loadFirebaseAuth = () => import('firebase/auth');

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [authError, setAuthError] = useState(null);

  const signup = useCallback(async (email, password) => {
    const { createUserWithEmailAndPassword, getAuth } = await loadFirebaseAuth();
    return createUserWithEmailAndPassword(getAuth(app), email, password);
  }, []);
  const login = useCallback(async (email, password) => {
    const { getAuth, signInWithEmailAndPassword } = await loadFirebaseAuth();
    return signInWithEmailAndPassword(getAuth(app), email, password);
  }, []);
  const googleSignIn = useCallback(async () => {
    const { getAuth, GoogleAuthProvider, signInWithPopup } = await loadFirebaseAuth();
    return signInWithPopup(getAuth(app), new GoogleAuthProvider());
  }, []);
  const resetPassword = useCallback(async (email) => {
    const { getAuth, sendPasswordResetEmail } = await loadFirebaseAuth();
    return sendPasswordResetEmail(getAuth(app), email);
  }, []);
  const logout = useCallback(async () => {
    const { getAuth, signOut } = await loadFirebaseAuth();
    return signOut(getAuth(app));
  }, []);

  useEffect(() => {
    let active = true;
    let unsubscribe;

    const startAuthListener = async () => {
      try {
        const { getAuth, onAuthStateChanged } = await loadFirebaseAuth();
        if (!active) return;

        unsubscribe = onAuthStateChanged(
          getAuth(app),
          (currentUser) => {
            setUser(currentUser);
            setAuthError(null);
            setLoading(false);
          },
          (error) => {
            console.error('Firebase auth state listener failed:', error);
            setAuthError(error);
            setLoading(false);
          }
        );
      } catch (error) {
        console.error('Failed to initialize Firebase authentication:', error);
        if (active) {
          setAuthError(error);
          setLoading(false);
        }
      }
    };

    startAuthListener();
    return () => {
      active = false;
      unsubscribe?.();
    };
  }, []);

  const value = useMemo(
    () => ({ user, signup, login, googleSignIn, resetPassword, logout, loading, authError }),
    [user, signup, login, googleSignIn, resetPassword, logout, loading, authError]
  );

  return (
    <AuthContext.Provider value={value}>
      {!loading && children}
    </AuthContext.Provider>
  );
};

// eslint-disable-next-line react-refresh/only-export-components
export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};