import React from 'react'
import SummaryCard from './SummaryCard'
import {FaBook, FaMoneyBillWave, FaUsers} from 'react-icons/fa'
const AdminSummary = () => {
  return (
    <div className='p-6'>
      <h3 className='text-2xl font-bold'>Dashboard Overview</h3>
      <div className='grid grid-cols-1 md:grid-cols-3 gap-4 mt-6'>
        <SummaryCard icon={<FaUsers />} text="Total Students" number={13} color='bg-blue-600'/>
        <SummaryCard icon={<FaBook />} text="Total Courses" number={13} color='bg-yellow-600'/>
        <SummaryCard icon={<FaMoneyBillWave />} text="Total Earnings" number={13} color='bg-red-600'/>
      </div>
    </div>
  )
}

export default AdminSummary