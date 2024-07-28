import React, { useState } from "react";
import { TableBody, TableRow, TableCell, Box, Select, MenuItem, SelectChangeEvent, Button } from "@mui/material";
import { TableData, Column, DateOrString } from "./types";

interface AttendanceTableBodyProps {
  columns: Column[];
  filteredData: TableData[];
  onStatusChange: (rowId: string, newStatus: string) => void;
  onEdit?: (item: TableData) => void;
  onDelete?: (id: string) => void;
}

const formatValue = (value: DateOrString, key?: string): string => {
  if (value === undefined) {
    return '';
  }
  if (value instanceof Date) {
    if (key === 'date') {
      return value.toISOString().split('T')[0];
    } else if (key === 'checkIn' || key === 'checkOut') {
      return value.toTimeString().split(' ')[0];
    }
    return value.toLocaleString();
  }
  if (typeof value === 'number') {
    return value.toString();
  }
  return value;
};

const capitalize = (str: string): string => {
  return str.charAt(0).toUpperCase() + str.slice(1).toLowerCase();
};

const getStatusStyles = (status: string): { backgroundColor: string; color: string } => {
  switch (status.toLowerCase()) {
    case 'present':
      return { backgroundColor: '#e6effc', color: '#0764e6' };
    case 'absent':
      return { backgroundColor: '#ffe5ee', color: '#aa0000' };
    case 'late arrival':
      return { backgroundColor: '#fff8e7', color: '#d5b500' };
    case 'work from home':
      return { backgroundColor: '#E0FFC6', color: '#112A46' };
    case 'excused absence':
      return { backgroundColor: '#efefef', color: '#8a8a8a' };
    default:
      return { backgroundColor: '#fff', color: '#000' };
  }
};

const AttendanceTableBody: React.FC<AttendanceTableBodyProps> = ({ 
  columns, 
  filteredData, 
  onStatusChange, 
  onEdit, 
  onDelete 
}) => {
  const [editingRowId, setEditingRowId] = useState<string | null>(null);

  const handleStatusChange = (rowId: string, newStatus: string) => {
    onStatusChange(rowId, newStatus);
    setEditingRowId(null);
  };

  return (
    <TableBody>
      {filteredData.map((row) => (
        <TableRow hover role="checkbox" tabIndex={-1} key={row.id}>
          {columns.map((column) => {
            if (column.id === 'action') {
              return (
                <TableCell key={column.id} sx={{ padding: '8px 16px' }}>
                  <Box sx={{ display: 'flex', gap: 1 }}>
                    {onEdit && (
                      <Button onClick={() => onEdit(row)} variant="outlined" size="small">
                        Edit
                      </Button>
                    )}
                    {onDelete && (
                      <Button onClick={() => onDelete(row.id)} variant="outlined" size="small" color="error">
                        Delete
                      </Button>
                    )}
                  </Box>
                </TableCell>
              );
            }

            const value = row[column.id as keyof TableData];
            const { backgroundColor, color } = column.id === 'status' && value !== undefined 
              ? getStatusStyles(value as string) 
              : { backgroundColor: '#fff', color: '#000' };
            
            return (
              <TableCell key={column.id} sx={{ padding: '8px 16px' }}>
                {column.id === 'status' && value !== undefined ? (
                  editingRowId === row.id ? (
                    <Select
                      value={value as string}
                      onChange={(e: SelectChangeEvent<string>) => handleStatusChange(row.id, e.target.value)}
                      displayEmpty
                      sx={{
                        backgroundColor,
                        color,
                        px: 1,
                        borderRadius: 1,
                        minWidth: 120,
                        height: 36,
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                      }}
                    >
                      {['Present', 'Absent', 'Late Arrival', 'Work From Home', 'Excused Absence'].map((status) => (
                        <MenuItem key={status} value={status}>{status}</MenuItem>
                      ))}
                    </Select>
                  ) : (
                    <Box
                      sx={{
                        backgroundColor,
                        color,
                        borderRadius: 1,
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        height: 36,
                        minWidth: 120,
                        cursor: 'pointer'
                      }}
                      onClick={() => setEditingRowId(row.id)}
                    >
                      {capitalize(value as string)}
                    </Box>
                  )
                ) : (
                  formatValue(value, column.id)
                )}
              </TableCell>
            );
          })}
        </TableRow>
      ))}
    </TableBody>
  );
};

export default AttendanceTableBody;