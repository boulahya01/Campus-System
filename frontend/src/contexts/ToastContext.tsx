import React, { createContext, useContext, useState, useCallback } from 'react'

type Toast = { id: number; message: string; type?: 'success' | 'error' | 'info' }

const ToastContext = createContext<any>(null)

export function ToastProvider({ children }: { children: React.ReactNode }) {
  const [toasts, setToasts] = useState<Toast[]>([])
  const push = useCallback((message: string, type: Toast['type'] = 'info', duration = 4000) => {
    const id = Date.now() + Math.floor(Math.random() * 1000)
    const t = { id, message, type }
    setToasts(s => [...s, t])
    if (duration > 0) setTimeout(() => setToasts(s => s.filter(x => x.id !== id)), duration)
  }, [])
  const remove = useCallback((id: number) => setToasts(s => s.filter(t => t.id !== id)), [])

  return (
    <ToastContext.Provider value={{ push, remove, toasts }}>
      {children}
      <div style={{ position: 'fixed', right: 20, top: 20, zIndex: 9999 }}>
        {toasts.map(t => (
          <div key={t.id} style={{
            marginBottom: 8,
            padding: '8px 12px',
            minWidth: 200,
            borderRadius: 6,
            boxShadow: '0 2px 8px rgba(0,0,0,0.08)',
            background: t.type === 'success' ? '#d4edda' : t.type === 'error' ? '#f8d7da' : '#d1ecf1',
            color: '#0b2e13'
          }}>
            <div style={{display:'flex',justifyContent:'space-between',alignItems:'center'}}>
              <div>{t.message}</div>
              <button onClick={() => remove(t.id)} style={{marginLeft:8, border:'none', background:'transparent', cursor:'pointer'}}>✕</button>
            </div>
          </div>
        ))}
      </div>
    </ToastContext.Provider>
  )
}

export function useToast() {
  const ctx = useContext(ToastContext)
  if (!ctx) throw new Error('useToast must be used inside ToastProvider')
  return ctx
}
