import axios from "axios";
import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";

const ViewStudent = () => {
  const { id } = useParams();
  const [studentLoading, setStudentLoading] = useState(false);
  const [student, setStudent] = useState(null);

  const formatDate = (dateString) => {
    if (!dateString) return "N/A";
    const date = new Date(dateString);
    const day = String(date.getDate()).padStart(2, "0");
    const month = String(date.getMonth() + 1).padStart(2, "0");
    const year = date.getFullYear();
    return `${day}/${month}/${year}`;
  };

  const getImageUrl = (imagePath) => {
    //console.log(imagePath)
    if (!imagePath) return null;
    
    return `http://localhost:3000/uploads/${imagePath}`;
  };

  useEffect(() => {
    if (!id) return;

    const fetchStudent = async () => {
      setStudentLoading(true);
      try {
        const response = await axios.get(
          `http://localhost:3000/api/student/${id}`,
          {
            headers: {
              Authorization: `Bearer ${localStorage.getItem("token")}`,
            },
          }
        );

        if (response.data.success) {
          const { student } = response.data;

          if (!student) {
            alert("No student found");
            return;
          }

          setStudent(student);
        }
      } catch (error) {
        if (error.response && !error.response.data.success) {
          alert(error.response.data.error);
        } else {
          alert("Server error");
        }
      } finally {
        setStudentLoading(false);
      }
    };

    fetchStudent();
  }, [id]);

  if (studentLoading) {
    return <div className="text-center mt-10">Loading...</div>;
  }

  if (!student) {
    return <div className="text-center mt-10">No student data available</div>;
  }

  return (
    <div className="flex justify-center items-center min-h-screen bg-gray-100">
      <div className="bg-white shadow-lg rounded-lg p-10 w-[90%] max-w-[1200px] min-h-[80vh] flex flex-col items-center gap-8">

        <h2 className="text-3xl font-bold text-center">
          Student Details
        </h2>

        {/* Profile Image */}
        {student.profileImage ? (
          <img
            src={getImageUrl(student.profileImage)}
            alt="Student Profile"
            className="w-40 h-40 rounded-full object-cover border-4 border-gray-300"
          />
        ) : (
          <div className="w-40 h-40 rounded-full bg-gray-300 flex items-center justify-center text-gray-600">
            No Image
          </div>
        )}

        {/* Student Details */}
        <div className="text-lg space-y-4 w-full max-w-xl">
          <p><strong>Name:</strong> {student.std_name}</p>
          <p><strong>Parent Name:</strong> {student.parent_name}</p>
          <p><strong>Student ID:</strong> {student.std_id}</p>
          <p><strong>Date of Birth:</strong> {formatDate(student.std_dob)}</p>
          <p><strong>Gender:</strong> {student.std_gender}</p>
          <p>
            <strong>Course:</strong>{" "}
            {student.std_course?.course_name || "N/A"}
          </p>
        </div>

      </div>
    </div>
  );
};

export default ViewStudent;
