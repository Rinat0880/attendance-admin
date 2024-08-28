import React, { useState, useEffect } from 'react';
import AttendanceTable from '../components/Table/AttendanceTable';
import { Column, TableData } from '../components/Table/types';
import axiosInstance from '../../utils/libs/axios';

// Функция для форматирования времени
const formatTime = (timeString: string): string => {
  const date = new Date(timeString);
  return date.toTimeString().split(' ')[0]; // Возвращает время в формате HH:MM:SS
};

const columns: Column[] = [
  { id: 'id', label: 'ID' },
  { id: 'full_name', label: 'Full Name', filterable: true },
  { id: 'department', label: 'Department', filterable: true, filterValues: ['1-stage', '2-stage', '3-stage', '4-stage'] },
  { id: 'position', label: 'Position', filterable: true, filterValues: ['Developer', 'Marketolog', 'Cloud Engineer', 'Software engineer', 'CEO'] },
  { id: 'work_day', label: 'Work day' },
  { id: 'status', label: 'Status', filterable: true, filterValues: ['Present', 'Absent'] },
  { id: 'come_time', label: 'Check In' },
  { id: 'leave_time', label: 'Check Out' },
  { id: 'total_hourse', label: 'Total Hours' },
] as Column[];

const BigTablePage: React.FC = () => {
  const [data, setData] = useState<TableData[]>([]);

  useEffect(() => {
    const fetchEmployeeData = async () => {
      try {
        const response = await axiosInstance().get('/attendance/list');

        const formattedData = response.data.data.results.map((item: any) => ({
          id: item.id,
          department: item.department,
          position: item.position,
          employee_id: item.employee_id,
          full_name: item.full_name,
          status: item.status,
          work_day: item.work_day,
          come_time: formatTime(item.come_time), // Применяем форматирование
          leave_time: formatTime(item.leave_time), // Применяем форматирование
          total_hourse: item.total_hourse,
        }));

        setData(formattedData);
        console.log(formattedData);

      } catch (error) {
        console.error('Ошибка при загрузке данных:', error);
      }
    };

    fetchEmployeeData();
  }, []);

  return (
    <AttendanceTable
      showCalendar={false}
      columns={columns}
      tableTitle="Attendance Table"
      width="100%"
      height="800px"
    />
  );
};

export default BigTablePage;
