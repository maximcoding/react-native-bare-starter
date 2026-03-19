/**
 * FILE: ThemeScreen.tsx
 * LAYER: app/features/settings/screens
 */

import React from 'react'
import { StyleSheet, View } from 'react-native'
import { Button } from '@/shared/components/ui/Button'
import type { ThemeMode } from '@/shared/theme/ThemeContext'
import { useTheme } from '@/shared/theme/useTheme'

export default function ThemeScreen() {
  const { theme, setTheme } = useTheme()

  const modes: ThemeMode[] = ['light', 'dark', 'system']

  return (
    <View
      style={[
        styles.container,
        { padding: theme.spacing.lg, gap: theme.spacing.sm },
      ]}
    >
      {modes.map(m => (
        <Button key={m} title={m.toUpperCase()} onPress={() => setTheme(m)} />
      ))}
    </View>
  )
}

const styles = StyleSheet.create({
  container: {},
})
