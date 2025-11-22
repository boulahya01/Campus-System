import React from 'react'
import { useFetch } from '../hooks'
import { examsAPI } from '../api/endpoints'

export default function Exams(){
  const { data: exams, loading, error } = useFetch(
    () => examsAPI.list(0, 20),
    []
  )

  return (
    <div style={{padding:20}}>
      <h2>Exams Schedule</h2>

      {error && <p style={{color:'red'}}>Error: {String(error)}</p>}
      {loading && <p>Loading exam schedule...</p>}

      {!loading && Array.isArray(exams) && exams.length > 0 ? (
        <div>
          <table style={{width:'100%', borderCollapse:'collapse'}}>
            <thead>
              <tr style={{borderBottom:'2px solid #ddd'}}>
                <th style={{padding:'10px', textAlign:'left'}}>Module ID</th>
                <th style={{padding:'10px', textAlign:'left'}}>Exam Date</th>
                <th style={{padding:'10px', textAlign:'left'}}>Room</th>
              </tr>
            </thead>
            <tbody>
              {exams.map((e: any) => (
                <tr key={e.id} style={{borderBottom:'1px solid #eee'}}>
                  <td style={{padding:'10px'}}>{e.module_id}</td>
                  <td style={{padding:'10px'}}>
                    {new Date(e.date).toLocaleString()}
                  </td>
                  <td style={{padding:'10px'}}>{e.room}</td>
                </tr>
              ))}
            </tbody>
          </table>
          <p style={{marginTop:'10px', fontSize:'0.9em', color:'#666'}}>Total Exams: {exams.length}</p>
        </div>
      ) : !loading && <p>No exams scheduled yet</p>}
    </div>
  )
}
