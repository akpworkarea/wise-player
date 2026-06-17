import { create } from 'zustand';
import { Channel } from '../types/channel.types';
import { Storage } from '../services/storage/mmkvStorage';
import { Config } from '../constants/config';

interface FavoritesStore {
  favorites: Channel[];
  load: () => void;
  toggle: (channel: Channel) => void;
  isFavorite: (channelId: string) => boolean;
}

export const useFavoritesStore = create<FavoritesStore>((set, get) => ({
  favorites: [],

  load: () => {
    const saved = Storage.getObject<Channel[]>(Config.storageKeys.favorites) ?? [];
    set({ favorites: saved });
  },

  toggle: (channel) => {
    const { favorites } = get();
    const exists = favorites.some((f) => f.id === channel.id);
    const updated = exists
      ? favorites.filter((f) => f.id !== channel.id)
      : [...favorites, { ...channel, isFavorite: true }];
    Storage.setObject(Config.storageKeys.favorites, updated);
    set({ favorites: updated });
  },

  isFavorite: (channelId) => {
    return get().favorites.some((f) => f.id === channelId);
  },
}));
