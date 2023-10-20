import React, { useContext, useState } from "react";
import { CartContext, ViewSideCartContext } from "../App";
import { BsCurrencyRupee, BsFillCartCheckFill } from "react-icons/bs";
import { Link } from "react-router-dom";

const CartComponent = () => {
  const { cart } = useContext(CartContext);
  const { viewSideCart, setViewSideCart } = useContext(ViewSideCartContext);
  const totalItems = cart.reduce((total, item) => total + item.quantity, 0);

  return (
    <div
      to={"/pos/checkout"}
      className="w-full mx-auto flex justify-between place-items-center px-3 py-2.5 sm:py-3 bg-white border rounded-lg shadow-lg"
    >
      <div className="flex gap-x-5">
        <p className="flex gap-x-2 text-gray-600">
          <BsFillCartCheckFill size={25} />
          <span className="font-semibold">{totalItems}</span>
        </p>
        <p className="flex gap-x-1 text-gray-600">
          <BsCurrencyRupee size={25} />
          <span className="font-semibold">
            {cart.reduce(
              (total, item) => total + item.product.mrp * item.quantity,
              0
            )}
            /-
          </span>
        </p>
      </div>
      <button
        onClick={() => setViewSideCart(true)}
        className="bg-green-500 hover:bg-green-600 text-white px-2 py-1 rounded-md"
      >
        Cart
      </button>
    </div>
  );
};

export default CartComponent;
