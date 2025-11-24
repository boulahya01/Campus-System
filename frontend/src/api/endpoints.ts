import api from './client'

export const authAPI = {
  login: (email: string, password: string) =>
    api.post('/auth/login', { email, password }),
  register: (email: string, password: string, role: string = 'student') =>
    api.post('/auth/register', { email, password, role }),
  refresh: (refreshToken: string) =>
    api.post('/auth/refresh', { refresh_token: refreshToken }),
}

export const usersAPI = {
  getMe: () => api.get('/users/me'),
  getUser: (id: number) => api.get(`/users/${id}`),
  listUsers: () => api.get('/users/'),
}

export const studentsAPI = {
  list: (skip: number = 0, limit: number = 100) =>
    api.get(`/students/?skip=${skip}&limit=${limit}`),
  get: (id: number) => api.get(`/students/${id}`),
  create: (data: any) => api.post('/students/', data),
  update: (id: number, data: any) => api.put(`/students/${id}`, data),
}

export const modulesAPI = {
  list: (semesterId?: number, skip: number = 0, limit: number = 100) =>
    semesterId
      ? api.get(`/modules/?semester_id=${semesterId}&skip=${skip}&limit=${limit}`)
      : api.get(`/modules/?skip=${skip}&limit=${limit}`),
  get: (id: number) => api.get(`/modules/${id}`),
  create: (data: any) => api.post('/modules/', data),
}

export const materialsAPI = {
  listByModule: (moduleId: number) =>
    api.get(`/modules/${moduleId}`),
  upload: (moduleId: number, file: File, title?: string) => {
    const formData = new FormData()
    formData.append('file', file)
    if (title) formData.append('title', title)
    return api.post(`/modules/${moduleId}/upload`, formData, {
      headers: { 'Content-Type': 'multipart/form-data' },
    })
  },
}

export const announcementsAPI = {
  list: (skip: number = 0, limit: number = 100) =>
    api.get(`/announcements/?skip=${skip}&limit=${limit}`),
  get: (id: number) => api.get(`/announcements/${id}`),
  create: (data: any) => api.post('/announcements/', data),
}

export const examsAPI = {
  list: (skip: number = 0, limit: number = 100) =>
    api.get(`/exams/?skip=${skip}&limit=${limit}`),
  get: (id: number) => api.get(`/exams/${id}`),
  create: (data: any) => api.post('/exams/', data),
}

export const gradesAPI = {
  getStudentGrades: (studentId: number) =>
    api.get(`/grades/student/${studentId}`),
  create: (data: any) => api.post('/grades/', data),
}

export const requestsAPI = {
  list: () => api.get('/requests/'),
  create: (data: any) => api.post('/requests/', data),
}

export const majorsAPI = {
  list: (skip: number = 0, limit: number = 100) =>
    api.get(`/majors/?skip=${skip}&limit=${limit}`),
  get: (id: number) => api.get(`/majors/${id}`),
  create: (data: any) => api.post('/majors/', data),
}

export const semestersAPI = {
  list: (skip: number = 0, limit: number = 100) =>
    api.get(`/semesters/?skip=${skip}&limit=${limit}`),
  get: (id: number) => api.get(`/semesters/${id}`),
  create: (data: any) => api.post('/semesters/', data),
}

export const teachersAPI = {
  list: (skip: number = 0, limit: number = 100) =>
    api.get(`/teachers/?skip=${skip}&limit=${limit}`),
  get: (id: number) => api.get(`/teachers/${id}`),
  create: (data: any) => api.post('/teachers/', data),
}
