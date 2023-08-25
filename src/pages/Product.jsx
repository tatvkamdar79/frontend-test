import React, { useState } from "react";
import { useLocation, useParams } from "react-router-dom";
import { FaPlus, FaMinus } from "react-icons/fa6";
import useCart from "../hooks/useCart";

const Product = () => {
  const { modelNumber } = useParams();
  const { state } = useLocation();
  const { productVariants } = state;

  const [selectedFilters, setSelectedFilters] = useState({});
  const { addProductToCart, removeProductFromCart, getItemQuantityFromCart } =
    useCart();

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
    if (product.variant) {
      Object.keys(product.variant).forEach((filterType) => {
        if (!availableFilters[filterType]) {
          availableFilters[filterType] = new Set();
        }
        availableFilters[filterType].add(product.variant[filterType]);
      });
    }
  });

  return (
    <div className="h-screen flex flex-col md:flex-row p-8 bg-gray-100">
      <section className="w-11/12 mx-auto md:w-1/2 md:mx-0 md:order-none order-2">
        <div className="h-[90%] p-2 lg:p-5 border border-gray-600 rounded-md">
          <div className="flex mb-1 font-semibold text-gray-800 gap-x-4">
            {Object.entries(availableFilters) &&
              Object.entries(availableFilters).map(([filterType, values]) => (
                <select
                  key={filterType}
                  value={selectedFilters[filterType] || ""}
                  onChange={(e) =>
                    handleFilterChange(filterType, e.target.value)
                  }
                  className="p-2 border rounded-md shadow-md focus:outline-none focus:border-cyan-500 transition-all duration-300 outline-none"
                >
                  <option value="">{`Select ${filterType}`}</option>
                  {Array.from(values)
                    .sort((a, b) => a.localeCompare(b))
                    .map((value) => (
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
          <ul className="h-full space-y-4 overflow-y-scroll">
            {filteredProducts.map((product) => (
              <li
                key={product._id}
                className="flex flex-col md:flex-row md:justify-between md:place-items-center p-4 border rounded-md shadow-md bg-white"
              >
                <div>
                  <p className="text-xl font-semibold">
                    {product.productTitle}
                  </p>
                  <p className="text-lg font-semibold text-green-700">
                    ₹ {product.mrp}/-
                  </p>
                  <div className="text-base text-gray-600">
                    {product.variant &&
                      Object.entries(product.variant).map(
                        ([filterType, value]) => (
                          <p
                            className={`${
                              filterType === "color" && "text-gray-600"
                            } ${filterType === "size" && "text-gray-600"} ${
                              filterType === "material" && "text-gray-600"
                            } ${filterType === "style" && "text-gray-600"}`}
                          >
                            {filterType.charAt(0).toUpperCase() +
                              filterType.slice(1)}{" "}
                            : <span className="text-gray-800">{value}</span>
                          </p>
                        )
                      )}
                  </div>
                </div>
                <div className="flex justify-between gap-x-2 place-items-center">
                  <button onClick={() => addProductToCart(product, 1)}>
                    <FaPlus
                      size={25}
                      className="text-green-500 hover:text-green-600 transition-all"
                    />
                  </button>
                  <input
                    type="number"
                    name="quantity"
                    id="quantity"
                    className="w-14 text-center border-2 rounded-md p-2 focus:border-amber-400 outline-none transition-all duration-300"
                    value={getItemQuantityFromCart(product)}
                    onChange={(e) => {
                      if (e.target.value != "" && e.target.value >= 0) {
                        addProductToCart(product, e.target.value, true);
                      }
                    }}
                  />
                  <button onClick={() => removeProductFromCart(product, 1)}>
                    <FaMinus
                      size={25}
                      className="text-red-400 hover:text-red-600 transition-all"
                    />
                  </button>
                </div>
              </li>
            ))}
          </ul>
        </div>
      </section>
      <section className="w-11/12 md:w-1/2 mx-auto order-1 md:order-none">
        <p className="w-fit mx-auto mt-20 text-2xl font-semibold">
          No Image Found
        </p>
        <img
          src="https://i.pinimg.com/564x/21/61/ce/2161ce1698ee64e1d773704f83715d7b.jpg"
          alt=""
          className="w-5/6 mx-auto"
        />
      </section>
    </div>
  );
};

export default Product;
