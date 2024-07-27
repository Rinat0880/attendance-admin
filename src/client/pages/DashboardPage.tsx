import React, { useState, useEffect } from 'react';
import { Employee } from '../../employees';
import { useNavigate } from 'react-router-dom';
import {
    Button,
    Container,
    Typography,
    Avatar,
    Box,
    Grid,
    Paper,
    useTheme,
    Divider,
} from '@mui/material';
import { format, intervalToDuration } from 'date-fns';
import '@fontsource/poppins/500.css';

interface DashboardPageProps {
    employeeData: Employee;
    onLogout: () => void;
}

function DashboardPage({ employeeData, onLogout }: DashboardPageProps) {
    const [checkInTime, setCheckInTime] = useState<Date | null>(null);
    const [checkOutTime, setCheckOutTime] = useState<Date | null>(null);
    const [totalHours, setTotalHours] = useState<string>('--:--');
    const [message, setMessage] = useState<string | null>(null);
    const theme = useTheme();
    const navigate = useNavigate();

    useEffect(() => {
        console.log('Dashboard data:', employeeData);
    }, [employeeData]);

    if (!employeeData) {
        return <Typography variant="h6">Loading...</Typography>;
    }

    const handleComeClick = () => {
        const now = new Date();
        setCheckInTime(now);
        setMessage(`Welcome, ${employeeData.name}! You checked in at ${format(now, 'HH:mm')}`);
        setCheckOutTime(null);
        setTotalHours('--:--');
    };

    const handleLeaveClick = () => {
        if (checkInTime) {
            const now = new Date();
            setCheckOutTime(now);
            setMessage(`Goodbye, ${employeeData.name}! You checked out at ${format(now, 'HH:mm')}`);

            const duration = intervalToDuration({ start: checkInTime, end: now });
            setTotalHours(`${duration.hours || 0}h ${duration.minutes || 0}m`);
        } else {
            setMessage('You need to check in first!');
        }
    };

    const handleAdminClick = () => {
        if (employeeData.isAdmin) {
            navigate('/admin');
        } else {
            setMessage('You do not have admin access.');
        }
    };

    const attendanceSummary = {
        earlyLeaves: 2,
        absences: 5,
        lateIns: 0,
        leaves: 8,
    };

    return (
        <Container maxWidth="sm" sx={{ mt: 4 }}>
            {employeeData ? (
                <Box sx={{ mb: 4, p: 3, display: 'flex', flexDirection: 'column', alignItems: 'center', borderRadius: 4, backgroundColor: '#f0f8ff' }}>
                    <Box sx={{ display: 'flex', justifyContent: 'space-between', width: '100%', mb: 2 }}>
                        <Box sx={{ display: 'flex', justifyContent: 'flex-start' }}>
                            {employeeData.isAdmin && (
                                <Button variant="contained" color="primary" onClick={handleAdminClick} size="small">
                                    Admin
                                </Button>
                            )}
                        </Box>
                        <Box sx={{ display: 'flex', justifyContent: 'flex-end' }}>
                            <Button variant="contained" color="error" onClick={onLogout} size="small" sx={{ backgroundColor: theme.palette.secondary.main, '&:hover': { backgroundColor: theme.palette.error.main } }}>
                                Logout
                            </Button>
                        </Box>
                    </Box>
                    <Avatar src={employeeData.photoUrl} alt="Фото сотрудника" sx={{ width: 100, height: 100, mb: 2 }} />
                    <Typography variant="h5" component="h2" align="center" color={theme.palette.primary.main} fontWeight="bold">
                        Welcome, {employeeData.name}!
                    </Typography>

                    <Box sx={{ mt: 2, display: 'flex', justifyContent: 'center', gap: 2 }}>
                        <Box sx={{ display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
                            <Typography variant="h6">{checkInTime ? format(checkInTime, 'HH:mm') : '--:--'}</Typography>
                            <Typography variant="body2" color="textSecondary">Check In</Typography>
                        </Box>
                        <Divider orientation="vertical" flexItem sx={{ mx: 1 }} />
                        <Box sx={{ display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
                            <Typography variant="h6">{checkOutTime ? format(checkOutTime, 'HH:mm') : '--:--'}</Typography>
                            <Typography variant="body2" color="textSecondary">Check Out</Typography>
                        </Box>
                        <Divider orientation="vertical" flexItem sx={{ mx: 1 }} />
                        <Box sx={{ display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
                            <Typography variant="h6">{totalHours}</Typography>
                            <Typography variant="body2" color="textSecondary">Total Hours</Typography>
                        </Box>
                    </Box>

                    <Box sx={{ mt: 4, display: 'flex', justifyContent: 'center' }}>
                        <Button variant="contained" onClick={handleComeClick} sx={{ mr: 2, borderRadius: 28, backgroundColor: theme.palette.success.light, '&:hover': { backgroundColor: theme.palette.success.main } }}>
                            Come
                        </Button>
                        <Button variant="contained" onClick={handleLeaveClick} sx={{ borderRadius: 28, backgroundColor: theme.palette.warning.light, '&:hover': { backgroundColor: theme.palette.warning.main } }}>
                            Leave
                        </Button>
                    </Box>

                    {message && (
                        <Typography variant="body1" align="center" sx={{ mt: 2, color: 'primary.main' }}>
                            {message}
                        </Typography>
                    )}
                </Box>
            ) : (
                <Typography variant="h6">Loading...</Typography>
            )}

            <Box sx={{ p: 3, borderRadius: 4, backgroundColor: '#f8f9fa' }}>
                <Typography variant="h5" align="center" sx={{ mb: 2 }}>
                    Attendance Summary
                </Typography>
                <Grid container spacing={2}>
                    {Object.entries(attendanceSummary).map(([key, value]) => (
                        <Grid item xs={12} sm={6} key={key}>
                            <Paper elevation={3} sx={{ p: 2, borderRadius: 4, backgroundColor: key === 'earlyLeaves' ? '#e0ffff' : key === 'absences' ? '#f5f5dc' : key === 'lateIns' ? '#f0fff0' : '#fff5ee' }}>
                                <Typography variant="h5">{value}</Typography>
                                <Typography variant="body2">{key.charAt(0).toUpperCase() + key.slice(1)}</Typography> 
                            </Paper>
                        </Grid>
                    ))}
                </Grid>
            </Box>
        </Container>
    );
}

export default DashboardPage;
