import React, { useState } from 'react'
import { useFetch } from '../../hooks'
import { studentsAPI, teachersAPI, modulesAPI, majorsAPI, semestersAPI } from '../../api/endpoints'
import { Link } from 'react-router-dom'
import useCan from '../../hooks/useCan'
import Modal from '../../components/Modal'
import { Button } from '../../components/Button'
import { useToast } from '../../contexts/ToastContext'

export default function AdminDashboard(){
  const { can } = useCan()
  const { push } = useToast()
  const [showMajorModal, setShowMajorModal] = useState(false)
  const [showSemesterModal, setShowSemesterModal] = useState(false)
  const [showTeacherModal, setShowTeacherModal] = useState(false)
  const [majorName, setMajorName] = useState('')
  const [semesterName, setSemesterName] = useState('')
  const [teacherDepartment, setTeacherDepartment] = useState('')
  const [teacherUserId, setTeacherUserId] = useState<number | ''>('')
  const { data: students, loading: studentsLoading } = useFetch(
    () => studentsAPI.list(0, 10),
    []
  )
  const { data: teachers, loading: teachersLoading } = useFetch(
    () => teachersAPI.list(0, 10),
    []
  )
  const { data: modules, loading: modulesLoading } = useFetch(
    () => modulesAPI.list(undefined, 0, 10),
    []
  )
  const { data: majors } = useFetch(() => majorsAPI.list(0,5), [])
  const { data: semesters } = useFetch(() => semestersAPI.list(0,5), [])

  async function createMajor() {
    try{
      await majorsAPI.create({ name: majorName })
      push('Major created', 'success')
      setMajorName('')
      setShowMajorModal(false)
    }catch(err:any){ push(err?.response?.data?.detail || 'Failed', 'error') }
  }

  async function createSemester() {
    try{
      await semestersAPI.create({ name: semesterName })
      push('Semester created', 'success')
      setSemesterName('')
      setShowSemesterModal(false)
    }catch(err:any){ push(err?.response?.data?.detail || 'Failed', 'error') }
  }

  async function createTeacher() {
    try{
      await teachersAPI.create({ department: teacherDepartment, user_id: teacherUserId || undefined })
      push('Teacher created', 'success')
      setTeacherDepartment('')
      setTeacherUserId('')
      setShowTeacherModal(false)
    }catch(err:any){ push(err?.response?.data?.detail || 'Failed', 'error') }
  }

  return (
    <div className="container">
      <div style={{display:'flex',justifyContent:'space-between',alignItems:'center',marginBottom:32}}>
        <h2 style={{margin:0}}>Admin Dashboard</h2>
        <div style={{display:'flex',gap:12}}>
          {can('major:create') && <Button variant="primary" onClick={()=>setShowMajorModal(true)}>Create Major</Button>}
          {can('semester:create') && <Button variant="primary" onClick={()=>setShowSemesterModal(true)}>Create Semester</Button>}
          {can('module:create') && <Button variant="ghost" onClick={()=>setShowTeacherModal(true)}>Create Teacher</Button>}
          {can('settings:update') && <Link to="/roles"><Button variant="ghost">Manage Roles</Button></Link>}
          {can('rattrapage:create') && <Link to="/rattrapage"><Button variant="ghost">Rattrapage</Button></Link>}
        </div>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: 24, marginBottom: 32 }}>
        <div style={{ background:'var(--bg-primary)', padding:24, borderRadius:8, boxShadow: 'var(--shadow-sm)' }}>
          <h4 style={{margin:0, marginBottom: 12}}>Students</h4>
          <div style={{fontSize:20,fontWeight:600}}>{studentsLoading ? '...' : (Array.isArray(students) ? students.length : 0)}</div>
        </div>
        <div style={{ background:'var(--bg-primary)', padding:24, borderRadius:8, boxShadow: 'var(--shadow-sm)' }}>
          <h4 style={{margin:0, marginBottom: 12}}>Teachers</h4>
          <div style={{fontSize:20,fontWeight:600}}>{teachersLoading ? '...' : (Array.isArray(teachers) ? teachers.length : 0)}</div>
        </div>
        <div style={{ background:'var(--bg-primary)', padding:24, borderRadius:8, boxShadow: 'var(--shadow-sm)' }}>
          <h4 style={{margin:0, marginBottom: 12}}>Modules</h4>
          <div style={{fontSize:20,fontWeight:600}}>{modulesLoading ? '...' : (Array.isArray(modules) ? modules.length : 0)}</div>
        </div>
      </div>

      <Modal open={showMajorModal} title="Create Major" onClose={()=>setShowMajorModal(false)}>
        <div style={{display:'flex',gap:12,marginBottom:12}}>
          <input value={majorName} onChange={e=>setMajorName(e.target.value)} placeholder="Major name" style={{flex:1,padding:12}} />
          <Button variant="primary" onClick={createMajor}>Create</Button>
        </div>
      </Modal>

      <Modal open={showSemesterModal} title="Create Semester" onClose={()=>setShowSemesterModal(false)}>
        <div style={{display:'flex',gap:12,marginBottom:12}}>
          <input value={semesterName} onChange={e=>setSemesterName(e.target.value)} placeholder="Semester name" style={{flex:1,padding:12}} />
          <Button variant="primary" onClick={createSemester}>Create</Button>
        </div>
      </Modal>

      <Modal open={showTeacherModal} title="Create Teacher" onClose={()=>setShowTeacherModal(false)}>
        <div style={{display:'flex',gap:12,alignItems:'center',marginBottom:12}}>
          <input value={teacherDepartment} onChange={e=>setTeacherDepartment(e.target.value)} placeholder="Department" style={{padding:12,flex:1}} />
          <input value={String(teacherUserId || '')} onChange={e=>setTeacherUserId(e.target.value ? Number(e.target.value) : '')} placeholder="User ID (optional)" style={{padding:12,width:140}} />
          <Button variant="primary" onClick={createTeacher}>Create</Button>
        </div>
      </Modal>

      <div style={{marginTop:32, display:'grid', gridTemplateColumns:'2fr 1fr', gap:24}}>
        <div style={{ background:'var(--bg-primary)', padding:24, borderRadius:8 }}>
          <h3 style={{marginTop:0, marginBottom: 16}}>Recent Students</h3>
          {studentsLoading ? <p>Loading...</p> : (
            Array.isArray(students) && students.length > 0 ? (
              <ul>
                {students.slice(0,5).map((s:any)=>(<li key={s.id}>{s.cne || s.id} — User {s.user_id}</li>))}
              </ul>
            ) : <p>No students yet</p>
          )}
        </div>

        <div style={{ background:'var(--bg-primary)', padding:24, borderRadius:8 }}>
          <h3 style={{marginTop:0, marginBottom: 16}}>Quick Lists</h3>
          <div style={{marginBottom:16}}>
            <strong style={{display:'block', marginBottom: 8}}>Majors:</strong>
            <ul>
              {Array.isArray(majors) && majors.map((m:any)=>(<li key={m.id} style={{marginBottom: 8}}>{m.name}</li>))}
            </ul>
          </div>
          <div>
            <strong style={{display:'block', marginBottom: 8}}>Semesters:</strong>
            <ul>
              {Array.isArray(semesters) && semesters.map((s:any)=>(<li key={s.id} style={{marginBottom: 8}}>{s.name}</li>))}
            </ul>
          </div>
        </div>
      </div>
    </div>
  )
}
