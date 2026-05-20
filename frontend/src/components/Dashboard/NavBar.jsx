
import React, { useState } from 'react'
import { useAuth } from '../../context/authContext'
import { useNavigate } from 'react-router-dom'

const NavBar = () => {
  const { user, logout } = useAuth()
  const navigate=useNavigate()
  const [isLoading, setIsLoading] = useState(false)
  const handleSubmit=()=>{
    setIsLoading(true)
    logout()
    navigate("/login") 
  }
  return (
    <div className="w-full h-16 bg-gray-900 text-white flex items-center justify-between px-6">
      <h1 className="text-lg font-medium text-blue-300">Welcome {user?.name}</h1>

      <button
        onClick={handleSubmit}
        disabled={isLoading}
        className="bg-blue-700 hover:bg-blue-800 text-white px-4 py-1 rounded-md text-sm disabled:opacity-50 disabled:cursor-not-allowed"
      >
        {isLoading ? "Logging out..." : "Logout"}
      </button>
    </div>
  )
}

export default NavBar
