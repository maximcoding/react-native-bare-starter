// src/features/home/screens/HomeScreen.tsx

import { NavigationProp, useNavigation } from '@react-navigation/native'
import React, { useMemo } from 'react'
import { Pressable, View } from 'react-native'
import { useMeQuery } from '@/features/user/hooks/useMeQuery'
import { useT } from '@/i18n/useT'
import type { RootStackParamList } from '@/navigation'
import { ROUTES } from '@/navigation/routes'
import { performLogout } from '@/session/logout'
import ScreenWrapper from '@/shared/components/ui/ScreenWrapper'
import { Text } from '@/shared/components/ui/Text'
import { useTheme } from '@/shared/theme/useTheme'
import { normalizeError } from '@/shared/utils/normalize-error'

export default function HomeScreen() {
  const { theme } = useTheme()
  const t = useT()
  const nav = useNavigation<NavigationProp<RootStackParamList>>()

  const me = useMeQuery()

  const errorText = me.error ? normalizeError(me.error).message : null

  const themedStyles = useMemo(
    () => ({
      screen: {
        padding: theme.spacing.lg,
        gap: theme.spacing.md,
      },
      title: {
        ...theme.typography.displaySmall,
        color: theme.colors.textPrimary,
      },
      subtitle: {
        ...theme.typography.bodyLarge,
        color: theme.colors.textSecondary,
      },
      card: {
        marginTop: theme.spacing.md,
        padding: theme.spacing.md,
        borderRadius: theme.radius.md,
        backgroundColor: theme.colors.surface,
      },
      textSecondary: { color: theme.colors.textSecondary },
      textPrimary: { color: theme.colors.textPrimary },
      primaryButton: {
        marginTop: theme.spacing.xl,
        backgroundColor: theme.colors.primary,
        borderRadius: theme.radius.md,
        paddingVertical: theme.spacing.md,
        paddingHorizontal: theme.spacing.lg,
      },
      primaryButtonText: {
        ...theme.typography.labelLarge,
        color: theme.colors.onPrimary,
        textAlign: 'center' as const,
      },
      secondaryButton: {
        marginTop: theme.spacing.md,
        backgroundColor: theme.colors.surface,
        borderRadius: theme.radius.md,
        paddingVertical: theme.spacing.md,
        paddingHorizontal: theme.spacing.lg,
        borderWidth: 1,
        borderColor: theme.colors.border ?? theme.colors.textSecondary,
      },
      secondaryButtonText: {
        ...theme.typography.labelLarge,
        color: theme.colors.textPrimary,
        textAlign: 'center' as const,
      },
    }),
    [theme],
  )

  return (
    <ScreenWrapper>
      <View style={themedStyles.screen}>
        <Text style={themedStyles.title}>{t('home.title')}</Text>

        <Text style={themedStyles.subtitle}>{t('home.subtitle')}</Text>

        <View style={themedStyles.card}>
          {me.isLoading ? (
            <Text style={themedStyles.textSecondary}>
              {t('common.loading')}
            </Text>
          ) : errorText ? (
            <Text style={themedStyles.textSecondary}>
              {t('common.error')}: {errorText}
            </Text>
          ) : me.data ? (
            <>
              <Text style={themedStyles.textPrimary}>Me: {me.data.name}</Text>
              {me.data.email ? (
                <Text style={themedStyles.textSecondary}>{me.data.email}</Text>
              ) : null}
            </>
          ) : (
            <Text style={themedStyles.textSecondary}>
              {t('common.no_data')}
            </Text>
          )}
        </View>

        <Pressable
          onPress={() => nav.navigate(ROUTES.TAB_SETTINGS as never)}
          style={themedStyles.primaryButton}
        >
          <Text style={themedStyles.primaryButtonText}>
            {t('home.go_settings')}
          </Text>
        </Pressable>

        <Pressable
          onPress={() => performLogout()}
          style={themedStyles.secondaryButton}
        >
          <Text style={themedStyles.secondaryButtonText}>
            {t('auth.logout') ?? 'Logout'}
          </Text>
        </Pressable>
      </View>
    </ScreenWrapper>
  )
}
