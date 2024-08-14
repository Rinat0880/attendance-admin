import React, { useState } from 'react';
import {
  Dialog, DialogTitle, DialogContent, TextField, DialogActions, Button,
  Select, MenuItem, FormControl, InputLabel,
} from '@mui/material';
import { Department, Position } from '../pages/DepartmentPositionManagement'; 
import { createPosition, updatePosition } from '../../utils/libs/axios'; 

interface PositionDialogProps {
  open: boolean;
  onClose: () => void;
  position: Position | null;
  departments: Department[];
  onSave: (position: Position) => void;
}

function PositionDialog({ open, onClose, position, departments, onSave }: PositionDialogProps) {
  const [name, setName] = useState(position?.name || '');
  const [departmentId, setDepartmentId] = useState<number | string>(position?.department_id || '');

  const handleSave = async () => {
    if (name.trim() !== '' && departmentId) {
      let savedPosition;
      const department = departments.find((dept) => dept.id === Number(departmentId))?.name || 'Unknown';

      if (position) {
        await updatePosition(position.id, name, Number(departmentId));
        savedPosition = { id: position.id, name, department_id: Number(departmentId), department };
      } else {
        const response = await createPosition(name, Number(departmentId));
        savedPosition = { id: response.data.id, name: response.data.name, department_id: response.data.department_id, department };
      }

      onSave(savedPosition);
      onClose();
    } else {
      alert('Please enter a position name and select a department.');
    }
  };

  return (
    <Dialog open={open} onClose={onClose}>
      <DialogTitle>{position ? 'Edit Position' : 'Add Position'}</DialogTitle>
      <DialogContent>
        <TextField
          autoFocus
          margin="dense"
          id="name"
          label="Position Name"
          type="text"
          fullWidth
          variant="standard"
          value={name}
          onChange={(e) => setName(e.target.value)}
        />
        <FormControl fullWidth variant="standard" sx={{ marginTop: 2 }}>
          <InputLabel id="department-select-label">Department</InputLabel>
          <Select
            labelId="department-select-label"
            id="department-select"
            value={departmentId}
            onChange={(e) => setDepartmentId(e.target.value as number)}
          >
            {departments.map((department) => (
              <MenuItem key={department.id} value={department.id}>
                {department.name}
              </MenuItem>
            ))}
          </Select>
        </FormControl>
      </DialogContent>
      <DialogActions>
        <Button onClick={onClose}>Cancel</Button>
        <Button onClick={handleSave}>Save</Button>
      </DialogActions>
    </Dialog>
  );
}

export default PositionDialog;
