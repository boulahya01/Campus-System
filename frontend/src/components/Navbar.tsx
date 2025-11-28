import React, { useEffect } from 'react'
import { Link, NavLink, useNavigate } from 'react-router-dom'
import { useAuthStore } from '../stores/authStore'
import api from '../api/client'
import ThemeToggle from './ThemeToggle'

export default function Navbar() {
  const { user, token, setAuth, clearAuth } = useAuthStore()
  const navigate = useNavigate()

  const handleLogout = () => {
    clearAuth()
    navigate('/login')
  }

  // If there's no token, don't show the navbar.
  if (!token) return null

  // If we have a token but no user object yet, fetch the current user.
  useEffect(() => {
    let mounted = true
    if (token && !user) {
      api.get('/users/me')
        .then(res => {
          if (mounted) setAuth(token, res.data)
        })
        .catch(() => {
          // ignore failures here; user may be unauthenticated
        })
    }
    return () => { mounted = false }
  }, [token, user, setAuth])

  const baseNavStyle: React.CSSProperties = {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: '16px 24px',
    borderBottom: '1px solid var(--border-light)',
    backgroundColor: 'var(--bg-primary)',
    gap: '24px'
  }

  const linkBase: React.CSSProperties = {
    textDecoration: 'none',
    color: 'var(--primary)',
    padding: '4px 6px'
  }

  const activeLink = (isActive: boolean): React.CSSProperties => ({
    ...linkBase,
    fontWeight: isActive ? 700 : 500,
    borderBottom: isActive ? '2px solid var(--primary)' : 'none'
  })

  return (
    <nav style={baseNavStyle} aria-label="Main navigation">
      <div>
        <Link to="/" style={{ textDecoration: 'none', fontWeight: '700', fontSize: '18px', color: 'var(--text-primary)' }}>
          Campus System
        </Link>
      </div>

      <div style={{ display: 'flex', gap: '24px', alignItems: 'center' }}>
        {user?.role === 'admin' && (
          <>
            <NavLink to="/admin" style={({ isActive }) => activeLink(isActive)} aria-label="Admin panel">Admin Panel</NavLink>
            <NavLink to="/students" style={({ isActive }) => activeLink(isActive)}>Students</NavLink>
            <NavLink to="/teachers" style={({ isActive }) => activeLink(isActive)}>Teachers</NavLink>
            <NavLink to="/majors" style={({ isActive }) => activeLink(isActive)}>Majors</NavLink>
            <NavLink to="/semesters" style={({ isActive }) => activeLink(isActive)}>Semesters</NavLink>
          </>
        )}

        {user?.role === 'student' && (
          <>
            <NavLink to="/courses" style={({ isActive }) => activeLink(isActive)}>Courses</NavLink>
            <NavLink to="/grades" style={({ isActive }) => activeLink(isActive)}>Grades</NavLink>
            <NavLink to="/requests" style={({ isActive }) => activeLink(isActive)}>Requests</NavLink>
          </>
        )}

        {user?.role === 'teacher' && (
          <>
            <NavLink to="/courses" style={({ isActive }) => activeLink(isActive)}>Courses</NavLink>
            <NavLink to="/materials" style={({ isActive }) => activeLink(isActive)}>Materials</NavLink>
            <NavLink to="/grades" style={({ isActive }) => activeLink(isActive)}>Grades</NavLink>
          </>
        )}

        <span style={{ fontSize: '14px', color: 'var(--text-secondary)', marginLeft: 'auto', paddingRight: '16px' }} aria-live="polite">
          {user?.email} ({user?.role})
        </span>

        <ThemeToggle />

        <button 
          onClick={handleLogout}
          style={{
            padding: '6px 12px',
            backgroundColor: 'var(--error)',
            color: 'white',
            border: 'none',
            borderRadius: '4px',
            cursor: 'pointer'
          }}
          aria-label="Logout"
        >
          Logout
        </button>
      </div>
    </nav>
  )
}
