import React from "react";
import LineChartComponent from "../components/LineChart";
import PieChartWithCustomizedLabel from "../components/pie";
import SimpleBarChart from "../components/Bar";

function AdminDashboardContent() {
  return (
    <>
      <div className="DashboardContainer">
        <div className="Chart-2">
            <PieChartWithCustomizedLabel />
          
        </div>
        <div className="Cards">
          <div className="Card">
            <div className="data">
              <p className="Card-amount">452</p>
              <p className="Card-text">Total employees</p>
            </div>
            <div className="icon">
              <img src={require("../../shared/png/total_employees.png")}></img>
            </div>
          </div>
          <div className="Card">
            <div className="data">
              <p className="Card-amount">360</p>
              <p className="Card-text">On Time</p>
            </div>
            <div className="icon">
              <img src={require("../../shared/png/on_time.png")}></img>
            </div>
          </div>
          <div className="Card">
            <div className="data">
              <p className="Card-amount">30</p>
              <p className="Card-text">Absent</p>
            </div>
            <div className="icon">
              <img src={require("../../shared/png/absent.png")}></img>
            </div>
          </div>
          <div className="Card">
            <div className="data">
              <p className="Card-amount">62</p>
              <p className="Card-text">Late Arrival</p>
            </div>
            <div className="icon">
              <img src={require("../../shared/png/late_arrival.png")}></img>
            </div>
          </div>
          <div className="Card">
            <div className="data">
              <p className="Card-amount">6</p>
              <p className="Card-text">Early Departures</p>
            </div>
            <div className="icon">
              <img src={require("../../shared/png/early_departures.png")}></img>
            </div>
          </div>
          <div className="Card">
            <div className="data">
              <p className="Card-amount">42</p>
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
          <div className="Chart-content">
            <LineChartComponent />
          </div>
        </div>
        <div className="Chart-3">
            <SimpleBarChart />
          
        </div>
      </div>
    </>
  );
}

export default AdminDashboardContent;
