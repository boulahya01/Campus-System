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
      <h2 style={{marginBottom:12}}>My Grades</h2>

      {error && <p style={{color:'red'}}>Error: {String(error)}</p>}
      {loading && <p>Loading your grades...</p>}

      {!loading && Array.isArray(grades) && grades.length > 0 ? (
        <div>
          <table style={{width:'100%', borderCollapse:'collapse'}}>
            <thead>
              <tr style={{borderBottom:'2px solid #ddd'}}>
                <th style={{padding:'10px', textAlign:'left'}}>Module ID</th>
                <th style={{padding:'10px', textAlign:'left'}}>Grade</th>
              </tr>
            </thead>
            <tbody>
              {grades.map((g: any) => (
                <tr key={g.id} style={{borderBottom:'1px solid #eee'}}>
                  <td style={{padding:'10px'}}>{g.module_id}</td>
                  <td style={{padding:'10px', fontWeight:'bold'}}>{g.grade}</td>
                </tr>
              ))}
            </tbody>
          </table>
          <p style={{marginTop:'10px', fontSize:'0.9em', color:'#666'}}>
            Total Grades: {grades.length}
          </p>
        </div>
      ) : !loading && <p>No grades yet</p>}
    </div>
  )
}
