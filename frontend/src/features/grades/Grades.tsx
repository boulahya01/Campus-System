import React from 'react'
import { useFetch, useAuth } from '../../hooks'
import { gradesAPI } from '../../api/endpoints'

export default function Grades(){
  const { user } = useAuth()
  
  const { data: grades, loading, error } = useFetch(
    user?.id ? () => gradesAPI.getStudentGrades(user.id) : () => Promise.resolve([]),
    [user?.id]
  )

  return (
    <div className="container">
      <h2 style={{marginBottom:32}}>My Grades</h2>

      {error && <div className="alert alert-error">Error: {String(error)}</div>}
      {loading && <p>Loading your grades...</p>}

      {!loading && Array.isArray(grades) && grades.length > 0 ? (
        <div style={{overflowX:'auto',background:'var(--bg-primary)',borderRadius:8,boxShadow:'var(--shadow-sm)'}}>
          <table style={{width:'100%'}}>
            <thead>
              <tr>
                <th>Module ID</th>
                <th>Grade</th>
              </tr>
            </thead>
            <tbody>
              {grades.map((g: any) => (
                <tr key={g.id}>
                  <td>{g.module_id}</td>
                  <td style={{fontWeight:'bold'}}>{g.grade}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      ) : !loading && <p>No grades yet</p>}
    </div>
  )
}
