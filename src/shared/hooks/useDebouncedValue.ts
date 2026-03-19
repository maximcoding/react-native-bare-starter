// src/app/hooks/useDebouncedValue.ts
import { useEffect, useState } from 'react'

export function useDebouncedValue<T>(value: T, delayMs: number): T {
  const [debouncedValue, setDebouncedValue] = useState<T>(value)

  useEffect(() => {
    const timer = setTimeout(() => {
      setDebouncedValue(value)
    }, delayMs)
    return () => clearTimeout(timer)
  }, [value, delayMs])

  return debouncedValue
}
