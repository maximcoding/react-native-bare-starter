// src/app/hooks/useClipBoard.ts

import Clipboard from '@react-native-clipboard/clipboard'
import { useCallback, useState } from 'react'

export function useClipBoard(initialValue?: string) {
  const [value, setValue] = useState(initialValue ?? '')

  const copy = useCallback((text: string) => {
    Clipboard.setString(text)
    setValue(text)
  }, [])

  const read = useCallback(() => {
    Clipboard.getString().then(setValue)
  }, [])

  return { value, copy, read }
}
