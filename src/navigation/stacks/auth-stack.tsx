import { createNativeStackNavigator } from '@react-navigation/native-stack'
import React from 'react'
import type { AuthStackParamList } from '@/features/auth/navigation/param-list'
import AuthScreen from '@/features/auth/screens/AuthScreen'
import { useNav } from '@/navigation/options/navigation'
import { ROUTES } from '@/navigation/routes'

const Stack = createNativeStackNavigator<AuthStackParamList>()

export default function AuthStack() {
  const nav = useNav()

  return (
    <Stack.Navigator>
      <Stack.Screen
        name={ROUTES.AUTH_LOGIN}
        component={AuthScreen}
        options={nav.stack(ROUTES.AUTH_LOGIN)}
      />
    </Stack.Navigator>
  )
}
