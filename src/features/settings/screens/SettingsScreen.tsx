import React, { useCallback, useMemo } from 'react'
import { StyleSheet, View } from 'react-native'
import { SettingsRow } from '@/features/settings/components/SettingsRow'
import { SettingsSection } from '@/features/settings/components/SettingsSection'
import { useMeQuery } from '@/features/user/hooks/useMeQuery'
import i18n from '@/i18n/i18n'
import { useT } from '@/i18n/useT'
import { performLogout } from '@/session/logout'
import ScreenWrapper from '@/shared/components/ui/ScreenWrapper'
import { Text } from '@/shared/components/ui/Text'
import { useTheme } from '@/shared/theme/useTheme'

const THEME_MODE_KEYS = {
  light: 'settings.theme_light',
  dark: 'settings.theme_dark',
  system: 'settings.theme_system',
} as const

const LANGUAGE_LABELS: Record<string, string> = {
  en: 'English',
  ru: 'Русский',
  de: 'Deutsch',
}

const LANGUAGE_CYCLE = ['en', 'ru', 'de'] as const

export default function SettingsScreen() {
  const { theme, mode, setTheme } = useTheme()
  const t = useT()
  const me = useMeQuery()

  const themeModeLabel = t(THEME_MODE_KEYS[mode])

  const currentLang = i18n.language
  const languageLabel = LANGUAGE_LABELS[currentLang] ?? currentLang

  const cycleTheme = useCallback(() => {
    const next =
      mode === 'light' ? 'dark' : mode === 'dark' ? 'system' : 'light'
    setTheme(next)
  }, [mode, setTheme])

  const cycleLanguage = useCallback(() => {
    const lang = i18n.language
    const idx = LANGUAGE_CYCLE.indexOf(lang as (typeof LANGUAGE_CYCLE)[number])
    const next = LANGUAGE_CYCLE[(idx + 1) % LANGUAGE_CYCLE.length]
    i18n.changeLanguage(next)
  }, [])

  const handleLogout = useCallback(() => {
    performLogout()
  }, [])

  const userName = me.data?.name ?? '—'
  const userEmail = me.data?.email ?? undefined

  const initials = useMemo(() => {
    if (!me.data?.name) return '?'
    return me.data.name
      .split(' ')
      .slice(0, 2)
      .map(w => w[0]?.toUpperCase())
      .join('')
  }, [me.data?.name])

  return (
    <ScreenWrapper scroll>
      <View style={{ padding: theme.spacing.lg, gap: theme.spacing.lg }}>
        {/* Screen title */}
        <Text
          style={[
            theme.typography.displaySmall,
            { color: theme.colors.textPrimary },
          ]}
        >
          {t('settings.title')}
        </Text>

        {/* Account card */}
        <SettingsSection>
          <View
            style={[
              styles.accountRow,
              {
                padding: theme.spacing.md,
                gap: theme.spacing.sm,
              },
            ]}
          >
            <View
              style={[
                styles.avatar,
                {
                  width: theme.spacing.xxxxl,
                  height: theme.spacing.xxxxl,
                  borderRadius: theme.radius.rounded,
                  backgroundColor: theme.colors.primary,
                },
              ]}
            >
              <Text
                style={[
                  theme.typography.titleMedium,
                  { color: theme.colors.onPrimary },
                ]}
              >
                {initials}
              </Text>
            </View>

            <View style={styles.accountInfo}>
              <Text
                style={[
                  theme.typography.titleMedium,
                  { color: theme.colors.textPrimary },
                ]}
              >
                {userName}
              </Text>
              {userEmail != null ? (
                <Text
                  style={[
                    theme.typography.bodySmall,
                    { color: theme.colors.textSecondary },
                  ]}
                >
                  {userEmail}
                </Text>
              ) : null}
            </View>
          </View>
        </SettingsSection>

        {/* Appearance section */}
        <SettingsSection title={t('settings.appearance')}>
          <SettingsRow
            label={t('settings.theme')}
            value={themeModeLabel}
            onPress={cycleTheme}
          />
          <SettingsRow
            label={t('settings.language.label')}
            value={languageLabel}
            onPress={cycleLanguage}
          />
        </SettingsSection>

        {/* About section */}
        <SettingsSection title={t('settings.about')}>
          <SettingsRow label={t('settings.version')} value="0.0.1" />
        </SettingsSection>

        {/* Logout */}
        <SettingsSection>
          <SettingsRow
            label={t('settings.logout')}
            danger
            onPress={handleLogout}
          />
        </SettingsSection>
      </View>
    </ScreenWrapper>
  )
}

const styles = StyleSheet.create({
  accountRow: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  avatar: {
    alignItems: 'center',
    justifyContent: 'center',
  },
  accountInfo: {
    flex: 1,
  },
})
