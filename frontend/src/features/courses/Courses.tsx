import React from 'react'
import { useFetch } from '../../hooks'
import { modulesAPI } from '../../api/endpoints'

export default function Courses(){
  const { data: modules, loading, error } = useFetch(
    () => modulesAPI.list(undefined, 0, 20),
    []
  )

  return (
    <div className="container">
      <h2 style={{marginBottom:12}}>Courses / Modules</h2>

      {error && <p style={{color:'red'}}>Error: {String(error)}</p>}
      {loading && <p>Loading modules...</p>}

      {!loading && Array.isArray(modules) && modules.length > 0 ? (
        <div>
          <table style={{width:'100%', borderCollapse:'collapse'}}>
            <thead>
              <tr style={{borderBottom:'2px solid #ddd'}}>
                <th style={{padding:'10px', textAlign:'left'}}>Code</th>
                <th style={{padding:'10px', textAlign:'left'}}>Name</th>
                <th style={{padding:'10px', textAlign:'left'}}>Semester ID</th>
                <th style={{padding:'10px', textAlign:'left'}}>Professor ID</th>
              </tr>
            </thead>
            <tbody>
              {modules.map((m: any) => (
                <tr key={m.id} style={{borderBottom:'1px solid #eee'}}>
                  <td style={{padding:'10px'}}>{m.code}</td>
                  <td style={{padding:'10px'}}>{m.name}</td>
                  <td style={{padding:'10px'}}>{m.semester_id}</td>
                  <td style={{padding:'10px'}}>{m.professor_id || 'TBD'}</td>
                </tr>
              ))}
            </tbody>
          </table>
          <p style={{marginTop:'10px', fontSize:'0.9em', color:'#666'}}>Total: {modules.length} modules</p>
        </div>
      ) : !loading && <p>No modules available yet</p>}
    </div>
  )
}
