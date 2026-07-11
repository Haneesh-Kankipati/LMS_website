import React, { useEffect, useState } from 'react'
import { NavLink } from 'react-router-dom'
import {
  FaTachometerAlt,
  FaUserGraduate,
  FaBook,
  FaMoneyCheckAlt,
  FaCog,
  FaCalendarAlt,
  FaImage
} from 'react-icons/fa'
import axios from '../../utils/apiConfig'

const AdminSidebar = () => {
  const [courses, setCourses] = useState([])
  const [coursesLoading, setCoursesLoading] = useState(true)
  const [paymentsExpanded, setPaymentsExpanded] = useState(false)

  useEffect(() => {
    const fetchCourses = async () => {
      try {
        const response = await axios.get('/api/course')
        if (response.data.success) {
          setCourses(response.data.courses || [])
        }
      } catch (error) {
        console.error('Failed to load courses for sidebar:', error)
      } finally {
        setCoursesLoading(false)
      }
    }

    fetchCourses()
  }, [])

  const linkStyle = ({ isActive }) =>
    `flex items-center gap-3 px-4 py-3 rounded-md font-medium text-sm transition-all duration-200 ${
      isActive
        ? 'bg-blue-500 text-white'
        : 'text-white hover:bg-blue-600 hover:text-white'
    }`

  const courseLinkStyle = ({ isActive }) =>
    `block px-4 py-2 rounded-md text-sm transition-all duration-200 ${
      isActive ? 'bg-blue-600 text-white' : 'text-gray-300 hover:bg-blue-600 hover:text-white'
    }`

  return (
    <div className="h-screen w-64 bg-gray-900 text-white flex flex-col p-4">
      <h2 className="text-2xl font-bold text-blue-300 mb-6 text-center">
        Student MS
      </h2>

      <NavLink to="/admin-dashboard" className={linkStyle} end>
        <FaTachometerAlt />
        <span>Dashboard</span>
      </NavLink>

      <NavLink to="/admin-dashboard/gallery" className={linkStyle}>
        <FaImage />
        <span>Gallery</span>
      </NavLink>

      <NavLink to="/admin-dashboard/students" className={linkStyle}>
        <FaUserGraduate />
        <span>Students</span>
      </NavLink>

      <NavLink to="/admin-dashboard/courses" className={linkStyle} end>
        <FaBook />
        <span>Courses</span>
      </NavLink>

      <button
        type="button"
        className="flex items-center gap-3 px-4 py-3 rounded-md font-medium text-sm text-white hover:bg-blue-600 hover:text-white transition-all duration-200"
        onClick={() => setPaymentsExpanded((prev) => !prev)}
      >
        <FaCalendarAlt />
        <span>List Payments</span>
      </button>

      {paymentsExpanded && (
        <div className="mt-2 space-y-1">
          {coursesLoading ? (
            <div className="px-4 py-2 text-sm text-gray-400">Loading courses...</div>
          ) : courses.length === 0 ? (
            <div className="px-4 py-2 text-sm text-gray-400">No courses available.</div>
          ) : (
            courses.map((course) => (
              <NavLink
                key={course._id}
                to={`/admin-dashboard/list-payments/${course._id}`}
                className={courseLinkStyle}
              >
                {course.course_name}
              </NavLink>
            ))
          )}
        </div>
      )}

      <NavLink to="/admin-dashboard/feepayments" className={linkStyle}>
        <FaMoneyCheckAlt />
        <span>Fee Payments</span>
      </NavLink>

      <NavLink to="/admin-dashboard/settings" className={linkStyle}>
        <FaCog />
        <span>Settings</span>
      </NavLink>
    </div>
  )
}

export default AdminSidebar
