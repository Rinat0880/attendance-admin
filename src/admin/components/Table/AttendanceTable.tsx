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
  IconButton,
  Modal,
  Button,
} from "@mui/material";
import SearchIcon from "@mui/icons-material/Search";
import CalendarTodayIcon from "@mui/icons-material/CalendarToday"; 

import { TableData, Column, FilterState } from "./types";
import AttendanceTableHead from "./AttendanceTableHead";
import AttendanceTableBody from "./AttendanceTableBody";
import CalendarModal from "./CalendarModal";
import { LocalizationProvider } from "@mui/x-date-pickers/LocalizationProvider";
import { AdapterDayjs } from "@mui/x-date-pickers/AdapterDayjs";  

import dayjs from "dayjs";
import weekOfYear from "dayjs/plugin/weekOfYear";
import customParseFormat from "dayjs/plugin/customParseFormat";
import localizedFormat from "dayjs/plugin/localizedFormat";
import isBetween from "dayjs/plugin/isBetween";
import advancedFormat from "dayjs/plugin/advancedFormat";

// Extend Day.js with the plugins
dayjs.extend(weekOfYear);
dayjs.extend(customParseFormat);
dayjs.extend(localizedFormat);
dayjs.extend(isBetween);
dayjs.extend(advancedFormat);

interface AttendanceTableProps {
  data: TableData[];
  columns: Column[];
  onEdit?: (item: TableData) => void;
  onDelete?: (id: string) => void;
  tableTitle?: string;
  showCalendar?: boolean;
}

const AttendanceTable: React.FC<AttendanceTableProps> = ({
  data,
  columns,
  onEdit,
  onDelete,
  tableTitle,
  showCalendar = true,
}) => {
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(10);
  const [searchTerm, setSearchTerm] = useState("");
  const [filters,   
 setFilters] = useState<FilterState>({});
  const [filteredData, setFilteredData] = useState<TableData[]>(data);
  const [isCalendarOpen, setIsCalendarOpen] = useState(false);
  const [selectedDate, setSelectedDate] = useState<Date | null>(null);

  const filterData = () => {
    const filtered = data.filter((row) => {
      const matchesSearch =
        row.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        row.id.toLowerCase().includes(searchTerm.toLowerCase());

      const matchesFilters = Object.entries(filters).every(([key, value]) => {
        if (!value) return true;
        return (
          row[key as keyof TableData]?.toString().toLowerCase() ===
          value.toLowerCase()
        );
      });

      // Filter by date if a date is selected
      const matchesDate = !selectedDate || dayjs(row.date).isSame(dayjs(selectedDate), 'day');

      return matchesSearch && matchesFilters && matchesDate;
    });

    setFilteredData(filtered);
    setPage(0);
  };

  useEffect(() => {
    filterData(); // Call filterData initially and whenever dependencies change
  }, [data, searchTerm, filters, selectedDate]);

  const handleChangePage = (event: unknown, newPage: number) => {
    setPage(newPage);
  };

  const handleChangeRowsPerPage = (
    event: React.ChangeEvent<HTMLInputElement>
  ) => {
    setRowsPerPage(parseInt(event.target.value,   
 10));
    setPage(0);
  };

  const handleSearch = (event: React.MouseEvent<HTMLButtonElement>) => {
    event.preventDefault();
    filterData(); // Trigger filtering when the search button is clicked
  };

  const handleFilterChange = (columnId: string, value: string) => {
    setFilters((prev) => ({
      ...prev,
      [columnId]: value,
    }));
  };


  const capitalize = (str: string): string => {
    return str.charAt(0).toUpperCase() + str.slice(1).toLowerCase();
  };

  const handleStatusChange = (rowId: string, newStatus: string) => {
    setFilteredData((prevData) =>
      prevData.map((row) =>
        row.id === rowId ? { ...row, status: capitalize(newStatus) } : row
      )
    );
  };

  const handleCalendarOpen = () => {
    setIsCalendarOpen(true);
  };

  const handleCalendarClose = (selectedDate: Date | null) => {
    console.log(selectedDate);
    setIsCalendarOpen(false);
  };

  return (
    <Paper sx={{ width: "100%", overflow: "hidden", borderRadius: 4, mb: 5 }}>
      <Box
        sx={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          p: 2,
        }}
      >
        <Typography variant="h6">
          {tableTitle || "Attendance Overview"}
        </Typography>
        <Box
          sx={{
            display: "flex",
            justifyContent: "space-between",
            width: "60%",
          }}
        >
          <TextField
            variant="outlined"
            size="small"
            placeholder="Quick Search..."
            value={searchTerm}
            InputProps={{
              startAdornment: (
                <InputAdornment position="start">
                  <SearchIcon />
                </InputAdornment>
              ),
            }}
            sx={{ width: 300 }}
          />
          {showCalendar && (
            <IconButton onClick={() => setIsCalendarOpen(true)}>
              <CalendarTodayIcon />
            </IconButton>
          )}
          <Button
            type="submit"
            variant="contained"
            onClick={handleSearch}
            endIcon={<SearchIcon />}
          >
            Search
          </Button>
        </Box>
      </Box>
      <TableContainer>
        <Table stickyHeader aria-label="sticky table">
          <AttendanceTableHead
            columns={columns}
            filters={filters}
            onFilterChange={handleFilterChange}
          />
          <AttendanceTableBody
            columns={columns}
            filteredData={filteredData}
            onStatusChange={handleStatusChange}
            onEdit={onEdit}
            onDelete={onDelete}
          />
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
      <Modal open={isCalendarOpen}>
        <Box
          sx={{
            position: "absolute",
            top: "50%",
            left: "50%",
            transform: "translate(-50%, -50%)",
            width: 400,
            bgcolor: "background.paper",
            p: 4,
            borderRadius: 2,
          }}
        >
          <LocalizationProvider dateAdapter={AdapterDayjs}>
            <CalendarModal
              open={isCalendarOpen}
              onClose={handleCalendarClose}
            />
          </LocalizationProvider>
        </Box>
      </Modal>
    </Paper>
  );
};

export default AttendanceTable;
