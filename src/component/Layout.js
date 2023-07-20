import React from 'react'
import { Navigate, Outlet } from 'react-router-dom'
import Navbar from './Navbar'

const Layout = () => {
  if (!localStorage.getItem('token')) return <Navigate to="/login" />
  return (
    <main>
      <Navbar />
      <Outlet />
    </main>
  )
}

export default Layout