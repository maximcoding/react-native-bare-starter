/**
 * FILE: user.service.ts
 * LAYER: app/services/user
 * ---------------------------------------------------------------------
 * PURPOSE:
 *   Domain service for user-related queries / mutations.
 *
 * RESPONSIBILITIES:
 *   - Fetch user profile.
 *   - (Future) Update profile, preferences, settings, roles.
 *
 * DATA-FLOW:
 *   screen/hook
 *      → UserService.getProfile(userId)
 *         → transport.query('user/profile', { userId })
 *         → zUserProfile.parse()
 *         → UserMapper.toUser()
 *
 * OFFLINE BEHAVIOR:
 *   - Queries fail gracefully when offline.
 *   - Mutations can be queued automatically by transport.
 *
 * EXTENSION GUIDELINES:
 *   - Add caching layer (cacheEngine).
 *   - Add optimistic updates for profile changes.
 * ---------------------------------------------------------------------
 */

import type { User } from '@/features/user/types'
import { OPS } from '@/shared/services/api/transport/operations'
import { transport } from '@/shared/services/api/transport/transport'
import { UserMapper } from './user.mappers'
import { zUserProfile } from './user.schemas'

export const UserService = {
  async getProfile(userId: string): Promise<User> {
    const raw = await transport.query(OPS.USER_PROFILE, { userId })
    const validated = zUserProfile.parse(raw)
    return UserMapper.toUser(validated)
  },
}
