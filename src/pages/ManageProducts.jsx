import React, { useContext, useState } from "react";
import Searchbar from "../components/Searchbar";
import ItemList from "../components/ItemList";
import { SearchContext } from "../App";

const ManageProducts = () => {
  const { products, setProducts, searchText, setSearchText } =
    useContext(SearchContext);
  const [loading, setLoading] = useState(false);
  return (
    <div className="w-full h-[92vh]">
      <div className="w-full md:max-w-screen-2xl mx-auto">
        <p className="w-full text-3xl font-semibold font-mono text-gray-700 text-center">
          Manage Your Inventory
        </p>
        <div className="bg-white p-6 rounded-lg shadow-xl border-2 border-gray-300">
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
