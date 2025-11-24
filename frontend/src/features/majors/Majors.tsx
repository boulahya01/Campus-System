import React, { useState } from 'react'
import { useFetch } from '../../hooks'
import { majorsAPI } from '../../api/endpoints'
import { useAuthStore } from '../../stores/authStore'
import { useToast } from '../../contexts/ToastContext'

export default function Majors(){
  const { data: majors, loading, error, refetch } = useFetch(
    () => majorsAPI.list(0, 100),
    []
  )
  const { user } = useAuthStore()
  const [name, setName] = useState('')
  const [msg, setMsg] = useState<string | null>(null)
  const [isCreating, setIsCreating] = useState(false)
  const { push } = useToast()

  async function handleCreate(e: React.FormEvent){
    e.preventDefault()
    setMsg(null)
    setIsCreating(true)
    try{
      await majorsAPI.create({ name })
      setName('')
      refetch && refetch()
      push('Major created', 'success')
    }catch(err:any){
      const message = err?.response?.data?.detail || 'Failed'
      push(String(message), 'error')
    } finally{
      setIsCreating(false)
    }
  }

  return (
    <div className="container">
      <h2 style={{marginBottom:12}}>Majors</h2>

      {user?.role === 'admin' ? (
        <form onSubmit={handleCreate} style={{display:'flex',gap:8,alignItems:'center',marginBottom:12}}>
          <input placeholder="New major name" value={name} onChange={e=>setName(e.target.value)} style={{padding:8,flex:1}} />
          <button className="primary" type="submit" disabled={isCreating}>{isCreating ? 'Creating...' : 'Create'}</button>
        </form>
      ) : (
        <div style={{marginBottom:12, color:'#555'}}>Only administrators can create majors. You can view the list below.</div>
      )}
      {msg && <div style={{marginBottom:12,color: msg === 'Major created' ? 'green' : 'red'}}>{msg}</div>}

      {error && <p style={{color:'red'}}>Error: {String(error)}</p>}
      {loading && <p>Loading majors...</p>}

      {!loading && Array.isArray(majors) && majors.length > 0 ? (
        <ul>
          {majors.map((m: any) => (
            <li key={m.id}>{m.name} (ID: {m.id})</li>
          ))}
        </ul>
      ) : !loading && <p>No majors yet</p>}
    </div>
  )
}
