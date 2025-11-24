import React, { useEffect, useState } from 'react'
import api from '../../api/client'
import { useToast } from '../../contexts/ToastContext'
import useCan from '../../hooks/useCan'

type Permission = { id: number; name: string; description?: string }
type Role = { id: number; name: string; description?: string; permissions: Permission[] }

export default function Roles(){
  const { push } = useToast()
  const { can } = useCan()
  const [roles, setRoles] = useState<Role[]>([])
  const [permissions, setPermissions] = useState<Permission[]>([])
  const [editing, setEditing] = useState<Role | null>(null)
  const [checked, setChecked] = useState<Record<string,boolean>>({})

  useEffect(()=>{
    api.get('/roles').then(r=>setRoles(r.data)).catch(()=>push('Failed to load roles'))
    api.get('/roles/permissions').then(r=>setPermissions(r.data)).catch(()=>push('Failed to load permissions'))
  }, [])

  function openEditor(role: Role){
    setEditing(role)
    const map: Record<string,boolean> = {}
    role.permissions.forEach(p => map[p.name] = true)
    setChecked(map)
  }

  function togglePermission(name: string){
    setChecked(s => ({ ...s, [name]: !s[name] }))
  }

  async function save(){
    if (!editing) return
    const names = Object.entries(checked).filter(([,v])=>v).map(([k])=>k)
    try{
      const res = await api.put(`/roles/${editing.id}/permissions`, { permissions: names })
      setRoles(rs => rs.map(r => r.id === res.data.id ? res.data : r))
      push('Role permissions updated')
      setEditing(null)
    }catch(e:any){
      push(e?.response?.data?.detail || 'Failed to update')
    }
  }

  if (!can('role:assign')){
    return <div>You do not have access to this page.</div>
  }

  return (
    <div>
      <h2>Roles</h2>
      <table>
        <thead>
          <tr><th>Name</th><th>Description</th><th>Permissions</th><th /></tr>
        </thead>
        <tbody>
          {roles.map(r => (
            <tr key={r.id}>
              <td>{r.name}</td>
              <td>{r.description}</td>
              <td>{r.permissions.map(p=>p.name).join(', ')}</td>
              <td><button onClick={()=>openEditor(r)}>Edit</button></td>
            </tr>
          ))}
        </tbody>
      </table>

      {editing && (
        <div className="modal">
          <h3>Edit {editing.name}</h3>
          <div>
            {permissions.map(p => (
              <label key={p.id} style={{display:'block'}}>
                <input type="checkbox" checked={!!checked[p.name]} onChange={()=>togglePermission(p.name)} /> {p.name} {p.description ? `— ${p.description}` : ''}
              </label>
            ))}
          </div>
          <div style={{marginTop:10}}>
            <button onClick={save}>Save</button>
            <button onClick={()=>setEditing(null)}>Cancel</button>
          </div>
        </div>
      )}
    </div>
  )
}
import React from 'react'

export default function Roles(){
  return (
    <div className="container">
      <h2>Roles & Permissions</h2>
      <p>Role management UI coming soon. Use this page to assign permissions to roles.</p>
    </div>
  )
}
