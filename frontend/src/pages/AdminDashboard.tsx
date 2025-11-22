import React from 'react'
import { useFetch } from '../hooks'
import { studentsAPI, teachersAPI, modulesAPI } from '../api/endpoints'

export default function AdminDashboard(){
  const { data: students, loading: studentsLoading } = useFetch(
    () => studentsAPI.list(0, 10),
    []
  )
  const { data: teachers, loading: teachersLoading } = useFetch(
    () => teachersAPI.list(0, 10),
    []
  )
  const { data: modules, loading: modulesLoading } = useFetch(
    () => modulesAPI.list(undefined, 0, 10),
    []
  )

  return (
    <div>
      <h2>Admin Dashboard</h2>

      <div style={{ marginTop: '20px', display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '20px' }}>
        <div style={{ border: '1px solid #ddd', padding: '15px', borderRadius: '4px' }}>
          <h3>Students ({studentsLoading ? '...' : (Array.isArray(students) ? students.length : 0)})</h3>
          {studentsLoading ? <p>Loading...</p> : (
            Array.isArray(students) && students.length > 0 ? (
              <ul>
                {students.slice(0, 5).map((s: any) => (
                  <li key={s.id}>{s.cne || s.id} - User ID: {s.user_id}</li>
                ))}
              </ul>
            ) : <p>No students yet</p>
          )}
        </div>

        <div style={{ border: '1px solid #ddd', padding: '15px', borderRadius: '4px' }}>
          <h3>Teachers ({teachersLoading ? '...' : (Array.isArray(teachers) ? teachers.length : 0)})</h3>
          {teachersLoading ? <p>Loading...</p> : (
            Array.isArray(teachers) && teachers.length > 0 ? (
              <ul>
                {teachers.slice(0, 5).map((t: any) => (
                  <li key={t.id}>{t.department || 'N/A'} - User ID: {t.user_id}</li>
                ))}
              </ul>
            ) : <p>No teachers yet</p>
          )}
        </div>

        <div style={{ border: '1px solid #ddd', padding: '15px', borderRadius: '4px', gridColumn: '1 / -1' }}>
          <h3>Modules ({modulesLoading ? '...' : (Array.isArray(modules) ? modules.length : 0)})</h3>
          {modulesLoading ? <p>Loading...</p> : (
            Array.isArray(modules) && modules.length > 0 ? (
              <ul>
                {modules.slice(0, 5).map((m: any) => (
                  <li key={m.id}>{m.code} - {m.name}</li>
                ))}
              </ul>
            ) : <p>No modules yet</p>
          )}
        </div>
      </div>
    </div>
  )
}
