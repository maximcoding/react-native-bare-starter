/**
 * FILE: navigation-helpers.ts
 * Safe fallback metadata provider
 */

import {
  createNavigationContainerRef,
  NavigationState,
} from '@react-navigation/native'
import type { RootStackParamList } from '@/navigation/root-param-list'
import type { RouteName } from '@/navigation/routes'

/**
 * Minimal meta type used ONLY to satisfy presets.
 */
export interface NavMeta {
  label: string
}

/**
 * Fallback for ALL routes.
 * stack/header will use this unless overridden.
 */
const FALLBACK: NavMeta = {
  label: 'app.title',
}

/**
 * TEMPORARY EMPTY MAP
 * (You removed navConfig.ts — this is OK)
 */
const EMPTY_MAP: Partial<Record<RouteName, NavMeta>> = {}

/**
 * Safe unified getter.
 * Never crashes.
 */
export function getNavConfig(route: RouteName): NavMeta {
  return EMPTY_MAP[route] ?? FALLBACK
}

/**
 * ------------------------------------------------------------------
 * Root navigation ref + helpers for imperative navigation (optional)
 * ------------------------------------------------------------------
 * Use only outside components when useNavigation() is not available.
 */
export const navigationRef = createNavigationContainerRef<RootStackParamList>()

/** Returns the active route name, traversing nested navigators. */
export function getActiveRouteName(
  state: ReturnType<typeof navigationRef.getRootState>,
): keyof RootStackParamList | undefined {
  const index = state?.index ?? 0
  const route = state?.routes?.[index]
  if (!route) return undefined
  const childState = route.state as NavigationState | undefined
  if (!childState) return route.name as keyof RootStackParamList
  // recursion
  return getActiveRouteName(childState)
}

/** Imperative navigation without navigation prop. Use with care. */
export function navigate<Name extends keyof RootStackParamList>(
  name: Name,
  params?: RootStackParamList[Name],
) {
  if (navigationRef.isReady()) {
    // RN allows undefined params
    navigationRef.navigate(name as any, params as any)
  }
}

/** Safe goBack. */
export function goBack() {
  if (navigationRef.isReady() && navigationRef.canGoBack()) {
    navigationRef.goBack()
  }
}

/** Full reset of root navigation state. */
export function resetRoot(
  state: Parameters<typeof navigationRef.resetRoot>[0] = {
    index: 0,
    routes: [],
  },
) {
  if (navigationRef.isReady()) {
    navigationRef.resetRoot(state)
  }
}
