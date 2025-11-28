import React, { useEffect, useState } from 'react'
import { getStoredTheme, toggleTheme } from '../utils/theme'

export default function ThemeToggle() {
  const [theme, setTheme] = useState<string>('light')

  useEffect(() => {
    const t = getStoredTheme() || 'light'
    setTheme(t)
  }, [])

  function onClick() {
    toggleTheme()
    // reflect next state simply by reading stored value (toggleTheme persists)
    setTimeout(() => setTheme(getStoredTheme() || 'light'), 50)
  }

  return (
    <button onClick={onClick} aria-label="Toggle theme" title="Toggle theme" style={{border:'none',background:'transparent',cursor:'pointer',padding:'6px 8px'}}>
      {theme === 'dark' ? '🌙' : '☀️'}
    </button>
  )
}
