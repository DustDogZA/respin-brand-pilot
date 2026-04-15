import { createContext, useContext, useState, useEffect, useCallback, type ReactNode } from 'react';

export interface ActivityLogEntry {
  id: string;
  brand: string;
  toolName: string;
  type: 'acq' | 'ret' | 'crm' | 'intel' | 'content' | 'lore';
  outputPreview: string;
  timestamp: string;
  fullOutput: string;
}

interface ActivityLogContextType {
  entries: ActivityLogEntry[];
  addEntry: (entry: Omit<ActivityLogEntry, 'id' | 'timestamp' | 'outputPreview'>) => void;
}

const STORAGE_KEY = 'respin_activity_log';
const MAX_ENTRIES = 50;

const ActivityLogContext = createContext<ActivityLogContextType | null>(null);

function loadEntries(): ActivityLogEntry[] {
  if (typeof window === 'undefined') return [];
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    return raw ? JSON.parse(raw) : [];
  } catch {
    return [];
  }
}

function saveEntries(entries: ActivityLogEntry[]) {
  if (typeof window === 'undefined') return;
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(entries));
  } catch {}
}

export function ActivityLogProvider({ children }: { children: ReactNode }) {
  const [entries, setEntries] = useState<ActivityLogEntry[]>([]);

  useEffect(() => {
    setEntries(loadEntries());
  }, []);

  const addEntry = useCallback((entry: Omit<ActivityLogEntry, 'id' | 'timestamp' | 'outputPreview'>) => {
    const newEntry: ActivityLogEntry = {
      ...entry,
      id: crypto.randomUUID(),
      timestamp: new Date().toISOString(),
      outputPreview: entry.fullOutput.slice(0, 100),
    };
    setEntries((prev) => {
      const updated = [newEntry, ...prev].slice(0, MAX_ENTRIES);
      saveEntries(updated);
      return updated;
    });
  }, []);

  return (
    <ActivityLogContext.Provider value={{ entries, addEntry }}>
      {children}
    </ActivityLogContext.Provider>
  );
}

export function useActivityLog() {
  const ctx = useContext(ActivityLogContext);
  if (!ctx) throw new Error('useActivityLog must be used within ActivityLogProvider');
  return ctx;
}

export function relativeTime(iso: string): string {
  const diff = Date.now() - new Date(iso).getTime();
  const mins = Math.floor(diff / 60000);
  if (mins < 1) return 'just now';
  if (mins < 60) return `${mins}m ago`;
  const hrs = Math.floor(mins / 60);
  if (hrs < 24) return `${hrs}h ago`;
  const days = Math.floor(hrs / 24);
  return `${days}d ago`;
}
