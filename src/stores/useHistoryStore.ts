import { create } from 'zustand';
import { Channel } from '../types/channel.types';
import { Storage } from '../services/storage/mmkvStorage';
import { Config } from '../constants/config';

interface HistoryItem {
  channel: Channel;
  watchedAt: number;
  resumePosition?: number;
}

interface HistoryStore {
  history: HistoryItem[];
  load: () => void;
  addToHistory: (channel: Channel, position?: number) => void;
  getResumePosition: (channelId: string) => number;
  clearHistory: () => void;
}

export const useHistoryStore = create<HistoryStore>((set, get) => ({
  history: [],

  load: () => {
    const saved = Storage.getObject<HistoryItem[]>('wp_watch_history') ?? [];
    set({ history: saved });
  },

  addToHistory: (channel, position = 0) => {
    const { history } = get();
    const filtered = history.filter((h) => h.channel.id !== channel.id);
    const updated: HistoryItem[] = [
      { channel, watchedAt: Date.now(), resumePosition: position },
      ...filtered,
    ].slice(0, Config.maxHistoryItems);
    Storage.setObject('wp_watch_history', updated);
    set({ history: updated });
  },

  getResumePosition: (channelId) => {
    const item = get().history.find((h) => h.channel.id === channelId);
    return item?.resumePosition ?? 0;
  },

  clearHistory: () => {
    Storage.delete('wp_watch_history');
    set({ history: [] });
  },
}));
