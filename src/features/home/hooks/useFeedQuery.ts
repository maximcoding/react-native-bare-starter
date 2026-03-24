import { useQuery } from '@tanstack/react-query'
import { homeKeys } from '@/features/home/api/keys'
import { fetchHnFeed } from '@/features/home/services/hn/hn.service'
import type { FeedItem } from '@/features/home/types'
import { Freshness } from '@/shared/services/api/query/policy/freshness'

function formatSyncedAt(ts: number): string {
  if (!ts) return ''
  const diffMs = Date.now() - ts
  const m = Math.floor(diffMs / 60_000)
  if (m < 1) return 'just now'
  if (m < 60) return `${m}m ago`
  const h = Math.floor(m / 60)
  return `${h}h ago`
}

export function useFeedQuery() {
  const query = useQuery<FeedItem[]>({
    queryKey: homeKeys.feed(),
    queryFn: fetchHnFeed,
    staleTime: Freshness.nearRealtime.staleTime,
    gcTime: Freshness.nearRealtime.gcTime,
    meta: {
      persistence: 'nearRealtime',
    },
    placeholderData: prev => prev,
  })

  const syncedAt = query.dataUpdatedAt ?? 0
  const syncedAtLabel = syncedAt ? formatSyncedAt(syncedAt) : null

  return {
    feed: query.data ?? [],
    isLoading: query.isLoading,
    isRefetching: query.isRefetching,
    refetch: query.refetch,
    hasCache: !!query.data,
    syncedAtLabel,
  }
}
