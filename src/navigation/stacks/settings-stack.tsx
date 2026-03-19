import { createNativeStackNavigator } from '@react-navigation/native-stack'
import React from 'react'
import type { SettingsStackParamList } from '@/features/settings/navigation/param-list'
import LanguageScreen from '@/features/settings/screens/LanguageScreen'
import SettingsScreen from '@/features/settings/screens/SettingsScreen'
import ThemeScreen from '@/features/settings/screens/ThemeScreen'
import { ROUTES } from '@/navigation/routes'

const Stack = createNativeStackNavigator<SettingsStackParamList>()

export default function SettingsStack() {
  return (
    <Stack.Navigator>
      <Stack.Screen name={ROUTES.SETTINGS_ROOT} component={SettingsScreen} />
      <Stack.Screen
        name={ROUTES.SETTINGS_LANGUAGE}
        component={LanguageScreen}
      />
      <Stack.Screen name={ROUTES.SETTINGS_THEME} component={ThemeScreen} />
    </Stack.Navigator>
  )
}
