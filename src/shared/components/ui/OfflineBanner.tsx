// src/app/components/OfflineBanner.tsx
import React from 'react'
import { StyleSheet, Text, View } from 'react-native'
import { useOnlineStatus } from '@/shared/hooks/useOnlineStatus'
import { useTheme } from '@/shared/theme'

type Props = { testID?: string }

export function OfflineBanner({ testID }: Props) {
  const { theme } = useTheme()
  const { isOffline } = useOnlineStatus()

  if (!isOffline) return null

  const bg = theme.colors.surfaceSecondary ?? theme.colors.background
  const border = theme.colors.surface ?? theme.colors.background

  return (
    <View
      testID={testID}
      style={[
        styles.container,
        {
          backgroundColor: bg,
          borderColor: border,
          paddingHorizontal: theme.spacing.sm,
          paddingVertical: theme.spacing.xs,
        },
      ]}
    >
      <Text
        style={[
          theme.typography.labelMedium,
          { color: theme.colors.textPrimary },
        ]}
        numberOfLines={1}
      >
        You’re offline. Showing cached data.
      </Text>
    </View>
  )
}

const styles = StyleSheet.create({
  container: {
    alignSelf: 'stretch',
    borderBottomWidth: StyleSheet.hairlineWidth,
  },
})
