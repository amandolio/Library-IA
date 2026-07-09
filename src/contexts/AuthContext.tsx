import React, { createContext, useContext, useState, useEffect, useCallback } from 'react';
import { supabase, signIn, signUp, signOut, getCurrentUser, AuthUser } from '../services/authService';

interface AuthContextType {
  user: AuthUser | null;
  session: any;
  loading: boolean;
  error: string | null;
  login: (email: string, password: string) => Promise<void>;
  register: (email: string, password: string, name?: string, department?: string) => Promise<void>;
  logout: () => Promise<void>;
  clearError: () => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<AuthUser | null>(null);
  const [session, setSession] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Convert Supabase user to app user
  const mapUser = useCallback((supabaseUser: any): AuthUser => {
    return {
      id: supabaseUser.id,
      email: supabaseUser.email || '',
      name: supabaseUser.user_metadata?.name || supabaseUser.email?.split('@')[0] || 'Usuario',
      avatar_url: supabaseUser.user_metadata?.avatar_url,
      role: supabaseUser.user_metadata?.role || 'lector',
      department: supabaseUser.user_metadata?.department || 'General',
    };
  }, []);

  // Initialize auth state
  useEffect(() => {
    // Get initial session
    const initAuth = async () => {
      try {
        const { data: { session: initialSession } } = await supabase.auth.getSession();
        if (initialSession) {
          setSession(initialSession);
          setUser(mapUser(initialSession.user));
        }
      } catch (err) {
        console.error('Error getting initial session:', err);
      } finally {
        setLoading(false);
      }
    };

    initAuth();

    // Listen for auth changes (avoid deadlock with async IIFE)
    const { data: { subscription } } = supabase.auth.onAuthStateChange((event, newSession) => {
      (async () => {
        if (event === 'SIGNED_IN' && newSession) {
          setSession(newSession);
          setUser(mapUser(newSession.user));
        } else if (event === 'SIGNED_OUT') {
          setSession(null);
          setUser(null);
        } else if (event === 'TOKEN_REFRESHED' && newSession) {
          setSession(newSession);
        }
      })();
    });

    return () => {
      subscription.unsubscribe();
    };
  }, [mapUser]);

  const login = async (email: string, password: string) => {
    setError(null);
    setLoading(true);
    try {
      const data = await signIn(email, password);
      if (data.session) {
        setSession(data.session);
        setUser(mapUser(data.session.user));
      }
    } catch (err: any) {
      const message = err.message || 'Error al iniciar sesion';
      setError(message);
      throw err;
    } finally {
      setLoading(false);
    }
  };

  const register = async (email: string, password: string, name?: string, department?: string) => {
    setError(null);
    setLoading(true);
    try {
      const data = await signUp(email, password, { name, department });
      if (data.session) {
        setSession(data.session);
        setUser(mapUser(data.session.user));
      }
    } catch (err: any) {
      const message = err.message || 'Error al registrar usuario';
      setError(message);
      throw err;
    } finally {
      setLoading(false);
    }
  };

  const logout = async () => {
    setError(null);
    try {
      await signOut();
      setUser(null);
      setSession(null);
    } catch (err: any) {
      setError(err.message || 'Error al cerrar sesion');
      throw err;
    }
  };

  const clearError = useCallback(() => {
    setError(null);
  }, []);

  const value: AuthContextType = {
    user,
    session,
    loading,
    error,
    login,
    register,
    logout,
    clearError,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
}
