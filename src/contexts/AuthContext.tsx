import React, { createContext, useContext, useState, useEffect, useCallback } from 'react';
import type { Session, User } from '@supabase/supabase-js';
import {
  supabase,
  signInWithGoogle,
  signOut,
  fetchProfile,
  createProfile,
  registerSession,
  updateHeartbeat,
  removeSession,
  AuthUser,
  PendingRegistration,
  ProfileRecord,
  RegistrationInput,
} from '../services/authService';
import { saveSnapshot, loadSnapshot, clearSnapshot } from '../services/appStateService';

interface AuthContextType {
  user: AuthUser | null;
  session: Session | null;
  pendingRegistration: PendingRegistration | null;
  loading: boolean;
  isOffline: boolean;
  error: string | null;
  loginWithGoogle: () => Promise<void>;
  completeRegistration: (input: RegistrationInput) => Promise<void>;
  logout: () => Promise<void>;
  clearError: () => void;
  refreshUser: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

const OFFLINE_LOGIN_MESSAGE = 'Necesitas conexion a internet para iniciar sesion.';

function mapUser(supabaseUser: User, profile: ProfileRecord): AuthUser {
  const meta = supabaseUser.user_metadata ?? {};
  return {
    id: supabaseUser.id,
    email: supabaseUser.email ?? '',
    name: profile.name || meta.full_name || meta.name || supabaseUser.email?.split('@')[0] || 'Usuario',
    avatar_url: meta.avatar_url || meta.picture,
    role: profile.role,
    department: profile.department,
    profession: profile.profession,
    faculty: profile.faculty,
  };
}

function toPendingRegistration(supabaseUser: User): PendingRegistration {
  const meta = supabaseUser.user_metadata ?? {};
  return {
    id: supabaseUser.id,
    email: supabaseUser.email ?? '',
    name: meta.full_name || meta.name || supabaseUser.email?.split('@')[0] || '',
    avatar_url: meta.avatar_url || meta.picture,
  };
}

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<AuthUser | null>(null);
  const [session, setSession] = useState<Session | null>(null);
  const [pendingRegistration, setPendingRegistration] = useState<PendingRegistration | null>(null);
  const [loading, setLoading] = useState(true);
  const [isOffline, setIsOffline] = useState(() => !navigator.onLine);
  const [error, setError] = useState<string | null>(null);

  const restoreFromSnapshot = useCallback((userId?: string) => {
    const snapshot = loadSnapshot();
    if (!snapshot || (userId && snapshot.id !== userId)) return false;
    setUser(snapshot);
    setPendingRegistration(null);
    setIsOffline(true);
    return true;
  }, []);

  const resolveSession = useCallback(async (nextSession: Session | null) => {
    setSession(nextSession);

    if (!nextSession) {
      if (!navigator.onLine && restoreFromSnapshot()) return;
      setUser(null);
      setPendingRegistration(null);
      return;
    }

    if (!navigator.onLine) {
      if (!restoreFromSnapshot(nextSession.user.id)) {
        setUser(null);
        setPendingRegistration(null);
      }
      return;
    }

    let profile: ProfileRecord | null;
    try {
      profile = await fetchProfile(nextSession.user.id);
    } catch (err) {
      console.error('Error loading profile:', err);
      if (restoreFromSnapshot(nextSession.user.id)) return;
      throw err;
    }

    if (!profile) {
      setUser(null);
      setPendingRegistration(toPendingRegistration(nextSession.user));
      return;
    }

    const mapped = mapUser(nextSession.user, profile);
    setIsOffline(false);
    setPendingRegistration(null);
    setUser(mapped);
    saveSnapshot(mapped);
    registerSession(mapped.id).catch((err) => console.error('Error registering session:', err));
  }, [restoreFromSnapshot]);

  const refreshUser = useCallback(async () => {
    if (!session || !navigator.onLine) return;
    const profile = await fetchProfile(session.user.id);
    if (profile) {
      const mapped = mapUser(session.user, profile);
      setUser(mapped);
      saveSnapshot(mapped);
    }
  }, [session]);

