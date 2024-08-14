import React from "react";
import "../../shared/styles/App.css";
import DashboardContent from "./AdminDashboardContent";
import { Grid } from "@mui/material"; // Импорт Grid из Material UI
import { Routes, Route } from "react-router-dom";
import DepartmentPositionManagement from "./DepartmentPositionManagement";
import EmployeeListPage from "./EmployeeListPage";
import SideMenu from "../components/SideMenu";

function AdminDashboard() {
  return (
    <div className="Container">
      <div className="Slayout">
        <div className="Ssidebar">
          <SideMenu />
        </div>
      </div>
      <div className="App">
        <header className="App-header">
          <h1 className="Logo">Company X</h1>
          <div className="User-info">
            <p>Userinfo</p>
          </div>
        </header>
        <Grid container>
          <div className="Dashboard">
            <Routes>
              <Route path="/" element={<DashboardContent />} />
              <Route
                path="/department-and-position"
                element={<DepartmentPositionManagement />}
              />
              <Route path="/employee-edit" element={<EmployeeListPage />} />
            </Routes>
          </div>
        </Grid>
      </div>
    </div>
  );
}

export default AdminDashboard;
