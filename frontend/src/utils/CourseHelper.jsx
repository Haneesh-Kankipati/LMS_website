import axios from "axios"
import { useNavigate } from "react-router-dom"

export const columns =[
    {
        name:"S No",
        selector:(row)=>row.sno
    },
    {
        name:"Course Name",
        selector:(row)=>row.course_name
    },
    {
        name:"Action",
        selector:(row)=>row.action
    }
]

export const CourseButtons =({_id, onCourseDelete})=>{
    const navigate= useNavigate()

    const handleDelete=async (id)=>{
        const confirm = window.confirm("Do you want to delete?")
        try {
            if(confirm){
                const response = await axios.delete(`http://localhost:3000/api/course/${id}`,{
                    headers:{
                  "Authorization": `Bearer ${localStorage.getItem('token')}`
                }
                });
            if(response.data.success){
              onCourseDelete(id)
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
            <button className="px-3 py-1 bg-blue-600 text-white rounded-full"
                onClick={()=> navigate(`/admin-dashboard/course/${_id}`)}
            >Edit</button> 
            <button className="px-3 py-1 bg-red-600 text-white rounded-full"
                onClick={()=> handleDelete(_id)}
            >Delete</button>
        </div>
    )
}