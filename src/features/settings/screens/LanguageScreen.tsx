import React from 'react'
import { StyleSheet, View } from 'react-native'
import i18n from '@/i18n/i18n'
import { Button } from '@/shared/components/ui/Button'
import { useTheme } from '@/shared/theme/useTheme'

export default function LanguageScreen() {
  const { theme } = useTheme()

  return (
    <View
      style={[
        styles.container,
        { padding: theme.spacing.lg, gap: theme.spacing.sm },
      ]}
    >
      <Button
        title="settings.language.english"
        onPress={() => i18n.changeLanguage('en')}
      />
      <Button
        title="settings.language.russian"
        onPress={() => i18n.changeLanguage('ru')}
      />
      <Button
        title="settings.language.german"
        onPress={() => i18n.changeLanguage('de')}
      />
    </View>
  )
}

const styles = StyleSheet.create({
  container: {},
})
