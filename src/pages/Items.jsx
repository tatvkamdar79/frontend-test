import React, { useEffect, useState } from "react";
import { GiHamburgerMenu } from "react-icons/gi";
import BulkFileUpload from "../components/BulkFileUpload";
import BulkGenerateQR from "../components/BulkGenerateQR";
import ManageProducts from "../pages/ManageProducts";
import GoogleSheets from "../components/GoogleSheets";
const BULK_FILE_UPLOAD = "BULK_FILE_UPLOAD";
const BULK_GENERATE_QR = "BULK_GENERATE_QR";
const SHEETS = "SHEETS";
const MANAGE_ITEMS = "MANAGE_ITEMS";

const Items = () => {
  const [view, setView] = useState(SHEETS);
  const [showSidebar, setShowSidebar] = useState(true);

  useEffect(() => {
    // setTimeout(() => {
    //   setShowSidebar(false);
    // }, 700);
  }, []);

  return (
    <div className="w-full h-[94vh] flex justify-start">
      <button
        onClick={() => setShowSidebar((showSidebar) => !showSidebar)}
        className="absolute block nm:hidden z-50"
      >
        <GiHamburgerMenu size={25} />
      </button>
      <section
        className={`${
          showSidebar
            ? "absolute nm:relative w-[60%] nm:w-[15%] h-[94vh]"
            : "w-0"
        } nm:w-[15%] overflow-hidden transition-all duration-300`}
      >
        <SideBar view={view} setView={setView} />
      </section>
      {view === BULK_FILE_UPLOAD && (
        <section className="w-full nm:w-[85%] px-6 py-2">
          <BulkFileUpload />
        </section>
      )}
      {view === MANAGE_ITEMS && (
        <section className="w-full nm:w-[85%] px-6 py-2">
          <ManageProducts />
        </section>
      )}
      {view === BULK_GENERATE_QR && (
        <section className="w-full nm:w-[85%] px-6 py-2">
          <BulkGenerateQR />
        </section>
      )}

      {view === SHEETS && (
        <section className="w-full nm:w-[85%] px-6 py-2">
          <GoogleSheets />
        </section>
      )}
    </div>
  );
};

export default Items;

const SideBar = ({ view, setView }) => {
  return (
    <div className="h-full w-full bg-gray-200 flex flex-col justify-start p-6">
      <p className="flex justify-between place-items-center text-2xl text-gray-600 font-semibold underline mb-10">
        Menu
      </p>
      <ul className="text-base text-gray-700 space-y-2">
        <div
          className={`w-full text-start font-semibold border border-gray-400 rounded-xl px-2 py-1 hover:scale-[102%] hover:text-black ${
            view === MANAGE_ITEMS && "bg-indigo-500 text-white"
          } transition-all cursor-pointer`}
        >
          <button
            // onClick={() => navigate("/inventory/items/manage")}
            onClick={() => setView(MANAGE_ITEMS)}
            className={`w-full`}
          >
            Manage Items
          </button>
        </div>
        <div
          className={`w-full text-start font-semibold border border-gray-400 rounded-xl px-2 py-1 hover:scale-[102%] hover:text-black ${
            view === BULK_GENERATE_QR && "bg-indigo-500 text-white"
          } transition-all cursor-pointer`}
        >
          <button
            onClick={() => setView(BULK_GENERATE_QR)}
            className={`w-full`}
          >
            Bulk Generate QR
          </button>
        </div>
        <div
          className={`w-full text-start font-semibold border border-gray-400 rounded-xl px-2 py-1 hover:scale-[102%] hover:text-black ${
            view === SHEETS && "bg-indigo-500 text-white"
          } transition-all cursor-pointer`}
        >
          <button onClick={() => setView(SHEETS)} className={`w-full`}>
            Google Sheets
          </button>
        </div>
      </ul>
    </div>
  );
};
