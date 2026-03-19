/**
 * FILE: onboarding-stack.tsx
 * LAYER: navigation/stacks/onboarding
 */

import { createNativeStackNavigator } from '@react-navigation/native-stack'
import React from 'react'
import type { OnboardingStackParamList } from '@/features/settings/navigation/param-list'
import OnboardingScreen from '@/features/settings/screens/OnboardingScreen'
import { ROUTES } from '@/navigation/routes'

const Stack = createNativeStackNavigator<OnboardingStackParamList>()

export default function OnboardingStack() {
  return (
    <Stack.Navigator screenOptions={{ headerShown: false }}>
      <Stack.Screen
        name={ROUTES.ONBOARDING_MAIN}
        component={OnboardingScreen}
      />
    </Stack.Navigator>
  )
}
