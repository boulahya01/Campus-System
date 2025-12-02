import React from 'react'
import { BrowserRouter, Routes, Route } from 'react-router-dom'
import App from '../App'
import Login from '../features/auth/Login'
import Dashboard from '../features/dashboard/Dashboard'
import AdminDashboard from '../features/admin/AdminDashboard'
import Courses from '../features/courses/Courses'
import Materials from '../features/materials/Materials'
import Students from '../features/students/Students'
import Teachers from '../features/teachers/Teachers'
import Majors from '../features/majors/Majors'
import Semesters from '../features/semesters/Semesters'
import Exams from '../features/exams/Exams'
import Grades from '../features/grades/Grades'
import Requests from '../features/requests/Requests'
import ProtectedRoute from '../components/ProtectedRoute'
import Roles from '../features/roles/Roles'
import Rattrapage from '../features/rattrapage/Rattrapage'
import StudentDashboard from '../features/student/StudentDashboard'
import StudentEnrollments from '../features/student/StudentEnrollments'
import StudentTranscript from '../features/student/StudentTranscript'
import StudentSchedule from '../features/student/StudentSchedule'
import StudentProfile from '../features/student/StudentProfile'

export default function AppRoutes(){
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<App />}>
          <Route index element={<ProtectedRoute><Dashboard/></ProtectedRoute>} />
          <Route path="login" element={<Login/>} />
          <Route path="dashboard" element={<ProtectedRoute><Dashboard/></ProtectedRoute>} />
          <Route path="admin" element={<ProtectedRoute><AdminDashboard/></ProtectedRoute>} />
          <Route path="students" element={<ProtectedRoute><Students/></ProtectedRoute>} />
          <Route path="teachers" element={<ProtectedRoute><Teachers/></ProtectedRoute>} />
          <Route path="majors" element={<ProtectedRoute><Majors/></ProtectedRoute>} />
          <Route path="semesters" element={<ProtectedRoute><Semesters/></ProtectedRoute>} />
          <Route path="courses" element={<ProtectedRoute><Courses/></ProtectedRoute>} />
          <Route path="materials" element={<ProtectedRoute><Materials/></ProtectedRoute>} />
          <Route path="exams" element={<ProtectedRoute><Exams/></ProtectedRoute>} />
          <Route path="grades" element={<ProtectedRoute><Grades/></ProtectedRoute>} />
          <Route path="requests" element={<ProtectedRoute><Requests/></ProtectedRoute>} />
          <Route path="roles" element={<ProtectedRoute><Roles/></ProtectedRoute>} />
          <Route path="rattrapage" element={<ProtectedRoute><Rattrapage/></ProtectedRoute>} />
          
          {/* Student Routes */}
          <Route path="student/dashboard" element={<ProtectedRoute><StudentDashboard/></ProtectedRoute>} />
          <Route path="student/enrollments" element={<ProtectedRoute><StudentEnrollments/></ProtectedRoute>} />
          <Route path="student/transcript" element={<ProtectedRoute><StudentTranscript/></ProtectedRoute>} />
          <Route path="student/schedule" element={<ProtectedRoute><StudentSchedule/></ProtectedRoute>} />
          <Route path="student/profile" element={<ProtectedRoute><StudentProfile/></ProtectedRoute>} />
        </Route>
      </Routes>
    </BrowserRouter>
  )
}
