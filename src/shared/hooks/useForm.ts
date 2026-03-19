// src/app/hooks/useForm.ts
import { useCallback, useState } from 'react'

export function useForm<T extends Record<string, unknown>>(
  initialValues: T,
  options?: {
    validate?: (values: T) => Partial<Record<keyof T, string>>
    onSubmit?: (values: T) => void | Promise<void>
  },
) {
  const [values, setValues] = useState<T>(initialValues)
  const [errors, setErrors] = useState<Partial<Record<keyof T, string>>>({})
  const [touched, setTouched] = useState<Partial<Record<keyof T, boolean>>>({})

  const setValue = useCallback(<K extends keyof T>(field: K, value: T[K]) => {
    setValues(v => ({ ...v, [field]: value }))
    setErrors(e => {
      const next = { ...e }
      delete next[field]
      return next
    })
  }, [])

  const setTouchedField = useCallback((field: keyof T) => {
    setTouched(t => ({ ...t, [field]: true }))
  }, [])

  const validate = useCallback(() => {
    const nextErrors = options?.validate?.(values) ?? {}
    setErrors(nextErrors)
    return Object.keys(nextErrors).length === 0
  }, [values, options])

  const handleSubmit = useCallback(
    async (e?: { preventDefault?: () => void }) => {
      e?.preventDefault?.()
      const valid = validate()
      if (!valid) return
      await options?.onSubmit?.(values)
    },
    [values, validate, options],
  )

  const reset = useCallback(() => {
    setValues(initialValues)
    setErrors({})
    setTouched({})
  }, [initialValues])

  return {
    values,
    errors,
    touched,
    setValue,
    setValues,
    setTouched: setTouchedField,
    validate,
    handleSubmit,
    reset,
  }
}
