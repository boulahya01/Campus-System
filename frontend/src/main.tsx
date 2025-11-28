import React from 'react'
import { createRoot } from 'react-dom/client'
import AppRoutes from './routes/Routes'
import './styles/global.css'
import { ToastProvider } from './contexts/ToastContext'
import { initTheme } from './utils/theme'

// Initialize theme (reads localStorage or system preference)
initTheme()

createRoot(document.getElementById('root')!).render(
  <React.StrictMode>
    <ToastProvider>
      <AppRoutes />
    </ToastProvider>
  </React.StrictMode>
)
