// src/infra/query/client/provider.tsx
/**
 * FILE: provider.tsx
 * LAYER: infra/query/client
 * ---------------------------------------------------------------------
 * PURPOSE:
 *   Centralize React Query bootstrapping:
 *   - PersistQueryClientProvider (MMKV persister)
 *   - NetInfo bridge
 *   - onlineManager + focusManager wiring (RQ v5)
 *   - transport offlineMode switching (online/offline)
 *   - sync-engine wiring: QueryClient + tagMaps for invalidate-by-tags
 *   - session-bridge wiring: QueryClient for logout/refresh flows
 *
 * RULES:
 *   - No feature imports here.
 *   - Features pass tagMaps from App root.
 * ---------------------------------------------------------------------
 */

import type { DehydrateOptions } from '@tanstack/react-query'
import { focusManager, onlineManager } from '@tanstack/react-query'
import { PersistQueryClientProvider } from '@tanstack/react-query-persist-client'
import React from 'react'
import { AppState } from 'react-native'
import { setSessionQueryClient } from '@/session/session-bridge'
import {
  initNetInfoBridge,
  isOffline,
  onNetworkChange,
} from '@/shared/services/api/network/netinfo'
import {
  setQueryClientForSync,
  setTagMapsForSync,
  syncEngine,
} from '@/shared/services/api/offline/sync-engine'
import { PersistencePolicy } from '@/shared/services/api/query/persistence/limits'
import { mmkvPersister } from '@/shared/services/api/query/persistence/mmkv-persister'
import type { TagMap } from '@/shared/services/api/query/tags'
import { setOfflineMode } from '@/shared/services/api/transport/transport'
import { createQueryClient } from './query-client'

type Props = React.PropsWithChildren<{
  /** Feature tag maps: [authKeys.tagMap, userKeys.tagMap, ...] */
  tagMaps: TagMap[]
}>

// ✅ One QueryClient for the whole app lifetime
const queryClient = createQueryClient()

// Guard to avoid double-init in dev (Fast Refresh)
let didInit = false

export function QueryProvider({ children, tagMaps }: Props) {
  React.useEffect(() => {
    // Always keep tag maps up-to-date (App may re-render)
    setTagMapsForSync(tagMaps)

    if (!didInit) {
      didInit = true

      // 1) NetInfo bridge (safe no-op if package is absent)
      initNetInfoBridge()

      // 2) Wire QueryClient for non-React code (logout/refresh)
      setSessionQueryClient(queryClient)

      // 3) Wire sync engine
      setQueryClientForSync(queryClient)

      // 4) Initial offline/online state
      const offline = isOffline()
      setOfflineMode(offline)
      onlineManager.setOnline(!offline)
    }

    // Net changes -> update onlineManager + transport offlineMode + replay queue when online
    const unsubNet = onNetworkChange(async offline => {
      setOfflineMode(offline)
      onlineManager.setOnline(!offline)

      // when back online -> replay queued mutations
      if (!offline) {
        await syncEngine.onConnected()
      }
    })

    // AppState -> focusManager (refetchOnWindowFocus analogue)
    const sub = AppState.addEventListener('change', state => {
      focusManager.setFocused(state === 'active')
    })

    return () => {
      unsubNet()
      sub.remove()
    }
  }, [tagMaps])

  return (
    <PersistQueryClientProvider
      client={queryClient}
      persistOptions={{
        persister: mmkvPersister,
        buster: 'rq-cache-v1',
        dehydrateOptions: {
          shouldDehydrateQuery: query => {
            const meta = query.meta
            if (PersistencePolicy.isSensitive(meta)) return false

            const profile = PersistencePolicy.getProfile(meta)

            // do not persist profiles disallowed by policy
            if (!PersistencePolicy.allowedProfiles.has(profile)) return false

            // do not persist queries with no data
            const dataUpdatedAt = query.state.dataUpdatedAt ?? 0
            if (!dataUpdatedAt) return false

            // TTL: do not write stale data
            if (!PersistencePolicy.isFreshEnough(profile, dataUpdatedAt))
              return false

            return true
          },
        } satisfies DehydrateOptions,
      }}
      onSuccess={() => {
        queryClient.resumePausedMutations().catch(() => undefined)
      }}
    >
      {children}
    </PersistQueryClientProvider>
  )
}
