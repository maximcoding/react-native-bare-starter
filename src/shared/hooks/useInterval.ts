// src/app/hooks/useInterval.ts
import { useEffect, useRef } from 'react'

interface UseIntervalOptions {
  enabled?: boolean
}

export function useInterval(
  callback: () => void,
  delayMs: number | null,
  options?: UseIntervalOptions,
) {
  const savedCallback = useRef(callback)
  const { enabled = true } = options ?? {}

  useEffect(() => {
    savedCallback.current = callback
  }, [callback])

  useEffect(() => {
    if (delayMs === null || !enabled) return

    const id = setInterval(() => {
      savedCallback.current()
    }, delayMs)

    return () => clearInterval(id)
  }, [delayMs, enabled])
}
