import axios from "axios";
import React, { useEffect, useState, useRef } from "react";
import { baseUrl } from "../utils/constants";
import QRCode from "qrcode.react";
import { saveAs } from "file-saver";
import JSZip from "jszip";

const BulkGenerateQR = () => {
  const ALL = "ALL";
  const [CMG, setCMG] = useState({});
  const [company, setCompany] = useState("none");
  const [modelNumber, setModelNumber] = useState("none");
  const [selectedModelNumber, setSelectedModelNumber] = useState("none");
  const [filteredModelNumbers, setFilteredModelNumbers] = useState([]);
  const [dataUrls, setDataUrls] = useState([]);

  const getAllCompaniesModelNumbersGroups = async () => {
    try {
      const response = await axios.get(
        baseUrl + "/company/getAllCompaniesModelNumbersGroups"
      );
      const data = response.data.data;
      let tempCMG = {};
      for (let row of data) {
        let company = row.company;
        tempCMG[company] = {};

        let modelNumbersArray = row.modelNumbers;
        let allModelNumbers = modelNumbersArray.map(
          ({ modelNumber }) => modelNumber
        );
        for (let model of allModelNumbers) {
          tempCMG[company][model] = row.modelNumbers
            .filter((item) => item.modelNumber === model)
            .map((item) => item.groups);
        }
      }
      setCMG(tempCMG);
      console.log(tempCMG);
    } catch (error) {
      console.error("Error fetching model numbers:", error);
    }
  };

  const companyChange = (e) => {
    let selectedCompany = e.target.value;
    setModelNumber("none");
    setCompany(selectedCompany);
  };

  const modelNumberChange = (e) => {
    console.log(e.target.value);
    setModelNumber(e.target.value);
  };

  // const qrCodeRef = useRef(null);
  const bulkGenerateQrCodes = () => {
    if (company === "none") {
      alert("Please select a company or ALL");
      return;
    }

    const generatedDataUrls = [];

    CMG[company][modelNumber][0].forEach((group, index) => {
      const qrCodeElement = document.getElementById(`qr_${index}`);

      const canvas = document.createElement("canvas");
      const context = canvas.getContext("2d");

      // Set canvas dimensions with extra padding
      const padding = 5; // Adjust this value for desired padding
      canvas.width = qrCodeElement.width + 2 * padding;
      canvas.height = qrCodeElement.height + 2 * padding;

      // Apply styles (padding and rounded borders)
      context.fillStyle = "#ffffff"; // Set background color
      context.fillRect(0, 0, canvas.width, canvas.height); // Fill canvas with background color
      context.drawImage(qrCodeElement, padding, padding); // Draw QR code with padding

      const imageSrc = canvas.toDataURL();
      generatedDataUrls.push({ group, imageSrc });
    });

    setDataUrls(generatedDataUrls);
    console.log(generatedDataUrls);
  };

  const downloadAllAsZip = () => {
    if (dataUrls.length === 0) {
      alert("No QR codes to download.");
      return;
    }

    const zip = new JSZip();

    dataUrls.forEach(({ group, imageSrc }, index) => {
      const filename = `qr_code_${company}_${modelNumber}_${group}.png`; // Customize the filename as needed
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
    getAllCompaniesModelNumbersGroups();
  }, []);

  useEffect(() => {
    setDataUrls([]);
  }, [CMG, company, modelNumber]);

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
              {Object.keys(CMG).map((company, index) => (
                <option key={index} value={company}>
                  {company}
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
              value={modelNumber}
              onChange={modelNumberChange}
            >
              <option value="none">Select Model Number</option>
              {company !== "none" &&
                CMG.hasOwnProperty(company) &&
                Object.keys(CMG[company]).map((modelNumber, index) => (
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

        <div className="flex flex-col">
          <button
            onClick={bulkGenerateQrCodes}
            className="w-64 px-3 py-2 border rounded-lg font-semibold bg-gray-700 hover:bg-gray-800 text-white transition-all"
          >
            Bulk Generate QR Codes
          </button>
          <button
            onClick={downloadAllAsZip}
            className="w-64 px-3 py-2 border rounded-lg font-semibold bg-gray-700 hover:bg-gray-800 text-white transition-all"
          >
            Download All as Zip
          </button>
        </div>

        {company !== "none" && modelNumber !== "none" && (
          <div className="w-full">
            <p className="font-semibold underline italic mb-2">Groups</p>
            {/* {console.log(CMG[company][modelNumber])} */}
            <ul className="grid grid-cols-5 font-semibold text-white text-[10px] gap-2">
              {CMG[company][modelNumber][0].map((group, index) => (
                <li
                  key={index}
                  className="px-2 py-1 border w-fit rounded-lg bg-gray-500"
                >
                  {group}
                </li>
              ))}
            </ul>
          </div>
        )}
      </section>
      <section className="w-[50%] max-h-[92vh] overflow-y-scroll grid grid-cols-3 gap-y-3 border-l-2 border-gray-400">
        {company !== "none" &&
        Object.keys(CMG).length > 0 &&
        modelNumber === "none"
          ? Object.keys(CMG[company]).flatMap((modelNumber) =>
              CMG[company][modelNumber][0].map((group, index) => (
                <div
                  key={index}
                  className="flex flex-col place-items-center h-52"
                >
                  <QRCode
                    key={index}
                    id={`qr_${index}`}
                    size={80}
                    fgColor="#003140"
                    value={`Aqua|${modelNumber}|${group}`}
                    level="L"
                    className="border border-gray-400 p-1 rounded bg-transparent"
                  />
                  <div className="w-full flex flex-col place-items-center font-semibold mt-2">
                    <div className="w-full flex place-items-center justify-between border-b border-gray-300">
                      <span className="w-[30%]">Company -</span>
                      <span className="w-[65%]">Aqua</span>
                    </div>
                    <div className="w-full flex place-items-center justify-between border-b border-gray-300">
                      <span className="w-[30%]">Model -</span>
                      <span className="w-[65%]">{modelNumber}</span>
                    </div>
                    <div className="w-full flex place-items-center justify-between border-b border-gray-300">
                      <span className="w-[30%]">Group -</span>
                      <span className="w-[65%]">{group}</span>
                    </div>
                  </div>
                </div>
              ))
            )
          : modelNumber !== "none" &&
            CMG[company][modelNumber][0].map((group, index) => (
              <div
                key={index}
                className="flex flex-col place-items-center h-52"
              >
                <QRCode
                  key={index}
                  id={`qr_${index}`}
                  size={80}
                  fgColor="#ffffff"
                  value={`${company}|${modelNumber}|${group}`}
                  level="L"
                  className="border border-gray-400 p-1 rounded bg-transparent"
                />
                <div className="w-full flex flex-col place-items-center font-semibold mt-2">
                  <div className="w-full flex place-items-center justify-between border-b border-gray-300">
                    <span className="w-[30%]">Company -</span>
                    <span className="w-[65%]"> {company}</span>
                  </div>
                  <div className="w-full flex place-items-center justify-between border-b border-gray-300">
                    <span className="w-[30%]">Model -</span>
                    <span className="w-[65%]"> {modelNumber}</span>
                  </div>
                  <div className="w-full flex place-items-center justify-between border-b border-gray-300">
                    <span className="w-[30%]">Group -</span>
                    <span className="w-[65%]"> {group}</span>
                  </div>
                </div>
              </div>
            ))}
      </section>
    </div>
  );
};

export default BulkGenerateQR;
