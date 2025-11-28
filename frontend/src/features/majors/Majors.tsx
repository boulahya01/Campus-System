import React, { useEffect, useState } from 'react'
import api from '../../api/client'
import { useToast } from '../../contexts/ToastContext'
import useCan from '../../hooks/useCan'
import { Button } from '../../components/Button'
import { Card, CardBody, CardHeader, CardFooter } from '../../components/Card'
import { FormField } from '../../components/FormField'
import { Loading } from '../../components/Loading'

type Major = { id: number; name: string; code?: string }

export default function Majors(){
  const { push } = useToast()
  const { can } = useCan()
  const [majors, setMajors] = useState<Major[]>([])
  const [loading, setLoading] = useState(true)
  const [showForm, setShowForm] = useState(false)
  const [editing, setEditing] = useState<Major | null>(null)
  const [formData, setFormData] = useState({ name: '', code: '' })
  const [saving, setSaving] = useState(false)
  const [deleteId, setDeleteId] = useState<number | null>(null)

  useEffect(() => {
    loadMajors()
  }, [])

  const loadMajors = async () => {
    setLoading(true)
    try {
      const res = await api.get('/majors')
      setMajors(Array.isArray(res.data) ? res.data : [])
    } catch (e) {
      push('Failed to load majors', 'error')
    } finally {
      setLoading(false)
    }
  }

  const openForm = (major?: Major) => {
    if (major) {
      setEditing(major)
      setFormData({ name: major.name, code: major.code || '' })
    } else {
      setEditing(null)
      setFormData({ name: '', code: '' })
    }
    setShowForm(true)
  }

  const closeForm = () => {
    setShowForm(false)
    setEditing(null)
    setFormData({ name: '', code: '' })
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!formData.name.trim()) {
      push('Major name is required', 'error')
      return
    }

    setSaving(true)
    try {
      if (editing) {
        await api.put(`/majors/${editing.id}`, formData)
        setMajors(m => m.map(x => x.id === editing.id ? { ...x, ...formData } : x))
        push('✓ Major updated successfully', 'success')
      } else {
        const res = await api.post('/majors', formData)
        setMajors(m => [...m, res.data])
        push('✓ Major created successfully', 'success')
      }
      closeForm()
    } catch (e: any) {
      push(e?.response?.data?.detail || 'Failed to save major', 'error')
    } finally {
      setSaving(false)
    }
  }

  const handleDelete = async (id: number) => {
    setSaving(true)
    try {
      await api.delete(`/majors/${id}`)
      setMajors(m => m.filter(x => x.id !== id))
      push('✓ Major deleted successfully', 'success')
      setDeleteId(null)
    } catch (e: any) {
      push(e?.response?.data?.detail || 'Failed to delete major', 'error')
    } finally {
      setSaving(false)
    }
  }

  if (!can('major:create') && !can('major:update')) {
    return (
      <div className="container">
        <div className="alert alert-error">You do not have permission to manage majors.</div>
      </div>
    )
  }

  if (loading) return <Loading fullPage message="Loading majors..." />

  return (
    <div className="container">
      <div className="flex-between mb-md" style={{ marginBottom: 'var(--spacing-lg)' }}>
        <div>
          <h1>Majors</h1>
          <p className="text-muted">Manage academic majors and programs</p>
        </div>
        {can('major:create') && (
          <Button variant="primary" size="lg" onClick={() => openForm()}>
            + Create Major
          </Button>
        )}
      </div>

      {majors.length === 0 ? (
        <Card>
          <CardBody>
            <div className="text-center p-lg">
              <p className="text-muted">No majors found. Create one to get started.</p>
            </div>
          </CardBody>
        </Card>
      ) : (
        <div className="grid-2">
          {majors.map(major => (
            <Card key={major.id}>
              <div style={{ marginBottom: 'var(--spacing-md)' }}>
                <h3 style={{ margin: '0 0 var(--spacing-xs) 0' }}>{major.name}</h3>
                {major.code && <p style={{ margin: 0, color: 'var(--text-muted)', fontSize: 'var(--font-size-sm)' }}>Code: {major.code}</p>}
              </div>
              <div style={{ display: 'flex', gap: 'var(--spacing-sm)' }}>
                {can('major:update') && (
                  <Button variant="secondary" size="sm" onClick={() => openForm(major)} className="flex-1">
                    Edit
                  </Button>
                )}
                {can('major:delete') && (
                  <Button variant="error" size="sm" onClick={() => setDeleteId(major.id)} className="flex-1">
                    Delete
                  </Button>
                )}
              </div>
            </Card>
          ))}
        </div>
      )}

      {showForm && (
        <div className="modal-backdrop" onClick={closeForm}>
          <Card className="modal-content" style={{ maxWidth: '500px' }} onClick={e => e.stopPropagation()}>
            <CardHeader>
              <h2 style={{ margin: 0 }}>{editing ? 'Edit Major' : 'Create New Major'}</h2>
            </CardHeader>
            <CardBody>
              <form onSubmit={handleSubmit}>
                <FormField label="Major Name" required>
                  <input 
                    type="text" 
                    value={formData.name}
                    onChange={e => setFormData({...formData, name: e.target.value})}
                    placeholder="e.g., Computer Science"
                  />
                </FormField>

                <FormField label="Code">
                  <input 
                    type="text" 
                    value={formData.code}
                    onChange={e => setFormData({...formData, code: e.target.value})}
                    placeholder="e.g., CS"
                  />
                </FormField>
              </form>
            </CardBody>
            <CardFooter>
              <Button variant="secondary" onClick={closeForm} disabled={saving}>
                Cancel
              </Button>
              <Button variant="primary" onClick={handleSubmit} loading={saving}>
                {editing ? 'Update' : 'Create'}
              </Button>
            </CardFooter>
          </Card>
        </div>
      )}

      {deleteId && (
        <div className="modal-backdrop" onClick={() => setDeleteId(null)}>
          <Card className="modal-content" style={{ maxWidth: '400px' }} onClick={e => e.stopPropagation()}>
            <CardBody>
              <h3>Delete Major?</h3>
              <p>This action cannot be undone. Are you sure?</p>
            </CardBody>
            <CardFooter>
              <Button variant="secondary" onClick={() => setDeleteId(null)} disabled={saving}>
                Cancel
              </Button>
              <Button variant="error" onClick={() => handleDelete(deleteId)} loading={saving}>
                Delete
              </Button>
            </CardFooter>
          </Card>
        </div>
      )}
    </div>
  )
}
