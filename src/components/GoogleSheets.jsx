import axios from "axios";
import React, { useState } from "react";
import { baseUrl, googleSheetsAPI } from "../utils/constants";

const GoogleSheets = () => {
  const [isChecked, setIsChecked] = useState(false);

  const handleCheckboxChange = () => {
    setIsChecked((isChecked) => !isChecked);
  };

  const syncSheet = async () => {
    if (!isChecked) {
      alert("No Sheet Selected");
      return;
    }
    const sheetId = "18Yd2ZlHHRp9pUgK7KGiwDmsBBzRiPrWYLlao974Zkjg";

    const response = await axios.post(
      `${baseUrl}${googleSheetsAPI}/syncGoogleSheet`,
      { spreadsheetIds: [sheetId] }
    );
    alert(response.data.message);
    console.log(response);
  };

  return (
    <div className="w-[75vw]">
      <p className="ml-4 mt-2 text-2xl font-semibold underline mb-4">
        Google Sheets
      </p>
      <ul>
        <li className="flex place-items-center gap-x-2 pl-4">
          <input
            type="checkbox"
            checked={isChecked}
            onChange={handleCheckboxChange}
            name="kliq"
            id="kliq"
            className="w-4 h-4"
          />{" "}
          <p className="text-lg font-semibold font-serif">Kliq</p>
        </li>
      </ul>
      <button
        onClick={syncSheet}
        className="ml-4 mt-10 px-2 py-1 bg-gray-700 text-white rounded-md"
      >
        Sync Google Sheet
      </button>
    </div>
  );
};

export default GoogleSheets;
