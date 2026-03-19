// src/infra/transport/adapters/rest.adapter.ts
/**
 * FILE: rest.adapter.ts
 * LAYER: infra/transport/adapters
 * ---------------------------------------------------------------------
 * PURPOSE:
 *   Implement Transport interface using REST-style HTTP endpoints
 *   on top of httpClient (apisauce).
 *
 * NOTES:
 *   - Operations are typed (Operation), so every op must be declared in OPS.
 *   - ROUTES maps ops to real REST endpoints (GET/PUT/etc).
 *   - Fallback keeps legacy behavior: GET/POST /{operation} for ops that exist in OPS.
 *   - On !res.ok we throw res.originalError or synthetic so callers get NormalizedError.
 * ---------------------------------------------------------------------
 */

import {
  httpClient,
  toSyntheticError,
} from '@/shared/services/api/http/http.client'
import type { Operation } from '@/shared/services/api/transport/operations'
import { OPS } from '@/shared/services/api/transport/operations'
import type {
  Transport,
  TransportRequestMeta,
} from '@/shared/services/api/transport/transport.types'

type HttpMethod = 'GET' | 'POST' | 'PUT' | 'PATCH' | 'DELETE'

type Route = {
  method: HttpMethod
  path: string
}

const ROUTES: Partial<Record<Operation, Route>> = {
  [OPS.AUTH_SESSION]: { method: 'GET', path: '/auth/session' },
  [OPS.USER_ME]: { method: 'GET', path: '/me' },
  [OPS.USER_PROFILE]: { method: 'GET', path: '/user/profile' },
  [OPS.USER_UPDATE_PROFILE]: { method: 'PUT', path: '/me' },

  [OPS.AUTH_LOGIN]: { method: 'POST', path: '/auth/login' },
  [OPS.AUTH_REFRESH]: { method: 'POST', path: '/auth/refresh' },
}

function resolveRoute(
  kind: 'query' | 'mutate' | 'upload',
  operation: Operation,
): Route {
  const mapped = ROUTES[operation]
  if (mapped) return mapped

  // fallback for ops that exist in OPS but are not mapped yet
  if (kind === 'query') return { method: 'GET', path: `/${operation}` }
  return { method: 'POST', path: `/${operation}` }
}

export const restAdapter: Transport = {
  async query<TResponse = unknown, TVariables = unknown>(
    operation: Operation,
    variables?: TVariables,
    _meta?: TransportRequestMeta,
  ): Promise<TResponse> {
    const { method, path } = resolveRoute('query', operation)

    const res = await httpClient.any<TResponse>({
      method,
      url: path,
      params:
        method === 'GET' ? (variables as Record<string, string>) : undefined,
      data:
        method !== 'GET' ? (variables as Record<string, unknown>) : undefined,
    })

    if (!res.ok) {
      throw res.originalError ?? toSyntheticError(res)
    }
    return res.data as TResponse
  },

  async mutate<TResponse = unknown, TVariables = unknown>(
    operation: Operation,
    variables?: TVariables,
    _meta?: TransportRequestMeta,
  ): Promise<TResponse> {
    const { method, path } = resolveRoute('mutate', operation)

    const res = await httpClient.any<TResponse>({
      method,
      url: path,
      data: variables as Record<string, unknown>,
    })

    if (!res.ok) {
      throw res.originalError ?? toSyntheticError(res)
    }
    return res.data as TResponse
  },

  subscribe<TData = unknown>(
    _channel: string,
    _handler: (data: TData) => void,
    _meta?: TransportRequestMeta,
  ) {
    return () => {}
  },

  async upload<TResponse = unknown>(
    operation: Operation,
    payload: { file: unknown; extra?: Record<string, unknown> },
    _meta?: TransportRequestMeta,
  ): Promise<TResponse> {
    const { path } = resolveRoute('upload', operation)

    const form = new FormData()

    if (payload.file != null) {
      form.append('file', payload.file as any)
    }

    if (payload.extra) {
      for (const [k, v] of Object.entries(payload.extra)) {
        form.append(k, String(v))
      }
    }

    const res = await httpClient.post<TResponse>(path, form, {
      headers: { 'Content-Type': 'multipart/form-data' },
    })

    if (!res.ok) {
      throw res.originalError ?? toSyntheticError(res)
    }
    return res.data as TResponse
  },
}
