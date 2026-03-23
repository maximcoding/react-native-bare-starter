import Config from 'react-native-config'

/** react-native-config is stringly-typed; treat common truthy/falsey spellings. */
export function parseEnvBool(raw: string | undefined): boolean {
  if (raw == null || raw.trim() === '') {
    return false
  }
  const s = raw.trim().toLowerCase()
  return s === '1' || s === 'true' || s === 'yes' || s === 'on'
}

function parseTracesSampleRate(raw: string | undefined): number {
  const n = Number.parseFloat(String(raw ?? '0'))
  if (!Number.isFinite(n) || n < 0 || n > 1) {
    return 0
  }
  return n
}

export const env = {
  API_URL: (Config.API_URL ?? '').trim(),
  USE_MOCK_API: parseEnvBool(Config.USE_MOCK_API),
  WS_URL: (Config.WS_URL ?? '').trim(),
  ENV: (Config.ENV ?? (__DEV__ ? 'development' : 'production')).trim(),
  SENTRY_DSN: (Config.SENTRY_DSN ?? '').trim(),
  SENTRY_ENABLE_IN_DEV: (Config.SENTRY_ENABLE_IN_DEV ?? '0').trim(),
  SENTRY_TRACES_SAMPLE_RATE: parseTracesSampleRate(
    Config.SENTRY_TRACES_SAMPLE_RATE,
  ),
} as const
