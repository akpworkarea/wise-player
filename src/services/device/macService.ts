import * as SecureStore from 'expo-secure-store';
import * as Application from 'expo-application';
import * as Crypto from 'expo-crypto';
import { Platform } from 'react-native';
import { Storage } from '../storage/mmkvStorage';
import { Config } from '../../constants/config';
import { DeviceInfo } from '../../types/device.types';

const SECURE_KEY = 'wise_player_device_id';

// Format a string as MAC address style: AA:BB:CC:DD:EE:FF
const formatAsMac = (id: string): string => {
  const clean = id.replace(/[^a-fA-F0-9]/g, '').toUpperCase().padEnd(12, '0').slice(0, 12);
  return clean.match(/.{2}/g)?.join(':') ?? 'AA:BB:CC:DD:EE:FF';
};

// Generate a new unique device ID
const generateDeviceId = async (): Promise<string> => {
  // Try Android ID first (hardware-level, survives reinstall)
  if (Platform.OS === 'android') {
    const androidId = Application.getAndroidId();
    if (androidId) {
      const hashed = await Crypto.digestStringAsync(
        Crypto.CryptoDigestAlgorithm.SHA256,
        `wiseplayer_${androidId}`
      );
      return hashed.slice(0, 12);
    }
  }

  // iOS or fallback: generate crypto UUID
  const uuid = await Crypto.randomUUID();
  const hashed = await Crypto.digestStringAsync(
    Crypto.CryptoDigestAlgorithm.SHA256,
    `wiseplayer_${uuid}`
  );
  return hashed.slice(0, 12);
};

// Get or create device ID — persists across reinstalls via SecureStore/Keychain
export const getDeviceId = async (): Promise<string> => {
  try {
    // 1. Check MMKV cache first (fastest)
    const cached = Storage.getString(Config.storageKeys.deviceId);
    if (cached) return cached;

    // 2. Check SecureStore / iOS Keychain (survives reinstall)
    const stored = await SecureStore.getItemAsync(SECURE_KEY);
    if (stored) {
      Storage.set(Config.storageKeys.deviceId, stored);
      return stored;
    }

    // 3. Truly first install — generate new ID
    const newId = await generateDeviceId();

    // Save to both SecureStore (permanent) and MMKV (cache)
    await SecureStore.setItemAsync(SECURE_KEY, newId);
    Storage.set(Config.storageKeys.deviceId, newId);

    return newId;
  } catch (error) {
    // Ultimate fallback
    const fallback = 'wp' + Date.now().toString(16).slice(-10);
    Storage.set(Config.storageKeys.deviceId, fallback);
    return fallback;
  }
};

// Get MAC display format (shown on screen)
export const getMacDisplay = async (): Promise<string> => {
  const id = await getDeviceId();
  return formatAsMac(id);
};

// Get full device info
export const getDeviceInfo = async (): Promise<DeviceInfo> => {
  const deviceId = await getDeviceId();
  const macDisplay = formatAsMac(deviceId);
  const isActivated = Storage.getBoolean(Config.storageKeys.isActivated) ?? false;

  let platform: DeviceInfo['platform'] = 'android';
  if (Platform.OS === 'ios' && Platform.isTV) platform = 'apple_tv';
  else if (Platform.OS === 'ios') platform = 'ios';
  else if (Platform.OS === 'android' && Platform.isTV) platform = 'android_tv';
  else platform = 'android';

  return {
    deviceId,
    macDisplay,
    platform,
    isActivated,
    activatedAt: Storage.getNumber('wp_activated_at'),
    trialStartedAt: Storage.getNumber('wp_trial_started_at'),
  };
};

// Activate device (sets activated flag)
export const activateDevice = async (): Promise<void> => {
  Storage.set(Config.storageKeys.isActivated, true);
  Storage.set('wp_activated_at', Date.now());
  // If no trial start, set it now
  if (!Storage.getNumber('wp_trial_started_at')) {
    Storage.set('wp_trial_started_at', Date.now());
  }
};

// Check if device is activated
export const isDeviceActivated = (): boolean => {
  return Storage.getBoolean(Config.storageKeys.isActivated) ?? false;
};
