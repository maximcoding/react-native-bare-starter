// src/navigation/tabs/home-tabs.tsx

import { createBottomTabNavigator } from '@react-navigation/bottom-tabs'
import React from 'react'
import HomeScreen from '@/features/home/screens/HomeScreen'
import SettingsScreen from '@/features/settings/screens/SettingsScreen'
import { useT } from '@/i18n/useT'
import { ROUTES } from '@/navigation/routes'
import { AnimatedTabBar } from './AnimatedTabBar'

const Tab = createBottomTabNavigator()

export default function HomeTabs() {
  const t = useT()

  return (
    <Tab.Navigator
      tabBar={props => <AnimatedTabBar {...props} />}
      screenOptions={{ headerShown: false }}
    >
      <Tab.Screen
        name={ROUTES.TAB_HOME}
        component={HomeScreen}
        options={{ tabBarLabel: t('home.title') }}
      />
      <Tab.Screen
        name={ROUTES.TAB_SETTINGS}
        component={SettingsScreen}
        options={{ tabBarLabel: t('settings.title') }}
      />
    </Tab.Navigator>
  )
}
