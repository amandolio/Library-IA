import { useCallback, useEffect, useState } from 'react';
import {
  AppState,
  DEFAULT_APP_STATE,
  OFFLINE_TABS,
  appendNavigation,
  fetchRemoteAppState,
  loadCachedAppState,
  pushRemoteAppState,
  saveCachedAppState,
} from '../services/appStateService';

export function useAppState(userId: string | null, isOffline: boolean) {
  const [state, setState] = useState<AppState>(DEFAULT_APP_STATE);
  const [activeTab, setActiveTab] = useState<string>(DEFAULT_APP_STATE.lastTab);

  useEffect(() => {
    if (!userId) return;
    const cached = loadCachedAppState(userId);
    setState(cached);
    setActiveTab(isOffline && !OFFLINE_TABS.includes(cached.lastTab) ? OFFLINE_TABS[0] : cached.lastTab);

    if (isOffline) return;

    let active = true;
    fetchRemoteAppState(userId)
      .then((remote) => {
        if (!active || !remote) return;
        setState(remote);
        saveCachedAppState(userId, remote);
        setActiveTab(remote.lastTab);
      })
      .catch((err) => console.error('Error loading app state:', err));

    return () => { active = false; };
  }, [userId, isOffline]);

  const navigate = useCallback((tab: string) => {
    if (!userId) return;
    if (isOffline && !OFFLINE_TABS.includes(tab)) return;
    setActiveTab(tab);
    if (isOffline) return;

    const next = appendNavigation(state, tab);
    setState(next);
    saveCachedAppState(userId, next);
    pushRemoteAppState(userId, next).catch((err) => console.error('Error saving app state:', err));
  }, [userId, isOffline, state]);

  return { activeTab, navigate, history: state.history };
}
