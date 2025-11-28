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
      <h2 style={{marginBottom:32}}>Courses / Modules</h2>

      {error && <div className="alert alert-error">Error: {String(error)}</div>}
      {loading && <p>Loading modules...</p>}

      {!loading && Array.isArray(modules) && modules.length > 0 ? (
        <div style={{overflowX:'auto',background:'var(--bg-primary)',borderRadius:8,boxShadow:'var(--shadow-sm)'}}>
          <table style={{width:'100%'}}>
            <thead>
              <tr>
                <th>Code</th>
                <th>Name</th>
                <th>Semester ID</th>
                <th>Professor ID</th>
              </tr>
            </thead>
            <tbody>
              {modules.map((m: any) => (
                <tr key={m.id}>
                  <td>{m.code}</td>
                  <td>{m.name}</td>
                  <td>{m.semester_id}</td>
                  <td>{m.professor_id || 'TBD'}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      ) : !loading && <p>No modules available yet</p>}
    </div>
  )
}
