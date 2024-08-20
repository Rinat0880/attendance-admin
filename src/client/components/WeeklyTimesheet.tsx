import React, { useMemo, useEffect, useState } from 'react';
import { Box, Typography, Grid, MenuItem, Select, FormControl, SelectChangeEvent } from '@mui/material';
import AccessTimeIcon from '@mui/icons-material/AccessTime';
import ExitToAppIcon from '@mui/icons-material/ExitToApp';
import TimelapseIcon from '@mui/icons-material/Timelapse';
import { intervals } from './TimesheetData';
import { getWeeklyTimesheetData } from './attendanceService';

export interface TimesheetDay {
  work_day: string;
  come_time: string | null;
  leave_time: string | null;
  total_hours: string | null;
}

interface WeeklyTimesheetProps {
  year: number;
  month: number;
}

const getWeekRangeFromDate = (workDay: string): string => {
  const day = parseInt(workDay.split('-')[2], 10);
  if (day >= 1 && day <= 10) return '0';
  if (day >= 11 && day <= 20) return '1';
  return '2';
};

const formatDay = (day: string): string => {
  const dayNumber = parseInt(day.split('-')[2], 10);
  return String(dayNumber).padStart(2, '0');
};

const getTimeColor = (time: string | null, isCheckIn: boolean, isWeekend: boolean): string => {
  if (!time) return isWeekend ? '#cccccc' : '#ff3b30';
  const [hours, minutes] = time.split(':').map(Number); 
  
  if (isCheckIn) {
    return hours < 10 || (hours === 10 && minutes <= 30) ? '#00af6c' : '#ff9500';
  } else {
    return hours > 18 || (hours === 18 && minutes >= 0) ? '#00af6c' : '#ff9500';
  }
};

const getTotalHoursColor = (totalHours: string | null, isWeekend: boolean): string => {
  if (!totalHours) return '#ccc';
  return '#2196f3';
};

const isWeekend = (weekday: string): boolean => {
  return weekday === 'суббота' || weekday === 'воскресенье';
};

const getWeekday = (dateString: string): string => {
  const date = new Date(dateString);
  return date.toLocaleDateString('en-EN', { weekday: 'short' });
};

const WeeklyTimesheet: React.FC<WeeklyTimesheetProps> = ({ year, month }) => {
  const [selectedInterval, setSelectedInterval] = useState<string>(intervals[0]);
  const [timesheetData, setTimesheetData] = useState<TimesheetDay[] | null>(null);

  const handleIntervalChange = (event: SelectChangeEvent<string>) => {
    setSelectedInterval(event.target.value);
  };

  useEffect(() => {
    const fetchData = async () => {
      try {
        const interval = parseInt(selectedInterval, 10);
        const response = await getWeeklyTimesheetData(year, month, interval);
        if (response && response.data && Array.isArray(response.data.results)) {
          setTimesheetData(response.data.results);
        } else {
          console.error('Неверный формат данных:', response);
        }
      } catch (error) {
        console.error('Ошибка при загрузке данных:', error);
      }
    };

    fetchData();
  }, [year, month, selectedInterval]);

  const intervalDisplayNames = intervals.map((_, index) => `Interval ${index + 1}`);

  const selectedDays = useMemo(() => {
    if (!timesheetData) return [];

    return timesheetData
      .filter(day => {
        const weekRange = getWeekRangeFromDate(day.work_day);
        return weekRange === selectedInterval;
      })
      .sort((a, b) => a.work_day.localeCompare(b.work_day));
  }, [timesheetData, selectedInterval]);

  return (
    <Box sx={{ mb: 3, mt: 3, backgroundColor: '#ffffff', borderRadius: 2, overflow: 'hidden', boxShadow: 1, p: 1 }}>
      <Box sx={{
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        backgroundColor: '#f5f5f5',
        borderRadius: 2,
        p: 1,
        mb: 1,
        boxShadow: 1,
      }}>
        <Typography variant="h6">Intervals</Typography>
        <FormControl variant="outlined" size="small" sx={{ minWidth: 120 }}>
          <Select
            value={selectedInterval}
            onChange={handleIntervalChange}
            sx={{ textAlign: 'center' }}
            MenuProps={{
              PaperProps: {
                sx: {
                  '& .MuiMenuItem-root': {
                    display: 'flex',
                    justifyContent: 'center',
                  },
                },
              },
            }}
          >
            {intervals.map((interval, index) => (
              <MenuItem key={index} value={interval} sx={{ justifyContent: 'center' }}>
                {intervalDisplayNames[index]}
              </MenuItem>
            ))}
          </Select>
        </FormControl>
      </Box>
      <Grid container spacing={1}>
        {selectedDays.length > 0 ? (
          selectedDays.map((day) => {
            const weekday = getWeekday(day.work_day);
            const checkInColor = getTimeColor(day.come_time, true, isWeekend(weekday));
            const checkOutColor = getTimeColor(day.leave_time, false, isWeekend(weekday));
            const totalHoursColor = getTotalHoursColor(day.total_hours, isWeekend(weekday));

            return (
              <Grid item xs={12} key={day.work_day}>
                <Box sx={{
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'space-between',
                  backgroundColor: '#ffffff',
                  borderTopLeftRadius: 0,
                  borderTopRightRadius: 0,
                  borderBottomLeftRadius: 3,
                  borderBottomRightRadius: 3,
                  p: 1,
                  boxShadow: 1,
                }}>
                  <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'center', width: '60px' }}>
                    <Typography variant="body2" sx={{ fontSize: '12px' }}>
                      {formatDay(day.work_day)} {weekday}
                    </Typography>
                  </Box>
                  <Box sx={{ display: 'flex', alignItems: 'center' }}>
                    <AccessTimeIcon style={{ marginRight: '4px', color: checkInColor }} />
                    <Typography variant="body2" style={{ color: checkInColor, fontSize: '12px' }}>
                      {day.come_time || '--:--'}
                    </Typography>
                  </Box>
                  <Box sx={{ display: 'flex', alignItems: 'center' }}>
                    <ExitToAppIcon style={{ marginRight: '4px', color: checkOutColor }} />
                    <Typography variant="body2" style={{ color: checkOutColor, fontSize: '12px' }}>
                      {day.leave_time || '--:--'}
                    </Typography>
                  </Box>
                  <Box sx={{ display: 'flex', alignItems: 'center' }}>
                    <TimelapseIcon style={{ marginRight: '4px', color: totalHoursColor }} />
                    <Typography variant="body2" style={{ color: totalHoursColor, fontSize: '12px' }}>
                      {day.total_hours || '--:--'}
                    </Typography>
                  </Box>
                </Box>
              </Grid>
            );
          })
        ) : (
          <Grid item xs={12}>
            <Typography variant="body2">No data available for this interval.</Typography>
          </Grid>
        )}
      </Grid>
    </Box>
  );
};

export default WeeklyTimesheet;
