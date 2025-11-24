import { useCallback, useEffect } from 'react'
import { useAuthStore } from '../stores/authStore'
import api from '../api/client'

// Lightweight permission helper for frontend.
// Currently role-based: admin has all rights. Later can be extended to call
// `/api/users/me/permissions` to fetch per-user permissions.
export function useCan() {
  const user = useAuthStore(state => state.user)
  const token = useAuthStore(state => state.token)
  const setAuth = useAuthStore(state => state.setAuth)

  // Fetch authoritative permissions from server once when token exists.
  useEffect(() => {
    if (!token) return
    if (user && Array.isArray(user.permissions)) return
    let mounted = true
    api.get('/users/me/permissions')
      .then(res => {
        if (!mounted) return
        const perms = res.data || []
        const newUser = { ...(user || {}), permissions: perms }
        setAuth(token, newUser)
      })
      .catch(() => {
        // ignore errors; keep fallback role-based checks
      })
    return () => { mounted = false }
  }, [token])

  const can = useCallback((permission?: string) => {
    if (!user) return false
    // Admin shortcut
    if (user.role === 'admin') return true
    // If user has explicit permissions array, check it
    if (Array.isArray(user.permissions) && permission) {
      return user.permissions.includes(permission)
    }
    // Fallback: use role-based defaults
    if (permission) {
      // basic mapping for non-admin flows (students/teachers/registrar)
      if (user.role === 'teacher') {
        return [
          'module:view', 'material:upload', 'exam:create', 'grade:enter', 'grade:update'
        ].includes(permission)
      }
      if (user.role === 'student') {
        return [
          'module:view', 'material:view', 'enrollment:create', 'grade:view'
        ].includes(permission)
      }
      if (user.role === 'registrar') {
        return [
          'semester:create','rattrapage:create','enrollment:approve','transcript:issue'
        ].includes(permission)
      }
    }
    return false
  }, [user])

  return { can }
}

export default useCan
