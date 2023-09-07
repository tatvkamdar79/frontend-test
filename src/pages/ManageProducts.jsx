import React, { useState } from "react";
import Searchbar from "../components/Searchbar";
import ItemList from "../components/ItemList";

const ManageProducts = ({
  products,
  setProducts,
  searchText,
  setSearchText,
}) => {
  const [loading, setLoading] = useState(false);
  return (
    <div className="w-full min-h-screen bg-gray-200 flex flex-col justify-center items-center">
      <div className="w-full md:max-w-screen-2xl mx-auto">
        <p className="w-full text-3xl font-semibold font-mono text-gray-700 text-center my-4">
          Manage Your Inventory
        </p>
        <div className="bg-white p-6 rounded-lg shadow-md">
          <section className="w-[92%] mx-auto flex place-items-center justify-center gap-x-2 p-2">
            <div className="w-3/4 lg:w-2/3 mb-4">
              <Searchbar
                setProducts={setProducts}
                searchText={searchText}
                setSearchText={setSearchText}
                setLoading={setLoading}
              />
            </div>
          </section>
          <ItemList products={products} manage={true} />
        </div>
      </div>
    </div>
  );
};

export default ManageProducts;
