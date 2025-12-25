import React from 'react'
import { NavLink } from 'react-router-dom'
import {
  FaTachometerAlt,
  FaUserGraduate,
  FaBook,
  FaMoneyCheckAlt,
  FaCog,
  FaCalendarAlt
} from 'react-icons/fa'

const StudentSidebar = () => {
  const linkStyle = ({ isActive }) =>
    `flex items-center gap-3 px-4 py-3 rounded-md font-medium text-sm transition-all duration-200 ${
      isActive
        ? 'bg-blue-500 text-white'
        : 'text-white hover:bg-blue-600 hover:text-white'
    }`

  return (
    <div className="h-screen w-64 bg-gray-900 text-white flex flex-col p-4">
      <h2 className="text-2xl font-bold text-blue-300 mb-6 text-center">
        Student MS
      </h2>

      <NavLink to="/student-dashboard" className={linkStyle} end>
        <FaTachometerAlt />
        <span>Dashboard</span>
      </NavLink>

      <NavLink to="/student-dashboard/profile" className={linkStyle}>
        <FaUserGraduate />
        <span>My Profile</span>
      </NavLink>

      <NavLink to="/student-dashboard/feepayments" className={linkStyle}>
        <FaMoneyCheckAlt />
        <span>Fee Payments</span>
      </NavLink>

      <NavLink to="/student-dashboard/settings" className={linkStyle}>
        <FaCog />
        <span>Settings</span>
      </NavLink>
    </div>
  )
}

export default StudentSidebar
