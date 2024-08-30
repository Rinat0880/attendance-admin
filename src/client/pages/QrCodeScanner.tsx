import React, { useState, useRef, useCallback, useEffect } from 'react';
import Webcam from 'react-webcam';
import jsQR from 'jsqr';
import { Box, Typography, Paper, Snackbar, CircularProgress } from '@mui/material';
import { createByQRCode } from '../../utils/libs/axios';

interface ServerResponse {
  data: {
    id: number;
    employee_id: string;
    full_name: string;
    work_day: string;
    come_time: string;
  };
  message: string;
  status: boolean;
}

const QRCodeScanner: React.FC = () => {
  const [result, setResult] = useState<string | null>(null);
  const [isScanning, setIsScanning] = useState(true);
  const [isProcessing, setIsProcessing] = useState(false);
  const [snackbarOpen, setSnackbarOpen] = useState(false);
  const [snackbarMessage, setSnackbarMessage] = useState('');
  const [serverMessage, setServerMessage] = useState('');
  const [employeeName, setEmployeeName] = useState('');
  const [messageType, setMessageType] = useState<'check-in' | 'check-out' | null>(null);
  const webcamRef = useRef<Webcam | null>(null);

  const getCurrentPosition = (): Promise<GeolocationPosition> => {
    return new Promise((resolve, reject) => {
      if (!navigator.geolocation) {
        reject(new Error('Geolocation is not supported by your browser'));
      } else {
        navigator.geolocation.getCurrentPosition(resolve, reject, {
          enableHighAccuracy: true,
          timeout: 5000,
          maximumAge: 0,
        });
      }
    });
  };

  const sendEmployeeIdWithLocation = async (employeeId: string) => {
    setIsProcessing(true);
    try {
      const position = await getCurrentPosition();
      console.log('Sending request to server:', {
        employeeId,
        latitude: position.coords.latitude,
        longitude: position.coords.longitude
      });
      
      const response: ServerResponse = await createByQRCode(employeeId, position.coords.latitude, position.coords.longitude);
      console.log('Server response:', response);
      
      setServerMessage(response.message);
      setEmployeeName(response.data.full_name);
      setResult(response.data.employee_id);
      setSnackbarMessage('Record created successfully');
      setSnackbarOpen(true);
      
      // Determine message type based on the server message
      if (response.message.toLowerCase().includes('welcome')) {
        setMessageType('check-in');
      } else if (response.message.toLowerCase().includes('get home safely') || 
                 response.message.toLowerCase().includes('goodbye')) {
        setMessageType('check-out');
      } else {
        setMessageType(null);
      }
    } catch (error) {
      console.error('Error sending data:', error);
      setSnackbarMessage('Error creating record');
      setSnackbarOpen(true);
    } finally {
      setIsProcessing(false);
    }
  };

  const capture = useCallback(() => {
    if (webcamRef.current) {
      const imageSrc = webcamRef.current.getScreenshot();
      if (imageSrc) {
        const image = new Image();
        image.src = imageSrc;
        image.onload = () => {
          const canvas = document.createElement('canvas');
          canvas.width = image.width;
          canvas.height = image.height;
          const ctx = canvas.getContext('2d');
          if (ctx) {
            ctx.drawImage(image, 0, 0, image.width, image.height);
            const imageData = ctx.getImageData(0, 0, image.width, image.height);
            const code = jsQR(imageData.data, imageData.width, imageData.height);
            if (code) {
              console.log('QR Code detected:', code.data);
              setIsScanning(false);
              sendEmployeeIdWithLocation(code.data);
            }
          }
        };
      }
    }
  }, [webcamRef]);


  useEffect(() => {
    if (isScanning) {
      const interval = setInterval(() => {
        capture();
      }, 500);
      return () => clearInterval(interval);
    } else {
      const timer = setTimeout(() => {
        setIsScanning(true);
        setResult(null);
        setServerMessage('');
        setEmployeeName('');
        setMessageType(null);
      }, 5000);
      return () => clearTimeout(timer);
    }
  }, [isScanning, capture]);

  const handleSnackbarClose = () => {
    setSnackbarOpen(false);
  };

  const getMessageColor = () => {
    switch (messageType) {
      case 'check-in':
        return 'green';
      case 'check-out':
        return 'orange';
      default:
        return 'inherit';
    }
  };

  return (
    <Box sx={{ 
      height: '100vh', 
      width: '100vw', 
      position: 'relative', 
      overflow: 'hidden' 
    }}>
      {isScanning ? (
        <>
          <Webcam
            audio={false}
            ref={webcamRef}
            screenshotFormat="image/jpeg"
            videoConstraints={{ facingMode: 'environment' }}
            style={{
              width: '100%',
              height: '100%',
              objectFit: 'cover'
            }}
          />
          <Box sx={{
            position: 'absolute',
            top: '50%',
            left: '50%',
            transform: 'translate(-50%, -50%)',
            width: '80%',
            height: '80%',
            border: '2px solid white',
            boxShadow: '0 0 0 9999px rgba(0, 0, 0, 0.5)',
            zIndex: 1
          }} />
          <Typography variant="h6" sx={{
            position: 'absolute',
            bottom: '10%',
            left: '50%',
            transform: 'translateX(-50%)',
            color: 'white',
            textAlign: 'center',
            zIndex: 2
          }}>
            Point the QR code at the camera
          </Typography>
        </>
      ) : (
        <Paper elevation={3} sx={{
          position: 'absolute',
          top: '50%',
          left: '50%',
          transform: 'translate(-50%, -50%)',
          padding: 4,
          textAlign: 'center'
        }}>
          {isProcessing ? (
            <>
              <CircularProgress sx={{ marginBottom: 2 }} />
              <Typography variant="h5" gutterBottom>
                Processing...
              </Typography>
              <Typography variant="body1">
                Please wait a moment
              </Typography>
            </>
          ) : (
            <>
              <Typography variant="h5" gutterBottom sx={{ color: getMessageColor() }}>
                {messageType === 'check-in' ? 'Check-in Successful' : 'Check-out Successful'}
              </Typography>
              {serverMessage && (
                <Typography variant="body1" sx={{ marginTop: 2, color: getMessageColor() }}>
                  {serverMessage}
                </Typography>
              )}
              {employeeName && (
                <Typography variant="h5" sx={{ marginTop: 2, color: getMessageColor() }}>
                  {messageType === 'check-in' ? 'Welcome' : 'Get home safely'}, {employeeName}!
                </Typography>
              )}
              {result && (
                <Typography variant="body2" sx={{ marginTop: 2 }}>
                  Employee ID: {result}
                </Typography>
              )}
            </>
          )}
        </Paper>
      )}
      <Snackbar
        open={snackbarOpen}
        autoHideDuration={6000}
        onClose={handleSnackbarClose}
        message={snackbarMessage}
      />
    </Box>
  );
};

export default QRCodeScanner;
