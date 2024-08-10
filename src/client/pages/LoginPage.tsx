import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Box, TextField, Button, Typography, Container, useTheme } from '@mui/material';
import axiosIntance, { setAuthToken } from '../../utils/libs/axios';

interface LoginPageProps {
  onLoginSuccess: (token: string) => void;
}

function LoginPage({ onLoginSuccess }: LoginPageProps) {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const navigate = useNavigate();
  const theme = useTheme();

  const handleLogin = async() => {
    const info = { employee_id: username, password };
    
    try {
      const { data } = await axiosIntance.post("/sign-in", info);
      if (data.access_token) {
        setAuthToken(data.access_token); // Устанавливаем токен
        onLoginSuccess(data.access_token);
        navigate('/');
      } else {
        setError('Ошибка авторизации');
      }
    } catch (error) {
      setError('Неверное имя пользователя или пароль');
    }
  };

  return (
    <Container maxWidth="xs">
      <Box
        sx={{
          marginTop: 8,
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          padding: 3, 
          borderRadius: 4, 
          boxShadow: 3, 
          backgroundColor: '#f0f8ff', 
        }}
      >
        <Typography component="h1" variant="h5">
          Log In
        </Typography>
        <TextField
          margin="normal"
          required
          fullWidth
          id="username"
          label="username"
          name="username"
          autoComplete="username"
          autoFocus
          value={username}
          onChange={(e) => setUsername(e.target.value)}
        />
        <TextField
          margin="normal"
          required
          fullWidth
          name="password"
          label="password"
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
            '&:hover': {
              backgroundColor: theme.palette.success.dark, 
            },
          }}
          onClick={handleLogin}
        >
          Continue
        </Button>
      </Box>
    </Container>
  );
}

export default LoginPage;
