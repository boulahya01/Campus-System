import React from 'react'

interface LoadingProps {
  message?: string
  fullPage?: boolean
}

export const Loading: React.FC<LoadingProps> = ({ message = 'Loading...', fullPage = false }) => {
  const content = (
    <div className="flex-center flex-column gap-md p-lg">
      <div className="loading" />
      {message && <p className="text-muted">{message}</p>}
    </div>
  )

  if (fullPage) {
    return <div className="flex-center" style={{ minHeight: '100vh' }}>{content}</div>
  }

  return <div className="flex-center flex-column gap-md p-lg">{content}</div>
}
