import React from 'react'

import RootNavigator from '@/navigation/root/root-navigator'

/**
 * Root navigation shell (app layout).
 * Screens live under features; this wires stacks, tabs, and root flow.
 */
export default function AppLayout() {
  return <RootNavigator />
}
