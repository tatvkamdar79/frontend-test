import React, { useContext, useState } from "react";
import {
  CartContext,
  GlobalDiscountContext,
  ViewSideCartContext,
} from "../App";
import { IoBagCheckOutline } from "react-icons/io5";
import { MdClose } from "react-icons/md";
import { BsCurrencyRupee } from "react-icons/bs";
import useCart from "../hooks/useCart";
import { FaMinus, FaPlus } from "react-icons/fa6";

const SideCart = () => {
  const { cart } = useContext(CartContext);
  const { globalDiscount, setGlobalDiscount } = useContext(
    GlobalDiscountContext
  );
  const { viewSideCart, setViewSideCart } = useContext(ViewSideCartContext);
  const {
    addProductToCart,
    getItemQuantityFromCart,
    removeProductFromCart,
    applyDiscountToItem,
    showFinalPriceForItem,
    showOriginalPriceForItem,
    applyGlobalDiscountToCart,
    getTotalPriceForCart,
    clearCart,
  } = useCart();

  const closeSideCart = () => {
    setViewSideCart(false);
  };
  const handleClearCart = () => {
    const shouldClear = window.confirm(
      "Are you sure you want to clear the cart?"
    );
    if (shouldClear) {
      clearCart();
    }
  };
  const getVariantDetails = (product) => {
    if (product.variant) {
      const variantFields = Object.keys(product.variant);
      variantFields.sort();
      const variantDetails = variantFields
        .map(
          (variantField) =>
            `${variantField.charAt(0).toUpperCase()}${variantField.slice(
              1
            )} : ${product.variant[variantField]}`
        )
        .join(", ");
      return variantDetails;
    }
  };
  return (
    <div
      className={`fixed top-0 right-0 h-screen w-[95%] nm:w-1/2 overflow-x-hidden bg-white transition-all duration-700 transform ${
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
            {cart.map(({ product, quantity, discount }) => (
              <li
                key={product._id}
                className="flex items-center justify-between border-b pb-2"
              >
                <div>
                  <p className="text-lg font-semibold">
                    {product.productTitle}
                  </p>
                  <p>{getVariantDetails(product)}</p>
                  <p className="text-gray-600">Quantity: {quantity}</p>
                  <div className="flex place-items-center text-xl text-gray-600">
                    <BsCurrencyRupee size={20} />
                    {showFinalPriceForItem(product) <
                    showOriginalPriceForItem(product) ? (
                      <p className="flex gap-x-2">
                        <s className="text-red-400 -rotate-12 decoration-1">
                          {showOriginalPriceForItem(product)}
                        </s>
                        <span className="font-semibold">
                          {showFinalPriceForItem(product)}
                        </span>
                      </p>
                    ) : (
                      <p className="font-semibold">
                        {showFinalPriceForItem(product)}
                      </p>
                    )}
                    {/* {product.mrp * quantity} */}
                  </div>
                  <p className="flex place-items-center text-xl text-red-600">
                    <input
                      type="number"
                      name="individualDiscount"
                      id="individualDiscount"
                      className="w-48 text-sm border-2 border-gray-300 rounded-md px-2 py-1 text-green-500 font-semibold outline-none focus:border-gray-500"
                      max={100}
                      min={0}
                      value={discount ? discount : null}
                      placeholder="Add Discount For Item %"
                      onChange={(e) => {
                        if (
                          parseFloat(e.target.value) &&
                          (parseFloat(e.target.value) > 100 ||
                            parseFloat(e.target.value) < 0)
                        ) {
                          return false;
                        }
                        if (e.target.value === "" || parseInt(e.target.value)) {
                          applyDiscountToItem(product, e.target.value);
                        }
                      }}
                    />
                  </p>
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
                    className="w-20 text-center border-2 rounded-md p-2 focus:border-amber-400 outline-none transition-all duration-300"
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
                  <button
                    className="text-red-500 hover:text-red-600 transition-all"
                    onClick={() => removeProductFromCart(product, quantity)}
                  >
                    Remove
                  </button>
                </div>
              </li>
            ))}
          </ul>
        )}
        {cart.length > 0 && (
          <>
            <div className="flex flex-col gap-x-2 mt-5">
              <p className="text-xl font-semibold text-gray-500">
                Total Discount
              </p>
              <input
                type="number"
                name="globalDiscount"
                id="globalDiscount"
                className="w-48 text-sm border-2 border-gray-300 rounded-md px-2 py-1 text-green-500 font-semibold outline-none focus:border-gray-500"
                max={100}
                min={0}
                value={globalDiscount}
                placeholder="Add Discount For Item %"
                onChange={(e) => {
                  if (e.target.value === "") {
                    setGlobalDiscount(null);
                  }
                  if (
                    parseFloat(e.target.value) &&
                    (parseFloat(e.target.value) > 100 ||
                      parseFloat(e.target.value) < 0)
                  ) {
                    return false;
                  }
                  setGlobalDiscount(parseFloat(e.target.value));
                }}
              />
            </div>
            <div className="h-0.5 w-full bg-gray-300 my-3" />
            <div className="w-full flex justify-between place-items-center gap-x-2">
              <p className="text-xl font-semibold text-gray-500">Total</p>
              <p className="flex place-items-center text-xl font-semibold text-gray-600">
                <BsCurrencyRupee size={20} />{" "}
                <span>{getTotalPriceForCart()}</span>
              </p>
            </div>
            <div className="w-full place-items-center gap-x-2">
              <div className="flex place-items-center justify-between">
                <p className="text-sm font-semibold text-gray-500">
                  + SGST (9%)
                </p>
                <p className="flex text-sm font-semibold text-gray-500">
                  <BsCurrencyRupee size={20} />{" "}
                  <span>{getTotalPriceForCart(9)}</span>
                </p>
              </div>
              <div className="flex place-items-center justify-between">
                <p className="text-sm font-semibold text-gray-500">
                  + CGST (9%)
                </p>
                <p className="flex text-sm font-semibold text-gray-500">
                  <BsCurrencyRupee size={20} />{" "}
                  <span>{getTotalPriceForCart(9)}</span>
                </p>
              </div>
            </div>
            <div className="h-0.5 w-full bg-gray-300 my-2" />
            <div className="h-0.5 w-full bg-gray-300 my-3" />
            <div className="w-full flex justify-between place-items-center gap-x-2">
              <p className="text-xl font-semibold text-gray-500">Final Price</p>
              <p className="flex place-items-center text-xl font-semibold text-gray-600">
                <BsCurrencyRupee size={20} />{" "}
                <span>{getTotalPriceForCart(18)}</span>
              </p>
            </div>

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
          </>
        )}
      </div>
    </div>
  );
};

export default SideCart;
