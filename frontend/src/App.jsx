import {BrowserRouter, Routes, Route, Navigate} from "react-router-dom";
import Login from "./pages/Login";
import AdminDashboard from "./pages/AdminDashboard";
import StudentDashboard from "./pages/studentDashboard";
import PrivateRoutes from "./utils/PrivateRoutes";
import RoleBasedRoutes from "./utils/RoleBasedRoutes";
import AdminSummary from "./components/Dashboard/AdminSummary";
import CourseList from "./components/Courses/CourseList";
import AddCourse from "./components/Courses/AddCourse";
import EditCourse from "./components/Courses/EditCourse";
function App() {

  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Navigate to="/admin-dashboard"/>}> </Route>
        <Route path="/login" element={<Login />}> </Route>
        <Route path="/admin-dashboard" element={
          <PrivateRoutes>
            <RoleBasedRoutes requiredRole={["admin"]}>
              <AdminDashboard />
            </RoleBasedRoutes>
          </PrivateRoutes>
          
          }>
            <Route index element={<AdminSummary/>}></Route>
            <Route path="/admin-dashboard/courses" element={<CourseList/>}> </Route>
            <Route path="/admin-dashboard/add-course" element={<AddCourse/>}> </Route>
            <Route path="/admin-dashboard/course/:id" element={<EditCourse/>}> </Route>
            <Route path="/admin-dashboard/students" element={<AdminSummary/>}></Route>
        </Route>
        <Route path="/student-dashboard" element={<StudentDashboard />}> </Route>
      </Routes>
    </BrowserRouter>
  )
}

export default App
