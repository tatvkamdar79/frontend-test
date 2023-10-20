import React, { useRef, useState } from "react";
import { useLocation } from "react-router-dom";
import QRCode from "qrcode.react";

const ProductDetails = () => {
  const { state } = useLocation();
  const { productVariants } = state;
  const [formData, setFormData] = useState(productVariants);
  const commonData = formData[0] ? formData[0] : null;

  const addImage = async () => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ video: true });
      const video = document.createElement("video");
      const img = document.createElement("img");

      video.srcObject = stream;

      video.onloadedmetadata = () => {
        video.play();
      };

      const captureImage = () => {
        const canvas = document.createElement("canvas");
        canvas.width = video.videoWidth;
        canvas.height = video.videoHeight;
        const ctx = canvas.getContext("2d");
        ctx.drawImage(video, 0, 0, canvas.width, canvas.height);

        const dataUrl = canvas.toDataURL("image/jpeg");
        img.src = dataUrl;
        stream.getTracks().forEach((track) => track.stop());
      };

      const captureButton = document.createElement("button");
      captureButton.innerText = "Capture Image";
      captureButton.addEventListener("click", captureImage);

      document.body.appendChild(video);
      document.body.appendChild(captureButton);
      document.body.appendChild(img);
    } catch (error) {
      console.error("Error accessing camera:", error);
    }
  };

  return (
    <div className="w-full min-h-screen bg-gray-200 xl:p-8 p-2">
      <h1 className="text-2xl font-bold">Product Details</h1>

      <div>
        <h1 className="text-xl font-bold">Images</h1>
        <button
          className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded"
          onClick={addImage}
        >
          Capture Image
        </button>
      </div>

      {commonData && <h2 className="text-xl font-bold mb-2">Common Data</h2>}
      {commonData && (
        <div className="mb-8 grid xl:grid-cols-3 grid-cols-1 gap-x-6">
          {Object.entries(commonData).map(([key, value]) => {
            if (key === "variant" || key === "_id") return null;
            return (
              <div key={key} className="mb-4">
                <label className="block text-gray-700 font-bold mb-2 capitalize">
                  {key}
                </label>
                <input
                  type="text"
                  value={value}
                  readOnly
                  className="border rounded px-3 py-2 w-full"
                />
              </div>
            );
          })}
        </div>
      )}

      <div className="overflow-x-auto">
        <table className="min-w-full bg-white border border-gray-300 rounded-lg overflow-hidden">
          <thead>
            <tr className="bg-gray-100">
              <th className="border border-gray-300 px-4 py-2">Variant Type</th>
              {Object.keys(formData[0].variant).map((key) => (
                <th
                  key={key}
                  className="border border-gray-300 px-4 py-2 capitalize"
                >
                  {key}
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {formData.map((variant, index) => (
              <tr
                key={variant._id}
                className={index % 2 === 0 ? "bg-gray-50" : "bg-white"}
              >
                <td className="border border-gray-300 px-4 py-2">
                  {variant.variant.color}
                </td>
                {Object.values(variant.variant).map((value, i) => (
                  <td key={i} className="border border-gray-300 px-4 py-2">
                    <input
                      type="text"
                      value={value}
                      readOnly
                      className="w-full text-center"
                    />
                  </td>
                ))}
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default ProductDetails;
