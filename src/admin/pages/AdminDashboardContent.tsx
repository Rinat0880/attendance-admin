import React, { useEffect, useState } from "react";
import LineChartComponent from "../components/LineChart";
import PieChartWithCustomizedLabel from "../components/pie";
import SimpleBarChart from "../components/Bar";
import AttendanceTable from "../components/Table/AttendanceTable";
import mockData from "../components/Table/mockData";
import { Column } from "../components/Table/types";
import axiosInstance from '../../utils/libs/axios';

function AdminDashboardContent() {
  const [attendanceStats, setAttendanceStats] = useState({
    total_employee: 0,
    ontime: 0,
    absent: 0,
    late_arrival: 0,
    early_departures: 0,
    time_off: 0,
  });

  const columns: Column[] = [
    { id: 'id', label: 'ID' },
    { id: 'name', label: 'Name', filterable: true },
    { id: 'department', label: 'Department', filterable: true, filterValues: ['IT', 'HR'] },
    { id: 'role', label: 'Role', filterable: true, filterValues: ['Developer', 'Manager'] },
    { id: 'date', label: 'Date' },
    { id: 'status', label: 'Status', filterable: true, filterValues: ['Present', 'Absent'] },
    { id: 'checkIn', label: 'Check In' },
    { id: 'checkOut', label: 'Check Out' },
    { id: 'totalHrs', label: 'Total Hours' },
  ] as Column[];

  useEffect(() => {
    const fetchAttendanceStats = async () => {
      try {
        const instance = axiosInstance();
        const token = localStorage.getItem('access_token');
        console.log(token);
        const response = await instance.get("/attendance", {
          headers: { Authorization: `Bearer ${token}` }
        });
        if (response.status === 200 && response.data.status) {
          setAttendanceStats(response.data.data);
        }
      } catch (err) {
        console.error("Ошибка при получении данных o посещаемости:", err);
      }
    };

    fetchAttendanceStats();
  }, []);
  
  return (
    <>
      <div className="DashboardContainer">
        <div className="Chart-2">
            <PieChartWithCustomizedLabel />
          
        </div>
        <div className="Cards">
          <div className="Card">
            <div className="data">
              <p className="Card-amount">{attendanceStats.total_employee}</p>
              <p className="Card-text">Total employees</p>
            </div>
            <div className="icon">
              <img src={require("../../shared/png/total_employees.png")}></img>
            </div>
          </div>
          <div className="Card">
            <div className="data">
              <p className="Card-amount">{attendanceStats.ontime}</p>
              <p className="Card-text">On Time</p>
            </div>
            <div className="icon">
              <img src={require("../../shared/png/on_time.png")}></img>
            </div>
          </div>
          <div className="Card">
            <div className="data">
              <p className="Card-amount">{attendanceStats.absent}</p>
              <p className="Card-text">Absent</p>
            </div>
            <div className="icon">
              <img src={require("../../shared/png/absent.png")}></img>
            </div>
          </div>
          <div className="Card">
            <div className="data">
              <p className="Card-amount">{attendanceStats.late_arrival}</p>
              <p className="Card-text">Late Arrival</p>
            </div>
            <div className="icon">
              <img src={require("../../shared/png/late_arrival.png")}></img>
            </div>
          </div>
          <div className="Card">
            <div className="data">
              <p className="Card-amount">{attendanceStats.early_departures}</p>
              <p className="Card-text">Early Departures</p>
            </div>
            <div className="icon">
              <img src={require("../../shared/png/early_departures.png")}></img>
            </div>
          </div>
          <div className="Card">
            <div className="data">
              <p className="Card-amount">{attendanceStats.time_off}</p>
              <p className="Card-text">Time-off</p>
            </div>
            <div className="icon">
              <img src={require("../../shared/png/time-off.png")}></img>
            </div>
          </div>
        </div>
      </div>
      <div className="Charts">
        <div className="Chart-1">
            <LineChartComponent />
        </div>
        <div className="Chart-3">
            <SimpleBarChart/>
        </div>
      </div>
      <div className="TableSection">
        <AttendanceTable data={mockData} columns={columns} showCalendar={true}/>
      </div>
    </>
  );
}

export default AdminDashboardContent;
