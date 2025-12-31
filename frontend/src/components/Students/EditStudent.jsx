import axios from 'axios'
import React, { useState, useEffect } from 'react'
import { useNavigate, useParams } from 'react-router-dom'
import { fetchCourses } from '../../utils/StudentHelper'

const EditStudent = () => {
    const { id } = useParams()
    const [form, setForm] = useState({
        std_name: "",
        parent_name: "",
        ph_number: "",
        std_id: "",
        std_dob: "",
        std_gender: "",
        std_course: "",
        std_password: "",
        image: null
    })
    const [studentLoading, setStudentLoading] = useState(false)
    const [courses, setCourses] = useState([])
    const navigate = useNavigate()

    const handleSubmit = async (e) => {
        e.preventDefault()
        try {
            const formData = new FormData();

        // Append all fields to FormData
            for (const key in form) {
            if (form[key] !== null && form[key] !== undefined) {
                formData.append(key, form[key]);
            }
            }
            const response = await axios.put(`http://localhost:3000/api/student/${id}`, formData, {
                headers: {
                    "Authorization": `Bearer ${localStorage.getItem('token')}`
                }
            })
            if (response.data.success) {
                navigate("/admin-dashboard/students")
            }
        } catch (error) {
            if (error.response && !error.response.data.success) {
                alert(error.response.data.error)
            }
        }
    }

    useEffect(() => {
    const fetchStudent = async () => {
        setStudentLoading(true)
        try {
            const response = await axios.get(`http://localhost:3000/api/student/${id}`, {
                headers: {
                    "Authorization": `Bearer ${localStorage.getItem('token')}`
                }
            })
            if (response.data.success) {
                const { student, user } = response.data;
                setForm({
                    ...student,
                    std_course: student.std_course?._id || "",
                    ph_number: user?.email ||"",
                    image: user?.profileImage || null,
                    std_password: "" // Never prefill password
                });
            }
        } catch (error) {
            if (error.response && !error.response.data.success) {
                alert(error.response.data.error)
            }
        } finally {
            setStudentLoading(false)
        }
    }
    const getCourses = async () => {
        const courseList = await fetchCourses()
        setCourses(courseList || [])
    }
    fetchStudent()
    getCourses()
    }, [id])

    const handleChange = (e) => {
        const { name, value, type, files } = e.target
        setForm(prev => ({
            ...prev,
            [name]: type === "file" ? files[0] : value
        }))
    }

    return (
        <>
            {studentLoading ? <div>Loading ...</div> :
                <form
                    className="min-h-screen w-full flex flex-col justify-center items-center bg-white p-8"
                    onSubmit={handleSubmit}
                >
                    <div className="w-full max-w-3xl bg-white rounded shadow p-8">
                        <h2 className="text-2xl font-bold mb-8 text-left">Edit Student</h2>
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
                                    value={form.std_dob?.slice(0, 10) || ""}
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
                                    <option value="">Select Course</option>
                                    {courses.map(course => (
                                        <option key={course._id} value={course._id}>{course.course_name}</option>
                                    ))}
                                </select>
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
                            Update Student
                        </button>
                    </div>
                </form>
            }
        </>
    )
}

export default EditStudent