// src/app/hooks/useBackHandler.ts
import { useEffect } from 'react'
import { BackHandler, Platform } from 'react-native'

/**
 * Intercept Android hardware back button. Return true to prevent default (e.g. exit).
 * On non-Android, the effect is a no-op.
 */
export function useBackHandler(onBack: () => boolean) {
  useEffect(() => {
    if (Platform.OS !== 'android') return undefined
    const sub = BackHandler.addEventListener('hardwareBackPress', onBack)
    return () => sub.remove()
  }, [onBack])
}
