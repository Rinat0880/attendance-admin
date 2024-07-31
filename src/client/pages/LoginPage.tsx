import React, { useState,useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Employee, employees } from '../../employees';
import { Box, TextField, Button, Typography, Container, useTheme } from '@mui/material';
import axiosIntance from '../../utils/libs/axios';

interface LoginPageProps {
  onLoginSuccess: (employee: Employee) => void;
}

function LoginPage({ onLoginSuccess }: LoginPageProps) {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const navigate = useNavigate();
  const theme = useTheme();

  // useEffect(()=>{


  //  const getUsers=async()=>{
  //   try {
      
  //     const {data}=await axiosIntance.post("/users",{
  //       name:"Bekzod",
  //       age:30
  //     })
  //     if(data){
  //       console.log(data);
  //       localStorage.setItem("token","ojifhbdnkjnfhbvknlcfsjh mlfkns jms knfm")
  //      let token= localStorage.getItem("token")
  //      console.log(token);
       
  //     }
  //   } catch (error) {
  //     console.log(error);
      
  //   }
  //  }

  //  const {data}=await axiosIntance.post("url", info{
  //   headers:{
  //     Authorization: `Bearer ${token}`
  //   }

  //  })
  //  getUsers()
  // },[])


  const handleLogin = async() => {
    const employee = employees.find(
      (emp) => emp.username === username && emp.password === password
    );
    // let info={
    //   employee_id:"",
    //   password:""
    // }
    // info.employee_id=username
    // info.password=password

    // console.log(info);
    
    // try {
    //   const {data}=await axiosIntance.post("/sign-in",info)
    //   if(data){
    //     navigate('/')
    //   }
      
    // } catch (error) {
    //   console.log(error);
      
    // }

    if (employee) {
      try {
        const {data}=await axiosIntance.post("/sign-in",employee,)
      } catch (error) {
        
      }
      onLoginSuccess(employee);
      navigate('/'); // Перенаправление после входа
    } else {
      setError('Неверное имя пользователя или пароль');
    }
    // console.log(employee);
    
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
