/**
 * FILE: refresh.interceptor.ts
 * LAYER: infra/http/interceptors
 * ---------------------------------------------------------------------
 * On 401, refresh token once and retry; queue concurrent requests.
 * Uses apisauce addAsyncResponseTransform. Skips for /auth/login, /auth/refresh, x-skip-refresh.
 * ---------------------------------------------------------------------
 */

import { create } from 'apisauce'
import { constants } from '@/config/constants'
import { performLogout } from '@/session/logout'
import { getSessionQueryClient } from '@/session/session-bridge'
import type {
  ApiResponse,
  RequestConfig,
} from '@/shared/services/api/http/http.types'
import { isOffline } from '@/shared/services/api/network/netinfo'
import { kvStorage } from '@/shared/services/storage/mmkv'

type RefreshResponse = { token: string; refreshToken?: string }

let isRefreshing = false
const waitQueue: Array<{
  response: ApiResponse
  config: RequestConfig
  resolve: () => void
}> = []

function enqueue(item: {
  response: ApiResponse
  config: RequestConfig
  resolve: () => void
}): void {
  waitQueue.push(item)
}

function copyResponse(target: ApiResponse, source: ApiResponse): void {
  target.ok = source.ok
  target.status = source.status
  target.problem = source.problem
  target.data = source.data
  target.originalError = source.originalError
  target.headers = source.headers
}

function shouldSkipRefresh(config?: RequestConfig): boolean {
  if (!config) return true
  const url = config.url ?? ''
  const skip = config.headers?.['x-skip-refresh'] === '1'
  return skip || url.includes('/auth/login') || url.includes('/auth/refresh')
}

async function doRefresh(
  api: ReturnType<typeof create>,
): Promise<string | null> {
  if (isOffline()) return null
  const refreshToken = kvStorage.getString(constants.REFRESH_TOKEN)
  if (!refreshToken) return null
  const res = await api.post<RefreshResponse>(
    '/auth/refresh',
    { refreshToken },
    { headers: { 'x-skip-auth': '1', 'x-skip-refresh': '1' } } as any,
  )
  if (!res.ok || !res.data) return null
  const body = res.data as RefreshResponse
  if (!body.token) return null
  kvStorage.setString(constants.AUTH_TOKEN, body.token)
  if (body.refreshToken)
    kvStorage.setString(constants.REFRESH_TOKEN, body.refreshToken)
  return body.token
}

async function resolveQueue(
  api: ReturnType<typeof create>,
  newToken: string | null,
): Promise<void> {
  const items = [...waitQueue]
  waitQueue.length = 0
  for (const item of items) {
    if (newToken) {
      const headers = {
        ...item.config.headers,
        Authorization: `Bearer ${newToken}`,
      }
      const retryRes = (await api.any({
        ...item.config,
        headers,
      } as any)) as ApiResponse
      copyResponse(item.response, retryRes)
    }
    item.resolve()
  }
}

export function attachRefreshOn401(api: ReturnType<typeof create>): void {
  api.addAsyncResponseTransform(async (response: ApiResponse) => {
    if (response.ok || response.status !== 401) return
    const config = response.config
    if (!config || config._retry === true || shouldSkipRefresh(config)) return

    config._retry = true

    if (isRefreshing) {
      await new Promise<void>(resolve => {
        enqueue({ response, config, resolve })
      })
      return
    }

    isRefreshing = true
    const newToken = await doRefresh(api).finally(() => {
      isRefreshing = false
    })

    if (!newToken) {
      await performLogout(getSessionQueryClient() ?? undefined)
      await resolveQueue(api, null)
      return
    }

    const retryRes = (await api.any({
      ...config,
      headers: { ...config.headers, Authorization: `Bearer ${newToken}` },
    } as any)) as ApiResponse
    copyResponse(response, retryRes)
    await resolveQueue(api, newToken)
  })
}
