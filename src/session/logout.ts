// src/session/logout.ts
/**
 * Centralized logout helper:
 * - removes tokens from storage (access + refresh)
 * - clears persisted React Query cache snapshot (MMKV)
 * - clears offline queue + in-memory snapshot cache
 * - clears QueryClient in-memory cache (if available)
 * - clears persisted navigation state
 * - resets navigation to ROOT_AUTH
 *
 * Concurrent calls share one in-flight operation so rapid 401s + UI never skip cleanup.
 */

import type { QueryClient } from '@tanstack/react-query'
import { constants } from '@/config/constants'
import { resetRoot } from '@/navigation/helpers/navigation-helpers'
import { clearNavigationPersistence } from '@/navigation/persistence/navigation-persistence'
import { ROUTES } from '@/navigation/routes'
import { getSessionQueryClient } from '@/session/session-bridge'
import { offlineQueue } from '@/shared/services/api/offline/offline-queue'
import { cacheEngine } from '@/shared/services/storage/cache-engine'
import { kvStorage } from '@/shared/services/storage/mmkv'

let inflightLogout: Promise<void> | null = null

/**
 * Call on user sign-out, token expiry, refresh failure, or 401-guard.
 * Optional QueryClient passed to clear in-memory cache too.
 * If qc not provided, it will use session-bridge QueryClient (if set).
 */
export function performLogout(qc?: QueryClient): Promise<void> {
  if (inflightLogout) {
    return inflightLogout
  }
  inflightLogout = runLogout(qc).finally(() => {
    inflightLogout = null
  })
  return inflightLogout
}

async function runLogout(qc?: QueryClient): Promise<void> {
  const client = qc ?? getSessionQueryClient() ?? undefined

  try {
    // 1) Remove sensitive credentials
    kvStorage.delete(constants.AUTH_TOKEN)
    kvStorage.delete(constants.REFRESH_TOKEN)

    // 2) Drop persisted RQ cache snapshot
    kvStorage.delete(constants.RQ_CACHE)

    // 3) Clear offline queue + in-memory snapshot cache
    offlineQueue.clear()
    cacheEngine.clear()

    // 4) Clear React Query in-memory cache (if available)
    if (client) {
      await client.cancelQueries().catch(() => undefined)
      client.clear()
    }
  } catch {
    // ignore: we still must reset navigation
  } finally {
    clearNavigationPersistence()
    resetRoot({
      index: 0,
      routes: [{ name: ROUTES.ROOT_AUTH as never }],
    })
  }
}
