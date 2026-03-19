// src/app/hooks/useOnlineStatus.ts
import { useEffect, useState } from 'react'
import {
  isOffline as getIsOffline,
  onNetworkChange,
} from '@/shared/services/api/network/netinfo'

export function useOnlineStatus() {
  const [isOffline, setOffline] = useState<boolean>(getIsOffline())

  useEffect(() => {
    return onNetworkChange(setOffline)
  }, [])

  return { isOffline, isOnline: !isOffline }
}
