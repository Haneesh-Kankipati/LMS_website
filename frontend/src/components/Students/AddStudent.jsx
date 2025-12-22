import React, { useState, useEffect } from 'react'
import { fetchCourses } from '../../utils/StudentHelper'
import axios from 'axios'
import { useNavigate } from 'react-router-dom'

const AddStudent = () => {
  const navigate = useNavigate()
  const [form, setForm] = useState({
    std_name: "",
    parent_name: "",
    std_id:"",
    ph_number: "",
    std_dob: "",
    std_gender: "",
    std_course: "",
    fee_structure: "",
    std_password: "",
    image: null
  })
  const [courses, setCourses] = useState([])

  useEffect(() => {
    const getCourses = async () => {
      const courses = await fetchCourses()
      setCourses(courses)
    }
    getCourses()
  }, [])

  const handleChange = (e) => {
    const { name, value, type, files } = e.target
    setForm(prev => ({
      ...prev,
      [name]: type === "file" ? files[0] : value
    }))
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    const formDataObj = new FormData()
    formDataObj.append("std_name", form.std_name)
    formDataObj.append("parent_name", form.parent_name)
    formDataObj.append("std_id", form.std_id)
    formDataObj.append("ph_number", form.ph_number)
    formDataObj.append("std_dob", form.std_dob)
    formDataObj.append("std_gender", form.std_gender)
    formDataObj.append("std_course", form.std_course)
    formDataObj.append("fee_structure", form.fee_structure)
    formDataObj.append("std_password", form.std_password)
    if (form.image) {
      formDataObj.append("image", form.image)
    }

    try {
      const response = await axios.post('http://localhost:3000/api/student/add', formDataObj, {
        headers: {
          "Authorization": `Bearer ${localStorage.getItem('token')}`
        }
      })
      if (response.data.success) {
        navigate("/admin-dashboard/students")
      }
    } catch (error) {
      if (error.response && error.response.data && error.response.data.error) {
        alert(error.response.data.error)
      } else {
        alert("An error occurred")
      }
    }
  }

  return (
  <form
    className="min-h-screen w-full flex flex-col justify-center items-center bg-white p-8"
    onSubmit={handleSubmit}
  >
    <div className="w-full max-w-3xl bg-white rounded shadow p-8">
      <h2 className="text-2xl font-bold mb-8 text-left">Add New Student</h2>
      <div className="flex gap-8 mb-6">
        <div className="w-1/2">
          <label className="block mb-2">Student Name</label>
          <input
            type="text"
            name="std_name"
            value={form.std_name}
            onChange={handleChange}
            className="w-full border px-4 py-2 rounded text-lg"
            required
          />
        </div>
        <div className="w-1/2">
          <label className="block mb-2">Parent Name</label>
          <input
            type="text"
            name="parent_name"
            value={form.parent_name}
            onChange={handleChange}
            className="w-full border px-4 py-2 rounded text-lg"
            required
          />
        </div>
      </div>
      <div className="flex gap-8 mb-6">
        <div className="w-1/2">
          <label className="block mb-2">Phone Number</label>
          <input
            type="tel"
            name="ph_number"
            value={form.ph_number}
            onChange={handleChange}
            className="w-full border px-4 py-2 rounded text-lg"
            required
          />
        </div>
        <div className="w-1/2">
          <label className="block mb-2">Student ID</label>
          <input
            type="text"
            name="std_id"
            value={form.std_id}
            onChange={handleChange}
            className="w-full border px-4 py-2 rounded text-lg"
            required
          />
        </div>
      </div>
      <div className="flex gap-8 mb-6">
        <div className="w-1/2">
          <label className="block mb-2">Date of Birth</label>
          <input
            type="date"
            name="std_dob"
            value={form.std_dob}
            onChange={handleChange}
            className="w-full border px-4 py-2 rounded text-lg"
            required
          />
        </div>
        <div className="w-1/2">
          <label className="block mb-2">Gender</label>
          <select
            name="std_gender"
            value={form.std_gender}
            onChange={handleChange}
            className="w-full border px-4 py-2 rounded text-lg"
            required
          >
            <option value="">Select Gender</option>
            <option value="male">Male</option>
            <option value="female">Female</option>
            <option value="other">Other</option>
          </select>
        </div>
      </div>
      <div className="flex gap-8 mb-6">
        <div className="w-1/2">
          <label className="block mb-2">Course</label>
          <select
            name="std_course"
            value={form.std_course}
            onChange={handleChange}
            className="w-full border px-4 py-2 rounded text-lg"
            required
          >
            {courses.map(course => (
              <option key={course._id} value={course._id}>{course.course_name}</option>
            ))}
          </select>
        </div>
        <div className="w-1/2">
          <label className="block mb-2">Fee Structure</label>
          <input
            type="text"
            name="fee_structure"
            value={form.fee_structure}
            onChange={handleChange}
            className="w-full border px-4 py-2 rounded text-lg"
            required
          />
        </div>
      </div>
      <div className="flex gap-8 mb-6">
        <div className="w-1/2">
          <label className="block mb-2">Password</label>
          <input
            type="password"
            name="std_password"
            value={form.std_password}
            onChange={handleChange}
            className="w-full border px-4 py-2 rounded text-lg"
            required
          />
        </div>
        <div className="w-1/2 flex items-end">
          <div className="w-full">
            <label className="block mb-2">Upload Image</label>
            <input
              type="file"
              name="image"
              accept="image/*"
              onChange={handleChange}
              className="w-full"
            />
          </div>
        </div>
      </div>
      <button
        type="submit"
        className="w-full bg-blue-600 text-white py-3 rounded text-lg hover:bg-blue-700"
      >
        Add Student
      </button>
    </div>
  </form>
)
}

export default AddStudent