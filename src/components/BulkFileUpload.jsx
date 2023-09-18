import React, { useState } from "react";
import Papa from "papaparse"; // Import papaparse library
import { updateProductsDatabaseFromCSV } from "../utils/adminUtils";

const BulkFileUpload = () => {
  const [selectedFile, setSelectedFile] = useState(null);

  const handleFileChange = (e) => {
    const file = e.target.files[0];
    setSelectedFile(file);
  };

  const handleUpload = async () => {
    if (!selectedFile) {
      console.error("No file selected.");
      return;
    }

    const reader = new FileReader();

    reader.onload = async (e) => {
      const csv = e.target.result;
      const parsedData = Papa.parse(csv, { header: true }); // Parse the CSV

      // parsedData.data will contain an array of JSON objects
      console.log(parsedData.data);

      // Now, you can use parsedData.data as JSON objects and pass it to your function.
      await updateProductsDatabaseFromCSV(parsedData.data);
    };

    reader.readAsText(selectedFile);
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
