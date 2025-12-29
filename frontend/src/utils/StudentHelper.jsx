import axios from "axios";
import { useNavigate } from "react-router-dom";

export const columns =[
    {
        name:"S No",
        selector:(row)=>row.sno
    },
    {
        name:"Name",
        selector:(row)=>row.name,
        sortable:true
    },
    {
        name:"Parent Name",
        selector:(row)=>row.parent_name
    },
    {
        name: "Image",
        cell: (row) =>
        row.profileImage ? (
            <img
                src={`http://localhost:3000/uploads/${row.profileImage}`}
                alt="profile"
                style={{ width: 40, height: 40, borderRadius: "50%", objectFit: "cover" }}
            />
            ) : (
            "No Image"
            ),
        sortable: false,
        width: "70px"
    },
    {
        name:"Course",
        selector:(row)=>row.course_name,
        sortable:true
    },
    {
        name: "DOB",
        selector: (row) => {
        if (!row.std_dob) return "";
        const date = new Date(row.std_dob);
        const day = String(date.getDate()).padStart(2, '0');
        const month = String(date.getMonth() + 1).padStart(2, '0');
        const year = date.getFullYear();
        return `${day}/${month}/${year}`;
      },
      sortable: true
    },
    {
        name:"Action",
        selector:(row)=>row.action,
        ignoreRowClick: true,
        //button:true,
        width: "300px"
    }
]

export const fetchCourses = async ()=>{
      let courses
      try {
        const response = await axios.get('http://localhost:3000/api/course',{
        headers:{
          "Authorization": `Bearer ${localStorage.getItem('token')}`
        }
      }) 
        if(response.data.success){
          courses = response.data.courses
        } 
      } catch (error){
        if(error.response && !error.response.data.success){
                alert(error.response.data.error)
            } 
      }
      return courses
    };
export const fetchStudentsByCourse = async (course_id) => {
  try {
    const response = await axios.get('http://localhost:3000/api/student', {
      headers: {
        "Authorization": `Bearer ${localStorage.getItem('token')}`
      }
    });

    if (response.data.success) {
      const students = response.data.students;
      const filteredStudents = students.filter(s => s.std_course._id.toString() === course_id);
      return filteredStudents;
    } 
    return [];
  } catch (error) {
    if (error.response && !error.response.data.success) {
      alert(error.response.data.error);
    } 
    return [];
  }
};

export const StudentButtons =({_id,onStudentDelete})=>{
    const navigate= useNavigate()
    const handleDelete=async (id)=>{
        const confirm = window.confirm("Do you want to delete?")
        try {
            if(confirm){
                const response = await axios.delete(`http://localhost:3000/api/student/${id}`,{
                    headers:{
                  "Authorization": `Bearer ${localStorage.getItem('token')}`
                }
                });
            if(response.data.success){
              onStudentDelete(id)
            } 
            }
        
      } catch (error){
        if(error.response && !error.response.data.success){
                alert(error.response.data.error)
            } 
      }
    };
    return (
        <div className="flex space-x-3">
            <button className="px-3 py-1 bg-green-600 text-white rounded-full"
             onClick={()=>navigate(`/admin-dashboard/student/${_id}`)}
            >View</button> 
            <button className="px-3 py-1 bg-blue-600 text-white rounded-full"
              onClick={()=> navigate(`/admin-dashboard/student/edit/${_id}`)}
            >Edit</button>
            <button className="px-3 py-1 bg-yellow-600 text-white rounded-full"
              onClick={()=> navigate(`/admin-dashboard/student/feepayment/${_id}`)}
            >Fee Paid</button> 
            <button className="px-3 py-1 bg-red-600 text-white rounded-full"
              onClick={()=>handleDelete(_id)}
            >Delete</button>
        </div>
    )
}