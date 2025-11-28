import React from 'react'

type AlertType = 'success' | 'error' | 'warning' | 'info'

interface AlertProps {
  type: AlertType
  children: React.ReactNode
  onClose?: () => void
  className?: string
}

export const Alert: React.FC<AlertProps> = ({ type, children, onClose, className = '' }) => (
  <div className={`alert alert-${type} ${className}`}>
    <div className="flex-between">
      <div>{children}</div>
      {onClose && <button className="btn-ghost btn-sm" onClick={onClose}>×</button>}
    </div>
  </div>
)
