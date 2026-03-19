// src/app/hooks/useIsFirstRender.ts
import { useRef } from 'react'

export function useIsFirstRender(): boolean {
  const ref = useRef(true)
  if (ref.current) {
    ref.current = false
    return true
  }
  return false
}
