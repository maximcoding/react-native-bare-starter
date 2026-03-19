// src/app/hooks/useCountdown.ts
import { useCallback, useEffect, useRef, useState } from 'react'

export function useCountdown(initialSeconds: number) {
  const [secondsLeft, setSecondsLeft] = useState(initialSeconds)
  const [running, setRunning] = useState(false)
  const intervalRef = useRef<ReturnType<typeof setInterval> | null>(null)

  const stop = useCallback(() => {
    if (intervalRef.current) {
      clearInterval(intervalRef.current)
      intervalRef.current = null
    }
    setRunning(false)
  }, [])

  const start = useCallback(() => {
    stop()
    setSecondsLeft(initialSeconds)
    setRunning(true)
  }, [initialSeconds, stop])

  const pause = useCallback(() => {
    if (intervalRef.current) {
      clearInterval(intervalRef.current)
      intervalRef.current = null
    }
    setRunning(false)
  }, [])

  const resume = useCallback(() => {
    if (secondsLeft <= 0) return
    setRunning(true)
  }, [secondsLeft])

  useEffect(() => {
    if (!running || secondsLeft <= 0) {
      if (secondsLeft <= 0) stop()
      return undefined
    }
    intervalRef.current = setInterval(() => {
      setSecondsLeft(s => {
        if (s <= 1) {
          if (intervalRef.current) clearInterval(intervalRef.current)
          intervalRef.current = null
          setRunning(false)
          return 0
        }
        return s - 1
      })
    }, 1000)
    return () => {
      if (intervalRef.current) clearInterval(intervalRef.current)
      intervalRef.current = null
    }
  }, [running, secondsLeft, stop])

  return { secondsLeft, running, start, pause, resume, stop }
}
