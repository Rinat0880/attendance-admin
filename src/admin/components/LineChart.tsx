import React, { useState } from "react";
import { LineChart } from "@mui/x-charts/LineChart";
import {
  Box,
  Typography,
  ToggleButton,
  ToggleButtonGroup,
} from "@mui/material";

function LineChartComponent() {
  const daysOfWeek: string[] = [
    "1 Jul",
    "2 Jul",
    "3 Jul",
    "4 Jul",
    "5 Jul",
    "6 Jul",
    "7 Jul",
    "8 Jul",
    "9 Jul",
  ];
  const attendanceData: number[] = [64, 55, 74, 90, 66, 77, 10, 0, 92];
  const monthsOfYear: string[] = [
    "Jan",
    "Feb",
    "Mar",
    "Apr",
    "May",
    "Jun",
    "Jul",
    "Aug",
    "Sep",
    "Oct",
    "Nov",
    "Dec",
  ];
  const monthlyAttendanceData: number[] = [
    70, 65, 85, 78, 55, 68, 82, 91, 60, 75, 80, 72,
  ];

  const [filter, setFilter] = useState("daily");

  const handleFilterChange = (
    event: React.MouseEvent<HTMLElement>,
    newFilter: string
  ) => {
    setFilter(newFilter);
  };

  return (
    <Box sx={{ backgroundColor: "#fff", padding: 2 }}>
      <Box sx={{display: 'flex', justifyContent: "space-between"}}>
        <Typography variant="h6" align="left" sx={{ marginBottom: 2 }}>
          Attendance Chart
        </Typography>

        <ToggleButtonGroup
          value={filter}
          exclusive
          onChange={handleFilterChange}
          aria-label="chart filter"
          sx={{ marginBottom: 2 , backgroundColor: "#F1F2F6"}}
        >
          <ToggleButton value="daily">Daily</ToggleButton>
          <ToggleButton value="monthly">Monthly</ToggleButton>
        </ToggleButtonGroup>
      </Box>
      <LineChart
        xAxis={[
          {
            scaleType: "point",
            data: filter === "daily" ? daysOfWeek : monthsOfYear,
          },
        ]}
        yAxis={[
          {
            colorMap: {
              type: "continuous",
              min: -30,
              max: 100,
              color: ["transparent", "rgba(51, 84, 244, 0.6)"],
            },
          },
        ]}
        series={[
          {
            data: filter === "daily" ? attendanceData : monthlyAttendanceData,
            area: true,

          },
        ]}
        sx={{
          backgroundColor: "#fff",
        }}
        width={650}
        height={235}
      />
    </Box>
  );
}

export default LineChartComponent;
