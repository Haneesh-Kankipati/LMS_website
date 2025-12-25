import React, { useState } from "react";
import { useAuth } from "../../context/authContext";
import { useNavigate } from "react-router-dom";
import axios from "axios";

const Settings = () => {
  const navigate = useNavigate();
  const { user } = useAuth(); 

  const [settings, setSettings] = useState({
    userId: user._id,
    oldPassword: "",
    newPassword: "",
    confirmPassword: "",
  });

  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const [loading, setLoading] = useState(false);

  // 🔁 Handle input change
  const handleChange = (e) => {
    setSettings({
      ...settings,
      [e.target.name]: e.target.value,
    });
  };

  // 🚀 Handle form submit
  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");


    // 🔒 Basic validations
    if (!settings.oldPassword || !settings.newPassword || !settings.confirmPassword) {
      return setError("All fields are required");
    }

    if (settings.newPassword !== settings.confirmPassword) {
      return setError("New passwords do not match");
    }

    try {
        setLoading(true);
        setError("")
        setSuccess("")
            const response = await axios.post('http://localhost:3000/api/settings/change-password',settings,{
                headers:{
                    "Authorization" : `Bearer ${localStorage.getItem('token')}`
                }
            })
            if(response.data.success){
                setSuccess("Password successfully changed")
                setSettings({
                    userId: user._id,
                    oldPassword: "",
                    newPassword: "",
                    confirmPassword: "",
                });

            }
        } catch (error) {
            if(error.response && !error.response.data.success){
                setError(error.response.data.error)
            } 
        }
        finally{
            setLoading(false);
        }
  };

  return (
    <div className="flex justify-center items-center min-h-screen bg-gray-100">
      <form
        onSubmit={handleSubmit}
        className="bg-white p-8 rounded-lg shadow-lg w-full max-w-md"
      >
        <h2 className="text-2xl font-bold text-center mb-6">
          Change Password
        </h2>

        {error && (
          <div className="mb-4 text-red-600 text-sm text-center">
            {error}
          </div>
        )}

        {success && (
            <div className="mb-4 text-green-600 text-sm text-center">
                {success}
            </div>
        )}

        <div className="mb-4">
          <label className="block text-sm font-medium mb-1">
            Old Password
          </label>
          <input
            type="password"
            name="oldPassword"
            value={settings.oldPassword}
            onChange={handleChange}
            className="w-full px-3 py-2 border rounded-md focus:outline-none focus:ring"
          />
        </div>

        <div className="mb-4">
          <label className="block text-sm font-medium mb-1">
            New Password
          </label>
          <input
            type="password"
            name="newPassword"
            value={settings.newPassword}
            onChange={handleChange}
            className="w-full px-3 py-2 border rounded-md focus:outline-none focus:ring"
          />
        </div>

        <div className="mb-6">
          <label className="block text-sm font-medium mb-1">
            Confirm New Password
          </label>
          <input
            type="password"
            name="confirmPassword"
            value={settings.confirmPassword}
            onChange={handleChange}
            className="w-full px-3 py-2 border rounded-md focus:outline-none focus:ring"
          />
        </div>

        <button
          type="submit"
          disabled={loading}
          className="w-full bg-blue-600 text-white py-2 rounded-md hover:bg-blue-700 transition"
        >
          {loading ? "Updating..." : "Update Password"}
        </button>
      </form>
    </div>
  );
};

export default Settings;
