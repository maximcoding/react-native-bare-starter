/**
 * Class error boundary — hooks live only in the themed fallback child.
 * Wrap feature trees or the app shell inside ThemeProvider so fallback can use useTheme / useT.
 */

import React, { Component, type ErrorInfo, type ReactNode } from 'react'
import { ScrollView, StyleSheet, View } from 'react-native'
import { useT } from '@/i18n/useT'
import { useTheme } from '@/shared/theme/useTheme'
import { Button } from './Button'
import { Text } from './Text'

type ErrorBoundaryProps = {
  children: ReactNode
  /** Optional hook for Sentry / logging — do not log secrets or PII */
  onError?: (error: Error, errorInfo: ErrorInfo) => void
}

type ErrorBoundaryState = {
  hasError: boolean
  error: Error | null
}

export class ErrorBoundary extends Component<
  ErrorBoundaryProps,
  ErrorBoundaryState
> {
  state: ErrorBoundaryState = { hasError: false, error: null }

  static getDerivedStateFromError(error: Error): Partial<ErrorBoundaryState> {
    return { hasError: true, error }
  }

  override componentDidCatch(error: Error, errorInfo: ErrorInfo) {
    this.props.onError?.(error, errorInfo)
    if (__DEV__) {
      console.error('[ErrorBoundary]', error.message, errorInfo.componentStack)
    }
  }

  reset = () => {
    this.setState({ hasError: false, error: null })
  }

  override render() {
    const { hasError, error } = this.state
    if (hasError && error) {
      return <ErrorBoundaryFallback error={error} onRetry={this.reset} />
    }
    return this.props.children
  }
}

function ErrorBoundaryFallback({
  error,
  onRetry,
}: {
  error: Error
  onRetry: () => void
}) {
  const { theme } = useTheme()
  const t = useT()

  return (
    <View
      style={[styles.root, { backgroundColor: theme.colors.background }]}
      accessibilityRole="alert"
    >
      <ScrollView
        contentContainerStyle={[
          styles.content,
          { padding: theme.spacing.lg, gap: theme.spacing.md },
        ]}
        keyboardShouldPersistTaps="handled"
      >
        <Text
          style={[
            theme.typography.headlineSmall,
            { color: theme.colors.textPrimary },
          ]}
        >
          {t('common.error_title')}
        </Text>
        <Text
          style={[
            theme.typography.bodyMedium,
            { color: theme.colors.textSecondary },
          ]}
        >
          {t('common.error_hint')}
        </Text>
        {__DEV__ ? (
          <Text
            style={[
              theme.typography.bodySmall,
              { color: theme.colors.textTertiary },
            ]}
            selectable
          >
            {error.message}
          </Text>
        ) : null}
        <Button
          title={t('common.retry')}
          variant="primary"
          onPress={onRetry}
          testID="error-boundary-retry"
        />
      </ScrollView>
    </View>
  )
}

const styles = StyleSheet.create({
  root: { flex: 1 },
  content: { flexGrow: 1, justifyContent: 'center' },
})
