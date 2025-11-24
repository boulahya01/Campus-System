import React from 'react'
import { createRoot } from 'react-dom/client'
import AppRoutes from './routes/Routes'
import './styles/global.css'
import { ToastProvider } from './contexts/ToastContext'

createRoot(document.getElementById('root')!).render(
  <React.StrictMode>
    <ToastProvider>
      <AppRoutes />
    </ToastProvider>
  </React.StrictMode>
)
