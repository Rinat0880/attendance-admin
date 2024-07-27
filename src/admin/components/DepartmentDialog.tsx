import React, { useState } from 'react';
import {
  Dialog, DialogTitle, DialogContent, TextField, DialogActions, Button,
} from '@mui/material';
import { Department } from '../pages/DepartmentPositionManagement'; 


interface DepartmentDialogProps {
  open: boolean;
  onClose: () => void;
  department: Department | null;
  onSave: (department: Department) => void;
}

function DepartmentDialog({ open, onClose, department, onSave }: DepartmentDialogProps) {
  const [name, setName] = useState(department?.name || '');

  const handleSave = () => {
    if (name.trim() !== '') {
      onSave({ id: department?.id || 0, name }); 
      onClose();
    } else {
      alert('Please enter a department name.');
    }
  };

  return (
    <Dialog open={open} onClose={onClose}>
      <DialogTitle>{department ? 'Edit Department' : 'Add Department'}</DialogTitle>
      <DialogContent>
        <TextField
          autoFocus
          margin="dense"
          id="name"
          label="Department Name"
          type="text"
          fullWidth
          variant="standard"
          value={name}
          onChange={(e) => setName(e.target.value)}
        />
      </DialogContent>
      <DialogActions>
        <Button onClick={onClose}>Cancel</Button>
        <Button onClick={handleSave}>Save</Button>
      </DialogActions>
    </Dialog>
  );
}

export default DepartmentDialog;
