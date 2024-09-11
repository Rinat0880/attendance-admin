import React, { useState, useEffect } from 'react';
import { Box, Typography, Button, Divider } from '@mui/material';
import { format } from 'date-fns';
import { ja } from 'date-fns/locale';
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
  username: string; 
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

const OFFICE_LATITUDE = 41.3171712;
const OFFICE_LONGITUDE = 69.3108736;
const ALLOWED_DISTANCE_KM = 1;

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
  const [messageColor, setMessageColor] = useState<string>('#000');
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
        navigator.geolocation.getCurrentPosition(
          (position) => {
            console.log('Получены координаты:', position.coords.latitude, position.coords.longitude);
            resolve(position);
          },
          (error) => {
            console.error('Ошибка получения геолокации:', error);
            reject(new Error('Ошибка получения геолокации. Убедитесь, что разрешения установлены и попробуйте снова.'));
          },
          {
            enableHighAccuracy: true,
            timeout: 5000,
            maximumAge: 0,
          }
        );
      }
    });
  };

  const getDistanceFromLatLonInKm = (lat1: number, lon1: number, lat2: number, lon2: number) => {
    const R = 6371; // Радиус Земли в километрах
    const dLat = (lat2 - lat1) * (Math.PI / 180);
    const dLon = (lon2 - lon1) * (Math.PI / 180);
    const a = 
      Math.sin(dLat / 2) * Math.sin(dLat / 2) +
      Math.cos(lat1 * (Math.PI / 180)) * Math.cos(lat2 * (Math.PI / 180)) * 
      Math.sin(dLon / 2) * Math.sin(dLon / 2); 
    const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a)); 
    const distance = R * c;
    return distance;
  };

  const checkLocation = async (type: 'checkIn' | 'checkOut') => {
    const position = await getCurrentPosition();
    const distance = getDistanceFromLatLonInKm(
      position.coords.latitude, 
      position.coords.longitude, 
      OFFICE_LATITUDE, 
      OFFICE_LONGITUDE
    );
  
    if (distance > ALLOWED_DISTANCE_KM) {
      setMessage(`You are ${distance.toFixed(2)} km away from the office. ${type === 'checkIn' ? 'Check-in not registered.' : 'Check-out not registered.'}`);
      setMessageColor('#ff0000');
      return false;
    }
    return true;
  };
  

  const sendComeData = async () => {
    try {
      const isInRange = await checkLocation('checkIn');
      if (!isInRange) return;

      const position = await getCurrentPosition();
      const data = {
        employee_id: employeeId,
        latitude: position.coords.latitude,
        longitude: position.coords.longitude,
      };

      const token = localStorage.getItem('access_token');
      const headers = {
        Authorization: `Bearer ${token}`,
        'Content-Type': 'application/json',
      };

      console.log('Отправляемые данные:', data);
      console.log('URL запроса:', '/attendance/createbyphone');
      console.log('Токен авторизации:', token ? 'Присутствует' : 'Отсутствует');
      console.log('Заголовки запроса:', headers);

      const response = await axiosInstance().post('/attendance/createbyphone', data);

      console.log(`Ответ сервера (checkIn):`, response.data);
      return response.data;
    } catch (error) {
      if (axios.isAxiosError(error)) {
        console.error(`Ошибка при отправке данных checkIn:`, error.response?.data || error.message);
      } else {
        console.error(`Неизвестная ошибка при отправке данных checkIn:`, error);
      }
      throw error;
    }
  };

  const sendLeaveData = async () => {
    try {
      const isInRange = await checkLocation('checkOut');
      if (!isInRange) return;

      const position = await getCurrentPosition();
      const data = {
        employee_id: employeeId,
        latitude: position.coords.latitude,
        longitude: position.coords.longitude,
      };

      const token = localStorage.getItem('access_token');
      const headers = {
        Authorization: `Bearer ${token}`,
        'Content-Type': 'application/json',
      };

      console.log('Отправляемые данные:', data);
      console.log('URL запроса:', '/attendance/exitbyphone');
      console.log('Токен авторизации:', token ? 'Присутствует' : 'Отсутствует');
      console.log('Заголовки запроса:', headers);

      const response = await axiosInstance().patch('/attendance/exitbyphone', data);

      console.log(`Ответ сервера (checkOut):`, response.data);
      return response.data;
    } catch (error) {
      if (axios.isAxiosError(error)) {
        console.error(`Ошибка при отправке данных checkOut:`, error.response?.data || error.message);
      } else {
        console.error(`Неизвестная ошибка при отправке данных checkOut:`, error);
      }
      throw error;
    }
  };

  const handleComeClick = async () => {
    try {
      const isInRange = await checkLocation('checkIn');
      if (!isInRange) return;
  
      const position = await getCurrentPosition();
      const data = {
        employee_id: employeeId,
        latitude: position.coords.latitude,
        longitude: position.coords.longitude,
      };
  
      const token = localStorage.getItem('access_token');
      const headers = {
        Authorization: `Bearer ${token}`,
        'Content-Type': 'application/json',
      };
  
      console.log('Отправляемые данные:', data);
      console.log('URL запроса:', '/attendance/createbyphone');
      console.log('Токен авторизации:', token ? 'Присутствует' : 'Отсутствует');
      console.log('Заголовки запроса:', headers);
  
      const response = await axiosInstance().post('/attendance/createbyphone', data);
  
      console.log(`Ответ сервера (checkIn):`, response.data);
      if (response.data.status) {
        setCheckInTime(response.data.data.come_time);
        setMessage(`Добро пожаловать! Вы отметились в ${response.data.data.come_time}`);
        setMessageColor('#000');
      } else {
        setMessage(response.data.error || 'Произошла ошибка при отметке прихода.');
        setMessageColor(response.data.error === 'distance from office is greater than office radius' ? '#ff0000' : '#000');
      }
    } catch (error) {
      console.error('Ошибка при отправке запроса на отметку прихода:', error);
      setMessageColor('#ff0000');
    }
  };

  const handleLeaveClick = async () => {
    if (checkInTime !== '--:--') {
      try {
        const result = await sendLeaveData();
        if (result && result.status) {
          setCheckOutTime(result.data.leave_time);
          setTotalHours(result.data.total_hours);
          setMessage(`Вы отметились на выход в ${result.data.leave_time}`);
          setMessageColor('#000');
        } else {
          setMessage(result.error || 'Произошла ошибка при отметке выхода.');
          setMessageColor(result.error === 'distance from office is greater than office radius' ? '#ff0000' : '#000');
        }
      } catch (error) {
        console.error('Ошибка при отправке запроса на отметку выхода:', error);
        setMessage('Ошибка при отметке выхода. Пожалуйста, проверьте разрешения на геолокацию и попробуйте снова.');
        setMessageColor('#ff0000');
      }
    } else {
      setMessage('Сначала отметьтесь на приход.');
      setMessageColor('#ff0000');
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
            {format(new Date(), 'yyyy年MM月dd日 (EEEE)', { locale: ja })}
          </Typography>
          <Box sx={{ mt: 2, display: 'flex', justifyContent: 'center', gap: 2 }}>
            <Box sx={{ display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
              <Typography variant="h6" sx={{ color: '#1c1f26' }}>
                {checkInTime}
              </Typography>
              <Typography variant="body2" color="#666666" sx={{ mt: 1 }}>
              出勤時間
              </Typography>
            </Box>
            <Divider orientation="vertical" flexItem sx={{ mx: 1, borderColor: '#d6d6d6' }} />
            <Box sx={{ display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
              <Typography variant="h6" sx={{ color: '#1c1f26' }}>
                {checkOutTime}
              </Typography>
              <Typography variant="body2" color="#666666" sx={{ mt: 1 }}>
              退勤時間
              </Typography>
            </Box>
            <Divider orientation="vertical" flexItem sx={{ mx: 1, borderColor: '#d6d6d6' }} />
            <Box sx={{ display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
              <Typography variant="h6" sx={{ color: '#1c1f26' }}>
                {totalHours}
              </Typography>
              <Typography variant="body2" color="#666666" sx={{ mt: 1 }}>
              総労働時間
              </Typography>
            </Box>
          </Box>
          <Box sx={{ mt: 4, display: 'flex', justifyContent: 'center', gap: 2 }}>
            <Button
              variant="contained"
              onClick={handleComeClick}
              sx={{
                borderRadius: 28,
                mb: '12px',
                backgroundColor: '#1cbeca',
                '&:hover': {
                  backgroundColor: '#1a9bde',
                },
              }}
            >
              出勤
            </Button>
            <Button
              variant="contained"
              onClick={handleLeaveClick}
              sx={{
                borderRadius: 28,
                mb: '12px',
                backgroundColor: '#ff9500',
                '&:hover': {
                  backgroundColor: '#e88e00',
                },
              }}
            >
              退勤
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
