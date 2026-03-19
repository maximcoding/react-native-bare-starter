// src/stores/app.store.ts
/**
 * Global UI preferences store (Zustand + MMKV persist).
 * Use for client-only state that should survive app restart (e.g. last tab, onboarding flag).
 * No server data; see TanStack Query for server state.
 */

import { create } from 'zustand'
import { createJSONStorage, persist } from 'zustand/middleware'
import { constants } from '@/config/constants'
import { createZustandMmkvStorage } from '@/shared/services/storage/zustand-mmkv-storage'

export interface AppState {
  lastSelectedTabIndex: number
  onboardingCompleted: boolean
  setLastSelectedTabIndex: (index: number) => void
  setOnboardingCompleted: (completed: boolean) => void
}

const mmkvAdapter = createZustandMmkvStorage(constants.APP_PREFERENCES_STORE)
const storage = createJSONStorage(() => mmkvAdapter)

export const usePreferencesStore = create<AppState>()(
  persist(
    set => ({
      lastSelectedTabIndex: 0,
      onboardingCompleted: false,
      setLastSelectedTabIndex: index => set({ lastSelectedTabIndex: index }),
      setOnboardingCompleted: completed =>
        set({ onboardingCompleted: completed }),
    }),
    {
      name: 'app-preferences',
      storage: storage!,
    },
  ),
)
