import React, { useState, useRef, useEffect } from "react";
import { baseUrl } from "../utils/constants";
import { GrClose } from "react-icons/gr";
import axios from "axios";

const AddImageModal = ({
  showAddImageModal,
  setShowAddImageModal,
  productVariants,
}) => {
  const videoRef = useRef(null);
  const canvasRef = useRef(null);
  const [isCameraOpen, setIsCameraOpen] = useState(false);
  const [img, setImg] = useState(null);
  const [stream, setStream] = useState(null);

  const openCamera = async () => {
    try {
      const constraints = {
        video: {
          facingMode: "environment", // Use the rear camera
        },
      };
      const cameraStream = await navigator.mediaDevices.getUserMedia(
        constraints
      );
      videoRef.current.srcObject = cameraStream;
      setStream(cameraStream);
      setIsCameraOpen(true);
    } catch (error) {
      console.error("Error accessing camera:", error);
      setIsCameraOpen(false);
    }
  };

  const closeCamera = () => {
    if (stream) {
      stream.getTracks().forEach((track) => track.stop());
      setStream(null);
    }
    setIsCameraOpen(false);
  };

  const captureImage = () => {
    if (!showAddImageModal) return;

    const video = videoRef.current;
    const canvas = canvasRef.current;
    const context = canvas.getContext("2d");

    canvas.width = video.videoWidth;
    canvas.height = video.videoHeight;
    context.drawImage(video, 0, 0, canvas.width, canvas.height);

    const imageDataURL = canvas.toDataURL("image/jpeg");

    setImg(imageDataURL);
    closeCamera();
  };

  const sendImageToBackend = async () => {
    console.log("Sending image to backend now");
    const cleanedBase64Data = img.replace(/^data:image\/\w+;base64,/, "");
    const product_id = productVariants[0]._id;

    // Add your Axios API call here
    // Example:
    try {
      const response = await axios.post(
        `${baseUrl}/product/addImageToProduct`,
        {
          imageData: cleanedBase64Data,
          product_id: product_id,
        }
      );
      console.log("Image uploaded successfully:", response.data);
      setShowAddImageModal(false);
    } catch (error) {
      alert("Some Error Occured, Try Again");
      console.error("Error uploading image:", error);
      setShowAddImageModal(false);
    }
  };

  useEffect(() => {
    openCamera();
  }, []);

  return (
    <div className="fixed top-0 left-0 w-full h-screen bg-gray-200 bg-opacity-40 flex place-items-center justify-center">
      <div className="w-11/12 nm:w-5/6 h-4/5 flex flex-col place-items-center py-5 border-2 border-gray-600 bg-gray-100 space-y-2 relative">
        <GrClose
          onClick={() => {
            closeCamera();
            setShowAddImageModal(false);
          }}
          size={30}
          className="absolute top-2 left-2 cursor-pointer"
        />
        {img === null && (
          <div className="relative">
            <video ref={videoRef} autoPlay playsInline />
            <canvas ref={canvasRef} className="hidden" />
          </div>
        )}

        <div>
          {img && (
            <img src={img} alt={"Image Preview"} className="w-full rounded" />
          )}
        </div>

        <div className="space-x-4">
          {isCameraOpen && (
            <button
              onClick={captureImage}
              className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-700"
            >
              Capture Image
            </button>
          )}
        </div>

        <div className="grid grid-cols-2 gap-4">
          <button
            onClick={openCamera}
            disabled={isCameraOpen}
            className="px-4 py-2 bg-green-500 text-white rounded hover:bg-green-700 disabled:bg-gray-400"
          >
            Open Camera
          </button>
          <button
            onClick={closeCamera}
            className="px-4 py-2 bg-yellow-500 text-white rounded hover:bg-yellow-700 disabled:bg-gray-400"
          >
            Close Camera
          </button>
          <button
            onClick={sendImageToBackend}
            className="px-4 py-2 bg-cyan-500 text-white rounded hover:bg-yellow-700"
          >
            Add Image
          </button>
          <button
            onClick={() => setImg(null)}
            className="px-4 py-2 bg-red-500 text-white rounded hover:bg-red-700"
          >
            Discard
          </button>
        </div>
      </div>
    </div>
  );
};

export default AddImageModal;
