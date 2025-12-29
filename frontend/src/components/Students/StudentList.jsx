import axios from 'axios';
import React, { useEffect } from 'react'
import { useState } from 'react';
import { Link } from 'react-router-dom';
import { columns, StudentButtons } from '../../utils/StudentHelper';
import DataTable from 'react-data-table-component';
import * as XLSX from 'xlsx';
import { saveAs } from 'file-saver';

const StudentList = () => {
    const [students, setStudents]=useState([])
    const [studentLoading, setStudentLoading] = useState(false);
    const [allStudents, setAllStudents] = useState([]);
    const [searchText,setSearchText]=useState("");

  const fetchStudents = async ()=>{
      setStudentLoading(true)
      try {
        const response = await axios.get('http://localhost:3000/api/student',{
        headers:{
          "Authorization": `Bearer ${localStorage.getItem('token')}`
        }
      }) 
        if(response.data.success){
          let sno=1;
          const data = response.data.students.map((student) => (
          {
            std_id: student.std_id,
            sno: sno++,
            course_name: student.std_course?.course_name || "", // <-- FIXED
            name: student.user_id?.name || "",
            parent_name: student.parent_name,
            std_dob: new Date(student.std_dob).toDateString(),
            profileImage: student.user_id?.profileImage || "",
            action: (<StudentButtons _id={student.std_id} onStudentDelete={onStudentDelete} />)
          }
        ));
          setStudents(data);
          setAllStudents(data);
        } 
      } catch (error){
        if(error.response && !error.response.data.success){
                alert(error.response.data.error)
            } 
      }finally{
        setStudentLoading(false)
      }

    };
  useEffect(()=>{
    fetchStudents();
  },[])
  const filterStudents =(e)=>{
    const value = e.target.value.toLowerCase();
    setSearchText(value);
    const filtered = allStudents.filter(student =>
    student.name.toLowerCase().includes(value)
    );
  setStudents(filtered);
  }
  const exportToExcel = () => {
    // Remove "action" and "profileImage" fields (since they’re JSX or images)
    const exportData = students.map(({ action, profileImage, ...rest }) => rest);

    const ws = XLSX.utils.json_to_sheet(exportData);
    const wb = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(wb, ws, 'Students');
    const excelBuffer = XLSX.write(wb, { bookType: 'xlsx', type: 'array' });
    const blob = new Blob([excelBuffer], { type: 'application/octet-stream' });
    saveAs(blob, 'Student_List.xlsx');
  };
  const onStudentDelete = (id) => {
    setStudents(prev => prev.filter(student => student.std_id !== id));
    fetchStudents()
  };
  return (
    <>
      {studentLoading ? (
        <div>Loading...</div>
      ) : (
        <div className='p-5'>
          <div className="text-center">
            <h3 className="text-2xl font-bold">Manage Students</h3>
          </div>

          <div className="flex justify-between items-center mb-3">
            <input
              type="text"
              placeholder="Search By Student Name"
              className="px-4 py-0.5 border"
              onChange={filterStudents}
            />

            <div className="flex gap-2">
              <button
                onClick={exportToExcel}
                className="px-4 py-1 bg-green-600 text-white rounded hover:bg-green-700"
              >
                Export to Excel
              </button>

              <Link
                to="/admin-dashboard/add-student"
                className="px-4 py-1 bg-blue-600 text-white rounded hover:bg-blue-700"
              >
                Add New Student
              </Link>
            </div>
          </div>

          <DataTable
            columns={columns}
            data={students}
            pagination
          />
        </div>
      )}
    </>
  )
}

export default StudentList