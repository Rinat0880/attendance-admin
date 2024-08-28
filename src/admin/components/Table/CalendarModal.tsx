import React, { useState } from "react";
import { Box, Button, Typography, TextField } from "@mui/material";
import { AdapterDayjs } from "@mui/x-date-pickers/AdapterDayjs";
import { LocalizationProvider } from "@mui/x-date-pickers/LocalizationProvider";
import { DatePicker } from "@mui/x-date-pickers/DatePicker";
import dayjs, { Dayjs } from "dayjs";

interface CalendarModalProps {
  onClose: (selectedDate: Date | null) => void;
  open: boolean; // Add 'open' prop to control modal visibility
}

const CalendarModal: React.FC<CalendarModalProps> = ({ onClose, open }) => {
  const [selectedDate, setSelectedDate] = useState<Dayjs | null>(dayjs());

  const handleDateChange = (date: Dayjs | null) => {
    setSelectedDate(date);
  };

  const handleClose = () => {
    onClose(selectedDate?.toDate() || null);
  };

  if (!open) {
    return null;
  }

  return (
    <LocalizationProvider dateAdapter={AdapterDayjs}>
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
          boxShadow: 24,
        }}
      >
        <Typography variant="h6">Выберите дату</Typography>
        <DatePicker
          label="Дата"
          value={selectedDate}
          onChange={handleDateChange}
        />
        {selectedDate !== null && (
          <Button onClick={handleClose} variant="contained" sx={{ mt: 2 }}>
            Выбрать
          </Button>
        )}
      </Box>
    </LocalizationProvider>
  );
};

export default CalendarModal;
