/**
 * Home feature — shared interfaces and type aliases.
 */

export type ActivityType = 'task' | 'message' | 'alert' | 'success'

export type FeedItem = {
  id: string
  type: ActivityType
  title: string
  subtitle: string
  time: string
  url?: string
  points?: number
  author?: string
  numComments?: number
}
