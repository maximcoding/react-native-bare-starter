/**
 * FILE: http.client.ts
 * LAYER: infra/http
 * ---------------------------------------------------------------------
 * Centralized HTTP client for all REST traffic using apisauce.
 * All REST adapters and api.* helpers must use ONLY httpClient so that
 * logging, auth, refresh, and error normalization ALWAYS apply.
 *
 * DATA-FLOW:
 *   service → transport / api.X() → httpClient (apisauce)
 *      → request transforms (auth, logging)
 *      → backend
 *      → response transform (normalize originalError)
 *      → async response transform (401 → refresh → retry)
 *      → monitor (log)
 *   Call sites check res.ok and throw res.originalError (or synthetic).
 * ---------------------------------------------------------------------
 */

import { create } from 'apisauce'
// @ts-ignore
import { env } from '@/config/env'
import { attachAuth } from '@/shared/services/api/http/interceptors/auth.interceptor'
import { attachNormalizeError } from '@/shared/services/api/http/interceptors/error.interceptor'
import { attachLogging } from '@/shared/services/api/http/interceptors/logging.interceptor'
import { attachRefreshOn401 } from '@/shared/services/api/http/interceptors/refresh.interceptor'

const BASE_URL = env.API_URL?.trim() ?? ''

export const httpClient = create({
  baseURL: BASE_URL,
  timeout: 15000,
  headers: {
    Accept: 'application/json',
    'Content-Type': 'application/json',
  },
})

attachAuth(httpClient)
attachLogging(httpClient)
attachNormalizeError(httpClient)
attachRefreshOn401(httpClient)

/**
 * Build an error object compatible with normalizeError when apisauce returns
 * res.ok === false but res.originalError is missing.
 */
export function toSyntheticError(res: {
  ok: boolean
  status?: number | null
  data?: unknown
}): { response: { status?: number; data?: unknown }; isAxiosError: true } {
  return {
    response: { status: res.status ?? undefined, data: res.data },
    isAxiosError: true,
  }
}
