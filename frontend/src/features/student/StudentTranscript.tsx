import React from 'react'
import { useFetch, useAuth } from '../../hooks'
import { gradesAPI, enrollmentsAPI } from '../../api/endpoints'

export default function StudentTranscript() {
  const { user } = useAuth()
  const { data: grades, loading: gradesLoading } = useFetch(
    user?.id ? () => gradesAPI.getStudentGrades(user.id) : () => Promise.resolve([]),
    [user?.id]
  )
  const { data: enrollments } = useFetch(
    user?.id ? () => enrollmentsAPI.list(0, 100) : () => Promise.resolve([]),
    [user?.id]
  )

  const totalCredits = Array.isArray(enrollments)
    ? enrollments.reduce((sum: number, e: any) => sum + (Number(e.credits) || 3), 0)
    : 0

  const gradeArray = Array.isArray(grades) ? grades : []
  const gpa = gradeArray.length > 0
    ? (gradeArray.reduce((sum: number, g: any) => sum + (Number(g.grade) || 0), 0) / gradeArray.length).toFixed(2)
    : '0.00'

  const completedCourses = gradeArray.length
  const enrolledCourses = Array.isArray(enrollments) ? enrollments.length : 0

  return (
    <div className="container">
      <div style={{ marginBottom: 32 }}>
        <h2 style={{ marginBottom: 24 }}>Academic Transcript</h2>
        <p style={{ margin: 0, color: 'var(--text-secondary)' }}>Official record of your academic performance</p>
      </div>

      {/* GPA Summary */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: 24, marginBottom: 32 }}>
        <div style={{ background: 'var(--bg-primary)', padding: 24, borderRadius: 8, boxShadow: 'var(--shadow-sm)' }}>
          <h4 style={{ margin: 0, marginBottom: 12, color: 'var(--text-secondary)', fontSize: 12, fontWeight: 500, textTransform: 'uppercase' }}>GPA</h4>
          <div style={{ fontSize: 32, fontWeight: 700 }}>{gpa}</div>
          <p style={{ margin: 0, marginTop: 4, color: 'var(--text-secondary)', fontSize: 12 }}>Cumulative</p>
        </div>
        <div style={{ background: 'var(--bg-primary)', padding: 24, borderRadius: 8, boxShadow: 'var(--shadow-sm)' }}>
          <h4 style={{ margin: 0, marginBottom: 12, color: 'var(--text-secondary)', fontSize: 12, fontWeight: 500, textTransform: 'uppercase' }}>Credits Earned</h4>
          <div style={{ fontSize: 32, fontWeight: 700 }}>{totalCredits}</div>
          <p style={{ margin: 0, marginTop: 4, color: 'var(--text-secondary)', fontSize: 12 }}>Total</p>
        </div>
        <div style={{ background: 'var(--bg-primary)', padding: 24, borderRadius: 8, boxShadow: 'var(--shadow-sm)' }}>
          <h4 style={{ margin: 0, marginBottom: 12, color: 'var(--text-secondary)', fontSize: 12, fontWeight: 500, textTransform: 'uppercase' }}>Courses Completed</h4>
          <div style={{ fontSize: 32, fontWeight: 700 }}>{completedCourses}</div>
          <p style={{ margin: 0, marginTop: 4, color: 'var(--text-secondary)', fontSize: 12 }}>Graded</p>
        </div>
        <div style={{ background: 'var(--bg-primary)', padding: 24, borderRadius: 8, boxShadow: 'var(--shadow-sm)' }}>
          <h4 style={{ margin: 0, marginBottom: 12, color: 'var(--text-secondary)', fontSize: 12, fontWeight: 500, textTransform: 'uppercase' }}>Enrolled</h4>
          <div style={{ fontSize: 32, fontWeight: 700 }}>{enrolledCourses}</div>
          <p style={{ margin: 0, marginTop: 4, color: 'var(--text-secondary)', fontSize: 12 }}>Active</p>
        </div>
      </div>

      {/* Detailed Grades */}
      <div style={{ background: 'var(--bg-primary)', padding: 24, borderRadius: 8, boxShadow: 'var(--shadow-sm)' }}>
        <h3 style={{ marginTop: 0, marginBottom: 24 }}>Grade History</h3>
        {gradesLoading ? (
          <p>Loading transcript...</p>
        ) : gradeArray.length > 0 ? (
          <div style={{ overflowX: 'auto' }}>
            <table style={{ width: '100%' }}>
              <thead>
                <tr>
                  <th>Module</th>
                  <th>Code</th>
                  <th>Grade</th>
                  <th>Credits</th>
                  <th>Date</th>
                </tr>
              </thead>
              <tbody>
                {gradeArray.map((grade: any) => (
                  <tr key={grade.id}>
                    <td>{grade.module_name || `Module ${grade.module_id}`}</td>
                    <td>{grade.module_code || '—'}</td>
                    <td style={{ fontWeight: 600, color: getGradeColor(Number(grade.grade)) }}>
                      {grade.grade}
                    </td>
                    <td>{grade.credits || 3}</td>
                    <td>{grade.date ? new Date(grade.date).toLocaleDateString() : '—'}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        ) : (
          <p style={{ color: 'var(--text-secondary)' }}>No grades recorded yet</p>
        )}
      </div>

      {/* Grading Scale */}
      <div style={{ background: 'var(--bg-primary)', padding: 24, borderRadius: 8, boxShadow: 'var(--shadow-sm)', marginTop: 24 }}>
        <h4 style={{ marginTop: 0, marginBottom: 16 }}>Grading Scale</h4>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(150px, 1fr))', gap: 12 }}>
          <div style={{ borderLeft: '3px solid var(--success)', paddingLeft: 12 }}>
            <p style={{ margin: 0, fontSize: 12, color: 'var(--text-secondary)' }}>A</p>
            <p style={{ margin: 0, fontWeight: 600 }}>90-100</p>
          </div>
          <div style={{ borderLeft: '3px solid var(--success)', paddingLeft: 12 }}>
            <p style={{ margin: 0, fontSize: 12, color: 'var(--text-secondary)' }}>B</p>
            <p style={{ margin: 0, fontWeight: 600 }}>80-89</p>
          </div>
          <div style={{ borderLeft: '3px solid var(--warning)', paddingLeft: 12 }}>
            <p style={{ margin: 0, fontSize: 12, color: 'var(--text-secondary)' }}>C</p>
            <p style={{ margin: 0, fontWeight: 600 }}>70-79</p>
          </div>
          <div style={{ borderLeft: '3px solid var(--error)', paddingLeft: 12 }}>
            <p style={{ margin: 0, fontSize: 12, color: 'var(--text-secondary)' }}>F</p>
            <p style={{ margin: 0, fontWeight: 600 }}>Below 70</p>
          </div>
        </div>
      </div>
    </div>
  )
}

function getGradeColor(grade: number): string {
  if (grade >= 90) return 'var(--success)'
  if (grade >= 80) return 'var(--success)'
  if (grade >= 70) return 'var(--warning)'
  return 'var(--error)'
}
