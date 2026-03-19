import { NavigationContainer } from '@react-navigation/native'
import React, { useEffect } from 'react'
import { StatusBar, StyleSheet } from 'react-native'
import BootSplash from 'react-native-bootsplash'
import { GestureHandlerRootView } from 'react-native-gesture-handler'
import { SafeAreaProvider } from 'react-native-safe-area-context'

import { ThemeProvider } from '@/shared/theme/ThemeProvider'
import '@/i18n/i18n'

import { flags } from '@/config/constants'
import { authKeys } from '@/features/auth/api/keys'
import { userKeys } from '@/features/user/api/keys'
import AppLayout from '@/navigation/AppLayout'
import { navigationRef } from '@/navigation/helpers/navigation-helpers'
import { useBackButtonHandler } from '@/navigation/helpers/use-back-handler'
import { ROUTES } from '@/navigation/routes'
import { OfflineBanner } from '@/shared/components/ui/OfflineBanner'
import { QueryProvider } from '@/shared/services/api/query/client/provider'
import { mockAdapter } from '@/shared/services/api/transport/adapters/mock.adapter'
import { restAdapter } from '@/shared/services/api/transport/adapters/rest.adapter'
import { setTransport } from '@/shared/services/api/transport/transport'

export default function App() {
  useEffect(() => {
    setTransport(flags.USE_MOCK ? mockAdapter : restAdapter)
  }, [])

  useBackButtonHandler(
    routeName =>
      routeName === ROUTES.HOME_TABS || routeName === ROUTES.TAB_HOME,
  )

  return (
    <GestureHandlerRootView style={styles.flex}>
      <SafeAreaProvider>
        <StatusBar barStyle="dark-content" />
        <ThemeProvider>
          <QueryProvider tagMaps={[authKeys.tagMap, userKeys.tagMap]}>
            <OfflineBanner />

            <NavigationContainer
              ref={navigationRef}
              onReady={() => BootSplash.hide({ fade: true })}
            >
              <AppLayout />
            </NavigationContainer>
          </QueryProvider>
        </ThemeProvider>
      </SafeAreaProvider>
    </GestureHandlerRootView>
  )
}

const styles = StyleSheet.create({ flex: { flex: 1 } })
