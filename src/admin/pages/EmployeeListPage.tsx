import React, { useState, useEffect } from 'react';
import { Box, Typography, Paper, Button } from '@mui/material';
import AddIcon from '@mui/icons-material/Add';
import AttendanceTable from '../components/Table/AttendanceTable';
import EditModal from '../components/Table/EditModal';
import CreateEmployeeModal from '../components/Table/CreateEmployeeModal'; // Новый компонент
import { TableData, Column } from '../components/Table/types';

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
  const [createModalOpen, setCreateModalOpen] = useState(false);
  const [selectedEmployee, setSelectedEmployee] = useState<TableData | null>(null);
  const [employeeData, setEmployeeData] = useState<TableData[]>([]);

  useEffect(() => {
    // Здесь вы можете загрузить данные о сотрудниках с сервера
    // Для примера, используем фиктивные данные
    setEmployeeData([
      { id: '1', name: 'John Doe', department: 'IT', role: 'Developer', phone: '123-456-7890', email: 'john@example.com' },
      { id: '2', name: 'Jane Smith', department: 'HR', role: 'Manager', phone: '098-765-4321', email: 'jane@example.com' },
    ]);
  }, []);

  const handleEditOpen = (employee: TableData) => {
    setSelectedEmployee(employee);
    setEditModalOpen(true);
  };

  const handleEditSave = (updatedEmployee: TableData) => {
    setEmployeeData(prevData => 
      prevData.map(emp => emp.id === updatedEmployee.id ? updatedEmployee : emp)
    );
    setEditModalOpen(false);
  };

  const handleDeleteEmployee = (id: string) => {
    setEmployeeData(prevData => prevData.filter(emp => emp.id !== id));
  };

  const handleCreateEmployee = (newEmployee: TableData) => {
    setEmployeeData(prevData => [...prevData, { ...newEmployee, id: String(prevData.length + 1) }]);
    setCreateModalOpen(false);
  };

  return (
    <Box sx={{ p: 3 }}>
      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 3 }}>
        <Typography variant="h4">Employee List</Typography>
        <Button 
          variant="contained" 
          startIcon={<AddIcon />} 
          onClick={() => setCreateModalOpen(true)}
          sx = {{ bgcolor: '#00D891', '&:hover': {bgcolor: '#00AB73'}}}
        >
          Create
        </Button>
      </Box>
        <AttendanceTable 
          data={employeeData} 
          columns={columns} 
          onEdit={handleEditOpen}
          onDelete={handleDeleteEmployee}
          tableTitle="Employee List"
          showCalendar={false}
        />
      <EditModal
        open={editModalOpen}
        data={selectedEmployee}
        onClose={() => setEditModalOpen(false)}
        onSave={handleEditSave}
      />
      <CreateEmployeeModal
        open={createModalOpen}
        onClose={() => setCreateModalOpen(false)}
        onSave={handleCreateEmployee}
      />
    </Box>
  );
};

export default EmployeeListPage;