import React from 'react';
import {
  Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Paper, Button, Box
} from '@mui/material';
import { Department } from '../pages/DepartmentPositionManagement';
import { deleteDepartment } from '../../utils/libs/axios';

interface DepartmentTableProps {
  departments: Department[];
  onEdit: (department: Department) => void;
  onDelete: (departmentId: number) => void;
}

function DepartmentTable({ departments, onEdit, onDelete }: DepartmentTableProps) {
  const handleDelete = async (id: number) => {
    await deleteDepartment(id);
    onDelete(id);
  };

  return (
    <Paper sx={{  borderRadius: 4, boxShadow: 2, mb: 5}}>
      <Table>
        <TableHead>
          <TableRow>
            <TableCell>Department Name</TableCell>
            <TableCell>Actions</TableCell>
          </TableRow>
        </TableHead>
        <TableBody>
          {departments.map((department) => (
            <TableRow key={department.id}>
              <TableCell>{department.name}</TableCell>
              <TableCell>
              <Box sx={{ display: 'flex', gap: 1 }}>
                <Button onClick={() => onEdit(department)} variant="outlined" size='small'>Edit</Button>
                <Button onClick={() => handleDelete(department.id)} variant="outlined" size='small' color="error">Delete</Button>
                </Box>
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </Paper>
  );
}

export default DepartmentTable;
