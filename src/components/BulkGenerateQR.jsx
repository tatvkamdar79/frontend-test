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
  const [modelNumbers, setModelNumbers] = useState([]);

  const [group, setGroup] = useState("none");
  const [groups, setGroups] = useState([]);

  const [filtered, setFiltered] = useState([]);
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
        tempCMG[company] = row.products;
      }
      setCMG(tempCMG);
      console.log(tempCMG);
    } catch (error) {
      console.error("Error fetching model numbers:", error);
    }
  };

  const companyChange = (e) => {
    let selectedCompany = e.target.value;
    setCompany(selectedCompany);

    setModelNumber("none");
    setGroup("none");
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

    filtered.forEach(({ company, modelNumber, group }, index) => {
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
      generatedDataUrls.push({ company, modelNumber, group, imageSrc });
    });

    // setDataUrls(generatedDataUrls);
    console.log(generatedDataUrls);
    downloadAllAsZip(generatedDataUrls);
  };

  const downloadAllAsZip = (dataUrls) => {
    if (dataUrls.length === 0) {
      alert("No QR codes to download.");
      return;
    }

    const zip = new JSZip();

    dataUrls.forEach(({ company, modelNumber, group, imageSrc }) => {
      const filename = `qr_code_${company}_${modelNumber}_${group}.png`; // Customize the filename as needed
      const blob = dataURItoBlob(imageSrc);

      zip.file(filename, blob);
    });

    zip.generateAsync({ type: "blob" }).then((content) => {
      saveAs(content, `${company}_QR_CODES.zip`); // Customize the zip file name as needed
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

  useEffect(() => {
    if (company == "none") {
      setFiltered([]);
      return;
    }
    let allItems = [];
    for (let i = 0; i < CMG[company].length; i++) {
      let item = CMG[company][i];
      allItems.push({
        company,
        modelNumber: item.modelNumber,
        group: item.group,
      });
    }
    if (modelNumber !== "none") {
      allItems = allItems.filter((item) => item.modelNumber === modelNumber);
    }
    if (group !== "none") {
      allItems = allItems.filter((item) => item.group === group);
    }
    setFiltered(allItems);
  }, [company, modelNumber, group]);

  return (
    <div className="nm:w-[84vw] flex flex-col nm:flex-row overflow-x-hidden">
      <section className="w-full xl:w-[20%] xl:h-[92vh] space-y-3 mb-4 xl:mb-0">
        <p className="text-2xl font-bold underline">Filters</p>
        <div className="grid nm:grid-cols-3 xl:grid-cols-1 justify-start gap-y-4">
          <div className="space-y-2">
            <p className="text-xl font-semibold">Company</p>
            <select
              className="w-52 p-2 border border-gray-300 rounded bg-blue-50"
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
              className="w-52 p-2 border border-gray-300 rounded bg-blue-50"
              name="company"
              id="company"
              value={modelNumber}
              onChange={modelNumberChange}
            >
              <option value="none">
                {company !== "none" ? "All" : "Select Company"}
              </option>
              {company !== "none" &&
                CMG.hasOwnProperty(company) &&
                Array.from(
                  new Set(CMG[company].map((product) => product.modelNumber))
                ).map((modelNumber, index) => (
                  <option key={index} value={modelNumber}>
                    {modelNumber}
                  </option>
                ))}
            </select>
          </div>
          <div className="space-y-2">
            <p className="text-xl font-semibold">Group</p>
            <select
              className="w-52 p-2 border border-gray-300 rounded bg-blue-50"
              name="group"
              id="group"
              value={group}
              onChange={(e) => setGroup(e.target.value)}
            >
              <option value="none">
                {company !== "none" ? "All" : "Select Company"}
              </option>
              {company !== "none" &&
                CMG.hasOwnProperty(company) &&
                Array.from(
                  new Set(CMG[company].map((product) => product.group))
                ).map((group, index) => {
                  return (
                    <option key={index} value={group}>
                      {group}
                    </option>
                  );
                })}
            </select>
          </div>
        </div>

        <div className="flex flex-col">
          {/* <button
            onClick={bulkGenerateQrCodes}
            className="w-64 px-3 py-2 border rounded-lg font-semibold bg-gray-700 hover:bg-gray-800 text-white transition-all"
          >
            Bulk Generate QR Codes
          </button> */}
          <button
            onClick={() => {
              bulkGenerateQrCodes();
              downloadAllAsZip();
            }}
            className="w-52 px-3 py-2 border rounded-lg font-semibold bg-gray-600 hover:bg-gray-800 text-white transition-all"
          >
            Bulk Generate QR
          </button>
        </div>
      </section>
      <section className="w-full xl:w-[80%] h-[51vh] nm:max-h-[72vh] xl:max-h-[92vh] overflow-y-scroll grid nm:grid-cols-3 gap-5 border-l-2 border-gray-400 px-3 py-1">
        {filtered.map(({ company, modelNumber, group }, index) => (
          <div
            key={index}
            className="h-56 flex flex-col place-items-center border-2 border-gray-300 p-4 rounded-md shadow-lg shadow-gray-400 hover:shadow-sm hover:bg-gray-500 hover:text-white transition-all cursor-pointer bg-blue-100"
          >
            <QRCode
              key={index}
              id={`qr_${index}`}
              size={80}
              fgColor="#000000"
              value={`${company}|${modelNumber}|${group}`}
              level="L"
              className="p-2 rounded bg-white scale-105"
            />
            <div className="w-full flex flex-col place-items-center font-semibold mt-2">
              <div className="w-full flex place-items-center justify-between border-b border-gray-300">
                <span className="w-[21%]">Company</span>
                <span className="w-6%] font-semibold">:</span>
                <span className="w-[65%]">{company}</span>
              </div>
              <div className="w-full flex place-items-center justify-between border-b border-gray-300">
                <span className="w-[21%]">Model</span>
                <span className="w-6%] font-semibold">:</span>
                <span className="w-[65%]">{modelNumber}</span>
              </div>
              <div className="w-full flex place-items-center justify-between border-b border-gray-300">
                <span className="w-[21%]">Group</span>
                <span className="w-6%] font-semibold">:</span>
                <span className="w-[65%]">{group}</span>
              </div>
            </div>
          </div>
        ))}
      </section>
    </div>
  );
};

export default BulkGenerateQR;
