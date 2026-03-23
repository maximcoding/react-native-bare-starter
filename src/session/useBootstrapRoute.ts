import { useState } from 'react'
import { type BootstrapRoute, getBootstrapRoute } from '@/session/bootstrap'

/** Sync read on first paint — avoids an empty root navigator frame before hydration. */
export function useBootstrapRoute(): BootstrapRoute {
  const [route] = useState<BootstrapRoute>(() => getBootstrapRoute())
  return route
}
