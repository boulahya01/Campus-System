import React, { useState } from 'react'
import { useFetch, useForm } from '../../hooks'
import { studentsAPI } from '../../api/endpoints'
import useCan from '../../hooks/useCan'
import Modal from '../../components/Modal'
import { Button } from '../../components/Button'
import { useToast } from '../../contexts/ToastContext'

export default function Students(){
  const { can } = useCan()
  const { push } = useToast()
  const [showCreateModal, setShowCreateModal] = useState(false)
  const { data: students, loading, error, refetch } = useFetch(
    () => studentsAPI.list(0, 50),
    []
  )

  const { values, handleChange, resetForm, loading: formLoading } = useForm(
    { cne: '', major_id: '', semester_id: '', user_id: '' },
    async (formValues) => {
      try {
        await studentsAPI.create(formValues)
        push('Student created successfully', 'success')
        resetForm()
        setShowCreateModal(false)
        refetch && refetch()
      } catch (err: any) {
        push(err?.response?.data?.detail || 'Failed to create student', 'error')
      }
    }
  )

  return (
    <div className="container">
      <div style={{display:'flex',justifyContent:'space-between',alignItems:'center',marginBottom:32}}>
        <h2 style={{margin:0}}>Students</h2>
        {can('student:create') && (
          <Button variant="primary" onClick={()=>setShowCreateModal(true)}>
            Add Student
          </Button>
        )}
      </div>

      {error && <div className="alert alert-error">Error: {String(error)}</div>}
      {loading && <p>Loading students...</p>}

      {!loading && Array.isArray(students) && students.length > 0 ? (
        <div style={{overflowX:'auto',background:'var(--bg-primary)',borderRadius:8,boxShadow:'var(--shadow-sm)'}}>
          <table style={{width:'100%'}}>
            <thead>
              <tr>
                <th>ID</th>
                <th>CNE</th>
                <th>Major ID</th>
                <th>Semester ID</th>
                <th>User ID</th>
              </tr>
            </thead>
            <tbody>
              {students.map((s: any) => (
                <tr key={s.id}>
                  <td>{s.id}</td>
                  <td>{s.cne || '—'}</td>
                  <td>{s.major_id || '—'}</td>
                  <td>{s.semester_id || '—'}</td>
                  <td>{s.user_id || '—'}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      ) : !loading && <p>No students found</p>}

      <Modal open={showCreateModal} title="Add Student" onClose={()=>setShowCreateModal(false)}>
        <form onSubmit={(e)=>{e.preventDefault()}}>
          <div className="form-group">
            <label>CNE</label>
            <input name="cne" value={values.cne} onChange={handleChange} placeholder="Student CNE" />
          </div>
          <div className="form-group">
            <label>Major ID</label>
            <input name="major_id" type="number" value={values.major_id} onChange={handleChange} placeholder="Major ID" />
          </div>
          <div className="form-group">
            <label>Semester ID</label>
            <input name="semester_id" type="number" value={values.semester_id} onChange={handleChange} placeholder="Semester ID" />
          </div>
          <div className="form-group">
            <label>User ID (optional)</label>
            <input name="user_id" type="number" value={values.user_id} onChange={handleChange} placeholder="User ID" />
          </div>
          <div style={{display:'flex',gap:12,justifyContent:'flex-end',marginTop:24}}>
            <Button variant="secondary" onClick={()=>setShowCreateModal(false)}>Cancel</Button>
            <Button variant="primary" loading={formLoading} onClick={async ()=>{await new Promise(r=>setTimeout(r,500))}}>Create</Button>
          </div>
        </form>
      </Modal>
    </div>
  )
}
