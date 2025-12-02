import React, { useState } from 'react'
import { useAuth } from '../../hooks'
import { Button } from '../../components/Button'
import { useForm } from '../../hooks'
import { Modal } from '../../components/Modal'
import axios from 'axios'

export default function StudentProfile() {
  const { user } = useAuth()
  const [showChangePassword, setShowChangePassword] = useState(false)
  const [message, setMessage] = useState<{ type: 'success' | 'error', text: string } | null>(null)
  const { formData: pwData, handleInputChange: handlePwChange } = useForm({
    current_password: '',
    new_password: '',
    confirm_password: ''
  })

  const handlePasswordChange = async (e: React.FormEvent) => {
    e.preventDefault()
    if (pwData.new_password !== pwData.confirm_password) {
      setMessage({ type: 'error', text: 'Passwords do not match' })
      return
    }
    try {
      await axios.put('/api/users/change-password', {
        current_password: pwData.current_password,
        new_password: pwData.new_password
      })
      setMessage({ type: 'success', text: 'Password changed successfully' })
      setShowChangePassword(false)
    } catch (err: any) {
      setMessage({ type: 'error', text: err.response?.data?.detail || 'Failed to change password' })
    }
  }

  return (
    <div className="container">
      <div style={{ marginBottom: 32 }}>
        <h2 style={{ marginBottom: 24 }}>My Profile</h2>
        <p style={{ margin: 0, color: 'var(--text-secondary)' }}>Manage your account information</p>
      </div>

      {message && (
        <div style={{
          padding: 12,
          marginBottom: 24,
          borderRadius: 4,
          background: message.type === 'success' ? 'var(--success-bg)' : 'var(--error-bg)',
          color: message.type === 'success' ? 'var(--success)' : 'var(--error)',
          fontSize: 14
        }}>
          {message.text}
        </div>
      )}

      {/* Profile Information */}
      <div style={{ background: 'var(--bg-primary)', padding: 24, borderRadius: 8, boxShadow: 'var(--shadow-sm)', marginBottom: 24 }}>
        <h3 style={{ marginTop: 0, marginBottom: 24 }}>Account Information</h3>
        <div style={{ display: 'grid', gap: 16 }}>
          <div>
            <label style={{ display: 'block', fontSize: 12, color: 'var(--text-secondary)', marginBottom: 8, fontWeight: 500, textTransform: 'uppercase' }}>
              Email
            </label>
            <input
              type="email"
              value={user?.email || ''}
              disabled
              style={{
                width: '100%',
                padding: '8px 12px',
                borderRadius: 4,
                border: '1px solid var(--border)',
                background: 'var(--bg-secondary)',
                color: 'var(--text-secondary)',
                cursor: 'not-allowed',
                fontFamily: 'inherit'
              }}
            />
          </div>
          <div>
            <label style={{ display: 'block', fontSize: 12, color: 'var(--text-secondary)', marginBottom: 8, fontWeight: 500, textTransform: 'uppercase' }}>
              Role
            </label>
            <input
              type="text"
              value={user?.role || ''}
              disabled
              style={{
                width: '100%',
                padding: '8px 12px',
                borderRadius: 4,
                border: '1px solid var(--border)',
                background: 'var(--bg-secondary)',
                color: 'var(--text-secondary)',
                cursor: 'not-allowed',
                fontFamily: 'inherit',
                textTransform: 'capitalize'
              }}
            />
          </div>
          <div>
            <label style={{ display: 'block', fontSize: 12, color: 'var(--text-secondary)', marginBottom: 8, fontWeight: 500, textTransform: 'uppercase' }}>
              Status
            </label>
            <input
              type="text"
              value={user?.is_active ? 'Active' : 'Inactive'}
              disabled
              style={{
                width: '100%',
                padding: '8px 12px',
                borderRadius: 4,
                border: '1px solid var(--border)',
                background: 'var(--bg-secondary)',
                color: user?.is_active ? 'var(--success)' : 'var(--error)',
                cursor: 'not-allowed',
                fontFamily: 'inherit'
              }}
            />
          </div>
        </div>
      </div>

      {/* Security */}
      <div style={{ background: 'var(--bg-primary)', padding: 24, borderRadius: 8, boxShadow: 'var(--shadow-sm)', marginBottom: 24 }}>
        <h3 style={{ marginTop: 0, marginBottom: 24 }}>Security</h3>
        <p style={{ margin: 0, marginBottom: 16, color: 'var(--text-secondary)' }}>Manage your password and security settings</p>
        <Button variant="secondary" onClick={() => setShowChangePassword(true)}>
          Change Password
        </Button>
      </div>

      {/* Preferences */}
      <div style={{ background: 'var(--bg-primary)', padding: 24, borderRadius: 8, boxShadow: 'var(--shadow-sm)' }}>
        <h3 style={{ marginTop: 0, marginBottom: 24 }}>Preferences</h3>
        <div style={{ display: 'grid', gap: 16 }}>
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
            <div>
              <p style={{ margin: 0, fontWeight: 500 }}>Email Notifications</p>
              <p style={{ margin: 0, marginTop: 4, fontSize: 12, color: 'var(--text-secondary)' }}>Receive notifications via email</p>
            </div>
            <input type="checkbox" defaultChecked style={{ width: 18, height: 18, cursor: 'pointer' }} />
          </div>
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', paddingTop: 16, borderTop: '1px solid var(--border)' }}>
            <div>
              <p style={{ margin: 0, fontWeight: 500 }}>Push Notifications</p>
              <p style={{ margin: 0, marginTop: 4, fontSize: 12, color: 'var(--text-secondary)' }}>Receive push notifications</p>
            </div>
            <input type="checkbox" defaultChecked style={{ width: 18, height: 18, cursor: 'pointer' }} />
          </div>
        </div>
      </div>

      {/* Change Password Modal */}
      {showChangePassword && (
        <Modal 
          title="Change Password"
          onClose={() => setShowChangePassword(false)}
        >
          <form onSubmit={handlePasswordChange} style={{ display: 'grid', gap: 16 }}>
            <div>
              <label style={{ display: 'block', fontSize: 12, color: 'var(--text-secondary)', marginBottom: 8, fontWeight: 500, textTransform: 'uppercase' }}>
                Current Password
              </label>
              <input
                type="password"
                name="current_password"
                value={pwData.current_password}
                onChange={handlePwChange}
                required
                style={{
                  width: '100%',
                  padding: '8px 12px',
                  borderRadius: 4,
                  border: '1px solid var(--border)',
                  background: 'var(--bg-secondary)',
                  color: 'var(--text-primary)',
                  fontFamily: 'inherit'
                }}
              />
            </div>
            <div>
              <label style={{ display: 'block', fontSize: 12, color: 'var(--text-secondary)', marginBottom: 8, fontWeight: 500, textTransform: 'uppercase' }}>
                New Password
              </label>
              <input
                type="password"
                name="new_password"
                value={pwData.new_password}
                onChange={handlePwChange}
                required
                style={{
                  width: '100%',
                  padding: '8px 12px',
                  borderRadius: 4,
                  border: '1px solid var(--border)',
                  background: 'var(--bg-secondary)',
                  color: 'var(--text-primary)',
                  fontFamily: 'inherit'
                }}
              />
            </div>
            <div>
              <label style={{ display: 'block', fontSize: 12, color: 'var(--text-secondary)', marginBottom: 8, fontWeight: 500, textTransform: 'uppercase' }}>
                Confirm Password
              </label>
              <input
                type="password"
                name="confirm_password"
                value={pwData.confirm_password}
                onChange={handlePwChange}
                required
                style={{
                  width: '100%',
                  padding: '8px 12px',
                  borderRadius: 4,
                  border: '1px solid var(--border)',
                  background: 'var(--bg-secondary)',
                  color: 'var(--text-primary)',
                  fontFamily: 'inherit'
                }}
              />
            </div>
            <div style={{ display: 'flex', gap: 12, marginTop: 24 }}>
              <Button type="submit" variant="primary">Update Password</Button>
              <Button type="button" variant="ghost" onClick={() => setShowChangePassword(false)}>Cancel</Button>
            </div>
          </form>
        </Modal>
      )}
    </div>
  )
}
