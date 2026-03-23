/**
 * FILE: user.mappers.ts
 * LAYER: app/services/user
 * ---------------------------------------------------------------------
 * PURPOSE:
 *   Transform validated DTOs into domain-friendly User model.
 *
 * RESPONSIBILITIES:
 *   - UserProfileDTO → User
 *
 * DATA-FLOW:
 *   validated DTO (user.schemas)
 *      → UserMapper.toUser()
 *         → domain model for UI/services/stores
 *
 * EXTENSION GUIDELINES:
 *   - Add mapping for roles, preferences, settings, etc.
 * ---------------------------------------------------------------------
 */

import type { User } from '@/features/user/types'
import type { UserProfileDTO } from './user.schemas'

export const UserMapper = {
  toUser(dto: UserProfileDTO): User {
    return {
      id: dto.id,
      email: dto.email,
      name: dto.name,
      avatar: dto.avatar,
    }
  },
}
