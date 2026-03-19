// src/app/navigation/tabs/home-tabs.tsx

import { createBottomTabNavigator } from '@react-navigation/bottom-tabs'
import React, { useMemo } from 'react'
import HomeScreen from '@/features/home/screens/HomeScreen'
import SettingsScreen from '@/features/settings/screens/SettingsScreen'
import { useT } from '@/i18n/useT'
import { createHomeScreenOptions } from '@/navigation'
import { ROUTES } from '@/navigation/routes'
import { useTheme } from '@/shared/theme'

const Tab = createBottomTabNavigator()

export default function HomeTabs() {
  const { theme } = useTheme()
  const t = useT()

  // preserve referential stability of screenOptions
  const screenOptions = useMemo(
    () => createHomeScreenOptions(theme, t),
    [theme, t],
  )

  return (
    <Tab.Navigator screenOptions={screenOptions}>
      <Tab.Screen name={ROUTES.TAB_HOME} component={HomeScreen} />
      <Tab.Screen name={ROUTES.TAB_SETTINGS} component={SettingsScreen} />
    </Tab.Navigator>
  )
}
