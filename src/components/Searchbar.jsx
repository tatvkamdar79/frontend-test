import React, { useState } from "react";
import { search } from "../utils/utils.js";

const Searchbar = ({ setProducts, searchText, setSearchText, setLoading }) => {
  const [debounceTimer, setDebounceTimer] = useState(null);
  const [searchErrors, setSearchErrors] = useState([]);
  const [executionTime, setExecutionTime] = useState(null);
  const [productCount, setProductCount] = useState(null);

  const handleInputChange = (e) => {
    const searchQuery = e.target.value;
    setSearchText(searchQuery);

    if (debounceTimer) {
      clearTimeout(debounceTimer);
    }

    const newDebounceTimer = setTimeout(async () => {
      if (searchQuery.trim() === "") {
        return;
      }
      setLoading(true);
      let response;
      try {
        response = await search(searchQuery);
      } catch (error) {
        console.log(error);
        setSearchErrors(error.response.data.errors);
        setLoading(false);
      }
      setLoading(false);
      if (response && response.data) {
        console.log("LOADED PRODUCTS FOR SEARCH", searchQuery);
        let products = response.data;
        setExecutionTime(response.time);
        setProductCount(response.productCount);
        setProducts(products);
        setSearchErrors(response.errors);
      } else {
        console.log(response.errors);
        setSearchErrors(response.errors);
      }
    }, 650);

    setDebounceTimer(newDebounceTimer);
  };

  return (
    <div className="w-5/6 mx-auto p-5 pb-0">
      <input
        type="text"
        placeholder="Search here..."
        className="w-full px-4 py-2 text-2xl text-black font-semibold rounded-md border-2 border-gray-300 outline-none focus:border-teal-400 bg-white transition-all duration-300"
        value={searchText}
        onChange={handleInputChange}
      />
      <div>
        <ul className="text-red-500 font-semibold">
          {searchErrors.map((e, index) => (
            <li key={index}>* {e}</li>
          ))}
        </ul>
        <div className="flex gap-x-1">
          {executionTime && (
            <p className="text-gray-500 text-sm">
              Fetched in {executionTime} s{productCount && ","}
            </p>
          )}
          {productCount && (
            <p className="text-gray-500 text-sm">
              Found {productCount} products
            </p>
          )}
        </div>
      </div>
    </div>
  );
};

export default Searchbar;
