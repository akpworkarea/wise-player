import { create } from 'zustand';
import { Playlist } from '../types/playlist.types';
import { Storage } from '../services/storage/mmkvStorage';
import { Config } from '../constants/config';

interface PlaylistStore {
  playlists: Playlist[];
  activePlaylistId: string | null;
  isLoading: boolean;
  error: string | null;
  loadPlaylists: () => void;
  addPlaylist: (playlist: Omit<Playlist, 'id' | 'addedAt' | 'isActive'>) => void;
  removePlaylist: (id: string) => void;
  setActivePlaylist: (id: string) => void;
  updatePlaylist: (id: string, updates: Partial<Playlist>) => void;
  getActivePlaylist: () => Playlist | null;
}

export const usePlaylistStore = create<PlaylistStore>((set, get) => ({
  playlists: [],
  activePlaylistId: null,
  isLoading: false,
  error: null,

  loadPlaylists: () => {
    const playlists = Storage.getObject<Playlist[]>(Config.storageKeys.playlists) ?? [];
    const activeId = Storage.getString(Config.storageKeys.activePlaylistId) ?? null;
    set({ playlists, activePlaylistId: activeId });
  },

  addPlaylist: (data) => {
    const newPlaylist: Playlist = {
      ...data,
      id: Date.now().toString(),
      addedAt: Date.now(),
      isActive: false,
    };
    const updated = [...get().playlists, newPlaylist];
    Storage.setObject(Config.storageKeys.playlists, updated);
    set({ playlists: updated });

    // Auto-set as active if first playlist
    if (updated.length === 1) {
      get().setActivePlaylist(newPlaylist.id);
    }
  },

  removePlaylist: (id) => {
    const updated = get().playlists.filter((p) => p.id !== id);
    Storage.setObject(Config.storageKeys.playlists, updated);
    const activeId = get().activePlaylistId === id ? (updated[0]?.id ?? null) : get().activePlaylistId;
    Storage.set(Config.storageKeys.activePlaylistId, activeId ?? '');
    set({ playlists: updated, activePlaylistId: activeId });
  },

  setActivePlaylist: (id) => {
    const updated = get().playlists.map((p) => ({ ...p, isActive: p.id === id }));
    Storage.setObject(Config.storageKeys.playlists, updated);
    Storage.set(Config.storageKeys.activePlaylistId, id);
    set({ playlists: updated, activePlaylistId: id });
  },

  updatePlaylist: (id, updates) => {
    const updated = get().playlists.map((p) => (p.id === id ? { ...p, ...updates } : p));
    Storage.setObject(Config.storageKeys.playlists, updated);
    set({ playlists: updated });
  },

  getActivePlaylist: () => {
    const { playlists, activePlaylistId } = get();
    return playlists.find((p) => p.id === activePlaylistId) ?? null;
  },
}));
