import { TableData } from "./types";

const mockData: TableData[] = [
  {
    id: '1',
    name: 'John Doe',
    department: 'IT',
    role: 'Developer',
    date: new Date('2024-07-01T00:00:00Z'), // Пример даты
    status: 'Present',
    checkIn: new Date('2024-07-01T09:00:00Z'), // Пример времени
    checkOut: new Date('2024-07-01T17:00:00Z'), // Пример времени
    totalHrs: 8 // Пример суммарных часов
  },
  {
    id: '2',
    name: 'Jane Smith',
    department: 'HR',
    role: 'Manager',
    date: new Date('2024-07-01T00:00:00Z'), // Пример даты
    status: 'Absent',
    checkIn: new Date('2024-07-01T00:00:00Z'), // Пример времени
    checkOut: new Date('2024-07-01T00:00:00Z'), // Пример времени
    totalHrs: 0 // Пример суммарных часов
  },
  {
    id: '3',
    name: 'Michael Johnson',
    department: 'Finance',
    role: 'Accountant',
    date: new Date('2024-07-01T00:00:00Z'),
    status: 'Present',
    checkIn: new Date('2024-07-01T08:30:00Z'),
    checkOut: new Date('2024-07-01T16:30:00Z'),
    totalHrs: 8
  },
  {
    id: '4',
    name: 'Emily Davis',
    department: 'Marketing',
    role: 'Coordinator',
    date: new Date('2024-07-01T00:00:00Z'),
    status: 'Late Arrival',
    checkIn: new Date('2024-07-01T09:45:00Z'),
    checkOut: new Date('2024-07-01T17:45:00Z'),
    totalHrs: 7
  },
  {
    id: '5',
    name: 'David Wilson',
    department: 'Sales',
    role: 'Sales Representative',
    date: new Date('2024-07-01T00:00:00Z'),
    status: 'Work from Home',
    checkIn: new Date('2024-07-01T08:00:00Z'),
    checkOut: new Date('2024-07-01T16:00:00Z'),
    totalHrs: 8
  },
  {
    id: '6',
    name: 'Sophia Martinez',
    department: 'IT',
    role: 'Support Specialist',
    date: new Date('2024-07-01T00:00:00Z'),
    status: 'Absent',
    checkIn: new Date('2024-07-01T00:00:00Z'),
    checkOut: new Date('2024-07-01T00:00:00Z'),
    totalHrs: 0
  },
  {
    id: '7',
    name: 'James Brown',
    department: 'Operations',
    role: 'Manager',
    date: new Date('2024-07-01T00:00:00Z'),
    status: 'Present',
    checkIn: new Date('2024-07-01T07:30:00Z'),
    checkOut: new Date('2024-07-01T15:30:00Z'),
    totalHrs: 8
  },
  {
    id: '8',
    name: 'Olivia Jones',
    department: 'Customer Service',
    role: 'Representative',
    date: new Date('2024-07-01T00:00:00Z'),
    status: 'Present',
    checkIn: new Date('2024-07-01T09:00:00Z'),
    checkOut: new Date('2024-07-01T17:00:00Z'),
    totalHrs: 8
  },
  {
    id: '9',
    name: 'Liam Anderson',
    department: 'HR',
    role: 'Recruiter',
    date: new Date('2024-07-01T00:00:00Z'),
    status: 'Late Arrival',
    checkIn: new Date('2024-07-01T10:00:00Z'),
    checkOut: new Date('2024-07-01T18:00:00Z'),
    totalHrs: 7
  },
  {
    id: '10',
    name: 'Isabella Garcia',
    department: 'Finance',
    role: 'Analyst',
    date: new Date('2024-07-01T00:00:00Z'),
    status: 'Present',
    checkIn: new Date('2024-07-01T08:45:00Z'),
    checkOut: new Date('2024-07-01T16:45:00Z'),
    totalHrs: 8
  }
];

export default mockData;
