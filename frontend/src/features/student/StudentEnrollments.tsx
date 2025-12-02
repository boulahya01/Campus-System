import React, { useState } from 'react'
import { useFetch, useAuth } from '../../hooks'
import { enrollmentsAPI } from '../../api/endpoints'
import { Button } from '../../components/Button'
import { Modal } from '../../components/Modal'

export default function StudentEnrollments() {
  const { user } = useAuth()
  const { data: enrollments, loading, refetch } = useFetch(
    user?.id ? () => enrollmentsAPI.list(0, 100) : () => Promise.resolve([]),
    [user?.id]
  )
  const [selectedEnrollment, setSelectedEnrollment] = useState<any>(null)

  return (
    <div className="container">
      <div style={{ marginBottom: 32 }}>
        <h2 style={{ marginBottom: 24 }}>My Enrollments</h2>
        <p style={{ margin: 0, color: 'var(--text-secondary)' }}>View and manage your course enrollments</p>
      </div>

      {loading ? (
        <p>Loading enrollments...</p>
      ) : Array.isArray(enrollments) && enrollments.length > 0 ? (
        <div style={{ 
          background: 'var(--bg-primary)', 
          padding: 24, 
          borderRadius: 8, 
          boxShadow: 'var(--shadow-sm)', 
          overflowX: 'auto' 
        }}>
          <table style={{ width: '100%' }}>
            <thead>
              <tr>
                <th>Module</th>
                <th>Code</th>
                <th>Professor</th>
                <th>Semester</th>
                <th>Status</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {enrollments.map((enrollment: any) => (
                <tr key={enrollment.id}>
                  <td>{enrollment.module_name || `Module ${enrollment.module_id}`}</td>
                  <td>{enrollment.module_code || '—'}</td>
                  <td>{enrollment.professor_name || '—'}</td>
                  <td>{enrollment.semester || '—'}</td>
                  <td>
                    <span style={{
                      display: 'inline-block',
                      padding: '4px 12px',
                      borderRadius: 4,
                      fontSize: 12,
                      fontWeight: 500,
                      backgroundColor: enrollment.status === 'active' ? 'var(--success-bg)' : 'var(--bg-secondary)',
                      color: enrollment.status === 'active' ? 'var(--success)' : 'var(--text-secondary)'
                    }}>
                      {enrollment.status || 'Active'}
                    </span>
                  </td>
                  <td>
                    <Button 
                      variant="ghost" 
                      onClick={() => setSelectedEnrollment(enrollment)}
                      style={{ fontSize: 12, padding: '4px 8px' }}
                    >
                      View
                    </Button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      ) : (
        <div style={{ background: 'var(--bg-primary)', padding: 24, borderRadius: 8, boxShadow: 'var(--shadow-sm)', textAlign: 'center' }}>
          <p style={{ color: 'var(--text-secondary)' }}>No enrollments found</p>
          <Button variant="primary">Find Courses to Enroll</Button>
        </div>
      )}

      {selectedEnrollment && (
        <Modal 
          title="Enrollment Details"
          onClose={() => setSelectedEnrollment(null)}
        >
          <div style={{ marginBottom: 16 }}>
            <p style={{ margin: 0, color: 'var(--text-secondary)', fontSize: 12 }}>Module</p>
            <p style={{ margin: 0, marginTop: 4, fontWeight: 600 }}>{selectedEnrollment.module_name || `Module ${selectedEnrollment.module_id}`}</p>
          </div>
          <div style={{ marginBottom: 16 }}>
            <p style={{ margin: 0, color: 'var(--text-secondary)', fontSize: 12 }}>Code</p>
            <p style={{ margin: 0, marginTop: 4 }}>{selectedEnrollment.module_code || '—'}</p>
          </div>
          <div style={{ marginBottom: 16 }}>
            <p style={{ margin: 0, color: 'var(--text-secondary)', fontSize: 12 }}>Professor</p>
            <p style={{ margin: 0, marginTop: 4 }}>{selectedEnrollment.professor_name || '—'}</p>
          </div>
          <div style={{ marginBottom: 16 }}>
            <p style={{ margin: 0, color: 'var(--text-secondary)', fontSize: 12 }}>Status</p>
            <p style={{ margin: 0, marginTop: 4 }}>{selectedEnrollment.status || 'Active'}</p>
          </div>
          <div style={{ marginBottom: 16 }}>
            <p style={{ margin: 0, color: 'var(--text-secondary)', fontSize: 12 }}>Enrolled Date</p>
            <p style={{ margin: 0, marginTop: 4 }}>
              {selectedEnrollment.enrolled_at 
                ? new Date(selectedEnrollment.enrolled_at).toLocaleDateString() 
                : '—'}
            </p>
          </div>
          <div style={{ display: 'flex', gap: 12, marginTop: 24 }}>
            <Button variant="ghost" onClick={() => setSelectedEnrollment(null)}>Close</Button>
          </div>
        </Modal>
      )}
    </div>
  )
}
