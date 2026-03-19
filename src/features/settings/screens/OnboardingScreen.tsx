/**
 * FILE: OnboardingScreen.tsx
 * LAYER: features/onboarding/screens
 */

import React from 'react'
import { StyleSheet, View } from 'react-native'
import { useT } from '@/i18n/useT'
import { resetRoot } from '@/navigation/helpers/navigation-helpers'
import { ROUTES } from '@/navigation/routes'
import { setOnboardingDone } from '@/session/bootstrap'
import { Button } from '@/shared/components/ui/Button'
import ScreenWrapper from '@/shared/components/ui/ScreenWrapper'
import { Text } from '@/shared/components/ui/Text'
import { useTheme } from '@/shared/theme'

export default function OnboardingScreen() {
  const t = useT()
  const { theme } = useTheme()
  const padding = theme.spacing.xl

  return (
    <ScreenWrapper>
      <View style={[styles.container, { padding }]}>
        <Text style={[styles.title, { marginBottom: padding }]}>
          {t('onboarding.welcome')}
        </Text>

        <Button
          title={t('onboarding.continue')}
          variant="primary"
          onPress={() => {
            // 1) mark onboarding completed
            setOnboardingDone()

            // 2) go to Auth root (clean history)
            resetRoot({
              index: 0,
              routes: [{ name: ROUTES.ROOT_AUTH as never }],
            })
          }}
        />
      </View>
    </ScreenWrapper>
  )
}

const styles = StyleSheet.create({
  container: { flex: 1, justifyContent: 'center' },
  title: {},
})
