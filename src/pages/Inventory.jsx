import React from "react";
import { AiOutlineAppstoreAdd, AiTwotoneEdit } from "react-icons/ai";
import { GoOrganization } from "react-icons/go";
import { Link } from "react-router-dom";

const Inventory = () => {
  return (
    <div className="w-full min-h-screen bg-gray-200 flex justify-center items-center">
      <div className="w-2/3 grid grid-cols-1 md:grid-cols-2 gap-6">
        <Link
          to={"/inventory/items"}
          className="flex place-items-center gap-x-2 p-6 bg-blue-500 border-2 border-gray-200 rounded-md shadow-lg shadow-gray-400 transition-shadow duration-300 hover:shadow-none cursor-pointer text-white text-xl font-semibold"
        >
          <AiOutlineAppstoreAdd size={37} />
          Items
        </Link>
        <Link
          to={"/inventory/add-company"}
          className="flex place-items-center gap-x-2 p-6 bg-gray-500 border-2 border-gray-200 rounded-md shadow-lg shadow-gray-400 transition-shadow duration-300 hover:shadow-none cursor-pointer text-white text-xl font-semibold"
        >
          <GoOrganization size={35} />
          Companies
        </Link>
      </div>
    </div>
  );
};

export default Inventory;
