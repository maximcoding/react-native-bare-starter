import { useEffect, useState } from 'react'
import { type BootstrapRoute, getBootstrapRoute } from '@/session/bootstrap'

export function useBootstrapRoute() {
  const [route, setRoute] = useState<BootstrapRoute | null>(null)

  useEffect(() => {
    // sync read, but keep async-like shape for future expansion
    setRoute(getBootstrapRoute())
  }, [])

  return route
}
