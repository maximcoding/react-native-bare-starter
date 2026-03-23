/**
 * Sentry init when `SENTRY_DSN` is set (see `.env.example`).
 * In __DEV__, events are off unless `SENTRY_ENABLE_IN_DEV=1`.
 */

import * as Sentry from '@sentry/react-native'
import type { ErrorInfo } from 'react'

import { env } from '@/config/env'

let didInit = false

export function initSentry(): void {
  if (didInit) {
    return
  }
  didInit = true

  if (!env.SENTRY_DSN) {
    return
  }
  if (__DEV__ && env.SENTRY_ENABLE_IN_DEV !== '1') {
    return
  }

  Sentry.init({
    dsn: env.SENTRY_DSN,
    environment: env.ENV,
    tracesSampleRate: env.SENTRY_TRACES_SAMPLE_RATE,
  })
}

/** Report React error-boundary failures (no PII; component stack only). */
export function captureBoundaryError(error: Error, errorInfo: ErrorInfo): void {
  if (!env.SENTRY_DSN) {
    return
  }
  if (__DEV__ && env.SENTRY_ENABLE_IN_DEV !== '1') {
    return
  }
  Sentry.captureException(error, {
    contexts: {
      react: {
        componentStack: errorInfo.componentStack ?? undefined,
      },
    },
  })
}
