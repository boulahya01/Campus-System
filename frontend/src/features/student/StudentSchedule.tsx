import React, { useState } from 'react'
import { useFetch, useAuth } from '../../hooks'
import { examsAPI, enrollmentsAPI } from '../../api/endpoints'

export default function StudentSchedule() {
  const { user } = useAuth()
  const [view, setView] = useState<'classes' | 'exams'>('classes')
  const { data: exams, loading: examsLoading } = useFetch(
    user?.id ? () => examsAPI.list(0, 100) : () => Promise.resolve([]),
    [user?.id]
  )
  const { data: enrollments, loading: enrollmentsLoading } = useFetch(
    user?.id ? () => enrollmentsAPI.list(0, 100) : () => Promise.resolve([]),
    [user?.id]
  )

  const days = ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday']

  return (
    <div className="container">
      <div style={{ marginBottom: 32 }}>
        <h2 style={{ marginBottom: 24 }}>My Schedule</h2>
        <p style={{ margin: 0, color: 'var(--text-secondary)' }}>View your class schedule and exam dates</p>
      </div>

      {/* View Toggle */}
      <div style={{ display: 'flex', gap: 12, marginBottom: 24 }}>
        <button
          onClick={() => setView('classes')}
          style={{
            padding: '8px 16px',
            background: view === 'classes' ? 'var(--primary)' : 'var(--bg-secondary)',
            color: view === 'classes' ? 'white' : 'var(--text-primary)',
            border: 'none',
            borderRadius: 4,
            cursor: 'pointer',
            fontWeight: 500
          }}
        >
          Classes
        </button>
        <button
          onClick={() => setView('exams')}
          style={{
            padding: '8px 16px',
            background: view === 'exams' ? 'var(--primary)' : 'var(--bg-secondary)',
            color: view === 'exams' ? 'white' : 'var(--text-primary)',
            border: 'none',
            borderRadius: 4,
            cursor: 'pointer',
            fontWeight: 500
          }}
        >
          Exams
        </button>
      </div>

      {/* Classes View */}
      {view === 'classes' && (
        <div style={{ background: 'var(--bg-primary)', padding: 24, borderRadius: 8, boxShadow: 'var(--shadow-sm)' }}>
          <h3 style={{ marginTop: 0, marginBottom: 24 }}>Class Schedule</h3>
          {enrollmentsLoading ? (
            <p>Loading schedule...</p>
          ) : Array.isArray(enrollments) && enrollments.length > 0 ? (
            <div style={{ overflowX: 'auto' }}>
              <table style={{ width: '100%' }}>
                <thead>
                  <tr>
                    <th>Module</th>
                    <th>Professor</th>
                    <th>Day</th>
                    <th>Time</th>
                    <th>Location</th>
                  </tr>
                </thead>
                <tbody>
                  {enrollments.map((enrollment: any) => (
                    <tr key={enrollment.id}>
                      <td>{enrollment.module_name || `Module ${enrollment.module_id}`}</td>
                      <td>{enrollment.professor_name || '—'}</td>
                      <td>{enrollment.day || '—'}</td>
                      <td>{enrollment.start_time && enrollment.end_time 
                        ? `${enrollment.start_time} - ${enrollment.end_time}` 
                        : '—'}</td>
                      <td>{enrollment.location || '—'}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          ) : (
            <p style={{ color: 'var(--text-secondary)' }}>No classes scheduled</p>
          )}
        </div>
      )}

      {/* Exams View */}
      {view === 'exams' && (
        <div style={{ background: 'var(--bg-primary)', padding: 24, borderRadius: 8, boxShadow: 'var(--shadow-sm)' }}>
          <h3 style={{ marginTop: 0, marginBottom: 24 }}>Exam Schedule</h3>
          {examsLoading ? (
            <p>Loading exams...</p>
          ) : Array.isArray(exams) && exams.length > 0 ? (
            <div style={{ overflowX: 'auto' }}>
              <table style={{ width: '100%' }}>
                <thead>
                  <tr>
                    <th>Module</th>
                    <th>Date</th>
                    <th>Time</th>
                    <th>Duration</th>
                    <th>Location</th>
                    <th>Status</th>
                  </tr>
                </thead>
                <tbody>
                  {exams.map((exam: any) => (
                    <tr key={exam.id}>
                      <td>{exam.module_name || `Module ${exam.module_id}`}</td>
                      <td>
                        {exam.exam_date 
                          ? new Date(exam.exam_date).toLocaleDateString()
                          : '—'}
                      </td>
                      <td>{exam.start_time || '—'}</td>
                      <td>{exam.duration ? `${exam.duration} min` : '—'}</td>
                      <td>{exam.location || '—'}</td>
                      <td>
                        <span style={{
                          display: 'inline-block',
                          padding: '4px 12px',
                          borderRadius: 4,
                          fontSize: 12,
                          fontWeight: 500,
                          backgroundColor: isUpcoming(exam.exam_date) ? 'var(--warning-bg)' : 'var(--success-bg)',
                          color: isUpcoming(exam.exam_date) ? 'var(--warning)' : 'var(--success)'
                        }}>
                          {isUpcoming(exam.exam_date) ? 'Upcoming' : 'Completed'}
                        </span>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          ) : (
            <p style={{ color: 'var(--text-secondary)' }}>No exams scheduled</p>
          )}
        </div>
      )}

      {/* Upcoming Events Summary */}
      <div style={{ background: 'var(--bg-primary)', padding: 24, borderRadius: 8, boxShadow: 'var(--shadow-sm)', marginTop: 24 }}>
        <h3 style={{ marginTop: 0, marginBottom: 24 }}>Upcoming Events</h3>
        <div style={{ display: 'grid', gap: 12 }}>
          {Array.isArray(exams) && exams.filter((e: any) => isUpcoming(e.exam_date)).slice(0, 3).map((exam: any) => (
            <div key={exam.id} style={{
              padding: 12,
              background: 'var(--bg-secondary)',
              borderLeft: '4px solid var(--warning)',
              borderRadius: 4
            }}>
              <p style={{ margin: 0, fontWeight: 600 }}>{exam.module_name || `Module ${exam.module_id}`}</p>
              <p style={{ margin: 0, marginTop: 4, fontSize: 12, color: 'var(--text-secondary)' }}>
                {exam.exam_date && new Date(exam.exam_date).toLocaleDateString()} at {exam.start_time || '—'}
              </p>
            </div>
          ))}
          {(!Array.isArray(exams) || exams.filter((e: any) => isUpcoming(e.exam_date)).length === 0) && (
            <p style={{ color: 'var(--text-secondary)', margin: 0 }}>No upcoming events</p>
          )}
        </div>
      </div>
    </div>
  )
}

function isUpcoming(dateStr?: string): boolean {
  if (!dateStr) return false
  const examDate = new Date(dateStr)
  const now = new Date()
  return examDate > now
}
