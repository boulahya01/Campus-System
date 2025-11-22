import { create } from 'zustand'

type AuthState = {
  token: string | null
  user: any | null
  setAuth: (token:string|null, user:any|null) => void
  clearAuth: () => void
}

export const useAuthStore = create<AuthState>((set) => ({
  token: localStorage.getItem('access_token'),
  user: JSON.parse(localStorage.getItem('user') || 'null'),
  setAuth: (token, user) => set(() => { localStorage.setItem('access_token', token || ''); localStorage.setItem('user', JSON.stringify(user || {})); return {token, user} }),
  clearAuth: () => set(() => { localStorage.removeItem('access_token'); localStorage.removeItem('user'); return { token: null, user: null } })
}))
