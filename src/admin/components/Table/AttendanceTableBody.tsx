import React from "react";
import {
  TableBody,
  TableRow,
  TableCell,
  Box,
  Button,
} from "@mui/material";
import { TableData, Column, DateOrString } from "./types";
import { useTranslation } from "react-i18next";

interface AttendanceTableBodyProps {
  columns: Column[];
  filteredData: TableData[];
  onEdit?: (item: TableData) => void;
  onDelete?: (id: number) => void;
}

const formatValue = (value: DateOrString | boolean, key?: string): string => {
  if (value === undefined || value === null) {
    if (key === "checkOut") {
      return "";
    }
    return "--:--";
  }
  if (typeof value === "boolean") {
    return value ? "Present" : "Absent";
  }
  if (value instanceof Date) {
    if (key === "date") {
      return value.toISOString().split("T")[0];
    } else if (key === "checkIn" || key === "checkOut") {
      return value.toTimeString().split(" ")[0];
    }
    return value.toLocaleString();
  }
  if (typeof value === "number") {
    return value.toString();
  }
  return value;
};

const getStatusStyles = (
  status: boolean
): { backgroundColor: string; color: string } => {
  return status
    ? { backgroundColor: "#e6effc", color: "#0764e6" }
    : { backgroundColor: "#ffe5ee", color: "#aa0000" };
};

const AttendanceTableBody: React.FC<AttendanceTableBodyProps> = ({
  columns,
  filteredData,
  onEdit,
  onDelete,
}) => {
  const { t } = useTranslation("admin");

  return (
    <TableBody>
      {filteredData.map((row, index) => (
        <TableRow
          hover
          role="checkbox"
          tabIndex={-1}
          key={`${row.id}-${index}`}
        >
          {columns.map((column) => {
            if (column.id === "action") {
              return (
                <TableCell key={column.id} sx={{ padding: "8px 16px" }}>
                  <Box sx={{ display: "flex", gap: 0.5 }}>
                    {onEdit && (
                      <Button
                        onClick={() => onEdit(row)}
                        variant="outlined"
                        size="small"
                      >
                        {t("employeeTable.editBtn")}
                      </Button>
                    )}
                    {onDelete && (
                      <Button
                        variant="outlined"
                        size="small"
                        color="error"
                        onClick={() => onDelete(row.id)}
                      >
                        {t("employeeTable.deleteBtn")}
                      </Button>
                    )}
                  </Box>
                </TableCell>
              );
            }

            const value = row[column.id as keyof TableData];
            const formattedValue = formatValue(value, column.id);

            return (
              <TableCell
                key={`${row.id}-${column.id}`}
                sx={{ padding: "8px 16px" }}
              >
                <Box
                  sx={{
                    display: "flex",
                    alignItems: "center",
                    height: 36,
                    ...(column.id === "status"
                      ? {
                          justifyContent: "center",
                          minWidth: 100,
                          borderRadius: 1,
                          ...getStatusStyles(value as boolean),
                        }
                      : {}),
                  }}
                >
                  {formattedValue}
                </Box>
              </TableCell>
            );
          })}
        </TableRow>
      ))}
    </TableBody>
  );
};

export default AttendanceTableBody;