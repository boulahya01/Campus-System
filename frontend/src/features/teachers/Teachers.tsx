import React, { useState } from 'react'
import { useFetch } from '../../hooks'
import { teachersAPI } from '../../api/endpoints'
import { useAuthStore } from '../../stores/authStore'
import { useToast } from '../../contexts/ToastContext'

export default function Teachers(){
  const { data: teachers, loading, error, refetch } = useFetch(
    () => teachersAPI.list(0, 50),
    []
  )
  const { user } = useAuthStore()
  const [department, setDepartment] = useState('')
  const [userId, setUserId] = useState<number | ''>('')
  const [msg, setMsg] = useState<string | null>(null)
  const [isCreating, setIsCreating] = useState(false)
  const { push } = useToast()

  async function handleCreate(e: React.FormEvent){
    e.preventDefault(); setMsg(null)
    setIsCreating(true)
    try{
      await teachersAPI.create({ department, user_id: userId || undefined })
      setDepartment(''); setUserId('')
      refetch && refetch()
      push('Teacher created', 'success')
    }catch(err:any){ push(err?.response?.data?.detail || 'Failed', 'error') }
    finally{ setIsCreating(false) }
  }

  return (
    <div className="container">
      <h2 style={{marginBottom:12}}>Teachers</h2>

      {user?.role === 'admin' ? (
        <form onSubmit={handleCreate} style={{display:'flex',gap:8,alignItems:'center',marginBottom:12}}>
          <input placeholder="Department" value={department} onChange={e=>setDepartment(e.target.value)} style={{padding:8,flex:1}} />
          <input placeholder="User ID" value={userId} onChange={e=>setUserId(e.target.value ? Number(e.target.value) : '')} style={{padding:8,width:120}} />
          <button className="primary" type="submit" disabled={isCreating}>{isCreating ? 'Creating...' : 'Create'}</button>
        </form>
      ) : (
        <div style={{marginBottom:12, color:'#555'}}>Only administrators can create teachers. You can view the list below.</div>
      )}
      {msg && <div style={{marginBottom:12,color: msg === 'Teacher created' ? 'green' : 'red'}}>{msg}</div>}

      {error && <p style={{color:'red'}}>Error: {String(error)}</p>}
      {loading && <p>Loading teachers...</p>}

      {!loading && Array.isArray(teachers) && teachers.length > 0 ? (
        <ul>
          {teachers.map((t: any) => (
            <li key={t.id}>{t.department || 'N/A'} — User ID: {t.user_id}</li>
          ))}
        </ul>
      ) : !loading && <p>No teachers yet</p>}
    </div>
  )
}
