/**
 * FILE: user.types.ts
 * ---------------------------------------------------------------------
 * PURPOSE:
 *   Domain and DTO types for the user feature. Single place to find
 *   "the user type" (User) and related shapes.
 */
export type User = {
  id: string
  email: string
  name: string | null
  avatar: string | null
}

export type { UserProfileDTO } from './user.schemas'
