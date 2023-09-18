import React from "react";
import { Link } from "react-router-dom";

const Navbar = () => {
  return (
    <nav className="w-full sticky top-0 flex justify-between px-20 py-2 bg-gray-200 border-b-2 border-gray-400">
      <div className="flex">
        <ul className="flex gap-x-5 text-lg text-gray-500 font-semibold">
          <Link
            to={"/"}
            className="w-28 px-2 py-1 border rounded-md bg-white text-center shadow"
          >
            Dashboard
          </Link>
          <Link
            to={"/pos"}
            className="w-28 px-2 py-1 border rounded-md bg-white text-center shadow"
          >
            POS
          </Link>
          <Link
            to={"/inventory"}
            className="w-28 px-2 py-1 border rounded-md bg-white text-center shadow"
          >
            Inventory
          </Link>
          <Link
            to={"/inventory/items"}
            className="w-28 px-2 py-1 border rounded-md bg-white text-center shadow"
          >
            Items
          </Link>
          <Link
            to={"/inventory/companies"}
            className="w-28 px-2 py-1 border rounded-md bg-white text-center shadow"
          >
            Companies
          </Link>
        </ul>
      </div>
    </nav>
  );
};

export default Navbar;
