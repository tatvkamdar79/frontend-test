import React, { useState } from "react";
import { GiHamburgerMenu } from "react-icons/gi";
import { Link } from "react-router-dom";

const Navbar = () => {
  const [hidden, setHidden] = useState(true);
  return (
    <nav className="w-full sticky top-0 flex justify-between px-10 py-2 bg-gray-200 border-b-2 border-gray-400">
      <div className="flex place-items-center justify-center gap-x-4">
        <button
          onClick={() => setHidden((hidden) => !hidden)}
          className="xl:hidden flex h-full place-items-center"
        >
          <GiHamburgerMenu />
        </button>
        <p className="text-3xl font-semibold font-playfair">HH</p>
      </div>
      <div className="flex">
        <ul
          className={`${
            hidden ? "h-0" : "h-60"
          } overflow-hidden flex xl:flex-row xl:h-fit flex-col place-items-center justify-center gap-2 text-lg text-gray-500 font-semibold transition-all`}
        >
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
