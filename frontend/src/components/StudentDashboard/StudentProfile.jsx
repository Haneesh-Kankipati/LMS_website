import React from 'react'
import { useAuth } from '../../context/authContext'

const StudentProfile = () => {
    const {user}=useAuth()
  return (
    <div>StudentProfile</div>
  )
}

export default StudentProfile