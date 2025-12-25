import {BrowserRouter, Routes, Route, Navigate} from "react-router-dom";
import Login from "./pages/Login";
import AdminDashboard from "./pages/AdminDashboard";
import StudentDashboard from "./pages/StudentDashboard";
import PrivateRoutes from "./utils/PrivateRoutes";
import RoleBasedRoutes from "./utils/RoleBasedRoutes";
import AdminSummary from "./components/Dashboard/AdminSummary";
import CourseList from "./components/Courses/CourseList";
import AddCourse from "./components/Courses/AddCourse";
import EditCourse from "./components/Courses/EditCourse";
import StudentList from "./components/Students/StudentList";
import AddStudent from "./components/Students/AddStudent";
import EditStudent from "./components/Students/EditStudent";
import ViewStudent from "./components/Students/ViewStudent";
import AddPayment from "./components/FeePayments/AddPayment";
import ViewPayment from "./components/FeePayments/ViewPayment";
import Summary from "./components/StudentDashboard/Summary";
import StudentProfile from "./components/StudentDashboard/StudentProfile";
import StudentPayments from "./components/StudentDashboard/StudentPayments";
import Settings from "./components/Dashboard/Settings";
function App() {

  return (
    <BrowserRouter>
  <Routes>
    <Route path="/" element={<Navigate to="/login" />} />
    <Route path="/login" element={<Login />} />
    <Route path="/unauthorized" element={<h1>Unauthorized</h1>} />

    <Route element={<PrivateRoutes />}>
      <Route element={<RoleBasedRoutes requiredRole={["admin"]} />}>
        <Route path="/admin-dashboard" element={<AdminDashboard />}>
          <Route index element={<AdminSummary />} />
          <Route path="courses" element={<CourseList />} />
          <Route path="add-course" element={<AddCourse />} />
          <Route path="course/:id" element={<EditCourse />} />
          <Route path="students" element={<StudentList />} />
          <Route path="add-student" element={<AddStudent />} />
          <Route path="student/edit/:id" element={<EditStudent />} />
          <Route path="student/:id" element={<ViewStudent />} />
          <Route path="feepayments" element={<AddPayment />} />
          <Route path="student/feepayment/:id" element={<ViewPayment />} />
          <Route path="settings" element={<Settings />} />
        </Route>
      </Route>

      <Route element={<RoleBasedRoutes requiredRole={["admin","student"]} />}>
        <Route path="/student-dashboard" element={<StudentDashboard />}>
          <Route index element={<Summary />} />
          <Route path="profile" element={<StudentProfile />} />
          <Route path="feepayments" element={<StudentPayments />} />
          <Route path="settings" element={<Settings />} />
        </Route>
      </Route>
    </Route>

  </Routes>
</BrowserRouter>

  )
}

export default App
