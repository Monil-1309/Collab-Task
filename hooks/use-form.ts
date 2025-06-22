"use client"

import { useState } from "react"

interface ValidationRule {
  required?: boolean
  minLength?: number
  maxLength?: number
  pattern?: RegExp
  custom?: (value: any) => string | null
}

interface FormConfig<T> {
  initialValues: T
  validationRules?: Partial<Record<keyof T, ValidationRule>>
}

export function useForm<T extends Record<string, any>>({ initialValues, validationRules = {} }: FormConfig<T>) {
  const [values, setValues] = useState<T>(initialValues)
  const [errors, setErrors] = useState<Partial<Record<keyof T, string>>>({})
  const [touched, setTouched] = useState<Partial<Record<keyof T, boolean>>>({})

  const validateField = (name: keyof T, value: any): string | null => {
    const rules = validationRules[name]
    if (!rules) return null

    if (rules.required && (!value || value.toString().trim() === "")) {
      return `${String(name)} is required`
    }

    if (rules.minLength && value.toString().length < rules.minLength) {
      return `${String(name)} must be at least ${rules.minLength} characters`
    }

    if (rules.maxLength && value.toString().length > rules.maxLength) {
      return `${String(name)} must be no more than ${rules.maxLength} characters`
    }

    if (rules.pattern && !rules.pattern.test(value.toString())) {
      return `${String(name)} format is invalid`
    }

    if (rules.custom) {
      return rules.custom(value)
    }

    return null
  }

  const setValue = (name: keyof T, value: any) => {
    setValues((prev) => ({ ...prev, [name]: value }))

    if (touched[name]) {
      const error = validateField(name, value)
      setErrors((prev) => ({ ...prev, [name]: error || undefined }))
    }
  }

  const setFieldTouched = (name: keyof T) => {
    setTouched((prev) => ({ ...prev, [name]: true }))
    const error = validateField(name, values[name])
    setErrors((prev) => ({ ...prev, [name]: error || undefined }))
  }

  const validateAll = (): boolean => {
    const newErrors: Partial<Record<keyof T, string>> = {}
    let isValid = true

    Object.keys(validationRules).forEach((key) => {
      const fieldName = key as keyof T
      const error = validateField(fieldName, values[fieldName])
      if (error) {
        newErrors[fieldName] = error
        isValid = false
      }
    })

    setErrors(newErrors)
    setTouched(
      Object.keys(validationRules).reduce(
        (acc, key) => ({
          ...acc,
          [key]: true,
        }),
        {},
      ),
    )

    return isValid
  }

  const reset = () => {
    setValues(initialValues)
    setErrors({})
    setTouched({})
  }

  return {
    values,
    errors,
    touched,
    setValue,
    setFieldTouched,
    validateAll,
    reset,
    isValid: Object.keys(errors).length === 0,
  }
}
