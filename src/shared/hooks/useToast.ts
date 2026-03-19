// src/app/hooks/useToast.ts
import { useCallback } from 'react'
import {
  showErrorToast as showErrorToastCore,
  showToast as showToastCore,
} from '@/shared/utils/toast'

export function useToast() {
  const showToast = useCallback((message: string) => {
    showToastCore(message)
  }, [])

  const showErrorToast = useCallback((error: unknown) => {
    showErrorToastCore(error)
  }, [])

  return { showToast, showErrorToast }
}
