import { useState } from "react";
import axios from "axios";
import { useAuth } from "../context/authContext";
import { useNavigate } from "react-router-dom";
import { useEffect } from "react";

export default function Login() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState(null);
  const { login, user } = useAuth();
  const navigate = useNavigate();
  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const response = await axios.post(
        "http://localhost:3000/api/auth/login",
        { email, password }
      );
      if (response.data.success) {
        login(response.data.user);
        localStorage.setItem("token", response.data.token);
      }
    } catch (error) {
      if (error.response && !error.response.data.success) {
        setError(error.response.data.error);
      } else {
        setError("Server Error");
      }
    }
  };

  useEffect(() => {
    if (!user) return

    if (user.role === "admin") {
      navigate("/admin-dashboard")
    } else {
      navigate("/student-dashboard")
    }
  }, [user, navigate])

  return (
    <div className="relative flex flex-col items-center min-h-screen justify-center bg-gradient-to-b from-blue-600 from-50% to-blue-200 to-50%">
      <img
        src="http://localhost:3000/receipt/waveslogo-removebg-preview.png"
        alt="Waves Logo"
        className="absolute top-4 right-4 w-40 h-40 object-contain"
      />

      <div className="relative bg-white rounded-lg shadow-xl p-8 w-full max-w-md">
        <h2 className="text-3xl font-bold text-center mb-6 text-blue-700">
          Waves Preschool
        </h2>
        <h3 className="text-xl font-semibold text-left mb-6">Login</h3>
        {error && <p className="text-red-500">{error}</p>}
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700">Email/Phone Number</label>
            <input
              type="text"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
              className="mt-1 w-full px-4 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
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
              className="mt-1 w-full px-4 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              placeholder="••••••••"
            />
          </div>
          <button
            type="submit"
            className="w-full py-2 font-semibold text-white bg-blue-600 rounded-md hover:bg-blue-700"
          >
            Login
          </button>
        </form>
      </div>

      <footer className="fixed bottom-0 left-0 right-0 bg-white/80 text-center py-2 text-sm text-gray-600 border-t">
        Made by Haneesh Kankipati
      </footer>
    </div>
  );
}
