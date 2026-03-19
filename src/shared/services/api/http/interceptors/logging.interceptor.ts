/**
 * FILE: logging.interceptor.ts
 * LAYER: infra/http/interceptors
 * ---------------------------------------------------------------------
 * Dev-time HTTP logging without leaking secrets. Uses apisauce
 * addRequestTransform and addMonitor. Redacts sensitive fields.
 * ---------------------------------------------------------------------
 */

import { create } from 'apisauce'
import type {
  ApiResponse,
  RequestConfig,
} from '@/shared/services/api/http/http.types'

const SENSITIVE_KEYS = new Set(
  ['authorization', 'auth', 'token', 'password', 'secret', 'apiKey'].map(s =>
    s.toLowerCase(),
  ),
)
const SENSITIVE_REGEX =
  /(authorization|auth|token|password|secret|api[-_]?key)/i

function maskHeaders(
  h: Record<string, unknown> | undefined,
): Record<string, unknown> {
  if (!h || typeof h !== 'object') return h ?? {}
  const out: Record<string, unknown> = {}
  for (const k of Object.keys(h)) {
    const v = h[k]
    if (SENSITIVE_KEYS.has(k.toLowerCase()) || SENSITIVE_REGEX.test(k)) {
      out[k] =
        typeof v === 'string' && v.length > 16
          ? `${(v as string).slice(0, 8)}…(masked)`
          : '***'
    } else {
      out[k] = v
    }
  }
  return out
}

function maskData(data: unknown, depth = 2): unknown {
  if (depth < 0 || data == null) return data
  if (typeof data !== 'object') return data
  if (Array.isArray(data)) return data.map(v => maskData(v, depth - 1))
  const src = data as Record<string, unknown>
  const out: Record<string, unknown> = {}
  for (const k of Object.keys(src)) {
    if (SENSITIVE_KEYS.has(k.toLowerCase()) || SENSITIVE_REGEX.test(k)) {
      out[k] = '***'
    } else {
      out[k] = maskData(src[k], depth - 1)
    }
  }
  return out
}

type RequestConfigWithTs = RequestConfig & { __ts?: number }

export function attachLogging(api: ReturnType<typeof create>): void {
  if (__DEV__ !== true) return

  api.addRequestTransform((config: RequestConfig) => {
    if (!config) return
    ;(config as RequestConfigWithTs).__ts = Date.now()
    console.log(
      '[HTTP][REQUEST]',
      (config.method ?? '').toUpperCase(),
      config.url,
      {
        params: maskData(config.params),
        data: maskData(config.data),
        headers: maskHeaders(config.headers as Record<string, unknown>),
      },
    )
  })

  api.addMonitor((res: ApiResponse) => {
    if (__DEV__ !== true) return
    const config = res.config as RequestConfigWithTs | undefined
    const elapsed =
      config?.__ts != null ? `${Date.now() - config.__ts}ms` : undefined
    if (res.ok) {
      console.log('[HTTP][RESPONSE]', res.status, config?.url, elapsed)
    } else {
      console.log('[HTTP][ERROR]', res.status, config?.url, elapsed, {
        data:
          typeof res.data === 'string'
            ? (res.data as string).slice(0, 200)
            : maskData(res.data),
        headers: maskHeaders(
          (res as { headers?: Record<string, unknown> }).headers,
        ),
      })
    }
  })
}
