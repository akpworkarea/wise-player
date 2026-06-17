import { create } from 'zustand';
import { PlayerState, PlayerStatus } from '../types/player.types';
import { Channel } from '../types/channel.types';
import { Storage } from '../services/storage/mmkvStorage';
import { Config } from '../constants/config';

interface PlayerStore extends PlayerState {
  setChannel: (channel: Channel) => void;
  setStatus: (status: PlayerStatus) => void;
  setPosition: (position: number) => void;
  setVolume: (volume: number) => void;
  toggleMute: () => void;
  toggleFullscreen: () => void;
  setError: (msg: string) => void;
  saveResumePosition: () => void;
  clearPlayer: () => void;
}

export const usePlayerStore = create<PlayerStore>((set, get) => ({
  currentChannel: null,
  status: 'idle',
  position: 0,
  duration: 0,
  volume: 1,
  isMuted: false,
  isFullscreen: true,
  errorMessage: undefined,

  setChannel: (channel) => {
    // Load resume position
    const history = Storage.getObject<Record<string, number>>(Config.storageKeys.history) ?? {};
    const savedPosition = history[channel.id] ?? 0;
    set({
      currentChannel: channel,
      status: 'loading',
      position: savedPosition,
      errorMessage: undefined,
    });
  },

  setStatus: (status) => set({ status }),
  setPosition: (position) => set({ position }),
  setVolume: (volume) => set({ volume }),
  toggleMute: () => set((s) => ({ isMuted: !s.isMuted })),
  toggleFullscreen: () => set((s) => ({ isFullscreen: !s.isFullscreen })),
  setError: (msg) => set({ status: 'error', errorMessage: msg }),

  saveResumePosition: () => {
    const { currentChannel, position } = get();
    if (!currentChannel || position < Config.resumeThreshold) return;
    const history = Storage.getObject<Record<string, number>>(Config.storageKeys.history) ?? {};
    history[currentChannel.id] = position;
    Storage.setObject(Config.storageKeys.history, history);
  },

  clearPlayer: () => set({
    currentChannel: null,
    status: 'idle',
    position: 0,
    duration: 0,
    errorMessage: undefined,
  }),
}));
