/**
 * FILE: api.ts
 * LAYER: infra/http
 * ---------------------------------------------------------------------
 * PURPOSE:
 *   Thin helper wrapper around httpClient (apisauce) for simple REST-style calls.
 *   Used only for trivial GET/POST/PUT/DELETE cases. All complex flows
 *   must use transport + REST adapter to preserve offline & multi-adapter
 *   capabilities.
 *
 * RESPONSIBILITIES:
 *   - Provide apiGet/apiPost/apiPut/apiDelete helpers.
 *   - Throw on !res.ok so callers receive NormalizedError (from response transform).
 *   - Serve as lightweight alternative to transport when offline behavior
 *     is not required (e.g., unauthenticated endpoints, static endpoints).
 *
 * DATA-FLOW:
 *   service → api.X()
 *      → httpClient (apisauce) → request/response transforms → backend
 *   On failure, we throw res.originalError or synthetic; global normalization
 *   happens in QueryClient (QueryCache/MutationCache).
 *
 * EXTENSION GUIDELINES:
 *   - Do NOT use for domain logic requiring offline queue or adapter routing.
 *   - Keep helpers thin — no retries/backoff.
 *   - Use only for simple classical REST endpoints.
 * ---------------------------------------------------------------------
 */
import {
  httpClient,
  toSyntheticError,
} from '@/shared/services/api/http/http.client'

async function apiRequest<TResponse>(
  method: 'GET' | 'POST' | 'PUT' | 'DELETE',
  path: string,
  options?: {
    params?: Record<string, unknown>
    body?: unknown
  },
): Promise<TResponse> {
  let res

  switch (method) {
    case 'GET':
      res = await httpClient.get<TResponse>(
        path,
        options?.params as Record<string, string>,
      )
      break

    case 'POST':
      res = await httpClient.post<TResponse>(path, options?.body)
      break

    case 'PUT':
      res = await httpClient.put<TResponse>(path, options?.body)
      break

    case 'DELETE':
      res = await httpClient.delete<TResponse>(
        path,
        options?.params as Record<string, string>,
      )
      break

    default:
      throw new Error(`Unsupported method: ${method}`)
  }

  if (!res.ok) {
    throw res.originalError ?? toSyntheticError(res)
  }
  return res.data as TResponse
}

export async function apiGet<TResponse = unknown>(
  path: string,
  params?: Record<string, unknown>,
): Promise<TResponse> {
  return apiRequest<TResponse>('GET', path, { params })
}

export async function apiPost<TResponse = unknown, TBody = unknown>(
  path: string,
  body?: TBody,
): Promise<TResponse> {
  return apiRequest<TResponse>('POST', path, { body })
}

export async function apiPut<TResponse = unknown, TBody = unknown>(
  path: string,
  body?: TBody,
): Promise<TResponse> {
  return apiRequest<TResponse>('PUT', path, { body })
}

export async function apiDelete<TResponse = unknown>(
  path: string,
  params?: Record<string, unknown>,
): Promise<TResponse> {
  return apiRequest<TResponse>('DELETE', path, { params })
}
