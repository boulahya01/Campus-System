/* Small TypeScript API client wrapper (moved from project root)
   Provides a lightweight ApiClient class for direct usage when desired.
*/
import axios, { AxiosInstance } from 'axios'

export interface AuthTokens {
  access_token: string
  refresh_token?: string
}

export default class ApiClient {
  api: AxiosInstance
  accessToken: string | null = null

  constructor(opts: { baseURL: string }) {
    this.api = axios.create({ baseURL: opts.baseURL })
  }

  setAuthHeader(token: string | null) {
    this.accessToken = token
    if (token) this.api.defaults.headers.common['Authorization'] = `Bearer ${token}`
    else delete this.api.defaults.headers.common['Authorization']
  }

  async login(email: string, password: string) {
    const r = await this.api.post('/api/auth/login', { email, password })
    const data = r.data
    if (data && data.access_token) {
      this.setAuthHeader(data.access_token)
      return data as AuthTokens
    }
    throw new Error('Login failed')
  }

  async register(email: string, password: string, role: string = 'student') {
    const r = await this.api.post('/api/auth/register', { email, password, role })
    return r.data
  }

  async refresh(refreshToken?: string) {
    const params = refreshToken ? { refresh_token: refreshToken } : undefined
    const r = await this.api.post('/api/auth/refresh', null, { params })
    const data = r.data
    if (data && data.access_token) {
      this.setAuthHeader(data.access_token)
      return data as AuthTokens
    }
    throw new Error('Refresh failed')
  }

  async getMe() {
    const r = await this.api.get('/api/users/me')
    return r.data
  }

  async listModules(semester_id?: number) {
    const params = semester_id ? { semester_id } : undefined
    const r = await this.api.get('/api/modules/', { params })
    return r.data
  }

  async createModule(payload: { code: string; name: string; semester_id?: number }) {
    const r = await this.api.post('/api/modules/', payload)
    return r.data
  }

  async uploadMaterial(moduleId: number, file: File, title?: string) {
    const form = new FormData()
    form.append('file', file)
    if (title) form.append('title', title)

    const headers: Record<string,string> = {}
    if (this.accessToken) headers['Authorization'] = `Bearer ${this.accessToken}`

    const resp = await fetch(`${this.api.defaults.baseURL}/api/modules/${moduleId}/upload`, {
      method: 'POST',
      headers,
      body: form,
      credentials: 'include',
    })
    if (!resp.ok) throw new Error(`Upload failed: ${resp.status}`)
    return await resp.json()
  }

  async listMaterials(moduleId: number) {
    const r = await this.api.get(`/api/modules/${moduleId}`)
    return r.data
  }

  async downloadMaterial(materialId: number) {
    const r = await this.api.get(`/api/materials/${materialId}/download`)
    const body = r.data
    if (body && body.url) return body.url
    const downloadResp = await fetch(`${this.api.defaults.baseURL}/api/materials/${materialId}/download`, {
      headers: this.accessToken ? { Authorization: `Bearer ${this.accessToken}` } : undefined,
    })
    if (!downloadResp.ok) throw new Error('Download failed')
    const blob = await downloadResp.blob()
    return URL.createObjectURL(blob)
  }
}
