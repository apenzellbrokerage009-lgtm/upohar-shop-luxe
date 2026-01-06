
import { AppState } from './types';

class ApiService {
  private storageKey = 'upohar_luxe_state';

  async fetchState(): Promise<AppState | null> {
    try {
      // We try to fetch from local storage first to ensure offline-first reliability
      const localData = localStorage.getItem(this.storageKey);
      if (localData) {
        return JSON.parse(localData);
      }
      
      // Fallback to a mock fetch or actual endpoint if available
      const res = await fetch('/api/state').catch(() => null);
      if (res && res.ok) {
        const remoteData = await res.json();
        this.saveToLocal(remoteData);
        return remoteData;
      }
      
      return null;
    } catch (error) {
      console.warn("API Fetch Warning (Using Defaults):", error);
      return null;
    }
  }

  async syncFullState(state: AppState): Promise<void> {
    try {
      // Persist to local storage immediately
      this.saveToLocal(state);
      
      // Attempt to sync with backend in the background
      fetch('/api/state', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(state)
      }).catch(err => console.debug("Background sync skipped (offline)"));
    } catch (error) {
      console.error("State Sync Error:", error);
    }
  }

  private saveToLocal(state: AppState) {
    localStorage.setItem(this.storageKey, JSON.stringify(state));
  }
}

export const api = new ApiService();