  useEffect(() => {
    const { data: { subscription } } = supabase.auth.onAuthStateChange((event, nextSession) => {
      (async () => {
        try {
          if (event === 'SIGNED_OUT') {
            setSession(null);
            setUser(null);
            setPendingRegistration(null);
            clearSnapshot();
          } else if (event === 'INITIAL_SESSION' || event === 'SIGNED_IN') {
            await resolveSession(nextSession);
          } else if (event === 'TOKEN_REFRESHED' && nextSession) {
            setSession(nextSession);
          }
        } catch (err: any) {
          console.error('Error resolving session:', err);
          setError('No se pudo verificar tu cuenta. Intenta de nuevo.');
        } finally {
          setLoading(false);
        }
      })();
    });

    return () => { subscription.unsubscribe(); };
  }, [resolveSession]);

  useEffect(() => {
    const handleOffline = () => setIsOffline(true);
    const handleOnline = () => {
      (async () => {
        try {
          const { data: { session: currentSession } } = await supabase.auth.getSession();
          await resolveSession(currentSession);
        } catch (err) {
          console.error('Error restoring connection:', err);
        }
      })();
    };
    window.addEventListener('offline', handleOffline);
    window.addEventListener('online', handleOnline);
    return () => {
      window.removeEventListener('offline', handleOffline);
      window.removeEventListener('online', handleOnline);
    };
  }, [resolveSession]);

  useEffect(() => {
    if (!user || isOffline) return;
    const interval = setInterval(() => {
      updateHeartbeat(user.id).catch((err) => console.error('Error updating heartbeat:', err));
    }, 30000);
    return () => clearInterval(interval);
  }, [user, isOffline]);

  const loginWithGoogle = async () => {
    setError(null);
    if (!navigator.onLine) {
      setError(OFFLINE_LOGIN_MESSAGE);
      return;
    }
    try {
      await signInWithGoogle();
    } catch (err) {
      console.error('Error starting Google sign-in:', err);
      setError('No se pudo iniciar sesion con Google. Intenta de nuevo.');
    }
  };

  const completeRegistration = async (input: RegistrationInput) => {
    setError(null);
    if (!pendingRegistration) return;
    if (!navigator.onLine) {
      setError(OFFLINE_LOGIN_MESSAGE);
      return;
    }
    try {
      const profile = await createProfile(pendingRegistration.id, input);
      const mapped: AuthUser = {
        id: pendingRegistration.id,
        email: pendingRegistration.email,
        name: profile.name,
        avatar_url: pendingRegistration.avatar_url,
        role: profile.role,
        department: profile.department,
        profession: profile.profession,
        faculty: profile.faculty,
      };
      setPendingRegistration(null);
      setUser(mapped);
      saveSnapshot(mapped);
      registerSession(mapped.id).catch((err) => console.error('Error registering session:', err));
    } catch (err) {
      console.error('Error creating profile:', err);
      setError('No se pudo completar tu registro. Intenta de nuevo.');
    }
  };

  const logout = async () => {
    setError(null);
    const currentUser = user;
    try {
      if (currentUser && navigator.onLine) {
        await removeSession(currentUser.id).catch((err) => console.error('Error removing session:', err));
      }
      await signOut(navigator.onLine ? 'global' : 'local');
      setSession(null);
      setUser(null);
      setPendingRegistration(null);
      clearSnapshot(currentUser?.id);
    } catch (err) {
      console.error('Error signing out:', err);
      setError('No se pudo cerrar la sesion. Intenta de nuevo.');
    }
  };

  const clearError = useCallback(() => setError(null), []);

  return (
    <AuthContext.Provider
      value={{
        user,
        session,
        pendingRegistration,
        loading,
        isOffline,
        error,
        loginWithGoogle,
        completeRegistration,
        logout,
        clearError,
        refreshUser,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (context === undefined) throw new Error('useAuth must be used within an AuthProvider');
  return context;
}
