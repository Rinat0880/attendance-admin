import React, { useState, useEffect } from "react";
import {
  Table,
  TableContainer,
  Paper,
  TablePagination,
  TextField,
  InputAdornment,
  Box,
  Typography,
} from "@mui/material";
import SearchIcon from '@mui/icons-material/Search';
import {TableData, Column, FilterState } from "./types";
import AttendanceTableHead from "./AttendanceTableHead";
import AttendanceTableBody from "./AttendanceTableBody";

interface AttendanceTableProps {
  data: TableData[];
  columns: Column[];
  onEdit?: (item: TableData) => void;
  onDelete?: (id: string) => void;
  tableTitle?: string;
}


const AttendanceTable: React.FC<AttendanceTableProps> = ({ data, columns, onEdit, onDelete, tableTitle }) => {
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(10);
  const [searchTerm, setSearchTerm] = useState("");
  const [filters, setFilters] = useState<FilterState>({});
  const [filteredData, setFilteredData] = useState<TableData[]>(data);

  useEffect(() => {
    const filtered = data.filter((row) => {
      const matchesSearch = 
        row.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        row.id.toLowerCase().includes(searchTerm.toLowerCase());

      const matchesFilters = Object.entries(filters).every(([key, value]) => {
        if (!value) return true;
        return row[key as keyof TableData]?.toString().toLowerCase() === value.toLowerCase();
      });

      return matchesSearch && matchesFilters;
    });

    setFilteredData(filtered);
    setPage(0);
  }, [data, searchTerm, filters]);

  const handleChangePage = (event: unknown, newPage: number) => {
    setPage(newPage);
  };

  const handleChangeRowsPerPage = (event: React.ChangeEvent<HTMLInputElement>) => {
    setRowsPerPage(parseInt(event.target.value, 10));
    setPage(0);
  };

  const handleSearch = (event: React.ChangeEvent<HTMLInputElement>) => {
    setSearchTerm(event.target.value);
  };

  const handleFilterChange = (columnId: string, value: string) => {
    setFilters(prev => ({
      ...prev,
      [columnId]: value
    }));
  };

  const capitalize = (str: string): string => {
    return str.charAt(0).toUpperCase() + str.slice(1).toLowerCase();
  };

  const handleStatusChange = (rowId: string, newStatus: string) => {
    setFilteredData(prevData =>
      prevData.map(row =>
        row.id === rowId ? { ...row, status: capitalize(newStatus) } : row
      )
    );
  };

  return (
    <Paper sx={{ width: '100%', overflow: 'hidden', borderRadius: 4, mb: 5 }}>
      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', p: 2 }}>
        <Typography variant="h6">{tableTitle || 'Attendance Overview'}</Typography>
        <TextField
          variant="outlined"
          size="small"
          placeholder="Quick Search..."
          value={searchTerm}
          onChange={handleSearch}
          InputProps={{
            startAdornment: (
              <InputAdornment position="start">
                <SearchIcon />
              </InputAdornment>
            ),
          }}
          sx={{ width: 300 }}
        />
      </Box>
      <TableContainer>
        <Table stickyHeader aria-label="sticky table">
          <AttendanceTableHead columns={columns} filters={filters} onFilterChange={handleFilterChange} />
          <AttendanceTableBody columns={columns} filteredData={filteredData} onStatusChange={handleStatusChange} onEdit={onEdit} onDelete={onDelete}/>
        </Table>
      </TableContainer>
      <TablePagination
        rowsPerPageOptions={[10, 25, 100]}
        component="div"
        count={filteredData.length}
        rowsPerPage={rowsPerPage}
        page={page}
        onPageChange={handleChangePage}
        onRowsPerPageChange={handleChangeRowsPerPage}
      />
    </Paper>
  );
};

export default AttendanceTable;
