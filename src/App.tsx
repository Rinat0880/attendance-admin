import React, { useState } from "react";
import { ThemeProvider, createTheme } from "@mui/material/styles";
import CssBaseline from "@mui/material/CssBaseline";
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import LoginPage from "./client/pages/LoginPage";
import DashboardPage from "./client/pages/DashboardPage";
import AdminDashboard from "./admin/pages/AdminDashboard";
import { Employee } from "./employees";
import { Box } from "@mui/material";
import "./shared/styles/App.css";
import QrReader from "./client/pages/QrReader";

const theme = createTheme({
  palette: {
    primary: {
      main: "#007bff",
    },
    secondary: {
      main: "#6c757d",
    },
  },
  typography: {
    fontFamily: "Poppins, Roboto, sans-serif",
  },
});

function App() {
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [employeeData, setEmployeeData] = useState<Employee | null>(null);

  const handleLoginSuccess = (employee: Employee) => {
    console.log("Login successful:", employee);
    setIsLoggedIn(true);
    setEmployeeData(employee);
  };

  const handleLogout = () => {
    setIsLoggedIn(false);
    setEmployeeData(null);
  };

  return (
    <ThemeProvider theme={theme}>
      <CssBaseline />
      <BrowserRouter>
        <Box sx={{ height: "100vh" }}>
          <Routes>
            <Route
              path="/login"
              element={<LoginPage onLoginSuccess={handleLoginSuccess} />}
            />
            <Route
              path="/"
              element={
                isLoggedIn ? (
                  <DashboardPage
                    employeeData={employeeData!}
                    onLogout={handleLogout}
                  />
                ) : (
                  <Navigate to="/login" />
                )
              }
            />
            <Route
              path="/admin/*"
              element={<AdminDashboard />}
            />
            <Route path="/qrreader" element={<QrReader />} />
          </Routes>
        </Box>
      </BrowserRouter>
    </ThemeProvider>
  );
}

export default App;
