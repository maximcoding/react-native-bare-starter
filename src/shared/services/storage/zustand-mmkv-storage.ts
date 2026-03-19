// src/infra/storage/zustand-mmkv-storage.ts
/**
 * Adapter that backs Zustand persist middleware with MMKV (via kvStorage).
 * One storage key per store; use createZustandMmkvStorage(constants.APP_PREFERENCES_STORE).
 */

import { kvStorage } from '@/shared/services/storage/mmkv'

export interface ZustandStorageAdapter {
  getItem: (name: string) => string | null | Promise<string | null>
  setItem: (name: string, value: string) => void | Promise<void>
  removeItem: (name: string) => void | Promise<void>
}

/**
 * Creates a Zustand persist storage adapter that reads/writes a single MMKV key.
 * Zustand persist will pass a store name to getItem/setItem/removeItem; we use
 * storageKey for the actual MMKV key so one adapter instance = one persisted store.
 */
export function createZustandMmkvStorage(
  storageKey: string,
): ZustandStorageAdapter {
  return {
    getItem(): string | null {
      return kvStorage.getString(storageKey)
    },
    setItem(_name: string, value: string): void {
      kvStorage.setString(storageKey, value)
    },
    removeItem(): void {
      kvStorage.delete(storageKey)
    },
  }
}
