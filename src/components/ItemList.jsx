import React, { useEffect } from "react";

const ItemList = ({ products }) => {
  useEffect(() => {
    console.log("PRODUCT CHANGED FORM ITEM LIST");
    // console.log(products);
  }, [products]);
  return (
    <div className="w-5/6 mx-auto">
      <ul className="w-full flex flex-col gap-y-3 text-white">
        {products.map((product) => (
          <li
            key={product._id}
            className="flex justify-between p-2 text-white text-2xl border-2 border-gray-500 rounded-md"
          >
            <p>{product.productTitle}</p>
            <div className="flex justify-start place-items-center gap-x-10 w-72 text-base">
              {product.variant.size && (
                <span className="text-cyan-500">
                  Size {product.variant.size}
                </span>
              )}
              {product.variant.color && (
                <span className="text-green-500">
                  Color {product.variant.color}
                </span>
              )}
            </div>
            <p className="flex place-items-center text-xl text-amber-400">
              ₹ {product.mrp}
            </p>
          </li>
        ))}
      </ul>
    </div>
  );
};

export default ItemList;
