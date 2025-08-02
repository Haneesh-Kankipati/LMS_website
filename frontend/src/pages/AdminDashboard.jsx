// src/pages/AdminDashboard.jsx
import React from "react";
import { useAuth } from "../context/authContext";
import AdminSidebar from "../components/Dashboard/AdminSidebar";
import NavBar from "../components/Dashboard/NavBar";
import AdminSummary from "../components/Dashboard/AdminSummary";
import { Outlet } from "react-router-dom";

const AdminDashboard = () => {
  const { user } = useAuth();

  return (
    <div className="flex">
      <div className="w-64 fixed h-screen">
        <AdminSidebar />
      </div>
      <div className="ml-64 flex-1 flex flex-col min-h-screen bg-gray-100">
        <NavBar />
        <Outlet/>
      </div>
    </div>
  );
};

export default AdminDashboard;
