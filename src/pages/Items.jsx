import React, { useEffect, useState } from "react";
import { getFullProductsDatabaseCSV } from "../utils/adminUtils";
import BulkFileUpload from "../components/BulkFileUpload";
import BulkGenerateQR from "../components/BulkGenerateQR";
import ManageProducts from "../pages/ManageProducts";
import GoogleSheets from "../components/GoogleSheets";
const BULK_FILE_UPLOAD = "BULK_FILE_UPLOAD";
const BULK_GENERATE_QR = "BULK_GENERATE_QR";
const SHEETS = "SHEETS";
const MANAGE_ITEMS = "MANAGE_ITEMS";

const Items = () => {
  const [view, setView] = useState(MANAGE_ITEMS);

  return (
    <div className="w-full h-[94vh] flex justify-start">
      <section className="w-[25%] xl:w-[15%]">
        <SideBar setView={setView} />
      </section>
      {view === BULK_FILE_UPLOAD && (
        <section className="w-[75%] xl:w-[85%] p-5">
          <BulkFileUpload />
        </section>
      )}
      {view === MANAGE_ITEMS && (
        <section className="w-full xl:w-[85%] p-5">
          <ManageProducts />
        </section>
      )}
      {view === BULK_GENERATE_QR && (
        <section className="w-[75%] xl:w-[85%] p-5">
          <BulkGenerateQR />
        </section>
      )}

      {view === SHEETS && (
        <section className="w-[75%] xl:w-[85%] p-5">
          <GoogleSheets />
        </section>
      )}
    </div>
  );
};

export default Items;

const SideBar = ({ setView }) => {
  return (
    <div className="h-full w-full bg-gray-200 flex flex-col justify-start p-6">
      <p className="flex justify-between place-items-center text-2xl text-gray-600 font-semibold underline mb-10">
        Menu
      </p>
      <ul className="text-base text-gray-700 space-y-2">
        <div className="w-full text-start font-semibold border border-gray-400 rounded-xl px-2 py-1 hover:scale-[102%] hover:text-black hover:bg-gray-400 transition-all cursor-pointer">
          <button
            // onClick={() => navigate("/inventory/items/manage")}
            onClick={() => setView(MANAGE_ITEMS)}
            className="w-full"
          >
            Manage Items
          </button>
        </div>
        <div className="w-full text-start font-semibold border border-gray-400 rounded-xl px-2 py-1 hover:scale-[102%] hover:text-black hover:bg-gray-400 transition-all cursor-pointer">
          <button
            onClick={() => {
              setView(BULK_FILE_UPLOAD);
            }}
            className="w-full"
          >
            Bulk Upload
          </button>
        </div>
        <div className="w-full text-start font-semibold border border-gray-400 rounded-xl px-2 py-1 hover:scale-[102%] hover:text-black hover:bg-gray-400 transition-all cursor-pointer">
          <button
            onClick={async () => {
              const res = await getFullProductsDatabaseCSV();
            }}
            className="w-full"
          >
            Download Full Database Excel
          </button>
        </div>
        <div className="w-full text-start font-semibold border border-gray-400 rounded-xl px-2 py-1 hover:scale-[102%] hover:text-black hover:bg-gray-400 transition-all cursor-pointer">
          <button onClick={() => setView(BULK_GENERATE_QR)} className="w-full">
            Bulk Generate QR
          </button>
        </div>
        <div className="w-full text-start font-semibold border border-gray-400 rounded-xl px-2 py-1 hover:scale-[102%] hover:text-black hover:bg-gray-400 transition-all cursor-pointer">
          <button onClick={() => setView(SHEETS)} className="w-full">
            Google Sheets
          </button>
        </div>
      </ul>
    </div>
  );
};
