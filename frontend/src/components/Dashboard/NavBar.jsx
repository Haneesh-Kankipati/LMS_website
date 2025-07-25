
import React from 'react'
import { useAuth } from '../../context/authContext'

const NavBar = () => {
  const { user, logout } = useAuth()

  return (
    <div className="w-full h-16 bg-gray-900 text-white flex items-center justify-between px-6">
      <h1 className="text-lg font-medium text-blue-300">Welcome {user.name}</h1>

      <button
        onClick={logout}
        className="bg-blue-700 hover:bg-blue-800 text-white px-4 py-1 rounded-md text-sm"
      >
        Logout
      </button>
    </div>
  )
}

export default NavBar
