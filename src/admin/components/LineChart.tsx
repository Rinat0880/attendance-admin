import React, { useState, useRef, useLayoutEffect, useEffect } from "react";
import { LineChart } from "@mui/x-charts/LineChart";
import {
  Box,
  Typography,
  Button,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  Select,
  MenuItem,
  SelectChangeEvent,
} from "@mui/material";
import axiosInstance from '../../utils/libs/axios';

interface LineData {
  percentage: number;
  work_day: string;
}

function LineChartComponent() {
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

  const [attendanceData, setAttendanceData] = useState<number[]>([]);
  const [daysOfWeek, setDaysOfWeek] = useState<string[]>([]);
  const [month, setMonth] = useState<string>(getCurrentMonth());
  const [interval, setInterval] = useState<number>(0);
  const [openIntervalDialog, setOpenIntervalDialog] = useState(false);
  const [openMonthDialog, setOpenMonthDialog] = useState(false);

  const chartRef = useRef<HTMLDivElement | null>(null);
  const [chartWidth, setChartWidth] = useState<number>(600);

  useLayoutEffect(() => {
    if (chartRef.current) {
      setChartWidth(chartRef.current.offsetWidth);
    }
  }, []);

  useEffect(() => {
    fetchData(); // Fetch data when component mounts
  }, [month, interval]); // Dependencies to refetch when month or interval changes

  const fetchData = async () => {
    try {
      // Log the request parameters
      console.log('Requesting data with parameters:', {
        month: `${month}-01`,
        interval: interval,
      });

      const response = await axiosInstance().get(
        `https://attendance-backend-24xu.onrender.com/api/v1/attendance/graph`,
        {
          params: {
            month: `${month}-01`,
            interval: interval,
          },
        }
      );

      // Log the response data
      console.log('Fetched data:', response.data);

      const results: LineData[] = response.data.data.results;

      // If no data, populate days based on interval
      if (results.length === 0) {
        let days: string[] = [];
        switch (interval) {
          case 0:
            days = Array.from({ length: 10 }, (_, i) => `${i + 1}日`);
            break;
          case 1:
            days = Array.from({ length: 10 }, (_, i) => `${i + 11}日`);
            break;
          case 2:
            days = Array.from({ length: 10 }, (_, i) => `${i + 21}日`);
            break;
          default:
            days = [];
        }
        setDaysOfWeek(days);
        setAttendanceData(Array(10).fill(0)); // Default data (e.g., zeros)
      } else {
        const days = results.map(result => {
          // Format the day
          const day = new Date(result.work_day).getDate();
          return `${day}日`;
        });
        const percentages = results.map(result => result.percentage);

        setDaysOfWeek(days);
        setAttendanceData(percentages);
      }
    } catch (error) {
      console.error("Error fetching data", error);
    }
  };

  const handleIntervalChange = (event: SelectChangeEvent<number>) => {
    setInterval(event.target.value as number);
  };

  const handleMonthChange = (event: SelectChangeEvent<string>) => {
    setMonth(event.target.value);
  };

  const handleIntervalDialogOpen = () => {
    setOpenIntervalDialog(true);
  };

  const handleIntervalDialogClose = () => {
    setOpenIntervalDialog(false);
    fetchData(); // Fetch data when dialog closes
  };

  const handleMonthDialogOpen = () => {
    setOpenMonthDialog(true);
  };

  const handleMonthDialogClose = () => {
    setOpenMonthDialog(false);
    fetchData(); // Fetch data when dialog closes
  };

  // Utility function to get the current month in YYYY-MM format
  function getCurrentMonth(): string {
    const today = new Date();
    const year = today.getFullYear();
    const month = String(today.getMonth() + 1).padStart(2, "0");
    return `${year}-${month}`;
  }

  return (
    <Box sx={{ backgroundColor: "#fff", padding: 2 }}>
      <Box sx={{ display: "flex", justifyContent: "space-between" }}>
        <Typography variant="h6" align="left" sx={{ marginBottom: 2 }}>
          Attendance Chart
        </Typography>

        <div>
          <Button variant="outlined" onClick={handleIntervalDialogOpen} sx={{ marginRight: 2 }}>
            Interval
          </Button>
          <Button variant="outlined" onClick={handleMonthDialogOpen}>
            Month
          </Button>
        </div>
      </Box>
      <LineChart
        xAxis={[
          {
            scaleType: "point",
            data: daysOfWeek, // Data for the X axis
          },
        ]}
        yAxis={[
          {
            colorMap: {
              type: "continuous",
              min: 1,
              max: 100,
              color: ["transparent", "rgba(51, 84, 244, 0.6)"],
            },
          },
        ]}
        series={[
          {
            data: attendanceData, // Data for the Y axis
            area: true,
          },
        ]}
        sx={{
          backgroundColor: "#fff",
        }}
        width={chartWidth}
        height={235}
      />

      <Dialog open={openIntervalDialog} onClose={handleIntervalDialogClose}>
        <DialogTitle>Select Interval</DialogTitle>
        <DialogContent>
          <Select value={interval} onChange={handleIntervalChange} fullWidth>
            <MenuItem value={0}>上旬 (1-10)</MenuItem>
            <MenuItem value={1}>中旬 (11-20)</MenuItem>
            <MenuItem value={2}>下旬 (21-30/31)</MenuItem>
          </Select>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleIntervalDialogClose}>OK</Button>
        </DialogActions>
      </Dialog>

      <Dialog open={openMonthDialog} onClose={handleMonthDialogClose}>
        <DialogTitle>Select Month</DialogTitle>
        <DialogContent>
          <Select value={month} onChange={handleMonthChange} fullWidth>
            {monthsOfYear.map((month, index) => (
              <MenuItem key={index} value={`2024-${String(index + 1).padStart(2, "0")}`}>
                {month}
              </MenuItem>
            ))}
          </Select>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleMonthDialogClose}>OK</Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
}

export default LineChartComponent;
