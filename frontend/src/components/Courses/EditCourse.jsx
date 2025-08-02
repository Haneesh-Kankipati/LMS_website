import axios from 'axios'
import React, { useEffect, useState } from 'react'
import { useNavigate, useParams } from 'react-router-dom'

const EditCourse = () => {
    const {id}= useParams()
    const[course, setCourse]= useState([])
    const[courseLoading, setCourseLoading]= useState(false)

    const navigate = useNavigate()

    const handleChange= (e)=>{
        const{name,value}=e.target;
        setCourse({...course,[name]:value})
    }
    const handleSubmit=async(e)=>{
        e.preventDefault()
        try {
            const response = await axios.put(`http://localhost:3000/api/course/${id}`,course,{
                headers:{
                    "Authorization" : `Bearer ${localStorage.getItem('token')}`
                }
            })
            if(response.data.success){
                navigate("/admin-dashboard/courses")
            }
        } catch (error) {
            if(error.response && !error.response.data.success){
                alert(error.response.data.error)
            } 
        }
    }
    useEffect(()=>{
    const fetchCourses = async ()=>{
      setCourseLoading(true)
      try {
        const response = await axios.get(`http://localhost:3000/api/course/${id}`,{
        headers:{
          "Authorization": `Bearer ${localStorage.getItem('token')}`
        }
      }) 
        if(response.data.success){
          setCourse(response.data.course)
        } 
      } catch (error){
        if(error.response && !error.response.data.success){
                alert(error.response.data.error)
            } 
      }finally{
        setCourseLoading(false)
      }

    };
    fetchCourses()
  },[]);
  return (
    <>{courseLoading?<div>Loading ...</div>:
    <div className="max-w-3xl mx-auto mt-10 bg-white p-8 rounded-md shadow-md w-96">
      <h2 className="text-2xl font-bold mb-6">Edit Course</h2>
      <form onSubmit={handleSubmit}>
        <div>
          <label
            htmlFor="course_name"
            className="text-sm font-medium text-gray-700"
          >
            Course Name
          </label>
          <input
            type="text"
            name="course_name"
            onChange={handleChange}
            value ={course.course_name}
            placeholder="Course Name"
            required
            className="mt-1 w-full p-2 border border-gray-300 rounded-md"
          />
        </div>

        <div className="mt-3">
          <label
            htmlFor="description"
            className="block text-sm font-medium text-gray-700"
          >
            Description
          </label>
          <textarea
            name="description"
            placeholder="Description"
            onChange={handleChange}
            value={course.description}
            rows="4"
            className="mt-1 p-2 block w-full border border-gray-300 rounded-md"
          />
        </div>

        <button
          type="submit"
          className="w-full mt-6 bg-blue-600 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded-md"
        >
          Edit Course
        </button>
      </form>
    </div>
    }</>
  )
}

export default EditCourse