/**
 * FILE: root-navigator.tsx
 * LAYER: navigation/root
 */

import { createNativeStackNavigator } from '@react-navigation/native-stack'
import React from 'react'
import { RootStackParamList } from '@/navigation'
import { ROUTES } from '@/navigation/routes'
import AuthStack from '@/navigation/stacks/auth-stack'
import OnboardingStack from '@/navigation/stacks/onboarding-stack'
import HomeTabs from '@/navigation/tabs/home-tabs'

import { useBootstrapRoute } from '@/session/useBootstrapRoute'

const Stack = createNativeStackNavigator<RootStackParamList>()

export default function RootNavigator() {
  const boot = useBootstrapRoute()

  // TODO: replace with your Splash component
  if (!boot) return null

  // Map bootstrap route to ROUTES constants
  const initialRouteName =
    boot === 'ROOT_APP'
      ? ROUTES.ROOT_APP
      : boot === 'ROOT_AUTH'
        ? ROUTES.ROOT_AUTH
        : ROUTES.ROOT_ONBOARDING

  return (
    <Stack.Navigator
      initialRouteName={initialRouteName}
      screenOptions={{ headerShown: false }}
    >
      <Stack.Screen name={ROUTES.ROOT_ONBOARDING} component={OnboardingStack} />
      <Stack.Screen name={ROUTES.ROOT_AUTH} component={AuthStack} />
      <Stack.Screen name={ROUTES.ROOT_APP} component={HomeTabs} />
    </Stack.Navigator>
  )
}
