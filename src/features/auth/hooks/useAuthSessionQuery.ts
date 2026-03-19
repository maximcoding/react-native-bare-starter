import { useQuery } from '@tanstack/react-query'
import { z } from 'zod'
import { authKeys } from '@/features/auth/api/keys'
import { Freshness } from '@/shared/services/api/query/policy/freshness'
import { OPS } from '@/shared/services/api/transport/operations'
import { transport } from '@/shared/services/api/transport/transport'
import { normalizeError } from '@/shared/utils/normalize-error'

const SessionSchema = z.object({
  userId: z.string().or(z.number()),
  email: z.string().email().optional(),
})

export type AuthSessionDTO = z.infer<typeof SessionSchema>

export function useAuthSessionQuery() {
  return useQuery({
    queryKey: authKeys.session(),
    staleTime: Freshness.nearRealtime.staleTime,
    gcTime: Freshness.nearRealtime.gcTime,
    queryFn: async () => {
      try {
        const data = await transport.query(OPS.AUTH_SESSION)
        return SessionSchema.parse(data)
      } catch (e) {
        throw normalizeError(e)
      }
    },
  })
}
