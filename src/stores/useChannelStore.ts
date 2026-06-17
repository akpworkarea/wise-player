import { create } from 'zustand';
import { Channel, Category } from '../types/channel.types';
import { fetchM3U } from '../services/m3u/m3uFetcher';
import { Storage } from '../services/storage/mmkvStorage';

interface ChannelStore {
  channels: Channel[];
  categories: Category[];
  isLoading: boolean;
  error: string | null;
  searchQuery: string;
  selectedCategory: string | null;
  fetchChannels: (url: string) => Promise<void>;
  setSearchQuery: (q: string) => void;
  setSelectedCategory: (id: string | null) => void;
  getFilteredChannels: () => Channel[];
}

export const useChannelStore = create<ChannelStore>((set, get) => ({
  channels: [],
  categories: [],
  isLoading: false,
  error: null,
  searchQuery: '',
  selectedCategory: null,

  fetchChannels: async (url) => {
    set({ isLoading: true, error: null });
    const result = await fetchM3U(url);
    if (result.error) {
      set({ isLoading: false, error: result.error });
      return;
    }
    // Cache locally
    Storage.setObject('wp_channels_cache', result.channels);
    Storage.setObject('wp_categories_cache', result.categories);
    set({
      channels: result.channels,
      categories: result.categories,
      isLoading: false,
    });
  },

  setSearchQuery: (q) => set({ searchQuery: q }),
  setSelectedCategory: (id) => set({ selectedCategory: id }),

  getFilteredChannels: () => {
    const { channels, searchQuery, selectedCategory } = get();
    let filtered = channels;
    if (selectedCategory) {
      filtered = filtered.filter((c) => c.groupTitle.toLowerCase().replace(/\s+/g, '_') === selectedCategory);
    }
    if (searchQuery.trim()) {
      const q = searchQuery.toLowerCase();
      filtered = filtered.filter((c) => c.name.toLowerCase().includes(q));
    }
    return filtered;
  },
}));
