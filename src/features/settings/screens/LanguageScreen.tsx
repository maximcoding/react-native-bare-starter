import { useNavigation } from '@react-navigation/native'
import React, { useCallback } from 'react'
import { View } from 'react-native'
import i18n from '@/i18n/i18n'
import { useT } from '@/i18n/useT'
import ScreenWrapper from '@/shared/components/ui/ScreenWrapper'
import { ScreenHeader } from '@/shared/components/ui/ScreenHeader'
import { Button } from '@/shared/components/ui/Button'
import { useTheme } from '@/shared/theme/useTheme'

export default function LanguageScreen() {
  const { theme } = useTheme()
  const t = useT()
  const nav = useNavigation()

  const handleBack = useCallback(() => nav.goBack(), [nav])

  return (
    <ScreenWrapper
      header={
        <ScreenHeader title={t('settings.language.label')} onBack={handleBack} />
      }
    >
      <View style={{ padding: theme.spacing.lg, gap: theme.spacing.sm }}>
        <Button
          title={t('settings.language.english')}
          onPress={() => i18n.changeLanguage('en')}
        />
        <Button
          title={t('settings.language.russian')}
          onPress={() => i18n.changeLanguage('ru')}
        />
        <Button
          title={t('settings.language.german')}
          onPress={() => i18n.changeLanguage('de')}
        />
      </View>
    </ScreenWrapper>
  )
}
