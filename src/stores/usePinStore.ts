import { create } from 'zustand';
import { Storage } from '../services/storage/mmkvStorage';
import { Config } from '../constants/config';

interface PinStore {
  isPinEnabled: boolean;
  isAdultUnlocked: boolean;
  load: () => void;
  setupPin: (pin: string) => void;
  verifyPin: (pin: string) => boolean;
  unlockAdult: () => void;
  lockAdult: () => void;
  removePin: () => void;
  isPinSet: () => boolean;
}

// Simple hash for PIN storage (not cryptographic — use SecureStore in production upgrade)
const hashPin = (pin: string): string => {
  let hash = 0;
  const salted = `wp_${pin}_salt_2024`;
  for (let i = 0; i < salted.length; i++) {
    hash = ((hash << 5) - hash + salted.charCodeAt(i)) & 0xffffffff;
  }
  return Math.abs(hash).toString(36);
};

export const usePinStore = create<PinStore>((set, get) => ({
  isPinEnabled: false,
  isAdultUnlocked: false,

  load: () => {
    const enabled = Storage.getBoolean(Config.storageKeys.pinEnabled) ?? false;
    set({ isPinEnabled: enabled });
  },

  setupPin: (pin) => {
    Storage.set(Config.storageKeys.pin, hashPin(pin));
    Storage.set(Config.storageKeys.pinEnabled, true);
    set({ isPinEnabled: true });
  },

  verifyPin: (pin) => {
    const stored = Storage.getString(Config.storageKeys.pin);
    return stored === hashPin(pin);
  },

  unlockAdult: () => set({ isAdultUnlocked: true }),
  lockAdult: () => set({ isAdultUnlocked: false }),

  removePin: () => {
    Storage.delete(Config.storageKeys.pin);
    Storage.set(Config.storageKeys.pinEnabled, false);
    set({ isPinEnabled: false, isAdultUnlocked: false });
  },

  isPinSet: () => {
    return !!Storage.getString(Config.storageKeys.pin);
  },
}));
