import React, { useRef, useState } from "react";
import { useLocation } from "react-router-dom";
import QRCode from "qrcode.react";

const ProductDetails = () => {
  const { state } = useLocation();
  const { productVariants } = state;

  const [formData, setFormData] = useState(productVariants);
  const [isEditing, setIsEditing] = useState(false);
  const [showQRCode, setShowQRCode] = useState(false);
  const [downloadedImageSrc, setDownloadedImageSrc] = useState("");

  const qrCodeRef = useRef(null);

  const toggleQRCode = () => {
    setShowQRCode((prevState) => !prevState);
  };

  const convertQRCodeToImage = () => {
    const qrCodeElement = document.getElementById("qr");
    const canvas = document.createElement("canvas");
    const context = canvas.getContext("2d");

    // Set canvas dimensions with extra padding
    const padding = 20; // Adjust this value for desired padding
    canvas.width = qrCodeElement.width + 2 * padding; // Twice the padding for both sides
    canvas.height = qrCodeElement.height + 2 * padding;

    // Apply styles (padding and rounded borders)
    context.fillStyle = "#ffffff"; // Set background color
    context.fillRect(0, 0, canvas.width, canvas.height); // Fill canvas with background color
    context.drawImage(qrCodeElement, padding, padding); // Draw QR code with padding

    const imageSrc = canvas.toDataURL();

    setDownloadedImageSrc(imageSrc);
  };

  const downloadImage = () => {
    const img = document.getElementById("downloadedImage");
    const canvas = document.createElement("canvas");
    const ctx = canvas.getContext("2d");

    canvas.width = img.width;
    canvas.height = img.height;

    ctx.drawImage(img, 0, 0);

    const dataURL = canvas.toDataURL("image/png");
    const a = document.createElement("a");
    a.href = dataURL;
    a.download = `QR_${commonData.modelNumber}.png`;
    a.click();
  };

  const commonData = formData[0] ? formData[0] : null;

  const handleChange = (index, key, value) => {
    const updatedFormData = [...formData];
    updatedFormData[index].variant[key] = value;
    setFormData(updatedFormData);
  };

  const handleDelete = (index) => {
    const updatedFormData = [...formData];
    updatedFormData.splice(index, 1);
    setFormData(updatedFormData);
  };

  const handleCommonDataChange = (key, value) => {
    const updatedCommonData = { ...commonData, [key]: value };
    setFormData([updatedCommonData, ...formData.slice(1)]);
  };

  const handleSave = () => {
    console.log("Form data saved:", formData);
  };

  return (
    <div className="w-full min-h-screen bg-gray-200 p-8">
      <h1 className="text-2xl font-bold mb-4">Product Details</h1>

      <div className="mb-4">
        <button
          className="bg-cyan-500 hover:bg-cyan-700 text-white font-bold py-2 px-4 rounded transition-all"
          onClick={() => setIsEditing(!isEditing)}
        >
          {isEditing ? "Disable Editing" : "Enable Editing"}
        </button>
      </div>

      <div className="flex space-x-4 mb-4">
        <button
          className="bg-cyan-500 hover:bg-cyan-600 text-white font-bold py-2 px-4 rounded transition-all"
          onClick={toggleQRCode}
        >
          Generate QR Code
        </button>

        {showQRCode && commonData && (
          <button
            className="bg-cyan-500 hover:bg-cyan-600 text-white font-bold py-2 px-4 rounded transition-all"
            onClick={convertQRCodeToImage}
          >
            Convert to Image
          </button>
        )}

        {showQRCode && downloadedImageSrc && (
          <button
            className="bg-cyan-500 hover:bg-cyan-700 text-white font-bold py-2 px-4 rounded transition-all"
            onClick={downloadImage}
          >
            Download Image
          </button>
        )}
      </div>

      <div
        className={`w-fit p-5 flex ${
          showQRCode ? "h-96" : "h-0"
        } gap-x-10 transition-all duration-300`}
      >
        {showQRCode && showQRCode && commonData && (
          <div className="mb-8">
            <h2 className="text-xl font-bold mb-2">Draft QR Code</h2>
            <QRCode
              id="qr"
              ref={qrCodeRef}
              size={200}
              fgColor="#003140"
              value={commonData.modelNumber}
              level="L"
              className="border-2 border-white p-5 rounded-md bg-white"
            />
          </div>
        )}

        {showQRCode && downloadedImageSrc && (
          <div>
            <h2 className="text-xl font-bold mb-2">Final QR Image</h2>
            <div
              id="imageContainer"
              className="w-fit h-fit p-4 bg-white rounded-md"
            >
              <img
                id="downloadedImage"
                alt="Downloaded QR Code"
                src={downloadedImageSrc}
                className="rounded-md border-2 border-gray-600"
              />
            </div>
          </div>
        )}
      </div>

      {commonData && <h2 className="text-xl font-bold mb-2">Common Data</h2>}
      {commonData && (
        <div className="mb-8 grid grid-cols-3 gap-x-6">
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
                  readOnly={!isEditing}
                  onChange={(e) =>
                    isEditing && handleCommonDataChange(key, e.target.value)
                  }
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
              <th className="border border-gray-300 px-4 py-2">Actions</th>
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
                      readOnly={!isEditing}
                      onChange={(e) =>
                        isEditing &&
                        handleChange(
                          index,
                          Object.keys(variant.variant)[i],
                          e.target.value
                        )
                      }
                      className="w-full text-center"
                    />
                  </td>
                ))}
                <td className="border border-gray-300 px-4 py-2 text-center">
                  <button
                    className="bg-red-500 hover:bg-red-700 text-white font-bold py-1 px-2 rounded"
                    onClick={() => handleDelete(index)}
                  >
                    Delete
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      <button
        className="bg-green-500 hover:bg-green-700 text-white font-bold py-2 px-4 rounded mt-4"
        onClick={handleSave}
      >
        Save
      </button>
    </div>
  );
};

export default ProductDetails;
