import axios from "axios";
import React, { useEffect, useState } from "react";
import { baseUrl, googleSheetsAPI } from "../utils/constants";
import { IoClose } from "react-icons/io5";
import { MdDelete } from "react-icons/md";

const GoogleSheets = () => {
  const [isChecked, setIsChecked] = useState(false);
  const [showAddNewSheetModal, setShowAddNewSheetModal] = useState(false);
  const [sheets, setSheets] = useState([]);
  const [selectedSheets, setSelectedSheets] = useState([]);

  const loadAllSheets = async () => {
    const response = await axios.get(
      `${baseUrl}${googleSheetsAPI}/getAllSheets`
    );
    console.log("SHEETS ARE", response.data.data);
    setSheets(response.data.data);
  };

  const deleteSheet = async (_id) => {
    const response = await axios.post(
      `${baseUrl}${googleSheetsAPI}/deleteSheet`,
      { _id }
    );
    console.log(response);
    loadAllSheets();
  };

  useEffect(() => {
    loadAllSheets();
  }, []);

  const syncSheet = async () => {
    if (selectedSheets.length === 0) {
      alert("No Sheet Selected");
      return;
    }
    // const sheetId = "18Yd2ZlHHRp9pUgK7KGiwDmsBBzRiPrWYLlao974Zkjg";
    const sheetIds = sheets
      .filter(({ _id }) => selectedSheets.includes(_id))
      .map(({ sheetId }) => sheetId);
    try {
      const response = await axios.post(
        `${baseUrl}${googleSheetsAPI}/syncGoogleSheet`,
        { spreadsheetIds: sheetIds }
      );
      alert(response.data.message);
      console.log(response);
    } catch (error) {
      console.log(error.response.data.message);
      alert(error.response.data.message);
    }
  };

  return (
    <div className="w-[75vw]">
      <p className="ml-4 mt-2 text-2xl font-semibold underline mb-4">
        Google Sheets
      </p>
      <ul className="ml-8">
        {sheets.map(({ sheetName, _id }, index) => (
          <li
            key={_id}
            className={`w-fit flex place-items-center gap-x-2 border-b-2 py-2`}
          >
            <p className="font-semibold pr-2 text-lg">{index + 1} .</p>
            <input
              type="checkbox"
              checked={selectedSheets.includes(_id)}
              onChange={() => {
                const updatedSelectedSheets = [...selectedSheets];
                if (selectedSheets.includes(_id)) {
                  updatedSelectedSheets.splice(selectedSheets.indexOf(_id), 1);
                } else {
                  updatedSelectedSheets.push(_id);
                }
                setSelectedSheets(updatedSelectedSheets);
              }}
              name={sheetName}
              id={sheetName}
              className="w-4 h-4"
            />
            <p className="w-28 text-lg font-semibold">{sheetName}</p>
            <MdDelete
              size={27}
              className="w-10 text-red-600"
              onClick={() => deleteSheet(_id)}
            />
          </li>
        ))}
      </ul>
      <p className="mt-5 mb-1 text-xl font-semibold text-gray-700 font-pts">
        Options
      </p>
      <div className="flex place-items-center gap-x-5 p-3 border-t-2 border-gray-300">
        <button
          onClick={syncSheet}
          className="px-3 py-1.5 bg-amber-600 text-white rounded-md"
        >
          Sync Google Sheets
        </button>
        <button
          onClick={() => setShowAddNewSheetModal(true)}
          className="px-3 py-1.5 bg-blue-700 text-white rounded-md"
        >
          Add Google Sheet
        </button>
      </div>
      {showAddNewSheetModal && (
        <AddNewSheetModal
          setShowAddNewSheetModal={setShowAddNewSheetModal}
          loadAllSheets={loadAllSheets}
        />
      )}
    </div>
  );
};

export default GoogleSheets;

const AddNewSheetModal = ({ setShowAddNewSheetModal, loadAllSheets }) => {
  const [sheetName, setSheetName] = useState("");
  const [sheetId, setSheetId] = useState("");
  const [loading, setLoading] = useState(false);

  const addNewSheet = async () => {
    setLoading(true);
    try {
      const response = await axios.post(
        `${baseUrl}${googleSheetsAPI}/addNewSheet`,
        { sheetName, sheetId }
      );
      console.log(response);
    } catch (error) {
      alert(error.response.data.message);
    }
    setLoading(false);
    loadAllSheets();
    setShowAddNewSheetModal(false);
  };

  return (
    <div className="absolute top-0 left-0 w-full h-screen flex place-items-center justify-center bg-gray-200 bg-opacity-50">
      <div className="flex flex-col gap-y-10 w-[300px] bg-white border-2 border-gray-400 rounded-md p-5">
        <div className="flex place-items-center justify-between">
          <p className="text-2xl font-semibold text-gray-700">
            Add A New Sheet
          </p>
          <IoClose size={30} onClick={() => setShowAddNewSheetModal(false)} />
        </div>
        <div className="w-full place-items-center">
          <p className="text-lg text-gray-700 font-semibold">Sheet Name</p>
          <input
            autoFocus
            type="text"
            value={sheetName}
            onChange={(e) => setSheetName(e.target.value)}
            name="SheetName"
            id="sheetName"
            className="w-60 h-16 p-3 bg-white border border-gray-400 outline-none"
            placeholder="Sheet Name Here"
          />
        </div>
        <div className="w-full place-items-center">
          <p className="text-lg text-gray-700 font-semibold">Sheet ID</p>
          <input
            type="text"
            value={sheetId}
            onChange={(e) => setSheetId(e.target.value)}
            name="SheetId"
            id="sheetId"
            className="w-60 h-16 p-3 bg-white border border-gray-400 outline-none"
            placeholder="Sheet ID Here"
          />
        </div>
        <button
          disabled={
            loading ||
            sheetName.trim().length === 0 ||
            sheetId.trim().length === 0
          }
          onClick={addNewSheet}
          className={`px-2 py-1 bg-blue-700 text-white rounded-md disabled:bg-gray-400 ${
            loading && "animate-pulse"
          }`}
        >
          {loading ? "Adding..." : "Add Sheet"}
        </button>
      </div>
    </div>
  );
};
