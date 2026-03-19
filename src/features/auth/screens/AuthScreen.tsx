// src/features/auth/screens/AuthScreen.tsx

import React, { useMemo, useState } from 'react'
import { StyleSheet, TextInput, View } from 'react-native'
import { useLoginMutation } from '@/features/auth/hooks/useLoginMutation'
import { useT } from '@/i18n/useT'
import { resetRoot } from '@/navigation/helpers/navigation-helpers'
import { ROUTES } from '@/navigation/routes'
import { Button } from '@/shared/components/ui/Button'
import ScreenWrapper from '@/shared/components/ui/ScreenWrapper'
import { Text } from '@/shared/components/ui/Text'
import { useTheme } from '@/shared/theme'
import { normalizeError } from '@/shared/utils/normalize-error'
import { showErrorToast } from '@/shared/utils/toast'

export default function AuthScreen() {
  const t = useT()
  const { theme } = useTheme()
  const login = useLoginMutation()

  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')

  const disabled = useMemo(() => {
    return login.isPending || !email.trim() || !password.trim()
  }, [login.isPending, email, password])

  const handleLogin = async () => {
    try {
      await login.mutateAsync({ email, password })

      resetRoot({
        index: 0,
        routes: [{ name: ROUTES.ROOT_APP as never }],
      })
    } catch (e) {
      showErrorToast(normalizeError(e))
    }
  }

  const padding = theme.spacing.xl

  return (
    <ScreenWrapper>
      <View style={[styles.container, { padding }]}>
        <Text style={[styles.title, { marginBottom: padding }]}>
          {t('auth.title')}
        </Text>

        <TextInput
          style={[
            styles.input,
            {
              borderColor: theme.colors.border,
              borderRadius: theme.radius.md,
              paddingHorizontal: theme.spacing.md,
              color: theme.colors.textPrimary,
              backgroundColor: theme.colors.surface,
              marginBottom: theme.spacing.md,
              ...theme.typography.bodyMedium,
            },
          ]}
          placeholder={t('auth.email')}
          placeholderTextColor={theme.colors.textTertiary}
          value={email}
          onChangeText={setEmail}
          autoCapitalize="none"
          keyboardType="email-address"
          autoCorrect={false}
        />

        <TextInput
          style={[
            styles.input,
            {
              borderColor: theme.colors.border,
              borderRadius: theme.radius.md,
              paddingHorizontal: theme.spacing.md,
              color: theme.colors.textPrimary,
              backgroundColor: theme.colors.surface,
              marginBottom: theme.spacing.lg,
              ...theme.typography.bodyMedium,
            },
          ]}
          placeholder={t('auth.password')}
          placeholderTextColor={theme.colors.textTertiary}
          value={password}
          onChangeText={setPassword}
          secureTextEntry
        />

        <Button
          title={login.isPending ? t('common.loading') : t('auth.login')}
          variant="primary"
          disabled={disabled}
          onPress={() => {
            handleLogin()
          }}
        />
      </View>
    </ScreenWrapper>
  )
}

const styles = StyleSheet.create({
  container: { flex: 1, justifyContent: 'center' },
  title: {},
  input: {
    height: 44,
    borderWidth: 1,
  },
})
