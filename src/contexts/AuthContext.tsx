import React, { createContext, useContext, useState, useEffect, useCallback } from 'react';
import { supabase, signIn, signUp, signOut, AuthUser } from '../services/authService';

interface AuthContextType {
  user: AuthUser | null;
  session: any;
  loading: boolean;
  error: string | null;
  login: (email: string, password: string) => Promise<void>;
  register: (email: string, password: string, name?: string, department?: string) => Promise<void>;
  logout: () => Promise<void>;
  clearError: () => void;
  refreshUser: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

async function fetchProfile(userId: string): Promise<{ role: string; name: string; department: string } | null> {
  const { data } = await supabase
    .from('user_profiles')
    .select('role, name, department')
    .eq('id', userId)
    .maybeSingle();
  return data;
}

async function upsertProfile(user: any) {
  const name = user.user_metadata?.name || user.email?.split('@')[0] || 'Usuario';
  const department = user.user_metadata?.department || 'General';
  const role = user.user_metadata?.role || 'lector';

  await supabase.from('user_profiles').upsert(
    { id: user.id, name, department, role, updated_at: new Date().toISOString() },
    { onConflict: 'id', ignoreDuplicates: false }
  );
}

async function registerSession(userId: string) {
  await supabase.from('active_sessions').upsert(
    { user_id: userId, login_at: new Date().toISOString(), last_seen: new Date().toISOString() },
    { onConflict: 'user_id' }
  );
}

async function updateHeartbeat(userId: string) {
  await supabase
    .from('active_sessions')
    .update({ last_seen: new Date().toISOString() })
    .eq('user_id', userId);
}

async function removeSession(userId: string) {
  await supabase.from('active_sessions').delete().eq('user_id', userId);
}

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<AuthUser | null>(null);
  const [session, setSession] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const buildUser = useCallback(async (supabaseUser: any): Promise<AuthUser> => {
    const profile = await fetchProfile(supabaseUser.id);
    return {
      id: supabaseUser.id,
      email: supabaseUser.email || '',
      name: profile?.name || supabaseUser.user_metadata?.name || supabaseUser.email?.split('@')[0] || 'Usuario',
      avatar_url: supabaseUser.user_metadata?.avatar_url,
      role: profile?.role || supabaseUser.user_metadata?.role || 'lector',
      department: profile?.department || supabaseUser.user_metadata?.department || 'General',
    };
  }, []);

  const refreshUser = useCallback(async () => {
    const { data: { user: supabaseUser } } = await supabase.auth.getUser();
    if (supabaseUser) {
      const mapped = await buildUser(supabaseUser);
      setUser(mapped);
    }
  }, [buildUser]);

  useEffect(() => {
    const initAuth = async () => {
      try {
        const { data: { session: initialSession } } = await supabase.auth.getSession();
        if (initialSession) {
          setSession(initialSession);
          const mapped = await buildUser(initialSession.user);
          setUser(mapped);
          await upsertProfile(initialSession.user);
          await registerSession(initialSession.user.id);
        }
      } catch (err) {
        console.error('Error getting initial session:', err);
      } finally {
        setLoading(false);
      }
    };

    initAuth();

    const { data: { subscription } } = supabase.auth.onAuthStateChange((event, newSession) => {
      (async () => {
        if (event === 'SIGNED_IN' && newSession) {
          setSession(newSession);
          const mapped = await buildUser(newSession.user);
          setUser(mapped);
          await upsertProfile(newSession.user);
          await registerSession(newSession.user.id);
        } else if (event === 'SIGNED_OUT') {
          setSession(null);
          setUser(null);
        } else if (event === 'TOKEN_REFRESHED' && newSession) {
          setSession(newSession);
        }
      })();
    });

    return () => { subscription.unsubscribe(); };
  }, [buildUser]);

  // Heartbeat every 30s while logged in
  useEffect(() => {
    if (!user) return;
    const interval = setInterval(() => updateHeartbeat(user.id), 30000);
    return () => clearInterval(interval);
  }, [user]);

  const login = async (email: string, password: string) => {
    setError(null);
    setLoading(true);
    try {
      const data = await signIn(email, password);
      if (data.session) {
        setSession(data.session);
        const mapped = await buildUser(data.session.user);
        setUser(mapped);
        await upsertProfile(data.session.user);
        await registerSession(data.session.user.id);
      }
    } catch (err: any) {
      setError(err.message || 'Error al iniciar sesion');
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
        const mapped = await buildUser(data.session.user);
        setUser(mapped);
        await upsertProfile(data.session.user);
        await registerSession(data.session.user.id);
      }
    } catch (err: any) {
      setError(err.message || 'Error al registrar usuario');
      throw err;
    } finally {
      setLoading(false);
    }
  };

  const logout = async () => {
    setError(null);
    try {
      if (user) await removeSession(user.id);
      await signOut();
      setUser(null);
      setSession(null);
    } catch (err: any) {
      setError(err.message || 'Error al cerrar sesion');
      throw err;
    }
  };

  const clearError = useCallback(() => setError(null), []);

  return (
    <AuthContext.Provider value={{ user, session, loading, error, login, register, logout, clearError, refreshUser }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (context === undefined) throw new Error('useAuth must be used within an AuthProvider');
  return context;
}
