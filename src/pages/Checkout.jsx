import React, { useContext } from "react";
import useCart from "../hooks/useCart";
import { CartContext } from "../App";

const Checkout = () => {
  const { cart, setCart } = useContext(CartContext);
  const { getItemQuantityFromCart, removeProductFromCart, clearCart } =
    useCart();

  const handleProceedToPayment = () => {
    // Implement your payment logic or navigate to the payment page
    // For example: history.push("/payment");
  };

  const handleClearCart = () => {
    // Implement a confirmation dialog before clearing the cart
    const shouldClear = window.confirm(
      "Are you sure you want to clear the cart?"
    );

    if (shouldClear) {
      clearCart();
    }
  };

  return (
    <div className="min-h-screen bg-gray-100 flex items-center justify-center">
      <div className="bg-white rounded-lg shadow-md p-8 w-full sm:w-3/4 md:w-2/3 lg:w-1/2">
        <h1 className="text-3xl font-semibold mb-6">Checkout</h1>
        {cart.length === 0 ? (
          <p className="text-gray-500">Your cart is empty.</p>
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
            onClick={handleProceedToPayment}
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

export default Checkout;
