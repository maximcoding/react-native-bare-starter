// src/infra/error/normalize-error.ts
/**
 * FILE: normalize-error.ts
 * LAYER: infra/error
 * ---------------------------------------------------------------------
 * PURPOSE:
 *   Convert ANY error shape (Axios, GraphQL, Firebase, Zod, JS Error,
 *   network offline, or custom code) into a unified NormalizedError.
 *
 * WHY:
 *   - UI and services must never guess error structure.
 *   - Prevent "cannot read property 'message'" crashes.
 *   - Provide stable error.code, error.message, error.status for all layers.
 *
 * RESPONSIBILITIES:
 *   - Map unknown → NormalizedError.
 *   - Extract best-possible message for user-facing errors.
 *   - Preserve raw for logging/analytics.
 *
 * SUPPORTED SOURCES:
 *   - AxiosError / apisauce synthetic (response.status, response.data)
 *   - Apisauce response shape (ok === false, status, data)
 *   - GraphQL error arrays
 *   - FirebaseError
 *   - ZodError
 *   - Network offline errors
 *   - Native JS Error
 *
 * EXTENSION:
 *   - Add backend/business-level mapping: map code → domain codes.
 *   - Add translations: map code → localized messages.
 *   - Add telemetry hooks: log normalized errors to Sentry/Datadog.
 * ---------------------------------------------------------------------
 */

import { ZodError, type ZodIssue } from 'zod'

export type NormalizedError = {
  code: string | null // machine code (e.g. "AUTH_INVALID", "NETWORK_OFFLINE")
  message: string // human-readable message
  status?: number // HTTP code (if present)
  raw: unknown // original error for debugging/logging
}

/**
 * Guard: check if a value already matches the NormalizedError shape.
 * This makes normalizeError() idempotent (safe to call multiple times).
 */
function isNormalizedError(x: any): x is NormalizedError {
  return (
    x &&
    typeof x === 'object' &&
    typeof x.message === 'string' &&
    'raw' in x &&
    'code' in x
  )
}

/**
 * Extract human-readable message from different possible shapes.
 */
function formatZodIssues(issues: ZodIssue[]): string {
  if (issues.length === 0) {
    return 'Validation failed'
  }
  return issues
    .map(i => {
      const path = i.path.length > 0 ? `${i.path.map(String).join('.')}: ` : ''
      return `${path}${i.message}`
    })
    .join('; ')
}

function extractMessage(e: any): string {
  // GraphQL
  if (Array.isArray(e?.graphQLErrors) && e.graphQLErrors.length > 0) {
    return e.graphQLErrors[0].message ?? 'GraphQL error'
  }

  // Axios / apisauce synthetic
  if (e?.response?.data?.message) return e.response.data.message
  if (e?.response?.data?.error) return e.response.data.error

  // Apisauce response shape (when thrown directly)
  if (e?.ok === false && e?.data) {
    const d = e.data as Record<string, unknown>
    if (typeof d?.message === 'string') return d.message
    if (typeof d?.error === 'string') return d.error
  }

  // Zod v3/v4 — prefer `issues` (default `.message` is a raw JSON-ish string)
  if (e instanceof ZodError) {
    return formatZodIssues(e.issues)
  }
  if (Array.isArray(e?.issues) && e.issues.length > 0) {
    return formatZodIssues(e.issues as ZodIssue[])
  }

  // Legacy Zod-style `errors` array
  if (e?.errors && Array.isArray(e.errors)) {
    return e.errors.map((z: any) => z.message).join(', ')
  }

  // API body: array of { message } (common validation responses)
  if (Array.isArray(e?.response?.data) && e.response.data.length > 0) {
    const first = e.response.data[0] as Record<string, unknown>
    if (typeof first?.message === 'string') return first.message
  }

  // Firebase / JS Error
  if (e?.message && typeof e.message === 'string') {
    const m = e.message
    // Zod sometimes surfaces only via .message — avoid dumping JSON-like blobs in UI
    if (m.trimStart().startsWith('[') && m.includes('expected')) {
      return 'Invalid response from server. Try again or use mock API in development.'
    }
    return m
  }

  // Fallback
  return typeof e?.message === 'string' ? e.message : 'Unknown error'
}

/**
 * Extract machine-readable error code if available.
 */
function extractCode(e: any): string | null {
  return (
    e?.code ??
    e?.response?.data?.code ??
    e?.data?.code ??
    e?.graphQLErrors?.[0]?.extensions?.code ??
    null
  )
}

/**
 * Extract HTTP status code when applicable.
 */
function extractStatus(e: any): number | undefined {
  return e?.status ?? e?.response?.status
}

/**
 * Detect offline / no-internet type errors across different sources.
 * This is intentionally conservative and can be expanded later.
 */
function isOfflineErrorLike(e: any): boolean {
  const code = e?.code
  const msg = typeof e?.message === 'string' ? e.message : ''

  // Our own explicit code
  if (code === 'NETWORK_OFFLINE') return true

  // Transport offline error message (your transport throws this)
  if (msg.startsWith('Offline:')) return true

  // Common network messages (axios/fetch)
  if (msg === 'Network Error' || msg === 'Failed to fetch') return true

  // Axios: no response usually means network-level failure
  if (e?.isAxiosError && !e?.response) return true

  return false
}

/**
 * Normalize ANY error shape to consistent NormalizedError.
 */
export function normalizeError(error: unknown): NormalizedError {
  // ✅ Idempotent: if already normalized, keep as-is
  if (isNormalizedError(error)) return error

  if (error instanceof ZodError) {
    return {
      code: 'VALIDATION_ERROR',
      message: formatZodIssues(error.issues),
      raw: error,
    }
  }

  // string thrown
  if (typeof error === 'string') {
    const offline = error.startsWith('Offline:') || error === 'Offline'
    return {
      code: offline ? 'NETWORK_OFFLINE' : null,
      message: offline ? 'No internet connection' : error,
      raw: error,
    }
  }

  // Native JS Error (also covers many library errors)
  if (error instanceof Error) {
    const e: any = error

    // OFFLINE detection has priority
    if (isOfflineErrorLike(e)) {
      return {
        code: 'NETWORK_OFFLINE',
        message: 'No internet connection',
        raw: error,
      }
    }

    return {
      code: extractCode(e),
      message: extractMessage(e),
      status: extractStatus(e),
      raw: error,
    }
  }

  // Unknown object (common in axios + graphql errors)
  const e: any = error ?? {}

  // OFFLINE detection for non-Error shapes
  if (isOfflineErrorLike(e)) {
    return {
      code: 'NETWORK_OFFLINE',
      message: 'No internet connection',
      raw: error,
    }
  }

  return {
    code: extractCode(e),
    message: extractMessage(e),
    status: extractStatus(e),
    raw: error,
  }
}
