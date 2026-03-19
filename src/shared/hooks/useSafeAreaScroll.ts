// src/app/hooks/useSafeAreaScroll.ts
import { useMemo } from 'react'
import { useSafeAreaInsets } from 'react-native-safe-area-context'

export function useSafeAreaScroll() {
  const insets = useSafeAreaInsets()

  const scrollContentStyle = useMemo(
    () => ({
      paddingTop: insets.top,
      paddingBottom: insets.bottom,
    }),
    [insets.top, insets.bottom],
  )

  return { insets, scrollContentStyle }
}
