// src/app/hooks/useKeyboard.ts
import { useEffect, useState } from 'react'
import { Keyboard, type KeyboardEvent } from 'react-native'

export function useKeyboard() {
  const [visible, setVisible] = useState(false)
  const [height, setHeight] = useState(0)

  useEffect(() => {
    const show = (e: KeyboardEvent) => {
      setVisible(true)
      setHeight(e.endCoordinates.height)
    }
    const hide = () => {
      setVisible(false)
      setHeight(0)
    }

    const showSub = Keyboard.addListener('keyboardDidShow', show)
    const hideSub = Keyboard.addListener('keyboardDidHide', hide)
    return () => {
      showSub.remove()
      hideSub.remove()
    }
  }, [])

  return { visible, height, dismiss: Keyboard.dismiss }
}
