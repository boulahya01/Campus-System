import React from 'react'

interface FormFieldProps {
  label: string
  error?: string
  required?: boolean
  children: React.ReactNode
  className?: string
}

export const FormField: React.FC<FormFieldProps> = ({ label, error, required, children, className = '' }) => (
  <div className={`form-group ${className}`}>
    <label>
      {label}
      {required && <span style={{ color: 'var(--error)' }}>*</span>}
    </label>
    {children}
    {error && <div className="text-sm" style={{ color: 'var(--error)', marginTop: '4px' }}>{error}</div>}
  </div>
)
