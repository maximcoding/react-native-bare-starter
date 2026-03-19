// src/app/hooks/useRefreshControl.ts
import { useCallback, useState } from 'react'

export function useRefreshControl(onRefresh: () => void | Promise<void>) {
  const [refreshing, setRefreshing] = useState(false)

  const handleRefresh = useCallback(async () => {
    setRefreshing(true)
    try {
      await Promise.resolve(onRefresh())
    } finally {
      setRefreshing(false)
    }
  }, [onRefresh])

  return { refreshing, onRefresh: handleRefresh }
}
