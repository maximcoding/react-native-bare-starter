// src/app/hooks/useArray.ts
import { useCallback, useState } from 'react'

export function useArray<T>(initial: T[] = []) {
  const [array, setArray] = useState<T[]>(initial)

  const push = useCallback((...items: T[]) => {
    setArray(a => [...a, ...items])
  }, [])

  const removeAt = useCallback((index: number) => {
    setArray(a => a.filter((_, i) => i !== index))
  }, [])

  const updateAt = useCallback((index: number, item: T) => {
    setArray(a => a.map((x, i) => (i === index ? item : x)))
  }, [])

  const clear = useCallback(() => setArray([]), [])

  const set = useCallback((items: T[] | ((prev: T[]) => T[])) => {
    setArray(items)
  }, [])

  return {
    array,
    set,
    push,
    removeAt,
    updateAt,
    clear,
  }
}
