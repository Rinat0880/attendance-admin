import React, { useState, useRef, useCallback, useEffect } from 'react';
import Webcam from 'react-webcam';
import jsQR from 'jsqr';
import { Box, Typography, Paper, Snackbar } from '@mui/material';
import { createByQRCode } from '../../utils/libs/axios';

const QRCodeScanner: React.FC = () => {
  const [result, setResult] = useState<string | null>(null);
  const [isScanning, setIsScanning] = useState(true);
  const [snackbarOpen, setSnackbarOpen] = useState(false);
  const [snackbarMessage, setSnackbarMessage] = useState('');
  const webcamRef = useRef<Webcam | null>(null);

  const getCurrentPosition = (): Promise<GeolocationPosition> => {
    return new Promise((resolve, reject) => {
      if (!navigator.geolocation) {
        reject(new Error('Геолокация не поддерживается вашим браузером'));
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
    try {
      const position = await getCurrentPosition();
      console.log(position.coords.latitude, position.coords.longitude);
      console.log(employeeId);
      
      const response = await createByQRCode(employeeId, position.coords.latitude, position.coords.longitude);
      console.log(response);
      
      setSnackbarMessage('Запись успешно создана');
      setSnackbarOpen(true);
    } catch (error) {
      console.error('Ошибка при отправке данных:', error);
      setSnackbarMessage('Ошибка при создании записи');
      setSnackbarOpen(true);
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
              setResult(code.data);
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
      }, 5000);
      return () => clearTimeout(timer);
    }
  }, [isScanning, capture]);

  const handleSnackbarClose = () => {
    setSnackbarOpen(false);
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
            Scan QR Code here
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
          <Typography variant="h5" gutterBottom>
            Scanning paused
          </Typography>
          <Typography variant="body1">
            Please wait 5 seconds...
          </Typography>
          {result && (
            <Typography variant="body2" sx={{ marginTop: 2 }}>
              Last scanned employee_id: {result}
            </Typography>
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