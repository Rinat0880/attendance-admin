import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import axiosInstance from "../../utils/libs/axios";
import {
  Box,
  TextField,
  Button,
  Typography,
  Container,
  useTheme,
} from "@mui/material";

interface LoginPageProps {
  onLoginSuccess: (employee: any) => void;
}

function LoginPage({ onLoginSuccess }: LoginPageProps) {
  const [employeeId, setEmployeeId] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const navigate = useNavigate();
  const theme = useTheme();

  const handleLogin = async () => {
    try {
      const formData = new FormData();
      formData.append("employee_id", employeeId);
      formData.append("password", password);

      console.log("Отправляемые данные:");
      formData.forEach((value, key) => {
        console.log(key, value);
      });

      const response = await axiosInstance.post("sign-in", formData);

      if (response.data && response.data.token) {
        localStorage.setItem("token", response.data.token);
        onLoginSuccess(response.data.employee);

        if (response.data.employee.isAdmin) {
          navigate("/admin");
        } else {
          navigate("/");
        }
      } else {
        setError("Неверный ответ от сервера");
      }
    } catch (err) {
      if (axios.isAxiosError(err)) {
        console.error("Ошибка запроса:", err.request);
        console.error("Ошибка ответа:", err.response);
        setError(err.response?.data?.message || "Ошибка при входе");
      } else {
        console.error("Неизвестная ошибка:", err);
        setError("Произошла неизвестная ошибка");
      }
    }
  };

  return (
    <Container
      maxWidth="sm"
      sx={{
        minHeight: "100vh",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
      }}
    >
      <Box
        sx={{
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          padding: 4,
          borderRadius: 4,
          boxShadow: 3,
          backgroundColor: "#f0f8ff",
          width: "100%",
          maxWidth: 400,
        }}
      >
        <Typography component="h1" variant="h5">
          Вход
        </Typography>
        <TextField
          margin="normal"
          required
          fullWidth
          id="employee_id"
          label="ID сотрудника"
          name="employee_id"
          autoComplete="employee_id"
          autoFocus
          value={employeeId}
          onChange={(e) => setEmployeeId(e.target.value)}
        />
        <TextField
          margin="normal"
          required
          fullWidth
          name="password"
          label="Пароль"
          type="password"
          id="password"
          autoComplete="current-password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
        />
        {error && (
          <Typography variant="body2" color="error">
            {error}
          </Typography>
        )}
        <Button
          type="submit"
          fullWidth
          variant="contained"
          sx={{
            mt: 3,
            mb: 2,
            backgroundColor: theme.palette.success.light,
            "&:hover": {
              backgroundColor: theme.palette.success.dark,
            },
          }}
          onClick={handleLogin}
        >
          Войти
        </Button>
      </Box>
    </Container>
  );
}

export default LoginPage;
