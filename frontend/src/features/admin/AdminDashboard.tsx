import React, { useState } from 'react'
import { useFetch } from '../../hooks'
import { studentsAPI, teachersAPI, modulesAPI, majorsAPI, semestersAPI } from '../../api/endpoints'
import { Link } from 'react-router-dom'
import useCan from '../../hooks/useCan'
import Modal from '../../components/Modal'
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
      <div style={{display:'flex',justifyContent:'space-between',alignItems:'center',marginBottom:12}}>
        <h2 style={{margin:0}}>Admin Dashboard</h2>
        <div style={{display:'flex',gap:8}}>
          {can('major:create') && <button className="primary" onClick={()=>setShowMajorModal(true)}>Create Major</button>}
          {can('semester:create') && <button className="primary" onClick={()=>setShowSemesterModal(true)}>Create Semester</button>}
          {can('module:create') && <button className="ghost" onClick={()=>setShowTeacherModal(true)}>Create Teacher</button>}
          {can('settings:update') && <Link to="/roles"><button className="ghost">Manage Roles</button></Link>}
          {can('rattrapage:create') && <Link to="/rattrapage"><button className="ghost">Rattrapage</button></Link>}
        </div>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: 12 }}>
        <div style={{ background:'#fff', padding:16, borderRadius:8, boxShadow:'0 1px 4px rgba(0,0,0,0.04)' }}>
          <h4 style={{margin:0}}>Students</h4>
          <div style={{fontSize:20,fontWeight:600,marginTop:8}}>{studentsLoading ? '...' : (Array.isArray(students) ? students.length : 0)}</div>
        </div>
        <div style={{ background:'#fff', padding:16, borderRadius:8, boxShadow:'0 1px 4px rgba(0,0,0,0.04)' }}>
          <h4 style={{margin:0}}>Teachers</h4>
          <div style={{fontSize:20,fontWeight:600,marginTop:8}}>{teachersLoading ? '...' : (Array.isArray(teachers) ? teachers.length : 0)}</div>
        </div>
        <div style={{ background:'#fff', padding:16, borderRadius:8, boxShadow:'0 1px 4px rgba(0,0,0,0.04)' }}>
          <h4 style={{margin:0}}>Modules</h4>
          <div style={{fontSize:20,fontWeight:600,marginTop:8}}>{modulesLoading ? '...' : (Array.isArray(modules) ? modules.length : 0)}</div>
        </div>
      </div>

      <Modal open={showMajorModal} title="Create Major" onClose={()=>setShowMajorModal(false)}>
        <div style={{display:'flex',gap:8}}>
          <input value={majorName} onChange={e=>setMajorName(e.target.value)} placeholder="Major name" style={{flex:1,padding:8}} />
          <button className="primary" onClick={createMajor}>Create</button>
        </div>
      </Modal>

      <Modal open={showSemesterModal} title="Create Semester" onClose={()=>setShowSemesterModal(false)}>
        <div style={{display:'flex',gap:8}}>
          <input value={semesterName} onChange={e=>setSemesterName(e.target.value)} placeholder="Semester name" style={{flex:1,padding:8}} />
          <button className="primary" onClick={createSemester}>Create</button>
        </div>
      </Modal>

      <Modal open={showTeacherModal} title="Create Teacher" onClose={()=>setShowTeacherModal(false)}>
        <div style={{display:'flex',gap:8,alignItems:'center'}}>
          <input value={teacherDepartment} onChange={e=>setTeacherDepartment(e.target.value)} placeholder="Department" style={{padding:8,flex:1}} />
          <input value={String(teacherUserId || '')} onChange={e=>setTeacherUserId(e.target.value ? Number(e.target.value) : '')} placeholder="User ID (optional)" style={{padding:8,width:140}} />
          <button className="primary" onClick={createTeacher}>Create</button>
        </div>
      </Modal>

      <div style={{marginTop:20, display:'grid', gridTemplateColumns:'2fr 1fr', gap:12}}>
        <div style={{ background:'#fff', padding:12, borderRadius:8 }}>
          <h3 style={{marginTop:0}}>Recent Students</h3>
          {studentsLoading ? <p>Loading...</p> : (
            Array.isArray(students) && students.length > 0 ? (
              <ul>
                {students.slice(0,5).map((s:any)=>(<li key={s.id}>{s.cne || s.id} — User {s.user_id}</li>))}
              </ul>
            ) : <p>No students yet</p>
          )}
        </div>

        <div style={{ background:'#fff', padding:12, borderRadius:8 }}>
          <h3 style={{marginTop:0}}>Quick Lists</h3>
          <div style={{marginBottom:8}}>
            <strong>Majors:</strong>
            <ul>
              {Array.isArray(majors) && majors.map((m:any)=>(<li key={m.id}>{m.name}</li>))}
            </ul>
          </div>
          <div>
            <strong>Semesters:</strong>
            <ul>
              {Array.isArray(semesters) && semesters.map((s:any)=>(<li key={s.id}>{s.name}</li>))}
            </ul>
          </div>
        </div>
      </div>
    </div>
  )
}
