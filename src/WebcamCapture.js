import React, { useRef, useState, useEffect } from "react";
import Webcam from "react-webcam";

const WebcamCapture = () => {
  const webcamRef = useRef(null);
  const [prediction, setPrediction] = useState("");

  const captureAndSend = async () => {
    const imageSrc = webcamRef.current.getScreenshot();

    if (imageSrc) {
      const blob = await fetch(imageSrc).then((res) => res.blob());
      const formData = new FormData();
      formData.append("file", blob, "frame.jpg");

      const response = await fetch("http://127.0.0.1:5000/predict", {
        method: "POST",
        body: formData,
      });

      const data = await response.json();
      setPrediction(data.prediction);
    }
  };

  useEffect(() => {
    const interval = setInterval(() => {
      captureAndSend();
    }, 2000); // Sends a frame every 2 seconds

    return () => clearInterval(interval);
  }, []);

  return (
    <div>
      <Webcam ref={webcamRef} screenshotFormat="image/jpeg" />
      <h2>Prediction: {prediction}</h2>
    </div>
  );
};

export default WebcamCapture;
