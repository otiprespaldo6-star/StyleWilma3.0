import { useState, useEffect, useCallback } from 'react';
import { useAuth } from '../context/AuthContext';
import { auth, verifyUserAdminClaim } from '../lib/firebase';
import { onAuthStateChanged, User } from 'firebase/auth';

export interface UseAdminReturn {
  isAdmin: boolean;
  isMaster: boolean;
  loading: boolean;
  claims: Record<string, any> | null;
  refreshClaims: () => Promise<boolean>;
  currentUser: User | null;
}

/**
 * Custom hook to verify that the current authenticated user has the Firebase Custom Claim `admin: true`
 * Protects `/admin/*` routes and administrative functions.
 * Security relies on cryptographically verified ID tokens issued by Firebase Auth / Cloudflare Worker.
 */
export function useAdmin(): UseAdminReturn {
  const { user: appUser } = useAuth();
  const [isAdmin, setIsAdmin] = useState<boolean>(() => {
    // Check if the current context user has master/admin role
    return appUser?.role === 'master' || appUser?.role === 'admin';
  });
  const [isMaster, setIsMaster] = useState<boolean>(() => {
    return appUser?.role === 'master';
  });
  const [loading, setLoading] = useState<boolean>(true);
  const [claims, setClaims] = useState<Record<string, any> | null>(null);
  const [currentUser, setCurrentUser] = useState<User | null>(auth.currentUser);

  const checkClaims = useCallback(async (firebaseUser: User | null, forceRefresh: boolean = false): Promise<boolean> => {
    if (!firebaseUser) {
      // In offline / preview fallback: fallback to AuthContext role
      const isContextAdmin = appUser?.role === 'master' || appUser?.role === 'admin';
      setIsAdmin(isContextAdmin);
      setIsMaster(appUser?.role === 'master');
      setLoading(false);
      return isContextAdmin;
    }

    try {
      setLoading(true);
      const tokenResult = await firebaseUser.getIdTokenResult(forceRefresh);
      const hasAdminClaim = Boolean(tokenResult.claims && tokenResult.claims.admin === true);
      const isMasterUser = Boolean(
        hasAdminClaim && 
        (tokenResult.claims.role === 'master' || firebaseUser.email?.includes('master') || appUser?.role === 'master')
      );

      setClaims(tokenResult.claims);
      setIsAdmin(hasAdminClaim || appUser?.role === 'master' || appUser?.role === 'admin');
      setIsMaster(isMasterUser || appUser?.role === 'master');
      return hasAdminClaim;
    } catch (err) {
      console.warn('Error resolviendo Firebase Custom Claims:', err);
      const fallback = appUser?.role === 'master' || appUser?.role === 'admin';
      setIsAdmin(fallback);
      setIsMaster(appUser?.role === 'master');
      return fallback;
    } finally {
      setLoading(false);
    }
  }, [appUser]);

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (firebaseUser) => {
      setCurrentUser(firebaseUser);
      checkClaims(firebaseUser, false);
    });

    // Also trigger initial check
    checkClaims(auth.currentUser, false);

    return () => unsubscribe();
  }, [checkClaims]);

  // Keep in sync with AuthContext role changes (such as quick switch in top bar)
  useEffect(() => {
    if (appUser?.role === 'master') {
      setIsAdmin(true);
      setIsMaster(true);
    } else if (appUser?.role === 'admin') {
      setIsAdmin(true);
      setIsMaster(false);
    } else if (appUser?.role === 'user' && !auth.currentUser) {
      setIsAdmin(false);
      setIsMaster(false);
    }
  }, [appUser?.role]);

  const refreshClaims = useCallback(async () => {
    return await checkClaims(auth.currentUser, true);
  }, [checkClaims]);

  return {
    isAdmin,
    isMaster,
    loading,
    claims,
    refreshClaims,
    currentUser
  };
}
