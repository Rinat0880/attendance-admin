import React, { useState, useEffect } from 'react';
import { Box, Typography, Paper, Button } from '@mui/material';
import AddIcon from '@mui/icons-material/Add';
import EmployeeTable from '../components/Table/EmployeeTable';
import EditModal from '../components/Table/EditModal';
import CreateEmployeeModal from '../components/Table/CreateEmployeeModal';
import UploadExcelModal from '../components/Table/UploadExcelModal'; // Импортируем модальное окно для загрузки файла
import { TableData, Column } from '../components/Table/types';
import axiosInstance, { updateUser, createUser, uploadExcelFile, fetchDepartments, fetchPositions } from '../../utils/libs/axios';

const columns: Column[] = [
  { id: 'employee_id', label: 'Login'}, 
  { id: 'full_name', label: 'Name' },
  { id: 'department', label: 'Department' },
  { id: 'position', label: 'Position' },
  { id: 'phone', label: 'Phone Number' },
  { id: 'email', label: 'Email' },
  { id: 'action', label: 'Actions' },
];

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

const EmployeeListPage: React.FC = () => {
  const [editModalOpen, setEditModalOpen] = useState(false);
  const [createModalOpen, setCreateModalOpen] = useState(false);
  const [uploadModalOpen, setUploadModalOpen] = useState(false); // Добавляем состояние для модального окна загрузки файла
  const [selectedEmployee, setSelectedEmployee] = useState<TableData | null>(null);
  const [employeeData, setEmployeeData] = useState<TableData[]>([]);
  const [departments, setDepartments] = useState<Department[]>([]);
  const [positions, setPositions] = useState<Position[]>([]);

  useEffect(() => {
    const loadDepartments = async () => {
      try {
        const response = await fetchDepartments();
        setDepartments(response); 
      } catch (error) {
        console.error("Failed to fetch departments", error);
      }
    };

    const loadPositions = async () => {
      try {
        const response = await fetchPositions();
        setPositions(response); 
      } catch (error) {
        console.error("Failed to fetch positions", error);
      }
    };

    loadDepartments();
    loadPositions();
  }, []);

  const handleEditOpen = (employee: TableData) => {
    setSelectedEmployee(employee);
    setEditModalOpen(true);
  };

  const handleEditSave = async (updatedEmployee: TableData) => {
    try {
      await updateUser(
        updatedEmployee.id, 
        updatedEmployee.employee_id!,
        updatedEmployee.password!,
        updatedEmployee.role!,
        updatedEmployee.full_name,
        updatedEmployee.department_id!,
        updatedEmployee.position_id!,
        updatedEmployee.phone!,
        updatedEmployee.email!
      );
      setEditModalOpen(false);
    } catch (error) {
      console.error('Ошибка при обновлении данных:', error);
    }
  };

  const handleCreateSave = async (newEmployee: TableData) => {
    try {
      const createdEmployee = await createUser(
        newEmployee.employee_id!,
        newEmployee.password!,
        newEmployee.role!,
        newEmployee.full_name,
        newEmployee.department_id!,
        newEmployee.position_id!,
        newEmployee.phone!,
        newEmployee.email!
      );
      setEmployeeData(prevData => [...prevData, { ...newEmployee, id: createdEmployee.id }]); // Присваиваем реальный id новому сотруднику
      setCreateModalOpen(false);
    } catch (error) {
      console.error('Ошибка при создании нового сотрудника:', error);
    }
  };

  const handleDelete = async (id: number) => {
    try {
      await axiosInstance().delete(`/user/${id}`);
    } catch (error) {
      console.error('Ошибка при удалении сотрудника:', error);
    }
  };

  const handleFileUpload = async (file: File) => {
    try {
      const formData = new FormData();
      formData.append('file', file);

      const response = await uploadExcelFile(formData);


      

      // Обработайте ответ после успешной загрузки
      console.log('Файл успешно загружен:', response);

      // Закройте модальное окно после загрузки
      setUploadModalOpen(false);
    } catch (error) {
      console.error('Ошибка при загрузке файла:', error);
    }
  };

  return (
    <Box sx={{ p: 3 }}>
      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 3 }}>
        <Typography variant="h4">Employee List</Typography>
        <Box>
          <Button
            variant="contained"
            startIcon={<AddIcon />}
            onClick={() => setCreateModalOpen(true)}
            sx={{ bgcolor: '#00D891', '&:hover': { bgcolor: '#00AB73' } }}
          >
            Create
          </Button>
          <Button
            variant="contained"
            startIcon={<AddIcon />}
            onClick={() => setUploadModalOpen(true)}
            sx={{ bgcolor: '#00D891', '&:hover': { bgcolor: '#00AB73' }, ml: 2 }}
          >
            Upload Excel
          </Button>
        </Box>
      </Box>
      <EmployeeTable
        departments={departments}
        positions={positions}
        columns={columns}
        onEdit={handleEditOpen}
        onDelete={handleDelete}
        tableTitle="Employee List"
        showCalendar={false}
      />
      <EditModal
        departments={departments}
        positions={positions}
        open={editModalOpen}
        data={selectedEmployee}
        onClose={() => setEditModalOpen(false)}
        onSave={handleEditSave}
      />
      <CreateEmployeeModal
        departments={departments}
        positions={positions}
        open={createModalOpen}
        onClose={() => setCreateModalOpen(false)}
        onSave={handleCreateSave}
      />
      <UploadExcelModal
        open={uploadModalOpen}
        onClose={() => setUploadModalOpen(false)}
        onUpload={handleFileUpload}
      />
    </Box>
  );
};

export default EmployeeListPage;

