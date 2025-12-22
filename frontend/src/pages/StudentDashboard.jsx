import React from 'react'
import { Outlet } from 'react-router-dom'
import NavBar from '../components/Dashboard/NavBar'
import StudentSidebar from '../components/StudentDashboard/StudentSidebar'

const StudentDashboard = () => {
  return (
    <div className="flex">
      <div className="w-64 fixed h-screen">
        <StudentSidebar />
      </div>
      <div className="ml-64 flex-1 flex flex-col min-h-screen bg-gray-100">
        <NavBar />
        <Outlet/>
      </div>
    </div>
  )
}

export default StudentDashboard