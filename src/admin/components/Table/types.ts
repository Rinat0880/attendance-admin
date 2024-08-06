// src/admin/components/Table/types.ts

export type DateOrString = Date | string | number | undefined;

export interface FilterState {
    [key: string]: string;
  }

  export interface TableData {
    id: string;
    name: string;
    department: string;
    role?: string;
    date?: DateOrString;
    status?: string;
    checkIn?: DateOrString;
    checkOut?: DateOrString;
    totalHrs?: number;
    phone?: string;
    email?: string;
  }

  export interface Column {
    id: keyof TableData | 'action';
    label: string;
    filterable?: boolean;
    filterValues?: string[];
  }

 