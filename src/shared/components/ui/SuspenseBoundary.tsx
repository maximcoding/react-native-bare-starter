/**
 * `React.Suspense` with a theme-aware default fallback (`ActivityIndicator`).
 * Use with `useSuspenseQuery` or `React.lazy` children. Must be under `ThemeProvider`.
 */

import React, { Suspense } from 'react'
import { ActivityIndicator, StyleSheet, View } from 'react-native'
import { useTheme } from '@/shared/theme/useTheme'

function DefaultFallback() {
  const { theme } = useTheme()
  return (
    <View
      style={[styles.center, { padding: theme.spacing.lg }]}
      accessibilityRole="progressbar"
      accessibilityLabel="Loading"
    >
      <ActivityIndicator size="large" color={theme.colors.primary} />
    </View>
  )
}

export function SuspenseBoundary({
  children,
  fallback,
}: {
  children: React.ReactNode
  fallback?: React.ReactNode
}) {
  return (
    <Suspense fallback={fallback ?? <DefaultFallback />}>{children}</Suspense>
  )
}

const styles = StyleSheet.create({
  center: {
    minHeight: 120,
    alignItems: 'center',
    justifyContent: 'center',
  },
})
