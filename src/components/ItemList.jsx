import React, { useEffect } from "react";
import { formatProductWithVariantsData } from "../utils/productUtils";
import { Link } from "react-router-dom";

const ItemList = ({ products, manage = false }) => {
  useEffect(() => {
    console.log("PRODUCT CHANGED FROM ITEM LIST");
    console.log(products);
  }, [products]);
  return (
    <div className="w-11/12 h-[68vh] mx-auto overflow-y-scroll">
      <ul className="w-full space-y-4">
        {Object.keys(products).map((modelNumber, index) => {
          let productData = formatProductWithVariantsData(
            products,
            modelNumber
          );
          console.log(index);

          return (
            <li
              key={index}
              className="p-4 bg-gray-100 rounded-md shadow-lg cursor-pointer hover:shadow-sm transition-all"
            >
              <Link
                to={`${
                  manage ? "/inventory/items/manage" : "/pos"
                }/${modelNumber}`}
                state={{ productVariants: products[modelNumber] }}
                className="flex flex-col md:flex-row md:justify-between md:place-items-center text-lg"
              >
                <div>
                  <p className="text-lg text-gray-800">
                    {productData?.productTitle}
                  </p>
                  <p className="text-sm font-semibold text-gray-600">
                    {productData?.variantCount} V
                  </p>
                  <p className="flex gap-x-2 text-sm font-semibold text-gray-600">
                    {productData?.materials &&
                      productData?.materials.length !== 0 && (
                        <span>
                          {productData?.materials.length}
                          <span className="text-[10px]">M</span>
                        </span>
                      )}
                    {productData?.sizes && productData?.sizes.length !== 0 && (
                      <span>
                        {productData?.sizes.length}
                        <span className="text-[10px]">S</span>
                      </span>
                    )}

                    {productData?.colors &&
                      productData?.colors.length !== 0 && (
                        <span>
                          {productData?.colors.length}
                          <span className="text-[10px]">C</span>
                        </span>
                      )}

                    {productData?.styles &&
                      productData?.styles.length !== 0 && (
                        <span>
                          {productData?.styles.length}
                          <span className="text-[10px]">S</span>t
                        </span>
                      )}
                  </p>
                </div>
                <p className="font-semibold mr-2">
                  ₹{" "}
                  <span className="text-green-500">
                    {productData?.minPrice}
                  </span>{" "}
                  -{" "}
                  <span className="text-orange-400">
                    {productData?.maxPrice}
                  </span>
                </p>
              </Link>
            </li>
          );
        })}
      </ul>
    </div>
  );
};

export default ItemList;
