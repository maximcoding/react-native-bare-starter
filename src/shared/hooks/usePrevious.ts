// src/app/hooks/usePrevious.ts
import { useRef } from 'react'

export function usePrevious<T>(value: T): T | undefined {
  const ref = useRef<{ value: T; prev: T | undefined }>({
    value,
    prev: undefined,
  })
  const prev = ref.current.prev
  ref.current.prev = ref.current.value
  ref.current.value = value
  return prev
}
