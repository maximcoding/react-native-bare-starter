// AUTO-GENERATED FILE — DO NOT EDIT MANUALLY
// Run: npm run gen:icons

import Home from '@assets/svgs/home.svg'
import Settings from '@assets/svgs/settings.svg'
import User from '@assets/svgs/user.svg'

export enum IconName {
  HOME = 'HOME',
  SETTINGS = 'SETTINGS',
  USER = 'USER',
}

export const AppIcon = {
  [IconName.HOME]: Home,
  [IconName.SETTINGS]: Settings,
  [IconName.USER]: User,
} as const

export type IconNameType = keyof typeof AppIcon
