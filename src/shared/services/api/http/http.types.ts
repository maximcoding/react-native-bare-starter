/**
 * FILE: http.types.ts
 * LAYER: infra/http
 * ---------------------------------------------------------------------
 * Shared request/response shapes for apisauce transforms. No transport-specific types.
 * ---------------------------------------------------------------------
 */

export type RequestConfig = {
  url?: string
  method?: string
  headers?: Record<string, string>
  params?: Record<string, unknown>
  data?: unknown
  _retry?: boolean
}

export type ApiResponse = {
  ok: boolean
  status?: number | null
  problem?: string | null
  data?: unknown
  originalError?: unknown
  headers?: unknown
  config?: RequestConfig
  duration?: number
}
