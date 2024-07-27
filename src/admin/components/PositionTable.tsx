import React from 'react';
import {
  Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Paper, Button,
} from '@mui/material';
import { Department, Position } from '../pages/DepartmentPositionManagement'; 

interface PositionTableProps {
  positions: Position[];
  departments: Department[];
  onEdit: (position: Position) => void;
  onDelete: (positionId: number) => void;
}

function PositionTable({ positions, departments, onEdit, onDelete }: PositionTableProps) {
  return (
    <TableContainer component={Paper}>
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
              <TableCell>
                {departments.find(d => d.id === position.departmentId)?.name || 'Unknown'}
              </TableCell>
              <TableCell>
                <Button onClick={() => onEdit(position)}>Edit</Button>
                <Button onClick={() => onDelete(position.id)}>Delete</Button>
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </TableContainer>
  );
}

export default PositionTable;
