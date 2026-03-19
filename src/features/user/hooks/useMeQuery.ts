// src/features/user/hooks/useMeQuery.ts
/**
 * PURPOSE:
 *   Fetch current user profile ("me") with React Query.
 * POLICY:
 *   - Zod-validate response before entering cache.
 *   - nearRealtime freshness (staleTime ~60s).
 *   - Errors: rethrow NormalizedError as-is; normalize unknown shapes.
 *   - Mark persistence policy via meta (future).
 */

import { useQuery } from '@tanstack/react-query'
import { z } from 'zod'
import { userKeys } from '@/features/user/api/keys'
import { Freshness } from '@/shared/services/api/query/policy/freshness'
import { OPS } from '@/shared/services/api/transport/operations'
import { transport } from '@/shared/services/api/transport/transport'
import {
  type NormalizedError,
  normalizeError,
} from '@/shared/utils/normalize-error'

const MeSchema = z.object({
  id: z.union([z.string(), z.number()]),
  name: z.string(),
  email: z.string().email().optional(),
  avatarUrl: z.string().url().optional(),
})

export type Me = z.infer<typeof MeSchema>

function isNormalizedError(e: unknown): e is NormalizedError {
  return typeof e === 'object' && e !== null && 'message' in e && 'raw' in e
}

export function useMeQuery() {
  return useQuery<Me>({
    queryKey: userKeys.me(),
    staleTime: Freshness.nearRealtime.staleTime,
    gcTime: Freshness.nearRealtime.gcTime,

    // future: persistence / freshness policy marker
    meta: {
      persistence: 'nearRealtime',
      tags: ['user:me'],
    },

    queryFn: async () => {
      try {
        // REST adapter maps this to GET /user.me (because it becomes `/${operation}`)
        // If you prefer /me, change operation mapping in rest.adapter OR call 'me'/'user/me'.
        const data = await transport.query(OPS.USER_ME)
        return MeSchema.parse(data)
      } catch (e) {
        // httpClient response transform already normalizes most errors
        if (isNormalizedError(e)) throw e
        throw normalizeError(e)
      }
    },
  })
}
