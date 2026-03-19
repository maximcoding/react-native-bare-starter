// src/core/ui/toast.ts
import { Alert, Platform, ToastAndroid } from 'react-native'
import {
  type NormalizedError,
  normalizeError,
} from '@/shared/utils/normalize-error'

export function showToast(message: string) {
  if (Platform.OS === 'android') {
    ToastAndroid.show(message, ToastAndroid.SHORT)
  } else {
    Alert.alert('', message)
  }
}

export function showErrorToast(error: unknown) {
  const e: NormalizedError = normalizeError(error)
  showToast(e.message || 'Something went wrong')
}
