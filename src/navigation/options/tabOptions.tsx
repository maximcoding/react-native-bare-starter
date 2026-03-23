// src/app/navigation/options/tabOptions.tsx

import { IconName } from '@assets/icons' // ← no .ts extension
import type { BottomTabNavigationOptions } from '@react-navigation/bottom-tabs'
import type { TFunction } from 'i18next'
import React from 'react'
import { ROUTES } from '@/navigation/routes'
import { IconSvg } from '@/shared/components/ui/IconSvg'

//
// ICON LOGIC
//
export const BottomTabIcon = (
  route: { name: string },
  focused: boolean,
  color: string,
  size: number,
) => {
  let iconName: IconName = IconName.USER

  switch (route.name) {
    case ROUTES.TAB_HOME:
      iconName = IconName.USER
      break
    case ROUTES.TAB_SETTINGS:
      iconName = IconName.USER
      break
    default:
      iconName = IconName.USER
  }

  return <IconSvg name={iconName} size={size} color={color} />
}

//
// TITLE LOGIC
//
export const TabTitle = (
  route: { name: string },
  t: TFunction<'translation'>,
) => {
  switch (route.name) {
    case ROUTES.TAB_HOME:
      return t('home.title')
    case ROUTES.TAB_SETTINGS:
      return t('settings.title')
    default:
      return route.name
  }
}

//
// TAB BAR STYLE
//
export const TabBarStyle = (theme: any) => {
  return {
    height: 64,
    backgroundColor: theme.colors.surface ?? theme.colors.background,
    borderTopWidth: 0.5,
    borderColor: theme.colors.border ?? theme.colors.surface,
    paddingBottom: theme.spacing.xxs,
  }
}

//
// MAIN SCREEN OPTIONS (pure helper for screenOptions)
// Call inside your Tabs component where you already have `theme` and `t`.
//
export const makeTabScreenOptions = (
  theme: any,
  t: TFunction<'translation'>,
) => {
  return ({
    route,
  }: {
    route: { name: string }
  }): BottomTabNavigationOptions => ({
    headerShown: false,
    tabBarLabel: TabTitle(route, t),
    tabBarIcon: ({ focused, color, size }) =>
      BottomTabIcon(route, focused, color!, size!),
    tabBarActiveTintColor: theme.colors.primary,
    tabBarInactiveTintColor: theme.colors.textSecondary,
    tabBarStyle: TabBarStyle(theme),
  })
}
