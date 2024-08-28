import React, { useState, useEffect } from "react";
import {
  Modal,
  Box,
  TextField,
  Button,
  Typography,
  Select,
  MenuItem,
  FormControl,
  InputLabel,
  SelectChangeEvent,
} from "@mui/material";
import { TableData } from "./types";
import { createUser } from "../../../utils/libs/axios"; // Импортируем функцию createUser
import axiosInstance from "../../../utils/libs/axios";

interface CreateEmployeeModalProps {
  open: boolean;
  onClose: () => void;
  onSave: (newEmployee: TableData) => void;
  positions: Position[]; 
  departments: Department[];
}

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

const CreateEmployeeModal: React.FC<CreateEmployeeModalProps> = ({
  open,
  onClose,
  onSave,
  positions,
  departments,
}) => {
  const [newEmployee, setNewEmployee] = useState<Partial<TableData>>({
    position: "",
    department: "",
  });

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setNewEmployee({ ...newEmployee, [name]: value });
  };

  const handleSelectChange = (e: SelectChangeEvent<string>) => {
    const { name, value } = e.target;
    setNewEmployee({ ...newEmployee, [name as string]: value });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    try {
      const createdEmployee = await createUser(
        newEmployee.employee_id!,
        newEmployee.password!,
        newEmployee.role!,
        newEmployee.full_name!,
        departments.find((d) => d.name === newEmployee.department)?.id!,
        positions.find((p) => p.name === newEmployee.position)?.id!,
        newEmployee.phone!,
        newEmployee.email!
      );

      onSave(createdEmployee);
      onClose();
    } catch (error) {
      console.error("Error creating employee:", error);
    }
  };


  return (
    <Modal open={open} onClose={onClose}>
      <Box
        sx={{
          position: "absolute",
          top: "50%",
          left: "50%",
          transform: "translate(-50%, -50%)",
          width: 400,
          bgcolor: "background.paper",
          boxShadow: 24,
          p: 4,
        }}
      >
        <Typography variant="h6" component="h2" sx={{ mb: 2 }}>
          Create New Employee
        </Typography>
        <form onSubmit={handleSubmit} autoComplete="off">
          <TextField
            fullWidth
            margin="normal"
            name="full_name"
            label="Full Name"
            value={newEmployee.full_name || ""}
            onChange={handleInputChange}
            autoComplete="off"
            required
          />
          <TextField
            fullWidth
            margin="normal"
            name="employee_id"
            label="Employee ID"
            value={newEmployee.employee_id || ""}
            onChange={handleInputChange}
            autoComplete="off"
            required
          />
          <TextField
            required
            fullWidth
            margin="normal"
            name="password"
            label="Password"
            type="password"
            value={newEmployee.password || ""}
            onChange={handleInputChange}
            autoComplete="new-password"
          />
          <FormControl fullWidth margin="normal" required>
            <InputLabel shrink={Boolean(newEmployee.role)}>Role</InputLabel>
            <Select
              name="role"
              value={newEmployee.role || ""}
              onChange={handleSelectChange}
            >
              <MenuItem value="">
                <em>None</em>
              </MenuItem>
              <MenuItem value="Admin">Admin</MenuItem>
              <MenuItem value="Employee">Employee</MenuItem>
            </Select>
          </FormControl>
          <FormControl fullWidth margin="normal" required>
            <InputLabel shrink={Boolean(newEmployee.department)}>
              Department
            </InputLabel>
            <Select

name="department"
value={newEmployee.department || ""}
onChange={handleSelectChange}
>
<MenuItem value="">
  <em>None</em>
</MenuItem>
{departments.map((department) => (
  <MenuItem key={department.id} value={department.name}>
    {department.name}
  </MenuItem>
))}
</Select>
</FormControl>
<FormControl fullWidth margin="normal" required>
<InputLabel shrink={Boolean(newEmployee.position)}>
Position
</InputLabel>
<Select
name="position"
value={newEmployee.position || ""}
onChange={handleSelectChange}
>
<MenuItem value="">
  <em>None</em>
</MenuItem>
{positions.map((position) => (
  <MenuItem key={position.id} value={position.name}>
    {position.name}
  </MenuItem>
))}
</Select>
</FormControl>
<TextField
fullWidth
margin="normal"
name="phone"
label="Phone"
value={newEmployee.phone || ""}
onChange={handleInputChange}
required
/>
<TextField
fullWidth
margin="normal"
name="email"
label="Email"
value={newEmployee.email || ""}
onChange={handleInputChange}
required
/>
<Box sx={{ mt: 2, display: "flex", justifyContent: "flex-end" }}>
<Button onClick={onClose} sx={{ mr: 1 }}>
Cancel
</Button>
<Button type="submit" variant="contained">
Save
</Button>
</Box>
</form>
</Box>
</Modal>
);
};

export default CreateEmployeeModal;
