/**
 * Keeps children **mounted** (state preserved) while toggling visibility.
 * RN has no `display: none` / DOM `hidden`; this approximates off-screen UI.
 *
 * - Default `collapseLayout`: hidden → no layout space (`height: 0`, `opacity: 0`, no touches).
 * - `collapseLayout={false}`: hidden → keeps layout box, only `opacity: 0` + no touches.
 *
 * @see https://react.dev/reference/react/Activity (web API differs; this is RN-specific)
 */

import React from 'react'
import { StyleSheet, View, type ViewProps } from 'react-native'

export type ActivityProps = ViewProps & {
  children: React.ReactNode
  /** When false, subtree stays mounted but is hidden and does not receive touches */
  visible: boolean
  /**
   * When false and `visible` is false: remove from flex layout (height 0).
   * When true and `visible` is false: keep layout box, only fade and block touches.
   */
  collapseLayout?: boolean
}

export function Activity({
  children,
  visible,
  collapseLayout = true,
  style,
  ...rest
}: ActivityProps) {
  return (
    <View
      collapsable={false}
      pointerEvents={visible ? 'box-none' : 'none'}
      style={[
        styles.base,
        !visible &&
          (collapseLayout ? styles.hiddenCollapsed : styles.hiddenInvisible),
        style,
      ]}
      {...rest}
    >
      {children}
    </View>
  )
}

const styles = StyleSheet.create({
  base: {
    overflow: 'hidden',
  },
  hiddenCollapsed: {
    opacity: 0,
    height: 0,
  },
  hiddenInvisible: {
    opacity: 0,
  },
})
