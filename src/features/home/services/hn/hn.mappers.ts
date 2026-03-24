import type { FeedItem } from '@/features/home/types'
import type { HnHit } from './hn.schemas'

const TYPES: FeedItem['type'][] = ['success', 'task', 'message', 'alert']

function mapType(objectID: string): FeedItem['type'] {
  return TYPES[parseInt(objectID, 10) % TYPES.length] ?? 'task'
}

function parseDomain(url: string | null | undefined): string | null {
  if (!url) return null
  try {
    const match = url.match(/^https?:\/\/(?:www\.)?([^/]+)/)
    return match?.[1] ?? null
  } catch {
    return null
  }
}

function relativeTime(epochSeconds: number): string {
  const diffMs = Date.now() - epochSeconds * 1000
  const m = Math.floor(diffMs / 60_000)
  if (m < 1) return 'just now'
  if (m < 60) return `${m}m ago`
  const h = Math.floor(m / 60)
  if (h < 24) return `${h}h ago`
  return `${Math.floor(h / 24)}d ago`
}

export function mapHnHitToFeedItem(hit: HnHit): FeedItem {
  const domain = parseDomain(hit.url)
  const numComments = hit.num_comments ?? 0
  const subtitle = domain ?? `by ${hit.author ?? 'unknown'}`

  return {
    id: hit.objectID,
    type: mapType(hit.objectID),
    title: hit.title ?? 'Untitled',
    subtitle,
    time: relativeTime(hit.created_at_i),
    url: hit.url ?? undefined,
    points: hit.points ?? undefined,
    author: hit.author ?? undefined,
    numComments,
  }
}
