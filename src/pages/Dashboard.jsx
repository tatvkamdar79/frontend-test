import React from "react";
import { Link } from "react-router-dom";

const Dashboard = () => {
  return (
    <div className="w-full min-h-screen bg-gray-200 flex justify-center items-center">
      <div className="w-2/3 grid md:grid-cols-2 gap-6">
        <Link
          to={"/pos"}
          className="p-4 bg-white rounded shadow-lg shadow-gray-400 transition-shadow duration-300 hover:shadow-none cursor-pointer"
        >
          <h2 className="text-2xl text-gray-700 font-opensans font-bold mb-2">
            POS
          </h2>
          <p className="text-gray-500">Your point of sale system.</p>
        </Link>
        <Link className="p-4 bg-white rounded shadow-lg shadow-gray-400 transition-shadow duration-300 hover:shadow-none cursor-pointer">
          <h2 className="text-2xl text-gray-700 font-opensans font-bold mb-2">
            Reports
          </h2>
          <p className="text-gray-500">Generate and view reports.</p>
        </Link>
        <Link
          to={"/inventory"}
          className="p-4 bg-white rounded shadow-lg shadow-gray-400 transition-shadow duration-300 hover:shadow-none cursor-pointer"
        >
          <h2 className="text-2xl text-gray-700 font-opensans font-bold mb-2">
            Inventory
          </h2>
          <p className="text-gray-500">Manage your inventory items.</p>
        </Link>
        <Link className="p-4 bg-white rounded shadow-lg shadow-gray-400 transition-shadow duration-300 hover:shadow-none cursor-pointer">
          <h2 className="text-2xl text-gray-700 font-opensans font-bold mb-2">
            Customers
          </h2>
          <p className="text-gray-500">Manage your customer records.</p>
        </Link>
      </div>
    </div>
  );
};

export default Dashboard;
