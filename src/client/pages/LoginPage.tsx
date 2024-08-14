import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Button, TextField, Typography, Container, Box } from '@mui/material';
import axiosInstance from '../../utils/libs/axios';
import axios, { AxiosError } from 'axios';
import { Employee } from '../../employees';

interface LoginPageProps {
  onLoginSuccess: (employee: Employee) => void;
}

const LoginPage: React.FC<LoginPageProps> = ({ onLoginSuccess }) => {
  const [employeeId, setEmployeeId] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const navigate = useNavigate();

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
  
    if (!employeeId || !password) {
      setError('Пожалуйста, заполните все поля');
      return;
    }
  
    const instance = axiosInstance();
    try {
      console.log('Попытка входа c ID:', employeeId);
      const response = await instance.post("/sign-in", {
        employee_id: employeeId,
        password: password
      });
  
      console.log('Ответ от сервера:', response);
  
      if (response.data && response.data.data && response.data.data.access_token) {
        // Сохраняем токены в localStorage
        localStorage.setItem("access_token", response.data.data.access_token);
        localStorage.setItem("refresh_token", response.data.data.refresh_token);
        console.log('Токены сохранены в localStorage');
  
        // Если ваш сервер возвращает данные сотрудника, получите их
        const employeeData: Employee = response.data.employee;
        onLoginSuccess(employeeData);
        if (response.data.data.role == "ADMIN"){
        navigate("/admin");
      } else {
        navigate("/");
      }
      } else {
        console.error('Токены отсутствуют в ответе');
        setError('Неверный ответ от сервера');
      }
    } catch (err) {
      console.error('Ошибка при входе:', err);
      
      if (axios.isAxiosError(err)) {
        const axiosError = err as AxiosError;
        console.error("Детали ошибки:", axiosError);
        console.error("Статус ответа:", axiosError.response?.status);
        console.error("Данные ответа:", axiosError.response?.data);
        
        if (axiosError.response) {
          const errorMessage = typeof axiosError.response.data === 'object' && axiosError.response.data !== null
            ? (axiosError.response.data as { message?: string }).message || 'Неизвестная ошибка'
            : 'Неизвестная ошибка';
          setError(`Ошибка ${axiosError.response.status}: ${errorMessage}`);
        } else if (axiosError.request) {
          setError('Нет ответа от сервера. Проверьте подключение к интернету.');
        } else {
          setError(`Ошибка: ${axiosError.message}`);
        }
      } else {
        console.error("Неизвестная ошибка:", err);
        setError("Произошла неизвестная ошибка");
      }
    }
  };


  return (
    <Container component="main" maxWidth="xs">
      <Box
        sx={{
          marginTop: 8,
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
        }}
      >
        <Typography component="h1" variant="h5">
          Вход в систему
        </Typography>
        <Box component="form" onSubmit={handleLogin} noValidate sx={{ mt: 1 }}>
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
          <Button
            type="submit"
            fullWidth
            variant="contained"
            sx={{ mt: 3, mb: 2 }}
          >
            Войти
          </Button>
          {error && (
            <Typography color="error" align="center">
              {error}
            </Typography>
          )}
        </Box>
      </Box>
    </Container>
  );
};

export default LoginPage;
