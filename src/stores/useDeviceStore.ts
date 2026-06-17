import { create } from 'zustand';
import { DeviceInfo } from '../types/device.types';
import { getDeviceInfo, activateDevice } from '../services/device/macService';

interface DeviceStore {
  deviceInfo: DeviceInfo | null;
  isLoading: boolean;
  loadDeviceInfo: () => Promise<void>;
  activate: () => Promise<void>;
}

export const useDeviceStore = create<DeviceStore>((set, get) => ({
  deviceInfo: null,
  isLoading: false,

  loadDeviceInfo: async () => {
    set({ isLoading: true });
    const info = await getDeviceInfo();
    set({ deviceInfo: info, isLoading: false });
  },

  activate: async () => {
    await activateDevice();
    const info = await getDeviceInfo();
    set({ deviceInfo: info });
  },
}));
