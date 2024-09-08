import React from "react";
import "../../shared/styles/App.css";
import DashboardContent from "./AdminDashboardContent";
import { Grid, Button } from "@mui/material"; // Добавляем Button
import { Routes, Route, useNavigate } from "react-router-dom";
import DepartmentPositionManagement from "./DepartmentPositionManagement";
import EmployeeListPage from "./EmployeeListPage";
import SideMenu from "../components/SideMenu";

interface AdminDashboardProps {
  onLogout: () => void; // Пропс для передачи функции logout
}

function AdminDashboard({ onLogout }: AdminDashboardProps) {
  const navigate = useNavigate();

  const handleLogoutClick = () => {
    onLogout(); // Вызываем функцию logout
    navigate("/login"); // Перенаправляем на страницу логина
  };

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
            <Button
              variant="contained"
              sx={{backgroundColor: "#105E82", ":hover": {backgroundColor: "#919191", color: "black"}}}
              onClick={handleLogoutClick}
            >
              Logout
            </Button>
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
