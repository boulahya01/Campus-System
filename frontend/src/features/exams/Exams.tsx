import React from 'react'
import { useFetch } from '../../hooks'
import { examsAPI } from '../../api/endpoints'

export default function Exams(){
  const { data: exams, loading, error } = useFetch(
    () => examsAPI.list(0, 20),
    []
  )

  return (
    <div className="container">
      <h2 style={{marginBottom:32}}>Exams Schedule</h2>

      {error && <div className="alert alert-error">Error: {String(error)}</div>}
      {loading && <p>Loading exam schedule...</p>}

      {!loading && Array.isArray(exams) && exams.length > 0 ? (
        <div style={{overflowX:'auto',background:'var(--bg-primary)',borderRadius:8,boxShadow:'var(--shadow-sm)'}}>
          <table style={{width:'100%'}}>
            <thead>
              <tr>
                <th>Module ID</th>
                <th>Exam Date</th>
                <th>Room</th>
              </tr>
            </thead>
            <tbody>
              {exams.map((e: any) => (
                <tr key={e.id}>
                  <td>{e.module_id}</td>
                  <td>
                    {new Date(e.date).toLocaleString()}
                  </td>
                  <td>{e.room}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      ) : !loading && <p>No exams scheduled yet</p>}
    </div>
  )
}
