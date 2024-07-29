import { useEffect, useRef, useState } from "react";
import "../components/QrStyles.css";
import QrScanner from "qr-scanner";
import QrFrame from "../assets/qr-frame.svg";
import { Button } from "@mui/material";

interface GeolocationCoordinates {
    latitude: number;
    longitude: number;
  }

const QrReader = () => {
  // QR States
  const scanner = useRef<QrScanner>();
  const videoEl = useRef<HTMLVideoElement>(null);
  const qrBoxEl = useRef<HTMLDivElement>(null);
  const [qrOn, setQrOn] = useState<boolean>(true);

  // Result
  const [scannedResult, setScannedResult] = useState<string | undefined>("");
  const [checkInEnabled, setCheckInEnabled] = useState(false);
  const [userId, setUserId] = useState(null); // Replace with actual user ID
  const [geolocation, setGeolocation] = useState<GeolocationCoordinates | null>(
    null
  );


  useEffect(() => {
    // Get geolocation when component mounts
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          setGeolocation({
            latitude: position.coords.latitude,
            longitude: position.coords.longitude,   

          });
        },
        (error) => {
          console.error("Error getting geolocation:", error);
        }
      );
    } else {
      console.error("Geolocation is not supported by this browser.");
    }
  }, []);


  const handleCheckIn = () => {
     // Here you would typically send userId and geolocation to your backend
     if (geolocation) {
       alert(
         `Check-in successful!\nUser ID: ${userId}\nGeolocation: ${geolocation.latitude}, ${geolocation.longitude}`
       );
     } else {
       alert("Geolocation not available.");
     }
   };

  // Success
  const onScanSuccess = (result: QrScanner.ScanResult) => {
    console.log(result);

    if (result?.data === "i am here)") {
      setCheckInEnabled(true); // Enable check-in button
    } else {
      alert("This is not the correct QR code.");
    }
  };

  // Fail
  const onScanFail = (err: string | Error) => {
    // 🖨 Print the "err" to browser console.
    console.log(err);
  };

  useEffect(() => {
    if (videoEl?.current && !scanner.current) {
      //  Instantiate the QR Scanner
      scanner.current = new QrScanner(videoEl?.current, onScanSuccess, {
        onDecodeError: onScanFail,
        //  This is the camera facing mode. In mobile devices, "environment" means back camera and "user" means front camera.
        preferredCamera: "environment",
        //  This will help us position our "QrFrame.svg" so that user can only scan when qr code is put in between our QrFrame.svg.
        highlightScanRegion: true,
        //  This will produce a yellow (default color) outline around the qr code that we scan, showing a proof that our qr-scanner is scanning that qr code.
        highlightCodeOutline: true,
        //  A custom div which will pair with "highlightScanRegion" option above 👆. This gives us full control over our scan region.
        overlay: qrBoxEl?.current || undefined,
      });

      //  Start QR Scanner
      scanner?.current
        ?.start()
        .then(() => setQrOn(true))
        .catch((err) => {
          if (err) setQrOn(false);
        });
    }

    //  Clean up on unmount.
    //  This removes the QR Scanner from rendering and using camera when it is closed or removed from the UI.
    return () => {
      if (!videoEl?.current) {
        scanner?.current?.stop();
      }
    };
  }, []);

  useEffect(() => {
    if (!qrOn)
      alert(
        "Camera is blocked or not accessible. Please allow camera in your browser permissions and Reload."
      );
  }, [qrOn]);

  return (
    <div className="qr-reader-container">
      <div className="qr-reader">
        <video ref={videoEl}></video>
        <div ref={qrBoxEl} className="qr-box">
          <img src={QrFrame} alt="Qr Frame" className="qr-frame" />
        </div>
      </div>
      <Button
        variant="contained"
        onClick={handleCheckIn}
        disabled={!checkInEnabled}
        className="check-in-button"
        sx={{fontSize: 30, backgroundColor: "#d08553"}}
      >
        Check In
      </Button>
    </div>
  );
};

export default QrReader;
