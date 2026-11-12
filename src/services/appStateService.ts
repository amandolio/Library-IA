import { supabase, AuthUser } from './authService';

const SNAPSHOT_KEY = 'auth:snapshot';
const APP_STATE_KEY_PREFIX = 'app-state:';
const MAX_HISTORY_ENTRIES = 50;

export const OFFLINE_TABS: readonly string[] = ['history'];

export type HistoryEntry = { tab: string; at: string };

export type AppState = {
  lastTab: string;
  history: HistoryEntry[];
};

export const DEFAULT_APP_STATE: AppState = { lastTab: 'dashboard', history: [] };

export function appendNavigation(state: AppState, tab: string): AppState {
  return {
    lastTab: tab,
    history: [{ tab, at: new Date().toISOString() }, ...state.history].slice(0, MAX_HISTORY_ENTRIES),
  };
}

export function saveSnapshot(user: AuthUser) {
  localStorage.setItem(SNAPSHOT_KEY, JSON.stringify({ user, savedAt: new Date().toISOString() }));
}

export function loadSnapshot(): AuthUser | null {
  const raw = localStorage.getItem(SNAPSHOT_KEY);
  if (!raw) return null;
  try {
    const parsed = JSON.parse(raw);
    return parsed?.user?.id ? (parsed.user as AuthUser) : null;
  } catch {
    return null;
  }
}

export function clearSnapshot(userId?: string) {
  const snapshot = loadSnapshot();
  localStorage.removeItem(SNAPSHOT_KEY);
  if (userId ?? snapshot?.id) {
    localStorage.removeItem(APP_STATE_KEY_PREFIX + (userId ?? snapshot?.id));
  }
}

export function loadCachedAppState(userId: string): AppState {
  const raw = localStorage.getItem(APP_STATE_KEY_PREFIX + userId);
  if (!raw) return DEFAULT_APP_STATE;
  try {
    const parsed = JSON.parse(raw);
    if (typeof parsed?.lastTab !== 'string' || !Array.isArray(parsed?.history)) return DEFAULT_APP_STATE;
    return parsed as AppState;
  } catch {
    return DEFAULT_APP_STATE;
  }
}

export function saveCachedAppState(userId: string, state: AppState) {
  localStorage.setItem(APP_STATE_KEY_PREFIX + userId, JSON.stringify(state));
}

export async function fetchRemoteAppState(userId: string): Promise<AppState | null> {
  const { data, error } = await supabase
    .from('user_app_state')
    .select('last_tab, history')
    .eq('user_id', userId)
    .maybeSingle();
  if (error) throw error;
  if (!data || typeof data.last_tab !== 'string' || !Array.isArray(data.history)) return null;
  return { lastTab: data.last_tab, history: data.history as HistoryEntry[] };
}

export async function pushRemoteAppState(userId: string, state: AppState) {
  const { error } = await supabase.from('user_app_state').upsert(
    {
      user_id: userId,
      last_tab: state.lastTab,
      history: state.history,
      updated_at: new Date().toISOString(),
    },
    { onConflict: 'user_id' }
  );
  if (error) throw error;
}
