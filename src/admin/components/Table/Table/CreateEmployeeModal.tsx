import React, { useState } from 'react';
import { Modal, Box, TextField, Button, Typography } from '@mui/material';
import { TableData } from './types';

interface CreateEmployeeModalProps {
  open: boolean;
  onClose: () => void;
  onSave: (newEmployee: TableData) => void;
}

const CreateEmployeeModal: React.FC<CreateEmployeeModalProps> = ({ open, onClose, onSave }) => {
  const [newEmployee, setNewEmployee] = useState<Partial<TableData>>({});

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setNewEmployee({ ...newEmployee, [e.target.name]: e.target.value });
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSave(newEmployee as TableData);
  };

  return (
    <Modal open={open} onClose={onClose}>
      <Box sx={{
        position: 'absolute',
        top: '50%',
        left: '50%',
        transform: 'translate(-50%, -50%)',
        width: 400,
        bgcolor: 'background.paper',
        boxShadow: 24,
        p: 4,
      }}>
        <Typography variant="h6" component="h2" sx={{ mb: 2 }}>
          Create New Employee
        </Typography>
        <form onSubmit={handleSubmit}>
          <TextField
            fullWidth
            margin="normal"
            name="name"
            label="Name"
            value={newEmployee.name || ''}
            onChange={handleChange}
          />
          <TextField
            fullWidth
            margin="normal"
            name="department"
            label="Department"
            value={newEmployee.department || ''}
            onChange={handleChange}
          />
          <TextField
            fullWidth
            margin="normal"
            name="role"
            label="Role"
            value={newEmployee.role || ''}
            onChange={handleChange}
          />
          <TextField
            fullWidth
            margin="normal"
            name="phone"
            label="Phone"
            value={newEmployee.phone || ''}
            onChange={handleChange}
          />
          <TextField
            fullWidth
            margin="normal"
            name="email"
            label="Email"
            value={newEmployee.email || ''}
            onChange={handleChange}
          />
          <Box sx={{ mt: 2, display: 'flex', justifyContent: 'flex-end' }}>
            <Button onClick={onClose} sx={{ mr: 1 }}>Cancel</Button>
            <Button type="submit" variant="contained">Save</Button>
          </Box>
        </form>
      </Box>
    </Modal>
  );
};

export default CreateEmployeeModal;