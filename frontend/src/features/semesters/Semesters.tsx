import React, { useEffect, useState } from 'react'
import api from '../../api/client'
import { useToast } from '../../contexts/ToastContext'
import useCan from '../../hooks/useCan'
import { Button } from '../../components/Button'
import { Card, CardBody, CardHeader, CardFooter } from '../../components/Card'
import { FormField } from '../../components/FormField'
import { Loading } from '../../components/Loading'

type Semester = { id: number; name: string; major_id?: number }
type Major = { id: number; name: string }

export default function Semesters(){
  const { push } = useToast()
  const { can } = useCan()
  const [semesters, setSemesters] = useState<Semester[]>([])
  const [majors, setMajors] = useState<Major[]>([])
  const [loading, setLoading] = useState(true)
  const [showForm, setShowForm] = useState(false)
  const [editing, setEditing] = useState<Semester | null>(null)
  const [formData, setFormData] = useState({ name: '', major_id: '' })
  const [saving, setSaving] = useState(false)
  const [deleteId, setDeleteId] = useState<number | null>(null)

  useEffect(() => {
    loadData()
  }, [])

  const loadData = async () => {
    setLoading(true)
    try {
      const [semRes, majRes] = await Promise.all([
        api.get('/semesters'),
        api.get('/majors')
      ])
      setSemesters(Array.isArray(semRes.data) ? semRes.data : [])
      setMajors(Array.isArray(majRes.data) ? majRes.data : [])
    } catch (e) {
      push('Failed to load data', 'error')
    } finally {
      setLoading(false)
    }
  }

  const openForm = (semester?: Semester) => {
    if (semester) {
      setEditing(semester)
      setFormData({ name: semester.name, major_id: semester.major_id?.toString() || '' })
    } else {
      setEditing(null)
      setFormData({ name: '', major_id: '' })
    }
    setShowForm(true)
  }

  const closeForm = () => {
    setShowForm(false)
    setEditing(null)
    setFormData({ name: '', major_id: '' })
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!formData.name.trim()) {
      push('Semester name is required', 'error')
      return
    }

    setSaving(true)
    try {
      const payload = {
        name: formData.name,
        major_id: formData.major_id ? Number(formData.major_id) : undefined
      }

      if (editing) {
        await api.put(`/semesters/${editing.id}`, payload)
        setSemesters(s => s.map(x => x.id === editing.id ? { ...x, ...payload } : x))
        push('✓ Semester updated successfully', 'success')
      } else {
        const res = await api.post('/semesters', payload)
        setSemesters(s => [...s, res.data])
        push('✓ Semester created successfully', 'success')
      }
      closeForm()
    } catch (e: any) {
      push(e?.response?.data?.detail || 'Failed to save semester', 'error')
    } finally {
      setSaving(false)
    }
  }

  const handleDelete = async (id: number) => {
    setSaving(true)
    try {
      await api.delete(`/semesters/${id}`)
      setSemesters(s => s.filter(x => x.id !== id))
      push('✓ Semester deleted successfully', 'success')
      setDeleteId(null)
    } catch (e: any) {
      push(e?.response?.data?.detail || 'Failed to delete semester', 'error')
    } finally {
      setSaving(false)
    }
  }

  if (!can('semester:create') && !can('semester:update')) {
    return (
      <div className="container">
        <div className="alert alert-error">You do not have permission to manage semesters.</div>
      </div>
    )
  }

  if (loading) return <Loading fullPage message="Loading semesters..." />

  return (
    <div className="container">
      <div className="flex-between mb-md" style={{ marginBottom: 'var(--spacing-lg)' }}>
        <div>
          <h1>Semesters</h1>
          <p className="text-muted">Manage academic semesters and terms</p>
        </div>
        {can('semester:create') && (
          <Button variant="primary" size="lg" onClick={() => openForm()}>
            + Create Semester
          </Button>
        )}
      </div>

      {semesters.length === 0 ? (
        <Card>
          <CardBody>
            <div className="text-center p-lg">
              <p className="text-muted">No semesters found. Create one to get started.</p>
            </div>
          </CardBody>
        </Card>
      ) : (
        <Card>
          <div style={{ overflowX: 'auto' }}>
            <table>
              <thead>
                <tr>
                  <th>Name</th>
                  <th>Major</th>
                  <th>Actions</th>
                </tr>
              </thead>
              <tbody>
                {semesters.map(semester => (
                  <tr key={semester.id}>
                    <td>
                      <strong>{semester.name}</strong>
                    </td>
                    <td>
                      {semester.major_id 
                        ? majors.find(m => m.id === semester.major_id)?.name || `ID: ${semester.major_id}`
                        : <span className="text-muted">—</span>
                      }
                    </td>
                    <td>
                      <div style={{ display: 'flex', gap: 'var(--spacing-sm)' }}>
                        {can('semester:update') && (
                          <Button variant="secondary" size="sm" onClick={() => openForm(semester)}>
                            Edit
                          </Button>
                        )}
                        {can('semester:delete') && (
                          <Button variant="error" size="sm" onClick={() => setDeleteId(semester.id)}>
                            Delete
                          </Button>
                        )}
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </Card>
      )}

      {showForm && (
        <div className="modal-backdrop" onClick={closeForm}>
          <Card className="modal-content" style={{ maxWidth: '500px' }} onClick={e => e.stopPropagation()}>
            <CardHeader>
              <h2 style={{ margin: 0 }}>{editing ? 'Edit Semester' : 'Create New Semester'}</h2>
            </CardHeader>
            <CardBody>
              <form onSubmit={handleSubmit}>
                <FormField label="Semester Name" required>
                  <input 
                    type="text" 
                    value={formData.name}
                    onChange={e => setFormData({...formData, name: e.target.value})}
                    placeholder="e.g., Fall 2024"
                  />
                </FormField>

                <FormField label="Major (Optional)">
                  <select 
                    value={formData.major_id}
                    onChange={e => setFormData({...formData, major_id: e.target.value})}
                  >
                    <option value="">-- Select a major --</option>
                    {majors.map(m => (
                      <option key={m.id} value={m.id}>{m.name}</option>
                    ))}
                  </select>
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
              <h3>Delete Semester?</h3>
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
