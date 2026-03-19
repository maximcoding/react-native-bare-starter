/**
 * FILE: error.interceptor.ts
 * LAYER: infra/http/interceptors
 * ---------------------------------------------------------------------
 * Normalize response errors into NormalizedError so callers get a stable shape.
 * Uses apisauce addResponseTransform; call sites throw res.originalError.
 * ---------------------------------------------------------------------
 */

import { create } from 'apisauce'
import type { ApiResponse } from '@/shared/services/api/http/http.types'
import { normalizeError } from '@/shared/utils/normalize-error'

export function attachNormalizeError(api: ReturnType<typeof create>): void {
  api.addResponseTransform((res: ApiResponse) => {
    if (!res.ok && res.originalError != null) {
      res.originalError = normalizeError(res.originalError)
    }
  })
}
