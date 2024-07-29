import React from 'react';
import {
  Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Paper, Button,
} from '@mui/material';
import { Department } from '../pages/DepartmentPositionManagement'; // Импортируем интерфейс

interface DepartmentTableProps {
  departments: Department[];
  onEdit: (department: Department) => void;
  onDelete: (departmentId: number) => void;



}

function DepartmentTable({ departments, onEdit, onDelete }: DepartmentTableProps) {
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
                <Button onClick={() => onEdit(department)}>Edit</Button>
                <Button onClick={() => onDelete(department.id)}>Delete</Button>
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </Paper>
  );
}

export default DepartmentTable;
