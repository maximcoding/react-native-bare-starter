// src/app/hooks/useAsync.ts
import { useCallback, useState } from 'react'

interface UseAsyncState<T> {
  data: T | null
  error: Error | null
  loading: boolean
}

export function useAsync<T, A extends unknown[]>(
  asyncFn: (...args: A) => Promise<T>,
) {
  const [state, setState] = useState<UseAsyncState<T>>({
    data: null,
    error: null,
    loading: false,
  })

  const run = useCallback(
    async (...args: A) => {
      setState(s => ({ ...s, loading: true, error: null }))
      try {
        const data = await asyncFn(...args)
        setState({ data, error: null, loading: false })
        return data
      } catch (error) {
        const e = error instanceof Error ? error : new Error(String(error))
        setState(s => ({ ...s, error: e, loading: false }))
        throw error
      }
    },
    [asyncFn],
  )

  const reset = useCallback(() => {
    setState({ data: null, error: null, loading: false })
  }, [])

  return { ...state, run, reset }
}
