/**
 * User feature — domain interfaces and type aliases.
 * Import from `@/features/user/types`; keep Zod schemas in `services/user/*.schemas.ts`.
 */
export type User = {
  id: string
  email: string
  name: string | null
  avatar: string | null
}

export type { UserProfileDTO } from '@/features/user/services/user/user.schemas'
