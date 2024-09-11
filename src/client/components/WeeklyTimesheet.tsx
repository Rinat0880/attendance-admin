import React, { useMemo, useEffect, useState } from 'react';
import { Box, Typography, Grid, Button, ButtonGroup } from '@mui/material';
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

const getTimeColor = (time: string | null, isCheckIn: boolean): string => {
  if (!time || time === '00:00') return '#cccccc';
  const [hours, minutes] = time.split(':').map(Number);
  
  if (isCheckIn) {
    return hours < 10 || (hours === 10 && minutes <= 30) ? '#00af6c' : '#ff9500';
  } else {
    return hours > 18 || (hours === 18 && minutes >= 0) ? '#00af6c' : '#ff9500';
  }
};

const getTotalHoursColor = (totalHours: string | null): string => {
  if (!totalHours || totalHours === '00:00') return '#cccccc';
  return '#2196f3';
};

// const isWeekend = (weekday: string): boolean => {
//   return weekday === 'суббота' || weekday === 'воскресенье';
// };

const getWeekday = (dateString: string): string => {
  const date = new Date(dateString);
  return date.toLocaleDateString('ja-JP', { weekday: 'short' });
};

const getJapaneseDateRange = (interval: string, daysInMonth: number): string => {
  switch (interval) {
    case '0':
      return '1日-10日';
    case '1':
      return '11日-20日';
    case '2':
      return `21日-${daysInMonth}日`;
    default:
      return '';
  }
};

const getDefaultInterval = (): string => {
  const currentDay = new Date().getDate();
  if (currentDay >= 1 && currentDay <= 10) return '0';
  if (currentDay >= 11 && currentDay <= 20) return '1';
  return '2';
};

const WeeklyTimesheet: React.FC<WeeklyTimesheetProps> = ({ year, month }) => {
  const [selectedInterval, setSelectedInterval] = useState<string>(getDefaultInterval());
  const [timesheetData, setTimesheetData] = useState<TimesheetDay[] | null>(null);

  

  const daysInMonth = new Date(year, month, 0).getDate();

  const handleIntervalChange = (interval: string) => {
    setSelectedInterval(interval);
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

  const intervalDisplayNames = intervals.map(interval => getJapaneseDateRange(interval, daysInMonth));

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
<Box id='WEEKLY' sx={{ mb: 3, mt: 3, backgroundColor: '#ffffff', borderRadius: 2, overflow: 'hidden', boxShadow: 1, p: 1 }}>
  {/* Интервал кнопок */}
  <ButtonGroup size='large' variant="outlined" aria-label="выбор интервала" sx={{
    borderColor: 'transparent',
    boxShadow: '0 0 5px rgba(0,0,0,0.2)',
    borderRadius: '8px',
    overflow: 'hidden',
    display: 'flex',
    justifyContent: 'center',
    backgroundColor: '#ffffff',
    p: '0.1px',
    mb: '16px',
    width: '100%', // Занимает всю ширину
  }}>
    {intervals.map((interval, index) => (
      <Button
        key={interval}
        onClick={() => handleIntervalChange(interval)}
        variant={selectedInterval === interval ? 'contained' : 'outlined'}
        sx={{
          flexGrow: 1,
          borderRadius: '8px',
          borderColor: selectedInterval === interval ? 'transparent' : '#e0e0e0',
          backgroundColor: selectedInterval === interval ? '#105e82' : 'white',
          color: selectedInterval === interval ? 'white' : '#105e82',
          transition: 'all 0.3s ease',
          textTransform: 'none',
          '&:hover': {
            backgroundColor: selectedInterval === interval ? '#0d4b66' : '#f0f0f0',
          },
          '&:focus': {
            outline: 'none',
          },
          '&:not(:last-child)': {
            borderRight: '1px solid #e0e0e0',
          },
          padding: '8px 14px',
          mb: '0.1px',
          minWidth: '80px', // Обеспечивает минимальную ширину для кнопок
        }}
      >
        {intervalDisplayNames[index]}
      </Button>
    ))}
  </ButtonGroup>
  
  {/* Основной контент */}
  <Grid container spacing={1}>
  {selectedDays.length > 0 ? (
    selectedDays.map((day) => {
      const weekday = getWeekday(day.work_day);
      const checkInColor = getTimeColor(day.come_time, true);
      const checkOutColor = getTimeColor(day.leave_time, false);
      const totalHoursColor = getTotalHoursColor(day.total_hours);

      return (
        <Grid item xs={12} key={day.work_day}>
          <Box sx={{
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            backgroundColor: '#ffffff',
            borderRadius: 1,
            p: 1,
            boxShadow: 1,
            height: 'auto',
            flexDirection: 'row', // Горизонтальное выравнивание
            textAlign: 'center',
          }}>
            {/* Дата и день недели */}
            <Box sx={{ width: '17%', p: 0.5 }}>
              <Typography variant="body2" sx={{ fontSize: '16px', fontFamily:'Roboto mono', lineHeight: '1.5' }}>
                {formatDay(day.work_day)} {weekday}
              </Typography>
            </Box>

            {/* Вход, выход, тотал */}
            <Box id='come,leave,total' sx={{
              display: 'flex',
              flexDirection: 'row',
              alignItems: 'center',
              justifyContent: 'space-around',
              flexGrow: 1,
              width: '80%',
            }}>
              {/* Вход */}
              <Box id='come' sx={{ display: 'flex', alignItems: 'center', p: 1 }}>
                <AccessTimeIcon sx={{ fontSize: 20, color: checkInColor, mr: 0.5 }} />
                <Typography variant="body2" sx={{ color: checkInColor, fontSize: '16px', fontFamily: 'Roboto Mono', fontWeight: '500' }}>
                  {day.come_time || '--:--'}
                </Typography>
              </Box>

              {/* Выход */}
              <Box id='leave' sx={{ display: 'flex', alignItems: 'center', p: 1 }}>
                <ExitToAppIcon sx={{ fontSize: 20, color: checkOutColor, mr: 0.5 }} />
                <Typography variant="body2" sx={{ color: checkOutColor, fontSize: '16px', fontFamily: 'Roboto Mono', fontWeight: '500' }}>
                  {day.leave_time || '--:--'}
                </Typography>
              </Box>

              {/* Тотал */}
              <Box id='total' sx={{ display: 'flex', alignItems: 'center', p: 1 }}>
                <TimelapseIcon sx={{ fontSize: 20, color: totalHoursColor, mr: 0.5 }} />
                <Typography variant="body2" sx={{ color: totalHoursColor, fontSize: '16px', fontFamily: 'Roboto Mono', fontWeight: '500'}}>
                  {day.total_hours || '--:--'}
                </Typography>
              </Box>
            </Box>
          </Box>
        </Grid>
      );
    })
  ) : (
    <Grid item xs={12}>
      <Typography variant="body2" align="center">...</Typography>
    </Grid>
  )}
</Grid>

</Box>

  );
};

export default WeeklyTimesheet;

