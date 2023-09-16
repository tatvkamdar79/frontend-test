import axios from "axios";
import { baseUrl, adminAPI } from "./constants";

export const getFullProductsDatabaseCSV = async () => {
  try {
    const url = `${baseUrl}${adminAPI}/getFullProductsDatabaseCSV`;
    const response = await axios.get(url, {
      responseType: "blob", // Important for downloading files
    });

    const blob = new Blob([response.data], { type: "text/csv" });
    const link = window.URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = link;
    a.download = "full_database.csv";
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
  } catch (error) {
    console.log(error);
    console.error("Error downloading file:", error);
  }
};

export const updateProductsDatabaseFromCSV = async (file) => {
  if (!file) return;
  console.log(file);
  const formData = new FormData();
  formData.append("csvFile", file);
  const url = `${baseUrl}${adminAPI}/updateProductsDatabaseCSV`;

  try {
    const response = await axios.post(url, formData, {
      headers: { "Content-Type": "multipart/form-data" },
    });
    console.log("File uploaded successfully", response);
  } catch (error) {
    console.error("Error uploading file", error);
  }
};
