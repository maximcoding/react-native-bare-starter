// src/app/hooks/useAppState.ts
import { useEffect, useState } from 'react'
import { AppState, type AppStateStatus } from 'react-native'

export function useAppState() {
  const [appState, setAppState] = useState<AppStateStatus>(
    AppState.currentState,
  )

  useEffect(() => {
    const sub = AppState.addEventListener('change', setAppState)
    return () => sub.remove()
  }, [])

  return {
    appState,
    isActive: appState === 'active',
    isBackground: appState === 'background',
    isInactive: appState === 'inactive',
  }
}
