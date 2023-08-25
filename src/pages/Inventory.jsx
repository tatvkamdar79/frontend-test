import React from "react";
import { AiOutlineAppstoreAdd, AiTwotoneEdit } from "react-icons/ai";
import { GoOrganization } from "react-icons/go";
import { Link } from "react-router-dom";

const Inventory = () => {
  return (
    <div className="w-full min-h-screen bg-gray-300 flex justify-center items-center">
      <div className="w-2/3 grid grid-cols-1 md:grid-cols-2 gap-6">
        <Link
          to={"/inventory/add-item"}
          className="flex place-items-center gap-x-2 p-6 bg-green-500 border-2 border-gray-200 rounded-md shadow-lg shadow-gray-400 transition-shadow duration-300 hover:shadow-none cursor-pointer text-white text-xl font-semibold"
        >
          <AiOutlineAppstoreAdd size={37} />
          Add Item
        </Link>
        <div className="flex place-items-center gap-x-2 p-6 bg-amber-500 border-2 border-gray-200 rounded-md shadow-lg shadow-gray-400 transition-shadow duration-300 hover:shadow-none cursor-pointer text-white text-xl font-semibold">
          <AiTwotoneEdit size={35} />
          Edit item
        </div>
        <Link
          to={"/inventory/add-company"}
          className="flex place-items-center gap-x-2 p-6 bg-cyan-500 border-2 border-gray-200 rounded-md shadow-lg shadow-gray-400 transition-shadow duration-300 hover:shadow-none cursor-pointer text-white text-xl font-semibold"
        >
          <GoOrganization size={35} />
          Add Company
        </Link>
      </div>
    </div>
  );
};

export default Inventory;
