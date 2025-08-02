import React, { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import DataTable from 'react-data-table-component'
import { columns, CourseButtons } from '../../utils/CourseHelper'
import axios from 'axios'

const CourseList = () => {
  const [courses, setCourses] = useState([]);
  const [courseLoading, setCourseLoading] = useState(false);
  const [allCourses, setAllCourses] = useState([]);
  const [searchText,setSearchText]=useState("");
  
  const fetchCourses = async ()=>{
      setCourseLoading(true)
      try {
        const response = await axios.get('http://localhost:3000/api/course',{
        headers:{
          "Authorization": `Bearer ${localStorage.getItem('token')}`
        }
      }) 
        if(response.data.success){
          let sno=1;
          const data = response.data.courses.map((course) => (
            {
            _id: course._id,
            sno: sno++,
            course_name: course.course_name,
            action: (<CourseButtons _id={course._id} onCourseDelete={onCourseDelete}/>)
            }
          ));
          setCourses(data);
          setAllCourses(data);
        } 
      } catch (error){
        if(error.response && !error.response.data.success){
                alert(error.response.data.error)
            } 
      }finally{
        setCourseLoading(false)
      }

    };


  useEffect(()=>{
    fetchCourses()
  },[]);

  const onCourseDelete = (id) => {
    setCourses(prev => prev.filter(course => course._id !== id));
    fetchCourses()
  };

  const filterCourses =(e)=>{
    const value = e.target.value.toLowerCase();
    setSearchText(value);
    const filtered = allCourses.filter(course =>
    course.course_name.toLowerCase().includes(value)
    );
  setCourses(filtered);
  }
  return (
     <>{courseLoading?<div>Loading...</div>:
     <div className='p-5'>
      <div className="text-center">
        <h3 className="text-2xl font-bold">Manage Courses</h3>
      </div>
      <div className="flex justify-between items-center">
        <input
          type="text"
          placeholder="Search By Course Name"
          className="px-4 py-0.5 border"
          onChange={filterCourses}
        />
        <Link
          to="/admin-dashboard/add-course"
          className="px-4 py-1 bg-blue-600 text-white rounded hover:bg-blue-700"
        >
          Add New Course
        </Link>
      </div>
      <div className='mt-5'>
        <DataTable
          columns={columns}
          data = {courses}
          pagination
        />
      </div>
    </div>
    }</>
  )
}

export default CourseList