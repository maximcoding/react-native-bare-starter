import React from 'react'
import {
  Platform,
  StatusBar,
  type StatusBarProps,
  useColorScheme,
} from 'react-native'
import { useTheme } from '@/shared/theme'

export type ThemedStatusBarProps = StatusBarProps

/**
 * Status bar styled from app theme and resolved light/dark (includes `mode === 'system'`).
 * Android defaults to non-translucent so layout aligns predictably with SafeAreaView.
 * @see https://reactnavigation.org/docs/status-bar
 */
export function ThemedStatusBar({
  barStyle,
  backgroundColor,
  translucent,
  ...rest
}: ThemedStatusBarProps) {
  const { theme, mode } = useTheme()
  const systemScheme = useColorScheme()
  const isDark =
    mode === 'dark' || (mode === 'system' && systemScheme === 'dark')

  const resolvedTranslucent =
    translucent !== undefined
      ? translucent
      : Platform.OS === 'android'
        ? false
        : undefined

  return (
    <StatusBar
      {...rest}
      barStyle={barStyle ?? (isDark ? 'light-content' : 'dark-content')}
      backgroundColor={backgroundColor ?? theme.colors.background}
      translucent={resolvedTranslucent}
    />
  )
}
