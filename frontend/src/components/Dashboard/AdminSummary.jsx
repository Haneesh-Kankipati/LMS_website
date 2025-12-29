import React, { useEffect, useState } from 'react'
import SummaryCard from './SummaryCard'
import {FaBook, FaMoneyBillWave, FaUsers} from 'react-icons/fa'
import axios from 'axios'
const AdminSummary = () => {
  const [loading,setLoading]=useState(false)
  const[data,setData]=useState({
    students:0,
    courses:0,
    earnings:0
  })
  const loadData=async()=>{
    setLoading(true)
    try {
      const response = await axios.get('http://localhost:3000/api/dashboard',{
        headers:{
          "Authorization": `Bearer ${localStorage.getItem('token')}`
        }
      }) 
      if(response.data.success){
        setData(response.data.data)
      }
    } catch (error) {
      if(error.response && !error.response.data.success){
                alert(error.response.data.error)
            } 
    } finally{
      setLoading(false)
    }
  }
  useEffect(()=>{
    loadData()
  },[])
  return (
    <>{loading?(<div>Loading...</div>):
    <div className='p-6'>
      <h3 className='text-2xl font-bold'>Dashboard Overview</h3>
      <div className='grid grid-cols-1 md:grid-cols-3 gap-4 mt-6'>
        <SummaryCard icon={<FaUsers />} text="Total Students" number={data.students} color='bg-blue-600'/>
        <SummaryCard icon={<FaBook />} text="Total Courses" number={data.courses} color='bg-yellow-600'/>
        <SummaryCard icon={<FaMoneyBillWave />} text="Total Earnings" number={data.earnings} color='bg-red-600'/>
      </div>
    </div>
    }</>
    
  )
}

export default AdminSummary