import React, { useState, useEffect } from 'react';
import { fetchCourses ,fetchStudentsByCourse} from '../../utils/StudentHelper';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';

const AddPayment = () => {
  const navigate = useNavigate();
  const [courses, setCourses] = useState([]);
  const [students, setStudents] = useState([]);
  const [formData, setFormData] = useState({
  course: "",
  student: "",
  fee: "",
  discount: "",
  extra: "",
  total: "",
  payDate: "",
  });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => {
    let updated = { ...prev, [name]: value };

    // Auto-calculate total when fee, discount, or extra changes
    if (["fee", "discount", "extra"].includes(name)) {
      const fee = parseFloat(updated.fee) || 0;
      const discount = parseFloat(updated.discount) || 0;
      const extra = parseFloat(updated.extra) || 0;
      updated.total = fee - discount + extra;
    }

    return updated;
  });

  if (name === "course") {
    setFormData((prev) => ({ ...prev, student: "" }));
    loadStudents(value);
  }
  };

  useEffect(() => {
    const getCourses = async () => {
      const courseList = await fetchCourses();
      setCourses(courseList || []);
    };
    getCourses();
  }, []);
  const loadStudents = async (courseId) => {
    if (!courseId) {
      setStudents([]);
      return;
    }
    const studentList = await fetchStudentsByCourse(courseId);
    //console.log("Student list received:", studentList); 
    setStudents(studentList || []);
  };
  const handleSubmit = async(e) => {
    e.preventDefault();
    //console.log("Form submitted:", formData);
    try {
            const response = await axios.post('http://localhost:3000/api/feepayment/add',formData,{
                headers:{
                    "Authorization" : `Bearer ${localStorage.getItem('token')}`
                }
            })
            if(response.data.success){
                navigate("/admin-dashboard/students")
            }
        } catch (error) {
            if(error.response && !error.response.data.success){
                alert(error.response.data.error)
            } 
        }
  };

  return (
    <div className="flex justify-center items-center min-h-screen bg-gray-100">
      <div className="bg-white rounded-lg shadow-lg p-8 w-full max-w-3xl">
        <h2 className="text-2xl font-bold mb-6">Add New Payment</h2>
        <form onSubmit={handleSubmit} className="grid grid-cols-1 md:grid-cols-2 gap-6">
          
          {/* Course */}
          <div>
            <label className="block mb-1 font-medium">Course</label>
            <select
              name="course"
              onChange={handleChange}
              className="w-full border rounded-lg p-2"
            >
              <option value="">Select Course</option>
              {courses.map((c) => (
                <option key={c._id} value={c._id}>
                  {c.course_name}
                </option>
              ))}
            </select>
          </div>

          {/* Student */}
          <div>
            <label className="block mb-1 font-medium">Student</label>
            <select
              name="student"
              value={formData.student}
              onChange={handleChange}
              className="w-full border rounded-lg p-2"
            >
              <option value="">Select Student</option>
              {students.map((s) => (
                <option key={s._id} value={s._id}>
                  {s.std_name}
                </option>
              ))}
            </select>
          </div>

          {/* Fee */}
          <div>
            <label className="block mb-1 font-medium">Fee</label>
            <input
              type="number"
              name="fee"
              placeholder="Enter Fee"
              value={formData.fee}
              onChange={handleChange}
              className="w-full border rounded-lg p-2"
            />
          </div>

          {/* Discount */}
          <div>
            <label className="block mb-1 font-medium">Discount</label>
            <input
              type="number"
              name="discount"
              placeholder="Enter Discount"
              value={formData.discount}
              onChange={handleChange}
              className="w-full border rounded-lg p-2"
            />
          </div>

          {/* Extra */}
          <div>
            <label className="block mb-1 font-medium">Extra Charges</label>
            <input
              type="number"
              name="extra"
              placeholder="Extra Charges"
              value={formData.extra}
              onChange={handleChange}
              className="w-full border rounded-lg p-2"
            />
          </div>

          {/* Total */}
          <div>
            <label className="block mb-1 font-medium bg-grey-100">Total</label>
            <input
              type="number"
              name="total"
              placeholder="Total Amount"
              value={formData.total}
              readOnly
              className="w-full border rounded-lg p-2 bg-grey-100 cursor-not-allowed"
            />
          </div>

          {/* Pay Date */}
          <div>
            <label className="block mb-1 font-medium">Pay Date</label>
            <input
              type="date"
              name="payDate"
              value={formData.payDate}
              onChange={handleChange}
              className="w-full border rounded-lg p-2"
            />
          </div>

          {/* Submit Button */}
          <div className="col-span-1 md:col-span-2">
            <button
              type="submit"
              className="w-full bg-blue-600 text-white py-2 rounded-lg hover:bg-blue-700"
            >
              Add Payment
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default AddPayment;
