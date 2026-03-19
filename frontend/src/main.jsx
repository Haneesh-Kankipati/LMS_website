import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import './utils/apiConfig'
import App from './App.jsx'
import AuthContext from './context/authContext.jsx'

createRoot(document.getElementById('root')).render(
  <AuthContext>
    <App />
  </AuthContext>
)
