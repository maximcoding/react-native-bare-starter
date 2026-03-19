import React from 'react'
import { Pressable, StyleSheet, View } from 'react-native'
import { Text } from '@/shared/components/ui/Text'
import { useTheme } from '@/shared/theme/useTheme'

interface SettingsRowProps {
  label: string
  value?: string
  onPress?: () => void
  danger?: boolean
}

export function SettingsRow({
  label,
  value,
  onPress,
  danger,
}: SettingsRowProps) {
  const { theme } = useTheme()

  const labelColor = danger ? theme.colors.danger : theme.colors.textPrimary
  const chevronColor = theme.colors.textTertiary

  return (
    <Pressable
      onPress={onPress}
      disabled={!onPress}
      style={({ pressed }) => [
        styles.row,
        {
          paddingVertical: theme.spacing.sm,
          paddingHorizontal: theme.spacing.md,
        },
        pressed && { backgroundColor: theme.colors.overlayLight },
      ]}
    >
      <Text style={[theme.typography.bodyMedium, { color: labelColor }]}>
        {label}
      </Text>

      {value != null || onPress != null ? (
        <View style={styles.trailing}>
          {value != null ? (
            <Text
              style={[
                theme.typography.bodyMedium,
                { color: theme.colors.textTertiary },
              ]}
            >
              {value}
            </Text>
          ) : null}
          {onPress != null ? (
            <Text
              style={[
                theme.typography.bodyMedium,
                {
                  color: chevronColor,
                  marginLeft: theme.spacing.xxs,
                },
              ]}
            >
              {'\u203A'}
            </Text>
          ) : null}
        </View>
      ) : null}
    </Pressable>
  )
}

const styles = StyleSheet.create({
  row: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    minHeight: 44,
  },
  trailing: {
    flexDirection: 'row',
    alignItems: 'center',
  },
})
