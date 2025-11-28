import React, { useEffect, useState } from 'react'
import api from '../../api/client'
import { useToast } from '../../contexts/ToastContext'
import useCan from '../../hooks/useCan'
import { Button } from '../../components/Button'
import { Card, CardBody, CardFooter } from '../../components/Card'
import { Loading } from '../../components/Loading'
import { Badge } from '../../components/Badge'

type Permission = { id: number; name: string; description?: string }
type Role = { id: number; name: string; description?: string; permissions: Permission[] }

export default function Roles(){
  const { push } = useToast()
  const { can } = useCan()
  const [roles, setRoles] = useState<Role[]>([])
  const [permissions, setPermissions] = useState<Permission[]>([])
  const [editing, setEditing] = useState<Role | null>(null)
  const [checked, setChecked] = useState<Record<string,boolean>>({})
  const [loading, setLoading] = useState(true)
  const [saving, setSaving] = useState(false)

  useEffect(()=>{
    const load = async () => {
      setLoading(true)
      try {
        const [rolesRes, permsRes] = await Promise.all([
          api.get('/roles'),
          api.get('/roles/permissions')
        ])
        setRoles(rolesRes.data)
        setPermissions(permsRes.data)
      } catch(e) {
        push('Failed to load roles and permissions')
      } finally {
        setLoading(false)
      }
    }
    load()
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
    setSaving(true)
    const names = Object.entries(checked).filter(([,v])=>v).map(([k])=>k)
    try{
      const res = await api.put(`/roles/${editing.id}/permissions`, { permissions: names })
      setRoles(rs => rs.map(r => r.id === res.data.id ? res.data : r))
      push('✓ Role permissions updated successfully', 'success')
      setEditing(null)
    }catch(e:any){
      push(e?.response?.data?.detail || 'Failed to update role', 'error')
    } finally {
      setSaving(false)
    }
  }

  if (!can('role:assign')){
    return (
      <div className="container">
        <div className="alert alert-error">You do not have permission to manage roles.</div>
      </div>
    )
  }

  if (loading) return <Loading fullPage message="Loading roles..." />

  return (
    <div className="container">
      <div style={{ marginBottom: 'var(--spacing-lg)' }}>
        <h1>Role Management</h1>
        <p className="text-muted">Manage role permissions and access controls</p>
      </div>

      <div className="grid-2">
        {roles.map(role => (
          <Card key={role.id}>
            <div style={{ marginBottom: 'var(--spacing-md)' }}>
              <h3 style={{ margin: '0 0 var(--spacing-sm) 0' }}>{role.name}</h3>
              {role.description && <p style={{ margin: 0, color: 'var(--text-muted)', fontSize: 'var(--font-size-sm)' }}>{role.description}</p>}
            </div>
            
            <div style={{ marginBottom: 'var(--spacing-md)' }}>
              <label style={{ fontSize: 'var(--font-size-sm)', fontWeight: 500, marginBottom: 'var(--spacing-sm)' }}>Permissions ({role.permissions.length})</label>
              <div style={{ display: 'flex', flexWrap: 'wrap', gap: 'var(--spacing-xs)' }}>
                {role.permissions.length > 0 ? (
                  role.permissions.slice(0, 3).map(p => (
                    <Badge key={p.id} type="primary">{p.name}</Badge>
                  ))
                ) : (
                  <span className="text-muted" style={{ fontSize: 'var(--font-size-sm)' }}>No permissions assigned</span>
                )}
                {role.permissions.length > 3 && (
                  <Badge type="primary">+{role.permissions.length - 3} more</Badge>
                )}
              </div>
            </div>

            <Button onClick={() => openEditor(role)} variant="primary" size="sm" className="btn-block">
              Edit Permissions
            </Button>
          </Card>
        ))}
      </div>

      {editing && (
        <div className="modal-backdrop" onClick={() => setEditing(null)}>
          <Card className="modal-content" style={{ maxWidth: '500px', maxHeight: '80vh', overflow: 'auto' }} onClick={e => e.stopPropagation()}>
            <div style={{ marginBottom: 'var(--spacing-lg)' }}>
              <h2 style={{ margin: 0, marginBottom: 'var(--spacing-sm)' }}>Edit {editing.name} Permissions</h2>
              <p className="text-muted" style={{ margin: 0, fontSize: 'var(--font-size-sm)' }}>Select which permissions this role should have</p>
            </div>

            <div className="checkbox-group" style={{ marginBottom: 'var(--spacing-lg)' }}>
              {permissions.map(p => (
                <label key={p.id} className="checkbox-label">
                  <input 
                    type="checkbox" 
                    checked={!!checked[p.name]} 
                    onChange={() => togglePermission(p.name)} 
                  /> 
                  <span>
                    <strong>{p.name}</strong>
                    {p.description && <div className="text-sm text-muted">{p.description}</div>}
                  </span>
                </label>
              ))}
            </div>

            <div style={{ display: 'flex', gap: 'var(--spacing-sm)', justifyContent: 'flex-end' }}>
              <Button variant="secondary" onClick={() => setEditing(null)} disabled={saving}>
                Cancel
              </Button>
              <Button variant="success" onClick={save} loading={saving}>
                Save Changes
              </Button>
            </div>
          </Card>
        </div>
      )}
    </div>
  )
}

