import { AppIcon, IconName } from '@assets/icons'
import React from 'react'
import { View, type ViewStyle } from 'react-native'
import { useTheme } from '@/shared/theme'

interface Props {
  name: IconName
  size?: number
  /** Defaults to theme.colors.textPrimary when not provided. */
  color?: string
  style?: ViewStyle
}

export const IconSvg = ({ name, size = 24, color, style }: Props) => {
  const { theme } = useTheme()
  const iconColor = color ?? theme.colors.textPrimary
  const IconComponent = AppIcon[name]

  if (!IconComponent) {
    console.warn(`❗ IconSvg: icon "${name}" not found in AppIcon`)
    return <View style={{ width: size, height: size }} />
  }

  return (
    <View style={style}>
      <IconComponent
        width={size}
        height={size}
        stroke={iconColor}
        fill={iconColor}
        strokeWidth={2}
      />
    </View>
  )
}
