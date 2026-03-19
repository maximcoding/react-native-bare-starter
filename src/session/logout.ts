// src/core/session/logout.ts
/**
 * Centralized logout helper:
 * - removes tokens from storage (access + refresh)
 * - clears persisted React Query cache snapshot (MMKV)
 * - clears offline queue + in-memory snapshot cache
 * - clears QueryClient in-memory cache (if available)
 * - resets navigation to ROOT_AUTH
 */

import type { QueryClient } from '@tanstack/react-query'
import { constants } from '@/config/constants'
import { resetRoot } from '@/navigation/helpers/navigation-helpers'
import { ROUTES } from '@/navigation/routes'
import { getSessionQueryClient } from '@/session/session-bridge'
import { offlineQueue } from '@/shared/services/api/offline/offline-queue'
import { cacheEngine } from '@/shared/services/storage/cache-engine'
import { kvStorage } from '@/shared/services/storage/mmkv'

let lastLogoutAt = 0

/**
 * Call on user sign-out, token expiry, refresh failure, or 401-guard.
 * Optional QueryClient passed to clear in-memory cache too.
 * If qc not provided, it will use session-bridge QueryClient (if set).
 */
export async function performLogout(qc?: QueryClient) {
  // prevent double logout within 0.5s (refresh interceptor + UI)
  const now = Date.now()
  if (now - lastLogoutAt < 500) {
    resetRoot({ index: 0, routes: [{ name: ROUTES.ROOT_AUTH as never }] })
    return
  }
  lastLogoutAt = now

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
      // cancel inflight first (best-effort)
      await client.cancelQueries().catch(() => undefined)
      // clear query + mutation caches
      client.clear()
    }
  } catch {
    // ignore: we still must reset navigation
  } finally {
    // 5) Reset navigation to Auth root (always)
    resetRoot({
      index: 0,
      routes: [{ name: ROUTES.ROOT_AUTH as never }],
    })
  }
}
