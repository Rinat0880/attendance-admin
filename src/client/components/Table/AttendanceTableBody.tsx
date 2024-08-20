import React, { useState } from "react";
import { TableBody, TableRow, TableCell, Box, Select, MenuItem, SelectChangeEvent, Button } from "@mui/material";
import { TableData, Column, DateOrString } from "./types";

interface AttendanceTableBodyProps {
  columns: Column[];
  filteredData: TableData[];
  onEdit?: (item: TableData) => void;
  onDelete?: (id: number) => void;
}

const formatValue = (value: DateOrString | boolean, key?: string): string => {
  if (value === undefined || value === null) {
    return '';
  }
  if (typeof value === 'boolean') {
    return value ? 'Present' : 'Absent';
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

const getStatusStyles = (status: boolean): { backgroundColor: string; color: string } => {
  return status
    ? { backgroundColor: '#e6effc', color: '#0764e6' }
    : { backgroundColor: '#ffe5ee', color: '#aa0000' };
};

const AttendanceTableBody: React.FC<AttendanceTableBodyProps> = ({ 
  columns, 
  filteredData, 
  onEdit, 
  onDelete 
}) => {
  const [editingRowId, setEditingRowId] = useState<number | null>(null);

  const handleStatusChange = (rowId: number, newStatus: string) => {
    // onStatusChange(rowId, newStatus);
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
                      <Button
                        variant="outlined"
                        size="small"
                        color="error"
                        onClick={() => onDelete(row.id)}
                      >
                        Delete
                      </Button>
                    )}
                  </Box>
                </TableCell>
              );
            }

            const value = row[column.id as keyof TableData];
            const { backgroundColor, color } = column.id === 'status' && typeof value === 'boolean'
              ? getStatusStyles(value as boolean)
              : { backgroundColor: '#fff', color: '#000' };

            return (
              <TableCell key={column.id} sx={{ padding: '8px 16px' }}>
                {column.id === 'status' && value !== undefined ? (
                  editingRowId === row.id ? (
                    <Select
                      value={value.toString()} // Convert boolean to string for the select value
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
                      {[
                        { label: 'Present', value: 'true' },
                        { label: 'Absent', value: 'false' },
                      ].map(({ label, value }) => (
                        <MenuItem key={value} value={value}>{label}</MenuItem>
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
                      {formatValue(value, column.id)}
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