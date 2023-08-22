import React, { useState } from "react";
import { useLocation, useParams } from "react-router-dom";

const Product = () => {
  const { modelNumber } = useParams();
  const { state } = useLocation();
  const { productVariants } = state;

  const [selectedFilters, setSelectedFilters] = useState({});

  const handleFilterChange = (filterType, value) => {
    setSelectedFilters((prevFilters) => ({
      ...prevFilters,
      [filterType]: value,
    }));
  };

  const filteredProducts = productVariants.filter((product) => {
    return Object.entries(selectedFilters).every(([filterType, value]) => {
      if (value === "") {
        return true;
      }
      return product.variant[filterType] === value;
    });
  });

  const availableFilters = {};
  productVariants.forEach((product) => {
    Object.keys(product.variant).forEach((filterType) => {
      if (!availableFilters[filterType]) {
        availableFilters[filterType] = new Set();
      }
      availableFilters[filterType].add(product.variant[filterType]);
    });
  });

  return (
    <div className="p-8 bg-gray-100">
      <div className="flex mb-1 font-semibold text-gray-800 gap-x-4">
        {Object.entries(availableFilters).map(([filterType, values]) => (
          <select
            key={filterType}
            value={selectedFilters[filterType] || ""}
            onChange={(e) => handleFilterChange(filterType, e.target.value)}
            className="p-2 border rounded-md shadow-md focus:outline-none focus:border-cyan-500 transition-all duration-300 outline-none"
          >
            <option value="">{`Select ${filterType}`}</option>
            {Array.from(values).map((value) => (
              <option key={value} value={value}>
                {value}
              </option>
            ))}
          </select>
        ))}
      </div>
      <p className="px-1 mb-4 text-gray-500">
        Total : {productVariants.length}
      </p>
      <ul className="space-y-4">
        {filteredProducts.map((product) => (
          <li
            key={product._id}
            className="flex flex-col md:flex-row md:justify-between md:place-items-center p-4 border rounded-md shadow-md bg-white"
          >
            <div>
              <p className="text-xl font-semibold">{product.productTitle}</p>
              <p className="text-base font-semibold text-gray-600">
                {Object.entries(product.variant)
                  .map(
                    ([filterType, value]) =>
                      `${
                        filterType.charAt(0).toUpperCase() + filterType.slice(1)
                      }: ${value}`
                  )
                  .join(", ")}
              </p>
            </div>
            <div className="flex justify-between place-items-center">
              <button>-</button>
              <input
                type="number"
                name="quantity"
                id="quantity"
                className="w-10"
              />
              <button>+</button>
            </div>
          </li>
        ))}
      </ul>
    </div>
  );
};

export default Product;
