/**
 * FILE: auth.interceptor.ts
 * LAYER: infra/http/interceptors
 * ---------------------------------------------------------------------
 * Attach Authorization header to outgoing requests when a token is available.
 * Skips for /auth/login, /auth/refresh, and when x-skip-auth is set.
 * ---------------------------------------------------------------------
 */

import { create } from 'apisauce'
import { constants } from '@/config/constants'
import type { RequestConfig } from '@/shared/services/api/http/http.types'
import { kvStorage } from '@/shared/services/storage/mmkv'

function shouldSkipAuth(config: RequestConfig): boolean {
  const url = config.url ?? ''
  const skip = config.headers?.['x-skip-auth'] === '1'
  return skip || url.includes('/auth/login') || url.includes('/auth/refresh')
}

export function attachAuth(api: ReturnType<typeof create>): void {
  api.addRequestTransform((config: RequestConfig) => {
    if (!config) return
    if (shouldSkipAuth(config)) return
    const token = kvStorage.getString(constants.AUTH_TOKEN)
    if (token) {
      config.headers = config.headers ?? {}
      config.headers.Authorization = `Bearer ${token}`
    }
  })
}
