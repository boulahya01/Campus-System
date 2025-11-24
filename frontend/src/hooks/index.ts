import { useState, useEffect } from 'react'
import type { ChangeEvent, FormEvent } from 'react'
import { useAuthStore } from '../stores/authStore'

export function useFetch<T>(fn: () => Promise<any>, dependencies: any[] = []) {
  const [data, setData] = useState<T | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    let cancelled = false
    setLoading(true)
    setError(null)
    fn()
      .then(res => {
        if (!cancelled) {
          setData(res.data)
          setLoading(false)
        }
      })
      .catch(err => {
        if (!cancelled) {
          setError(err?.response?.data?.detail || err.message)
          setLoading(false)
        }
      })
    return () => {
      cancelled = true
    }
  }, dependencies)

  return { data, loading, error }
}

export function useForm(initialValues: any, onSubmit: (values: any) => Promise<void>) {
  const [values, setValues] = useState(initialValues)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const handleChange = (e: ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target
    setValues(prev => ({ ...prev, [name]: value }))
  }

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault()
    setLoading(true)
    setError(null)
    try {
      await onSubmit(values)
      setValues(initialValues)
    } catch (err: any) {
      setError(err?.response?.data?.detail || err.message)
    } finally {
      setLoading(false)
    }
  }

  return { values, handleChange, handleSubmit, loading, error, setError }
}

export function useAuth() {
  const token = useAuthStore(state => state.token)
  const user = useAuthStore(state => state.user)
  return { token, user, isAuthenticated: !!token }
}
