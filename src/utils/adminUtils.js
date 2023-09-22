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

export const updateProductsDatabaseFromCSV = async (parsedJSONFromCSV) => {
  if (!parsedJSONFromCSV) return;
  console.log(parsedJSONFromCSV);
  const url = `${baseUrl}${adminAPI}/updateProductsDatabaseCSV`;

  try {
    const response = await axios.post(url, parsedJSONFromCSV);
    console.log("File uploaded successfully", response.data);
  } catch (error) {
    console.error("Error uploading file", error);
  }
};
