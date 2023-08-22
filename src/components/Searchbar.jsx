import React, { useState } from "react";
import { search } from "../utils/utils.js";

const Searchbar = ({ setProducts, searchText, setSearchText, setLoading }) => {
  const [debounceTimer, setDebounceTimer] = useState(null);
  const [searchErrors, setSearchErrors] = useState([]);

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
      const response = await search(searchQuery);
      setLoading(false);
      if (response.data) {
        console.log("LOADED PRODUCTS FOR SEARCH", searchQuery);
        let products = response.data;
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
      <ul className="text-red-500 font-semibold">
        {searchErrors.map((e, index) => (
          <li key={index}>* {e}</li>
        ))}
      </ul>
    </div>
  );
};

export default Searchbar;
