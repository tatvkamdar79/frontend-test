import React, { useContext } from "react";
import { CartContext, ViewSideCartContext } from "../App";
import { IoBagCheckOutline } from "react-icons/io5";
import { MdClose } from "react-icons/md";

const SideCart = () => {
  const { cart } = useContext(CartContext);
  const { viewSideCart, setViewSideCart } = useContext(ViewSideCartContext);
  console.log(cart);

  const closeSideCart = () => {
    setViewSideCart(false);
  };
  const handleClearCart = () => {
    // Implement a confirmation dialog before clearing the cart
    const shouldClear = window.confirm(
      "Are you sure you want to clear the cart?"
    );
  };

  return (
    <div
      className={`fixed top-0 right-0 h-screen lg:w-1/2 w-[70%] overflow-x-hidden bg-white transition-all duration-700 transform ${
        viewSideCart ? "translate-x-0" : "translate-x-full"
      } p-10 border-l-2 border-gray-400`}
    >
      <button className="absolute top-2 left-2" onClick={closeSideCart}>
        <MdClose size={40} className="text-red-500 hover:text-red-600" />
      </button>
      <div className="bg-white rounded-lg shadow-md p-8">
        <h1 className="flex place-items-center gap-x-2 text-3xl font-semibold mb-6">
          Your Cart <IoBagCheckOutline size={35} />
        </h1>
        {cart.length === 0 ? (
          <p className="text-lg text-gray-600">
            Oops! Looks like your cart is empty.
          </p>
        ) : (
          <ul className="space-y-3">
            {cart.map((item) => (
              <li
                key={item.product._id}
                className="flex items-center justify-between border-b pb-2"
              >
                <div>
                  <p className="text-lg font-semibold">
                    {item.product.productTitle}
                  </p>
                  <p className="text-gray-600">Quantity: {item.quantity}</p>
                </div>
                <button
                  className="text-red-500 hover:text-red-600 transition-all"
                  onClick={() =>
                    removeProductFromCart(item.product, item.quantity)
                  }
                >
                  Remove
                </button>
              </li>
            ))}
          </ul>
        )}
        <div className="flex justify-between mt-6">
          <button
            className="bg-blue-500 hover:bg-blue-600 text-white px-4 py-2 rounded-lg"
            // onClick={handleProceedToPayment}
            disabled={cart.length === 0}
          >
            Proceed to Payment
          </button>
          <button
            className="bg-red-500 hover:bg-red-600 text-white px-4 py-2 rounded-lg"
            onClick={handleClearCart}
            disabled={cart.length === 0}
          >
            Clear Cart
          </button>
        </div>
      </div>
    </div>
  );
};

export default SideCart;
