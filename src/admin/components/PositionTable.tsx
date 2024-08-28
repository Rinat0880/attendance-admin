import React from 'react';
import {
  Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Paper, Button, Box
} from '@mui/material';
import { Position, Department } from '../pages/DepartmentPositionManagement'; 
import { deletePosition } from '../../utils/libs/axios';

interface PositionTableProps {
  positions: Position[];
  onEdit: (position: Position) => void;
  onDelete: (positionId: number) => void;
  departments: Department[];
}

function PositionTable({ positions, onEdit, onDelete, departments }: PositionTableProps) {
  const handleDelete = async (id: number) => {
    await deletePosition(id);
    onDelete(id);
  };

  const getDepartmentName = (departmentId: number) => {
    const department = departments.find((dept) => dept.id === departmentId);
    return department ? department.name : 'Unknown';
  };

  return (
    <Paper sx={{  borderRadius: 4, boxShadow: 2, mb: 5}}>
      <Table>
        <TableHead>
          <TableRow>
            <TableCell>Position Name</TableCell>
            <TableCell>Department</TableCell>
            <TableCell>Actions</TableCell>
          </TableRow>
        </TableHead>
        <TableBody>
          {positions.map((position) => (
            <TableRow key={position.id}>
              <TableCell>{position.name}</TableCell>
              <TableCell>{getDepartmentName(position.department_id)}</TableCell>
              <TableCell>
              <Box sx={{ display: 'flex', gap: 1 }}>
                <Button onClick={() => onEdit(position)} variant="outlined" size='small'>Edit</Button>
                <Button onClick={() => handleDelete(position.id)} variant="outlined" size='small' color="error">Delete</Button>
                </Box>
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </Paper>
  );
}

export default PositionTable;