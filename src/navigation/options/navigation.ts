import { useMemo } from 'react'
import { getNavConfig } from '@/navigation/helpers/navigation-helpers'
import { RouteName } from '@/navigation/routes'
import {
  useModalPresets,
  useStackPresets,
  useTabPresets,
} from './navigation.presets'

/**
 * Central navigation option provider (Stripe-level architecture).
 * Provides: stack(), transparent(), tabs(), modal(), half().
 */
export function useNav() {
  const stackPresets = useStackPresets()
  const modalPresets = useModalPresets()
  const tabPresets = useTabPresets()

  /**
   * Memoized preset factory:
   * ensures stable referential identity → fewer re-renders of nav.
   */
  return useMemo(
    () => ({
      /**
       * DEFAULT OPTIONS FOR ALL STACK NAVIGATORS
       */
      defaultStackOptions: {
        headerShown: false,
        animation: 'fade',
      },
      /**
       * Default stack screen
       */
      stack(route: RouteName) {
        return stackPresets.forRoute(route)
      },

      /**
       * Transparent stack (header overlay)
       */
      transparent(route: RouteName) {
        const cfg = getNavConfig(route)
        return {
          ...stackPresets.transparent,
          headerTitle: cfg.label,
        }
      },

      /**
       * Bottom tabs
       */
      tabs(route: RouteName) {
        return tabPresets.forRoute(route)
      },

      /**
       * Fullscreen modal
       */
      modal(route: RouteName) {
        return modalPresets.forRoute(route)
      },

      /**
       * Half-modal (bottom-sheet style)
       */
      half(route: RouteName) {
        const cfg = getNavConfig(route)
        return {
          ...modalPresets.half,
          title: cfg.label,
        }
      },
    }),
    [stackPresets, modalPresets, tabPresets],
  )
}
