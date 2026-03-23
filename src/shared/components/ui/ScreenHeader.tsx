// src/shared/components/ui/ScreenHeader.tsx

import React from 'react'
import { StyleSheet, TouchableOpacity, View } from 'react-native'
import Svg, { Polyline } from 'react-native-svg'
import { Text } from '@/shared/components/ui/Text'
import { useTheme } from '@/shared/theme'

interface Props {
  title: string
  onBack?: () => void
  /** Optional element rendered in the right slot (mirrors back button width). */
  right?: React.ReactNode
}

const BTN_SIZE = 40
const HEADER_HEIGHT = 56

export function ScreenHeader({ title, onBack, right }: Props) {
  const { theme } = useTheme()
  const c = theme.colors
  const sp = theme.spacing
  const ty = theme.typography

  return (
    <View
      style={[
        styles.row,
        {
          height: HEADER_HEIGHT,
          paddingHorizontal: sp.md,
          backgroundColor: c.background,
          borderBottomWidth: StyleSheet.hairlineWidth,
          borderBottomColor: c.divider,
        },
      ]}
    >
      {/* Left: back button or placeholder to balance centering */}
      <View style={styles.side}>
        {onBack ? (
          <TouchableOpacity
            onPress={onBack}
            hitSlop={{ top: 8, bottom: 8, left: 8, right: 8 }}
            accessibilityRole="button"
            style={styles.iconBtn}
          >
            <Svg
              width={20}
              height={20}
              viewBox="0 0 24 24"
              fill="none"
              stroke={c.textPrimary}
              strokeWidth={2.2}
              strokeLinecap="round"
              strokeLinejoin="round"
            >
              <Polyline points="15 18 9 12 15 6" />
            </Svg>
          </TouchableOpacity>
        ) : null}
      </View>

      {/* Title — absolutely centered so it ignores left/right slot widths */}
      <View style={StyleSheet.absoluteFill} pointerEvents="none">
        <View style={styles.titleCenter}>
          <Text
            style={[ty.titleMedium, { color: c.textPrimary }]}
            numberOfLines={1}
          >
            {title}
          </Text>
        </View>
      </View>

      {/* Right slot */}
      <View style={[styles.side, styles.sideRight]}>{right ?? null}</View>
    </View>
  )
}

const styles = StyleSheet.create({
  row: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  side: {
    width: BTN_SIZE,
    justifyContent: 'center',
    alignItems: 'flex-start',
  },
  sideRight: {
    alignItems: 'flex-end',
  },
  iconBtn: {
    width: BTN_SIZE,
    height: BTN_SIZE,
    alignItems: 'center',
    justifyContent: 'center',
  },
  titleCenter: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
})
