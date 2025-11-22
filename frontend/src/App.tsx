import React from 'react'
import { Outlet, useLocation } from 'react-router-dom'
import Navbar from './components/Navbar'

export default function App(){
  const location = useLocation()
  const hideNavbarOn = ['/login']
  const showNavbar = !hideNavbarOn.includes(location.pathname)

  return (
    <div>
      {showNavbar && <Navbar />}
      <main style={{ padding: '20px' }}>
        <Outlet />
      </main>
    </div>
  )
}
