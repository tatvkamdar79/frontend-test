import React, { useContext } from "react";
import { CartContext } from "../App";
import { Link } from "react-router-dom";

const CartComponent = () => {
  const { cart } = useContext(CartContext);
  const totalItems = cart.reduce((total, item) => total + item.quantity, 0);

  return (
    <div className="z-50 sticky w-full bottom-6 left-0 opacity-80 hover:opacity-100">
      <Link
        to={"/pos/checkout"}
        className="w-5/6 mx-auto flex justify-between place-items-center bg-white border-2 border-gray-300 rounded-lg shadow-lg px-4 py-3"
      >
        <div>
          <p className="text-gray-600">
            Items in Cart: <span className="font-semibold">{totalItems}</span>
          </p>
          <p className="text-gray-600">
            Total Price:{" "}
            <span className="font-semibold">
              ₹{" "}
              {cart.reduce(
                (total, item) => total + item.product.mrp * item.quantity,
                0
              )}
              /-
            </span>
          </p>
        </div>
        <button className="bg-green-500 hover:bg-green-600 text-white px-4 py-2 rounded-md">
          View Cart
        </button>
      </Link>
    </div>
  );
};

export default CartComponent;
