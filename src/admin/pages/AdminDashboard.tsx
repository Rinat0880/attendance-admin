import React, { useState } from "react";
import "../../shared/styles/App.css";
import DashboardContent from "./AdminDashboardContent";
import { Grid, Button, Select, MenuItem, SelectChangeEvent } from "@mui/material";
import { Routes, Route, useNavigate } from "react-router-dom";
import DepartmentPositionManagement from "./DepartmentPositionManagement";
import EmployeeListPage from "./EmployeeListPage";
import CompanySettingsPage from "./CompanySettingsPage";
import SideMenu from "../components/SideMenu";
import { useTranslation } from "react-i18next";

interface AdminDashboardProps {
  onLogout: () => void;
}



function AdminDashboard({ onLogout }: AdminDashboardProps) {
  const navigate = useNavigate();
  const { t, i18n } = useTranslation(['admin', 'common']);
  const [language, setLanguage] = useState(i18n.language);



  const handleLogoutClick = () => {
    onLogout();
    navigate("/login");
  };

  const handleLanguageChange = (event: SelectChangeEvent<string>) => {
    const newLanguage = event.target.value;
    i18n.changeLanguage(newLanguage);
    setLanguage(newLanguage);
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
          <h1 className="Logo">○○会社</h1>
          <div className="User-info" style={{ display: "flex", alignItems: "center" }}>
            <Select
              value={language}
              onChange={handleLanguageChange}
              sx={{
                marginRight: "10px",
                color: "white",
                borderColor: "white",
                backgroundColor: "#105E82",
                height: "40px", // Уменьшаем высоту
                width: "120px", // Уменьшаем ширину
                fontSize: "0.875rem", // Размер шрифта
                padding: "0 10px" // Внутренние отступы для уменьшения размера
              }}
            >
              <MenuItem value="ja">{t('common:japanese')}</MenuItem>
              <MenuItem value="en">{t('common:english')}</MenuItem>
            </Select>
            <Button
              variant="contained"
              sx={{ 
                backgroundColor: "#105E82", 
                ":hover": { backgroundColor: "#919191", color: "black" },
                height: "40px" // Высота кнопки лог аута для соответствия
              }}
              onClick={handleLogoutClick}
            >
              {t('logout')}
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
              <Route path="/company-settings" element={<CompanySettingsPage />} />
            </Routes>
          </div>
        </Grid>
      </div>
    </div>
  );
}

export default AdminDashboard;
