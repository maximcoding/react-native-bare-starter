/**
 * FILE: auth.types.ts
 * ---------------------------------------------------------------------
 * PURPOSE:
 *   Domain and DTO types for the auth feature. Single place to find
 *   "the auth session type" (AuthSession) and related shapes.
 */
export type AuthSession = {
  token: string
  refreshToken?: string
  userId: string
  email: string
}

export type { LoginRequest, LoginResponse } from './auth.schemas'
