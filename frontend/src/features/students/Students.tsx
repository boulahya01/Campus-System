import React from 'react'
import { useFetch } from '../../hooks'
import { studentsAPI } from '../../api/endpoints'

export default function Students(){
  const { data: students, loading, error } = useFetch(
    () => studentsAPI.list(0, 50),
    []
  )

  return (
    <div className="container">
      <h2 style={{marginBottom:12}}>Students</h2>

      {error && <p style={{color:'red'}}>Error: {String(error)}</p>}
      {loading && <p>Loading students...</p>}

      {!loading && Array.isArray(students) && students.length > 0 ? (
        <table style={{width:'100%', borderCollapse:'collapse'}}>
          <thead>
            <tr style={{borderBottom:'2px solid #ddd'}}>
              <th style={{padding:'10px', textAlign:'left'}}>ID</th>
              <th style={{padding:'10px', textAlign:'left'}}>CNE</th>
              <th style={{padding:'10px', textAlign:'left'}}>Major ID</th>
            </tr>
          </thead>
          <tbody>
            {students.map((s: any) => (
              <tr key={s.id} style={{borderBottom:'1px solid #eee'}}>
                <td style={{padding:'10px'}}>{s.id}</td>
                <td style={{padding:'10px'}}>{s.cne || '—'}</td>
                <td style={{padding:'10px'}}>{s.major_id || '—'}</td>
              </tr>
            ))}
          </tbody>
        </table>
      ) : !loading && <p>No students yet</p>}
    </div>
  )
}
