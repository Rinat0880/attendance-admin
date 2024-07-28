// src/admin/components/Table/types.ts

export type DateOrString = Date | string | number;
export interface FilterState {
    [key: string]: string;
  }

export interface AttendanceData {
  id: string;
  name: string;
  department: string;
  role: string;
  date: DateOrString;  // Может быть Date или строкой
  status: string;
  checkIn: DateOrString;  // Может быть Date или строкой
  checkOut: DateOrString;  // Может быть Date или строкой
  totalHrs: number; // Суммарные часы как число
}

export interface Column {
    id: keyof AttendanceData;
    label: string;
    filterable?: boolean;
    filterValues?: string[];
  }
