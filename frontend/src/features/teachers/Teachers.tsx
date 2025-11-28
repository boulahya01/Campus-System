import React, { useEffect, useState } from 'react'
import api from '../../api/client'
import { useToast } from '../../contexts/ToastContext'
import useCan from '../../hooks/useCan'
import { Button } from '../../components/Button'
import { Card, CardBody, CardHeader, CardFooter } from '../../components/Card'
import { FormField } from '../../components/FormField'
import { Loading } from '../../components/Loading'

type Teacher = { id: number; department: string; user_id: number }

export default function Teachers(){
  const { push } = useToast()
  const { can } = useCan()
  const [teachers, setTeachers] = useState<Teacher[]>([])
  const [loading, setLoading] = useState(true)
  const [showForm, setShowForm] = useState(false)
  const [editing, setEditing] = useState<Teacher | null>(null)
  const [formData, setFormData] = useState({ department: '', user_id: '' })
  const [saving, setSaving] = useState(false)
  const [deleteId, setDeleteId] = useState<number | null>(null)

  useEffect(() => {
    loadTeachers()
  }, [])

  const loadTeachers = async () => {
    setLoading(true)
    try {
      const res = await api.get('/teachers')
      setTeachers(Array.isArray(res.data) ? res.data : [])
    } catch (e) {
      push('Failed to load teachers', 'error')
    } finally {
      setLoading(false)
    }
  }

  const openForm = (teacher?: Teacher) => {
    if (teacher) {
      setEditing(teacher)
      setFormData({ department: teacher.department, user_id: teacher.user_id.toString() })
    } else {
      setEditing(null)
      setFormData({ department: '', user_id: '' })
    }
    setShowForm(true)
  }

  const closeForm = () => {
    setShowForm(false)
    setEditing(null)
    setFormData({ department: '', user_id: '' })
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!formData.department.trim()) {
      push('Department is required', 'error')
      return
    }

    setSaving(true)
    try {
      const payload = {
        department: formData.department,
        user_id: formData.user_id ? Number(formData.user_id) : undefined
      }

      if (editing) {
        await api.put(`/teachers/${editing.id}`, payload)
        setTeachers(t => t.map(x => x.id === editing.id ? { ...x, ...payload } as Teacher : x))
        push('✓ Teacher updated successfully', 'success')
      } else {
        const res = await api.post('/teachers', payload)
        setTeachers(t => [...t, res.data])
        push('✓ Teacher created successfully', 'success')
      }
      closeForm()
    } catch (e: any) {
      push(e?.response?.data?.detail || 'Failed to save teacher', 'error')
    } finally {
      setSaving(false)
    }
  }

  const handleDelete = async (id: number) => {
    setSaving(true)
    try {
      await api.delete(`/teachers/${id}`)
      setTeachers(t => t.filter(x => x.id !== id))
      push('✓ Teacher deleted successfully', 'success')
      setDeleteId(null)
    } catch (e: any) {
      push(e?.response?.data?.detail || 'Failed to delete teacher', 'error')
    } finally {
      setSaving(false)
    }
  }

  if (!can('module:assign_teacher') && !can('teacher:create')) {
    return (
      <div className="container">
        <div className="alert alert-error">You do not have permission to manage teachers.</div>
      </div>
    )
  }

  if (loading) return <Loading fullPage message="Loading teachers..." />

  return (
    <div className="container">
      <div className="flex-between mb-md" style={{ marginBottom: 'var(--spacing-lg)' }}>
        <div>
          <h1>Teachers</h1>
          <p className="text-muted">Manage faculty and teaching staff</p>
        </div>
        {can('module:assign_teacher') && (
          <Button variant="primary" size="lg" onClick={() => openForm()}>
            + Add Teacher
          </Button>
        )}
      </div>

      {teachers.length === 0 ? (
        <Card>
          <CardBody>
            <div className="text-center p-lg">
              <p className="text-muted">No teachers found. Add one to get started.</p>
            </div>
          </CardBody>
        </Card>
      ) : (
        <Card>
          <div style={{ overflowX: 'auto' }}>
            <table>
              <thead>
                <tr>
                  <th>ID</th>
                  <th>Department</th>
                  <th>User ID</th>
                  <th>Actions</th>
                </tr>
              </thead>
              <tbody>
                {teachers.map(teacher => (
                  <tr key={teacher.id}>
                    <td>
                      <strong>#{teacher.id}</strong>
                    </td>
                    <td>{teacher.department}</td>
                    <td>{teacher.user_id}</td>
                    <td>
                      <div style={{ display: 'flex', gap: 'var(--spacing-sm)' }}>
                        {can('module:assign_teacher') && (
                          <Button variant="secondary" size="sm" onClick={() => openForm(teacher)}>
                            Edit
                          </Button>
                        )}
                        {can('module:assign_teacher') && (
                          <Button variant="error" size="sm" onClick={() => setDeleteId(teacher.id)}>
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
              <h2 style={{ margin: 0 }}>{editing ? 'Edit Teacher' : 'Add New Teacher'}</h2>
            </CardHeader>
            <CardBody>
              <form onSubmit={handleSubmit}>
                <FormField label="Department" required>
                  <input 
                    type="text" 
                    value={formData.department}
                    onChange={e => setFormData({...formData, department: e.target.value})}
                    placeholder="e.g., Computer Science, Mathematics"
                  />
                </FormField>

                <FormField label="User ID">
                  <input 
                    type="number" 
                    value={formData.user_id}
                    onChange={e => setFormData({...formData, user_id: e.target.value})}
                    placeholder="Link to user account (optional)"
                  />
                </FormField>
              </form>
            </CardBody>
            <CardFooter>
              <Button variant="secondary" onClick={closeForm} disabled={saving}>
                Cancel
              </Button>
              <Button variant="primary" onClick={handleSubmit} loading={saving}>
                {editing ? 'Update' : 'Add'}
              </Button>
            </CardFooter>
          </Card>
        </div>
      )}

      {deleteId && (
        <div className="modal-backdrop" onClick={() => setDeleteId(null)}>
          <Card className="modal-content" style={{ maxWidth: '400px' }} onClick={e => e.stopPropagation()}>
            <CardBody>
              <h3>Delete Teacher?</h3>
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
