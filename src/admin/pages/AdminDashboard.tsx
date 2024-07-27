// import React, { useState } from "react";
// import "../../shared/styles/App.css";
// import DashboardContent from "./AdminDashboardContent";
// import EmptyPage from "./EmptyPage";

// function AdminDashboard() {
//   const [activeTab, setActiveTab] = useState<number>(0);

//   const handleTabChange = (
//     event: React.SyntheticEvent<any, Event> | null,
//     newValue: string | number | null
//   ) => {
//     setActiveTab(newValue as number);
//   };

//   return (
//     <div className="App">
//       <header className="App-header">
//         <h1 className="Logo">Company X</h1>
//         <div className="User-info">
//           <p>Userinfo</p>
//         </div>
//       </header>
//       <div className="Dashboard">
        
//         <div className="MainContent">
//           { <DashboardContent />}
//         </div>
//         <div className="MainContent2">
//         { <EmptyPage />}
//         </div>
//       </div>
//     </div>
//   );
// }

// export default AdminDashboard;


import React from "react";
import "../../shared/styles/App.css";
import DashboardContent from "./AdminDashboardContent";
import { Grid } from '@mui/material'; // Импорт Grid из Material UI
import { Routes, Route } from 'react-router-dom';
import DepartmentPositionManagement from "./DepartmentPositionManagement";

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
                <Route path="/employee-edit"  />
            </Routes>
          </div>
        </Grid>
      </Grid>
    </div>
  );
}

export default AdminDashboard;

