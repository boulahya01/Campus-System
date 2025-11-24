import React from 'react'
import { useFetch, useAuth } from '../../hooks'
import { usersAPI, announcementsAPI } from '../../api/endpoints'

export default function Dashboard(){
  const { user } = useAuth()
  const { data: announcements, loading: announcementsLoading, error: announcementsError } = useFetch(
    () => announcementsAPI.list(0, 5),
    []
  )

  return (
    <div className="container">
      <h2 style={{marginBottom:12}}>Dashboard — {user?.email}</h2>
      <div style={{ marginTop: '20px' }}>
        <h3>Welcome, {user?.role}!</h3>
        <p>Role: <strong>{user?.role}</strong></p>
      </div>

      <div style={{ marginTop: '30px' }}>
        <h3>Recent Announcements</h3>
        {announcementsLoading && <p>Loading announcements...</p>}
        {announcementsError && <p style={{color: 'red'}}>Error: {announcementsError}</p>}
        {announcements && Array.isArray(announcements) && announcements.length > 0 ? (
          <ul>
            {announcements.map((ann: any) => (
              <li key={ann.id}>
                <strong>{ann.title}</strong> - {ann.content}
              </li>
            ))}
          </ul>
        ) : (
          <p>No announcements yet.</p>
        )}
      </div>
    </div>
  )
}
