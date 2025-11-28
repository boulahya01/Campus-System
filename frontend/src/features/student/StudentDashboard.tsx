import React from 'react'
import { useFetch, useAuth } from '../../hooks'
import { modulesAPI, gradesAPI, enrollmentsAPI } from '../../api/endpoints'
import { Link } from 'react-router-dom'
import { Button } from '../../components/Button'

export default function StudentDashboard() {
  const { user } = useAuth()
  const { data: enrollments, loading: enrollLoading } = useFetch(
    user?.id ? () => enrollmentsAPI.list(0, 10) : () => Promise.resolve([]),
    [user?.id]
  )
  const { data: grades, loading: gradesLoading } = useFetch(
    user?.id ? () => gradesAPI.getStudentGrades(user.id) : () => Promise.resolve([]),
    [user?.id]
  )

  const avgGrade = Array.isArray(grades) && grades.length > 0
    ? (grades.reduce((sum: number, g: any) => sum + (Number(g.grade) || 0), 0) / grades.length).toFixed(2)
    : '—'

  return (
    <div className="container">
      <div style={{ marginBottom: 32 }}>
        <h1 style={{ margin: 0, marginBottom: 8 }}>Welcome, {user?.email}</h1>
        <p style={{ margin: 0, color: 'var(--text-secondary)' }}>Student Portal</p>
      </div>

      {/* Quick Stats */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))', gap: 24, marginBottom: 32 }}>
        <div style={{ background: 'var(--bg-primary)', padding: 24, borderRadius: 8, boxShadow: 'var(--shadow-sm)' }}>
          <h4 style={{ margin: 0, marginBottom: 12, color: 'var(--text-secondary)', fontSize: 14, fontWeight: 500, textTransform: 'uppercase' }}>Enrolled Courses</h4>
          <div style={{ fontSize: 28, fontWeight: 600 }}>{Array.isArray(enrollments) ? enrollments.length : 0}</div>
        </div>
        <div style={{ background: 'var(--bg-primary)', padding: 24, borderRadius: 8, boxShadow: 'var(--shadow-sm)' }}>
          <h4 style={{ margin: 0, marginBottom: 12, color: 'var(--text-secondary)', fontSize: 14, fontWeight: 500, textTransform: 'uppercase' }}>Average Grade</h4>
          <div style={{ fontSize: 28, fontWeight: 600 }}>{avgGrade}</div>
        </div>
        <div style={{ background: 'var(--bg-primary)', padding: 24, borderRadius: 8, boxShadow: 'var(--shadow-sm)' }}>
          <h4 style={{ margin: 0, marginBottom: 12, color: 'var(--text-secondary)', fontSize: 14, fontWeight: 500, textTransform: 'uppercase' }}>Total Grades</h4>
          <div style={{ fontSize: 28, fontWeight: 600 }}>{Array.isArray(grades) ? grades.length : 0}</div>
        </div>
      </div>

      {/* Quick Actions */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: 12, marginBottom: 32 }}>
        <Link to="/courses" style={{ textDecoration: 'none' }}>
          <Button variant="primary" style={{ width: '100%' }}>View Courses</Button>
        </Link>
        <Link to="/grades" style={{ textDecoration: 'none' }}>
          <Button variant="secondary" style={{ width: '100%' }}>My Grades</Button>
        </Link>
        <Link to="/transcript" style={{ textDecoration: 'none' }}>
          <Button variant="ghost" style={{ width: '100%' }}>Transcript</Button>
        </Link>
        <Link to="/schedule" style={{ textDecoration: 'none' }}>
          <Button variant="ghost" style={{ width: '100%' }}>Schedule</Button>
        </Link>
      </div>

      {/* Recent Courses */}
      <div style={{ background: 'var(--bg-primary)', padding: 24, borderRadius: 8, boxShadow: 'var(--shadow-sm)', marginBottom: 32 }}>
        <h3 style={{ marginTop: 0, marginBottom: 24 }}>Enrolled Courses</h3>
        {enrollLoading ? (
          <p>Loading courses...</p>
        ) : Array.isArray(enrollments) && enrollments.length > 0 ? (
          <div style={{ overflowX: 'auto' }}>
            <table style={{ width: '100%' }}>
              <thead>
                <tr>
                  <th>Module</th>
                  <th>Code</th>
                  <th>Professor</th>
                  <th>Status</th>
                </tr>
              </thead>
              <tbody>
                {enrollments.slice(0, 5).map((e: any) => (
                  <tr key={e.id}>
                    <td>{e.module_name || `Module ${e.module_id}`}</td>
                    <td>{e.module_code || '—'}</td>
                    <td>{e.professor_name || '—'}</td>
                    <td style={{ color: e.status === 'active' ? 'var(--success)' : 'var(--text-secondary)' }}>{e.status || 'Active'}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        ) : (
          <p>No enrolled courses yet</p>
        )}
      </div>

      {/* Recent Grades */}
      <div style={{ background: 'var(--bg-primary)', padding: 24, borderRadius: 8, boxShadow: 'var(--shadow-sm)' }}>
        <h3 style={{ marginTop: 0, marginBottom: 24 }}>Recent Grades</h3>
        {gradesLoading ? (
          <p>Loading grades...</p>
        ) : Array.isArray(grades) && grades.length > 0 ? (
          <div style={{ overflowX: 'auto' }}>
            <table style={{ width: '100%' }}>
              <thead>
                <tr>
                  <th>Module</th>
                  <th>Grade</th>
                  <th>Date</th>
                </tr>
              </thead>
              <tbody>
                {grades.slice(0, 5).map((g: any) => (
                  <tr key={g.id}>
                    <td>{g.module_name || `Module ${g.module_id}`}</td>
                    <td style={{ fontWeight: 600 }}>{g.grade}</td>
                    <td>{g.date ? new Date(g.date).toLocaleDateString() : '—'}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        ) : (
          <p>No grades yet</p>
        )}
      </div>
    </div>
  )
}
