/**
 * Auth feature — domain interfaces and type aliases.
 * Import from `@/features/auth/types`; keep Zod schemas in `services/auth/*.schemas.ts`.
 */
export type AuthSession = {
  token: string
  refreshToken?: string
  userId: string
  email: string
}

export type {
  LoginRequest,
  LoginResponse,
} from '@/features/auth/services/auth/auth.schemas'
