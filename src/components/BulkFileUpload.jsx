import React, { useState } from "react";
import { updateProductsDatabaseFromCSV } from "../utils/adminUtils";

const BulkFileUpload = () => {
  const [selectedFile, setSelectedFile] = useState(null);
  const handleFileChange = (e) => {
    const file = e.target.files[0];
    console.log(file);
    setSelectedFile(file);
  };

  const handleUpload = async () => {
    const response = await updateProductsDatabaseFromCSV(selectedFile);
  };

  return (
    <div className="p-6 max-w-screen-md bg-white shadow-lg rounded-lg">
      <h2 className="text-2xl font-bold mb-4">Bulk File Upload</h2>
      <form className="flex items-center">
        <input
          type="file"
          accept=".csv"
          className="mr-4 py-2 px-4 border border-gray-300 rounded-lg"
          onChange={handleFileChange}
        />
        <button
          onClick={handleUpload}
          type="button"
          className="bg-blue-500 text-white px-4 py-2 rounded-lg"
        >
          Upload
        </button>
      </form>
    </div>
  );
};

export default BulkFileUpload;
