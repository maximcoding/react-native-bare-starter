// src/app/hooks/useTimeout.ts
import { useEffect, useRef } from 'react'

/**
 * Declarative setTimeout with cleanup. Runs callback once after delayMs.
 * Pass delayMs null to clear. Cleanup on unmount or when delayMs/callback change.
 */
export function useTimeout(callback: () => void, delayMs: number | null) {
  const savedCallback = useRef(callback)
  useEffect(() => {
    savedCallback.current = callback
  }, [callback])

  useEffect(() => {
    if (delayMs === null) return undefined
    const id = setTimeout(() => savedCallback.current(), delayMs)
    return () => clearTimeout(id)
  }, [delayMs])
}
