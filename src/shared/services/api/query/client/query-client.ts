// src/infra/query/client/query-client.ts
import { MutationCache, QueryCache, QueryClient } from '@tanstack/react-query'
import { Freshness } from '@/shared/services/api/query/policy/freshness'
import { normalizeError } from '@/shared/utils/normalize-error'
import { showErrorToast } from '@/shared/utils/toast'

export function createQueryClient() {
  const queryCache = new QueryCache({
    onError: error => {
      const e = normalizeError(error)

      // avoid spamming toasts when offline
      if (e.code === 'NETWORK_OFFLINE') return

      if (__DEV__) console.log('[RQ][QUERY][ERROR]', e)
      showErrorToast(e)
    },
  })

  const mutationCache = new MutationCache({
    onError: error => {
      const e = normalizeError(error)

      // avoid spamming toasts when offline
      if (e.code === 'NETWORK_OFFLINE') return

      if (__DEV__) console.log('[RQ][MUTATION][ERROR]', e)
      showErrorToast(e)
    },
  })

  return new QueryClient({
    queryCache,
    mutationCache,
    defaultOptions: {
      queries: {
        // nearRealtime profile by default
        staleTime: Freshness.nearRealtime.staleTime,
        gcTime: Freshness.nearRealtime.gcTime,

        refetchOnReconnect: true,
        throwOnError: false,

        retry: (failureCount, error: unknown) => {
          const e = normalizeError(error)

          // never retry when offline
          if (e.code === 'NETWORK_OFFLINE') return false

          // retry only on 5xx/429
          if (e.status && (e.status >= 500 || e.status === 429)) {
            return failureCount < 2
          }
          return false
        },
      },

      mutations: {
        throwOnError: false,

        retry: (failureCount, error: unknown) => {
          const e = normalizeError(error)

          // never retry when offline
          if (e.code === 'NETWORK_OFFLINE') return false

          if (e.status && (e.status >= 500 || e.status === 429)) {
            return failureCount < 2
          }
          return false
        },
      },
    },
  })
}
