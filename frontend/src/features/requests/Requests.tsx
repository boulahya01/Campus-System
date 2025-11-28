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
      <h2 style={{marginBottom:32}}>Administrative Requests</h2>

      <div style={{marginBottom:32, border:'1px solid var(--border)', padding:24, borderRadius:8, background:'var(--bg-primary)'}}>
        <h3 style={{marginTop:0, marginBottom: 24}}>Create New Request</h3>
        <form onSubmit={handleSubmit}>
          <div className="form-group">
            <label>Request Type:</label>
            <input 
              type="text" 
              name="type" 
              value={values.type} 
              onChange={handleChange}
              placeholder="e.g., certificate, transcript"
            />
          </div>
          <Button 
            type="submit" 
            variant="primary"
            loading={formLoading}
          >
            {formLoading ? 'Submitting...' : 'Submit Request'}
          </Button>
        </form>
        {submitStatus.msg && (
          <p style={{marginTop:16, color: submitStatus.ok ? 'var(--success)' : 'var(--error)'}}>
            {submitStatus.msg}
          </p>
        )}
      </div>

      <div>
        <h3>My Requests</h3>
        {loading && <p>Loading requests...</p>}

        {!loading && Array.isArray(requests) && requests.length > 0 ? (
          <div style={{overflowX:'auto',background:'var(--bg-primary)',borderRadius:8,boxShadow:'var(--shadow-sm)'}}>
            <table style={{width:'100%'}}>
              <thead>
                <tr>
                  <th>Type</th>
                  <th>Status</th>
                  <th>PDF URL</th>
                </tr>
              </thead>
              <tbody>
                {requests.map((r: any) => (
                  <tr key={r.id}>
                    <td>{r.type}</td>
                    <td style={{fontWeight:'bold', color: r.status === 'approved' ? 'var(--success)' : r.status === 'rejected' ? 'var(--error)' : 'var(--warning)'}}>{r.status}</td>
                    <td>
                      {r.generated_pdf_url ? (
                        <a href={r.generated_pdf_url} target="_blank" rel="noreferrer">Download</a>
                      ) : 'Pending'}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        ) : !loading && <p>No requests yet</p>}
      </div>
    </div>
  )
}
