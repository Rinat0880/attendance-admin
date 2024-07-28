// src/admin/pages/EmployeeListPage.tsx

import React, { useState } from 'react';
import { Box, Typography, Paper } from '@mui/material';
import AttendanceTable from '../components/Table/Table/AttendanceTable';
import { TableData, Column } from '../components/Table/Table/types';
import employeeData from '../components/Table/Table/mockEmployees';
import EditModal from '../components/Table/Table/EditModal';

const columns: Column[] = [
  { id: 'id', label: 'ID'},
  { id: 'name', label: 'Name'},
  { id: 'department', label: 'Department'},
  { id: 'role', label: 'Role'},
  { id: 'phone', label: 'Phone Number'},
  { id: 'email', label: 'Email'},
  { id: 'action', label: 'Actions'},
];

const EmployeeListPage: React.FC = () => {
  const [editModalOpen, setEditModalOpen] = useState(false);
  const [selectedEmployee, setSelectedEmployee] = useState<TableData | null>(null);

  const handleEditOpen = (employee: TableData) => {
    setSelectedEmployee(employee);
    setEditModalOpen(true);
  };

  const handleEditSave = (updatedEmployee: TableData) => {
    // Логика сохранения обновленного сотрудника
    console.log('Saving updated employee:', updatedEmployee);
    setEditModalOpen(false);
  };

  const handleDeleteEmployee = (id: string) => {
    // Логика удаления сотрудника
    console.log('Deleting employee with id:', id);
    // Здесь вы можете добавить логику для удаления сотрудника из вашего состояния или отправки запроса на сервер
  };

  return (
    <Box sx={{ p: 3 }}>
      <Typography variant="h4" sx={{ mb: 3 }}>Employee List</Typography>
        <AttendanceTable 
          data={employeeData} 
          columns={columns} 
          onEdit={handleEditOpen}
          onDelete={handleDeleteEmployee}
        />
      <EditModal
        open={editModalOpen}
        data={selectedEmployee}
        onClose={() => setEditModalOpen(false)}
        onSave={handleEditSave}
      />
    </Box>
  );
};

export default EmployeeListPage;
