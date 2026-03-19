// src/app/hooks/useMountEffect.ts
import { useEffect } from 'react'

/**
 * Run effect once on mount. Cleanup runs on unmount.
 */
export function useMountEffect(effect: () => void | (() => void)) {
  // biome-ignore lint/correctness/useExhaustiveDependencies: intentional mount-only effect
  useEffect(effect, [])
}
