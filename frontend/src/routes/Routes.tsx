import React from 'react'
import { BrowserRouter, Routes, Route } from 'react-router-dom'
import App from '../App'
import Login from '../pages/Login'
import Dashboard from '../pages/Dashboard'
import AdminDashboard from '../pages/AdminDashboard'
import Courses from '../pages/Courses'
import Materials from '../pages/Materials'
import Exams from '../pages/Exams'
import Grades from '../pages/Grades'
import Requests from '../pages/Requests'
import ProtectedRoute from '../components/ProtectedRoute'

export default function AppRoutes(){
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<App />}>
          <Route index element={<ProtectedRoute><Dashboard/></ProtectedRoute>} />
          <Route path="login" element={<Login/>} />
          <Route path="dashboard" element={<ProtectedRoute><Dashboard/></ProtectedRoute>} />
          <Route path="admin" element={<ProtectedRoute><AdminDashboard/></ProtectedRoute>} />
          <Route path="courses" element={<ProtectedRoute><Courses/></ProtectedRoute>} />
          <Route path="materials" element={<ProtectedRoute><Materials/></ProtectedRoute>} />
          <Route path="exams" element={<ProtectedRoute><Exams/></ProtectedRoute>} />
          <Route path="grades" element={<ProtectedRoute><Grades/></ProtectedRoute>} />
          <Route path="requests" element={<ProtectedRoute><Requests/></ProtectedRoute>} />
        </Route>
      </Routes>
    </BrowserRouter>
  )
}
