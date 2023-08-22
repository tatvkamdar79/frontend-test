import axios from "axios";
import React, { useState, useEffect, useRef } from "react";
import { search } from "../utils/utils";

const QRCodeScanner = ({
  openQRCodeScanner,
  setOpenQRCodeScanner,
  setProducts,
  setSearchText,
  setLoading,
}) => {
  const videoRef = useRef(null);
  const canvasRef = useRef(null);
  const [img, setImg] = useState(null);
  // const [capturedImages, setCapturedImages] = useState([]);
  const [stream, setStream] = useState(null); // Store the camera stream

  useEffect(() => {
    const constraints = {
      video: {
        facingMode: "environment", // Use the rear camera
      },
    };

    if (openQRCodeScanner) {
      navigator.mediaDevices
        .getUserMedia(constraints)
        .then((stream) => {
          videoRef.current.srcObject = stream;
          setStream(stream);
        })
        .catch((error) => {
          console.error("Error accessing camera:", error);
        });
    } else {
      // Close the camera stream when component is unmounted or closed
      if (stream) {
        setTimeout(() => {
          stream.getTracks().forEach((track) => track.stop());
          setStream(null);
        }, 100); // Wait for 100ms before stopping tracks
      }
    }

    return () => {
      // Stop and release the camera stream when the component unmounts
      if (stream) {
        setTimeout(() => {
          stream.getTracks().forEach((track) => track.stop());
          setStream(null);
        }, 100); // Wait for 100ms before stopping tracks
      }
    };
  }, [openQRCodeScanner]);

  const captureImage = () => {
    if (!openQRCodeScanner) return;

    const video = videoRef.current;
    const canvas = canvasRef.current;
    const context = canvas.getContext("2d");

    canvas.width = video.videoWidth;
    canvas.height = video.videoHeight;
    context.drawImage(video, 0, 0, canvas.width, canvas.height);

    const imageDataURL = canvas.toDataURL("image/jpeg");

    console.log(imageDataURL === "data:,");
    // setImg(imageDataURL);
    sendImageToBackend(imageDataURL);

    // FOR DEV TESTING ONLY
    // setCapturedImages((prevImages) => [...prevImages, imageDataURL]);
  };

  const sendImageToBackend = async (img) => {
    console.log("sending imag to vbackend now");
    const cleanedBase64Data = img.replace(/^data:image\/\w+;base64,/, "");
    // console.log(cleanedBase64Data);
    // const url = "https://tatvk79.pythonanywhere.com/decode_qr";
    const url = "http://localhost:5000/decode_qr";
    const customHeaders = {
      "content-type": "application/json",
    };
    const response = await axios.post(
      url,
      { img: cleanedBase64Data },
      customHeaders
    );
    console.log(response.data.qr_data);
    let qr_data = response.data.qr_data;

    if (qr_data !== null) {
      setSearchText(qr_data);
      setLoading(true);
      const res = await search(qr_data);
      setLoading(false);
      setProducts(res.data);
      setOpenQRCodeScanner(false);
    }
  };

  useEffect(() => {
    if (openQRCodeScanner) {
      const interval = setInterval(captureImage, 2000); // Capture image every 1 second

      return () => {
        clearInterval(interval);
      };
    }
  }, [openQRCodeScanner]);

  return (
    <div>
      <video ref={videoRef} autoPlay playsInline />
      <canvas ref={canvasRef} style={{ display: "none" }} />
      {openQRCodeScanner && (
        <>
          {/* <button onClick={captureImage}>Click Image</button> */}
          {/* <button onClick={sendImageToBackend}>Send Images to Backend</button> */}
        </>
      )}
      {/* TO VIEW CAPTURED IMAGES FOR DEV TESTING */}
      {/* <div>
        {capturedImages.map((imageDataURL, index) => (
          <img
            key={index}
            src={imageDataURL}
            alt={`Captured Image ${index}`}
            style={{ width: "200px", height: "150px", margin: "10px" }}
          />
        ))}
      </div> */}
    </div>
  );
};

export default QRCodeScanner;
