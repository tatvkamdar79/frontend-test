import axios from "axios";
import React, { useEffect, useState, useRef } from "react";
import { baseUrl } from "../utils/constants";
import QRCode from "qrcode.react";
import { saveAs } from "file-saver";
import JSZip from "jszip";

const BulkGenerateQR = () => {
  const ALL = "ALL";
  const [company, setCompany] = useState("none");
  const [existingCompanies, setExistingCompanies] = useState([]);
  const [modelNumbers, setModelNumbers] = useState([]);
  const [selectedModelNumber, setSelectedModelNumber] = useState("none");
  const [filteredModelNumbers, setFilteredModelNumbers] = useState([]);
  const [dataUrls, setDataUrls] = useState([]);

  const fetchCompanies = async () => {
    try {
      const response = await axios.get(baseUrl + "/company/getAllCompanies");
      const companies = response.data.data;
      companies.sort((a, b) => a.companyName.localeCompare(b.companyName));
      setExistingCompanies(companies);
    } catch (error) {
      console.error("Error fetching companies:", error);
    }
  };

  const getAllCompaniesModelNumbers = async () => {
    try {
      const response = await axios.get(
        baseUrl + "/company/getAllCompaniesModelNumbers"
      );
      const allModelNumbers = response.data.data;
      setModelNumbers(allModelNumbers);
      setFilteredModelNumbers(allModelNumbers.map((row) => row.modelNumber));
    } catch (error) {
      console.error("Error fetching model numbers:", error);
    }
  };

  const companyChange = (e) => {
    let selectedCompany = e.target.value;
    const modelNumbersForSelectedCompany = modelNumbers.filter((row) =>
      selectedCompany === ALL ? true : row.companies.includes(selectedCompany)
    );
    setFilteredModelNumbers(
      modelNumbersForSelectedCompany.map((row) => row.modelNumber)
    );
    setCompany(selectedCompany);
    setSelectedModelNumber("none");
  };

  const modelNumberChange = (e) => {
    console.log(e.target.value);
    setSelectedModelNumber(e.target.value);
  };

  // const qrCodeRef = useRef(null);
  const bulkGenerateQrCodes = () => {
    if (company === "none") {
      alert("Please select a company or ALL");
      return;
    }

    const generatedDataUrls = [];

    filteredModelNumbers.forEach((modelNumber, index) => {
      const qrCodeElement = document.getElementById(`qr_${index}`);

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
      generatedDataUrls.push({ modelNumber, imageSrc });
    });

    setDataUrls(generatedDataUrls);
  };

  const downloadAllAsZip = () => {
    if (dataUrls.length === 0) {
      alert("No QR codes to download.");
      return;
    }

    const zip = new JSZip();

    dataUrls.forEach(({ modelNumber, imageSrc }, index) => {
      const filename = `qr_code_${modelNumber}.png`; // Customize the filename as needed
      const blob = dataURItoBlob(imageSrc);

      zip.file(filename, blob);
    });

    zip.generateAsync({ type: "blob" }).then((content) => {
      saveAs(content, "qr_codes.zip"); // Customize the zip file name as needed
    });
  };
  const dataURItoBlob = (dataURI) => {
    const byteString = atob(dataURI.split(",")[1]);
    const ab = new ArrayBuffer(byteString.length);
    const ia = new Uint8Array(ab);
    for (let i = 0; i < byteString.length; i++) {
      ia[i] = byteString.charCodeAt(i);
    }
    return new Blob([ab], { type: "image/png" });
  };

  useEffect(() => {
    fetchCompanies();
    getAllCompaniesModelNumbers();
  }, []);

  return (
    <div className="w-full flex p-4">
      <section className="w-[50%] space-y-3">
        <p className="text-2xl font-bold underline">Filters</p>
        <div className="flex space-x-4">
          <div className="space-y-2">
            <p className="text-xl font-semibold">Company</p>
            <select
              className="w-full p-2 border border-gray-300 rounded"
              name="company"
              id="company"
              value={company}
              onChange={companyChange}
            >
              <option value="none">Select Company</option>
              <option value={ALL}>All</option>
              {existingCompanies.map((company) => (
                <option key={company._id} value={company.companyName}>
                  {company.companyName}
                </option>
              ))}
            </select>
          </div>
          <div className="space-y-2">
            <p className="text-xl font-semibold">Model Number</p>
            <select
              className="w-full p-2 border border-gray-300 rounded"
              name="company"
              id="company"
              value={selectedModelNumber}
              onChange={modelNumberChange}
            >
              <option value="none">Select Model Number</option>
              {filteredModelNumbers.map((modelNumber, index) => (
                <option key={index} value={modelNumber}>
                  {modelNumber}
                </option>
              ))}
            </select>
          </div>
        </div>
        <div>
          <p className="font-semibold text-sm">
            {company !== "none"
              ? `Model Numbers in ${company} ${filteredModelNumbers.length}`
              : "Please Select A Company"}
          </p>
        </div>
        <div>
          <button onClick={bulkGenerateQrCodes}>Bulk Generate QR Codes</button>
        </div>
        <div>
          <button onClick={bulkGenerateQrCodes}>Bulk Generate QR Codes</button>
          <button onClick={downloadAllAsZip}>Download All as Zip</button>
        </div>
      </section>
      <section className="w-[50%] h-fit max-h-[92vh] overflow-y-scroll grid grid-cols-3 gap-y-3">
        {company !== "none" &&
          company !== ALL &&
          filteredModelNumbers.length !== 0 &&
          filteredModelNumbers.map((modelNumber, index) => (
            <div className="flex flex-col justify-center place-items-center">
              <QRCode
                key={index}
                id={`qr_${index}`}
                size={200}
                fgColor="#003140"
                value={`${company}|${modelNumber}`}
                level="L"
                className="border-2 border-white p-5 rounded-md bg-white"
              />
              <p>
                {company} - {modelNumber}
              </p>
            </div>
          ))}
      </section>
    </div>
  );
};

export default BulkGenerateQR;
