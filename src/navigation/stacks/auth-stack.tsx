import { createNativeStackNavigator } from '@react-navigation/native-stack'
import React from 'react'
import type { AuthStackParamList } from '@/features/auth/navigation/param-list'
import AuthScreen from '@/features/auth/screens/AuthScreen'
import { ROUTES } from '@/navigation/routes'

const Stack = createNativeStackNavigator<AuthStackParamList>()

export default function AuthStack() {
  return (
    <Stack.Navigator>
      <Stack.Screen
        name={ROUTES.AUTH_LOGIN}
        component={AuthScreen}
        options={{ headerShown: false }}
      />
    </Stack.Navigator>
  )
}
