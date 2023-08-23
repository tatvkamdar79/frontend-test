import React, { useContext, useEffect } from "react";
import { CartContext } from "../App";

export default function useCart() {
  const { cart, setCart } = useContext(CartContext);

  useEffect(() => {
    const storedCart = localStorage.getItem("cart");
    if (storedCart) {
      setCart(JSON.parse(storedCart));
    }
  }, []);

  useEffect(() => {
    // Save cart data to localStorage whenever cart changes
    localStorage.setItem("cart", JSON.stringify(cart));
    console.log(cart);
  }, [cart]);

  const addProductToCart = (product, quantity, manualEntry = false) => {
    const parsedQuantity = parseInt(quantity);
    if (parsedQuantity < 0) {
      return;
    }

    const existingProduct = cart.find(
      (item) => item.product._id === product._id
    );

    if (existingProduct) {
      const updatedCart = cart.map((item) => {
        if (item.product._id === product._id) {
          if (manualEntry) {
            return { ...item, quantity: parsedQuantity };
          }
          return { ...item, quantity: item.quantity + parsedQuantity };
        }
        return item;
      });

      setCart(updatedCart);
    } else {
      // Add the product to the cart with the provided quantity
      setCart([...cart, { product, quantity: parsedQuantity }]);
    }
  };

  const removeProductFromCart = (product, quantity) => {
    const updatedCart = cart
      .map((item) => {
        if (item.product._id === product._id) {
          const newQuantity = item.quantity - parseInt(quantity);

          if (newQuantity <= 0) {
            // Remove the product from the cart if quantity becomes zero or negative
            return null;
          }

          return { ...item, quantity: newQuantity };
        }
        return item;
      })
      .filter((item) => item !== null);

    setCart(updatedCart);
  };

  const getItemQuantityFromCart = (product) => {
    const cartItem = cart.find((item) => item.product._id === product._id);
    return cartItem ? cartItem.quantity : 0;
  };

  const clearCart = () => {
    setCart([]);
  };

  return {
    addProductToCart,
    removeProductFromCart,
    getItemQuantityFromCart,
    clearCart,
  };
}
