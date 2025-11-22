import React from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { useAuthStore } from '../stores/authStore'

export default function Navbar() {
  const { user, clearAuth } = useAuthStore()
  const navigate = useNavigate()

  const handleLogout = () => {
    clearAuth()
    navigate('/login')
  }

  if (!user) return null

  return (
    <nav style={{
      display: 'flex',
      justifyContent: 'space-between',
      alignItems: 'center',
      padding: '12px 20px',
      borderBottom: '1px solid #ddd',
      backgroundColor: '#f9f9f9'
    }}>
      <div>
        <Link to="/" style={{ textDecoration: 'none', fontWeight: 'bold', fontSize: '18px' }}>
          Campus System
        </Link>
      </div>

      <div style={{ display: 'flex', gap: '20px', alignItems: 'center' }}>
        {user?.role === 'admin' && (
          <>
            <Link to="/admin" style={{ textDecoration: 'none', color: '#0066cc' }}>Admin Panel</Link>
            <Link to="/students" style={{ textDecoration: 'none', color: '#0066cc' }}>Students</Link>
          </>
        )}
        {user?.role === 'student' && (
          <>
            <Link to="/courses" style={{ textDecoration: 'none', color: '#0066cc' }}>Courses</Link>
            <Link to="/grades" style={{ textDecoration: 'none', color: '#0066cc' }}>Grades</Link>
            <Link to="/requests" style={{ textDecoration: 'none', color: '#0066cc' }}>Requests</Link>
          </>
        )}
        
        <span style={{ fontSize: '14px' }}>
          {user?.email} ({user?.role})
        </span>
        <button 
          onClick={handleLogout}
          style={{
            padding: '6px 12px',
            backgroundColor: '#dc3545',
            color: 'white',
            border: 'none',
            borderRadius: '4px',
            cursor: 'pointer'
          }}
        >
          Logout
        </button>
      </div>
    </nav>
  )
}
