import React from "react";
import "../../shared/styles/App.css";
import DashboardContent from "./AdminDashboardContent";
import { Grid } from '@mui/material'; // Импорт Grid из Material UI
import { Routes, Route } from 'react-router-dom';
import DepartmentPositionManagement from "./DepartmentPositionManagement";
import EmployeeListPage from "./EmployeeListPage";

function AdminDashboard() {
  return (
    <div className="App">
      <header className="App-header">
        <h1 className="Logo">Company X</h1>
        <div className="User-info">
          <p>Userinfo</p>
        </div>
      </header>
      <Grid container>
        <Grid item xs={12}> {/* Оставшаяся ширина для основного контента */}
          <div className="Dashboard">
            <Routes>
                <Route path="/" element={<DashboardContent />} />
                <Route path="/department-and-position" element={<DepartmentPositionManagement/>} />
                <Route path="/employee-edit" element={<EmployeeListPage/>} />
            </Routes>
          </div>
        </Grid>
      </Grid>
    </div>
  );
}

export default AdminDashboard;

