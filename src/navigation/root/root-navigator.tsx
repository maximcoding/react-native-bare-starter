// src/navigation/root/root-navigator.tsx

import { createBottomTabNavigator } from '@react-navigation/bottom-tabs'
import { createNativeStackNavigator } from '@react-navigation/native-stack'
import React from 'react'
import AuthScreen from '@/features/auth/screens/AuthScreen'
import HomeScreen from '@/features/home/screens/HomeScreen'
import StoryScreen from '@/features/home/screens/StoryScreen'
import LanguagePickerModal from '@/features/settings/screens/LanguagePickerModal'
import OnboardingScreen from '@/features/settings/screens/OnboardingScreen'
import SettingsScreen from '@/features/settings/screens/SettingsScreen'
import ThemePickerModal from '@/features/settings/screens/ThemePickerModal'
import { ROUTES } from '@/navigation/routes'
import { AnimatedTabBar } from '@/navigation/tabs/AnimatedTabBar'
import { getBootstrapRoute } from '@/session/bootstrap'

const HALF_SHEET_OPTIONS = {
  presentation: 'transparentModal',
  animation: 'none',
  gestureEnabled: false,
} as const

const HomeTabs = createBottomTabNavigator({
  tabBar: (props) => <AnimatedTabBar {...props} />,
  screenOptions: { headerShown: false },
  screens: {
    [ROUTES.TAB_HOME]: HomeScreen,
    [ROUTES.TAB_SETTINGS]: SettingsScreen,
  },
})

export const RootStack = createNativeStackNavigator({
  initialRouteName: getBootstrapRoute(),
  screenOptions: { headerShown: false },
  screens: {
    [ROUTES.ROOT_ONBOARDING]: OnboardingScreen,
    [ROUTES.ROOT_AUTH]: AuthScreen,
    [ROUTES.ROOT_APP]: HomeTabs,
    [ROUTES.HOME_STORY]: StoryScreen,
    [ROUTES.MODAL_THEME_PICKER]: {
      screen: ThemePickerModal,
      options: HALF_SHEET_OPTIONS,
    },
    [ROUTES.MODAL_LANGUAGE_PICKER]: {
      screen: LanguagePickerModal,
      options: HALF_SHEET_OPTIONS,
    },
  },
})
