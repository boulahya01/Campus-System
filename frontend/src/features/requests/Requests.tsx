import React, { useState } from 'react'
import { useFetch, useForm, useAuth } from '../../hooks'
import { requestsAPI } from '../../api/endpoints'

export default function Requests(){
  const { user } = useAuth()
  const [submitStatus, setSubmitStatus] = useState<{ok?: boolean, msg?: string}>({})
  
  const { data: requests, loading } = useFetch(
    user?.id ? () => requestsAPI.list(0, 20) : () => Promise.resolve([]),
    [user?.id]
  )

  const { values, handleChange, handleSubmit, loading: formLoading } = useForm(
    { type: 'certificate', status: 'pending' },
    async (formValues) => {
      try {
        if(!user?.id) throw new Error('User not logged in')
        await requestsAPI.create({
          ...formValues,
          student_id: user.id
        })
        setSubmitStatus({ ok: true, msg: 'Request created successfully!' })
      } catch (err: any) {
        setSubmitStatus({ ok: false, msg: err.message || 'Failed to create request' })
      }
    }
  )

  return (
    <div className="container">
      <h2 style={{marginBottom:12}}>Administrative Requests</h2>

      <div style={{marginBottom:'30px', border:'1px solid #ddd', padding:'15px', borderRadius:'4px'}}>
        <h3>Create New Request</h3>
        <form onSubmit={handleSubmit}>
          <div style={{marginBottom:'10px'}}>
            <label>Request Type: </label>
            <input 
              type="text" 
              name="type" 
              value={values.type} 
              onChange={handleChange}
              placeholder="e.g., certificate, transcript"
              style={{marginLeft:'10px', padding:'5px', width:'300px'}}
            />
          </div>
          <button 
            type="submit" 
            disabled={formLoading}
            style={{padding:'8px 16px', backgroundColor:'#007bff', color:'white', border:'none', borderRadius:'4px', cursor:'pointer'}}
          >
            {formLoading ? 'Submitting...' : 'Submit Request'}
          </button>
        </form>
        {submitStatus.msg && (
          <p style={{marginTop:'10px', color: submitStatus.ok ? 'green' : 'red'}}>
            {submitStatus.msg}
          </p>
        )}
      </div>

      <div>
        <h3>My Requests</h3>
        {loading && <p>Loading requests...</p>}

        {!loading && Array.isArray(requests) && requests.length > 0 ? (
          <table style={{width:'100%', borderCollapse:'collapse'}}>
            <thead>
              <tr style={{borderBottom:'2px solid #ddd'}}>
                <th style={{padding:'10px', textAlign:'left'}}>Type</th>
                <th style={{padding:'10px', textAlign:'left'}}>Status</th>
                <th style={{padding:'10px', textAlign:'left'}}>PDF URL</th>
              </tr>
            </thead>
            <tbody>
              {requests.map((r: any) => (
                <tr key={r.id} style={{borderBottom:'1px solid #eee'}}>
                  <td style={{padding:'10px'}}>{r.type}</td>
                  <td style={{padding:'10px', fontWeight:'bold', color: r.status === 'approved' ? 'green' : r.status === 'rejected' ? 'red' : 'orange'}}>{r.status}</td>
                  <td style={{padding:'10px'}}>
                    {r.generated_pdf_url ? (
                      <a href={r.generated_pdf_url} target="_blank" rel="noreferrer">Download</a>
                    ) : 'Pending'}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        ) : !loading && <p>No requests yet</p>}
      </div>
    </div>
  )
}
