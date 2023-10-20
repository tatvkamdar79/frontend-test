import React, { useEffect, useState } from "react";
import { Link, useLocation, useParams } from "react-router-dom";
import { FaPlus, FaMinus } from "react-icons/fa6";
import useCart from "../hooks/useCart";
import { baseUrl } from "../utils/constants";

const Product = () => {
  const { modelNumber } = useParams();
  const { state } = useLocation();
  const { productVariants } = state;

  const [images, setImages] = useState([]);
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

  useEffect(() => {
    const tempImages = [];
    productVariants.forEach((p) =>
      p.images.forEach((image) => tempImages.push(image))
    );
    // console.log(tempImages);
    setImages(tempImages);
  }, []);

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
    <div className="w-full h-[92vh] flex flex-col md:flex-row mt-2 mx-auto bg-gray-100">
      <section className="h-full w-full nm:w-11/12 md:w-1/2 md:mx-0 px-2 md:order-none order-2">
        <div className="h-full p-1 lg:p-5 my-2">
          <div className="grid grid-cols-2 my-1 font-semibold text-gray-800 gap-2">
            {Object.entries(availableFilters) &&
              Object.entries(availableFilters).map(([filterType, values]) => (
                <select
                  key={filterType}
                  value={selectedFilters[filterType] || ""}
                  onChange={(e) =>
                    handleFilterChange(filterType, e.target.value)
                  }
                  className="p-2 bg-white border-2 border-gray-400 rounded-md shadow-md focus:outline-none focus:border-cyan-500 transition-all duration-300 outline-none"
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
          <div className="h-16 flex flex-col place-items-start justify-start mb-4">
            <p className="w-full px-1 my-2 text-gray-500">
              Total Variants : {productVariants.length}
            </p>
            <Link
              to={"/pos"}
              className="px-5 py-1 text-white font-semibold bg-gray-500"
            >
              Back
            </Link>
          </div>
          <ul className="h-full nm:h-[80vh] space-y-4 overflow-y-scroll">
            {filteredProducts.map((product, index) => (
              <li
                key={index}
                className="flex nm:flex-col md:flex-row justify-between place-items-center p-3 rounded-md shadow-md bg-white"
              >
                <div>
                  <p className="text-xl font-semibold">
                    {/* {product.productTitle} */}
                    {product.modelNumber}
                  </p>
                  <p className="text-lg font-semibold text-green-700">
                    ₹ {product.mrp}/-
                  </p>
                  <div className="text-base text-gray-600">
                    {product.variant &&
                      Object.entries(product.variant).map(
                        ([filterType, value], index) => (
                          <p
                            key={index}
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
                      className="text-gray-500 hover:text-gray-600 transition-all"
                    />
                  </button>
                  <input
                    type="number"
                    name="quantity"
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
                      className="text-gray-500 hover:text-gray-600 transition-all"
                    />
                  </button>
                </div>
              </li>
            ))}
          </ul>
        </div>
      </section>
      <section className="w-11/12 md:w-1/2 mx-auto order-1 md:order-none">
        {images.length === 0 ? (
          <>
            <p className="w-fit mx-auto mt-20 text-2xl font-semibold">
              No Image Availabe
            </p>
            <img
              src="https://i.pinimg.com/564x/21/61/ce/2161ce1698ee64e1d773704f83715d7b.jpg"
              alt=""
              className="w-5/6 mx-auto"
            />
          </>
        ) : (
          images.map((imgUrl, index) => (
            <img
              key={index}
              src={`${baseUrl}/${imgUrl}`}
              alt="Error Loading Image"
            />
          ))
        )}
      </section>
    </div>
  );
};

export default Product;
