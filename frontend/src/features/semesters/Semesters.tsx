import React, { useState } from 'react'
import { useFetch } from '../../hooks'
import { semestersAPI, majorsAPI } from '../../api/endpoints'
import { useAuthStore } from '../../stores/authStore'
import { useToast } from '../../contexts/ToastContext'

export default function Semesters(){
  const { data: semesters, loading, error, refetch } = useFetch(
    () => semestersAPI.list(0, 100),
    []
  )
  const { data: majors } = useFetch(() => majorsAPI.list(0,100), [])
  const { user } = useAuthStore()
  const [name, setName] = useState('')
  const [majorId, setMajorId] = useState<number | ''>('')
  const [msg, setMsg] = useState<string | null>(null)
  const [isCreating, setIsCreating] = useState(false)
  const { push } = useToast()

  async function handleCreate(e: React.FormEvent){
    e.preventDefault(); setMsg(null)
    setIsCreating(true)
    try{
      await semestersAPI.create({ name, major_id: majorId || undefined })
      setName(''); setMajorId('')
      refetch && refetch()
      push('Semester created', 'success')
    }catch(err:any){ push(err?.response?.data?.detail || 'Failed', 'error') }
    finally{ setIsCreating(false) }
  }

  return (
    <div className="container">
      <h2 style={{marginBottom:12}}>Semesters</h2>

      {user?.role === 'admin' ? (
        <form onSubmit={handleCreate} style={{display:'flex',gap:8,alignItems:'center',marginBottom:12}}>
          <input placeholder="Semester name" value={name} onChange={e=>setName(e.target.value)} style={{padding:8,flex:1}} />
          <select value={majorId} onChange={e=>setMajorId(e.target.value ? Number(e.target.value) : '')} style={{padding:8}}>
            <option value="">-- major (optional)--</option>
            {Array.isArray(majors) && majors.map((m:any)=>(<option key={m.id} value={m.id}>{m.name}</option>))}
          </select>
          <button className="primary" type="submit" disabled={isCreating}>{isCreating ? 'Creating...' : 'Create'}</button>
        </form>
      ) : (
        <div style={{marginBottom:12, color:'#555'}}>Only administrators can create semesters. You can view the list below.</div>
      )}
      {msg && <div style={{marginBottom:12,color: msg === 'Semester created' ? 'green' : 'red'}}>{msg}</div>}

      {error && <p style={{color:'red'}}>Error: {String(error)}</p>}
      {loading && <p>Loading semesters...</p>}

      {!loading && Array.isArray(semesters) && semesters.length > 0 ? (
        <ul>
          {semesters.map((s: any) => (
            <li key={s.id}>{s.name} — Major ID: {s.major_id}</li>
          ))}
        </ul>
      ) : !loading && <p>No semesters yet</p>}
    </div>
  )
}
