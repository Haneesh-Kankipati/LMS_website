import { useState } from "react";
import axios from "axios";
import { useAuth } from "../context/authContext";
import { useNavigate } from "react-router-dom";

export default function Login() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState(null);
  const {login}=useAuth()
  const navigate = useNavigate()
  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
        const response = await axios.post(
            "http://localhost:3000/api/auth/login",
            {email,password}
        );
        if(response.data.success){
          login(response.data.user)
          localStorage.setItem("token",response.data.token)
          if(response.data.user.role === "admin"){
            navigate('/admin-dashboard')
          }else {
            navigate('/student-dashboard')
          }
        }
    } catch (error) {
        if(error.response && !error.response.data.success){
          setError(error.response.data.error)
        } else{
          setError("Server Error")
        }
    }
    // TODO: Add login logic here
  };

  return (
     <div className="flex flex-col items-center h-screen justify-center bg-gradient-to-b from-blue-600 from-50% to-blue-200 to-50% space-y-6"
>
      <div className="bg-white rounded-lg shadow-xl p-8 w-full max-w-md">
        <h2 className="text-3xl font-bold text-center mb-6 text-blue-700">
          Waves Preschool
        </h2>
        <h3 className="text-xl font-semibold text-left mb-6">Login</h3>
        {error && <p className="text-red-500">{error}</p>}
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700">Email</label>
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
              className="mt-1 w-full px-4 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-teal-500"
              placeholder="Enter Email"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700">Password</label>
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
              className="mt-1 w-full px-4 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-teal-500"
              placeholder="••••••••"
            />
          </div>
          <div className="flex items-center justify-between text-sm">
            <label className="flex items-center gap-2">
              <input type="checkbox" className="accent-teal-600" />
              Remember me
            </label>
            <a href="#" className="text-blue-600 hover:underline">
              Forgot password?
            </a>
          </div>
          <button
            type="submit"
            className="w-full py-2 font-semibold text-white bg-blue-600 rounded-md hover:bg-teal-700"
          >
            Login
          </button>
        </form>
      </div>
    </div>
  );
}
