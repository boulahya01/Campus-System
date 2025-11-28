import React from 'react'

interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: 'primary' | 'secondary' | 'success' | 'error' | 'ghost'
  size?: 'sm' | 'md' | 'lg'
  loading?: boolean
  block?: boolean
}

export const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(
  ({ variant = 'primary', size = 'md', loading = false, block = false, children, className = '', ...props }, ref) => {
    const variantClass = `btn-${variant}`
    const sizeClass = size !== 'md' ? `btn-${size}` : ''
    const blockClass = block ? 'btn-block' : ''
    
    return (
      <button
        ref={ref}
        className={`${variantClass} ${sizeClass} ${blockClass} ${className}`}
        disabled={loading || props.disabled}
        {...props}
      >
        {loading && <span className="loading" />}
        {children}
      </button>
    )
  }
)

Button.displayName = 'Button'
