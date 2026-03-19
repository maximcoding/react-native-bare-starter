// src/app/hooks/useToggle.ts
import { useCallback, useState } from 'react'

export function useToggle(initial = false) {
  const [value, setValue] = useState(initial)

  const toggle = useCallback(() => setValue(v => !v), [])
  const setTrue = useCallback(() => setValue(true), [])
  const setFalse = useCallback(() => setValue(false), [])

  return [value, toggle, setTrue, setFalse, setValue] as const
}
