import axios from 'axios'
import React, { useEffect, useState } from 'react'
import { useParams } from 'react-router-dom'

const ViewStudent = () => {
  const { id } = useParams()
  const [studentLoading, setStudentLoading] = useState(false)
  const [student, setStudent] = useState({})

  useEffect(() => {
    const fetchStudent = async () => {
      setStudentLoading(true)
      try {
        const response = await axios.get(`http://localhost:3000/api/student/${id}`, {
          headers: {
            Authorization: `Bearer ${localStorage.getItem('token')}`
          }
        })

        if (response.data.success) {
          const { student, user } = response.data
          if (!student) {
            alert("No student found")
            return
          }
          setStudent(student)
        }
      } catch (error) {
        if (error.response && !error.response.data.success) {
          alert(error.response.data.error)
        }
      } finally {
        setStudentLoading(false)
      }
    }
    fetchStudent()
  }, [id])

  if (studentLoading) {
    return <div className="text-center mt-10">Loading...</div>
  }

  return (
    <div className="flex justify-center items-center min-h-screen bg-gray-100">
  <div className="bg-white shadow-lg rounded-lg p-10 w-[90%] max-w-[1200px] min-h-[80vh] flex flex-col justify-center gap-8">
    <h2 className="text-3xl font-bold text-center mb-6">Student Details</h2>
    <div className="text-lg space-y-4">
      <p><strong>Name:</strong> {student?.std_name}</p>
      <p><strong>Parent Name:</strong> {student?.parent_name}</p>
      <p><strong>Student ID:</strong> {student?.std_id}</p>
      <p><strong>Date of Birth:</strong> {student?.std_dob}</p>
      <p><strong>Gender:</strong> {student?.std_gender}</p>
      <p><strong>Course:</strong> {student?.std_course?.course_name}</p>
    </div>
  </div>
</div>

  )
}

export default ViewStudent
