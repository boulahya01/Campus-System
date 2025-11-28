import React from 'react'

type BadgeType = 'primary' | 'success' | 'error' | 'warning'

interface BadgeProps {
  type?: BadgeType
  children: React.ReactNode
  className?: string
}

export const Badge: React.FC<BadgeProps> = ({ type = 'primary', children, className = '' }) => (
  <span className={`badge badge-${type} ${className}`}>{children}</span>
)
