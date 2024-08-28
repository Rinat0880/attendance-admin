import React, { useState, useEffect } from 'react';
import { Box, Typography, Button, Divider } from '@mui/material';
import { format } from 'date-fns';
import AttendanceSummary from './AttendanceSummary';
import TabsComponent from './TabsComponent';
import { Column } from './Table/types';
import axiosInstance from '../../utils/libs/axios';
import axios from 'axios';
import AttendanceTable from '../../admin/components/Table/AttendanceTable';



interface MainContentProps {
  tabIndex: number;
  handleTabChange: (event: React.ChangeEvent<{}>, newValue: number) => void;
  attendanceSummary: {
    [key: string]: number;
  };
  employeeId: string;
  username: string; // Добавляем это свойство
  tableColumns: Column[];
}

interface DashboardData {
  come_time: string;
  leave_time: string;
  total_hours: string;
}

export interface Department {
  id: number;
  name: string;
}

export interface Position {
  id: number;
  name: string;
  department_id: number;
  department: string;
}

const MainContent: React.FC<MainContentProps> = ({
  tabIndex,
  handleTabChange,
  attendanceSummary,
  employeeId,
  tableColumns,
}) => {
  const [checkInTime, setCheckInTime] = useState<string>('--:--');
  const [checkOutTime, setCheckOutTime] = useState<string>('--:--');
  const [totalHours, setTotalHours] = useState<string>('--:--');
  const [message, setMessage] = useState<string | null>(null);
  const [messageColor, setMessageColor] = useState<string>('#000'); // Черный по умолчанию
  const [currentTime, setCurrentTime] = useState<string>(format(new Date(), 'HH:mm:ss'));
  const [departments, setDepartments] = useState<Department[]>([]);
  const [positions, setPositions] = useState<Position[]>([]);

  const columns: Column[] = [
    { id: 'employee_id', label: 'ID' },
    { id: 'full_name', label: 'フルネーム', filterable: true },
    { id: 'status', label: '状態', filterable: true, filterValues: ['出席', '欠席'] },
  ] as Column[];

useEffect(() => {
  const interval = setInterval(() => {
    setCurrentTime(format(new Date(), 'HH:mm:ss'));
  }, 1000);


  fetchDashboardData();

  return () => clearInterval(interval);
}, []);

const fetchDashboardData = async () => {
  try {
    const response = await axiosInstance().get<{ data: DashboardData, status: boolean }>('/user/dashboard');
    console.log('DashboardResponse:', response);

    if (response.data.status) {
      const { come_time, leave_time, total_hours } = response.data.data;

   
      setCheckInTime(come_time || '--:--');
      setCheckOutTime(leave_time || '--:--');
      setTotalHours(total_hours || '--:--');
    }
  } catch (error) {
    console.error('Ошибка при получении данных дашборда:', error);
  }
};

  const getCurrentPosition = (): Promise<GeolocationPosition> => {
    return new Promise((resolve, reject) => {
      if (!navigator.geolocation) {
        reject(new Error('Геолокация не поддерживается вашим браузером'));
      } else {
        navigator.geolocation.getCurrentPosition(resolve, reject, {
          enableHighAccuracy: true,
          timeout: 5000,
          maximumAge: 0,
        });
      }
    });
  };
  
  const sendComeData = async (type: 'checkIn' | 'checkOut') => {
    try {
      const position = await getCurrentPosition();
      const data = {
        employee_id: employeeId,
        latitude: position.coords.latitude,
        longitude: position.coords.longitude,
      };
  
      const token = localStorage.getItem('access_token');
      const headers = {
        Authorization: `Bearer ${token}`,
        'Content-Type': 'application/json', // Убедитесь, что указали тип контента как JSON
      };
  
      console.log('Отправляемые данные:', data);
      console.log('URL запроса:', type === 'checkIn' ? '/attendance/createbyphone' : '/attendance/exitbyphone');
      console.log('Токен авторизации:', token ? 'Присутствует' : 'Отсутствует');
      console.log('Заголовки запроса:', headers);
  
      const endpoint = type === 'checkIn' ? '/attendance/createbyphone' : '/attendance/exitbyphone';
  
      // Отправляем данные в теле запроса (body) с использованием PATCH
      const response = await axiosInstance().post(endpoint, data);
  
      console.log(`Ответ сервера (${type}):`, response.data);
      return response.data;
    } catch (error) {
      if (axios.isAxiosError(error)) {
        console.error(`Ошибка при отправке данных ${type}:`, error.response?.data || error.message);
      } else {
        console.error(`Неизвестная ошибка при отправке данных ${type}:`, error);
      }
      throw error;
    }
  };

  const sendLeaveData = async (type: 'checkIn' | 'checkOut') => {
    try {
      const position = await getCurrentPosition();
      const data = {
        employee_id: employeeId,
        latitude: position.coords.latitude,
        longitude: position.coords.longitude,
      };
  
      const token = localStorage.getItem('access_token');
      
      const headers = {
        Authorization: `Bearer ${token}`,
        'Content-Type': 'application/json', // Убедитесь, что указали тип контента как JSON
      };
  
      console.log('Отправляемые данные:', data);
      console.log('URL запроса:', type === 'checkIn' ? '/attendance/createbyphone' : '/attendance/exitbyphone');
      console.log('Токен авторизации:', token ? 'Присутствует' : 'Отсутствует');
      console.log('Заголовки запроса:', headers);
  
      const endpoint = type === 'checkIn' ? '/attendance/createbyphone' : '/attendance/exitbyphone';
  
      // Отправляем данные в теле запроса (body) с использованием PATCH
      const response = await axiosInstance().patch(endpoint, data);
  
      console.log(`CheckResponce (${type}):`, response.data);
      return response.data;
    } catch (error) {
      if (axios.isAxiosError(error)) {
        console.error(`Ошибка при отправке данных ${type}:`, error.response?.data || error.message);
      } else {
        console.error(`Неизвестная ошибка при отправке данных ${type}:`, error);
      }
      throw error;
    }
  };
  
  
  

  const handleComeClick = async () => {
    try {
      const result = await sendComeData('checkIn');
      if (result.status) {
        setCheckInTime(result.data.come_time);
        setMessage(`Добро пожаловать! Вы отметились в ${result.data.come_time}`);
        setMessageColor('#000'); // Черный для успешного сообщения
      } else {
        setMessage(result.error || 'Произошла ошибка при отметке прихода.');
        setMessageColor(result.error === 'distance from office is greater than office radius' ? '#ff0000' : '#000'); // Красный для определенной ошибки
      }
    } catch (error) {
      if (axios.isAxiosError(error) && error.response) {
        if (error.response.status === 401) {
          setMessage('Ошибка аутентификации. Пожалуйста, войдите в систему заново.');
          setMessageColor('#ff0000'); // Красный для ошибки аутентификации
        } else {
          setMessage(error.response.data.error || 'Произошла ошибка при отметке прихода.');
          setMessageColor('#ff0000'); // Красный для других ошибок
        }
      } else {
        setMessage('Ошибка при отметке прихода. Пожалуйста, проверьте разрешения на геолокацию и попробуйте снова.');
        setMessageColor('#ff0000'); // Красный для непредвиденной ошибки
      }
    }
  };

  const handleLeaveClick = async () => {
    if (checkInTime !== '--:--') {
      try {
        const result = await sendLeaveData('checkOut');
        if (result.status) {
          setCheckOutTime(result.data.leave_time);
          setMessage(`До свидания! Вы отметились в ${result.data.leave_time}`);
          setMessageColor('#000'); // Черный для успешного сообщения
        } else {
          setMessage(result.error || 'Произошла ошибка при отметке ухода.');
          setMessageColor(result.error === 'distance from office is greater than office radius' ? '#ff0000' : '#000'); // Красный для определенной ошибки
        }
      } catch (error) {
        console.error('Ошибка при отметке ухода:', error);
        setMessage('Ошибка при отметке ухода. Пожалуйста, проверьте разрешения на геолокацию и попробуйте снова.');
        setMessageColor('#ff0000'); // Красный для ошибки
      }
    } else {
      setMessage('Сначала нужно отметить приход!');
      setMessageColor('#ff0000'); // Красный для предупреждения
    }
  };

  return (
    <Box
      sx={{
        flexGrow: 1,
        bgcolor: 'white',
        borderRadius: 4,
        boxShadow: 3,
        p: 3,
        overflow: 'hidden',
        textAlign: 'center',
        position: 'relative',
        padding: 1,
      }}
    >
      <TabsComponent tabIndex={tabIndex} handleTabChange={handleTabChange} />

      {tabIndex === 0 && (
        <>
          <Typography variant="h3" sx={{ fontWeight: 'bold', color: '#1c1f26' }}>
            {currentTime}
          </Typography>
          <Typography variant="h6" color="#666666" sx={{ fontSize: '0.70rem' }}>
            {format(new Date(), 'PPP - EEEE')}
          </Typography>
          <Box sx={{ mt: 2, display: 'flex', justifyContent: 'center', gap: 2 }}>
            <Box sx={{ display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
              <Typography variant="h6" sx={{ color: '#1c1f26' }}>
                {checkInTime}
              </Typography>
              <Typography variant="body2" color="#666666" sx={{ mt: 1 }}>
                Check In
              </Typography>
            </Box>
            <Divider orientation="vertical" flexItem sx={{ mx: 1, borderColor: '#d6d6d6' }} />
            <Box sx={{ display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
              <Typography variant="h6" sx={{ color: '#1c1f26' }}>
                {checkOutTime}
              </Typography>
              <Typography variant="body2" color="#666666" sx={{ mt: 1 }}>
                Check Out
              </Typography>
            </Box>
            <Divider orientation="vertical" flexItem sx={{ mx: 1, borderColor: '#d6d6d6' }} />
            <Box sx={{ display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
              <Typography variant="h6" sx={{ color: '#1c1f26' }}>
                {totalHours}
              </Typography>
              <Typography variant="body2" color="#666666" sx={{ mt: 1 }}>
                Total Hours
              </Typography>
            </Box>
          </Box>
          <Box sx={{ mt: 4, display: 'flex', justifyContent: 'center', gap: 2 }}>
            <Button
              variant="contained"
              onClick={handleComeClick}
              sx={{
                borderRadius: 28,
                backgroundColor: '#1cbeca',
                '&:hover': {
                  backgroundColor: '#1a9bde',
                },
              }}
            >
              Come
            </Button>
            <Button
              variant="contained"
              onClick={handleLeaveClick}
              sx={{
                borderRadius: 28,
                backgroundColor: '#ff9500',
                '&:hover': {
                  backgroundColor: '#e88e00',
                },
              }}
            >
              Leave
            </Button>
          </Box>
          {message && (
            <Typography variant="body1" align="center" sx={{ mt: 2, color: messageColor }}>
              {message}
            </Typography>
          )}
        </>
      )}

      {tabIndex === 1 && <AttendanceSummary attendanceSummary={attendanceSummary}/>}

      {tabIndex === 2 && (
        <Box sx={{ overflowX: 'auto' }}>
          <AttendanceTable columns={columns} showCalendar={false} tableTitle=' ' departments={departments}
            positions={positions}/>
        </Box>
      )}
    </Box>
  );
};

export default MainContent;
