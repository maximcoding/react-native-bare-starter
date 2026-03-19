/**
 * Shared app-level constants (non-environment, non-config).
 * Storage keys live in src/config/constants.ts — not here.
 */

/** Tags to invalidate when session/profile state changes (login, profile update). */
export const SESSION_RELATED_QUERY_TAGS = [
  'auth:me',
  'auth:session',
  'user:me',
  'user:list',
] as const

export type SessionRelatedTag = (typeof SESSION_RELATED_QUERY_TAGS)[number]
