import AsyncStorage from '@react-native-async-storage/async-storage';

/**
 * Storage service backed by AsyncStorage.
 *
 * Why not MMKV: react-native-mmkv v4 requires the NitroModules native
 * bridge + an Expo config plugin to be wired up correctly during prebuild.
 * That setup kept failing in this project's dev client builds
 * (Cannot read property 'prototype' of undefined), costing rebuild cycles.
 * AsyncStorage needs zero native config and works identically in Expo Go
 * and custom dev clients, so we use it instead.
 *
 * Why a sync in-memory cache: the rest of the app (stores, services) was
 * written against a synchronous Storage.get/set API (matching MMKV's sync
 * API). AsyncStorage itself is fully Promise-based. Rather than rewriting
 * every store to be async, we hydrate an in-memory cache once on app boot
 * (see `hydrateStorage()` below, called from app/index.tsx) and keep it in
 * sync on every write. Reads after hydration are synchronous and instant;
 * writes update memory immediately and persist to disk in the background.
 */

const cache = new Map<string, string>();
let isHydrated = false;
let hydrationPromise: Promise<void> | null = null;

// Call once on app boot, before any store reads happen.
export const hydrateStorage = async (): Promise<void> => {
  if (isHydrated) return;
  if (hydrationPromise) return hydrationPromise;

  hydrationPromise = (async () => {
    try {
      const keys = await AsyncStorage.getAllKeys();
      const pairs = await AsyncStorage.multiGet(keys);
      pairs.forEach(([key, value]) => {
        if (value !== null) cache.set(key, value);
      });
    } catch (error) {
      console.warn('[Storage] Hydration failed, starting with empty cache', error);
    } finally {
      isHydrated = true;
    }
  })();

  return hydrationPromise;
};

export const isStorageHydrated = (): boolean => isHydrated;

export const Storage = {
  set: (key: string, value: string | number | boolean): void => {
    const str = String(value);
    cache.set(key, str);
    AsyncStorage.setItem(key, str).catch((err) =>
      console.warn(`[Storage] Failed to persist key "${key}"`, err)
    );
  },

  getString: (key: string): string | undefined => {
    return cache.get(key);
  },

  getBoolean: (key: string): boolean | undefined => {
    const raw = cache.get(key);
    if (raw === undefined) return undefined;
    return raw === 'true';
  },

  getNumber: (key: string): number | undefined => {
    const raw = cache.get(key);
    if (raw === undefined) return undefined;
    const num = Number(raw);
    return Number.isNaN(num) ? undefined : num;
  },

  setObject: <T>(key: string, value: T): void => {
    const str = JSON.stringify(value);
    cache.set(key, str);
    AsyncStorage.setItem(key, str).catch((err) =>
      console.warn(`[Storage] Failed to persist key "${key}"`, err)
    );
  },

  getObject: <T>(key: string): T | null => {
    const raw = cache.get(key);
    if (!raw) return null;
    try {
      return JSON.parse(raw) as T;
    } catch {
      return null;
    }
  },

  delete: (key: string): void => {
    cache.delete(key);
    AsyncStorage.removeItem(key).catch((err) =>
      console.warn(`[Storage] Failed to delete key "${key}"`, err)
    );
  },

  clearAll: (): void => {
    cache.clear();
    AsyncStorage.clear().catch((err) =>
      console.warn('[Storage] Failed to clear storage', err)
    );
  },
};