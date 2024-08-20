import { useEffect, useRef, useState } from "react";
import "../styles/QrStyles.css";
import QrScanner from "qr-scanner";
import QrFrame from "../assets/qr-frame.svg";
import { Button } from "@mui/material";

const QrReader = () => {
  const scanner = useRef<QrScanner>();
  const videoEl = useRef<HTMLVideoElement>(null);
  const qrBoxEl = useRef<HTMLDivElement>(null);
  const [qrOn, setQrOn] = useState<boolean>(true);
  const [isPaused, setIsPaused] = useState<boolean>(false);
  const [pauseTimeoutId, setPauseTimeoutId] = useState<NodeJS.Timeout | null>(null);
  const [lastScannedEmployeeId, setLastScannedEmployeeId] = useState<string | null>(null);
  const [pauseDuration, setPauseDuration] = useState<number>(30000); // 30 seconds
  const [scanCount, setScanCount] = useState<number>(0);
  const [scanTimerId, setScanTimerId] = useState<NodeJS.Timeout | null>(null);

  // Function to get geolocation
  const getGeolocation = (): Promise<{ latitude: number; longitude: number }> => {
    return new Promise((resolve, reject) => {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          resolve({
            latitude: position.coords.latitude,
            longitude: position.coords.longitude,
          });
        },
        (error) => {
          reject(error);
        }
      );
    });
  };

  // Function to send data to the server
  const sendDataToServer = async (employee_id: string) => {
    try {
      const { latitude, longitude } = await getGeolocation();

      const payload = {
        employee_id,
        latitude,
        longitude,
      };

      console.log("Sending data to server:", payload);

      // Simulate server request
      setTimeout(() => {
        console.log("Server response: Успешно прошли");
      }, 10000);
    } catch (error) {
      console.error("Error getting geolocation or sanding data:", error);
    }
  };

  // Success
  const onScanSuccess = (result: QrScanner.ScanResult) => {
    const employee_id = result.data;

    // Increment the scan count
    setScanCount(prevCount => prevCount + 1);

    // If the scan count is greater than 3 in 1 second, do nothing
    if (scanCount >= 3) {
      return;
    }

    if (result?.data && !isPaused) {
      console.log("Scanned employee_id:", employee_id);

      // Check if the scanned employee ID is different from the last one
      if (employee_id !== lastScannedEmployeeId) {
        sendDataToServer(employee_id);
        setLastScannedEmployeeId(employee_id);

        // Set pause duration and start a timer
        setPauseDuration(employee_id.startsWith("DK0003") ? 60000 : 30000); // 60 seconds for DK0003, 30 seconds for others
        setIsPaused(true);
        if (pauseTimeoutId) {
          clearTimeout(pauseTimeoutId); // Clear any existing timeout
        }
        const timeoutId = setTimeout(() => setIsPaused(false), pauseDuration);
        setPauseTimeoutId(timeoutId);
      } else if (isPaused) {
        // Do nothing, scanner is paused
      } else {
        alert("This is not the correct QR code.");
      }
    }
  };

  // Fail
  const onScanFail = (err: string | Error) => {
    console.log(err);
  };

  useEffect(() => {
    if (videoEl?.current && !scanner.current) {
      scanner.current = new QrScanner(videoEl?.current, onScanSuccess, {
        onDecodeError: onScanFail,
        preferredCamera: "environment",
        highlightScanRegion: true,
        highlightCodeOutline: true,
        overlay: qrBoxEl?.current || undefined,
      });

      scanner.current
        .start()
        .then(() => setQrOn(true))
        .catch((err) => {
          if (err) setQrOn(false);
        });

      // Reset the scan count after 1 second
      const timerId = setTimeout(() => {
        setScanCount(0);
      }, 1000);
      setScanTimerId(timerId);
    }

    return () => {
      if (scanner.current) {
        scanner.current.stop();
      }
      if (scanTimerId) {
        clearTimeout(scanTimerId);
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
    <div className="qr-reader">
      <video ref={videoEl}></video>
      <div className="qr-frame" ref={qrBoxEl}>
        <img src={QrFrame} alt="QR Frame" />
      </div>
    </div>
  );
};

export default QrReader;