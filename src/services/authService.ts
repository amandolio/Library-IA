import { createClient } from '@supabase/supabase-js';

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL;
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY;

if (!supabaseUrl || !supabaseAnonKey) {
  throw new Error('Missing Supabase environment variables');
}

export const supabase = createClient(supabaseUrl, supabaseAnonKey, {
  auth: {
    persistSession: true,
    autoRefreshToken: true,
    detectSessionInUrl: true,
  },
});

export type AuthUser = {
  id: string;
  email: string;
  name: string;
  avatar_url?: string;
  role: string;
  department: string;
  profession: string;
  faculty: string;
};

export type ProfileRecord = {
  name: string;
  role: string;
  department: string;
  profession: string;
  faculty: string;
};

export type PendingRegistration = {
  id: string;
  email: string;
  name: string;
  avatar_url?: string;
};

export type RegistrationInput = {
  name: string;
  profession: 'profesor' | 'estudiante';
  department?: string;
  faculty?: string;
};

export async function signInWithGoogle() {
  const { error } = await supabase.auth.signInWithOAuth({
    provider: 'google',
    options: { redirectTo: window.location.origin },
  });
  if (error) throw error;
}

export async function signOut(scope: 'global' | 'local' = 'global') {
  const { error } = await supabase.auth.signOut({ scope });
  if (error) throw error;
}

export async function fetchProfile(userId: string): Promise<ProfileRecord | null> {
  const { data, error } = await supabase
    .from('user_profiles')
    .select('name, role, department, profession, faculty')
    .eq('id', userId)
    .maybeSingle();
  if (error) throw error;
  return data;
}

export async function createProfile(userId: string, input: RegistrationInput): Promise<ProfileRecord> {
  const profile: ProfileRecord = {
    name: input.name.trim(),
    role: 'lector',
    department: input.profession === 'profesor' ? input.department || 'General' : 'General',
    profession: input.profession,
    faculty: input.profession === 'estudiante' ? input.faculty || '' : '',
  };
  const { error } = await supabase
    .from('user_profiles')
    .insert({ id: userId, ...profile, updated_at: new Date().toISOString() });
  if (error) throw error;
  return profile;
}

export async function registerSession(userId: string) {
  const now = new Date().toISOString();
  const { error } = await supabase
    .from('active_sessions')
    .upsert({ user_id: userId, login_at: now, last_seen: now }, { onConflict: 'user_id' });
  if (error) throw error;
}

export async function updateHeartbeat(userId: string) {
  const { error } = await supabase
    .from('active_sessions')
    .update({ last_seen: new Date().toISOString() })
    .eq('user_id', userId);
  if (error) throw error;
}

export async function removeSession(userId: string) {
  const { error } = await supabase.from('active_sessions').delete().eq('user_id', userId);
  if (error) throw error;
}
